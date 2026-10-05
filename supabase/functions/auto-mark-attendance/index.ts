// @ts-nocheck
declare const Deno: any;
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const TARGET_EMPLOYEE_CODES = ['E064', 'E065', 'E068'];
const TIMEZONE_OFFSET = '+05:30'; // IST (+05:30)

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse(500, { error: 'Missing Supabase environment variables' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Determine action from URL query or request body ('checkin', 'checkout', or 'full')
    const url = new URL(req.url);
    let action = url.searchParams.get('action') || '';
    if (!action) {
      try {
        const body = await req.json();
        if (body?.action) action = body.action;
      } catch {
        // No body provided
      }
    }

    // 1. Calculate current date and time in Asia/Kolkata (IST)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
    const todayDate = `${parts.year}-${parts.month}-${parts.day}`;
    const weekday = parts.weekday.toLowerCase();
    const currentHour = parseInt(parts.hour, 10);

    // If no action specified, infer from current IST time:
    // Before 2:00 PM (14:00) -> checkin, After 2:00 PM -> checkout
    if (!action) {
      action = currentHour < 14 ? 'checkin' : 'checkout';
    }

    // 2. Skip Weekends (Saturday & Sunday)
    if (weekday === 'saturday' || weekday === 'sunday') {
      return jsonResponse(200, {
        date: todayDate,
        message: `Today is ${weekday}. Weekend skipped.`,
        executed: false,
      });
    }

    // 3. Skip Company Holidays
    const { data: holiday } = await supabase
      .from('hrm_holidays')
      .select('id, name')
      .eq('date', todayDate)
      .maybeSingle();

    if (holiday) {
      return jsonResponse(200, {
        date: todayDate,
        message: `Today is a holiday (${holiday.name}). Attendance skipped.`,
        executed: false,
      });
    }

    // 4. Fetch target employees
    const { data: employees, error: empError } = await supabase
      .from('hrm_employees')
      .select('id, employee_id, name, working_days, employment_lifecycle_status')
      .in('employee_id', TARGET_EMPLOYEE_CODES)
      .eq('employment_lifecycle_status', 'active');

    if (empError) {
      return jsonResponse(500, { error: empError.message });
    }

    if (!employees || employees.length === 0) {
      return jsonResponse(200, {
        date: todayDate,
        message: 'No active target employees found.',
        executed: false,
      });
    }

    const checkInTimestamp = `${todayDate}T09:30:00${TIMEZONE_OFFSET}`;
    const checkOutTimestamp = `${todayDate}T17:30:00${TIMEZONE_OFFSET}`;
    const summary = [];

    for (const emp of employees) {
      // 5. Check if employee has approved full-day leave
      const { data: leave } = await supabase
        .from('hrm_leave_requests')
        .select('id, session, applied_session')
        .eq('employee_id', emp.id)
        .eq('status', 'approved')
        .lte('start_date', todayDate)
        .gte('end_date', todayDate)
        .maybeSingle();

      const isFullDayLeave = leave && (leave.applied_session || leave.session || 'full_day') === 'full_day';
      if (isFullDayLeave) {
        summary.push({
          employeeCode: emp.employee_id,
          name: emp.name,
          status: 'Skipped (Approved Full Day Leave)',
        });
        continue;
      }

      // Check existing attendance record for today
      const { data: existingAttendance } = await supabase
        .from('hrm_attendance')
        .select('*')
        .eq('employee_id', emp.id)
        .eq('date', todayDate)
        .maybeSingle();

      let attendanceId = existingAttendance?.id;

      if (action === 'checkin') {
        // --- MORNING 9:30 AM CHECK-IN ---
        if (!existingAttendance) {
          const { data: created, error: createErr } = await supabase
            .from('hrm_attendance')
            .insert({
              employee_id: emp.id,
              date: todayDate,
              check_in: checkInTimestamp,
              check_out: null,
              status: 'present',
              late_in_minutes: 0,
              early_out_minutes: 0,
              work_hours_minutes: 0,
              source: 'manual',
              notes: 'Automated morning check-in.',
            })
            .select('id')
            .single();

          if (createErr) throw createErr;
          attendanceId = created.id;
        } else if (!existingAttendance.check_in) {
          await supabase
            .from('hrm_attendance')
            .update({ check_in: checkInTimestamp, status: 'present' })
            .eq('id', existingAttendance.id);
        }

        // Insert 'in' swipe if missing
        const { data: inSwipe } = await supabase
          .from('hrm_attendance_swipes')
          .select('id')
          .eq('employee_id', emp.id)
          .eq('swipe_date', todayDate)
          .eq('swipe_type', 'in')
          .maybeSingle();

        if (!inSwipe) {
          await supabase.from('hrm_attendance_swipes').insert({
            employee_id: emp.id,
            attendance_id: attendanceId,
            swipe_date: todayDate,
            swipe_time: checkInTimestamp,
            swipe_type: 'in',
            source: 'manual',
            door_address: 'Automated Scheduled Check-in (09:30 AM)',
          });
        }

        summary.push({
          employeeCode: emp.employee_id,
          name: emp.name,
          status: 'Checked-in (09:30 AM)',
        });

      } else if (action === 'checkout') {
        // --- EVENING 5:30 PM CHECK-OUT ---
        const effectiveCheckIn = existingAttendance?.check_in || checkInTimestamp;

        const { data: upserted, error: upsertErr } = await supabase
          .from('hrm_attendance')
          .upsert(
            {
              employee_id: emp.id,
              date: todayDate,
              check_in: effectiveCheckIn,
              check_out: checkOutTimestamp,
              status: 'present',
              late_in_minutes: 0,
              early_out_minutes: 0,
              work_hours_minutes: 480, // 8 hours (09:30 to 17:30)
              source: 'manual',
              notes: 'Automated scheduled attendance.',
            },
            { onConflict: 'employee_id,date' }
          )
          .select('id')
          .single();

        if (upsertErr) throw upsertErr;
        attendanceId = upserted.id;

        // Ensure both 'in' and 'out' swipes exist
        const { data: inSwipe } = await supabase
          .from('hrm_attendance_swipes')
          .select('id')
          .eq('employee_id', emp.id)
          .eq('swipe_date', todayDate)
          .eq('swipe_type', 'in')
          .maybeSingle();

        if (!inSwipe) {
          await supabase.from('hrm_attendance_swipes').insert({
            employee_id: emp.id,
            attendance_id: attendanceId,
            swipe_date: todayDate,
            swipe_time: checkInTimestamp,
            swipe_type: 'in',
            source: 'manual',
            door_address: 'Automated Scheduled Check-in (09:30 AM)',
          });
        }

        const { data: outSwipe } = await supabase
          .from('hrm_attendance_swipes')
          .select('id')
          .eq('employee_id', emp.id)
          .eq('swipe_date', todayDate)
          .eq('swipe_type', 'out')
          .maybeSingle();

        if (!outSwipe) {
          await supabase.from('hrm_attendance_swipes').insert({
            employee_id: emp.id,
            attendance_id: attendanceId,
            swipe_date: todayDate,
            swipe_time: checkOutTimestamp,
            swipe_type: 'out',
            source: 'manual',
            door_address: 'Automated Scheduled Check-out (05:30 PM)',
          });
        }

        summary.push({
          employeeCode: emp.employee_id,
          name: emp.name,
          status: 'Checked-out (05:30 PM) - Full Day Present (480 mins)',
        });
      }
    }

    return jsonResponse(200, {
      date: todayDate,
      weekday,
      action,
      executed: true,
      summary,
    });
  } catch (err: any) {
    return jsonResponse(500, { error: err.message || 'Internal server error' });
  }
});
