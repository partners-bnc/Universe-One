import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(file, require) {
  const target = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { module: target, exports: target.exports, require, Number, Object, Date, URL, console });
  return target.exports;
}
let signedIn = true, hasAccess = true, saved, wakeups = 0;
let current = { campaign_id: 2, campaign_name: 'Fixture', status: 'Running', scheduler_version: 1 };
const adminClient = {
  from() { return { select() { return this; }, eq() { return this; }, single: async () => ({ data: current }) }; },
  async rpc(name, args) {
    if (name === 'crm_request_campaign_dispatch') { wakeups++; return {}; }
    assert.equal(name, 'crm_save_campaign');
    saved = args;
    return { data: { ...current, ...args.p_config, scheduler_version: args.p_config.status === 'Draft' ? null : 1 } };
  },
};
const schedule = compile('utils/crm-campaign-schedule.js');
const route = compile('app/other-modules/crm/api/campaigns/route.js', name => {
  if (name === 'next/server') return { NextResponse: { json: (body, options) => Response.json(body, options) } };
  if (name === '@/utils/supabase/admin') return { adminClient };
  if (name === '@/utils/supabase/server') return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: signedIn ? { id: 'test', email: 'test@example.invalid' } : null } }) } }) };
  if (name === '@/utils/auth/context') return { resolveAuthenticatedUserContext: async () => ({}), buildModuleAccessState: () => ({ crm: { enabled: hasAccess } }) };
  if (name === '@/utils/crm-campaign-schedule') return schedule;
  if (name === '@/utils/crm-bounce-metrics') return { attachCampaignBounceMetrics: async (_client, campaigns) => campaigns };
  throw new Error(`Unexpected import ${name}`);
});
const request = body => new Request('https://test.invalid/campaigns', { method: 'POST', body: JSON.stringify(body) });
signedIn = false;
assert.equal((await route.POST(request({}))).status, 401);
signedIn = true; hasAccess = false;
assert.equal((await route.POST(request({}))).status, 403);
hasAccess = true;
const base = { campaign_name: 'Scheduled fixture', template_id: 1, email_format: 'html', status: 'Scheduled',
  scheduled_at: '2099-10-25T04:00:00.000Z', target_filter: { target_lead_ids: [1, 2] }, batching_enabled: true,
  first_batch_size: 1000, repeat_batch_size: 10000, batch_interval_minutes: 120 };
assert.equal((await route.POST(request(base))).status, 200);
assert.equal(saved.p_config.schedule_timezone, 'Asia/Kolkata');
assert.equal(saved.p_config.scheduled_at, base.scheduled_at);
assert.equal(wakeups, 1);
assert.equal((await route.POST(request({ ...base, status: 'Draft' }))).status, 200);
assert.equal(saved.p_config.status, 'Draft'); assert.equal(wakeups, 1);
assert.equal((await route.POST(request({ ...base, first_batch_size: -1 }))).status, 400);
assert.equal((await route.POST(request({ ...base, scheduled_at: null }))).status, 400);
assert.equal((await route.POST(request({ ...base, scheduled_at: '2020-01-01' }))).status, 400);
assert.equal((await route.POST(request({ ...base, target_filter: { target_lead_ids: ['invalid'] } }))).status, 400);
current = { campaign_id: 2, status: 'Paused', scheduler_version: 1 };
assert.equal((await route.PUT(request({ campaign_id: 2, status: 'Running', sent_count: 10000, next_run_at: '2020-01-01', scheduler_version: 9 }))).status, 200);
assert.deepEqual(Object.keys(saved.p_config), ['status']);
assert.equal(saved.p_campaign_id, 2);
console.log('Campaign API scheduling tests passed: authentication, CRM access, drafts, future schedules, batching validation and protected worker fields.');
