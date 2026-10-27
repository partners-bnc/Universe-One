-- Expose only the batch assignments needed by the authenticated campaign API.
-- JSON aggregation avoids PostgREST's row limit for this lookup.
create function public.crm_campaign_recipient_batches(p_campaign_id bigint,p_recipient_ids bigint[])
returns jsonb language sql stable security invoker set search_path='' as $$
  select coalesce(jsonb_agg(jsonb_build_object('recipient_id',j.recipient_id,'batch_number',j.batch_number)),'[]'::jsonb)
  from crm_private.campaign_send_jobs j
  where j.campaign_id=p_campaign_id and j.recipient_id=any(p_recipient_ids)
$$;
revoke all on function public.crm_campaign_recipient_batches(bigint,bigint[]) from public,anon,authenticated;
grant execute on function public.crm_campaign_recipient_batches(bigint,bigint[]) to service_role;
