-- Only versioned campaigns are enrolled. Historical campaigns are never activated.
alter table public.crm_campaigns
  add column schedule_timezone text not null default 'Asia/Kolkata' check(schedule_timezone='Asia/Kolkata'),
  add column batching_enabled boolean not null default false,
  add column first_batch_size integer check(first_batch_size>0),
  add column repeat_batch_size integer check(repeat_batch_size>0),
  add column batch_interval_minutes integer check(batch_interval_minutes>0),
  add column scheduler_version integer,
  add column next_run_at timestamptz,
  add column batch_number integer not null default 0,
  add column batch_total integer not null default 0,
  add column batch_processed integer not null default 0,
  add column failed_count integer not null default 0,
  add column skipped_count integer not null default 0,
  add column last_error text,
  add constraint crm_campaign_batch_config check(not batching_enabled or
    (first_batch_size is not null and repeat_batch_size is not null and batch_interval_minutes is not null));

create index crm_campaigns_due_idx on public.crm_campaigns(next_run_at,campaign_id)
  where scheduler_version=1 and status in ('Running','Scheduled');

create table crm_private.campaign_runs (
  campaign_id bigint primary key references public.crm_campaigns on delete cascade,
  subject text not null,
  body text not null,
  email_format text not null check(email_format in ('html','text')),
  lease_token uuid,
  lease_until timestamptz
);
create table crm_private.campaign_batches (
  campaign_id bigint not null references public.crm_campaigns on delete cascade,
  batch_number integer not null,
  total integer not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  primary key(campaign_id,batch_number)
);
create table crm_private.campaign_send_jobs (
  id bigint generated always as identity primary key,
  campaign_id bigint not null references public.crm_campaigns on delete cascade,
  lead_id bigint references public.crm_leads on delete set null,
  recipient_id bigint references public.crm_campaign_recipients on delete set null,
  email text,
  email_hash bytea not null,
  lead_snapshot jsonb not null,
  batch_number integer,
  state text not null default 'Pending' check(state in ('Pending','Claimed','Sending','Retry','Sent','Failed','Skipped','Uncertain')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  attempt_token uuid,
  last_error text,
  unique(campaign_id,email_hash)
);
create index crm_campaign_jobs_due_idx on crm_private.campaign_send_jobs(campaign_id,batch_number,available_at,id)
  where state in ('Pending','Retry','Claimed','Sending');
create index crm_campaign_jobs_lead_idx on crm_private.campaign_send_jobs(lead_id);
create index crm_campaign_jobs_recipient_idx on crm_private.campaign_send_jobs(recipient_id);
alter table crm_private.campaign_runs enable row level security;
alter table crm_private.campaign_batches enable row level security;
alter table crm_private.campaign_send_jobs enable row level security;
revoke all on crm_private.campaign_runs,crm_private.campaign_batches,crm_private.campaign_send_jobs from public,anon,authenticated;
grant all on crm_private.campaign_runs,crm_private.campaign_batches,crm_private.campaign_send_jobs to service_role;
grant usage,select on sequence crm_private.campaign_send_jobs_id_seq to service_role;

-- Cleanup may delete bounced leads/recipients while a worker is processing.
-- Do not retain readable lead data in this private queue after lead deletion.
create function crm_private.scrub_campaign_job() returns trigger
language plpgsql set search_path='' as $$
begin
  if new.lead_id is null then
    new.email:=null; new.lead_snapshot:='{}';
    if new.state in ('Pending','Retry','Claimed') then new.state:='Skipped'; end if;
  end if;
  return new;
end $$;
create trigger crm_scrub_campaign_job before update of lead_id on crm_private.campaign_send_jobs
for each row execute function crm_private.scrub_campaign_job();

-- Match server-side filters for API callers; explicit reviewed IDs take precedence,
-- including an empty array, which must never expand into the entire CRM.
create function crm_private.campaign_lead_matches(p_lead jsonb,p_filter jsonb) returns boolean
language plpgsql stable set search_path='' as $$
declare k text; v jsonb; item text; sources text[]; tags text[];
begin
  if p_filter ? 'target_lead_ids' then
    return exists(select 1 from jsonb_array_elements_text(p_filter->'target_lead_ids') x where x=p_lead->>'lead_id');
  end if;
  if coalesce(p_filter->>'selected_list_id','')<>'' then
    select selected_sources,selected_tags into sources,tags from public.crm_lists
      where list_id=(p_filter->>'selected_list_id')::bigint;
    if not found then raise exception 'Selected audience list no longer exists'; end if;
    return (coalesce(cardinality(sources),0)=0 or exists(select 1 from unnest(sources) s
      where lower(btrim(s))=any(regexp_split_to_array(lower(coalesce(p_lead->>'lead_source','')),'\s*,\s*'))))
      and (coalesce(cardinality(tags),0)=0 or exists(select 1 from unnest(tags) t
      where lower(btrim(t))=any(regexp_split_to_array(lower(coalesce(p_lead->>'tags','')),'\s*,\s*'))));
  end if;
  for k,v in select * from jsonb_each(p_filter) loop
    if k in ('manually_included_ids','manually_excluded_ids') or v='null'::jsonb or v='[]'::jsonb or v='""'::jsonb then continue; end if;
    if jsonb_typeof(v)='array' then
      if not exists(select 1 from jsonb_array_elements_text(v) x where
        case when k='lead_source' then lower(x)=any(regexp_split_to_array(lower(coalesce(p_lead->>k,'')),'\s*,\s*'))
        else lower(x)=lower(coalesce(p_lead->>k,'')) end) then return false; end if;
    elsif k='tags' then
      if position(lower(v#>>'{}') in lower(coalesce(p_lead->>k,'')))=0 then return false; end if;
    elsif lower(v#>>'{}')<>lower(coalesce(p_lead->>k,'')) then return false;
    end if;
  end loop;
  return true;
end $$;

create function crm_private.enroll_campaign(p_id bigint) returns void
language plpgsql set search_path='' as $$
declare c public.crm_campaigns%rowtype; t public.crm_email_templates%rowtype; n integer;
begin
  select * into strict c from public.crm_campaigns where campaign_id=p_id for update;
  if c.scheduler_version is not null then return; end if;
  if c.scheduled_at is not null and c.scheduled_at<=now() then raise exception 'Scheduled time must be in the future'; end if;
  select * into strict t from public.crm_email_templates where id=c.template_id;
  insert into crm_private.campaign_runs(campaign_id,subject,body,email_format)
    values(p_id,coalesce(t.subject,''),case when c.email_format='text' then coalesce(t.plain_text_body,'') else coalesce(t.html_body,'') end,c.email_format);
  insert into crm_private.campaign_send_jobs(campaign_id,lead_id,email,email_hash,lead_snapshot)
  select distinct on (lower(btrim(address))) p_id, l.lead_id,lower(btrim(address)),crm_private.email_hash(address),to_jsonb(l)
  from public.crm_leads l
  cross join lateral (select coalesce(nullif(btrim(l.email),''),nullif(btrim(l.primary_business_email),''),nullif(btrim(l.email_alt),'')) address) a
  where address is not null and public.crm_email_send_allowed(l.lead_id,address)
    and not exists(select 1 from public.crm_campaign_recipients r where r.unsubscribed
      and (r.lead_id=l.lead_id or lower(btrim(r.email_sent_to))=lower(btrim(address))))
    and case when c.target_filter ? 'target_lead_ids' then
      l.lead_id in (select x::bigint from jsonb_array_elements_text(c.target_filter->'target_lead_ids') x)
      else crm_private.campaign_lead_matches(to_jsonb(l),c.target_filter) end
  order by lower(btrim(address)),l.lead_id;
  -- Inserts and enrollment are one transaction: no partially prepared campaigns.
  with inserted as (
    insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status)
    select campaign_id,lead_id,email,'zeptomail','Pending' from crm_private.campaign_send_jobs where campaign_id=p_id
    returning recipient_id,lead_id
  ) update crm_private.campaign_send_jobs j set recipient_id=i.recipient_id from inserted i
    where j.campaign_id=p_id and j.lead_id=i.lead_id;
  select count(*) into n from crm_private.campaign_send_jobs where campaign_id=p_id;
  update public.crm_campaigns set scheduler_version=1,total_recipients=n,
    next_run_at=case when n>0 then coalesce(c.scheduled_at,now()) end,
    status=case when n=0 then 'Completed' when c.scheduled_at is not null then 'Scheduled' else 'Running' end,
    completed_at=case when n=0 then now() end where campaign_id=p_id;
end $$;

-- The API authenticates users; only its service role can invoke these RPCs.
create function public.crm_save_campaign(p_config jsonb,p_campaign_id bigint default null) returns public.crm_campaigns
language plpgsql security invoker set search_path='' as $$
declare c public.crm_campaigns%rowtype; requested text:=coalesce(p_config->>'status','Draft');
begin
  if requested not in ('Draft','Running','Scheduled','Paused') then raise exception 'Unsupported campaign status'; end if;
  if p_campaign_id is null then
    if requested='Paused' then raise exception 'Cannot create a paused campaign'; end if;
    insert into public.crm_campaigns(campaign_name,campaign_type,template_id,email_format,target_filter,status,scheduled_at,
      created_by,schedule_timezone,batching_enabled,first_batch_size,repeat_batch_size,batch_interval_minutes)
    values(p_config->>'campaign_name',coalesce(p_config->>'campaign_type','Email'),(p_config->>'template_id')::bigint,
      coalesce(p_config->>'email_format','html'),coalesce(p_config->'target_filter','{}'),requested,(p_config->>'scheduled_at')::timestamptz,
      p_config->>'created_by','Asia/Kolkata',coalesce((p_config->>'batching_enabled')::boolean,false),
      (p_config->>'first_batch_size')::integer,(p_config->>'repeat_batch_size')::integer,(p_config->>'batch_interval_minutes')::integer)
    returning * into c;
  else
    select * into strict c from public.crm_campaigns where campaign_id=p_campaign_id for update;
    requested:=coalesce(p_config->>'status',c.status);
    if c.scheduler_version=1 then
      if not (p_config ? 'status') and not exists(select 1 from jsonb_object_keys(p_config) k where k<>'campaign_name') then
        update public.crm_campaigns set campaign_name=coalesce(p_config->>'campaign_name',campaign_name) where campaign_id=c.campaign_id returning * into c;
        return c;
      end if;
      if c.status='Completed' or requested not in ('Running','Paused') then raise exception 'Campaign cannot make that status transition'; end if;
      if exists(select 1 from jsonb_object_keys(p_config) k where k not in ('status','campaign_name')) then
        raise exception 'Audience, template and schedule are locked after launch'; end if;
      if requested='Running' and exists(select 1 from crm_private.campaign_send_jobs where campaign_id=c.campaign_id and state='Uncertain') then
        raise exception 'Reconcile uncertain sends before resuming this campaign'; end if;
      update public.crm_campaigns set status=requested,campaign_name=coalesce(p_config->>'campaign_name',campaign_name),
        next_run_at=case when requested='Running' then greatest(coalesce(next_run_at,now()),now()) else next_run_at end,
        last_error=case when requested='Running' then null else last_error end where campaign_id=c.campaign_id returning * into c;
      return c;
    end if;
    if c.status<>'Draft' then
      if exists(select 1 from jsonb_object_keys(p_config) k where k<>'campaign_name') then
        raise exception 'Historical campaigns require explicit migration before activation'; end if;
      update public.crm_campaigns set campaign_name=coalesce(p_config->>'campaign_name',campaign_name) where campaign_id=c.campaign_id returning * into c;
      return c;
    end if;
    update public.crm_campaigns set campaign_name=coalesce(p_config->>'campaign_name',campaign_name),
      campaign_type=coalesce(p_config->>'campaign_type',campaign_type),template_id=coalesce((p_config->>'template_id')::bigint,template_id),
      email_format=coalesce(p_config->>'email_format',email_format),target_filter=coalesce(p_config->'target_filter',target_filter),status=requested,
      scheduled_at=case when p_config ? 'scheduled_at' then (p_config->>'scheduled_at')::timestamptz else scheduled_at end,
      batching_enabled=coalesce((p_config->>'batching_enabled')::boolean,batching_enabled),
      first_batch_size=case when p_config ? 'first_batch_size' then (p_config->>'first_batch_size')::integer else first_batch_size end,
      repeat_batch_size=case when p_config ? 'repeat_batch_size' then (p_config->>'repeat_batch_size')::integer else repeat_batch_size end,
      batch_interval_minutes=case when p_config ? 'batch_interval_minutes' then (p_config->>'batch_interval_minutes')::integer else batch_interval_minutes end
      where campaign_id=c.campaign_id returning * into c;
  end if;
  if requested in ('Running','Scheduled') then perform crm_private.enroll_campaign(c.campaign_id); end if;
  select * into c from public.crm_campaigns where campaign_id=c.campaign_id;
  return c;
end $$;

create function crm_private.invoke_campaign_function(p_name text,p_body jsonb default '{}') returns bigint
language sql security definer set search_path='' as $$
  select net.http_post(
    url:=(select decrypted_secret from vault.decrypted_secrets where name='project_url')||'/functions/v1/'||p_name,
    headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||
      (select decrypted_secret from vault.decrypted_secrets where name='service_role_key')),
    body:=p_body,timeout_milliseconds:=70000)
$$;
create function public.crm_request_campaign_dispatch() returns bigint
language sql security invoker set search_path='' as $$
  select crm_private.invoke_campaign_function('crm-campaign-dispatcher')
$$;
create function public.crm_dispatch_campaigns() returns integer
language plpgsql security invoker set search_path='' as $$
declare r record; token uuid; n integer:=0; capacity integer;
begin
  if not pg_try_advisory_xact_lock(640216224) then return 0; end if;
  select greatest(0,4-count(*)) into capacity from crm_private.campaign_runs where lease_until>now();
  for r in select c.campaign_id from public.crm_campaigns c join crm_private.campaign_runs x using(campaign_id)
    where c.scheduler_version=1 and c.status in ('Running','Scheduled') and c.next_run_at<=now()
      and (x.lease_until is null or x.lease_until<now())
    order by c.next_run_at,c.campaign_id limit capacity for update of c skip locked loop
    token:=gen_random_uuid();
    update crm_private.campaign_runs set lease_token=token,lease_until=now()+interval '2 minutes' where campaign_id=r.campaign_id;
    perform crm_private.invoke_campaign_function('crm-campaign-send',jsonb_build_object('campaign_id',r.campaign_id,'lease_token',token));
    n:=n+1;
  end loop;
  return n;
end $$;

create function public.crm_claim_campaign_chunk(p_campaign_id bigint,p_token uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare c public.crm_campaigns%rowtype; run crm_private.campaign_runs%rowtype; jobs jsonb; n integer;
begin
  select * into c from public.crm_campaigns where campaign_id=p_campaign_id for update;
  select * into run from crm_private.campaign_runs where campaign_id=p_campaign_id;
  if c.status not in ('Running','Scheduled') or run.lease_token is distinct from p_token or run.lease_until<=now() then return '[]'; end if;
  -- A prior worker may have died after starting an HTTP request. Never blindly resend.
  update crm_private.campaign_send_jobs set state='Uncertain',last_error='Worker stopped after provider request started'
    where campaign_id=p_campaign_id and state='Sending' and attempt_token is distinct from p_token;
  if exists(select 1 from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and state='Uncertain') then
    update public.crm_campaigns set status='Paused',last_error='Delivery uncertain: reconcile provider acceptance before resuming' where campaign_id=p_campaign_id;
    return '[]';
  end if;
  update crm_private.campaign_send_jobs set state='Pending',attempt_token=null
    where campaign_id=p_campaign_id and state='Claimed';
  if not exists(select 1 from crm_private.campaign_batches where campaign_id=p_campaign_id and finished_at is null) then
    update public.crm_campaigns set batch_number=batch_number+1,launched_at=coalesce(launched_at,now()),status='Running' where campaign_id=p_campaign_id returning * into c;
    with picked as (select id from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and batch_number is null and state='Pending'
      order by id limit case when not c.batching_enabled then 2147483647 when c.batch_number=1 then c.first_batch_size else c.repeat_batch_size end)
    update crm_private.campaign_send_jobs j set batch_number=c.batch_number from picked where j.id=picked.id;
    get diagnostics n=row_count;
    insert into crm_private.campaign_batches(campaign_id,batch_number,total) values(p_campaign_id,c.batch_number,n);
    update public.crm_campaigns set batch_total=n,batch_processed=0 where campaign_id=p_campaign_id;
  end if;
  with picked as (select id from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and batch_number=c.batch_number
    and state in ('Pending','Retry') and available_at<=now() order by id limit 100 for update skip locked),
  claimed as (update crm_private.campaign_send_jobs j set state='Claimed',attempt_token=p_token from picked where j.id=picked.id
    returning j.id,j.lead_snapshot,j.email,j.recipient_id,j.lead_id)
  select coalesce(jsonb_agg(to_jsonb(claimed)),'[]') into jobs from claimed;
  return jsonb_build_object('jobs',jobs,'subject',run.subject,'body',run.body,'format',run.email_format);
end $$;

create function public.crm_begin_campaign_send(p_job_id bigint,p_token uuid) returns boolean
language plpgsql security invoker set search_path='' as $$
declare j crm_private.campaign_send_jobs%rowtype; cid bigint;
begin
  select campaign_id into cid from crm_private.campaign_send_jobs where id=p_job_id;
  -- Always lock campaign before work, matching claim/finalize to avoid deadlocks.
  perform 1 from public.crm_campaigns where campaign_id=cid and status='Running' for update;
  if not found then return false; end if;
  select * into j from crm_private.campaign_send_jobs where id=p_job_id for update;
  if j.state<>'Claimed' or j.attempt_token is distinct from p_token or not exists(select 1 from crm_private.campaign_runs
    where campaign_id=cid and lease_token=p_token and lease_until>now()) then return false; end if;
  if j.email is null or j.lead_id is null or j.recipient_id is null or not public.crm_email_send_allowed(j.lead_id,j.email)
    or exists(select 1 from public.crm_campaign_recipients r where r.unsubscribed and
      (r.lead_id=j.lead_id or lower(btrim(r.email_sent_to))=j.email)) then
    update crm_private.campaign_send_jobs set state='Skipped',lead_snapshot='{}',email=null where id=p_job_id;
    update public.crm_campaign_recipients set delivery_status='Skipped' where recipient_id=j.recipient_id;
    return false;
  end if;
  update crm_private.campaign_send_jobs set state='Sending',attempts=attempts+1 where id=p_job_id;
  return true;
end $$;

create function public.crm_finish_campaign_send(p_job_id bigint,p_token uuid,p_outcome text,p_provider_id text default null,p_delay_seconds integer default 60)
returns void language plpgsql security invoker set search_path='' as $$
declare j crm_private.campaign_send_jobs%rowtype; cid bigint; inserted boolean;
begin
  if p_outcome not in ('Sent','Retry','Failed','Uncertain') then raise exception 'Invalid send outcome'; end if;
  select campaign_id into cid from crm_private.campaign_send_jobs where id=p_job_id;
  perform 1 from public.crm_campaigns where campaign_id=cid for update;
  select * into j from crm_private.campaign_send_jobs where id=p_job_id for update;
  if not found or j.state<>'Sending' or j.attempt_token is distinct from p_token then return; end if;
  if p_outcome='Retry' and j.attempts>=4 then p_outcome:='Failed'; end if;
  update crm_private.campaign_send_jobs set state=p_outcome,
    available_at=now()+make_interval(secs=>greatest(p_delay_seconds,case j.attempts when 1 then 60 when 2 then 300 else 900 end)),
    last_error=case when p_outcome in ('Failed','Uncertain') then 'Provider '||lower(p_outcome) end,
    lead_snapshot=case when p_outcome='Retry' then lead_snapshot else '{}' end,
    email=case when p_outcome='Retry' then email else null end where id=p_job_id;
  if p_outcome='Sent' then
    -- Preserve acceptance even if a concurrent bounce cleanup deleted the recipient.
    insert into crm_private.campaign_send_receipts(campaign_id,email_hash) values(j.campaign_id,j.email_hash) on conflict do nothing;
    inserted:=found;
    if inserted then update public.crm_campaigns set original_sent_count=original_sent_count+1 where campaign_id=j.campaign_id; end if;
    update public.crm_campaign_recipients set delivery_status=case when delivery_status in ('Pending','Failed') then 'Sent' else delivery_status end,
      sent_at=coalesce(sent_at,now()),provider='zeptomail',provider_message_id=coalesce(p_provider_id,provider_message_id) where recipient_id=j.recipient_id;
  elsif p_outcome='Failed' then
    update public.crm_campaign_recipients set delivery_status='Failed' where recipient_id=j.recipient_id;
  elsif p_outcome='Uncertain' then
    update public.crm_campaigns set status='Paused',last_error='Delivery uncertain: reconcile provider acceptance before resuming' where campaign_id=j.campaign_id;
  end if;
end $$;

create function public.crm_release_campaign(p_campaign_id bigint,p_token uuid,p_error text default null) returns void
language plpgsql security invoker set search_path='' as $$
declare c public.crm_campaigns%rowtype; remaining integer; processed integer; next_time timestamptz;
begin
  select * into c from public.crm_campaigns where campaign_id=p_campaign_id for update;
  if not exists(select 1 from crm_private.campaign_runs where campaign_id=p_campaign_id and lease_token=p_token) then return; end if;
  update crm_private.campaign_send_jobs set state='Pending',attempt_token=null where campaign_id=p_campaign_id and state='Claimed' and attempt_token=p_token;
  if p_error is not null then update public.crm_campaigns set status='Paused',last_error=p_error where campaign_id=p_campaign_id; end if;
  select count(*) filter(where state in ('Pending','Retry','Claimed','Sending','Uncertain')),
    count(*) filter(where state in ('Sent','Failed','Skipped')),min(available_at) filter(where state in ('Pending','Retry'))
    into remaining,processed,next_time from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and batch_number=c.batch_number;
  update public.crm_campaigns set batch_processed=processed,
    failed_count=(select count(*) from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and state='Failed'),
    skipped_count=(select count(*) from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and state='Skipped') where campaign_id=p_campaign_id;
  if remaining=0 and c.batch_number>0 and exists(select 1 from crm_private.campaign_batches where campaign_id=p_campaign_id and batch_number=c.batch_number and finished_at is null) then
    update crm_private.campaign_batches set finished_at=coalesce(finished_at,now()) where campaign_id=p_campaign_id and batch_number=c.batch_number;
    if exists(select 1 from crm_private.campaign_send_jobs where campaign_id=p_campaign_id and batch_number is null and state='Pending') then
      update public.crm_campaigns set next_run_at=now()+case when c.batching_enabled then make_interval(mins=>c.batch_interval_minutes) else interval '0' end
        where campaign_id=p_campaign_id;
    elsif p_error is null then
      update public.crm_campaigns set status='Completed',next_run_at=null,completed_at=now() where campaign_id=p_campaign_id;
    end if;
  elsif remaining>0 then
    update public.crm_campaigns set next_run_at=greatest(now(),coalesce(next_time,now())) where campaign_id=p_campaign_id;
  end if;
  perform public.recalculate_crm_campaign_email_metrics(p_campaign_id);
  update crm_private.campaign_runs set lease_token=null,lease_until=null where campaign_id=p_campaign_id and lease_token=p_token;
end $$;

-- Administrative reconciliation records an already accepted email, or explicitly
-- declares a request rejected. Rejected jobs are NOT automatically resent.
create function public.crm_reconcile_campaign_send(p_job_id bigint,p_accepted boolean) returns void
language plpgsql security invoker set search_path='' as $$
declare j crm_private.campaign_send_jobs%rowtype; token uuid:=gen_random_uuid();
begin
  select * into strict j from crm_private.campaign_send_jobs where id=p_job_id;
  perform 1 from public.crm_campaigns where campaign_id=j.campaign_id for update;
  if j.state<>'Uncertain' then raise exception 'Only uncertain requests can be reconciled'; end if;
  update crm_private.campaign_send_jobs set state='Sending',attempt_token=token where id=p_job_id;
  perform public.crm_finish_campaign_send(p_job_id,token,case when p_accepted then 'Sent' else 'Failed' end);
end $$;

revoke execute on all functions in schema crm_private from public,anon,authenticated;
grant execute on all functions in schema crm_private to service_role;
do $$ declare name text; begin
  for name in select p.oid::regprocedure::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in ('crm_save_campaign','crm_request_campaign_dispatch','crm_dispatch_campaigns',
      'crm_claim_campaign_chunk','crm_begin_campaign_send','crm_finish_campaign_send','crm_release_campaign','crm_reconcile_campaign_send') loop
    execute 'revoke all on function '||name||' from public,anon,authenticated';
    execute 'grant execute on function '||name||' to service_role';
  end loop;
end $$;

-- Enabled in a separate rollout step after both functions are deployed.
-- select cron.schedule('crm-campaign-dispatcher','* * * * *','select public.crm_request_campaign_dispatch()');
