import {
  Database,
  HttpError,
  PROJECT_REF,
  R2,
  sameSecret,
  sha256,
  TARGET_BUCKET,
} from './clients.ts';
import type { Inventory } from './clients.ts';
import { type Counts, processOne, recordFailure, safeError } from './engine.ts';

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function credentials(): R2 {
  const account = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
  const endpoint = Deno.env.get('CLOUDFLARE_S3_API') ||
    (account ? `https://${account}.r2.cloudflarestorage.com` : '');
  const accessKey = Deno.env.get('CLOUDFLARE_ACCESS_KEY') || '';
  const secret = Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY') || '';
  if (!endpoint || !accessKey || !secret) {
    throw new Error('Missing Cloudflare R2 Edge Function secrets');
  }
  return new R2(endpoint, accessKey, secret);
}

export async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'Use POST' });
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (!url || !key) return json(503, { error: 'Missing Supabase service configuration' });
  if (new URL(url).hostname !== `${PROJECT_REF}.supabase.co`) {
    return json(503, { error: 'Incorrect source project' });
  }
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return json(401, { error: 'Unauthorized' });
  const db = new Database(url, key);
  try {
    // service_role is accepted for authenticated administrative checks. Cron uses a separate Vault token.
    if (!sameSecret(token, key)) {
      const state = await db.request<Array<{ auth_token_sha256: string }>>(
        'storage_r2_state',
        'GET',
        undefined,
        { select: 'auth_token_sha256', singleton: 'eq.true' },
      );
      if (!state[0] || !sameSecret(await sha256(token), state[0].auth_token_sha256)) {
        // Rotated valid service keys need not equal the runtime's legacy service key.
        // Prove service privileges using the caller's credential on a service-only table.
        if (!/^(eyJ|sb_secret_)/.test(token)) return json(401, { error: 'Unauthorized' });
        try {
          const authorized = await new Database(url, token).request<Array<{ singleton: boolean }>>(
            'storage_r2_state',
            'GET',
            undefined,
            { select: 'singleton', singleton: 'eq.true' },
          );
          if (authorized[0]?.singleton !== true) return json(401, { error: 'Unauthorized' });
        } catch (error) {
          if (error instanceof HttpError && [401, 403].includes(error.status)) {
            return json(401, { error: 'Unauthorized' });
          }
          throw error;
        }
      }
    }
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'run';
    if (!['run', 'status', 'preflight'].includes(action)) {
      return json(400, { error: 'Unknown action' });
    }
    if (action === 'status') {
      const state = await db.request('storage_r2_state', 'GET', undefined, {
        select: 'lease_owner,lease_until,last_scan_at,last_success_at',
      });
      const runs = await db.request('storage_r2_runs', 'GET', undefined, {
        select: 'id,started_at,finished_at,status,result,error',
        order: 'started_at.desc',
        limit: '5',
      });
      return json(200, { bucket: TARGET_BUCKET, state, runs });
    }
    const r2 = credentials();
    await r2.request('HEAD');
    if (action === 'preflight') {
      return json(200, { source: PROJECT_REF, bucket: TARGET_BUCKET, accessible: true });
    }

    const runId = crypto.randomUUID();
    if (!await db.rpc<boolean>('storage_r2_acquire', { p_run: runId })) {
      return json(200, { skipped: 'Worker already running' });
    }
    const counts: Counts = {
      scanned: 0,
      uploaded: 0,
      deleted: 0,
      verified: 0,
      parts: 0,
      errors: 0,
    };
    // A run stays below the 150s free-plan limit. Each transfer has a shorter timeout.
    const seconds = Math.min(100, Math.max(1, Number(body.maxSeconds) || 100));
    const maxItems = Math.min(1000, Math.max(1, Number(body.maxItems) || 1000));
    const deadline = Date.now() + seconds * 1000;
    const signal = AbortSignal.timeout(seconds * 1000);
    const workDb = new Database(url, key, signal);
    const workR2 = new R2(
      Deno.env.get('CLOUDFLARE_S3_API') ||
        `https://${Deno.env.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      Deno.env.get('CLOUDFLARE_ACCESS_KEY')!,
      Deno.env.get('CLOUDFLARE_SECRET_ACCESS_KEY')!,
      signal,
    );
    let fatal: string | null = null;
    try {
      counts.scanned = await workDb.rpc<number>('storage_r2_scan', { p_run: runId });
      let processed = 0;
      while (Date.now() < deadline - 3000 && processed < maxItems) {
        if (!await workDb.rpc<boolean>('storage_r2_heartbeat', { p_run: runId })) {
          throw new Error('Mirror lease lost');
        }
        const rows = await workDb.rpc<Inventory[]>('storage_r2_pending', {
          p_run: runId,
          p_limit: Math.min(2, maxItems - processed),
        });
        if (!rows.length) break;
        await Promise.all(rows.map(async (row) => {
          try {
            await processOne(workDb, workR2, row, counts, body.forceMultipart === true);
          } catch (error) {
            if (signal.aborted) return; // Keep the checkpoint; resume at the next minute.
            counts.errors++;
            await recordFailure(workDb, row, error);
          }
        }));
        processed += rows.length;
      }
    } catch (error) {
      if (!signal.aborted) fatal = safeError(error);
    }
    const result = await db.rpc('storage_r2_finish', {
      p_run: runId,
      p_result: counts,
      p_error: fatal,
    });
    console.log(JSON.stringify({ event: 'storage-r2-backup', runId, ...counts, error: fatal }));
    return json(fatal ? 500 : 200, {
      runId,
      ...result as object,
      ...(fatal ? { error: fatal } : {}),
    });
  } catch (error) {
    return json(503, { error: safeError(error) });
  }
}
