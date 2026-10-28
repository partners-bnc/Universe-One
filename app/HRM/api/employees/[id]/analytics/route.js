import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { requireAdminOrSupport } from '@/utils/api-helpers';
import { buildEmployeeRatingStats, buildEmployeeTaskRatingMap } from '@/utils/task-ratings';

const EMPLOYEE_ANALYTICS_ACTIVITY_SELECT = `
  id,
  task_id,
  subtask_id,
  entity_type,
  action,
  assigned_by_actor_type,
  created_at,
  subtask:task_subtasks!task_assignment_activity_subtask_id_fkey (
    id,
    title
  ),
  from_employee:hrm_employees!task_assignment_activity_from_employee_id_fkey (
    id,
    name,
    email,
    role,
    profile_picture_url
  ),
  to_employee:hrm_employees!task_assignment_activity_to_employee_id_fkey (
    id,
    name,
    email,
    role,
    profile_picture_url
  ),
  assigned_by_employee:hrm_employees!task_assignment_activity_assigned_by_employee_id_fkey (
    id,
    name,
    email,
    role,
    profile_picture_url
  ),
  assigned_by_admin:hrm_profiles!task_assignment_activity_assigned_by_admin_user_id_fkey (
    id,
    full_name,
    email
  )
`;

function getActorName(activity) {
  if (activity?.assigned_by_actor_type === 'employee') {
    return activity?.assigned_by_employee?.name || activity?.assigned_by_employee?.email || 'Unknown';
  }
  return activity?.assigned_by_admin?.full_name || activity?.assigned_by_admin?.email || 'Unknown';
}

function mapActivity(activity) {
  return {
    id: activity.id,
    taskId: activity.task_id,
    subtaskId: activity.subtask_id,
    entityType: activity.entity_type,
    action: activity.action,
    createdAt: activity.created_at,
    subtaskTitle: activity?.subtask?.title || null,
    fromEmployee: activity?.from_employee || null,
    toEmployee: activity?.to_employee || null,
    actor: activity?.assigned_by_actor_type === 'employee'
      ? activity?.assigned_by_employee || null
      : {
        id: activity?.assigned_by_admin?.id || null,
        name: activity?.assigned_by_admin?.full_name || activity?.assigned_by_admin?.email || 'Unknown',
        email: activity?.assigned_by_admin?.email || '',
        role: 'admin',
        profile_picture_url: null,
      },
  };
}

function getLatestTaskActivityByTaskId(activities = []) {
  const latestTaskLevel = new Map();
  const latestAnyLevel = new Map();

  for (const activity of activities) {
    if (!activity?.task_id || latestAnyLevel.has(activity.task_id)) continue;
    latestAnyLevel.set(activity.task_id, activity);
  }

  for (const activity of activities) {
    if (!activity?.task_id || activity.entity_type !== 'task' || latestTaskLevel.has(activity.task_id)) continue;
    latestTaskLevel.set(activity.task_id, activity);
  }

  const latestByTaskId = new Map();
  for (const [taskId, activity] of latestAnyLevel.entries()) {
    latestByTaskId.set(taskId, latestTaskLevel.get(taskId) || activity);
  }
  return latestByTaskId;
}

function getDerivedProgress(task) {
  const dbProgress = Number(task?.progress_percentage);
  if (Number.isFinite(dbProgress)) {
    return Math.min(100, Math.max(0, Math.round(dbProgress)));
  }
  const subtasks = Array.isArray(task?.task_subtasks) ? task.task_subtasks : [];
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter((subtask) => subtask?.is_completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

async function fetchPagedRows(buildQuery, pageSize = 1000) {
  let allRows = [];
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1);
    if (error) return { data: allRows, error };
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize) {
      hasMore = false;
    } else {
      from += pageSize;
    }
  }
  return { data: allRows, error: null };
}

async function getTaskHoursMaps(taskIds = [], targetEmployeeId) {
  const employeeHoursMap = new Map();
  const totalHoursMap = new Map();

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return { employeeHoursMap, totalHoursMap };
  }

  const PAGE_SIZE = 1000;
  let from = 0;
  let hasMore = true;
  const taskIdSet = new Set(taskIds);

  while (hasMore) {
    let query = adminClient
      .from('hrm_daily_work_logs')
      .select('task_id, employee_id, hours_spent')
      .not('task_id', 'is', null);

    if (taskIds.length <= 500) {
      query = query.in('task_id', taskIds);
    }

    const { data: logs, error } = await query.range(from, from + PAGE_SIZE - 1);
    if (error || !logs || logs.length === 0) break;

    for (const log of logs) {
      if (log.task_id && taskIdSet.has(log.task_id)) {
        const hrs = parseFloat(log.hours_spent) || 0;
        totalHoursMap.set(log.task_id, (totalHoursMap.get(log.task_id) || 0) + hrs);
        if (log.employee_id === targetEmployeeId) {
          employeeHoursMap.set(log.task_id, (employeeHoursMap.get(log.task_id) || 0) + hrs);
        }
      }
    }

    if (logs.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
    }
  }

  return { employeeHoursMap, totalHoursMap };
}

function buildTaskPayload(assignments = [], activities = [], ratingMap = new Map(), employeeHoursMap = new Map(), totalHoursMap = new Map()) {
  const latestActivityByTaskId = getLatestTaskActivityByTaskId(activities);

  return assignments
    .map((assignment) => {
      const task = assignment?.task;
      if (!task?.id) return null;

      const latestActivity = latestActivityByTaskId.get(task.id) || null;
      const taskSubtasks = Array.isArray(task.task_subtasks) ? task.task_subtasks : [];
      const completedSubtasks = taskSubtasks.filter((subtask) => subtask?.is_completed).length;

      const employeeRating = ratingMap.get(task.id) || null;

      return {
        id: task.id,
        task_name: task.task_name || 'Untitled task',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date || null,
        created_at: task.created_at || null,
        updated_at: task.updated_at || null,
        progress_percentage: getDerivedProgress(task),
        employee_rating: employeeRating?.rating ?? null,
        employee_rating_updated_at: employeeRating?.updated_at || employeeRating?.created_at || null,
        assigned_at: latestActivity?.created_at || assignment?.assigned_at || null,
        assigned_by: latestActivity ? getActorName(latestActivity) : 'Assigned',
        assignment_action: latestActivity?.action || 'assigned',
        assignment_source: latestActivity?.entity_type || 'task',
        employee_logged_hours: employeeHoursMap.get(task.id) || 0,
        total_logged_hours: totalHoursMap.get(task.id) || 0,
        assignees: Array.isArray(task.task_assignments)
          ? task.task_assignments.map((ta) => ta?.employee).filter(Boolean)
          : [],
        subtasks_total: taskSubtasks.length,
        subtasks_completed: completedSubtasks,
      };
    })
    .filter(Boolean);
}

function buildStats(tasks = [], ratingRows = []) {
  const now = Date.now();
  const totalAssigned = tasks.length;
  const pending = tasks.filter((task) => task.status === 'pending').length;
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const overdue = tasks.filter((task) => {
    if (!task?.due_date || task.status === 'completed') return false;
    const dueAt = new Date(task.due_date).getTime();
    return Number.isFinite(dueAt) && dueAt < now;
  }).length;
  const completionRate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

  const ratingStats = buildEmployeeRatingStats(ratingRows);

  const nextDueTask = [...tasks]
    .filter((task) => task?.due_date && task.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0] || null;

  return {
    totalAssigned,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate,
    averageRating: ratingStats.averageRating,
    totalRatedTasks: ratingStats.totalRatedTasks,
    latestRatedTasks: ratingStats.latestRatedTasks.slice(0, 5),
    nextDueTask: nextDueTask
      ? { id: nextDueTask.id, task_name: nextDueTask.task_name, due_date: nextDueTask.due_date }
      : null,
  };
}

export async function GET(request, { params }) {
  try {
    const auth = await requireAdminOrSupport(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const [employeeResult, assignmentResult, activityResult, ratingResult] = await Promise.all([
      adminClient
        .from('hrm_employees')
        .select('id, employee_id, name, username, email, role, profile_picture_url, created_at, updated_at')
        .eq('id', id)
        .maybeSingle(),
      fetchPagedRows(() =>
        adminClient
          .from('task_assignments')
          .select(`
            assigned_at,
            task:tasks (
              id, task_name, description, priority, status, due_date,
              created_at, updated_at, progress_percentage,
              task_assignments (employee:hrm_employees!task_assignments_employee_id_fkey (id, name, email, role, profile_picture_url)),
              task_subtasks (id, title, is_completed, assigned_employee_id, created_at, updated_at)
            )
          `)
          .eq('employee_id', id)
          .order('assigned_at', { ascending: false })
      ),
      fetchPagedRows(() =>
        adminClient
          .from('task_assignment_activity')
          .select(EMPLOYEE_ANALYTICS_ACTIVITY_SELECT)
          .eq('to_employee_id', id)
          .order('created_at', { ascending: false })
      ),
      fetchPagedRows(() =>
        adminClient
          .from('task_employee_ratings')
          .select(`
            id,
            task_id,
            employee_id,
            rating,
            created_at,
            updated_at,
            task:tasks (
              id,
              task_name,
              status,
              due_date
            )
          `)
          .eq('employee_id', id)
          .order('updated_at', { ascending: false })
      ),
    ]);

    if (employeeResult.error) {
      return NextResponse.json({ error: employeeResult.error.message }, { status: 500 });
    }
    if (!employeeResult.data) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    if (assignmentResult.error) {
      return NextResponse.json({ error: assignmentResult.error.message }, { status: 500 });
    }
    if (activityResult.error) {
      return NextResponse.json({ error: activityResult.error.message }, { status: 500 });
    }
    if (ratingResult.error) {
      return NextResponse.json({ error: ratingResult.error.message }, { status: 500 });
    }

    const rawActivities = activityResult.data || [];
    const ratingRows = ratingResult.data || [];
    const ratingMap = buildEmployeeTaskRatingMap(ratingRows, id);

    // Compute both individual employee logged hours and total team hours for each task
    const taskIds = (assignmentResult.data || []).map((a) => a?.task?.id).filter(Boolean);
    const { employeeHoursMap, totalHoursMap } = await getTaskHoursMaps(taskIds, id);

    const tasks = buildTaskPayload(assignmentResult.data || [], rawActivities, ratingMap, employeeHoursMap, totalHoursMap);
    const stats = buildStats(tasks, ratingRows);
    const assignmentActivity = rawActivities.map(mapActivity);

    // Optional ticket statistics for this employee
    let ticketStats = {
      total: 0,
      open: 0,
      late: 0,
      breached: 0,
      avgResolutionHours: 0,
    };

    try {
      const { data: ticketRows } = await fetchPagedRows(() =>
        adminClient
          .from('tickets')
          .select('id, status, is_late, is_sla_breached, created_at, closed_at, resolved_at, assigned_to_employee_id, created_by_employee_id')
          .or(`assigned_to_employee_id.eq.${id},created_by_employee_id.eq.${id}`)
      );

      if (Array.isArray(ticketRows) && ticketRows.length > 0) {
        const open = ticketRows.filter((t) => !['closed', 'resolved'].includes(t.status));
        const closed = ticketRows.filter((t) => ['closed', 'resolved'].includes(t.status));
        const durations = closed
          .map((t) => {
            const start = t.created_at ? new Date(t.created_at).getTime() : NaN;
            const end = t.closed_at || t.resolved_at ? new Date(t.closed_at || t.resolved_at).getTime() : NaN;
            if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
            return (end - start) / (1000 * 60 * 60);
          })
          .filter((v) => typeof v === 'number');

        const avgResolutionHours = durations.length > 0
          ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
          : 0;

        ticketStats = {
          total: ticketRows.length,
          open: open.length,
          late: open.filter((t) => t.is_late && !t.is_sla_breached).length,
          breached: open.filter((t) => t.is_sla_breached).length,
          avgResolutionHours,
        };
      }
    } catch {
      // Graceful fallback if tickets schema differs
    }

    return NextResponse.json({
      success: true,
      employee: employeeResult.data,
      tasks,
      stats,
      ticketStats,
      assignmentActivity,
    });
  } catch (error) {
    console.error('Error fetching employee analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch employee analytics' }, { status: 500 });
  }
}
