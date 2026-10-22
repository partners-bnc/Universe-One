import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('supabase/functions/zeptomail-tracking-webhook/index.ts', 'utf8')
  .replace(/^import .*createClient.*;\r?\n/m, '');
const javascript = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 }, reportDiagnostics: true });
assert.equal(javascript.diagnostics.length, 0);
let handler, allow = true, failure = false;
const recorded = [];
const sandbox = {
  Request, Response, TextEncoder, URLSearchParams, crypto, console,
  fetch: async () => new Response('{}', { status: 200 }),
  Deno: { env: { get: () => 'configured' }, serve: fn => { handler = fn; } },
  createClient: () => ({ rpc: async (name, args) => {
    if (name === 'crm_verify_bounce_webhook_secret') return { data: allow, error: null };
    if (name === 'crm_request_bounce_cleanup') return { data: 1, error: null };
    recorded.push(args);
    return failure ? { error: { code: 'TEST' } } : { data: { inserted: true }, error: null };
  } }),
};
vm.runInNewContext(javascript.outputText, sandbox);
function request(body) {
  return new Request('https://test.invalid', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-zeptomail-webhook-secret': 'test' }, body: JSON.stringify(body) });
}
const body = { event_name: ['softbounce'], event_message: [{
  email_info: { to: [{ email_address: { address: 'valid@example.invalid' } }] },
  event_data: [{ details: [
    { bounced_recipient: 'BOUNCE1@example.invalid', reason: 'quota', diagnostic_message: 'Mailbox full', time: '2026-10-21T10:00:00Z' },
    { bounced_recipient: 'bounce2@example.invalid', reason: 'routing', time: '2026-10-21T11:00:00Z' },
  ] }],
}] };
allow = false;
assert.equal((await handler(request(body))).status, 401);
assert.equal(recorded.length, 0);
allow = true;
assert.equal((await handler(request(body))).status, 200);
assert.deepEqual(recorded.map(r => r.p_email), ['bounce1@example.invalid', 'bounce2@example.invalid']);
assert.ok(recorded.every(r => r.p_payload.crm_authenticated === true));
assert.equal(recorded[0].p_payload.crm_bounce_metadata.bounce_type, 'soft');
assert.equal(recorded[0].p_payload.crm_bounce_metadata.reason, 'quota: Mailbox full');
assert.equal(recorded[1].p_payload.crm_bounce_metadata.reason, 'routing');
assert.equal(recorded[1].p_occurred_at, '2026-10-21T11:00:00.000Z');
failure = true;
assert.equal((await handler(request(body))).status, 503);
failure = false;
body.event_name = ['hardbounce'];
assert.equal((await handler(request(body))).status, 200);
console.log('Webhook tests passed: authorization, exact bounce recipients, multiple recipients, soft/hard events, retryable errors.');
