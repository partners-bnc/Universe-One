import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

export const dynamic = 'force-dynamic';

// GET /other-modules/onboarding/api/team
// Section 03 (Meet the Team): current employees with their profile photo (Supabase Storage bucket
// `employee-avatars`, public URL saved in hrm_employees.profile_picture_url), designation, department,
// employee ID and date of joining.
// Returns only what the page shows — no email, phone or other personal fields.
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const authContext = user ? await resolveAuthenticatedUserContext(supabase, user) : null;
    if (!authContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await adminClient
      .from('hrm_employees')
      .select('id, employee_id, date_of_joining, name, profile_picture_url, employment_lifecycle_status, separated_at, access_disabled_at, designation:hrm_designations (id, title), department:hrm_departments (id, name)')
      .is('separated_at', null)
      .is('access_disabled_at', null)
      .order('name', { ascending: true });
    if (error) throw error;

    const members = (data || [])
      .filter((e) => !['separated', 'inactive'].includes(String(e.employment_lifecycle_status || '').toLowerCase()))
      .map((e) => ({
        id: e.id,
        name: e.name || '',
        role: e.designation?.title || '',
        department: e.department?.name || '',
        photo: e.profile_picture_url || '',
        code: e.employee_id || '',
        joined: e.date_of_joining || '',
      }));

    return NextResponse.json({ members });
  } catch (err) {
    console.error('[onboarding/team] failed:', err);
    return NextResponse.json({ error: 'Could not load the team' }, { status: 500 });
  }
}
