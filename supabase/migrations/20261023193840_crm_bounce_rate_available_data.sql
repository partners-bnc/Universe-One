-- Show a rate from retained table data even when historical coverage is partial.
-- Preserve verified original send totals when available; otherwise use sent_count.
create or replace function public.crm_campaign_bounce_metrics(p_campaign_ids bigint[])
returns table(campaign_id bigint,original_sent_count bigint,archived_bounce_count bigint,bounce_rate numeric,history_complete boolean)
language sql stable security invoker set search_path='' as $$
  with archived as (
    select source_campaign_id,count(distinct email_hash) as bounced
    from crm_private.bounce_archive where source_campaign_id=any(p_campaign_ids) group by source_campaign_id
  ), metrics as (
    select c.campaign_id,c.original_sent_count,coalesce(a.bounced,0) as bounced,
      coalesce(c.original_sent_count,c.sent_count,0) as available_sent,
      c.bounce_history_complete and c.original_sent_count is not null
        and coalesce(a.bounced,0)<=c.original_sent_count as complete
    from public.crm_campaigns c left join archived a on a.source_campaign_id=c.campaign_id
    where c.campaign_id=any(p_campaign_ids)
  ) select campaign_id,original_sent_count,bounced,
    case when available_sent>0 then round(100.0*bounced/available_sent,1) else null end,
    complete from metrics
$$;
revoke all on function public.crm_campaign_bounce_metrics(bigint[]) from public,anon,authenticated;
grant execute on function public.crm_campaign_bounce_metrics(bigint[]) to service_role;
