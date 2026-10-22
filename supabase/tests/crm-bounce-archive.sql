-- Execute inside a rollback-only transaction; no provider email is sent.
do $$
declare tid bigint; cid bigint; lid bigint; rid bigint; address text:='archive-'||gen_random_uuid()||'@example.invalid';
  late_address text:='late-archive-'||gen_random_uuid()||'@example.invalid';
  payload jsonb; result jsonb;
begin
  insert into public.crm_email_templates(name,subject,category) values('Archive rollback test','Archive test','Test') returning id into tid;
  insert into public.crm_campaigns(campaign_name,template_id,status) values('Archive rollback test',tid,'Completed') returning campaign_id into cid;
  insert into public.crm_leads(full_name,email) values('Archive fixture',address) returning lead_id into lid;
  insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status)
  values(cid,lid,address,'zeptomail','Sent') returning recipient_id into rid;
  payload:=jsonb_build_object('crm_authenticated',true,'crm_bounce_metadata',jsonb_build_object('bounce_type','soft','reason','Temporary delivery failure'));
  perform public.record_crm_email_tracking_event('zeptomail','archive-soft-'||rid,'bounced',address,null,null,'2026-10-20T10:00:00Z',payload,cid,rid,lid);
  perform public.crm_process_bounce_cleanup();
  if exists(select 1 from public.crm_leads where lead_id=lid) then raise exception 'Lead not removed'; end if;
  if not exists(select 1 from crm_private.bounce_archive where email=address and source_campaign_id=cid and bounce_type='soft') then
    raise exception 'Readable archive lost during cleanup'; end if;
  -- Hard-bounce retries can arrive after the recipient is deleted and suppressed.
  payload:=jsonb_build_object('crm_authenticated',true,'crm_bounce_metadata',jsonb_build_object('bounce_type','hard','reason','Retries exhausted'));
  perform public.record_crm_email_tracking_event('zeptomail','archive-hard-'||rid,'bounced',address,null,null,'2026-10-21T10:00:00Z',payload,cid,rid,lid);
  perform public.record_crm_email_tracking_event('zeptomail','archive-hard-'||rid,'bounced',address,null,null,'2026-10-21T10:00:00Z',payload,cid,rid,lid);
  if (select count(*) from crm_private.bounce_archive where email=address)<>1 then raise exception 'Duplicate archive rows'; end if;
  if not exists(select 1 from crm_private.bounce_archive where email=address and bounce_type='hard' and reason='Retries exhausted') then
    raise exception 'Late hard bounce not preserved'; end if;
  if exists(select 1 from public.crm_email_tracking_events where email=address) then raise exception 'Detailed history recreated'; end if;
  result:=public.crm_list_bounce_archive(address,cid::text,'hard',1,50);
  if (result->>'total')::int<>1 or jsonb_array_length(result->'rows')<>1 then raise exception 'Archive filters failed'; end if;
  result:=public.crm_list_bounce_archive(address,cid::text,'soft',1,50);
  if (result->>'total')::int<>0 then raise exception 'Bounce type filter failed'; end if;
  result:=public.crm_list_bounce_archive(address,cid::text,'hard',2,1);
  if jsonb_array_length(result->'rows')<>0 then raise exception 'Pagination failed'; end if;
  insert into public.crm_leads(full_name,email) values('Late orphan bounce fixture',late_address);
  result:=public.record_crm_email_tracking_event('zeptomail','late-orphan-'||cid,'bounced',late_address,null,null,now(),payload,cid,null,null);
  if result->>'cleanup_queued'<>'true' then raise exception 'Unmatched authenticated bounce was not suppressed'; end if;
  perform public.crm_process_bounce_cleanup();
  if exists(select 1 from public.crm_leads where email=late_address) then raise exception 'Late bounce lead remained'; end if;
  if not exists(select 1 from crm_private.bounce_archive where email=late_address) then raise exception 'Late bounce archive missing'; end if;
  delete from public.crm_campaigns where campaign_id=cid;
  if not exists(select 1 from crm_private.bounce_archive where email=address and campaign_id is null
    and source_campaign_id=cid and campaign_name='Archive rollback test') then raise exception 'Campaign deletion removed archive'; end if;
  if has_function_privilege('anon','public.crm_list_bounce_archive(text,text,text,integer,integer)','EXECUTE')
    or has_function_privilege('authenticated','public.crm_import_bounce_archive(jsonb)','EXECUTE') then raise exception 'Archive permissions too broad'; end if;
end $$;
