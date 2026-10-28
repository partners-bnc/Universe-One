-- Migration: Onboarding progress tracking + onboarding video bucket
-- File: supabase/migrations/20261027120000_onboarding_progress_tracking.sql
--
-- What it adds
--   1. Storage bucket `onboarding-videos` (private, MP4/MOV, max 50 MB per file (spend cap on)).
--   2. public.onboarding_steps        - everything an employee should complete: 7 sections + one row per guide video.
--                                       video_path = the file's path inside the bucket (filled after upload).
--   3. public.onboarding_progress     - one row per employee per step: opened, how much of a video was watched, completed.
--   4. public.onboarding_record_progress(...) - the only write path (keeps the highest watch %, never un-completes).
--   5. public.onboarding_employee_summary     - one row per employee: status, % sections, % videos, overall %.
--
-- Access: RLS is on with no policies, so only the server (service role) reads/writes these tables.
-- Employees write their own progress through /other-modules/onboarding/api/progress; HR admins read it
-- through /HRM/api/admin/onboarding-progress. Safe to re-run.

-- =========================================================================
-- 1. Storage bucket for the guide videos
-- =========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('onboarding-videos', 'onboarding-videos', false, 52428800, array['video/mp4', 'video/quicktime', 'video/webm'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- =========================================================================
-- 2. Steps catalog
-- =========================================================================
create table if not exists public.onboarding_steps (
  id          text primary key,                         -- 'section:about-company' | 'video:check-in'
  step_type   text not null check (step_type in ('section', 'video')),
  section_id  text not null,                            -- onboarding section the step belongs to
  platform    text,                                     -- videos: 'universe-one'
  module      text,                                     -- videos: 'hrms' | 'task-manager' | 'crm'
  title       text not null,
  video_path  text,                                     -- path inside the onboarding-videos bucket, e.g. 'universe-one/hrms/Checkin.mp4'
  sort_order  integer not null default 0,
  is_active   boolean not null default true,            -- counted in progress %
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- sections (only live sections count; 06 and 07 switch on when they are built)
insert into public.onboarding_steps (id, step_type, section_id, title, sort_order, is_active) values
  ('section:about-company',  'section', 'about-company',  'About the Company',          1, true),
  ('section:about-founders', 'section', 'about-founders', 'About the Founders',         2, true),
  ('section:our-team',       'section', 'our-team',       'Meet the Team',              3, true),
  ('section:role-team',      'section', 'role-team',      'Your Role & Team',           4, true),
  ('section:tools-systems',  'section', 'tools-systems',  'Tools & Systems',            5, true),
  ('section:culture-values', 'section', 'culture-values', 'Culture & Values',           6, false),
  ('section:policies',       'section', 'policies',       'Policies & Code of Conduct', 7, false)
on conflict (id) do update
  set title = excluded.title, section_id = excluded.section_id, sort_order = excluded.sort_order, updated_at = now();

-- guide videos (Section 05). A video only counts towards progress once its video_path is set.
insert into public.onboarding_steps (id, step_type, section_id, platform, module, title, sort_order) values
  ('video:check-in',         'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Check in',                         101),
  ('video:check-out',        'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Check out',                        102),
  ('video:work-log',         'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Fill the check-out form',          103),
  ('video:regularization',   'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Regularize attendance',            104),
  ('video:leave',            'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Apply for leave',                  105),
  ('video:expense',          'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Claim an expense',                 106),
  ('video:ticket',           'video', 'tools-systems', 'universe-one', 'hrms',         'HRMS · Raise a ticket',                   107),
  ('video:tm-dashboard',     'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Your dashboard',           201),
  ('video:tm-create',        'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Create a task',            202),
  ('video:tm-manage',        'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Manage your tasks',        203),
  ('video:tm-task',          'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Update a task',            204),
  ('video:tm-collaborate',   'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Subtasks, comments and files', 205),
  ('video:tm-todos',         'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Personal to-dos',          206),
  ('video:tm-chat',          'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Chat with colleagues',     208),
  ('video:tm-team-settings', 'video', 'tools-systems', 'universe-one', 'task-manager', 'Task Manager · Team and settings',        209)
on conflict (id) do update
  set title = excluded.title, platform = excluded.platform, module = excluded.module, sort_order = excluded.sort_order, updated_at = now();
  -- video_path is deliberately not overwritten on re-run

-- "Task tickets" was dropped: it is covered by HRMS "Raise a ticket" (same ticket system)
delete from public.onboarding_steps where id = 'video:tm-tickets';

-- =========================================================================
-- 3. Progress per employee per step
-- =========================================================================
create table if not exists public.onboarding_progress (
  id                uuid primary key default gen_random_uuid(),
  employee_id       uuid not null references public.hrm_employees(id) on delete cascade,
  step_id           text not null references public.onboarding_steps(id) on delete cascade,
  first_opened_at   timestamptz not null default now(),
  last_opened_at    timestamptz not null default now(),
  open_count        integer not null default 1,
  watched_seconds   integer not null default 0,           -- seconds actually played (skipped parts don't count)
  duration_seconds  integer,
  watched_pct       numeric(5, 2) not null default 0,      -- highest % reached, 0-100
  completed_at      timestamptz,                           -- section marked as read / video watched >= 90%
  updated_at        timestamptz not null default now(),
  unique (employee_id, step_id)
);
create index if not exists onboarding_progress_employee_idx on public.onboarding_progress (employee_id);
create index if not exists onboarding_progress_step_idx on public.onboarding_progress (step_id);

alter table public.onboarding_steps enable row level security;
alter table public.onboarding_progress enable row level security;

-- =========================================================================
-- 4. Single write path
--    p_event: 'open'     - the employee opened the section / video
--             'complete' - section marked as read
--             'watch'    - video progress (p_watched_seconds of p_duration_seconds); completes at >= 90%
-- =========================================================================
create or replace function public.onboarding_record_progress(
  p_employee_id uuid,
  p_step_id text,
  p_event text,
  p_watched_seconds integer default null,
  p_duration_seconds integer default null
) returns public.onboarding_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pct numeric(5, 2) := 0;
  v_row public.onboarding_progress;
begin
  if p_event not in ('open', 'complete', 'watch') then
    raise exception 'Unknown onboarding event: %', p_event;
  end if;

  if p_event = 'watch' and coalesce(p_duration_seconds, 0) > 0 then
    v_pct := least(100, round(100.0 * greatest(coalesce(p_watched_seconds, 0), 0) / p_duration_seconds, 2));
  end if;

  insert into public.onboarding_progress as p (
    employee_id, step_id, watched_seconds, duration_seconds, watched_pct, completed_at
  ) values (
    p_employee_id,
    p_step_id,
    greatest(coalesce(p_watched_seconds, 0), 0),
    nullif(p_duration_seconds, 0),
    v_pct,
    case when p_event = 'complete' or (p_event = 'watch' and v_pct >= 90) then now() end
  )
  on conflict (employee_id, step_id) do update set
    last_opened_at   = case when p_event = 'open' then now() else p.last_opened_at end,
    open_count       = p.open_count + case when p_event = 'open' then 1 else 0 end,
    watched_seconds  = greatest(p.watched_seconds, excluded.watched_seconds),
    duration_seconds = coalesce(excluded.duration_seconds, p.duration_seconds),
    watched_pct      = greatest(p.watched_pct, excluded.watched_pct),
    completed_at     = coalesce(p.completed_at, excluded.completed_at),
    updated_at       = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.onboarding_record_progress(uuid, text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.onboarding_record_progress(uuid, text, text, integer, integer) to service_role;

-- =========================================================================
-- 5. One row per employee: pending / in progress / completed
-- =========================================================================
create or replace view public.onboarding_employee_summary
with (security_invoker = true) as
with totals as (
  select
    count(*) filter (where step_type = 'section' and is_active) as sections_total,
    count(*) filter (where step_type = 'video' and is_active and video_path is not null) as videos_total
  from public.onboarding_steps
),
agg as (
  select
    p.employee_id,
    min(p.first_opened_at) as first_opened_at,
    max(greatest(p.last_opened_at, p.updated_at)) as last_activity_at,
    count(*) filter (where s.step_type = 'section' and s.is_active and p.completed_at is not null) as sections_done,
    count(*) filter (where s.step_type = 'video' and s.is_active and s.video_path is not null and p.completed_at is not null) as videos_done,
    coalesce(sum(p.watched_seconds) filter (where s.step_type = 'video'), 0) as video_seconds_watched,
    max(p.completed_at) as last_completed_at
  from public.onboarding_progress p
  join public.onboarding_steps s on s.id = p.step_id
  group by p.employee_id
)
select
  e.id as employee_id,
  e.employee_id as employee_code,
  e.name,
  e.date_of_joining,
  (a.employee_id is not null) as has_opened,
  a.first_opened_at,
  a.last_activity_at,
  coalesce(a.sections_done, 0) as sections_done,
  t.sections_total,
  case when t.sections_total > 0 then round(100.0 * coalesce(a.sections_done, 0) / t.sections_total, 1) else 0 end as sections_pct,
  coalesce(a.videos_done, 0) as videos_done,
  t.videos_total,
  case when t.videos_total > 0 then round(100.0 * coalesce(a.videos_done, 0) / t.videos_total, 1) else 0 end as videos_pct,
  coalesce(a.video_seconds_watched, 0) as video_seconds_watched,
  case when t.sections_total + t.videos_total > 0
    then round(100.0 * (coalesce(a.sections_done, 0) + coalesce(a.videos_done, 0)) / (t.sections_total + t.videos_total), 1)
    else 0 end as overall_pct,
  case
    when t.sections_total + t.videos_total > 0
      and coalesce(a.sections_done, 0) + coalesce(a.videos_done, 0) >= t.sections_total + t.videos_total then 'completed'
    when a.employee_id is not null then 'in_progress'
    else 'pending'
  end as status,
  case
    when t.sections_total + t.videos_total > 0
      and coalesce(a.sections_done, 0) + coalesce(a.videos_done, 0) >= t.sections_total + t.videos_total then a.last_completed_at
  end as completed_at
from public.hrm_employees e
cross join totals t
left join agg a on a.employee_id = e.id;

comment on table public.onboarding_steps is 'Onboarding checklist: sections (Mark as read) and guide videos (video_path inside the onboarding-videos bucket).';
comment on table public.onboarding_progress is 'Per-employee onboarding progress: opened, video watch %, completed.';
comment on view public.onboarding_employee_summary is 'Per-employee onboarding status: pending / in_progress / completed, with % of sections, videos and overall.';
