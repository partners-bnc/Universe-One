// Strict CSV parsing for provider exports; quoted commas/newlines are preserved.
export function parseCsv(input) {
  const rows = []; let row = [], field = '', quoted = false;
  const text = input.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); if (row.some(v => v.length)) rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Unterminated quoted CSV field');
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift() ?? [];
  for (const key of ['HARD BOUNCE', 'SOFT BOUNCE', 'CLIENT REFERENCE', 'MAIL REFERENCE', 'SUBJECT']) {
    if (!headers.includes(key)) throw new Error(`Missing provider CSV column: ${key}`);
  }
  return rows.map((values, i) => {
    if (values.length !== headers.length) throw new Error(`CSV row ${i + 2} has an unexpected column count`);
    return Object.fromEntries(headers.map((key, n) => [key, values[n]]));
  });
}

export function parseProviderTime(value) {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)$/i);
  if (!m) throw new Error(`Unrecognized provider timestamp: ${value}`);
  const [, day, month, year, hour, minute, second, period] = m;
  const h = Number(hour) % 12 + (period.toUpperCase() === 'PM' ? 12 : 0);
  const local = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), h, Number(minute), Number(second)));
  if (Number(hour) < 1 || Number(hour) > 12 || local.getUTCDate() !== Number(day) || local.getUTCMonth() + 1 !== Number(month)
    || Number(minute) > 59 || Number(second) > 59) throw new Error('Invalid provider timestamp');
  // This IN-DC account exports in Asia/Kolkata (UTC+05:30).
  return new Date(local.getTime() - 330 * 60000).toISOString();
}

export function extractBounceEntries(rows, source) {
  const entries = []; let skipped = 0;
  for (const [index, row] of rows.entries()) {
    const ref = new URLSearchParams(row['CLIENT REFERENCE']);
    const rawId = ref.get('campaign_id');
    const campaignId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
    let found = false;
    for (const [column, type] of [['SOFT BOUNCE', 'soft'], ['HARD BOUNCE', 'hard']]) {
      const value = row[column]?.trim();
      if (!value || value === '-') continue;
      const matches = [...value.matchAll(/Time:\s*(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} [AP]M),\s*Recipient:\s*([^,]+),\s*Reason:\s*([\s\S]*?)(?=(?:[;\r\n]+\s*)?Time:\s*\d{2}\/|$)/gi)];
      if (!matches.length) throw new Error(`Unrecognized ${column} details on CSV row ${index + 2}`);
      for (const [, when, rawEmail, reason] of matches) {
        const email = rawEmail.trim().toLowerCase();
        if (!/^[^@\s,;<>]+@[^@\s,;<>]+\.[^@\s,;<>]+$/.test(email)) throw new Error(`Invalid bounce recipient on CSV row ${index + 2}`);
        entries.push({ email, campaign_id: campaignId, bounce_type: type, reason: reason.trim(),
          bounced_at: parseProviderTime(when), subject: row.SUBJECT || null,
          provider_message_id: row['MAIL REFERENCE'] || null, source });
        found = true;
      }
    }
    if (!found) skipped++;
  }
  return { entries, skipped };
}
