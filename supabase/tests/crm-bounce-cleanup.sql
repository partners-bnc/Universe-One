-- Run inside BEGIN/ROLLBACK against the installed migration; sends no email.
do $$
declare tid bigint; cid bigint; lid bigint; good bigint; rid bigint; goodrid bigint; result jsonb;
  address text:='cleanup-'||gen_random_uuid()::text||'@example.invalid';
  safe_address text:='keep-'||gen_random_uuid()::text||'@example.invalid';
begin
  insert into public.crm_email_templates(name,subject,category) values('Rollback-only cleanup test','Test','Test') returning id into tid;
  insert into public.crm_campaigns(campaign_name,campaign_type,template_id,status) values('Rollback-only cleanup test','Email',tid,'Running') returning campaign_id into cid;
  insert into public.crm_leads(full_name,email) values('Test bounce','valid@example.invalid, '||upper(address)) returning lead_id into lid;
  insert into public.crm_leads(full_name,email) values('Test keep',safe_address) returning lead_id into good;
  insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status)
  values(cid,lid,address,'zeptomail','Sent') returning recipient_id into rid;
  insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status)
  values(cid,good,safe_address,'zeptomail','Sent') returning recipient_id into goodrid;
  result:=public.record_crm_email_tracking_event('zeptomail','untrusted-'||rid,'bounced',address,null,null,now(),'{}',cid,rid,lid);
  if result->>'reason'<>'unauthenticated_bounce' then raise exception 'Untrusted bounce accepted'; end if;
  perform public.record_crm_email_tracking_event('zeptomail','test-'||rid,'bounced',address,null,null,now(),'{"crm_authenticated":true}',cid,rid,lid);
  insert into public.crm_email_tracking_events(provider,event_fingerprint,event_type,campaign_id,recipient_id,lead_id,email,payload)
  values('zeptomail','mixed-'||rid,'unknown',cid,goodrid,good,safe_address,jsonb_build_object('other_recipient',address));
  if public.crm_email_send_allowed(lid,address) then raise exception 'Suppressed lead still sendable'; end if;
  if not public.crm_email_send_allowed(good,safe_address) then raise exception 'Unrelated lead suppressed'; end if;
  result:=public.crm_process_bounce_cleanup();
  if not exists(select 1 from public.crm_leads where lead_id=lid) then raise exception 'Running campaign cleaned too early'; end if;
  begin
    insert into public.crm_leads(email) values(address);
    raise exception 'Reimport should have failed';
  exception when check_violation then null; end;
  begin
    insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider) values(cid,good,address,'zeptomail');
    raise exception 'Recipient insertion should have failed';
  exception when check_violation then null; end;
  update public.crm_campaigns set status='Completed' where campaign_id=cid;
  begin
    perform public.crm_process_bounce_cleanup();
    raise exception using errcode='P0002',message='Simulated transaction failure';
  exception when no_data_found then null; end;
  if not exists(select 1 from public.crm_leads where lead_id=lid) then raise exception 'Failed cleanup was not rolled back'; end if;
  result:=public.crm_process_bounce_cleanup();
  if (result->>'leads_deleted')::int<>1 or (result->>'recipients_deleted')::int<>1 or (result->>'events_deleted')::int<>2 then
    raise exception 'Unexpected cleanup counts: %',result;
  end if;
  if exists(select 1 from public.crm_leads where lead_id=lid)
    or exists(select 1 from public.crm_campaign_recipients where recipient_id=rid)
    or exists(select 1 from public.crm_email_tracking_events where recipient_id=rid or email=address) then
    raise exception 'Target records remain'; end if;
  if not exists(select 1 from public.crm_leads where lead_id=good)
    or not exists(select 1 from public.crm_campaign_recipients where recipient_id=goodrid) then
    raise exception 'Unrelated records changed'; end if;
  if not exists(select 1 from public.crm_campaigns where campaign_id=cid and total_recipients=1 and bounced_count=0) then
    raise exception 'Metrics incorrect'; end if;
  result:=public.record_crm_email_tracking_event('zeptomail','late-'||rid,'opened',address,null,null,now(),'{}',cid,rid,lid);
  if result->>'reason'<>'suppressed' then raise exception 'Late event not ignored'; end if;
  if (public.crm_process_bounce_cleanup()->>'processed')::int<>0 then raise exception 'Cleanup not idempotent'; end if;
  if has_function_privilege('anon','public.crm_process_bounce_cleanup(integer)','EXECUTE')
    or has_function_privilege('authenticated','public.crm_verify_bounce_webhook_secret(text)','EXECUTE') then
    raise exception 'Cleanup RPC permissions are too broad'; end if;
end $$;
