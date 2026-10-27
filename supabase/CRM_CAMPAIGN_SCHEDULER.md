# Campaign scheduler

Campaigns can start immediately or at a future date/time in `Asia/Kolkata` (IST).
Batching is optional. With batching enabled, a first batch of 1,000 and repeat
batches of 10,000 with a 120-minute interval means: process 1,000 recipients,
finish all outcomes in that batch, wait two hours, then process the next 10,000.
The final batch contains the remaining recipients. Each destination is enrolled
once. Frequency does not resend the campaign to the same people.

Campaign details and the recipient CSV export show each recipient's stored batch
number. The authenticated API uses the service-only `crm_campaign_recipient_batches`
RPC to match private queue assignments by campaign and recipient ID. Pending
recipients without an assignment show “Not assigned”; historical recipients with
no recorded batch show “—”. A batch assignment does not imply successful delivery;
the delivery-status column shows that outcome separately.

## Components

- The Next.js campaign API authenticates the user and checks CRM access. Its
  service-only `crm_save_campaign` RPC saves drafts or atomically freezes the
  audience, template and format and creates sending work. Browser requests never
  send emails or manage cron entries.
- One `crm-campaign-dispatcher` cron runs every minute. `pg_net` invokes the
  dispatcher edge function using Vault's `project_url` and `service_role_key`.
- The dispatcher leases up to four campaigns across concurrent invocations and
  invokes `crm-campaign-send`. Database leases last two minutes. Sending functions
  claim at most 100 recipients per chunk, run up to five provider requests at a
  time, and continue claiming chunks within a 50-second budget. Individual HTTP
  requests time out after 15 seconds. Remaining work resumes on a later cron tick.
- Logical batches and recipient outcomes persist in `crm_private`. `next_run_at`
  controls each campaign independently. The wait starts when a logical batch
  reaches terminal outcomes, including failures/skips. Pause stops new requests;
  requests already in flight can finish.

Both edge functions require `verify_jwt=true` and additionally check the verified
JWT's service role and project reference. Queue tables have RLS, no user policies,
and service-only grants. Public worker RPCs are executable only by `service_role`.
The security advisor's informational “RLS Enabled No Policy” finding for these
private worker tables is intentional: browser users must have no direct access.

## Sender configuration

The worker prefers edge secrets `ZOHO_TOKEN`, `ZEPTOMAIL_FROM_ADDRESS` and
`ZEPTOMAIL_FROM_NAME`. When the token is absent, it reads the encrypted Vault
entry `crm_campaign_sender_config` through a service-only RPC. Configure/rotate
that entry through `crm_configure_campaign_sender` with a JSON object containing
`token`, `from_address` and `from_name`, using a trusted server client. Never log
that payload or include it in frontend code. An authenticated service request to
`crm-campaign-send` with `{ "healthcheck": true }` returns only `{ "ready": true }`
or false; it sends no email and reveals no credentials.

This rollout configured Vault from the web app's existing sender configuration.
The frontend/API changes still require the application's normal deployment.
Existing campaigns retain `scheduler_version = null` and are never automatically
activated by this scheduler. Historical drafts can be explicitly launched through
the updated API. Other historical campaigns require an intentional migration.

## Failures and recovery

An explicit HTTP 429 is retried with 1-, 5-, then 15-minute minimum backoff,
respecting a longer `Retry-After`. The campaign waits, including its unattempted
recipients. Four total attempts are allowed. Permanent rejections fail that
recipient. Provider authentication errors pause the campaign.

A timeout, transport failure, HTTP 408/5xx, or expired worker that left a request
in `Sending` has an uncertain acceptance outcome. The campaign pauses and will
not resend those requests automatically. This is deliberate: a tracking reference
is not a provider idempotency guarantee. Reconcile against provider logs using
the campaign/recipient client reference before resuming:

```sql
-- Run as a trusted administrator. No readable email is required in this query.
select id, campaign_id, recipient_id, state, attempts, last_error
from crm_private.campaign_send_jobs
where state = 'Uncertain';

-- Substitute a verified work ID and the provider's actual acceptance outcome.
select public.crm_reconcile_campaign_send(:work_id, :accepted);
```

Accepted reconciliation preserves the original send receipt; rejected
reconciliation marks the recipient failed and does not resend. Resume through
the CRM after all uncertain requests are resolved. Bounce suppression and
unsubscribes are checked immediately before every request. Deleting a lead scrubs
its queued snapshot; deleting a campaign cascades through its work. Existing
tracking and bounce cleanup continue to own delivery and engagement metrics.

## Operations and verification

Cron can be disabled in the Supabase dashboard to stop dispatching new work.
Active requests may finish. Campaign pause/resume is available in campaign details.
Monitor overdue campaigns, expired leases, errors and uncertain jobs:

```sql
select campaign_id, status, next_run_at, batch_number, batch_processed,
       batch_total, failed_count, skipped_count, last_error
from public.crm_campaigns
where scheduler_version = 1;

select jobid, status, start_time, end_time, return_message
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'crm-campaign-dispatcher')
order by start_time desc limit 20;
```

Apply scheduler migrations in order, deploy both functions, configure the sender,
verify the private health check, then enable cron with the rollout migration.
Queue deletion safety makes the lead/recipient references deferred so both
cascading deletion paths finish before foreign-key validation.

Run `node scripts/test-crm-campaign-scheduler.mjs`,
`node scripts/test-crm-campaign-scheduler-api.mjs`, and the existing CRM bounce test
scripts. `supabase/tests/crm-campaign-scheduler.sql` runs a transaction that rolls
back all fixtures and sends no HTTP requests. It exercises a 21,500-recipient
audience, batch timing, draft safety, empty selections, leases, pause/resume,
uncertain acceptance, bounded backoff, deletion and permissions. Build with
`npm run build`. No real-recipient email delivery is part of this test suite.
