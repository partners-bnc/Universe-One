// Executes the actual CRM campaign PUT handler with server credentials.
// Default is preflight only. Explicit --send performs real email delivery.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ts from 'typescript';

Object.assign(process.env, dotenv.parse(fs.readFileSync('.env.local')));
const campaignId = Number(process.argv.find(v => /^\d+$/.test(v)));
assert.ok(Number.isSafeInteger(campaignId) && campaignId > 0, 'Provide the prepared campaign ID');
assert.equal(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname, 'llfoaqnljjbneouiedbg.supabase.co');
assert.ok(process.env.ZOHO_TOKEN, 'Live provider credentials are required');
const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: campaign, error } = await adminClient.from('crm_campaigns').select('*').eq('campaign_id', campaignId).single();
if (error) throw error;
assert.ok(campaign.campaign_name.startsWith('CRM bounce cleanup live test - '), 'Only the dedicated test campaign can be sent');
assert.equal(campaign.status, 'Draft', 'Campaign already launched; do not send twice');
assert.equal(campaign.target_filter.target_lead_ids.length, 5);
const { data: leads, error: leadError } = await adminClient.from('crm_leads').select('lead_id,email,full_name').in('lead_id', campaign.target_filter.target_lead_ids);
if (leadError) throw leadError;
assert.equal(leads.length, 5);
console.log(JSON.stringify({ preflight: true, campaign_id: campaignId, recipients: leads.length, will_send: process.argv.includes('--send') }));
if (!process.argv.includes('--send')) process.exit(0);

const source = fs.readFileSync('app/other-modules/crm/api/campaigns/route.js', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
const routeModule = { exports: {} };
const nodeRequire = createRequire(import.meta.url);
vm.runInNewContext(compiled.outputText, {
  module: routeModule, exports: routeModule.exports, process, fetch, console, Request, Response, URL, Date,
  require(name) {
    if (name === '@/utils/supabase/admin') return { adminClient };
    // PUT uses the admin client directly; fail if a different handler runs.
    if (name === '@/utils/supabase/server') return { createClient() { throw new Error('Unexpected session handler'); } };
    if (name === '@/utils/auth/context') return { resolveAuthenticatedUserContext() { throw new Error('Unexpected user-context lookup'); } };
    return nodeRequire(name);
  },
});
const response = await routeModule.exports.PUT(new Request('http://localhost/other-modules/crm/api/campaigns', {
  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaign_id: campaignId, status: 'Running' }),
}));
const result = await response.json();
assert.equal(response.status, 200, JSON.stringify(result));
const { data: actual, error: actualError } = await adminClient.from('crm_campaigns')
  .select('campaign_id,status,total_recipients,sent_count,bounced_count').eq('campaign_id', campaignId).single();
if (actualError) throw actualError;
console.log(JSON.stringify({ campaign: actual }));
