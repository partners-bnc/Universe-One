import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const helperSource = fs.readFileSync('utils/crm-bounce-metrics.js', 'utf8');
const helperModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
  { module: helperModule, exports: helperModule.exports });
const { getBounceKpi, attachCampaignBounceMetrics } = helperModule.exports;
const campaign = { campaign_id: 1, sent_count: 3, bounced_count: 0, bounce_metrics: {
  original_sent_count: 5, archived_bounce_count: 2, bounce_rate: 40, history_complete: true,
} };
assert.equal(getBounceKpi(campaign).label, '40%');
assert.equal(getBounceKpi({ ...campaign, sent_count: 0 }).label, '40%');
assert.equal(getBounceKpi({ sent_count: 1186, bounce_metrics: { original_sent_count: null, archived_bounce_count: 30, bounce_rate: 2.5, history_complete: false } }).label, '2.5%');
assert.equal(getBounceKpi({ sent_count: 1186, bounce_metrics: { original_sent_count: null, archived_bounce_count: 30, history_complete: false } }).label, '2.5%');
assert.equal(getBounceKpi({ sent_count: 100, bounce_metrics: { original_sent_count: null, archived_bounce_count: 14, history_complete: false } }).note, 'Based on available data');
assert.equal(getBounceKpi({ bounce_metrics: { original_sent_count: 0, archived_bounce_count: 0, history_complete: true } }).caption, 'No emails sent');
assert.equal(getBounceKpi({ bounce_metrics: { original_sent_count: 6, archived_bounce_count: 2, bounce_rate: 33.3, history_complete: true } }).label, '33.3%');
assert.equal(getBounceKpi({}).label, '—');
assert.equal(getBounceKpi({ sent_count: 2, bounce_metrics: { original_sent_count: null, archived_bounce_count: 3, bounce_rate: 150, history_complete: false } }).label, '150%');
assert.equal(getBounceKpi({ sent_count: 3, bounce_metrics: { original_sent_count: null, archived_bounce_count: 0, history_complete: false } }).label, '0%');
let calls = 0;
const enriched = await attachCampaignBounceMetrics({ rpc: async (name, params) => {
  calls++;
  assert.equal(name, 'crm_campaign_bounce_metrics');
  assert.equal(params.p_campaign_ids.join(','), '1,2');
  return { data: [{ campaign_id: 1, ...campaign.bounce_metrics }, { campaign_id: 2, original_sent_count: null, history_complete: false }] };
} }, [{ campaign_id: 1 }, { campaign_id: 2 }]);
assert.equal(calls, 1);
assert.equal(getBounceKpi(enriched[0]).label, '40%');
assert.equal(getBounceKpi(enriched[1]).label, '—');
await assert.rejects(() => attachCampaignBounceMetrics({ rpc: async () => ({ error: new Error('Database unavailable') }) }, [{ campaign_id: 1 }]));
console.log('Bounce KPI tests passed: preserved denominator, current-data fallback, partial history, zero sends, rounding and batched enrichment.');
