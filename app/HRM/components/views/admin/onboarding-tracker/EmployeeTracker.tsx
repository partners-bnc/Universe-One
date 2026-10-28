'use client';

import React, { useEffect, useMemo, useState } from 'react';
import HrmEmptyState from '../../../ui/HrmEmptyState';
import { Avatar, Skeleton } from '../dashboard/shared';
import { Ring } from '../attendance-visual/helpers';

// HR admin → Onboarding Progress → Employee Tracker.
// Pick one employee (newest joiners first) and see their whole onboarding: every section (opened / read),
// every video inside each section (how much watched, plays, when), totals and an activity timeline.
// Data: GET /HRM/api/admin/onboarding-progress (same feed as the Onboarding Progress overview).

type Status = 'pending' | 'in_progress' | 'completed';

const STATUS: Record<Status, { label: string; pill: string; dot: string }> = {
  pending: { label: 'Pending', pill: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-300' },
  in_progress: { label: 'In progress', pill: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  completed: { label: 'Completed', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
};
const MODULE_LABEL = { hrms: 'HRMS', 'task-manager': 'Task Manager', crm: 'CRM' };

const fmtDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const fmtDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '—');
const fmtDuration = (seconds) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (total >= 3600) return `${Math.floor(total / 3600)}h ${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}m`;
  return total >= 60 ? `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, '0')}s` : `${total}s`;
};
const shortTitle = (title) => String(title).replace(/^[^·]*·\s*/, '');

function StatusPill({ status }: { status: Status }) {
  const meta = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${meta.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-3 py-2.5">
      <span className="hidden sm:block"><span className="material-symbols-outlined block text-[19px] text-slate-500">{icon}</span></span>
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="truncate text-[13.5px] font-bold tabular-nums text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function VideoRow({ video }) {
  const state = video.completedAt ? 'done' : video.watchedPct > 0 ? 'partial' : 'none';
  return (
    <div className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
      <span className={`material-symbols-outlined text-[20px] ${state === 'done' ? 'text-emerald-500' : state === 'partial' ? 'text-amber-500' : 'text-slate-300'}`} style={state === 'done' ? { fontVariationSettings: "'FILL' 1" } : undefined}>
        {state === 'done' ? 'check_circle' : state === 'partial' ? 'play_circle' : 'radio_button_unchecked'}
      </span>
      <p className="truncate text-[13px] font-semibold text-slate-700">{shortTitle(video.title)}</p>
      <span className={`text-[11.5px] font-bold tabular-nums ${state === 'done' ? 'text-emerald-600' : state === 'partial' ? 'text-amber-600' : 'text-slate-400'}`}>
        {state === 'done' ? 'Completed' : state === 'partial' ? `${Math.round(video.watchedPct)}% watched` : 'Not watched'}
      </span>
      <span />
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-[width] duration-700 ${state === 'done' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, video.watchedPct)}%` }} />
      </div>
      <span className="text-[10.5px] font-semibold tabular-nums text-slate-400">
        {video.durationSeconds ? `${fmtDuration(video.watchedSeconds)} / ${fmtDuration(video.durationSeconds)}` : '—'}
      </span>
      {video.lastWatchedAt ? (
        <p className="col-start-2 col-end-4 text-[10.5px] text-slate-400">
          Played {video.playCount}× · first {fmtDateTime(video.openedAt)} · last {fmtDateTime(video.lastWatchedAt)}{video.completedAt ? ` · completed ${fmtDateTime(video.completedAt)}` : ''}
        </p>
      ) : null}
    </div>
  );
}

function Journey({ employee }) {
  return (
    <ol className="relative space-y-3">
      {employee.sections.map((section, index) => {
        const videos = employee.videos.filter((video) => video.sectionId === section.sectionId);
        const videosDone = videos.filter((video) => video.completedAt).length;
        const state = section.completedAt ? 'read' : section.openedAt ? 'opened' : 'pending';
        const modules: string[] = [...new Set<string>(videos.map((video) => video.module || 'other'))];
        return (
          <li key={section.id} className="relative flex gap-3.5">
            {index < employee.sections.length - 1 ? <span className="absolute bottom-[-12px] left-[17px] top-10 w-px bg-slate-200" aria-hidden="true" /> : null}
            <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold ring-4 ring-white ${state === 'read' ? 'bg-emerald-500 text-white' : state === 'opened' ? 'bg-[#edf4fc] text-[#2558a2]' : 'bg-slate-100 text-slate-400'}`}>
              {state === 'read' ? <span className="material-symbols-outlined text-[18px]">check</span> : String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[14px] font-bold text-slate-900">{section.title}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {videos.length ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${videosDone === videos.length ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {videosDone}/{videos.length} videos
                    </span>
                  ) : null}
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${state === 'read' ? 'bg-emerald-50 text-emerald-700' : state === 'opened' ? 'bg-[#edf4fc] text-[#2558a2]' : 'bg-slate-100 text-slate-500'}`}>
                    {state === 'read' ? 'Marked as read' : state === 'opened' ? 'Opened, not marked read' : 'Not opened'}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-[11.5px] text-slate-500">
                {state === 'pending'
                  ? 'The employee hasn’t opened this section yet.'
                  : `Opened ${section.openCount}× · first ${fmtDateTime(section.openedAt)} · last ${fmtDateTime(section.lastOpenedAt)}${section.completedAt ? ` · read ${fmtDateTime(section.completedAt)}` : ''}`}
              </p>
              {videos.length ? (
                <div className="mt-3 space-y-3">
                  {modules.map((module) => (
                    <div key={module} className="rounded-xl bg-slate-50/80 p-3">
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        {MODULE_LABEL[module] || module} · {videos.filter((v) => (v.module || 'other') === module && v.completedAt).length}/{videos.filter((v) => (v.module || 'other') === module).length} completed
                      </p>
                      <div className="space-y-3">
                        {videos.filter((video) => (video.module || 'other') === module).map((video) => <VideoRow key={video.id} video={video} />)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Timeline({ employee }) {
  const events = useMemo(() => {
    const list = [];
    employee.sections.forEach((section) => {
      if (section.openedAt) list.push({ at: section.openedAt, icon: 'visibility', tone: 'text-[#3170c5]', text: `Opened “${section.title}”` });
      if (section.completedAt) list.push({ at: section.completedAt, icon: 'task_alt', tone: 'text-emerald-500', text: `Marked “${section.title}” as read` });
    });
    employee.videos.forEach((video) => {
      if (video.openedAt) list.push({ at: video.openedAt, icon: 'play_circle', tone: 'text-amber-500', text: `Started video “${shortTitle(video.title)}”` });
      if (video.completedAt) list.push({ at: video.completedAt, icon: 'check_circle', tone: 'text-emerald-500', text: `Finished video “${shortTitle(video.title)}”` });
    });
    return list.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  }, [employee]);

  if (!events.length) return <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-500">No activity yet.</p>;
  return (
    <ol className="hrm-soft-scroll max-h-[520px] space-y-2.5 overflow-y-auto pr-1">
      {events.map((event, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <span className={`material-symbols-outlined mt-0.5 text-[18px] ${event.tone}`}>{event.icon}</span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold leading-snug text-slate-700">{event.text}</p>
            <p className="text-[11px] text-slate-400">{fmtDateTime(event.at)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function EmployeeTracker({ selectedId, onSelect, onOpenProfile }: { selectedId?: string; onSelect?: (id: string) => void; onOpenProfile?: (id: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [localId, setLocalId] = useState('');

  useEffect(() => {
    let alive = true;
    fetch('/HRM/api/admin/onboarding-progress', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not load onboarding progress');
        if (alive) { setData(result); setError(''); }
      })
      .catch((err) => { if (alive) setError(err.message || 'Could not load onboarding progress'); });
    return () => { alive = false; };
  }, [reloadKey]);

  const employees = useMemo(() => data?.employees || [], [data]);
  const query = search.trim().toLowerCase();
  const listed = employees.filter((e) => !query || `${e.name} ${e.code} ${e.department} ${e.designation}`.toLowerCase().includes(query));
  const activeId = selectedId || localId;
  const employee = employees.find((e) => e.id === activeId) || employees[0] || null;
  const pick = (id) => { setLocalId(id); onSelect?.(id); };
  const loading = !data && !error;

  const watchTotal = employee ? employee.videos.reduce((sum, video) => sum + (video.watchedSeconds || 0), 0) : 0;
  const pendingSections = employee ? employee.sections.filter((section) => !section.completedAt) : [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-5 md:p-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[26px] text-[#111418]">person_search</span>
            <h1 className="font-headline text-[28px] font-extrabold tracking-tight text-slate-900">Employee Tracker</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">One employee’s full onboarding: every section, every video inside it, and when it happened.</p>
        </div>
        <button
          type="button"
          onClick={() => { setData(null); setReloadKey((key) => key + 1); }}
          className="inline-flex items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </button>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>
      ) : data && !data.tracking ? (
        <HrmEmptyState icon="database" title="Onboarding tracking isn’t switched on yet" message="Run the onboarding tracking migration in the Supabase SQL Editor." />
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* employee picker */}
          <aside className="rounded-[24px] border border-white/80 bg-white/85 p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)] xl:sticky xl:top-5">
            <label className="mb-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
            <p className="px-2 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">Newest joiners first</p>
            {loading ? (
              <div className="space-y-2">{[0, 1, 2, 3, 4, 5].map((k) => <Skeleton key={k} className="h-14" />)}</div>
            ) : (
              <div className="hrm-soft-scroll max-h-[340px] space-y-1 overflow-y-auto pr-1 xl:max-h-[calc(100vh-220px)]">
                {listed.map((item) => {
                  const active = employee?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => pick(item.id)}
                      className={`flex w-full items-center gap-2.5 rounded-2xl px-2.5 py-2 text-left transition ${active ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'}`}
                    >
                      <div className="relative">
                        <Avatar name={item.name} src={item.photo} size={36} />
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${STATUS[item.status].dot}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-slate-800">{item.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${item.overallPct}%` }} />
                          </div>
                          <span className="text-[10.5px] font-bold tabular-nums text-slate-500">{item.overallPct}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!listed.length ? <p className="px-2 py-4 text-center text-[12.5px] text-slate-400">No employee matches.</p> : null}
              </div>
            )}
          </aside>

          {/* the selected employee */}
          {loading ? (
            <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-96" /></div>
          ) : !employee ? (
            <HrmEmptyState icon="person_search" title="No employees" message="Employees appear here once they are added to HRM." />
          ) : (
            <div key={employee.id} className="hrm-fade space-y-5">
              <section className="rounded-[24px] border border-white/80 bg-gradient-to-br from-white via-white to-[#f3f7fd] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)]">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Avatar name={employee.name} src={employee.photo} size={68} className="ring-4 ring-[#edf4fc]" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-headline text-[20px] font-bold text-slate-900">{employee.name}</p>
                        <StatusPill status={employee.status} />
                      </div>
                      <p className="truncate text-[13px] text-slate-500"><span className="font-mono font-semibold text-slate-600">{employee.code || '—'}</span>{employee.designation ? ` · ${employee.designation}` : ''}{employee.department ? ` · ${employee.department}` : ''}</p>
                      <p className="mt-0.5 text-[12px] text-slate-400">Joined {fmtDate(employee.joinedOn)}</p>
                      {onOpenProfile ? (
                        <button type="button" onClick={() => onOpenProfile(employee.id)} className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-bold text-[#2558a2] hover:underline">
                          Open profile <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Ring value={employee.overallPct} total={100} color={employee.status === 'completed' ? 'emerald' : 'amber'} caption="overall" size={92} />
                    <div className="space-y-1.5 text-[12.5px] font-semibold text-slate-600">
                      <p><b className="tabular-nums text-slate-800">{employee.sectionsDone}/{employee.sectionsTotal}</b> sections read</p>
                      <p><b className="tabular-nums text-slate-800">{employee.videosDone}/{employee.videosTotal}</b> videos completed</p>
                      <p><b className="tabular-nums text-slate-800">{employee.videoWatchPct}%</b> of video content watched</p>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[13px] font-semibold ${pendingSections.length ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
                  <span className="material-symbols-outlined text-[19px]">{pendingSections.length ? 'pending_actions' : 'verified'}</span>
                  <p>
                    {pendingSections.length
                      ? `${employee.sectionsDone} of ${employee.sectionsTotal} sections completed. Still pending: ${pendingSections.map((section) => section.title).join(', ')}.`
                      : `All ${employee.sectionsTotal} sections completed.`}
                    {employee.videosTotal ? ` ${employee.videosTotal - employee.videosDone ? `${employee.videosTotal - employee.videosDone} video${employee.videosTotal - employee.videosDone === 1 ? '' : 's'} still to finish.` : 'Every video watched.'}` : ''}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <Fact icon="schedule" label="Time watched" value={fmtDuration(watchTotal)} />
                  <Fact icon="login" label="First opened" value={employee.firstOpenedAt ? fmtDateTime(employee.firstOpenedAt) : 'Never'} />
                  <Fact icon="update" label="Last activity" value={employee.lastActivityAt ? fmtDateTime(employee.lastActivityAt) : '—'} />
                  <Fact icon="flag" label="Completed on" value={employee.completedAt ? fmtDate(employee.completedAt) : 'Not yet'} />
                </div>
              </section>

              <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)]">
                  <h3 className="mb-4 flex items-center gap-2 font-headline text-[16px] font-bold text-slate-800">
                    <span className="material-symbols-outlined text-[20px] text-[#3170c5]">route</span>
                    Onboarding journey
                  </h3>
                  <Journey employee={employee} />
                </section>
                <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)] 2xl:sticky 2xl:top-5">
                  <h3 className="mb-4 flex items-center gap-2 font-headline text-[16px] font-bold text-slate-800">
                    <span className="material-symbols-outlined text-[20px] text-[#3170c5]">history</span>
                    Activity
                  </h3>
                  <Timeline employee={employee} />
                </section>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
