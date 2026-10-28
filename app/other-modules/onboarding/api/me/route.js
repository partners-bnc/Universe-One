import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { hasLinkedEmployeeAccess, resolveAuthenticatedUserContext } from '@/utils/auth/context';
import { loadRoleAndTeam } from './load';

export const dynamic = 'force-dynamic';

// GET /other-modules/onboarding/api/me
// Section 04 (Your Role & Team): the signed-in employee's own HRM profile (the same fields as HRM → My Profile),
// their reporting manager, the people who report to them and their documents.
// Only the signed-in employee's own record is returned in full; colleagues get name, ID, role, department and photo.

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const authContext = await resolveAuthenticatedUserContext(supabase, user);
    if (!hasLinkedEmployeeAccess(authContext)) {
      return NextResponse.json({ error: 'Your login is not linked to an HRM employee profile yet.' }, { status: 404 });
    }

    const data = await loadRoleAndTeam(authContext.employee.id);
    if (!data) return NextResponse.json({ error: 'Employee profile not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[onboarding/me] failed:', err);
    return NextResponse.json({ error: 'Could not load your profile' }, { status: 500 });
  }
}
