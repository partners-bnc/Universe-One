-- An authenticated campaign callback may arrive after a recipient was removed
-- by cleanup for another address on the same lead. Archive and suppress it too.
do $migration$
declare definition text; needle text; replacement text;
begin
  select pg_get_functiondef('public.record_crm_email_tracking_event(text,text,text,text,text,text,timestamptz,jsonb,bigint,bigint,bigint)'::regprocedure) into definition;
  needle:=$needle$  if exists(select 1 from crm_private.email_suppressions where email_hash=h) then$needle$;
  replacement:=$replacement$  if p_event_type='bounced' and r.recipient_id is null and p_campaign_id is not null
    and not exists(select 1 from crm_private.email_suppressions where email_hash=h) then
    insert into crm_private.email_suppressions(email_hash) values(h);
    insert into crm_private.bounce_cleanup_queue(email_hash,campaign_id)
    values(h,(select campaign_id from public.crm_campaigns where campaign_id=p_campaign_id)) on conflict do nothing;
    return jsonb_build_object('archived',true,'cleanup_queued',true);
  end if;
  if exists(select 1 from crm_private.email_suppressions where email_hash=h) then$replacement$;
  if strpos(definition,needle)=0 then raise exception 'Expected archive wrapper was not found'; end if;
  execute replace(definition,needle,replacement);
end $migration$;
