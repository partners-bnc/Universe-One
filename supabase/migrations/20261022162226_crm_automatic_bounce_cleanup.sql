-- Permanent keyed suppression fingerprints; no readable email survives cleanup.
create schema if not exists crm_private;
revoke all on schema crm_private from public, anon, authenticated;
grant usage on schema crm_private to service_role;

do $$ begin
  if not exists(select 1 from vault.secrets where name='crm_bounce_hash_key') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'crm_bounce_hash_key');
  end if;
  if not exists(select 1 from vault.secrets where name='crm_bounce_webhook_secret') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(32),'hex'),'crm_bounce_webhook_secret');
  end if;
end $$;

create table crm_private.email_suppressions (
  email_hash bytea primary key,
  suppressed_at timestamptz not null default now()
);
create table crm_private.bounce_cleanup_queue (
  email_hash bytea primary key references crm_private.email_suppressions on delete cascade,
  campaign_id bigint references public.crm_campaigns on delete set null,
  queued_at timestamptz not null default now()
);
create table crm_private.bounce_cleanup_runs (
  id bigint generated always as identity primary key,
  completed_at timestamptz not null default now(),
  counts jsonb not null
);
alter table crm_private.email_suppressions enable row level security;
alter table crm_private.bounce_cleanup_queue enable row level security;
alter table crm_private.bounce_cleanup_runs enable row level security;

create function crm_private.email_hash(p_email text) returns bytea
language sql stable security definer set search_path='' as $$
  select extensions.hmac(lower(btrim(replace(p_email,chr(160),' '))),
    (select decrypted_secret from vault.decrypted_secrets where name='crm_bounce_hash_key'), 'sha256')
$$;

create function crm_private.email_tokens(p_value text) returns setof text
language sql immutable set search_path='' as $$
  select distinct btrim(v) from regexp_split_to_table(lower(replace(coalesce(p_value,''),chr(160),' ')), '[,;[:space:]]+') v
  where strpos(v,'@')>0
$$;

create function crm_private.lead_email_tokens(p_lead public.crm_leads) returns setof text
language sql immutable set search_path='' as $$
  select distinct token from (
    select p_lead.email v union all select p_lead.email_alt union all select p_lead.primary_business_email
    union all select jsonb_array_elements_text(case when jsonb_typeof(p_lead.additional_emails)='array' then p_lead.additional_emails else '[]'::jsonb end)
  ) f cross join lateral crm_private.email_tokens(f.v) token
$$;

create function crm_private.block_suppressed_lead() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  perform pg_advisory_xact_lock(640216221);
  if exists(select 1 from crm_private.lead_email_tokens(new) e
    join crm_private.email_suppressions s on s.email_hash=crm_private.email_hash(e)) then
    raise exception using errcode='23514',message='This lead contains a suppressed campaign email address';
  end if;
  return new;
end $$;
create trigger crm_block_suppressed_lead before insert or update of email,email_alt,primary_business_email,additional_emails
on public.crm_leads for each row execute function crm_private.block_suppressed_lead();

create function crm_private.block_suppressed_recipient() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  perform pg_advisory_xact_lock(640216221);
  if exists(select 1 from crm_private.email_tokens(new.email_sent_to) e
    join crm_private.email_suppressions s on s.email_hash=crm_private.email_hash(e))
  or exists(select 1 from public.crm_leads l cross join lateral crm_private.lead_email_tokens(l) e
    join crm_private.email_suppressions s on s.email_hash=crm_private.email_hash(e) where l.lead_id=new.lead_id) then
    raise exception using errcode='23514',message='Campaign recipient is suppressed';
  end if;
  return new;
end $$;
create trigger crm_block_suppressed_recipient before insert or update of email_sent_to,lead_id
on public.crm_campaign_recipients for each row execute function crm_private.block_suppressed_recipient();

-- Preserve the existing tracking implementation behind a service-only wrapper.
alter function public.record_crm_email_tracking_event(text,text,text,text,text,text,timestamptz,jsonb,bigint,bigint,bigint) set schema crm_private;

create function public.record_crm_email_tracking_event(
  p_provider text,p_event_fingerprint text,p_event_type text,p_email text default null,
  p_provider_message_id text default null,p_url text default null,p_occurred_at timestamptz default now(),
  p_payload jsonb default '{}'::jsonb,p_campaign_id bigint default null,
  p_recipient_id bigint default null,p_lead_id bigint default null
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.crm_campaign_recipients%rowtype; result jsonb; h bytea;
begin
  perform pg_advisory_xact_lock(640216221);
  if p_event_type='bounced' and coalesce(p_payload->>'crm_authenticated','false')<>'true' then
    return jsonb_build_object('ignored',true,'reason','unauthenticated_bounce');
  end if;
  if nullif(btrim(p_email),'') is null then return jsonb_build_object('ignored',true,'reason','missing_email'); end if;
  h:=crm_private.email_hash(p_email);
  if exists(select 1 from crm_private.email_suppressions where email_hash=h) then
    return jsonb_build_object('ignored',true,'reason','suppressed');
  end if;
  select * into r from public.crm_campaign_recipients c
  where lower(p_provider)=lower(c.provider)
    and exists(select 1 from crm_private.email_tokens(c.email_sent_to) e where e=lower(btrim(p_email)))
    and ((p_recipient_id is not null and c.recipient_id=p_recipient_id)
      or (p_provider_message_id is not null and c.provider_message_id=p_provider_message_id))
    and (p_campaign_id is null or c.campaign_id=p_campaign_id)
    and (p_lead_id is null or c.lead_id=p_lead_id)
  order by c.created_at desc limit 1;
  if r.recipient_id is null then return jsonb_build_object('ignored',true,'reason','unmatched_recipient'); end if;
  result:=crm_private.record_crm_email_tracking_event(p_provider,p_event_fingerprint,p_event_type,p_email,
    p_provider_message_id,p_url,p_occurred_at,p_payload,r.campaign_id,r.recipient_id,r.lead_id);
  if p_event_type='bounced' then
    insert into crm_private.email_suppressions(email_hash) values(h) on conflict do nothing;
    insert into crm_private.bounce_cleanup_queue(email_hash,campaign_id) values(h,r.campaign_id) on conflict do nothing;
  end if;
  return result;
end $$;

create function public.crm_verify_bounce_webhook_secret(p_secret text) returns boolean
language sql security definer set search_path='' as $$
  select coalesce(length(p_secret)>0 and extensions.digest(p_secret,'sha256')=
    extensions.digest((select decrypted_secret from vault.decrypted_secrets where name='crm_bounce_webhook_secret'),'sha256'),false)
$$;

create function public.crm_email_send_allowed(p_lead_id bigint,p_email text) returns boolean
language sql security invoker set search_path='' as $$
  select exists(select 1 from public.crm_leads l where l.lead_id=p_lead_id
    and exists(select 1 from crm_private.lead_email_tokens(l) e where e=lower(btrim(p_email)))
    and not exists(select 1 from crm_private.lead_email_tokens(l) e
      join crm_private.email_suppressions s on s.email_hash=crm_private.email_hash(e)))
$$;

create function public.crm_process_bounce_cleanup(p_limit integer default 100) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare hashes bytea[]; leads bigint[]; recipients bigint[]; followups bigint[]; campaigns bigint[];
  n_leads bigint; n_recipients bigint; n_events bigint; n_followups bigint; n_ed bigint; n_exp bigint;
  cid bigint; result jsonb;
begin
  if not pg_try_advisory_xact_lock(640216221) then return jsonb_build_object('busy',true); end if;
  select array_agg(q.email_hash) into hashes from (
    select q.email_hash from crm_private.bounce_cleanup_queue q
    left join public.crm_campaigns c on c.campaign_id=q.campaign_id
    where c.campaign_id is null or lower(c.status) in ('completed','paused','cancelled','failed')
    order by q.queued_at limit least(greatest(p_limit,1),100)
  ) q;
  if coalesce(cardinality(hashes),0)=0 then return jsonb_build_object('processed',0); end if;
  select array_agg(distinct l.lead_id) into leads from public.crm_leads l
  cross join lateral crm_private.lead_email_tokens(l) e where crm_private.email_hash(e)=any(hashes);
  select array_agg(recipient_id) into recipients from public.crm_campaign_recipients r
  where r.lead_id=any(leads) or exists(select 1 from crm_private.email_tokens(r.email_sent_to) e where crm_private.email_hash(e)=any(hashes));
  select array_agg(followup_id) into followups from public.crm_follow_ups f
  where f.lead_id=any(leads) or exists(select 1 from crm_private.email_tokens(f.email_sent_to) e where crm_private.email_hash(e)=any(hashes));
  select array_agg(distinct campaign_id) into campaigns from (
    select campaign_id from public.crm_campaign_recipients where recipient_id=any(recipients)
    union select campaign_id from public.crm_email_tracking_events
      where lead_id=any(leads) or recipient_id=any(recipients) or crm_private.email_hash(email)=any(hashes)
    union select campaign_id from public.crm_follow_ups where followup_id=any(followups)
  ) c where campaign_id is not null;
  delete from public.crm_email_tracking_events where lead_id=any(leads) or recipient_id=any(recipients) or crm_private.email_hash(email)=any(hashes);
  get diagnostics n_events=row_count;
  delete from public.crm_campaign_recipients where recipient_id=any(recipients); get diagnostics n_recipients=row_count;
  delete from public.crm_follow_ups where followup_id=any(followups); get diagnostics n_followups=row_count;
  delete from public.crm_lead_educations where lead_id=any(leads); get diagnostics n_ed=row_count;
  delete from public.crm_lead_experiences where lead_id=any(leads); get diagnostics n_exp=row_count;
  delete from public.crm_leads where lead_id=any(leads); get diagnostics n_leads=row_count;
  -- Erase mixed-recipient tracking payloads mentioning suppressed addresses too.
  delete from public.crm_email_tracking_events e where exists(
    select 1 from regexp_matches(lower(e.payload::text),'[a-z0-9.!#$%&''*+/=?^_\x60{|}~-]+@[a-z0-9.-]+','g') token
    where crm_private.email_hash(token[1])=any(hashes));
  get diagnostics cid=row_count; n_events:=n_events+cid;
  foreach cid in array coalesce(campaigns,'{}'::bigint[]) loop
    perform public.recalculate_crm_campaign_email_metrics(cid);
    update public.crm_campaigns c set total_recipients=(select count(*) from public.crm_campaign_recipients r where r.campaign_id=cid) where c.campaign_id=cid;
  end loop;
  delete from crm_private.bounce_cleanup_queue where email_hash=any(hashes);
  result:=jsonb_build_object('processed',cardinality(hashes),'leads_deleted',n_leads,'recipients_deleted',n_recipients,
    'events_deleted',n_events,'followups_deleted',n_followups,'educations_deleted',n_ed,'experiences_deleted',n_exp,
    'campaigns_recalculated',coalesce(cardinality(campaigns),0));
  insert into crm_private.bounce_cleanup_runs(counts) values(result);
  return result;
end $$;

create function crm_private.invoke_bounce_cleanup() returns bigint
language sql security definer set search_path='' as $$
  select net.http_post(
    url:=(select decrypted_secret from vault.decrypted_secrets where name='project_url')||'/functions/v1/crm-bounce-cleanup',
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(select decrypted_secret from vault.decrypted_secrets where name='service_role_key')),
    body:='{}'::jsonb,timeout_milliseconds:=10000)
$$;

create function crm_private.on_campaign_completed() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.status='Completed' and old.status is distinct from new.status then
    perform public.recalculate_crm_campaign_email_metrics(new.campaign_id);
    if exists(select 1 from crm_private.bounce_cleanup_queue where campaign_id=new.campaign_id) then
      perform crm_private.invoke_bounce_cleanup();
    end if;
  end if;
  return new;
end $$;
create trigger crm_cleanup_after_campaign after update of status on public.crm_campaigns
for each row execute function crm_private.on_campaign_completed();

-- Existing bounces (if any arrived during rollout) are picked up without waiting for replay.
insert into crm_private.email_suppressions(email_hash)
select distinct crm_private.email_hash(email_sent_to) from public.crm_campaign_recipients
where bounced_at is not null or lower(delivery_status)='bounced' on conflict do nothing;
insert into crm_private.bounce_cleanup_queue(email_hash,campaign_id)
select distinct on (crm_private.email_hash(email_sent_to)) crm_private.email_hash(email_sent_to),campaign_id
from public.crm_campaign_recipients where bounced_at is not null or lower(delivery_status)='bounced' on conflict do nothing;

revoke all on all tables in schema crm_private from public,anon,authenticated;
grant all on all tables in schema crm_private to service_role;
grant usage,select on all sequences in schema crm_private to service_role;
revoke execute on all functions in schema crm_private from public,anon,authenticated;
grant execute on all functions in schema crm_private to service_role;
revoke all on function public.record_crm_email_tracking_event(text,text,text,text,text,text,timestamptz,jsonb,bigint,bigint,bigint) from public,anon,authenticated;
revoke all on function public.crm_verify_bounce_webhook_secret(text) from public,anon,authenticated;
revoke all on function public.crm_email_send_allowed(bigint,text) from public,anon,authenticated;
revoke all on function public.crm_process_bounce_cleanup(integer) from public,anon,authenticated;
grant execute on function public.record_crm_email_tracking_event(text,text,text,text,text,text,timestamptz,jsonb,bigint,bigint,bigint) to service_role;
grant execute on function public.crm_verify_bounce_webhook_secret(text) to service_role;
grant execute on function public.crm_email_send_allowed(bigint,text) to service_role;
grant execute on function public.crm_process_bounce_cleanup(integer) to service_role;
select cron.schedule('crm-bounce-cleanup','*/5 * * * *','select crm_private.invoke_bounce_cleanup()');
