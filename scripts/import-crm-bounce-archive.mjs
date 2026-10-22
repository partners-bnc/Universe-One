import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { parseCsv, extractBounceEntries } from './lib/crm-bounce-csv.mjs';

const filename = process.argv.find(arg => arg.endsWith('.csv'));
assert.ok(filename, 'Provide the ZeptoMail export CSV');
const rows = parseCsv(fs.readFileSync(filename, 'utf8'));
const { entries, skipped } = extractBounceEntries(rows, path.basename(filename));
const pairs = new Set(entries.map(e => `${e.campaign_id ?? 'unlinked'}|${e.email}`));
console.log(JSON.stringify({ csv_rows: rows.length, bounce_details: entries.length, archive_email_campaign_pairs: pairs.size,
  distinct_emails: new Set(entries.map(e => e.email)).size, skipped_nonbounce_rows: skipped,
  first_bounce: entries.map(e => e.bounced_at).sort()[0], last_bounce: entries.map(e => e.bounced_at).sort().at(-1),
  timestamp_timezone: 'Asia/Kolkata', import: process.argv.includes('--import') }));
if (!process.argv.includes('--import')) process.exit(0);
const env = dotenv.parse(fs.readFileSync('.env.local'));
assert.equal(new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname, 'llfoaqnljjbneouiedbg.supabase.co');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
for (let offset = 0; offset < entries.length; offset += 500) {
  const { data, error } = await supabase.rpc('crm_import_bounce_archive', { p_entries: entries.slice(offset, offset + 500) });
  if (error) throw error;
  console.log(JSON.stringify(data));
}
const { error } = await supabase.rpc('crm_request_bounce_cleanup');
if (error) throw error;
console.log('Imported bounces are archived and suppressed; cleanup wakeup queued.');
