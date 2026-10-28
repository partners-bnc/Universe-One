'use client';

import React from 'react';
import { Download } from 'lucide-react';
import HrmEmptyState from '../../../ui/HrmEmptyState';
import { Avatar } from './shared';

// Clean celebration card for birthdays and work anniversaries:
// a slowly turning ring around the photos, a looping confetti burst from two party poppers (birthday)
// or soft golden sparkles (anniversary), and the next few people as a row of photos.

const THEMES = {
  birthday: {
    card: 'from-white via-white to-[#f3f7fd] ring-[#e3ebf6]',
    ring: 'conic-gradient(from 0deg, #3170c5, #7eb0ec, #f5c76a, #e9879f, #3170c5)',
    label: 'text-[#2558a2]',
    iconBg: 'bg-white text-[#2558a2] ring-[#d7e7f9]',
    chip: 'bg-[#edf4fc] text-[#1d4581] ring-1 ring-[#d7e7f9]',
    heading: 'text-slate-900',
    body: 'text-slate-500',
    nextRing: 'ring-[#d7e7f9]',
    nextLabel: 'text-[#2558a2]',
  },
  anniversary: {
    card: 'from-white via-white to-[#faf6ee] ring-[#efe6d4]',
    ring: 'conic-gradient(from 0deg, #c9932e, #f3d48a, #fff3d1, #d9a640, #c9932e)',
    label: 'text-[#9a6b14]',
    iconBg: 'bg-white text-[#9a6b14] ring-[#efe0bf]',
    chip: 'bg-[#faf3e3] text-[#7a5410] ring-1 ring-[#efe0bf]',
    heading: 'text-slate-900',
    body: 'text-slate-500',
    nextRing: 'ring-[#efe0bf]',
    nextLabel: 'text-[#9a6b14]',
  },
};

// fixed pieces so server and browser render the same burst
const BURST_COLORS = ['#3170c5', '#7eb0ec', '#f5c76a', '#e9879f', '#5ec3a0', '#94a3b8'];
const BURST = Array.from({ length: 30 }, (_, i) => {
  const left = i % 2 === 0;
  const angle = (left ? -78 : -102) + (left ? 1 : -1) * ((i * 37) % 52); // degrees, fanning up and inwards
  const power = 150 + ((i * 53) % 110);
  const rad = (angle * Math.PI) / 180;
  return {
    left,
    x: Math.round(Math.cos(rad) * power),
    y: Math.round(Math.sin(rad) * power),
    color: BURST_COLORS[i % BURST_COLORS.length],
    delay: ((i * 7) % 5) * 0.05,
    w: 5 + (i % 3) * 2,
    round: i % 4 === 0,
  };
});
const SPARKLES = [
  { left: 10, top: 18, delay: 0, size: 12 }, { left: 86, top: 14, delay: 0.7, size: 15 }, { left: 18, top: 62, delay: 1.4, size: 9 },
  { left: 90, top: 56, delay: 0.3, size: 11 }, { left: 52, top: 6, delay: 1.1, size: 9 }, { left: 76, top: 78, delay: 1.8, size: 12 },
];

function Sparkle({ size, color, style }: { size: number; color: string; style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className="hrm-twinkle pointer-events-none absolute" style={{ width: size, height: size, ...style }} aria-hidden="true">
      <path d="M12 0 C13 8, 16 11, 24 12 C16 13, 13 16, 12 24 C11 16, 8 13, 0 12 C8 11, 11 8, 12 0 Z" fill={color} />
    </svg>
  );
}

function ConfettiBurst() {
  return (
    <>
      {BURST.map((piece, i) => (
        <span
          key={i}
          className={`hrm-burst absolute top-[44%] ${piece.round ? 'rounded-full' : 'rounded-[2px]'}`}
          style={{
            [piece.left ? 'left' : 'right']: 22,
            width: piece.w,
            height: piece.round ? piece.w : piece.w * 0.45,
            background: piece.color,
            ['--x' as string]: `${piece.x}px`,
            ['--y' as string]: `${piece.y}px`,
            ['--delay' as string]: `${piece.delay}s`,
          }}
        />
      ))}
      <span className="hrm-popper material-symbols-outlined absolute left-2.5 top-[calc(44%-10px)] text-[22px] text-[#2558a2]">celebration</span>
      <span className="absolute right-2.5 top-[calc(44%-10px)] -scale-x-100"><span className="hrm-popper material-symbols-outlined block text-[22px] text-[#2558a2]">celebration</span></span>
    </>
  );
}

export default function CelebrationCard({
  kind, label, icon, featured, heading, body, chips, badge, next, nextMeta, moreCount = 0, onDownload, downloading = false, empty,
}: {
  kind: 'birthday' | 'anniversary';
  label: string;
  icon: string;
  featured: any[];
  heading: string;
  body: string;
  chips: React.ReactNode[];
  badge?: React.ReactNode;
  next: any[];
  nextMeta: (employee: any) => string;
  moreCount?: number;
  onDownload?: () => void;
  downloading?: boolean;
  empty: { icon: string; title: string; message: string };
}) {
  const t = THEMES[kind];
  const birthday = kind === 'birthday';
  const photoSize = featured.length > 2 ? 62 : 82;

  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${t.card} p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_50px_-34px_rgba(30,64,120,0.45)] ring-1`}>
      {/* live celebration layer */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {birthday && featured.length ? <ConfettiBurst /> : null}
        {!birthday ? SPARKLES.map((s, i) => (
          <Sparkle key={i} size={s.size} color={i % 2 ? '#e2b65a' : '#f3d48a'} style={{ left: `${s.left}%`, top: `${s.top}%`, ['--delay' as string]: `${s.delay}s` }} />
        )) : null}
      </div>

      {onDownload && featured.length ? (
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          className={`absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-md ring-1 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${t.iconBg}`}
          title="Download birthday card"
          aria-label="Download birthday card"
        >
          <Download className="h-4 w-4" />
        </button>
      ) : null}

      <div className="relative">
        <div className={`flex items-center justify-between gap-3 ${onDownload ? 'pr-11' : ''}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-[22px] ${t.label}`}>{icon}</span>
            <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${t.label}`}>{label}</p>
          </div>
          {badge}
        </div>

        {featured.length === 0 ? (
          <div className="mt-5">
            <HrmEmptyState compact icon={empty.icon} title={empty.title} message={empty.message} className="border-slate-200 bg-white" />
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <div className="flex items-center justify-center">
              {featured.map((employee, index) => (
                <div key={employee.id} className={`relative grid place-items-center ${index ? '-ml-4' : ''}`} style={{ zIndex: featured.length - index, width: photoSize + 10, height: photoSize + 10 }}>
                  <span className="hrm-spin-slow absolute inset-0 rounded-full" style={{ background: t.ring }} aria-hidden="true" />
                  <span className="absolute inset-[3px] rounded-full bg-white" aria-hidden="true" />
                  <Avatar name={employee.name} src={employee.profile_picture_url} size={photoSize} className="relative" title={employee.name} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
              {chips.map((chip, i) => (
                <span key={i} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${i === 0 ? t.chip : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>{chip}</span>
              ))}
            </div>
            {moreCount > 0 ? <p className={`mt-2 text-[11px] font-bold uppercase tracking-[0.16em] ${t.label}`}>+{moreCount} more on the same date</p> : null}
            <p className={`mt-4 font-headline text-[19px] font-extrabold leading-tight ${t.heading}`}>{heading}</p>
            <p className={`mt-2 max-w-[17rem] text-[13px] leading-6 ${t.body}`}>{body}</p>
          </div>
        )}

        {next.length ? (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 px-3.5 py-2.5 ring-1 ring-slate-100">
            <p className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${t.nextLabel}`}>Next up</p>
            <div className="flex items-center gap-2">
              {next.map((employee) => (
                <Avatar key={employee.id} name={employee.name} src={employee.profile_picture_url} size={34} className={`ring-2 ${t.nextRing} transition hover:-translate-y-0.5`} title={`${employee.name} · ${nextMeta(employee)}`} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
