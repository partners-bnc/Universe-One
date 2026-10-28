import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';
import { deriveEmploymentFields } from '@/utils/hrm-employment';

export const dynamic = 'force-dynamic';

// GET /HRM/api/admin/onboarding-progress  (HR admins only)
// Every current employee's onboarding progress, newest joiners first:
// status (pending / in_progress / completed), % of sections, % of videos, overall %, and per step:
// sections (opened / marked as read) and videos (how much watched, completed).
// Reads onboarding_steps + onboarding_progress (see supabase/migrations/20261027120000_onboarding_progress_tracking.sql).

function isMissingTable(error) {
  const code = String(error?.code || '');
  return code === '42P01' || code === 'PGRST205' || /does not exist|could not find/i.test(String(error?.message || ''));
}

const relation = (value) => (Array.isArray(value) ? value[0] : value) || null;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const authContext = await resolveAuthenticatedUserContext(supabase, user);
    if (!authContext?.isHrAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [stepsResult, progressResult, employeesResult] = await Promise.all([
      adminClient.from('onboarding_steps').select('id, step_type, section_id, platform, module, title, video_path, sort_order, is_active').order('sort_order'),
      adminClient.from('onboarding_progress').select('employee_id, step_id, first_opened_at, last_opened_at, open_count, watched_seconds, duration_seconds, watched_pct, completed_at, updated_at'),
      adminClient.from('hrm_employees').select('*, department:hrm_departments (name), designation:hrm_designations (title)'),
    ]);
    if (stepsResult.error || progressResult.error) {
      const error = stepsResult.error || progressResult.error;
      if (isMissingTable(error)) return NextResponse.json({ tracking: false, employees: [], steps: [] });
      throw error;
    }
    if (employeesResult.error) throw employeesResult.error;

    // only steps that count: live sections, and videos that have been uploaded
    const steps = (stepsResult.data || []).filter((step) => step.is_active && (step.step_type === 'section' || step.video_path));
    const sections = steps.filter((step) => step.step_type === 'section');
    const videos = steps.filter((step) => step.step_type === 'video');
    const total = sections.length + videos.length;

    const progressByEmployee = new Map();
    (progressResult.data || []).forEach((row) => {
      if (!progressByEmployee.has(row.employee_id)) progressByEmployee.set(row.employee_id, new Map());
      progressByEmployee.get(row.employee_id).set(row.step_id, row);
    });

    const employees = (employeesResult.data || [])
      .filter((employee) => {
        const fields = deriveEmploymentFields(employee);
        return String(fields.employmentLifecycleStatus || '').toLowerCase() !== 'separated';
      })
      .map((employee) => {
        const rows = progressByEmployee.get(employee.id) || new Map();
        const sectionItems = sections.map((step) => {
          const row = rows.get(step.id);
          return { id: step.id, sectionId: step.section_id, title: step.title, openedAt: row?.first_opened_at || null, lastOpenedAt: row?.last_opened_at || null, openCount: row?.open_count || 0, completedAt: row?.completed_at || null };
        });
        const videoItems = videos.map((step) => {
          const row = rows.get(step.id);
          return {
            id: step.id,
            sectionId: step.section_id,
            title: step.title,
            module: step.module,
            openedAt: row?.first_opened_at || null,
            playCount: row?.open_count || 0,
            watchedPct: Number(row?.watched_pct || 0),
            watchedSeconds: row?.watched_seconds || 0,
            durationSeconds: row?.duration_seconds || null,
            lastWatchedAt: row?.updated_at || null,
            completedAt: row?.completed_at || null,
          };
        });
        const sectionsDone = sectionItems.filter((item) => item.completedAt).length;
        const videosDone = videoItems.filter((item) => item.completedAt).length;
        const allRows = [...rows.values()];
        const hasOpened = allRows.length > 0;
        const done = sectionsDone + videosDone;
        const completed = total > 0 && done >= total;
        const times = (key) => allRows.map((row) => row[key]).filter(Boolean).sort();

        return {
          id: employee.id,
          code: employee.employee_id || '',
          name: employee.name || 'Employee',
          photo: employee.profile_picture_url || '',
          department: relation(employee.department)?.name || '',
          designation: relation(employee.designation)?.title || '',
          joinedOn: employee.date_of_joining || null,
          status: completed ? 'completed' : hasOpened ? 'in_progress' : 'pending',
          firstOpenedAt: times('first_opened_at')[0] || null,
          lastActivityAt: [...times('last_opened_at'), ...times('updated_at')].sort().pop() || null,
          completedAt: completed ? times('completed_at').pop() || null : null,
          sectionsDone,
          sectionsTotal: sections.length,
          videosDone,
          videosTotal: videos.length,
          videoWatchPct: videoItems.length ? Math.round(videoItems.reduce((sum, item) => sum + item.watchedPct, 0) / videoItems.length) : 0,
          overallPct: total ? Math.round((done / total) * 100) : 0,
          sections: sectionItems,
          videos: videoItems,
        };
      })
      // newest joiners first; no joining date last
      .sort((a, b) => String(b.joinedOn || '').localeCompare(String(a.joinedOn || '')) || a.name.localeCompare(b.name));

    return NextResponse.json({
      tracking: true,
      totals: { sections: sections.length, videos: videos.length, videosPlanned: (stepsResult.data || []).filter((step) => step.step_type === 'video' && step.is_active).length },
      employees,
    });
  } catch (err) {
    console.error('[HRM/admin/onboarding-progress] failed:', err);
    return NextResponse.json({ error: 'Could not load onboarding progress' }, { status: 500 });
  }
}
