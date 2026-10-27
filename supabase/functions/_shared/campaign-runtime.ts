import { createClient } from 'npm:@supabase/supabase-js@2.95.3';

export function response(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export function authorize(req: Request) {
  if (req.method !== 'POST') return response(405, { error: 'Method not allowed' });
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!url || !key) return response(503, { error: 'Service configuration unavailable' });
  // verify_jwt=true is mandatory: the gateway verifies the JWT signature before
  // this additional role/project check, including rotated service-role tokens.
  try {
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
    const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (claims.role === 'service_role' && claims.ref === new URL(url).hostname.split('.')[0]) return null;
  } catch { /* malformed credentials */ }
  return response(401, { error: 'Unauthorized' });
}

export function client() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
