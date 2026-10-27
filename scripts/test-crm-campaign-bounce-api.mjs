import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compileModule(source, require) {
  const target = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { module: target, exports: target.exports, require, URL, console, process: { env: {} } });
  return target.exports;
}
const helpers = compileModule(fs.readFileSync('utils/crm-bounce-metrics.js', 'utf8'));
const campaign = { campaign_id: 1, campaign_name: 'Verified fixture', status: 'Completed', sent_count: 3, bounced_count: 0 };
let calls = 0, capturedUpdate, recipientRows = [], batchLookupError = null;
const adminClient = {
  from(table) {
    return {
      select() { return this; }, eq() { return this; },
      update(value) { capturedUpdate = value; return this; },
      async single() { return { data: { ...campaign }, error: null }; },
      async order() { return { data: [{ ...campaign }], error: null }; },
      then(resolve) { return Promise.resolve({ data: table === 'crm_campaign_recipients' ? recipientRows : [campaign], error: null }).then(resolve); },
    };
  },
  async rpc(name) {
    if (name === 'crm_campaign_recipient_batches') {
      assert.equal(arguments[1].p_campaign_id, 1);
      assert.deepEqual(Array.from(arguments[1].p_recipient_ids), [10, 11, 12]);
      return { data: [{ recipient_id: '11', batch_number: 2 }, { recipient_id: 10, batch_number: 1 }], error: batchLookupError };
    }
    if (name === 'crm_save_campaign') {
      capturedUpdate = arguments[1].p_config;
      return { data: { ...campaign, ...capturedUpdate }, error: null };
    }
    assert.equal(name, 'crm_campaign_bounce_metrics'); calls++;
    return { data: [{ campaign_id: 1, original_sent_count: 5, archived_bounce_count: 2, bounce_rate: '40.0', history_complete: true }] };
  },
};
const route = compileModule(fs.readFileSync('app/other-modules/crm/api/campaigns/route.js', 'utf8'), name => {
  if (name === 'next/server') return { NextResponse: { json: (body, options) => Response.json(body, options) } };
  if (name === '@/utils/supabase/admin') return { adminClient };
  if (name === '@/utils/crm-bounce-metrics') return helpers;
  if (name === '@/utils/supabase/server') return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'test-user' } } }) } }) };
  if (name === '@/utils/crm-campaign-schedule') return compileModule(fs.readFileSync('utils/crm-campaign-schedule.js', 'utf8'));
  if (name === '@/utils/auth/context') return { resolveAuthenticatedUserContext: async () => ({}), buildModuleAccessState: () => ({ crm: { enabled: true } }) };
  throw new Error(`Unexpected import: ${name}`);
});
let response = await route.GET(new Request('https://test.invalid/campaigns'));
let body = await response.json();
assert.equal(response.status, 200);
assert.equal(body.campaigns[0].bounce_metrics.original_sent_count, 5);
assert.equal(helpers.getBounceKpi(body.campaigns[0]).label, '40%');
assert.equal(calls, 1);
response = await route.GET(new Request('https://test.invalid/campaigns?id=1'));
body = await response.json();
assert.equal(body.campaign.bounced_count, 0);
assert.equal(body.campaign.bounce_metrics.archived_bounce_count, 2);
assert.equal(body.recipients.length, 0);
assert.equal(calls, 2);
response = await route.PUT(new Request('https://test.invalid/campaigns', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ campaign_id: 1, campaign_name: 'Updated fixture', original_sent_count: 999, bounce_history_complete: true, bounce_metrics: { bounce_rate: 0 } }),
}));
assert.equal(response.status, 200);
assert.equal(capturedUpdate.campaign_name, 'Updated fixture');
assert.equal('original_sent_count' in capturedUpdate, false);
assert.equal('bounce_history_complete' in capturedUpdate, false);
assert.equal('bounce_metrics' in capturedUpdate, false);
console.log('Campaign API tests passed: archive KPI in list/detail, original counters preserved, client metric edits blocked.');

campaign.scheduler_version = 1;
recipientRows = [
  { recipient_id: 10, email_sent_to: 'first@example.invalid', delivery_status: 'Sent' },
  { recipient_id: 11, email_sent_to: 'second@example.invalid', delivery_status: 'Sent' },
  { recipient_id: 12, email_sent_to: 'pending@example.invalid', delivery_status: 'Pending' },
];
response = await route.GET(new Request('https://test.invalid/campaigns?id=1'));
body = await response.json();
assert.equal(response.status, 200);
assert.deepEqual(body.recipients.map(row => [row.email_sent_to, row.batch_number]), [
  ['first@example.invalid', 1], ['second@example.invalid', 2], ['pending@example.invalid', null],
]);
batchLookupError = { message: 'Batch lookup unavailable' };
response = await route.GET(new Request('https://test.invalid/campaigns?id=1'));
assert.equal(response.status, 500);
batchLookupError = null;
delete campaign.scheduler_version;
response = await route.GET(new Request('https://test.invalid/campaigns?id=1'));
body = await response.json();
assert.ok(body.recipients.every(row => row.batch_number === null));
console.log('Recipient batch tests passed: exact email mapping, reordered/numeric IDs, unassigned recipients, legacy campaigns and lookup failures.');
