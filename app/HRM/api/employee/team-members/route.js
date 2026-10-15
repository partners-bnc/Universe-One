import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

export const dynamic = 'force-dynamic';

function isUuid(str) {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData?.user) {
      return NextResponse.json({ team_members: [] }, { status: 200 });
    }

    const userId = authData.user.id;
    let employeeUUID = null;

    // Check optional query param first
    try {
      const url = new URL(request.url);
      const queryManagerId = url.searchParams.get('managerId');
      if (queryManagerId && isUuid(queryManagerId)) {
        employeeUUID = queryManagerId.trim();
      }
    } catch {
      // ignore URL parsing error
    }

    // If not supplied via query param, resolve via auth context
    if (!employeeUUID) {
      try {
        const authContext = await resolveAuthenticatedUserContext(supabase, authData.user);
        if (authContext?.employee?.id) {
          employeeUUID = authContext.employee.id;
        }
      } catch {
        // ignore
      }
    }

    // Fallback: search hrm_employees by auth_user_id or email
    if (!employeeUUID) {
      const { data: emp } = await adminClient
        .from('hrm_employees')
        .select('id')
        .or(`auth_user_id.eq.${userId},email.ilike.${authData.user.email}`)
        .maybeSingle();

      employeeUUID = emp?.id || null;
    }

    // Fallback to user metadata
    if (!employeeUUID && authData.user.user_metadata?.employee_uuid) {
      const metaUuid = authData.user.user_metadata.employee_uuid;
      if (isUuid(metaUuid)) {
        employeeUUID = metaUuid;
      }
    }

    if (!employeeUUID) {
      return NextResponse.json({ team_members: [] }, { status: 200 });
    }

    // Fetch direct reportees where reporting_manager_id matches manager's UUID
    const { data: members, error: membersError } = await adminClient
      .from('hrm_employees')
      .select('id, employee_id, name, email, profile_picture_url, employee_status, employment_lifecycle_status, separated_at, access_disabled_at')
      .eq('reporting_manager_id', employeeUUID)
      .is('access_disabled_at', null)
      .is('separated_at', null)
      .order('name', { ascending: true });

    if (membersError) {
      console.error('[team-members] query error:', membersError.message);
      return NextResponse.json({ team_members: [] }, { status: 200 });
    }

    // Filter only active employees (active or probation, non-separated, non-disabled)
    const list = (members || []).filter((m) => {
      if (m.id === employeeUUID) return false;
      if (m.access_disabled_at || m.separated_at) return false;
      const lifecycle = (m.employment_lifecycle_status || '').toLowerCase();
      const status = (m.employee_status || '').toLowerCase();
      if (lifecycle === 'separated' || status === 'separated') return false;
      return lifecycle === 'active' || ['active', 'probation', 'confirmed'].includes(status);
    });

    return NextResponse.json({ team_members: list }, { status: 200 });
  } catch (err) {
    console.error('[team-members] unexpected error:', err);
    return NextResponse.json({ team_members: [] }, { status: 200 });
  }
}

