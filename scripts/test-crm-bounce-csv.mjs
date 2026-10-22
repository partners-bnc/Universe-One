import assert from 'node:assert/strict';
import { parseCsv, parseProviderTime, extractBounceEntries } from './lib/crm-bounce-csv.mjs';

assert.equal(parseProviderTime('03/10/2026 02:48:45 PM'), '2026-10-03T09:18:45.000Z');
assert.equal(parseProviderTime('01/10/2026 12:00:00 AM'), '2026-09-30T18:30:00.000Z');
assert.throws(() => parseProviderTime('31/02/2026 02:48:45 PM'));
const csv = '\uFEFFHARD BOUNCE,SOFT BOUNCE,CLIENT REFERENCE,MAIL REFERENCE,SUBJECT\r\n"Time: 03/10/2026 02:48:45 PM, Recipient: TEST@example.invalid, Reason: bad mailbox, retry failed",-,campaign_id=46&lead_id=1,id,"Quoted ""subject""\nnext line"\r\n';
const rows = parseCsv(csv);
assert.equal(rows[0].SUBJECT, 'Quoted "subject"\nnext line');
const result = extractBounceEntries(rows, 'test.csv');
assert.equal(result.entries.length, 1);
assert.equal(result.entries[0].email, 'test@example.invalid');
assert.equal(result.entries[0].reason, 'bad mailbox, retry failed');
assert.equal(result.entries[0].campaign_id, 46);
assert.equal(result.entries[0].bounce_type, 'hard');
assert.throws(() => parseCsv(csv + '"unterminated'));
assert.throws(() => extractBounceEntries([{ ...rows[0], 'HARD BOUNCE': 'malformed' }], 'bad.csv'));
assert.equal(extractBounceEntries([{ ...rows[0], 'HARD BOUNCE': '-' }], 'test.csv').skipped, 1);
console.log('CSV tests passed: quoting, newlines, timezone, invalid dates, exact recipients, reasons and validation.');
