import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const KEYS = ['show_greeting', 'show_date_card', 'show_attendance_notice', 'show_festive_decor'];
const DEFAULTS = {
  show_greeting: true,
  show_date_card: true,
  show_attendance_notice: true,
  show_festive_decor: false,
};

async function requireHrAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  if (!authContext?.isHrAdmin) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { authContext, user };
}

export async function GET() {
  const auth = await requireHrAdminAccess();
  if (auth.error) return auth.error;

  const { data, error } = await adminClient.from('hrm_home_settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    return NextResponse.json(
      { error: 'Home settings table is not set up yet. Please run the latest database migration.', settings: DEFAULTS, setupPending: true },
      { status: 200 }
    );
  }

  return NextResponse.json({ settings: { ...DEFAULTS, ...(data || {}) }, updatedAt: data?.updated_at || null, updatedBy: data?.updated_by || null });
}

export async function PUT(request) {
  const auth = await requireHrAdminAccess();
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => ({}));
  const patch = {};
  for (const key of KEYS) {
    if (typeof body?.[key] === 'boolean') patch[key] = body[key];
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from('hrm_home_settings')
    .upsert(
      { id: 1, ...patch, updated_by: auth.user.email || auth.user.id, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }

  return NextResponse.json({ settings: { ...DEFAULTS, ...data } });
}
