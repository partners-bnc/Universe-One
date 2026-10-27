-- Lead deletion also cascades through campaign recipients. Validate these two
-- nullable references only after all cascading actions in the transaction finish.
alter table crm_private.campaign_send_jobs
  alter constraint campaign_send_jobs_lead_id_fkey deferrable initially deferred,
  alter constraint campaign_send_jobs_recipient_id_fkey deferrable initially deferred;
