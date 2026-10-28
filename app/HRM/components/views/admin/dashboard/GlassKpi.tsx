'use client';

import React from 'react';
import { CountUp } from './shared';

// KPI card: the original dashboard's light theme gradients, a plain black icon top-left, and the value centred.
// While loading, the number area shimmers; once data arrives the number counts up.

const TONES = {
  blue: 'from-violet-50 via-white to-violet-100/70',
  emerald: 'from-emerald-50 via-white to-teal-100/70',
  amber: 'from-amber-50 via-white to-orange-100/60',
  purple: 'from-purple-50 via-white to-violet-100/70',
};

export default function GlassKpi({ label, value, of, icon, tone = 'blue', loading = false, delay = 0 }: {
  label: string;
  value: number;
  of?: number;
  icon: string;
  tone?: keyof typeof TONES;
  loading?: boolean;
  delay?: number;
}) {
  const pct = of ? Math.round((value / of) * 100) : null;
  return (
    <div
      className={`hrm-pop group relative overflow-hidden rounded-[24px] border border-white bg-gradient-to-br ${TONES[tone]} px-4 pb-5 pt-9 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_22px_44px_-30px_rgba(49,112,197,0.55)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_26px_50px_-28px_rgba(49,112,197,0.65)]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* glass sheen */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[24px] bg-gradient-to-b from-white/50 to-transparent" aria-hidden="true" />
      <span className="material-symbols-outlined absolute left-4 top-3.5 text-[22px] text-[#111418]">{icon}</span>

      {pct !== null && !loading ? (
        <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10.5px] font-bold text-[#2558a2] ring-1 ring-[#d7e7f9]">{pct}%</span>
      ) : null}

      <div className="relative flex flex-col items-center">
        <div className="flex h-10 items-center justify-center">
          {loading ? (
            <div className="relative h-9 w-20 overflow-hidden rounded-xl bg-white/80">
              <div className="hrm-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-[#edf4fc] to-transparent" />
            </div>
          ) : (
            <p className="font-headline text-[34px] font-semibold leading-none tracking-tight text-slate-700 tabular-nums">
              <CountUp value={value} />
              {of ? <span className="ml-1 text-[16px] font-medium text-slate-400">/ {of}</span> : null}
            </p>
          )}
        </div>
        <p className="mt-2 text-[12.5px] font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  );
}
