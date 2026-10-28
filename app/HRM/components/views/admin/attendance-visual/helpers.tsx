'use client';

import React, { useEffect, useState } from 'react';
import { CountUp } from '../dashboard/shared';

// Shared pieces for the attendance "Visual view" (daily + individual).
// Reads the same rows the tables show — values like "09:15 AM", "8h 30m", "45 min", "-" / "--".

export const isSet = (value?: string) => Boolean(value) && !['--', '-'].includes(String(value).trim());

/** "09:15 AM" -> minutes after midnight, or null. */
export function clockToMinutes(value?: string) {
  const match = /^(\d{1,2}):(\d{2})\s*([AP]M)$/i.exec(String(value || '').trim());
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

/** "8h 30m" / "45 min" -> minutes (0 when not set). */
export function durationToMinutes(value?: string) {
  const text = String(value || '');
  const hours = /(\d+)\s*h/.exec(text);
  const minutes = /(\d+)\s*m/.exec(text);
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
}

export function minutesToClock(total: number | null) {
  if (total == null || !Number.isFinite(total)) return '—';
  const rounded = Math.round(total);
  const hour24 = Math.floor(rounded / 60) % 24;
  const minute = rounded % 60;
  const hour12 = hour24 % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour24 < 12 ? 'AM' : 'PM'}`;
}

export function minutesToDuration(total: number) {
  if (!total) return '0h';
  const rounded = Math.round(total);
  return `${Math.floor(rounded / 60)}h ${String(rounded % 60).padStart(2, '0')}m`;
}

export const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null);

// one colour + icon + label per attendance status (never colour alone)
export const STATUS_META = {
  present: { label: 'Present', icon: 'verified', bar: '#22a07a', soft: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  halfday: { label: 'Half day', icon: 'contrast', bar: '#e9a23b', soft: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
  absent: { label: 'Absent', icon: 'person_off', bar: '#e2647e', soft: 'bg-rose-50', ring: 'ring-rose-200', text: 'text-rose-600', dot: 'bg-rose-400' },
  on_leave: { label: 'On leave', icon: 'beach_access', bar: '#6b8fd6', soft: 'bg-[#edf4fc]', ring: 'ring-[#d7e7f9]', text: 'text-[#2558a2]', dot: 'bg-[#6b8fd6]' },
  // explicit hex: the HRM theme remaps Tailwind's violet scale to blue
  holiday: { label: 'Holiday', icon: 'celebration', bar: '#a78bdb', soft: 'bg-[#f4f0fc]', ring: 'ring-[#e2d8f6]', text: 'text-[#6d4fd8]', dot: 'bg-[#a78bdb]' },
  weekend: { label: 'Off', icon: 'weekend', bar: '#cbd5e1', soft: 'bg-slate-50', ring: 'ring-slate-200', text: 'text-slate-500', dot: 'bg-slate-300' },
  missing: { label: 'No record', icon: 'help', bar: '#e2e8f0', soft: 'bg-slate-50', ring: 'ring-slate-200', text: 'text-slate-400', dot: 'bg-slate-200' },
};
export type StatusKey = keyof typeof STATUS_META;
export const STATUS_ORDER: StatusKey[] = ['present', 'halfday', 'absent', 'on_leave', 'holiday', 'weekend', 'missing'];

export function statusKey(status?: string): StatusKey {
  const value = String(status || '').toLowerCase();
  if (value === 'late') return 'halfday';
  return (value in STATUS_META ? value : 'missing') as StatusKey;
}

/** Profile photos by employee record id, from the existing employee directory API (read-only). */
export function useEmployeePhotos() {
  const [photos, setPhotos] = useState<Map<string, string>>(() => new Map());
  useEffect(() => {
    let active = true;
    fetch('/HRM/api/employees', { method: 'GET' })
      .then((response) => (response.ok ? response.json() : { employees: [] }))
      .then((result) => {
        if (active) setPhotos(new Map((result.employees || []).map((employee) => [employee.id, employee.profile_picture_url || ''])));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  return photos;
}

const RING_COLORS = { emerald: ['#34c38f', '#0f8a63'], blue: ['#7eb0ec', '#2558a2'], rose: ['#f99aab', '#d6456c'], amber: ['#f6c56f', '#d98a14'] };

export function Ring({ value, total, color, caption, size = 68 }: { value: number; total: number; color: keyof typeof RING_COLORS; caption: string; size?: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  const [from, to] = RING_COLORS[color];
  const id = `hrm-av-${color}`;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#eef2f8" strokeWidth="12" />
        <circle
          cx="55" cy="55" r={r} fill="none" strokeWidth="12" strokeLinecap="round"
          stroke={`url(#${id})`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)' }}
        />
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-headline font-bold leading-none text-slate-700 tabular-nums" style={{ fontSize: Math.round(size * 0.21) }}><CountUp value={Math.round(pct * 100)} />%</p>
          <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-[0.12em] text-slate-400">{caption}</p>
        </div>
      </div>
    </div>
  );
}

export function LegendItem({ dot, count, label }: { dot: string; count: React.ReactNode; label: string }) {
  return (
    <p className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-slate-500">
      <span className={`h-2 w-2 rounded-full ${dot}`} /> <b className="tabular-nums text-slate-700">{count}</b> {label}
    </p>
  );
}

/** White card used by every block of the visual view. */
export function Card({ title, icon, aside, children, className = '' }: { title?: string; icon?: string; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`hrm-fade rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_18px_40px_-30px_rgba(30,64,120,0.35)] md:p-5 ${className}`}>
      {title ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-headline text-[15px] font-bold text-slate-800">
            {icon ? <span className="material-symbols-outlined text-[19px] text-[#3170c5]">{icon}</span> : null}
            {title}
          </h3>
          {aside}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Small "label · value" stat used under charts. */
export function Stat({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-3 py-2.5">
      <span className="hidden sm:block"><span className="material-symbols-outlined text-[19px] text-slate-500">{icon}</span></span>
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="truncate text-[14px] font-bold tabular-nums text-slate-700">{value}</p>
      </div>
    </div>
  );
}
