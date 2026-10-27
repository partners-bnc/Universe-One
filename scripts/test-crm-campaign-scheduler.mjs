import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function compile(file, require = () => { throw new Error('Unexpected import'); }) {
  const target = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module: target, exports: target.exports, require, Date, Number, Intl, Object, Error, Promise, AbortSignal, fetch, console });
  return target.exports;
}
const schedule = compile('utils/crm-campaign-schedule.js');
assert.equal(schedule.scheduledIstToUtc('2026-10-25', '09:30'), '2026-10-25T04:00:00.000Z');
assert.throws(() => schedule.scheduledIstToUtc('2026-02-30', '09:30'));
assert.throws(() => schedule.scheduledIstToUtc('2026-10-25', ''));
assert.throws(() => schedule.validateCampaignConfig({ status: 'Scheduled' }));
assert.throws(() => schedule.validateCampaignConfig({ status: 'Running', scheduled_at: '2020-01-01' }));
assert.equal(schedule.validateCampaignConfig({ status: 'Draft', scheduled_at: '2020-01-01' }).scheduled_at, '2020-01-01T00:00:00.000Z');
assert.throws(() => schedule.validateCampaignConfig({ batching_enabled: true, first_batch_size: 0, repeat_batch_size: 10, batch_interval_minutes: 2 }));
assert.throws(() => schedule.validateCampaignConfig({ batching_enabled: true, first_batch_size: 1.5, repeat_batch_size: 10, batch_interval_minutes: 2 }));
const template = compile('supabase/functions/_shared/campaign-template.ts');
const { sendCampaignChunk } = compile('supabase/functions/crm-campaign-send/worker.ts', () => template);
const jobs = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, email: `test-${i}@example.invalid`, lead_id: i + 1, recipient_id: i + 1,
  lead_snapshot: { full_name: 'Jane Doe', company_name: 'Example' } }));
const base = { campaignId: 1, token: 'test', chunk: { jobs, subject: 'Hi {{FirstName}}', body: '{{Company}}', format: 'text' },
  providerToken: 'test-token', from: { address: 'sender@example.invalid', name: 'Test' } };
let active = 0, maximum = 0, sends = 0;
const outcomes = [];
await sendCampaignChunk({ ...base, rpc: async (name, args) => {
  if (name === 'crm_begin_campaign_send') return args.p_job_id !== 2; // suppressed
  outcomes.push(args);
}, fetcher: async (_url, options) => {
  active++; maximum = Math.max(maximum, active); sends++;
  const payload = JSON.parse(options.body);
  assert.equal(payload.subject, 'Hi Jane'); assert.equal(payload.textbody, 'Example');
  assert.match(payload.client_reference, /campaign_id=1&recipient_id=/);
  await new Promise(resolve => setTimeout(resolve, 2)); active--;
  return Response.json({ request_id: 'provider-id' });
} });
assert.equal(sends, 11); assert.ok(maximum <= 5); assert.equal(outcomes.length, 11);
assert.ok(outcomes.every(item => item.p_outcome === 'Sent' && item.p_provider_id === 'provider-id'));
for (const [status, expected] of [[429, 'Retry'], [400, 'Failed'], [500, 'Uncertain']]) {
  let outcome;
  await sendCampaignChunk({ ...base, chunk: { ...base.chunk, jobs: [jobs[0]] }, rpc: async (name, args) => {
    if (name === 'crm_begin_campaign_send') return true; outcome = args;
  }, fetcher: async () => new Response('', { status, headers: { 'Retry-After': '120' } }) });
  assert.equal(outcome.p_outcome, expected);
  if (status === 429) assert.equal(outcome.p_delay_seconds, 120);
}
let uncertain;
await sendCampaignChunk({ ...base, chunk: { ...base.chunk, jobs: [jobs[0]] }, rpc: async (name, args) => {
  if (name === 'crm_begin_campaign_send') return true; uncertain = args;
}, fetcher: async () => { throw new Error('Timeout after provider accepted'); } });
assert.equal(uncertain.p_outcome, 'Uncertain');
let requested = false;
await sendCampaignChunk({ ...base, rpc: async () => { throw new Error('Unexpected RPC'); }, fetcher: async () => { requested = true; },
  now: (() => { let calls = 0; return () => calls++ ? 50001 : 0; })() });
assert.equal(requested, false);
console.log('Campaign schedule and worker tests passed: IST, validation, suppression, concurrency, tracking, rate limits, uncertain acceptance and time budget.');
