-- The archive has one entry per email/campaign. Use unique accepted recipient
-- addresses for the denominator too, so duplicate leads and retries agree.
alter table public.crm_campaigns
  add column original_sent_count bigint default 0 check(original_sent_count>=0),
  add column bounce_history_complete boolean not null default true;

-- Earlier cleanup rewrote sent_count; it is not a reliable historical baseline.
update public.crm_campaigns set original_sent_count=null,bounce_history_complete=false;

create table crm_private.campaign_send_receipts (
  campaign_id bigint not null references public.crm_campaigns on delete cascade,
  email_hash bytea not null,
  recorded_at timestamptz not null default now(),
  primary key(campaign_id,email_hash)
);
alter table crm_private.campaign_send_receipts enable row level security;
revoke all on crm_private.campaign_send_receipts from public,anon,authenticated;
grant all on crm_private.campaign_send_receipts to service_role;

-- Seed receipts for surviving accepted recipients before installing triggers.
-- This prevents later delivery/open callbacks from counting them a second time.
insert into crm_private.campaign_send_receipts(campaign_id,email_hash)
select distinct r.campaign_id,crm_private.email_hash(e)
from public.crm_campaign_recipients r cross join lateral crm_private.email_tokens(r.email_sent_to) e
where coalesce(r.provider,'')<>'simulated'
  and (r.sent_at is not null or lower(coalesce(r.delivery_status,'')) in ('sent','delivered','opened','clicked','bounced','complained'))
on conflict do nothing;

-- The dedicated five-address live test is verified in the task runbook.
-- Match its provenance rather than hardcoding generated campaign IDs.
update public.crm_campaigns c set original_sent_count=5,bounce_history_complete=true
where c.campaign_name='CRM bounce cleanup live test - 22 Oct 2026'
  and (select count(*) from public.crm_campaigns where campaign_name=c.campaign_name)=1
  and (select count(*) from crm_private.campaign_send_receipts where campaign_id=c.campaign_id)=3
  and (select count(*) from crm_private.bounce_archive where source_campaign_id=c.campaign_id and source='confirmed_live_test')=2;

create function public.crm_record_campaign_send(p_campaign_id bigint,p_email text) returns boolean
language plpgsql security invoker set search_path='' as $$
declare inserted boolean;
begin
  if nullif(btrim(p_email),'') is null or strpos(p_email,'@')<2 then raise exception 'Recipient email is required'; end if;
  if not exists(select 1 from public.crm_campaigns where campaign_id=p_campaign_id) then return false; end if;
  insert into crm_private.campaign_send_receipts(campaign_id,email_hash)
  values(p_campaign_id,crm_private.email_hash(p_email)) on conflict do nothing;
  inserted:=found;
  if inserted then
    -- NULL remains NULL for incomplete historical campaigns.
    update public.crm_campaigns set original_sent_count=original_sent_count+1 where campaign_id=p_campaign_id;
  end if;
  return inserted;
end $$;

create function crm_private.capture_campaign_send() returns trigger
language plpgsql security definer set search_path='' as $$
declare address text;
begin
  if coalesce(new.provider,'')<>'simulated' and (new.sent_at is not null
    or lower(coalesce(new.delivery_status,'')) in ('sent','delivered','opened','clicked','bounced','complained')) then
    for address in select * from crm_private.email_tokens(new.email_sent_to) loop
      perform public.crm_record_campaign_send(new.campaign_id,address);
    end loop;
  end if;
  return new;
end $$;
create trigger crm_capture_original_send after insert or update of sent_at,delivery_status
on public.crm_campaign_recipients for each row execute function crm_private.capture_campaign_send();

create index if not exists bounce_archive_source_campaign_idx on crm_private.bounce_archive(source_campaign_id);

create function public.crm_campaign_bounce_metrics(p_campaign_ids bigint[])
returns table(campaign_id bigint,original_sent_count bigint,archived_bounce_count bigint,bounce_rate numeric,history_complete boolean)
language sql stable security invoker set search_path='' as $$
  with archived as (
    select source_campaign_id,count(distinct email_hash) as bounced
    from crm_private.bounce_archive where source_campaign_id=any(p_campaign_ids) group by source_campaign_id
  ), metrics as (
    select c.campaign_id,c.original_sent_count,coalesce(a.bounced,0) as bounced,
      c.bounce_history_complete and c.original_sent_count is not null
        and coalesce(a.bounced,0)<=c.original_sent_count as complete
    from public.crm_campaigns c left join archived a on a.source_campaign_id=c.campaign_id
    where c.campaign_id=any(p_campaign_ids)
  ) select campaign_id,original_sent_count,bounced,
    case when complete and original_sent_count>0 then round(100.0*bounced/original_sent_count,1) else null end,
    complete from metrics
$$;

revoke execute on function crm_private.capture_campaign_send() from public,anon,authenticated;
grant execute on function crm_private.capture_campaign_send() to service_role;
revoke all on function public.crm_record_campaign_send(bigint,text) from public,anon,authenticated;
revoke all on function public.crm_campaign_bounce_metrics(bigint[]) from public,anon,authenticated;
grant execute on function public.crm_record_campaign_send(bigint,text) to service_role;
grant execute on function public.crm_campaign_bounce_metrics(bigint[]) to service_role;
