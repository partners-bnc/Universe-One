'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Small shared pieces for the HR admin dashboard panels.

export function getInitials(name = '') {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'E';
}

export function Avatar({ name, src, size = 38, className = '', title }: { name?: string; src?: string; size?: number; className?: string; title?: string }) {
  return src ? (
    <Image src={src} alt={name || 'Employee'} title={title} width={size} height={size} className={`shrink-0 rounded-full object-cover ${className}`} style={{ width: size, height: size }} unoptimized />
  ) : (
    <div title={title} className={`flex shrink-0 items-center justify-center rounded-full bg-[#e8f1fc] font-bold text-[#3170c5] ${className}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}>
      {getInitials(name)}
    </div>
  );
}

/** Counts from 0 up to `value` (ease-out) when `value` first arrives. */
export function CountUp({ value, duration = 1100 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{shown.toLocaleString('en-IN')}</>;
}

/** White glass panel used by every dashboard section. */
export function Panel({ title, icon, badge, children, className = '' }: { title: string; icon?: string; badge?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative overflow-hidden rounded-[26px] border border-white/80 bg-white/75 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-30px_rgba(30,64,120,0.35)] backdrop-blur-xl md:p-6 ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#eef4ff] to-[#dfeafc] text-[#3170c5] ring-1 ring-white">
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </span>
          ) : null}
          <h3 className="font-headline text-[17px] font-bold tracking-tight text-slate-900">{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-100 ${className}`}>
      <div className="hrm-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    </div>
  );
}
