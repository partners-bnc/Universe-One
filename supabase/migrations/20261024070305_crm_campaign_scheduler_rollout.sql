-- Preserve provider rate limits across the whole campaign.
create or replace function public.crm_release_campaign(p_campaign_id bigint,p_token uuid,p_error text default null) returns void
language plpgsql security invoker set search_path='' as $$
declare c public.crm_campaigns%rowtype; remaining integer; processed integer; next_time timestamptz;
begin
  select * into c from public.crm_campaigns where campaign_id=p_campaign_id for update;
  if not exists(select 1 from crm_private.campaign_runs where campaign_id=p_campaign_id and lease_token=p_token) then return; end if;
  update crm_private.campaign_send_jobs set state='Pending',attempt_token=null where campaign_id=p_campaign_id and state='Claimed' and attempt_token=p_token;
  if p_error is not null then update public.crm_campaigns set status='Paused',last_error=p_error where campaign_id=p_campaign_id; end if;
  select count(*) filter(where state in ('Pending','Retry','Claimed','Sending','Uncertain')),
    count(*) filter(where state in ('Sent','Failed','Skipped')),greatest(min(available_at) filter(where state in ('Pending','Retry')),max(available_at) filter(where state='Retry'))
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


create or replace function public.crm_reconcile_campaign_send(p_job_id bigint,p_accepted boolean) returns void
language plpgsql security invoker set search_path='' as $$
declare j crm_private.campaign_send_jobs%rowtype; token uuid:=gen_random_uuid();
begin
  select * into strict j from crm_private.campaign_send_jobs where id=p_job_id;
  perform 1 from public.crm_campaigns where campaign_id=j.campaign_id for update;
  select * into strict j from crm_private.campaign_send_jobs where id=p_job_id for update;
  if j.state<>'Uncertain' then raise exception 'Only uncertain requests can be reconciled'; end if;
  update crm_private.campaign_send_jobs set state='Sending',attempt_token=token where id=p_job_id;
  perform public.crm_finish_campaign_send(p_job_id,token,case when p_accepted then 'Sent' else 'Failed' end);
end $$;


select cron.schedule('crm-campaign-dispatcher','* * * * *','select public.crm_request_campaign_dispatch()');
