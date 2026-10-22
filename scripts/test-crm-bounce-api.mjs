import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

let signedIn = false, crmAccess = false, rpcCalls = 0, databaseError = false, captured;
const routeModule = { exports: {} };
const compiled = ts.transpileModule(fs.readFileSync('app/other-modules/crm/api/campaigns/bounces/route.js', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
vm.runInNewContext(compiled.outputText, {
  module: routeModule, exports: routeModule.exports, URL, console,
  require(name) {
    if (name === 'next/server') return { NextResponse: { json: (value, options) => Response.json(value, options) } };
    if (name.endsWith('/server')) return { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: signedIn ? { id: 'test' } : null } }) } }) };
    if (name.endsWith('/context')) return { resolveAuthenticatedUserContext: async () => ({}), buildModuleAccessState: () => ({ crm: { enabled: crmAccess } }) };
    if (name.endsWith('/admin')) return { adminClient: { rpc: async (method, params) => {
      rpcCalls++; captured = params;
      assert.equal(method, 'crm_list_bounce_archive');
      return databaseError ? { error: { code: 'TEST' } } : { data: { rows: [], total: 0, archive_total: 174 } };
    } } };
    throw new Error(`Unexpected import ${name}`);
  },
});
const get = query => routeModule.exports.GET(new Request(`https://test.invalid/bounces?${query}`));
assert.equal((await get('')).status, 401);
signedIn = true;
assert.equal((await get('')).status, 403);
assert.equal(rpcCalls, 0);
crmAccess = true;
for (const invalid of ['page=0', 'limit=1000', 'type=invalid', 'campaign=1%20OR%201=1', 'page=1.2']) {
  assert.equal((await get(invalid)).status, 400);
}
assert.equal(rpcCalls, 0);
const response = await get('search=test%40example.invalid&campaign=46&type=hard&page=2');
assert.equal(response.status, 200);
assert.equal(response.headers.get('cache-control'), 'private, no-store');
assert.equal(captured.p_search, 'test@example.invalid');
assert.equal(captured.p_page, 2);
assert.equal(captured.p_limit, 50);
assert.equal(captured.p_campaign, '46');
databaseError = true;
assert.equal((await get('')).status, 500);
console.log('Archive API tests passed: authentication, CRM authorization, filters, pagination, private caching and errors.');
