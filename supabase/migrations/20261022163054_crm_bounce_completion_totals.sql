-- Campaign senders may hold a stale candidate count when suppression skips rows.
create or replace function crm_private.on_campaign_completed() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.status='Completed' and old.status is distinct from new.status then
    perform public.recalculate_crm_campaign_email_metrics(new.campaign_id);
    update public.crm_campaigns c set total_recipients=(
      select count(*) from public.crm_campaign_recipients r where r.campaign_id=new.campaign_id
    ) where c.campaign_id=new.campaign_id;
    if exists(select 1 from crm_private.bounce_cleanup_queue where campaign_id=new.campaign_id) then
      perform crm_private.invoke_bounce_cleanup();
    end if;
  end if;
  return new;
end $$;
revoke execute on function crm_private.on_campaign_completed() from public,anon,authenticated;
grant execute on function crm_private.on_campaign_completed() to service_role;
