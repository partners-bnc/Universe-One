'use client';

import React, { useState } from 'react';
import { Avatar, CountUp, Panel, Skeleton } from './shared';

// Today's attendance from the admin attendance API (mode=daily), in three views:
// Check-in (who has / hasn't come in), Check-out (who has left / is still in) and Final (status for the day + absent %).
// Rows for people who are off today (leave / holiday / weekly off) are counted separately.

const OFF_STATUSES = new Set(['on_leave', 'holiday', 'weekend']);
const isSet = (value) => Boolean(value) && !['--', '-'].includes(value);
const hasCheckedIn = (row) => isSet(row.checkIn) || Number(row.swipeCount) > 0;
const hasCheckedOut = (row) => isSet(row.checkOut);
const byName = (a, b) => a.employeeName.localeCompare(b.employeeName);
const byTime = (key) => (a, b) => String(a[key]).localeCompare(String(b[key]));

function finalStatus(row) {
  const status = String(row.status || '').toLowerCase();
  if (status === 'present') return 'present';
  if (status === 'halfday' || status === 'late') return 'halfday';
  if (status === 'absent' || !hasCheckedIn(row)) return 'absent';
  return 'present';
}

const TONES = {
  emerald: { tile: 'border-emerald-100 bg-emerald-50/40', ring: 'ring-emerald-300', dot: 'bg-emerald-500', chip: 'text-emerald-700 ring-emerald-200', title: 'text-emerald-600' },
  rose: { tile: 'border-rose-100 bg-rose-50/50', ring: 'ring-rose-200 grayscale-[35%]', dot: 'bg-rose-400', chip: 'text-rose-600 ring-rose-200', title: 'text-rose-500' },
  blue: { tile: 'border-[#d7e7f9] bg-[#edf4fc]/60', ring: 'ring-[#afd0f4]', dot: 'bg-[#3170c5]', chip: 'text-[#2558a2] ring-[#d7e7f9]', title: 'text-[#2558a2]' },
  amber: { tile: 'border-amber-100 bg-amber-50/50', ring: 'ring-amber-200', dot: 'bg-amber-400', chip: 'text-amber-700 ring-amber-200', title: 'text-amber-600' },
};
const RING_COLORS = { emerald: ['#34c38f', '#0f8a63'], blue: ['#7eb0ec', '#2558a2'], rose: ['#f99aab', '#d6456c'] };

const TABS = [
  { key: 'in', label: 'Check-in', icon: 'login' },
  { key: 'out', label: 'Check-out', icon: 'logout' },
  { key: 'final', label: 'Final', icon: 'fact_check' },
];

function Ring({ value, total, color, caption }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  const [from, to] = RING_COLORS[color];
  return (
    <div className="relative h-[68px] w-[68px] shrink-0">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#eef2f8" strokeWidth="12" />
        <circle
          cx="55" cy="55" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
          stroke={`url(#hrm-att-${color})`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
        <defs>
          <linearGradient id={`hrm-att-${color}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-headline text-[14px] font-bold leading-none text-slate-700 tabular-nums"><CountUp value={Math.round(pct * 100)} />%</p>
          <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-[0.12em] text-slate-400">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function PersonTile({ row, photo, tone, chip, onOpen }) {
  const t = TONES[tone];
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex min-w-0 items-center gap-2.5 rounded-2xl border px-2.5 py-2 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.4)] ${t.tile}`}
      title={`${row.employeeName} · ${row.employeeId}`}
    >
      <div className="relative">
        <Avatar name={row.employeeName} src={photo} size={38} className={`ring-2 ${t.ring}`} />
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${t.dot}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-slate-900">{row.employeeName}</p>
        <p className="truncate font-mono text-[11px] font-semibold text-slate-500">{row.employeeId}</p>
      </div>
      <span className={`shrink-0 rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold ring-1 ${t.chip}`}>{chip}</span>
    </button>
  );
}

function Group({ title, icon, tone, rows, chip, photos, onOpenEmployee, emptyText = "", scroll = false }) {
  return (
    <div>
      <p className={`mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] ${TONES[tone].title}`}>
        <span className="material-symbols-outlined text-[16px]">{icon}</span> {title} · {rows.length}
      </p>
      {rows.length ? (
        <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 2xl:grid-cols-3 ${scroll ? 'hrm-soft-scroll max-h-[300px] overflow-y-auto pr-1' : ''}`}>
          {rows.map((row) => (
            <PersonTile key={row.employeeRecordId} row={row} photo={photos.get(row.employeeRecordId)} tone={tone} chip={chip(row)} onOpen={() => onOpenEmployee(row.employeeRecordId)} />
          ))}
        </div>
      ) : emptyText ? (
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-500">{emptyText}</p>
      ) : null}
    </div>
  );
}

function LegendItem({ dot, count, label }) {
  return (
    <p className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-slate-500">
      <span className={`h-2 w-2 rounded-full ${dot}`} /> <b className="tabular-nums text-slate-700">{count}</b> {label}
    </p>
  );
}

export default function TodayAttendance({ rows, photos, loading, error, onOpenEmployee }) {
  const [tab, setTab] = useState('in');
  const working = (rows || []).filter((row) => !OFF_STATUSES.has(String(row.status || '').toLowerCase()));
  const off = (rows || []).length - working.length;
  const inToday = working.filter(hasCheckedIn).sort(byTime('checkIn'));
  const notYet = working.filter((row) => !hasCheckedIn(row)).sort(byName);
  const checkedOut = inToday.filter(hasCheckedOut).sort(byTime('checkOut'));
  const stillIn = inToday.filter((row) => !hasCheckedOut(row)).sort(byName);
  const present = working.filter((row) => finalStatus(row) === 'present').sort(byName);
  const halfDay = working.filter((row) => finalStatus(row) === 'halfday').sort(byName);
  const absent = working.filter((row) => finalStatus(row) === 'absent').sort(byName);
  const shared = { photos, onOpenEmployee };

  const views = {
    in: {
      ring: <Ring value={inToday.length} total={working.length} color="emerald" caption="in" />,
      legend: <><LegendItem dot="bg-emerald-500" count={inToday.length} label="checked in" /><LegendItem dot="bg-rose-400" count={notYet.length} label="not yet" /></>,
      groups: (
        <>
          <Group {...shared} title="Not checked in yet" icon="schedule" tone="rose" rows={notYet} chip={() => 'Not yet'} emptyText="Everyone working today has checked in. 🎉" />
          <Group {...shared} title="Checked in" icon="login" tone="emerald" rows={inToday} chip={(row) => row.checkIn} scroll />
        </>
      ),
    },
    out: {
      ring: <Ring value={checkedOut.length} total={inToday.length} color="blue" caption="out" />,
      legend: <><LegendItem dot="bg-[#3170c5]" count={checkedOut.length} label="checked out" /><LegendItem dot="bg-amber-400" count={stillIn.length} label="still in" /></>,
      groups: (
        <>
          <Group {...shared} title="Still in office" icon="apartment" tone="amber" rows={stillIn} chip={(row) => `In ${row.checkIn}`} emptyText={inToday.length ? 'Everyone has checked out for the day.' : 'No one has checked in yet.'} />
          <Group {...shared} title="Checked out" icon="logout" tone="blue" rows={checkedOut} chip={(row) => row.checkOut} scroll />
        </>
      ),
    },
    final: {
      ring: <Ring value={absent.length} total={working.length} color="rose" caption="absent" />,
      legend: <><LegendItem dot="bg-emerald-500" count={present.length} label="present" /><LegendItem dot="bg-amber-400" count={halfDay.length} label="half day" /><LegendItem dot="bg-rose-400" count={absent.length} label="absent" /></>,
      groups: (
        <>
          <Group {...shared} title="Absent" icon="person_off" tone="rose" rows={absent} chip={() => 'Absent'} emptyText="No one is absent today. 🎉" />
          {halfDay.length ? <Group {...shared} title="Half day" icon="contrast" tone="amber" rows={halfDay} chip={() => 'Half day'} /> : null}
          <Group {...shared} title="Present" icon="verified" tone="emerald" rows={present} chip={() => 'Present'} scroll />
        </>
      ),
    },
  };
  const view = views[tab];

  return (
    <Panel
      title="Today’s Attendance"
      icon="how_to_reg"
      badge={
        <div className="inline-flex rounded-2xl bg-slate-100/80 p-1" role="tablist" aria-label="Attendance view">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12.5px] font-bold transition ${tab === item.key ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      }
    >
      {loading ? (
        <div className="flex gap-6">
          <div className="w-[210px] space-y-3">{[0, 1, 2].map((k) => <Skeleton key={k} className="h-[92px]" />)}</div>
          <div className="grid flex-1 grid-cols-2 gap-2">{[0, 1, 2, 3, 4, 5].map((k) => <Skeleton key={k} className="h-14" />)}</div>
        </div>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* all three charts, stacked; the selected one is highlighted and each one switches the list */}
          <div className="grid grid-cols-1 content-start gap-2.5 self-start sm:grid-cols-3 lg:w-[210px] lg:shrink-0 lg:grid-cols-1">
            {TABS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition ${tab === item.key ? 'border-slate-200 bg-slate-50 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)]' : 'border-transparent hover:bg-slate-50/70'}`}
              >
                {views[item.key].ring}
                <div className="min-w-0 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                  {views[item.key].legend}
                </div>
              </button>
            ))}
            {off ? <div className="px-2.5 pt-1"><LegendItem dot="bg-slate-300" count={off} label="off today" /></div> : null}
          </div>
          <div key={tab} className="hrm-fade min-w-0 flex-1 space-y-5">{view.groups}</div>
        </div>
      )}
    </Panel>
  );
}
