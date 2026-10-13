// Administrative helper; credentials come only from the environment, never command arguments.
import {
  Database,
  PROJECT_REF,
  R2,
  sha256,
  TARGET_BUCKET,
  xml,
} from '../supabase/functions/storage-r2-backup/clients.ts';

const sourceUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') || Deno.env.get('SUPABASE_URL') || '';
const serviceKey = Deno.env.get('NEXT_SUPABASE_SERVICE_ROLE_KEY') ||
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const r2 = new R2(
  Deno.env.get('CLOUDFLARE_S3_API') ||
    `https://${Deno.env.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  Deno.env.get('CLOUDFLARE_ACCESS_KEY') || '',
  Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY') || '',
);
const db = new Database(sourceUrl, serviceKey);
const action = Deno.args[0] || 'status';

async function invoke(body: Record<string, unknown>) {
  const response = await fetch(`${sourceUrl}/functions/v1/storage-r2-backup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(130_000),
  });
  const result = await response.json();
  console.log(JSON.stringify({ status: response.status, ...result }));
  if (!response.ok) Deno.exitCode = 1;
  return result;
}

async function inventory<T>(select: string): Promise<T[]> {
  const all: T[] = [];
  for (let offset = 0;; offset += 1000) {
    const page = await db.request<T[]>('storage_r2_inventory', 'GET', undefined, {
      select,
      desired_revision: 'not.is.null',
      order: 'r2_key',
      limit: '1000',
      offset: String(offset),
    });
    all.push(...page);
    if (page.length < 1000) return all;
  }
}

if (action === 'preflight-local') {
  await r2.request('HEAD');
  const response = await r2.request('GET', undefined, { 'list-type': '2', 'max-keys': '1' });
  const result = xml.parse(await response.text()).ListBucketResult;
  console.log(
    JSON.stringify({
      bucket: TARGET_BUCKET,
      accessible: true,
      hasExistingObjects: Number(result.KeyCount) > 0,
    }),
  );
} else if (action === 'verify') {
  const rows = await inventory<
    { r2_key: string; desired_revision: string; byte_size: number; r2_etag: string }
  >(
    'r2_key,desired_revision,byte_size,r2_etag',
  );
  const remote = new Map<string, { size: number; etag: string }>();
  let continuation = '';
  do {
    const response = await r2.request('GET', undefined, {
      'list-type': '2',
      'max-keys': '1000',
      ...(continuation ? { 'continuation-token': continuation } : {}),
    });
    const list = xml.parse(await response.text()).ListBucketResult;
    const contents = list.Contents
      ? (Array.isArray(list.Contents) ? list.Contents : [list.Contents])
      : [];
    for (const item of contents) remote.set(item.Key, { size: Number(item.Size), etag: item.ETag });
    continuation = list.IsTruncated === 'true' ? list.NextContinuationToken : '';
  } while (continuation);
  const missing = rows.filter((row) => !remote.has(row.r2_key)).length;
  const mismatch = rows.filter((row) =>
    remote.has(row.r2_key) &&
    (remote.get(row.r2_key)!.size !== row.byte_size || remote.get(row.r2_key)!.etag !== row.r2_etag)
  ).length;
  console.log(
    JSON.stringify({
      expected: rows.length,
      remote: remote.size,
      missing,
      mismatch,
      bytes: rows.reduce((sum, row) => sum + row.byte_size, 0),
    }),
  );
  if (missing || mismatch) Deno.exitCode = 1;
} else if (action === 'verify-content') {
  const rows = await db.request<Array<{ r2_key: string; bucket_id: string; object_path: string }>>(
    'storage_r2_inventory',
    'GET',
    undefined,
    {
      select: 'r2_key,bucket_id,object_path',
      kind: 'eq.object',
      desired_revision: 'not.is.null',
      order: 'byte_size.desc',
      limit: '3',
    },
  );
  for (const row of rows) {
    const source = await fetch(
      `${sourceUrl}/storage/v1/object/authenticated/${encodeURIComponent(row.bucket_id)}/${
        row.object_path.split('/').map(encodeURIComponent).join('/')
      }`,
      { headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey } },
    );
    if (!source.ok) throw new Error(`Source download failed: ${source.status}`);
    const backup = await r2.request('GET', row.r2_key);
    const [left, right] = await Promise.all([source.arrayBuffer(), backup.arrayBuffer()]);
    if (await sha256(new Uint8Array(left)) !== await sha256(new Uint8Array(right))) {
      throw new Error('File bytes do not match');
    }
  }
  console.log(
    JSON.stringify({ verifiedContents: rows.length, matched: true, project: PROJECT_REF }),
  );
} else if (action === 'initial-sync') {
  for (let iteration = 0; iteration < 30; iteration++) {
    const result = await invoke({ action: 'run' });
    if (result.errors || result.failures || result.error || result.skipped) {
      throw new Error(
        'Initial sync has failures or another worker; inspect status before retrying',
      );
    }
    if (result.remaining === 0) break;
    if (iteration === 29) throw new Error('Initial sync still has pending work after 30 runs');
  }
} else if (['run', 'status', 'preflight'].includes(action)) {
  await invoke({ action, ...(Deno.args[1] ? { maxItems: Number(Deno.args[1]) } : {}) });
} else {
  throw new Error(
    'Supported actions: preflight-local, preflight, initial-sync, run, status, verify, verify-content',
  );
}
