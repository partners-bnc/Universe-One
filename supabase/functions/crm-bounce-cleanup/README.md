# CRM bounce cleanup

UniverseOne uses authenticated ZeptoMail events to suppress every bounced email
(hard or soft) and delete the entire matching lead after its campaign finishes.
The worker also removes campaign recipients, tracking events, follow-ups,
education and experience records and recalculates surviving campaign metrics.
Readable bounce records are retained separately in `crm_private.bounce_archive`.
The archive stores email, campaign snapshot, bounce type, reason and first/last
bounce timestamps. Cleanup preserves this table. Keyed suppression fingerprints
continue to block future sends and reimports.

## Bounced emails archive

### Campaign bounce-rate KPI

Campaign table and detail views display bounce count and rate from the private
archive. Regular cards and Kanban cards do not include a bounce-rate box.
The campaign API returns a `bounce_metrics` object with
`original_sent_count`, `archived_bounce_count`, `bounce_rate`, and
`history_complete`. The list uses one batch RPC instead of a query per campaign.

The rate is archived bounced addresses divided by the preserved original send
total when available, otherwise the current campaign `sent_count`, multiplied by
100 and rounded to one decimal place. Incomplete history does not block a rate.
Fallback rates are labeled Based on available data. They are not reconstructed
historical rates, and are not capped if partial records produce a value over 100%.
New tracked original totals count unique accepted addresses, matching the archive's
deduplication. Pending, failed and simulated sends are excluded from that ledger.
A zero denominator has no percentage; existing bounce counts remain visible.

Private `crm_private.campaign_send_receipts` stores campaign IDs and keyed email
hashes. Accepted-recipient triggers and the sender's service-only receipt RPC
update `crm_campaigns.original_sent_count` idempotently. The RPC also records
acceptance when concurrent lead cleanup has already removed the recipient row.
Cleanup and subsequent metric recalculation preserve this original denominator.

Campaigns predating this change use the retained Sent count when their original
total is unavailable. Saudi Seminar therefore shows 30/1186 = 2.5% using available
data. The dedicated five-address live test has independently verified provenance
and remains 2/5 = 40%. Existing surviving recipient
rows are seeded into the receipt ledger to prevent delivery callbacks from
incrementing their counters again. New campaigns start with complete tracking.

Validation: `supabase/tests/crm-campaign-bounce-kpi.sql` is rollback-only and covers
cleanup survival, duplicate receipts, late acceptance, failures, zero sends,
partial history and role permissions. `scripts/test-crm-bounce-kpi.mjs` and
`scripts/test-crm-campaign-bounce-api.mjs` cover formatting, API enrichment and
protection against client edits to maintained metric fields. Browser checks
verify absence of KPI boxes on cards, available-data rates in table/detail views,
and mobile layout. No actual test emails were sent
for this KPI change. The database migration is deployed; web application changes
require the normal application deployment.

The Campaigns page has a **Bounced emails** tab immediately after **Kanban View**.
Its table supports email search, campaign/type filters, refresh and pagination
(50 rows per page), with dates displayed in India time. The authenticated route
`/other-modules/crm/api/campaigns/bounces` additionally checks CRM module access.
Its server-only `crm_list_bounce_archive` RPC reads the private table; browsers
cannot query or import the archive directly.

Authenticated bounce callbacks archive their specific recipient's reason and
timestamp before suppression checks and detailed-history cleanup. Late hard
bounces upgrade earlier soft-bounce entries even after recipient deletion.
Entries are consolidated by normalized email and original campaign ID. Deleted
campaigns retain their original ID, name snapshot and available email subject.

The user-supplied `agent_1_1.csv` contains 193 email records, each with soft/hard
bounce details. Import consolidated 386 details into 172 email/campaign entries
for 43 addresses. Two confirmed real test bounces were also backfilled, giving
174 entries for 45 addresses. Their missing type/reason is labeled Not retained.
CSV timestamps were interpreted as Asia/Kolkata, matching campaign send times.
All imported addresses are suppressed. Import did not recreate active leads.

To preview/repeat an export import (idempotent per email/campaign):

```powershell
node scripts/import-crm-bounce-archive.mjs agent_1_1.csv
node scripts/import-crm-bounce-archive.mjs agent_1_1.csv --import
```

The initial import was applied through Supabase MCP. The repeatable CLI uses the
same service-only import RPC; it queues cleanup of any matching active leads.

Archive SQL tests are in `supabase/tests/crm-bounce-archive.sql`; run inside a
rollback-only transaction. CSV and API tests are `scripts/test-crm-bounce-csv.mjs`
and `scripts/test-crm-bounce-api.mjs`. A deployed authenticated synthetic webhook
test confirmed the readable archive survives automatic Edge cleanup. Its fixture
was removed afterward. Browser checks cover navigation, filters, pagination,
empty/error states and mobile horizontal scrolling.

## Provider configuration required

In Supabase Vault, reveal `crm_bounce_webhook_secret`. In ZeptoMail's existing
UniverseOne webhook, configure header `x-zeptomail-webhook-secret` with that value.
Never put the value in source control. Unauthenticated requests return 401.
ZeptoMail should retain both hard-bounce and soft-bounce subscriptions.

The Edge worker requires a gateway-validated service-role JWT. Keep
`verify_jwt=true`. Cron invokes it every five minutes. Campaign completion
invokes it when work is pending; authenticated late bounces invoke it directly.
Failed transactions leave their queue entries intact for retry.

Private `crm_private.bounce_cleanup_runs` contains aggregate deletion counts.
Private `crm_private.bounce_cleanup_queue` contains pending fingerprint jobs.
Private tables and new RPCs are inaccessible to anon/authenticated clients.

## Validation

- `node scripts/test-crm-bounce-webhook.mjs` tests authorization, exact bounce
  extraction, multi-recipient payloads, hard/soft events and retryable errors.
- Execute `supabase/tests/crm-bounce-cleanup.sql` inside `BEGIN`/`ROLLBACK` to
  test waiting for completion, deletion, reimport prevention, late events,
  preserved valid recipients, permissions and idempotency. It sends no email.
- An authenticated synthetic integration test against the deployed functions
  automatically deleted two fixture leads, two recipient records and two events
  after campaign completion. No actual emails were sent in that test.

## Completed live test

Campaign 49 was sent to exactly the five user-requested addresses. Four new
dummy leads were added; existing lead 955 was preserved. Template 29 clearly
labels the message as a one-time delivery test with no action required.

The provider header is configured. The campaign was run using:

```powershell
node scripts/run-crm-bounce-live-test.mjs 49
node scripts/run-crm-bounce-live-test.mjs 49 --send
```

The second command sends real emails through the actual CRM campaign handler.
It refuses to relaunch an already-started campaign. Do not rerun campaign 49.

ZeptoMail confirmed three deliveries and two bounces. The scheduled Edge worker
automatically removed the two bounced leads, two recipient rows and two tracking
events at 2026-10-22 16:40:01 UTC. The three delivered leads were preserved;
campaign totals now reflect the three remaining recipients. The queue is empty.
Reimport and recipient insertion checks confirm both bounced addresses are blocked.

The live test exposed an authentication failure on immediate webhook calls.
Webhook wakeups now use the same Vault-backed credential path as cron via a
service-only RPC. A further authenticated synthetic late-bounce test verified
this repaired immediate path at 2026-10-22 16:41:09 UTC: one fixture lead,
recipient and event were automatically deleted before the next scheduled run.

The sender's additional immediate suppression checks are a local application
change requiring the normal application deployment. Database recipient and
lead insertion guards are already deployed and enforce suppression independently.

The supplied CSV recovers 43 of the earlier addresses. Recovery of the remainder
of the original 339 would require another export or a suitable database backup.
New bounced addresses are automatically archived and suppressed.
