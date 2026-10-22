create table crm_private.bounce_archive (
  id bigint generated always as identity primary key,
  email text not null check(email=lower(btrim(email)) and strpos(email,'@')>1),
  email_hash bytea not null,
  campaign_id bigint references public.crm_campaigns on delete set null,
  source_campaign_id bigint,
  campaign_key text generated always as (coalesce(source_campaign_id::text,'unlinked')) stored,
  campaign_name text not null,
  subject text,
  bounce_type text not null check(bounce_type in ('hard','soft','unknown')),
  reason text not null,
  first_bounced_at timestamptz not null,
  last_bounced_at timestamptz not null,
  source text not null,
  provider_message_id text,
  unique(email_hash,campaign_key)
);
create index bounce_archive_campaign_idx on crm_private.bounce_archive(campaign_id);
create index bounce_archive_date_idx on crm_private.bounce_archive(last_bounced_at desc,id desc);
alter table crm_private.bounce_archive enable row level security;
revoke all on crm_private.bounce_archive from public,anon,authenticated;
grant all on crm_private.bounce_archive to service_role;
grant usage,select on sequence crm_private.bounce_archive_id_seq to service_role;

create function crm_private.archive_bounce(p_entry jsonb) returns void
language plpgsql security invoker set search_path='' as $$
declare address text:=lower(btrim(p_entry->>'email')); cid bigint; cname text; original_cid bigint;
  kind text:=coalesce(p_entry->>'bounce_type','unknown'); occurred timestamptz;
begin
  if address is null or address !~ '^[^@[:space:],;<>]+@[^@[:space:],;<>]+\.[^@[:space:],;<>]+$' or length(address)>320 then
    raise exception 'Invalid bounce archive email';
  end if;
  if kind not in ('hard','soft','unknown') then raise exception 'Invalid bounce type'; end if;
  original_cid:=nullif(p_entry->>'campaign_id','')::bigint;
  select campaign_id,campaign_name into cid,cname from public.crm_campaigns where campaign_id=original_cid;
  occurred:=coalesce(nullif(p_entry->>'bounced_at','')::timestamptz,now());
  insert into crm_private.bounce_archive as existing(
    email,email_hash,campaign_id,source_campaign_id,campaign_name,subject,bounce_type,reason,
    first_bounced_at,last_bounced_at,source,provider_message_id)
  values(address,crm_private.email_hash(address),cid,original_cid,
    coalesce(cname,case when original_cid is not null then 'Campaign #'||original_cid else 'Unlinked email' end),
    left(p_entry->>'subject',1000),kind,left(coalesce(nullif(p_entry->>'reason',''),'Not retained'),4000),
    occurred,occurred,coalesce(p_entry->>'source','webhook'),p_entry->>'provider_message_id')
  on conflict(email_hash,campaign_key) do update set
    campaign_id=coalesce(excluded.campaign_id,existing.campaign_id),
    campaign_name=case when excluded.campaign_id is not null then excluded.campaign_name else existing.campaign_name end,
    subject=coalesce(excluded.subject,existing.subject),
    bounce_type=case when existing.bounce_type='hard' or excluded.bounce_type='hard' then 'hard'
      when existing.bounce_type='soft' or excluded.bounce_type='soft' then 'soft' else 'unknown' end,
    reason=case when (existing.bounce_type<>'hard' or excluded.bounce_type='hard')
      and excluded.last_bounced_at>=existing.last_bounced_at and excluded.reason<>'Not retained'
      then excluded.reason else existing.reason end,
    first_bounced_at=least(existing.first_bounced_at,excluded.first_bounced_at),
    last_bounced_at=greatest(existing.last_bounced_at,excluded.last_bounced_at);
end $$;

create function public.crm_import_bounce_archive(p_entries jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare item jsonb; h bytea; cid bigint; n integer:=0;
begin
  if jsonb_typeof(p_entries)<>'array' or jsonb_array_length(p_entries)>1000 then raise exception 'Expected at most 1000 bounce entries'; end if;
  perform pg_advisory_xact_lock(640216221);
  for item in select value from jsonb_array_elements(p_entries) loop
    perform crm_private.archive_bounce(item);
    h:=crm_private.email_hash(item->>'email');
    select campaign_id into cid from public.crm_campaigns where campaign_id=nullif(item->>'campaign_id','')::bigint;
    insert into crm_private.email_suppressions(email_hash) values(h) on conflict do nothing;
    insert into crm_private.bounce_cleanup_queue(email_hash,campaign_id) values(h,cid) on conflict do nothing;
    n:=n+1;
  end loop;
  return jsonb_build_object('processed',n,'archive_rows',(select count(*) from crm_private.bounce_archive));
end $$;

create or replace function public.record_crm_email_tracking_event(
  p_provider text,p_event_fingerprint text,p_event_type text,p_email text default null,
  p_provider_message_id text default null,p_url text default null,p_occurred_at timestamptz default now(),
  p_payload jsonb default '{}'::jsonb,p_campaign_id bigint default null,
  p_recipient_id bigint default null,p_lead_id bigint default null
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.crm_campaign_recipients%rowtype; result jsonb; h bytea; meta jsonb;
begin
  perform pg_advisory_xact_lock(640216221);
  if p_event_type='bounced' and coalesce(p_payload->>'crm_authenticated','false')<>'true' then
    return jsonb_build_object('ignored',true,'reason','unauthenticated_bounce');
  end if;
  if nullif(btrim(p_email),'') is null then return jsonb_build_object('ignored',true,'reason','missing_email'); end if;
  h:=crm_private.email_hash(p_email);
  select * into r from public.crm_campaign_recipients c
  where lower(p_provider)=lower(c.provider)
    and exists(select 1 from crm_private.email_tokens(c.email_sent_to) e where e=lower(btrim(p_email)))
    and ((p_recipient_id is not null and c.recipient_id=p_recipient_id)
      or (p_provider_message_id is not null and c.provider_message_id=p_provider_message_id))
    and (p_campaign_id is null or c.campaign_id=p_campaign_id)
    and (p_lead_id is null or c.lead_id=p_lead_id)
  order by c.created_at desc limit 1;
  -- Archive before the suppression check so authenticated late bounces survive.
  if p_event_type='bounced' and (r.recipient_id is not null or p_campaign_id is not null) then
    meta:=coalesce(p_payload->'crm_bounce_metadata','{}'::jsonb);
    perform crm_private.archive_bounce(jsonb_build_object('email',p_email,'campaign_id',coalesce(r.campaign_id,p_campaign_id),
      'bounce_type',coalesce(meta->>'bounce_type',case when lower(p_payload->>'raw_event_name') like '%hard%' then 'hard'
        when lower(p_payload->>'raw_event_name') like '%soft%' then 'soft' else 'unknown' end),
      'reason',meta->>'reason','bounced_at',p_occurred_at,'subject',meta->>'subject','source','webhook',
      'provider_message_id',p_provider_message_id));
  end if;
  if exists(select 1 from crm_private.email_suppressions where email_hash=h) then
    return jsonb_build_object('ignored',true,'reason','suppressed');
  end if;
  if r.recipient_id is null then return jsonb_build_object('ignored',true,'reason','unmatched_recipient'); end if;
  result:=crm_private.record_crm_email_tracking_event(p_provider,p_event_fingerprint,p_event_type,p_email,
    p_provider_message_id,p_url,p_occurred_at,p_payload,r.campaign_id,r.recipient_id,r.lead_id);
  if p_event_type='bounced' then
    insert into crm_private.email_suppressions(email_hash) values(h) on conflict do nothing;
    insert into crm_private.bounce_cleanup_queue(email_hash,campaign_id) values(h,r.campaign_id) on conflict do nothing;
  end if;
  return result;
end $$;

create function public.crm_list_bounce_archive(p_search text default '',p_campaign text default '',p_type text default '',
  p_page integer default 1,p_limit integer default 50) returns jsonb
language sql stable security invoker set search_path='' as $$
  with filtered as materialized (
    select id,email,campaign_id,source_campaign_id,campaign_name,subject,bounce_type,reason,last_bounced_at as bounced_at
    from crm_private.bounce_archive
    where (coalesce(p_search,'')='' or strpos(email,lower(btrim(p_search)))>0)
      and (coalesce(p_campaign,'')='' or campaign_key=p_campaign)
      and (coalesce(p_type,'')='' or bounce_type=p_type)
  ), paged as (
    select * from filtered order by bounced_at desc,id desc
    limit least(greatest(p_limit,1),100) offset (greatest(p_page,1)-1)*least(greatest(p_limit,1),100)
  ) select jsonb_build_object('rows',coalesce((select jsonb_agg(to_jsonb(p) order by p.bounced_at desc,p.id desc) from paged p),'[]'::jsonb),
    'total',(select count(*) from filtered),'archive_total',(select count(*) from crm_private.bounce_archive),
    'unique_emails',(select count(distinct email_hash) from crm_private.bounce_archive),
    'campaigns',coalesce((select jsonb_agg(to_jsonb(c) order by c.name) from (
      select campaign_key as id,max(campaign_name) as name from crm_private.bounce_archive group by campaign_key
    ) c),'[]'::jsonb))
$$;

revoke execute on function crm_private.archive_bounce(jsonb) from public,anon,authenticated;
grant execute on function crm_private.archive_bounce(jsonb) to service_role;
revoke all on function public.crm_import_bounce_archive(jsonb) from public,anon,authenticated;
revoke all on function public.crm_list_bounce_archive(text,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.crm_import_bounce_archive(jsonb) to service_role;
grant execute on function public.crm_list_bounce_archive(text,text,text,integer,integer) to service_role;
