import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { getSignedInEmployee, isMissingTable } from './shared';

export const dynamic = 'force-dynamic';

// GET  /other-modules/onboarding/api/progress  -> the signed-in employee's own onboarding progress
// POST /other-modules/onboarding/api/progress  -> record one event for the signed-in employee
//      body: { stepId: 'section:about-company' | 'video:check-in', event: 'open' | 'complete' | 'watch',
//              watchedSeconds?, durationSeconds? }
// Writes only ever touch the caller's own rows (employee id comes from the session, never the body).
// If the tracking tables don't exist yet, both return { tracking: false } and the page keeps working.

export async function GET() {
  try {
    const { user, employeeId } = await getSignedInEmployee();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!employeeId) return NextResponse.json({ tracking: false, reason: 'not-linked', progress: [] });

    const { data, error } = await adminClient
      .from('onboarding_progress')
      .select('step_id, first_opened_at, watched_seconds, duration_seconds, watched_pct, completed_at')
      .eq('employee_id', employeeId);
    if (error) {
      if (isMissingTable(error)) return NextResponse.json({ tracking: false, reason: 'not-set-up', progress: [] });
      throw error;
    }
    return NextResponse.json({ tracking: true, progress: data || [] });
  } catch (err) {
    console.error('[onboarding/progress] GET failed:', err);
    return NextResponse.json({ error: 'Could not load onboarding progress' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user, employeeId } = await getSignedInEmployee();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!employeeId) return NextResponse.json({ tracking: false, reason: 'not-linked' });

    const body = await request.json().catch(() => ({}));
    const stepId = String(body.stepId || '');
    const event = String(body.event || '');
    if (!/^(section|video):[a-z0-9-]{1,60}$/.test(stepId) || !['open', 'complete', 'watch'].includes(event)) {
      return NextResponse.json({ error: 'Invalid progress event' }, { status: 400 });
    }
    if (event === 'complete' && !stepId.startsWith('section:')) {
      return NextResponse.json({ error: 'Videos complete by watching' }, { status: 400 });
    }
    const toSeconds = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Math.min(86400, Math.round(Number(value)))) : null);

    const { data, error } = await adminClient.rpc('onboarding_record_progress', {
      p_employee_id: employeeId,
      p_step_id: stepId,
      p_event: event,
      p_watched_seconds: event === 'watch' ? toSeconds(body.watchedSeconds) : null,
      p_duration_seconds: event === 'watch' ? toSeconds(body.durationSeconds) : null,
    });
    if (error) {
      if (isMissingTable(error)) return NextResponse.json({ tracking: false, reason: 'not-set-up' });
      // unknown step id (foreign key) -> ignore quietly rather than break the page
      if (String(error.code) === '23503') return NextResponse.json({ tracking: true, ignored: true });
      throw error;
    }
    return NextResponse.json({ tracking: true, progress: data });
  } catch (err) {
    console.error('[onboarding/progress] POST failed:', err);
    return NextResponse.json({ error: 'Could not save onboarding progress' }, { status: 500 });
  }
}
