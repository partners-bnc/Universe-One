'use client';

import React, { useEffect, useMemo, useState } from 'react';
import HrmEmptyState from '../../../ui/HrmEmptyState';
import GlassKpi from '../dashboard/GlassKpi';
import { Avatar, Skeleton } from '../dashboard/shared';

// HR admin: who has / hasn't done their onboarding (Other Modules → Onboarding).
// Newest joiners first. Each row: status, overall %, sections read, videos watched; open a row for every
// section (opened / read) and every video (how much watched). Data: GET /HRM/api/admin/onboarding-progress.

type Status = 'pending' | 'in_progress' | 'completed';

const STATUS: Record<Status, { label: string; pill: string; dot: string; bar: string }> = {
  pending: { label: 'Pending', pill: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-300', bar: 'bg-slate-300' },
  in_progress: { label: 'In progress', pill: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400', bar: 'bg-gradient-to-r from-[#f6c56f] to-[#e9a23b]' },
  completed: { label: 'Completed', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', bar: 'bg-gradient-to-r from-[#34c38f] to-[#0f8a63]' },
};
const MODULE_LABEL = { hrms: 'HRMS', 'task-manager': 'Task Manager', crm: 'CRM' };

const fmtDate = (value) => (value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const fmtDateTime = (value) => (value ? new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true }) : '—');
const fmtDuration = (seconds) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  return total >= 60 ? `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, '0')}s` : `${total}s`;
};

function ProgressBar({ pct, className = 'bg-[#3170c5]' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full transition-[width] duration-700 ${className}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const meta = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${meta.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

/** Small "done / total" segmented strip, one segment per step. */
function Segments({ done, total, color, label }) {
  if (!total) return <span className="text-[11px] font-semibold text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-[0.1em] text-slate-400 lg:hidden">{label}</span>
      <div className="flex flex-1 gap-[2px]">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-2 flex-1 first:rounded-l-full last:rounded-r-full ${i < done ? color : 'bg-slate-100'}`} />
        ))}
      </div>
      <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-slate-600">{done}/{total}</span>
    </div>
  );
}

function Detail({ employee }) {
  const groups = useMemo(() => {
    const map = new Map();
    employee.videos.forEach((video) => {
      const key = video.module || 'other';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(video);
    });
    return [...map.entries()];
  }, [employee.videos]);

  return (
    <div className="hrm-fade grid grid-cols-1 gap-5 border-t border-slate-100 bg-slate-50/60 px-4 py-5 md:px-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Sections · {employee.sectionsDone}/{employee.sectionsTotal} read</p>
        <div className="space-y-2">
          {employee.sections.map((section, index) => {
            const state = section.completedAt ? 'read' : section.openedAt ? 'opened' : 'pending';
            return (
              <div key={section.id} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-100">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold ${state === 'read' ? 'bg-emerald-500 text-white' : state === 'opened' ? 'bg-[#edf4fc] text-[#2558a2]' : 'bg-slate-100 text-slate-400'}`}>
                  {state === 'read' ? <span className="material-symbols-outlined text-[18px]">check</span> : String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-slate-800">{section.title}</p>
                  <p className="text-[11.5px] text-slate-500">
                    {state === 'read' ? `Marked as read · ${fmtDateTime(section.completedAt)}` : state === 'opened' ? `Opened ${section.openCount}× · first ${fmtDateTime(section.openedAt)}` : 'Not opened yet'}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${state === 'read' ? 'bg-emerald-50 text-emerald-700' : state === 'opened' ? 'bg-[#edf4fc] text-[#2558a2]' : 'bg-slate-100 text-slate-500'}`}>
                  {state === 'read' ? 'Read' : state === 'opened' ? 'Opened' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Guide videos · {employee.videosDone}/{employee.videosTotal} watched · {employee.videoWatchPct}% average</p>
        {employee.videos.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-6 text-center text-[13px] font-semibold text-slate-500 ring-1 ring-slate-100">No guide videos have been uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {groups.map(([module, items]) => (
              <div key={module} className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                <p className="mb-2 px-1 text-[12px] font-bold text-slate-700">{MODULE_LABEL[module] || module}</p>
                <div className="space-y-2.5">
                  {items.map((video) => {
                    const state = video.completedAt ? 'completed' : video.watchedPct > 0 ? 'in_progress' : 'pending';
                    return (
                      <div key={video.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-1" title={video.lastWatchedAt ? `Last watched ${fmtDateTime(video.lastWatchedAt)}` : 'Not watched yet'}>
                        <p className="truncate text-[12.5px] font-semibold text-slate-700">{String(video.title).replace(/^[^·]*·\s*/, '')}</p>
                        <span className={`text-[11px] font-bold tabular-nums ${state === 'completed' ? 'text-emerald-600' : state === 'in_progress' ? 'text-amber-600' : 'text-slate-400'}`}>
                          {state === 'completed' ? 'Watched' : `${Math.round(video.watchedPct)}%`}
                        </span>
                        <ProgressBar pct={video.watchedPct} className={state === 'completed' ? STATUS.completed.bar : STATUS.in_progress.bar} />
                        <span className="text-[10.5px] font-semibold tabular-nums text-slate-400">
                          {video.durationSeconds ? `${fmtDuration(video.watchedSeconds)} / ${fmtDuration(video.durationSeconds)}` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingTracker({ onOpenEmployee, onOpenTracker }: { onOpenEmployee?: (id: string) => void; onOpenTracker?: (id: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState('');

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
  const counts = useMemo(() => ({
    all: employees.length,
    pending: employees.filter((e) => e.status === 'pending').length,
    in_progress: employees.filter((e) => e.status === 'in_progress').length,
    completed: employees.filter((e) => e.status === 'completed').length,
  }), [employees]);
  const avg = employees.length ? Math.round(employees.reduce((sum, e) => sum + e.overallPct, 0) / employees.length) : 0;
  const query = search.trim().toLowerCase();
  const shown = employees.filter((e) => (filter === 'all' || e.status === filter) && (!query || `${e.name} ${e.code} ${e.department} ${e.designation}`.toLowerCase().includes(query)));
  const loading = !data && !error;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-5 md:p-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[26px] text-[#111418]">school</span>
            <h1 className="font-headline text-[28px] font-extrabold tracking-tight text-slate-900">Onboarding Progress</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Who has started, finished or not opened onboarding: sections read and guide videos watched. Newest joiners first.</p>
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
        <HrmEmptyState
          icon="database"
          title="Onboarding tracking isn’t switched on yet"
          message="Run the migration supabase/migrations/20261027120000_onboarding_progress_tracking.sql in the Supabase SQL Editor. Progress appears here as soon as employees open onboarding."
        />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <GlassKpi label="Employees" value={counts.all} icon="groups" tone="blue" loading={loading} delay={0} />
            <GlassKpi label="Pending" value={counts.pending} of={counts.all || undefined} icon="hourglass_empty" tone="purple" loading={loading} delay={60} />
            <GlassKpi label="In progress" value={counts.in_progress} of={counts.all || undefined} icon="autorenew" tone="amber" loading={loading} delay={120} />
            <GlassKpi label="Completed" value={counts.completed} of={counts.all || undefined} icon="verified" tone="emerald" loading={loading} delay={180} />
            <GlassKpi label="Average completion %" value={avg} icon="percent" tone="blue" loading={loading} delay={240} />
          </section>

          <section className="overflow-hidden rounded-[26px] border border-white/80 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:p-5">
              <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-slate-100/80 p-1">
                {(['all', 'pending', 'in_progress', 'completed'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-bold transition ${filter === key ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {key === 'all' ? null : <span className={`h-2 w-2 rounded-full ${STATUS[key].dot}`} />}
                    {key === 'all' ? 'All' : STATUS[key].label}
                    <span className="tabular-nums text-slate-400">{counts[key]}</span>
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:w-72">
                <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, ID, department" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </label>
            </div>

            {/* column headings (desktop) */}
            <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_28px] gap-4 px-5 pt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:grid">
              <span>Employee</span><span>Joined</span><span>Status</span><span>Overall</span><span>Sections</span><span>Videos</span><span>Last activity</span><span />
            </div>

            {loading ? (
              <div className="space-y-2 p-5">{[0, 1, 2, 3, 4].map((k) => <Skeleton key={k} className="h-16" />)}</div>
            ) : shown.length === 0 ? (
              <div className="p-5"><HrmEmptyState compact icon="person_search" title="No employees match" message="Try another status or search." /></div>
            ) : (
              <div className="divide-y divide-slate-100 pb-2">
                {shown.map((employee) => {
                  const open = openId === employee.id;
                  return (
                    <div key={employee.id}>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? '' : employee.id)}
                        aria-expanded={open}
                        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-3.5 text-left transition hover:bg-slate-50/80 md:px-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_28px] ${open ? 'bg-slate-50/80' : ''}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={employee.name} src={employee.photo} size={40} className="ring-2 ring-white shadow-sm" />
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-bold text-slate-900">{employee.name}</p>
                            <p className="truncate text-[11.5px] text-slate-500"><span className="font-mono font-semibold">{employee.code || '—'}</span>{employee.designation ? ` · ${employee.designation}` : ''}</p>
                          </div>
                        </div>
                        <span className="lg:hidden"><StatusPill status={employee.status} /></span>
                        <span className="hidden text-[12.5px] font-semibold text-slate-600 lg:block">{fmtDate(employee.joinedOn)}</span>
                        <span className="hidden lg:block"><StatusPill status={employee.status} /></span>
                        <div className="col-span-2 flex items-center gap-2.5 lg:col-span-1">
                          <ProgressBar pct={employee.overallPct} className={STATUS[employee.status].bar} />
                          <span className="w-9 shrink-0 text-right text-[12.5px] font-bold tabular-nums text-slate-700">{employee.overallPct}%</span>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4 lg:contents">
                          <Segments done={employee.sectionsDone} total={employee.sectionsTotal} color="bg-emerald-500" label="Sections" />
                          <Segments done={employee.videosDone} total={employee.videosTotal} color="bg-[#3170c5]" label="Videos" />
                        </div>
                        <span className="hidden text-[12px] text-slate-500 lg:block">{employee.lastActivityAt ? fmtDateTime(employee.lastActivityAt) : 'Never opened'}</span>
                        <span className="hidden lg:block"><span className={`material-symbols-outlined block text-[20px] text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>expand_more</span></span>
                      </button>
                      {open ? (
                        <>
                          <Detail employee={employee} />
                          <div className="flex flex-wrap justify-end gap-4 bg-slate-50/60 px-5 pb-4">
                            {onOpenTracker ? (
                              <button type="button" onClick={() => onOpenTracker(employee.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2558a2] hover:underline">
                                Full tracking <span className="material-symbols-outlined text-[16px]">person_search</span>
                              </button>
                            ) : null}
                            {onOpenEmployee ? (
                              <button type="button" onClick={() => onOpenEmployee(employee.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2558a2] hover:underline">
                                Open employee profile <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </button>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          {data?.totals && data.totals.videos < data.totals.videosPlanned ? (
            <p className="text-[12px] text-slate-500">
              {data.totals.videos} of {data.totals.videosPlanned} guide videos are uploaded. Only uploaded videos count towards progress; the rest are added automatically once their files are linked.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
