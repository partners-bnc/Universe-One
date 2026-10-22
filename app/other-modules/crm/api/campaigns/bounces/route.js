import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext, buildModuleAccessState } from '@/utils/auth/context';

export async function GET(request) {
  try {
    const session = await createClient();
    const { data: { user }, error: authError } = await session.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Sign in to view bounced emails.' }, { status: 401 });
    const context = await resolveAuthenticatedUserContext(session, user);
    if (!buildModuleAccessState(context).crm.enabled) {
      return NextResponse.json({ error: 'CRM access is required.' }, { status: 403 });
    }
    const params = new URL(request.url).searchParams;
    const page = Number(params.get('page') || 1);
    const limit = Number(params.get('limit') || 50);
    const type = params.get('type') || '';
    const campaign = params.get('campaign') || '';
    const search = (params.get('search') || '').trim();
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || !Number.isInteger(limit) || limit < 1 || limit > 100
      || !['', 'hard', 'soft', 'unknown'].includes(type) || (campaign && !/^(\d+|unlinked)$/.test(campaign)) || search.length > 320) {
      return NextResponse.json({ error: 'Invalid archive filters.' }, { status: 400 });
    }
    const { data, error } = await adminClient.rpc('crm_list_bounce_archive', {
      p_search: search, p_campaign: campaign, p_type: type, p_page: page, p_limit: limit,
    });
    if (error) {
      console.error('Bounce archive query failed', { code: error.code });
      return NextResponse.json({ error: 'Unable to load bounced emails. Please retry.' }, { status: 500 });
    }
    return NextResponse.json({ ...data, page, limit }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return NextResponse.json({ error: 'Unable to load bounced emails. Please retry.' }, { status: 500 });
  }
}
