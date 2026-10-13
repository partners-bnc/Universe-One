// Creates temporary PRIVATE Storage buckets, exercises the deployed mirror, and removes all fixtures.
// Run only after the initial mirror has completed. No application files are modified.
import {
  Database,
  encodePath,
  PROJECT_REF,
  R2,
  sha256,
} from '../supabase/functions/storage-r2-backup/clients.ts';

const url = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || '';
const key = Deno.env.get('NEXT_SUPABASE_SERVICE_ROLE_KEY') || '';
const db = new Database(url, key);
const r2 = new R2(
  Deno.env.get('CLOUDFLARE_S3_API') || '',
  Deno.env.get('CLOUDFLARE_ACCESS_KEY') || '',
  Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY') || '',
);
const suffix = crypto.randomUUID().slice(0, 8);
const buckets = [`r2-backup-check-${suffix}`, `r2-backup-empty-${suffix}`];
const file = 'nested folder/report (1) + query?.txt';
const zero = 'nested/empty.bin';
const large = 'large/resume.bin';
const moved = 'moved folder/renamed report.txt';
const paths = [file, zero, large, moved];
const passed: string[] = [];
const created: string[] = [];
let primaryFailure: unknown;

function assert(value: unknown, message: string) {
  if (!value) throw new Error(message);
}
async function storage(path: string, method: string, body?: BodyInit, headers?: HeadersInit) {
  const response = await fetch(`${url}/storage/v1/${path}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      ...Object.fromEntries(new Headers(headers)),
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Storage verification HTTP ${response.status} (${error.error || error.code || 'unknown'})`,
    );
  }
  await response.body?.cancel();
}
async function invoke(body: Record<string, unknown>) {
  const response = await fetch(`${url}/functions/v1/storage-r2-backup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(130_000),
  });
  const result = await response.json();
  assert(
    response.ok && !result.errors && !result.failures && !result.skipped,
    `Mirror verification failed: ${JSON.stringify(result)}`,
  );
  return result;
}
async function upload(path: string, bytes: Uint8Array) {
  await storage(`object/${buckets[0]}/${encodePath(path)}`, 'POST', bytes as BodyInit, {
    'Content-Type': 'application/octet-stream',
    'x-upsert': 'true',
  });
}
async function assertBytes(path: string, bytes: Uint8Array) {
  const response = await r2.request('GET', `${buckets[0]}/${path}`);
  const backedUp = new Uint8Array(await response.arrayBuffer());
  assert(await sha256(backedUp) === await sha256(bytes), 'Backup bytes mismatch');
  assert(
    response.headers.get('x-amz-meta-backup-project') === PROJECT_REF,
    'Ownership metadata missing',
  );
}

try {
  const before = await db.request<Array<{ last_success_at: string | null }>>(
    'storage_r2_state',
    'GET',
    undefined,
    { select: 'last_success_at' },
  );
  assert(before[0]?.last_success_at, 'Complete initial sync before integration verification');
  for (const bucket of buckets) {
    await storage('bucket', 'POST', JSON.stringify({ id: bucket, name: bucket, public: false }), {
      'Content-Type': 'application/json',
    });
    created.push(bucket);
  }
  const original = new TextEncoder().encode('Nested file contents');
  const largeBytes = new Uint8Array(17 * 1024 * 1024).fill(73);
  await upload(file, original);
  await upload(zero, new Uint8Array());
  await upload(large, largeBytes);

  // First run stops after the large file's first 8 MiB part and the bucket marker.
  await invoke({ action: 'run', maxItems: 2 });
  const checkpoint = await db.request<Array<{ checkpoint: { parts: unknown[] } | null }>>(
    'storage_r2_inventory',
    'GET',
    undefined,
    { select: 'checkpoint', r2_key: `eq.${buckets[0]}/${large}` },
  );
  assert(checkpoint[0]?.checkpoint?.parts.length === 1, 'Multipart checkpoint was not persisted');
  assert(
    (await r2.head(`${buckets[0]}/${large}`)).status === 404,
    'Incomplete multipart object was published',
  );
  await invoke({ action: 'run' });
  await assertBytes(file, original);
  await assertBytes(zero, new Uint8Array());
  await assertBytes(large, largeBytes);
  assert(
    Number((await r2.head(`${buckets[1]}/`)).headers.get('content-length')) === 0,
    'Empty bucket marker missing',
  );
  passed.push(
    'private buckets, nested paths with spaces and punctuation, zero-byte files, empty bucket, multipart interruption/resume',
  );

  const updated = new TextEncoder().encode('Updated bytes');
  await upload(file, updated);
  await invoke({ action: 'run' });
  await assertBytes(file, updated);
  passed.push('overwrite propagation');

  await storage(
    'object/move',
    'POST',
    JSON.stringify({ bucketId: buckets[0], sourceKey: file, destinationKey: moved }),
    { 'Content-Type': 'application/json' },
  );
  await invoke({ action: 'run' });
  await assertBytes(moved, updated);
  assert(
    (await r2.head(`${buckets[0]}/${file}`)).status === 404,
    'Moved source key remained in R2',
  );
  passed.push('move propagation');

  await storage(`object/${buckets[0]}`, 'DELETE', JSON.stringify({ prefixes: [moved] }), {
    'Content-Type': 'application/json',
  });
  await invoke({ action: 'run' });
  assert(
    (await r2.head(`${buckets[0]}/${moved}`)).status === 404,
    'Deleted source key remained in R2',
  );
  passed.push('deletion propagation');

  // Missing destination and altered content are repaired by the daily reconciliation path.
  await r2.request('DELETE', `${buckets[0]}/${zero}`);
  await db.request('storage_r2_inventory', 'PATCH', { verify_after: '2000-01-01T00:00:00Z' }, {
    r2_key: `eq.${buckets[0]}/${zero}`,
  });
  await invoke({ action: 'run' });
  await assertBytes(zero, new Uint8Array());
  passed.push('destination repair');

  const denied = await fetch(`${url}/functions/v1/storage-r2-backup`, {
    method: 'POST',
    headers: { Authorization: 'Bearer invalid', 'Content-Type': 'application/json' },
    body: '{"action":"run"}',
  });
  assert(denied.status === 401, 'Unauthorized invocation accepted');
  await denied.body?.cancel();
  const frontendKey = Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';
  const forbidden = await fetch(`${url}/rest/v1/storage_r2_inventory?select=r2_key&limit=1`, {
    headers: { apikey: frontendKey, Authorization: `Bearer ${frontendKey}` },
  });
  assert([401, 403].includes(forbidden.status), 'Frontend roles can read mirror inventory');
  await forbidden.body?.cancel();
  passed.push('unauthorized invocation and frontend access rejected');
} catch (error) {
  primaryFailure = error;
} finally {
  for (const bucket of created) {
    if (bucket === buckets[0]) {
      await storage(`object/${bucket}`, 'DELETE', JSON.stringify({ prefixes: paths }), {
        'Content-Type': 'application/json',
      });
    }
    await storage(`bucket/${bucket}`, 'DELETE');
  }
  if (created.length) {
    try {
      await invoke({ action: 'run' });
    } catch (error) {
      if (!primaryFailure) primaryFailure = error;
    }
    for (const bucket of created) {
      assert((await r2.head(`${bucket}/`)).status === 404, 'Deleted bucket marker remained in R2');
    }
    passed.push('bucket deletion and fixture cleanup');
  }
}
if (primaryFailure) throw primaryFailure;
console.log(JSON.stringify({ passed, fixtureBucketsRemoved: created.length }));
