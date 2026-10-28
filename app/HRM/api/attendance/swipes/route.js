import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { hasLinkedEmployeeAccess, resolveAuthenticatedUserContext } from '@/utils/auth/context';
import { getCurrentDateInTimeZone, mapSwipeForUi } from '@/utils/attendance';

async function requireEmployeeContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  if (!hasLinkedEmployeeAccess(authContext)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return {
    authContext,
    employeeId: authContext.employee.id,
    employeeCode: authContext.employee.employee_id || '',
    employeeName: authContext.employee.name || '',
  };
}

export async function GET(request) {
  try {
    const employeeContext = await requireEmployeeContext();
    if (employeeContext.error) {
      return employeeContext.error;
    }

    const date = request.nextUrl.searchParams.get('date') || getCurrentDateInTimeZone();
    const requestedEmployeeId = request.nextUrl.searchParams.get('employeeId');

    let targetEmployeeId = employeeContext.employeeId;
    let targetEmployeeCode = employeeContext.employeeCode;
    let targetEmployeeName = employeeContext.employeeName;

    if (requestedEmployeeId && requestedEmployeeId !== employeeContext.employeeId) {
      const { data: targetEmployee, error: targetError } = await adminClient
        .from('hrm_employees')
        .select('id, employee_id, name, reporting_manager_id')
        .eq('id', requestedEmployeeId)
        .maybeSingle();

      if (targetError || !targetEmployee) {
        return NextResponse.json({ error: 'Target employee not found' }, { status: 404 });
      }

      const isManager = targetEmployee.reporting_manager_id === employeeContext.employeeId;
      const isAdmin = Boolean(employeeContext.authContext?.isHrAdmin);

      if (!isManager && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      targetEmployeeId = targetEmployee.id;
      targetEmployeeCode = targetEmployee.employee_id || '';
      targetEmployeeName = targetEmployee.name || '';
    }

    const { data: swipes, error } = await adminClient
      .from('hrm_attendance_swipes')
      .select('*')
      .eq('employee_id', targetEmployeeId)
      .eq('swipe_date', date)
      .order('swipe_time', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to load swipes' }, { status: 500 });
    }

    return NextResponse.json(
      {
        date,
        employeeId: targetEmployeeCode,
        employeeName: targetEmployeeName,
        swipes: (swipes || []).map(mapSwipeForUi),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error loading swipes:', error);
    return NextResponse.json({ error: error.message || 'Failed to load swipes' }, { status: 500 });
  }
}
