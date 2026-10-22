import { createClient } from 'npm:@supabase/supabase-js@2.95.3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const PROVIDER = 'zeptomail';

type AnyRecord = Record<string, unknown>;

function jsonResponse(status: number, body: AnyRecord) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

function text(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  return null;
}

function getPath(source: AnyRecord, path: string[]): unknown {
  let current: unknown = source;
  for (const key of path) current = asRecord(current)[key];
  return current;
}

function intValue(value: unknown): number | null {
  const raw = text(value);
  return raw && /^\d+$/.test(raw) ? Number(raw) : null;
}

function normalizeEventName(value: string | null): string {
  const event = (value ?? '').toLowerCase().replace(/[\s_-]+/g, '');
  if (['open', 'opened', 'emailopen', 'emailopened'].includes(event)) return 'opened';
  if (['click', 'clicked', 'emailclick', 'emailclicked'].includes(event)) return 'clicked';
  if (['softbounce', 'hardbounce', 'bounce', 'bounced', 'emailbounce', 'emailbounced', 'emailsoftbounce', 'emailhardbounce'].includes(event)) return 'bounced';
  if (['feedbackloop', 'complaint', 'complained', 'spam', 'emailcomplaint', 'emailspam'].includes(event)) return 'complained';
  if (['unsubscribe', 'unsubscribed', 'emailunsubscribe', 'emailunsubscribed'].includes(event)) return 'unsubscribed';
  if (['delivered', 'delivery', 'emaildelivered', 'emaildelivery'].includes(event)) return 'delivered';
  if (['sent', 'processed', 'emailsent', 'emailprocessed'].includes(event)) return 'sent';
  if (['deferred', 'deferral', 'emaildeferred'].includes(event)) return 'deferred';
  if (['dropped', 'drop', 'emaildropped'].includes(event)) return 'dropped';
  return 'unknown';
}

function extractEmail(message: AnyRecord): string | null {
  const direct = text(message.email) ?? text(message.recipient) ?? text(message.recipient_email) ?? text(message.email_address);
  if (direct) return direct.toLowerCase();

  for (const item of asArray(getPath(message, ['email_info', 'to']))) {
    const address = text(getPath(asRecord(item), ['email_address', 'address'])) ?? text(asRecord(item).address);
    if (address) return address.toLowerCase();
  }

  const firstDetail = asRecord(asArray(getPath(asRecord(asArray(message.event_data)[0]), ['details']))[0]);
  const detailAddress = text(getPath(firstDetail, ['recipient_info', 'address']));
  return detailAddress ? detailAddress.toLowerCase() : null;
}

function parseReferenceObject(raw: string | null): AnyRecord {
  if (!raw) return {};
  try { return asRecord(JSON.parse(raw)); } catch (_) {}
  if (!raw.includes('=')) return {};
  const params = new URLSearchParams(raw.replace(/^\?/, ''));
  const out: AnyRecord = {};
  for (const [key, value] of params.entries()) out[key] = value;
  return out;
}

function extractClientReference(message: AnyRecord, body: AnyRecord): string | null {
  return text(message.client_reference)
    ?? text(getPath(message, ['email_info', 'client_reference']))
    ?? text(body.client_reference)
    ?? text(getPath(body, ['email_info', 'client_reference']));
}

function extractId(message: AnyRecord, body: AnyRecord, key: 'campaign' | 'recipient' | 'lead'): number | null {
  const keys = key === 'campaign'
    ? ['campaign_id', 'campaignId', 'crm_campaign_id']
    : key === 'recipient'
      ? ['recipient_id', 'recipientId', 'crm_recipient_id']
      : ['lead_id', 'leadId', 'crm_lead_id'];

  for (const source of [message, body, asRecord(message.custom_args), asRecord(message.metadata), asRecord(body.custom_args), asRecord(body.metadata)]) {
    for (const k of keys) {
      const found = intValue(source[k]);
      if (found !== null) return found;
    }
  }

  const reference = extractClientReference(message, body);
  const parsed = parseReferenceObject(reference);
  for (const k of keys) {
    const found = intValue(parsed[k]);
    if (found !== null) return found;
  }
  return null;
}

function extractProviderMessageId(message: AnyRecord, body: AnyRecord): string | null {
  return text(message.email_reference)
    ?? text(getPath(message, ['email_info', 'email_reference']))
    ?? text(message.message_id)
    ?? text(message.request_id)
    ?? text(body.email_reference)
    ?? text(body.mailagent_key)
    ?? null;
}

function extractUrl(message: AnyRecord): string | null {
  const direct = text(message.url) ?? text(message.link) ?? text(message.clicked_url) ?? text(message.redirect_url);
  if (direct) return direct;
  const firstDetail = asRecord(asArray(getPath(asRecord(asArray(message.event_data)[0]), ['details']))[0]);
  return text(firstDetail.url) ?? text(firstDetail.link) ?? text(firstDetail.clicked_url);
}

function extractOccurredAt(message: AnyRecord, body: AnyRecord): string {
  const firstDetail = asRecord(asArray(getPath(asRecord(asArray(message.event_data)[0]), ['details']))[0]);
  const raw = text(firstDetail.time)
    ?? text(firstDetail.modified_time)
    ?? text(message.event_time)
    ?? text(message.timestamp)
    ?? text(getPath(message, ['email_info', 'processed_time']))
    ?? text(body.event_time)
    ?? text(body.timestamp);
  if (!raw) return new Date().toISOString();
  const numeric = /^\d+$/.test(raw) ? Number(raw) : null;
  if (numeric !== null) return new Date(numeric > 9999999999 ? numeric : numeric * 1000).toISOString();
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function fingerprint(parts: unknown[]): Promise<string> {
  const source = parts.map((part) => text(part) ?? '').join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (req.method !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return jsonResponse(500, { error: 'Missing Supabase service configuration' });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const suppliedSecret = req.headers.get('x-zeptomail-webhook-secret') ?? req.headers.get('x-webhook-secret') ?? (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
  const { data: authorized, error: authError } = await supabase.rpc('crm_verify_bounce_webhook_secret', { p_secret: suppliedSecret });
  if (authError) return jsonResponse(503, { error: 'Webhook authentication unavailable' });
  if (!authorized) return jsonResponse(401, { error: 'Unauthorized' });

  const body = asRecord(await req.json().catch(() => null));
  if (!Object.keys(body).length) return jsonResponse(400, { error: 'Invalid JSON payload' });

  const eventNames = asArray(body.event_name).map((value) => text(value)).filter(Boolean) as string[];
  const messages = asArray(body.event_message).length ? asArray(body.event_message) : [body];
  const results = [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = asRecord(messages[index]);
    const rawEventName = text(message.event_name) ?? text(message.event) ?? text(message.event_type) ?? eventNames[index] ?? eventNames[0] ?? 'unknown';
    const eventType = normalizeEventName(rawEventName);
    const bounceDetails = asArray(message.event_data).flatMap(event => asArray(asRecord(event).details));
    const addresses = eventType === 'bounced'
      ? [...new Set(bounceDetails.map(detail => text(asRecord(detail).bounced_recipient)).filter((v): v is string => !!v).map(v => v.toLowerCase()))]
      : [extractEmail(message)].filter((v): v is string => !!v);
    if (addresses.length === 0) { results.push({ ok: false, event_type: eventType, error: 'Missing event recipient' }); continue; }
    for (const email of addresses) {
    const providerMessageId = extractProviderMessageId(message, body);
    const url = extractUrl(message);
    const bounceDetail = asRecord(bounceDetails.find(detail => text(asRecord(detail).bounced_recipient)?.toLowerCase() === email));
    const occurredAt = extractOccurredAt(eventType === 'bounced' ? { ...message, event_data: [{ details: [bounceDetail] }] } : message, body);
    const rawKind = [rawEventName, ...asArray(message.event_data).map(event => text(asRecord(event).object))].join(' ').toLowerCase();
    const reason = text(bounceDetail.reason);
    const diagnostic = text(bounceDetail.diagnostic_message);
    const bounceMetadata = eventType === 'bounced' ? {
      bounce_type: rawKind.includes('hard') ? 'hard' : rawKind.includes('soft') ? 'soft' : 'unknown',
      reason: reason && diagnostic ? `${reason}: ${diagnostic}` : diagnostic ?? reason ?? 'Not retained',
      subject: text(getPath(message, ['email_info', 'subject'])),
    } : null;
    const campaignId = extractId(message, body, 'campaign');
    const recipientId = extractId(message, body, 'recipient');
    const leadId = extractId(message, body, 'lead');
    const eventFingerprint = await fingerprint([PROVIDER, text(body.webhook_request_id) ?? text(message.request_id), rawEventName, providerMessageId, email, url, occurredAt, index]);

    const { data, error } = await supabase.rpc('record_crm_email_tracking_event', {
      p_provider: PROVIDER,
      p_event_fingerprint: eventFingerprint,
      p_event_type: eventType,
      p_email: email,
      p_provider_message_id: providerMessageId,
      p_url: url,
      p_occurred_at: occurredAt,
      p_payload: { ...body, raw_event_name: rawEventName, event_message_item: message, crm_authenticated: true, crm_bounce_metadata: bounceMetadata },
      p_campaign_id: campaignId,
      p_recipient_id: recipientId,
      p_lead_id: leadId,
    });

    if (error) {
      console.error('Failed to record ZeptoMail tracking event', { code: error.code, eventType });
      results.push({ ok: false, event_type: eventType });
    } else {
      results.push({ ok: true, event_type: eventType, ignored: data?.ignored === true });
    }
  }

  }
  // A late bounce can be cleaned immediately; running campaigns remain queued.
  if (results.some(result => result.ok && result.event_type === 'bounced' && !result.ignored)) {
    const { error: wakeupError } = await supabase.rpc('crm_request_bounce_cleanup');
    if (wakeupError) console.error('CRM cleanup invocation deferred to scheduled retry', { code: wakeupError.code });
  }
  const failed = results.filter((result) => !result.ok).length;
  return jsonResponse(failed ? 503 : 200, { success: failed === 0, provider: PROVIDER, received: messages.length, recorded: results.length - failed, failed, results });
});
