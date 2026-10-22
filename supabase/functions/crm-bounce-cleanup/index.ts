import { createClient } from 'npm:@supabase/supabase-js@2.95.3';

const url = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function respond(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function isServiceRole(req: Request) {
  // Deployment MUST keep verify_jwt=true: the Supabase gateway verifies the
  // signature before this role check. Valid rotated server JWTs may differ
  // from the runtime's injected service key.
  try {
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(encoded));
    return claims.role === 'service_role' && claims.ref === new URL(url).hostname.split('.')[0];
  } catch { return false; }
}

Deno.serve(async req => {
  if (req.method !== 'POST') return respond(405, { error: 'Method not allowed' });
  if (!url || !serviceKey) return respond(503, { error: 'Service configuration unavailable' });
  if (!isServiceRole(req)) {
    return respond(401, { error: 'Unauthorized' });
  }
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const started = Date.now();
  const { data, error } = await supabase.rpc('crm_process_bounce_cleanup', { p_limit: 100 });
  if (error) {
    console.error('CRM bounce cleanup failed', { code: error.code, duration_ms: Date.now() - started });
    return respond(503, { error: 'Cleanup failed; scheduled retry remains enabled' });
  }
  console.info('CRM bounce cleanup completed', { ...data, duration_ms: Date.now() - started });
  return respond(200, { success: true, ...data });
});
