-- Transactional scheduler checks. No dispatcher or provider HTTP requests.
begin;
do $$
declare tid bigint; cid bigint; draft_id bigint; lid bigint; work_id bigint; c public.crm_campaigns%rowtype;
  token uuid:=gen_random_uuid(); other_token uuid:=gen_random_uuid(); chunk jsonb; ids jsonb;
  batch_sizes integer[]:='{}'; expected integer; batch integer; next_time timestamptz; address text;
begin
  insert into public.crm_email_templates(name,subject,category,html_body,plain_text_body)
    values('Scheduler rollback fixture','Hi {{FirstName}}','Test','<p>{{Company}}</p>','{{Company}}') returning id into tid;
  insert into public.crm_leads(full_name,email,source_batch)
  select 'Scheduler rollback fixture', 'scheduler-'||gen_random_uuid()||'@example.invalid','scheduler-'||tid from generate_series(1,21500);
  select jsonb_agg(lead_id) into ids from public.crm_leads where source_batch='scheduler-'||tid;
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Scheduler rollback fixture','template_id',tid,'status','Draft',
    'scheduled_at',now()+interval '1 day','target_filter',jsonb_build_object('target_lead_ids',ids)));
  draft_id:=c.campaign_id;
  if c.status<>'Draft' or c.scheduler_version is not null or exists(select 1 from crm_private.campaign_send_jobs where campaign_id=draft_id) then
    raise exception 'Saving a scheduled draft enrolled recipients'; end if;
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Scheduler rollback fixture','template_id',tid,'status','Running',
    'batching_enabled',true,'first_batch_size',1000,'repeat_batch_size',10000,'batch_interval_minutes',120,
    'target_filter',jsonb_build_object('target_lead_ids',ids)));
  cid:=c.campaign_id;
  if c.total_recipients<>21500 then raise exception 'Audience snapshot truncated: %',c.total_recipients; end if;
  update public.crm_email_templates set subject='Changed after scheduling' where id=tid;
  if (select subject from crm_private.campaign_runs where campaign_id=cid)<>'Hi {{FirstName}}' then raise exception 'Template snapshot mutated'; end if;
  for batch in 1..4 loop
    update crm_private.campaign_runs set lease_token=token,lease_until=now()+interval '2 minutes' where campaign_id=cid;
    chunk:=public.crm_claim_campaign_chunk(cid,token);
    if jsonb_array_length(chunk->'jobs')<>100 then raise exception 'Chunk bound changed: %',chunk; end if;
    select batch_total into expected from public.crm_campaigns where campaign_id=cid;
    batch_sizes:=array_append(batch_sizes,expected);
    if batch=1 then
      work_id:=((chunk->'jobs'->0)->>'id')::bigint;
      if public.crm_begin_campaign_send(work_id,other_token) then raise exception 'Invalid lease accepted'; end if;
      if not public.crm_begin_campaign_send(work_id,token) then raise exception 'Valid claim rejected'; end if;
      if public.crm_begin_campaign_send(work_id,token) then raise exception 'Duplicate begin accepted'; end if;
      perform public.crm_finish_campaign_send(work_id,token,'Sent','scheduler-test');
      perform public.crm_finish_campaign_send(work_id,token,'Sent','scheduler-test');
      if (select original_sent_count from public.crm_campaigns where campaign_id=cid)<>1 then raise exception 'Acceptance counted twice'; end if;
      perform public.crm_save_campaign('{"status":"Paused"}',cid);
      if public.crm_begin_campaign_send(((chunk->'jobs'->1)->>'id')::bigint,token) then raise exception 'Paused campaign sent an email'; end if;
      perform public.crm_save_campaign('{"status":"Running"}',cid);
    end if;
    -- Simulate terminal outcomes for the rest of this logical batch without HTTP.
    update crm_private.campaign_send_jobs set state='Sent' where campaign_id=cid and batch_number=batch;
    perform public.crm_release_campaign(cid,token);
    select next_run_at into next_time from public.crm_campaigns where campaign_id=cid;
    if batch<4 and next_time<>now()+interval '2 hours' then raise exception 'Wait is not anchored to batch completion'; end if;
    -- A repeated release must not move the next send time forward.
    perform public.crm_release_campaign(cid,token);
    if (select next_run_at from public.crm_campaigns where campaign_id=cid) is distinct from next_time then raise exception 'Duplicate release moved schedule'; end if;
    update public.crm_campaigns set next_run_at=now() where campaign_id=cid;
  end loop;
  if batch_sizes<>array[1000,10000,10000,500] then raise exception 'Unexpected batch sizes: %',batch_sizes; end if;
  if (select status from public.crm_campaigns where campaign_id=cid)<>'Completed' then raise exception 'Campaign never completed'; end if;
  -- Explicit empty audience cannot select every lead.
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Empty scheduler rollback fixture','template_id',tid,'status','Running',
    'target_filter','{"target_lead_ids":[]}'::jsonb));
  if c.total_recipients<>0 or c.status<>'Completed' then raise exception 'Empty selection expanded the audience'; end if;

  select lead_id,email into lid,address from public.crm_leads where source_batch='scheduler-'||tid limit 1;
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Recovery scheduler rollback fixture','template_id',tid,'status','Running',
    'target_filter',jsonb_build_object('target_lead_ids',jsonb_build_array(lid))));
  cid:=c.campaign_id;
  update crm_private.campaign_runs set lease_token=token,lease_until=now()+interval '2 minutes' where campaign_id=cid;
  chunk:=public.crm_claim_campaign_chunk(cid,token);
  work_id:=((chunk->'jobs'->0)->>'id')::bigint;
  perform public.crm_begin_campaign_send(work_id,token);
  update crm_private.campaign_runs set lease_token=other_token where campaign_id=cid;
  perform public.crm_claim_campaign_chunk(cid,other_token);
  if (select state from crm_private.campaign_send_jobs where id=work_id)<>'Uncertain'
    or (select status from public.crm_campaigns where campaign_id=cid)<>'Paused' then raise exception 'Interrupted request was retried unsafely'; end if;
  begin
    perform public.crm_save_campaign('{"status":"Running"}',cid);
    raise exception 'Uncertain campaign resumed';
  exception when others then
    if sqlerrm='Uncertain campaign resumed' then raise; end if;
  end;
  perform public.crm_reconcile_campaign_send(work_id,true);
  if (select original_sent_count from public.crm_campaigns where campaign_id=cid)<>1 then raise exception 'Reconciliation lost acceptance'; end if;
  perform public.crm_release_campaign(cid,other_token);
  -- Campaign deletion clears all scheduler work through foreign keys.
  delete from public.crm_campaigns where campaign_id=cid;
  if exists(select 1 from crm_private.campaign_send_jobs where campaign_id=cid) then raise exception 'Deletion left queued sends'; end if;
  -- Respect rate limiting for the entire campaign, including unattempted jobs.
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Retry scheduler rollback fixture','template_id',tid,'status','Running',
    'target_filter',jsonb_build_object('target_lead_ids',jsonb_build_array(lid,
      (select lead_id from public.crm_leads where source_batch='scheduler-'||tid and lead_id<>lid limit 1)))));
  cid:=c.campaign_id;
  for batch in 1..4 loop
    update crm_private.campaign_runs set lease_token=token,lease_until=now()+interval '2 minutes' where campaign_id=cid;
    update crm_private.campaign_send_jobs set available_at=now() where campaign_id=cid;
    chunk:=public.crm_claim_campaign_chunk(cid,token);
    work_id:=((chunk->'jobs'->0)->>'id')::bigint;
    perform public.crm_begin_campaign_send(work_id,token);
    perform public.crm_finish_campaign_send(work_id,token,'Retry',null,120);
    perform public.crm_release_campaign(cid,token);
    if batch=1 and (select next_run_at from public.crm_campaigns where campaign_id=cid)<now()+interval '2 minutes' then raise exception 'Retry-After ignored'; end if;
    if batch=1 then update crm_private.campaign_send_jobs set state='Skipped' where campaign_id=cid and id<>work_id; end if;
    if batch=2 and (select next_run_at from public.crm_campaigns where campaign_id=cid)<now()+interval '5 minutes' then raise exception 'Backoff did not increase'; end if;
  end loop;
  if (select state from crm_private.campaign_send_jobs where id=work_id)<>'Failed' or (select status from public.crm_campaigns where campaign_id=cid)<>'Completed' then
    raise exception 'Retries were not bounded'; end if;
  -- A lead deleted before sending must be skipped and its private snapshot erased.
  select * into c from public.crm_save_campaign(jsonb_build_object('campaign_name','Deletion scheduler rollback fixture','template_id',tid,'status','Running',
    'target_filter',jsonb_build_object('target_lead_ids',jsonb_build_array(lid))));
  cid:=c.campaign_id;
  delete from public.crm_leads where lead_id=lid;
  if exists(select 1 from crm_private.campaign_send_jobs where campaign_id=cid and (email is not null or lead_snapshot<>'{}'::jsonb or state<>'Skipped')) then
    raise exception 'Deleted lead data survived in the queue'; end if;
  if has_function_privilege('anon','public.crm_dispatch_campaigns()','EXECUTE')
    or has_function_privilege('authenticated','public.crm_save_campaign(jsonb,bigint)','EXECUTE')
    or has_function_privilege('anon','public.crm_campaign_sender_config()','EXECUTE') then raise exception 'Privileged RPC exposed'; end if;
end $$;
set constraints all immediate;
rollback;
