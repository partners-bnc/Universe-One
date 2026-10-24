-- Run with BEGIN/ROLLBACK and service_role. No actual email is sent.
do $$
declare tid bigint; cid bigint; zero_id bigint; partial_id bigint; lid bigint; rid bigint; metric record;
  address text; addresses text[]:='{}'; receipts bigint[]:='{}'; payload jsonb;
begin
  insert into public.crm_email_templates(name,subject,category) values('Bounce KPI rollback fixture','Test','Test') returning id into tid;
  insert into public.crm_campaigns(campaign_name,template_id,status) values('Bounce KPI rollback fixture',tid,'Completed') returning campaign_id into cid;
  for i in 1..5 loop
    address:='kpi-'||gen_random_uuid()||'@example.invalid';
    addresses:=array_append(addresses,address);
    insert into public.crm_leads(full_name,email) values('KPI rollback fixture',address) returning lead_id into lid;
    insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status,sent_at)
    values(cid,lid,address,'zeptomail','Sent',now()) returning recipient_id into rid;
    receipts:=array_append(receipts,rid);
  end loop;
  if (select original_sent_count from public.crm_campaigns where campaign_id=cid)<>5 then raise exception 'Accepted sends not captured'; end if;
  perform public.crm_record_campaign_send(cid,upper(addresses[1]));
  update public.crm_campaign_recipients set delivery_status='Delivered' where recipient_id=receipts[1];
  if (select original_sent_count from public.crm_campaigns where campaign_id=cid)<>5 then raise exception 'Send counted twice'; end if;
  payload:='{"crm_authenticated":true,"crm_bounce_metadata":{"bounce_type":"hard","reason":"Synthetic KPI check"}}';
  for i in 1..2 loop
    select lead_id into lid from public.crm_campaign_recipients where recipient_id=receipts[i];
    perform public.record_crm_email_tracking_event('zeptomail','kpi-'||receipts[i],'bounced',addresses[i],null,null,now(),payload,cid,receipts[i],lid);
  end loop;
  select * into metric from public.crm_campaign_bounce_metrics(array[cid]);
  if metric.original_sent_count<>5 or metric.archived_bounce_count<>2 or metric.bounce_rate<>40 or not metric.history_complete then
    raise exception 'Expected 2/5 = 40 percent before cleanup: %',to_jsonb(metric); end if;
  perform public.crm_process_bounce_cleanup();
  perform public.recalculate_crm_campaign_email_metrics(cid);
  select * into metric from public.crm_campaign_bounce_metrics(array[cid]);
  if metric.original_sent_count<>5 or metric.archived_bounce_count<>2 or metric.bounce_rate<>40 then
    raise exception 'Cleanup changed bounce rate: %',to_jsonb(metric); end if;
  if (select count(*) from public.crm_campaign_recipients where campaign_id=cid)<>3 then raise exception 'Fixture cleanup failed'; end if;
  -- Explicit sender receipt still works after concurrent recipient deletion.
  address:='late-send-'||gen_random_uuid()||'@example.invalid';
  insert into public.crm_leads(email) values(address) returning lead_id into lid;
  insert into public.crm_campaign_recipients(campaign_id,lead_id,email_sent_to,provider,delivery_status)
  values(cid,lid,address,'zeptomail','Pending') returning recipient_id into rid;
  update public.crm_campaign_recipients set delivery_status='Failed' where recipient_id=rid;
  if (select original_sent_count from public.crm_campaigns where campaign_id=cid)<>5 then raise exception 'Failed send counted'; end if;
  delete from public.crm_leads where lead_id=lid;
  perform public.crm_record_campaign_send(cid,address);
  select * into metric from public.crm_campaign_bounce_metrics(array[cid]);
  if metric.original_sent_count<>6 or metric.bounce_rate<>33.3 then raise exception 'Late accepted send was lost'; end if;
  insert into public.crm_campaigns(campaign_name,template_id,status) values('Zero send KPI fixture',tid,'Draft') returning campaign_id into zero_id;
  select * into metric from public.crm_campaign_bounce_metrics(array[zero_id]);
  if metric.bounce_rate is not null or metric.original_sent_count<>0 or not metric.history_complete then raise exception 'Zero-send rate incorrect'; end if;
  insert into public.crm_campaigns(campaign_name,template_id,status,sent_count,original_sent_count,bounce_history_complete)
  values('Incomplete KPI fixture',tid,'Completed',4,null,false) returning campaign_id into partial_id;
  perform crm_private.archive_bounce(jsonb_build_object('email',addresses[1],'campaign_id',partial_id,'bounce_type','hard','reason','Recovered partial history','source','rollback_test'));
  select * into metric from public.crm_campaign_bounce_metrics(array[partial_id]);
  if metric.bounce_rate<>25 or metric.history_complete or metric.archived_bounce_count<>1 then raise exception 'Available-data bounce rate incorrect'; end if;
  update public.crm_campaigns set sent_count=0 where campaign_id=partial_id;
  select * into metric from public.crm_campaign_bounce_metrics(array[partial_id]);
  if metric.bounce_rate is not null then raise exception 'Zero denominator must not divide'; end if;
  if has_function_privilege('anon','public.crm_campaign_bounce_metrics(bigint[])','EXECUTE')
    or has_function_privilege('authenticated','public.crm_record_campaign_send(bigint,text)','EXECUTE') then raise exception 'KPI RPC permissions too broad'; end if;
end $$;
