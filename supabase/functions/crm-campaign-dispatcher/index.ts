import { authorize, client, response } from '../_shared/campaign-runtime.ts';

Deno.serve(async req => {
  const denied = authorize(req);
  if (denied) return denied;
  const { data, error } = await client().rpc('crm_dispatch_campaigns');
  if (error) {
    console.error('Campaign dispatch failed', { code: error.code });
    return response(503, { error: 'Dispatch failed; cron will retry' });
  }
  return response(200, { dispatched: data });
});
