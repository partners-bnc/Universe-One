import { authorize, client, response } from '../_shared/campaign-runtime.ts';
import { sendCampaignChunk, type CampaignChunk } from './worker.ts';

Deno.serve(async req => {
  const denied = authorize(req);
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  if (body.healthcheck !== true && (!Number.isSafeInteger(body.campaign_id) || body.campaign_id <= 0 || !/^[0-9a-f-]{36}$/i.test(body.lease_token || ''))) {
    return response(400, { error: 'Campaign ID and lease token are required' });
  }
  const supabase = client();
  async function rpc(name: string, args: Record<string, unknown>) {
    const { data, error } = await supabase.rpc(name, args);
    if (error) throw new Error(`${name}: ${error.code}`);
    return data;
  }
  async function senderConfig() {
    const token = Deno.env.get('ZOHO_TOKEN');
    const fallback: Record<string, string> = token ? {} : await rpc('crm_campaign_sender_config', {}) as Record<string, string>;
    return {
      token: token || fallback.token,
      from: { address: Deno.env.get('ZEPTOMAIL_FROM_ADDRESS') || fallback.from_address || 'noreply@bncglobal.in',
        name: Deno.env.get('ZEPTOMAIL_FROM_NAME') || fallback.from_name || 'BNC Global' },
    };
  }
  if (body.healthcheck === true) {
    try { return response(200, { ready: Boolean((await senderConfig()).token) }); }
    catch { return response(503, { ready: false }); }
  }
  let problem: string | null = null;
  try {
    const sender = await senderConfig();
    if (!sender.token) throw new Error('Email credentials unavailable; configure sender before resuming');
    const deadline = Date.now() + 50000;
    while (Date.now() < deadline) {
      const chunk = await rpc('crm_claim_campaign_chunk', { p_campaign_id: body.campaign_id, p_token: body.lease_token }) as CampaignChunk;
      if (!chunk?.jobs?.length) break;
      const result = await sendCampaignChunk({
        campaignId: body.campaign_id, token: body.lease_token, chunk, providerToken: sender.token,
        from: sender.from, rpc, deadline,
      });
      if (result.stopped) break;
    }
  } catch (error) {
    problem = error instanceof Error ? error.message : 'Sending interrupted';
    console.error('Campaign sending interrupted', { campaign_id: body.campaign_id, error: problem });
  }
  try {
    await rpc('crm_release_campaign', { p_campaign_id: body.campaign_id, p_token: body.lease_token, p_error: problem });
  } catch {
    // Retain the lease: after expiry the next worker reconciles Sending jobs.
    return response(503, { error: 'Progress persistence failed; lease recovery will retry' });
  }
  return response(problem ? 503 : 200, { success: !problem });
});
