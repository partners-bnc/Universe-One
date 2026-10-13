# UniverseOne Storage mirror

`storage-r2-backup` mirrors every standard Storage bucket in Supabase project
`llfoaqnljjbneouiedbg` into Cloudflare R2 bucket `universeone-backup`.
Bucket names and file paths are preserved as `<bucket-name>/<object-path>`.
Each bucket also has a zero-byte `<bucket-name>/` marker, including empty buckets.

This is an **exact current-state mirror**: overwrites replace the previous copy,
and source deletions remove the corresponding backup. It does not keep historical
versions or copy bucket policies, permissions, lifecycle settings, or database data.
Files created and deleted between inventory scans might never be copied.

## Configuration and deployment

Set these Supabase Edge Function secrets and the same names in `.env.local`:

```text
CLOUDFLARE_ACCESS_KEY
CLOUDFLARE_SECRET_ACCESS_KEY
CLOUDFLARE_S3_API
```

`CLOUDFLARE_S3_API` is the HTTPS account S3 endpoint, optionally ending in
`/universeone-backup`. Alternatively, supply `CLOUDFLARE_ACCOUNT_ID` instead of
the endpoint. Credentials must permit listing, reading, writing, deleting, and
multipart operations in this bucket. The Cloudflare management token is unused.
The destination bucket is fixed; the source uses Supabase's built-in service key.

Apply `supabase/migrations/20261012165021_storage_r2_backup.sql` using Supabase MCP.
Then apply `supabase/migrations/20261012170834_storage_r2_retire_absent_failures.sql`.
Deploy `index.ts`, `handler.ts`, `clients.ts`, `engine.ts`, `deno.json`, and
`deno.lock` using MCP with `verify_jwt: false` and `import_map_path: "deno.json"`.
The function implements its own authorization. Keep package versions and the lockfile pinned.

The migration generates `storage_backup_shared_secret` in Supabase Vault and
stores only its SHA-256 hash in the service-only state table. The function validates
this token without requiring an additional Edge Function secret. A valid Supabase
service key is also accepted for administration; public and user keys are rejected.
Never put these credentials in client code, logs, or command-line arguments.

Run preflight, complete and verify the initial copy, then apply
`supabase/storage_r2_cron.sql` through MCP. It schedules the worker every minute
with `pg_cron` and `pg_net`, using the encrypted Vault invocation token.

## Operation

Each run takes a database lease, reads Storage metadata without modifying its schema,
and atomically updates the desired inventory. A failed scan cannot create deletions.
The worker compares versions and copies changed files with two concurrent transfers.
It rechecks the source before publishing and marking a transfer complete. Moves become
a new copy and deletion of the previous path; new buckets are discovered automatically.

Runs process work for at most 100 seconds. The lease lasts 180 seconds and is renewed
between batches. An interrupted run resumes on the next invocation. Transient failures
retry with exponential backoff from one minute to one hour; failures remain visible
and retry until resolved. Credentials or permission errors do not trigger destructive cleanup.

Files up to 16 MiB use a single PUT. Larger files use persisted multipart checkpoints
and authenticated range downloads in 8 MiB parts, increasing up to 64 MiB to stay within
R2's 10,000-part limit. This supports files up to 625 GiB. Files beyond that limit remain
pending with an explicit error. Multipart uploads are aborted when the source version changes.
R2 lifecycle expiration for incomplete multipart uploads is recommended as an operational
cleanup for a worker killed between initiating an upload and saving its upload ID.

R2 objects carry project ownership and source revision metadata. The worker refuses
to overwrite or delete a preexisting key owned by someone else. Unrelated destination
objects are preserved. Successful copies retain bytes, content type, cache control,
supported content disposition, and user metadata encoded as base64 JSON when it fits
the 1 KiB budget. Source timestamps, ACLs, and S3 ETags are not reproduced as native R2 values.

Once per 24 hours for each active object, the worker checks R2 existence, size, revision,
and saved R2 ETag, and repairs missing or changed owned objects. This is metadata-based
reconciliation, not a daily full download of every file. Initial validation additionally
compares downloaded bytes. Runs are retained for 30 days; the inventory retains deletion
state for ownership and diagnostics.

## Administrative commands

From the repository root, using `.env.local` (including the existing
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_SUPABASE_SERVICE_ROLE_KEY`):

```powershell
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup.ts preflight
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup.ts initial-sync
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup.ts status
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup.ts verify
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup.ts verify-content
```

`verify` compares the full inventory's keys, sizes, and ETags to R2.
`verify-content` checks the three largest files byte-for-byte using SHA-256.
`run` invokes one bounded batch; `initial-sync` repeats bounded batches until clean.
`status` returns five recent runs and the last successful completion without exposing secrets.

Inspect failed work through Supabase MCP:

```sql
select r2_key, attempts, next_attempt_at, last_error
from public.storage_r2_inventory where last_error is not null;
select status, started_at, finished_at, result, error
from public.storage_r2_runs order by started_at desc limit 10;
select jobname, schedule, active from cron.job where jobname = 'storage-r2-backup';
```

Pause or resume scheduling without deleting checkpoints:

```sql
select cron.alter_job((select jobid from cron.job where jobname='storage-r2-backup'), active := false);
-- Resume:
select cron.alter_job((select jobid from cron.job where jobname='storage-r2-backup'), active := true);
```

After correcting an error, invoke `run` or allow automatic retries. To retry failed
rows immediately, set their `next_attempt_at` to `now()` through an administrative SQL query.
Rotate R2 credentials by updating the three secrets; paths and checkpoints stay intact.
Rotate the cron token in a single transaction with `vault.update_secret`, then update
`storage_r2_state.auth_token_sha256` to the hash of the new Vault value.
Do not return the decrypted token from SQL or include it in tracked files.

## Verification

```powershell
deno test --config supabase/functions/storage-r2-backup/deno.json supabase/functions/storage-r2-backup/engine_test.ts
deno check --config supabase/functions/storage-r2-backup/deno.json supabase/functions/storage-r2-backup/index.ts scripts/storage-r2-backup.ts scripts/storage-r2-backup-integration.ts
deno run --allow-env --allow-net --env-file=.env.local --config supabase/functions/storage-r2-backup/deno.json scripts/storage-r2-backup-integration.ts
```

The integration check creates two temporary private buckets and removes its fixtures.
It exercises exact nested paths with spaces and punctuation, empty buckets,
zero-byte objects, multipart interruption/resume, overwrites, moves, deletions,
destination repair, and authorization through the deployed function. Run it after
the initial copy and while cron is paused to avoid a competing worker.

Unicode and literal percent signs are covered by unit tests; the current Supabase
REST upload API rejects those characters when creating integration fixtures.
