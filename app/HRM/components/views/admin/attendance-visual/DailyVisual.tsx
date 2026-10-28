'use client';

import React, { useMemo, useState } from 'react';
import { Avatar } from '../dashboard/shared';
import {
  Card, LegendItem, Ring, STATUS_META, STATUS_ORDER, Stat, StatusKey,
  average, clockToMinutes, durationToMinutes, isSet, minutesToClock, minutesToDuration, statusKey, useEmployeePhotos,
} from './helpers';

// Visual view of Daily Attendance: the same rows as the table (respecting its filters), shown as
// check-in / check-out / absent rings, a status mix bar, an arrival timeline, department bars and a people board.

const OFF: StatusKey[] = ['on_leave', 'holiday', 'weekend', 'missing'];
const BIN = 30; // minutes per arrival-timeline bar
// people board: who needs attention first
const PEOPLE_ORDER: StatusKey[] = ['absent', 'halfday', 'present', 'on_leave', 'holiday', 'weekend', 'missing'];

const hasCheckedIn = (row) => isSet(row.checkIn) || Number(row.swipeCount) > 0;

function finalStatus(row): StatusKey {
  const key = statusKey(row.status);
  if (OFF.includes(key)) return key;
  if (key === 'present' || key === 'halfday') return key;
  return hasCheckedIn(row) ? 'present' : 'absent';
}

function RingCard({ title, ring, children }) {
  return (
    <Card className="flex items-center gap-3.5">
      {ring}
      <div className="min-w-0 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{title}</p>
        {children}
      </div>
    </Card>
  );
}

function StatusMix({ counts, total }) {
  const parts = STATUS_ORDER.filter((key) => counts[key]);
  return (
    <Card title="Status mix" icon="donut_small" aside={<span className="text-xs font-bold text-slate-400">{total} employees</span>}>
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full bg-slate-100">
        {parts.map((key) => (
          <span
            key={key}
            className="h-full first:rounded-l-full last:rounded-r-full transition-[width] duration-700"
            style={{ width: `${(counts[key] / total) * 100}%`, background: STATUS_META[key].bar }}
            title={`${STATUS_META[key].label}: ${counts[key]} (${Math.round((counts[key] / total) * 100)}%)`}
          />
        ))}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {parts.map((key) => <LegendItem key={key} dot={STATUS_META[key].dot} count={counts[key]} label={STATUS_META[key].label.toLowerCase()} />)}
      </div>
    </Card>
  );
}

function ArrivalTimeline({ rows }) {
  const arrivals = rows
    .map((row) => ({ row, minutes: clockToMinutes(row.checkIn), late: isSet(row.lateIn) }))
    .filter((item) => item.minutes != null);
  if (!arrivals.length) {
    return (
      <Card title="Arrival timeline" icon="schedule">
        <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-500">No check-ins recorded for this day.</p>
      </Card>
    );
  }
  const times = arrivals.map((item) => item.minutes);
  const start = Math.floor(Math.min(...times) / BIN) * BIN;
  const end = Math.max(start + BIN * 6, Math.ceil((Math.max(...times) + 1) / BIN) * BIN);
  const bins = [];
  for (let at = start; at < end; at += BIN) {
    const inBin = arrivals.filter((item) => item.minutes >= at && item.minutes < at + BIN);
    bins.push({ at, onTime: inBin.filter((item) => !item.late).length, late: inBin.filter((item) => item.late).length, names: inBin.map((item) => item.row.employeeName) });
  }
  const peak = Math.max(...bins.map((bin) => bin.onTime + bin.late));
  const lateCount = arrivals.filter((item) => item.late).length;

  return (
    <Card
      title="Arrival timeline"
      icon="schedule"
      aside={
        <div className="flex gap-3">
          <LegendItem dot="bg-[#3170c5]" count={arrivals.length - lateCount} label="on time" />
          <LegendItem dot="bg-amber-400" count={lateCount} label="late" />
        </div>
      }
    >
      <div className="relative flex h-[150px] items-end gap-1.5 border-b border-slate-200 pb-px">
        {bins.map((bin) => {
          const total = bin.onTime + bin.late;
          return (
            <div key={bin.at} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end" title={`${minutesToClock(bin.at)} – ${minutesToClock(bin.at + BIN)}: ${total} check-in${total === 1 ? '' : 's'}${bin.names.length ? `\n${bin.names.join(', ')}` : ''}`}>
              {total ? <span className="mb-1 text-center text-[10.5px] font-bold tabular-nums text-slate-500 opacity-0 transition group-hover:opacity-100">{total}</span> : null}
              <div className="flex flex-col gap-[2px]" style={{ height: `${(total / peak) * 118}px` }}>
                {bin.late ? <span className="rounded-t-[4px] bg-amber-400 transition-[height] duration-700" style={{ flex: bin.late }} /> : null}
                {bin.onTime ? <span className={`bg-[#3170c5] transition-[height] duration-700 group-hover:bg-[#2558a2] ${bin.late ? '' : 'rounded-t-[4px]'}`} style={{ flex: bin.onTime }} /> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {bins.map((bin, index) => (
          <span key={bin.at} className="min-w-0 flex-1 text-center text-[10px] font-semibold text-slate-400">{index % 2 === 0 ? minutesToClock(bin.at).replace(':00', '') : ''}</span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat icon="wb_twilight" label="Earliest" value={minutesToClock(Math.min(...times))} />
        <Stat icon="avg_time" label="Average in" value={minutesToClock(average(times))} />
        <Stat icon="bedtime" label="Latest" value={minutesToClock(Math.max(...times))} />
        <Stat icon="running_with_errors" label="Late" value={`${lateCount} people`} />
      </div>
    </Card>
  );
}

function DepartmentBars({ rows }) {
  const departments = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => {
      const key = row.department || 'Other';
      const entry = map.get(key) || { name: key, working: 0, in: 0 };
      if (!OFF.includes(statusKey(row.status))) {
        entry.working += 1;
        if (hasCheckedIn(row)) entry.in += 1;
      }
      map.set(key, entry);
    });
    return [...map.values()].filter((entry) => entry.working).sort((a, b) => b.working - a.working);
  }, [rows]);

  return (
    <Card title="By department" icon="corporate_fare" aside={<span className="text-xs font-bold text-slate-400">checked in / working</span>}>
      {departments.length ? (
        <div className="hrm-soft-scroll max-h-[262px] space-y-3 overflow-y-auto pr-1">
          {departments.map((entry) => {
            const pct = Math.round((entry.in / entry.working) * 100);
            return (
              <div key={entry.name} title={`${entry.name}: ${entry.in} of ${entry.working} checked in (${pct}%)`}>
                <div className="mb-1 flex items-center justify-between gap-2 text-[12.5px]">
                  <span className="truncate font-semibold text-slate-700">{entry.name}</span>
                  <span className="shrink-0 font-bold tabular-nums text-slate-500">{entry.in}/{entry.working} · {pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-[width] duration-700 ${pct === 100 ? 'bg-[#22a07a]' : pct >= 75 ? 'bg-[#3170c5]' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-[13px] font-semibold text-slate-500">No one is scheduled to work on this day.</p>
      )}
    </Card>
  );
}

function PersonTile({ row, photo, status, onOpen }) {
  const meta = STATUS_META[status];
  const hours = durationToMinutes(row.workHours);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex min-w-0 items-center gap-2.5 rounded-2xl border border-transparent px-2.5 py-2 text-left ring-1 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_24px_-16px_rgba(15,23,42,0.4)] ${meta.soft} ${meta.ring}`}
      title={`${row.employeeName} · ${row.employeeId} — ${meta.label}. Click to view swipes.`}
    >
      <div className="relative">
        <Avatar name={row.employeeName} src={photo} size={38} className="ring-2 ring-white" />
        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${meta.dot}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-slate-900">{row.employeeName}</p>
        <p className="truncate font-mono text-[11px] font-semibold text-slate-500">{row.employeeId}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[11px] font-bold tabular-nums text-slate-700">{isSet(row.checkIn) ? row.checkIn : '—'}{isSet(row.checkOut) ? <span className="hidden text-slate-400 sm:inline"> → {row.checkOut}</span> : null}</p>
        <p className={`text-[10.5px] font-semibold ${meta.text}`}>{hours ? minutesToDuration(hours) : meta.label}</p>
      </div>
    </button>
  );
}

export default function DailyVisual({ rows, date, onOpenSwipes }) {
  const photos = useEmployeePhotos();
  const [filter, setFilter] = useState<'all' | StatusKey>('all');
  const isToday = date === new Date().toLocaleDateString('en-CA');

  const withStatus = rows.map((row) => ({ row, status: finalStatus(row) }));
  const counts = STATUS_ORDER.reduce((acc, key) => ({ ...acc, [key]: withStatus.filter((item) => item.status === key).length }), {} as Record<StatusKey, number>);
  const working = withStatus.filter((item) => !OFF.includes(item.status)).map((item) => item.row);
  const checkedIn = working.filter(hasCheckedIn);
  const checkedOut = checkedIn.filter((row) => isSet(row.checkOut));
  const absent = counts.absent;
  const hours = checkedIn.map((row) => durationToMinutes(row.workHours)).filter(Boolean);
  const shown = withStatus
    .filter((item) => filter === 'all' || item.status === filter)
    .sort((a, b) => PEOPLE_ORDER.indexOf(a.status) - PEOPLE_ORDER.indexOf(b.status) || a.row.employeeName.localeCompare(b.row.employeeName));
  const chips = (['all', ...STATUS_ORDER.filter((key) => counts[key])] as Array<'all' | StatusKey>);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.5fr)]">
        <RingCard title="Check-in" ring={<Ring value={checkedIn.length} total={working.length} color="emerald" caption="in" />}>
          <LegendItem dot="bg-emerald-500" count={checkedIn.length} label="checked in" />
          <LegendItem dot="bg-rose-400" count={working.length - checkedIn.length} label={isToday ? 'not yet' : 'no check-in'} />
        </RingCard>
        <RingCard title="Check-out" ring={<Ring value={checkedOut.length} total={checkedIn.length} color="blue" caption="out" />}>
          <LegendItem dot="bg-[#3170c5]" count={checkedOut.length} label="checked out" />
          <LegendItem dot="bg-amber-400" count={checkedIn.length - checkedOut.length} label={isToday ? 'still in' : 'no check-out'} />
        </RingCard>
        <RingCard title="Final" ring={<Ring value={absent} total={working.length} color="rose" caption="absent" />}>
          <LegendItem dot="bg-amber-400" count={counts.halfday} label="half day" />
          <LegendItem dot="bg-slate-400" count={hours.length ? minutesToDuration(average(hours)) : '—'} label="avg hours" />
        </RingCard>
        <div className="sm:col-span-3 xl:col-span-1">
          <StatusMix counts={counts} total={rows.length} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <ArrivalTimeline rows={working} />
        <DepartmentBars rows={rows} />
      </div>

      <Card
        title="People"
        icon="groups"
        aside={
          <div className="flex flex-wrap gap-1.5">
            {chips.map((key) => {
              const active = filter === key;
              const meta = key === 'all' ? null : STATUS_META[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold transition ${active ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {meta ? <span className={`h-2 w-2 rounded-full ${meta.dot}`} /> : null}
                  {meta ? meta.label : 'All'} <span className="tabular-nums text-slate-400">{key === 'all' ? rows.length : counts[key]}</span>
                </button>
              );
            })}
          </div>
        }
      >
        <div key={filter} className="hrm-fade hrm-soft-scroll grid max-h-[460px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {shown.map(({ row, status }) => (
            <PersonTile key={`${row.employeeId}-${row.date}`} row={row} status={status} photo={photos.get(row.employeeRecordId)} onOpen={() => row.employeeRecordId && onOpenSwipes(row)} />
          ))}
        </div>
      </Card>
    </div>
  );
}
