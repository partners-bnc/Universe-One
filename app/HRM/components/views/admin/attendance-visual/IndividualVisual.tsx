'use client';

import React from 'react';
import { Avatar } from '../dashboard/shared';
import {
  Card, LegendItem, Ring, STATUS_META, STATUS_ORDER, Stat, StatusKey,
  average, clockToMinutes, durationToMinutes, isSet, minutesToClock, minutesToDuration, statusKey, useEmployeePhotos,
} from './helpers';

// Visual view of Individual Attendance: one employee's month as a profile + attendance ring,
// a colour-coded calendar, an "in → out" span chart for every day, and averages.

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFT_MINUTES = 8 * 60 + 30;
const WORKING: StatusKey[] = ['present', 'halfday', 'absent'];

const dayNumber = (date: string) => Number(String(date).slice(8, 10));
const weekdayIndex = (date: string) => (new Date(`${date}T00:00:00`).getDay() + 6) % 7; // Monday = 0

function Calendar({ days, today }: { days: Array<{ row: any; status: StatusKey }>; today: string }) {
  if (!days.length) return null;
  // always draw the full month, so a status filter leaves gaps instead of shifting the grid
  const month = days[0].row.date.slice(0, 7);
  const [year, monthIndex] = month.split('-').map(Number);
  const byDate = new Map<string, { row: any; status: StatusKey }>(days.map((day) => [day.row.date, day]));
  const cells = Array.from({ length: new Date(year, monthIndex, 0).getDate() }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
  const lead = weekdayIndex(cells[0]);
  return (
    <Card title="Month at a glance" icon="calendar_month">
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS.map((day) => <span key={day} className="pb-1 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 sm:text-[10.5px]">{day.slice(0, 1)}<span className="hidden sm:inline">{day.slice(1)}</span></span>)}
        {Array.from({ length: lead }, (_, i) => <span key={`lead-${i}`} />)}
        {cells.map((date) => {
          const day = byDate.get(date);
          if (!day) return <span key={date} className="grid aspect-square min-w-0 place-items-start rounded-lg p-1 text-[11px] sm:rounded-xl sm:p-1.5 sm:text-[12px] font-bold text-slate-200 ring-1 ring-slate-50">{dayNumber(date)}</span>;
          const { row, status } = day;
          const upcoming = row.date > today;
          const meta = STATUS_META[status];
          return (
            <div
              key={row.date}
              title={`${row.date} · ${upcoming ? 'Upcoming' : meta.label}${isSet(row.checkIn) ? `\nIn ${row.checkIn}` : ''}${isSet(row.checkOut) ? ` · Out ${row.checkOut}` : ''}${isSet(row.workHours) ? `\nWorked ${row.workHours}` : ''}${row.notes ? `\n${row.notes}` : ''}`}
              className={`relative flex aspect-square min-w-0 flex-col justify-between rounded-lg p-1 ring-1 sm:rounded-xl sm:p-1.5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-14px_rgba(15,23,42,0.45)] ${upcoming ? 'bg-white ring-slate-100' : `${meta.soft} ${meta.ring}`} ${row.date === today ? 'outline outline-2 outline-offset-1 outline-[#3170c5]' : ''}`}
            >
              <span className={`text-[12px] font-bold tabular-nums ${upcoming ? 'text-slate-300' : 'text-slate-700'}`}>{dayNumber(row.date)}</span>
              {!upcoming ? (
                <span className={`flex min-w-0 items-center gap-1 text-[9.5px] font-bold ${meta.text}`}>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                  <span className="hidden truncate sm:inline">{isSet(row.checkIn) ? row.checkIn.replace(/\s?(AM|PM)$/i, '') : meta.label}</span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {STATUS_ORDER.filter((key) => days.some((day) => day.status === key && day.row.date <= today)).map((key) => (
          <LegendItem key={key} dot={STATUS_META[key].dot} count={days.filter((day) => day.status === key && day.row.date <= today).length} label={STATUS_META[key].label.toLowerCase()} />
        ))}
      </div>
    </Card>
  );
}

function SpanChart({ days, today }) {
  const spans = days
    .filter((day) => day.row.date <= today)
    .map((day) => ({ ...day, in: clockToMinutes(day.row.checkIn), out: clockToMinutes(day.row.checkOut) }));
  const times = spans.flatMap((span) => [span.in, span.out]).filter((value) => value != null);
  if (!times.length) {
    return (
      <Card title="In → out, every day" icon="timeline">
        <p className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-[13px] font-semibold text-slate-500">No check-ins recorded for this period.</p>
      </Card>
    );
  }
  const top = Math.floor(Math.min(...times) / 60) * 60;
  const bottom = Math.max(top + 6 * 60, Math.ceil(Math.max(...times) / 60) * 60);
  const range = bottom - top;
  const y = (minutes) => ((minutes - top) / range) * 100;
  const hourLines = [];
  for (let at = top; at <= bottom; at += 120) hourLines.push(at);

  return (
    <Card
      title="In → out, every day"
      icon="timeline"
      aside={<div className="flex gap-3"><LegendItem dot="bg-[#3170c5]" count="" label="full shift" /><LegendItem dot="bg-amber-400" count="" label="short day" /></div>}
    >
      <div className="flex gap-2 py-2">
        <div className="relative w-12 shrink-0">
          {hourLines.map((at) => (
            <span key={at} className="absolute right-0 -translate-y-1/2 text-[10px] font-semibold text-slate-400" style={{ top: `${y(at)}%` }}>{minutesToClock(at).replace(':00', '')}</span>
          ))}
        </div>
        <div className="relative h-[230px] flex-1">
          {hourLines.map((at) => <span key={at} className="absolute inset-x-0 border-t border-dashed border-slate-100" style={{ top: `${y(at)}%` }} />)}
          <div className="absolute inset-0 flex gap-[3px]">
            {spans.map((span) => {
              const worked = durationToMinutes(span.row.workHours);
              const full = worked >= SHIFT_MINUTES;
              return (
                <div
                  key={span.row.date}
                  className="group relative min-w-0 flex-1 rounded-md transition hover:bg-slate-50"
                  title={`${span.row.date} · ${STATUS_META[span.status].label}${span.in != null ? `\nIn ${span.row.checkIn}` : ''}${span.out != null ? ` · Out ${span.row.checkOut}` : ''}${worked ? `\nWorked ${minutesToDuration(worked)}` : ''}`}
                >
                  {span.in != null && span.out != null ? (
                    <span
                      className={`absolute left-1/2 w-[70%] max-w-[12px] -translate-x-1/2 rounded-[4px] transition-[top,height] duration-700 ${full ? 'bg-[#3170c5] group-hover:bg-[#2558a2]' : 'bg-amber-400'}`}
                      style={{ top: `${y(span.in)}%`, height: `${Math.max(2, y(span.out) - y(span.in))}%` }}
                    />
                  ) : span.in != null ? (
                    <span className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 ring-2 ring-white" style={{ top: `${y(span.in)}%` }} />
                  ) : span.status === 'absent' ? (
                    <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-rose-400" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="ml-14 mt-1.5 flex gap-[3px]">
        {spans.map((span, index) => (
          <span key={span.row.date} className="min-w-0 flex-1 text-center text-[9.5px] font-semibold tabular-nums text-slate-400">{index % 3 === 0 ? dayNumber(span.row.date) : ''}</span>
        ))}
      </div>
    </Card>
  );
}

export default function IndividualVisual({ rows, employee, employeeRecordId }) {
  const photos = useEmployeePhotos();
  const today = new Date().toLocaleDateString('en-CA');
  const days = [...rows].sort((a, b) => a.date.localeCompare(b.date)).map((row) => ({ row, status: statusKey(row.status) }));
  const past = days.filter((day) => day.row.date <= today);
  const count = (key: StatusKey) => past.filter((day) => day.status === key).length;
  const workingDays = past.filter((day) => WORKING.includes(day.status)).length;
  const attended = count('present') + count('halfday') * 0.5;
  const ins = past.map((day) => clockToMinutes(day.row.checkIn)).filter((value) => value != null);
  const outs = past.map((day) => clockToMinutes(day.row.checkOut)).filter((value) => value != null);
  const worked = past.map((day) => durationToMinutes(day.row.workHours)).filter(Boolean);
  const lateDays = past.filter((day) => isSet(day.row.lateIn)).length;
  const earlyDays = past.filter((day) => isSet(day.row.earlyOut)).length;

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Avatar name={employee?.name} src={photos.get(employeeRecordId)} size={64} className="ring-4 ring-[#edf4fc]" />
          <div className="min-w-0">
            <p className="truncate font-headline text-[19px] font-bold text-slate-900">{employee?.name || 'Employee'}</p>
            <p className="truncate text-[13px] text-slate-500"><span className="font-mono font-semibold text-slate-600">{employee?.employeeId || '—'}</span>{employee?.designation ? ` · ${employee.designation}` : ''}{employee?.department ? ` · ${employee.department}` : ''}</p>
            {employee?.reportingTo && employee.reportingTo !== '--' ? <p className="mt-0.5 truncate text-[12px] text-slate-400">Reports to {employee.reportingTo}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-3">
            <Ring value={attended} total={workingDays} color="emerald" caption="attended" size={84} />
            <div className="space-y-1">
              <LegendItem dot="bg-emerald-500" count={count('present')} label="present" />
              <LegendItem dot="bg-amber-400" count={count('halfday')} label="half day" />
              <LegendItem dot="bg-rose-400" count={count('absent')} label="absent" />
            </div>
          </div>
          <div className="space-y-1">
            <LegendItem dot={STATUS_META.on_leave.dot} count={count('on_leave')} label="on leave" />
            <LegendItem dot={STATUS_META.holiday.dot} count={count('holiday')} label="holiday" />
            <LegendItem dot={STATUS_META.weekend.dot} count={count('weekend')} label="off" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <Stat icon="login" label="Avg check-in" value={minutesToClock(average(ins))} />
        <Stat icon="logout" label="Avg check-out" value={minutesToClock(average(outs))} />
        <Stat icon="avg_time" label="Avg hours" value={worked.length ? minutesToDuration(average(worked)) : '—'} />
        <Stat icon="hourglass_bottom" label="Total hours" value={minutesToDuration(worked.reduce((sum, value) => sum + value, 0))} />
        <Stat icon="running_with_errors" label="Late days" value={lateDays} />
        <Stat icon="directions_run" label="Early outs" value={earlyDays} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Calendar days={days} today={today} />
        <SpanChart days={days} today={today} />
      </div>
    </div>
  );
}
