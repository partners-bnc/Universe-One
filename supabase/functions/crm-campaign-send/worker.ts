import { substitute } from '../_shared/campaign-template.ts';

export interface CampaignJob {
  id: number;
  lead_snapshot: Record<string, unknown>;
  email: string;
  recipient_id: number;
  lead_id: number;
}
export interface CampaignChunk {
  jobs: CampaignJob[];
  subject: string;
  body: string;
  format: 'html' | 'text';
}
type Rpc = (name: string, args: Record<string, unknown>) => Promise<unknown>;

// No sleeps, recursive invocations, or in-memory-only progress. Each invocation
// processes bounded work and leaves the next cron tick to resume it.
export async function sendCampaignChunk(options: {
  campaignId: number;
  token: string;
  chunk: CampaignChunk;
  providerToken: string;
  from: { address: string; name: string };
  rpc: Rpc;
  fetcher?: typeof fetch;
  now?: () => number;
  deadline?: number;
}) {
  const { campaignId, token, chunk, providerToken, from, rpc, fetcher = fetch, now = Date.now } = options;
  const deadline = options.deadline ?? now() + 50000;
  let cursor = 0;
  let stop = false;
  async function consume() {
    while (!stop && now() < deadline) {
      const job = chunk.jobs[cursor++];
      if (!job) break;
      const allowed = await rpc('crm_begin_campaign_send', { p_job_id: job.id, p_token: token });
      if (!allowed) continue;
      const payload = {
        from,
        to: [{ email_address: { address: job.email, name: String(job.lead_snapshot.full_name || job.email) } }],
        subject: substitute(chunk.subject, job.lead_snapshot),
        client_reference: `campaign_id=${campaignId}&recipient_id=${job.recipient_id}&lead_id=${job.lead_id}`,
        [chunk.format === 'text' ? 'textbody' : 'htmlbody']: substitute(chunk.body, job.lead_snapshot),
      };
      let outcome = 'Uncertain';
      let providerId: string | null = null;
      let delay = 60;
      try {
        const res = await fetcher('https://api.zeptomail.in/v1.1/email', {
          method: 'POST', headers: { Authorization: providerToken, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
        });
        if (res.ok) {
          // Receiving a successful HTTP response establishes acceptance even if
          // the optional response body cannot be decoded.
          outcome = 'Sent';
          const body = await res.json().catch(() => ({}));
          const data = Array.isArray(body.data) ? body.data[0] : body.data;
          providerId = body.message_id || body.email_reference || body.request_id || data?.message_id || data?.email_reference || data?.request_id || null;
        } else if (res.status === 429) {
          outcome = 'Retry';
          const retryAfter = res.headers.get('Retry-After');
          const parsed = Number(retryAfter);
          delay = retryAfter && Number.isFinite(parsed) ? Math.max(60, parsed) : Math.max(60, ((Date.parse(retryAfter || '') - now()) / 1000) || 60);
          stop = true;
        } else if (res.status >= 500 || res.status === 408) {
          // Server errors may occur AFTER provider acceptance. Without a provider
          // idempotency guarantee they are uncertain, not safely retryable.
          outcome = 'Uncertain';
          stop = true;
        } else {
          outcome = 'Failed';
          if ([401, 403].includes(res.status)) stop = true;
        }
      } catch {
        outcome = 'Uncertain';
        stop = true;
      }
      await rpc('crm_finish_campaign_send', {
        p_job_id: job.id, p_token: token, p_outcome: outcome, p_provider_id: providerId,
        p_delay_seconds: Math.min(2147483647, Math.ceil(delay)),
      });
      if (outcome === 'Uncertain') stop = true;
      if (outcome === 'Failed' && stop) throw new Error('Provider rejected authentication; check email credentials before resuming');
    }
  }
  // All in-flight tasks settle before the lease is released, including failures.
  const results = await Promise.allSettled(Array.from({ length: Math.min(5, chunk.jobs.length) }, consume));
  const failed = results.find(result => result.status === 'rejected');
  if (failed?.status === 'rejected') throw failed.reason;
  return { stopped: stop };
}
