'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CountUp, EASE, useToday } from './shared';

// Copy of the HRM employee dashboard (app/HRM/components/views/Dashboard.tsx + layout/Sidebar.tsx).
// The homepage is public, so the employee, team and numbers are samples.

const C = {
  primary: '#3170c5',
  surface: '#f8f9fa',
  onSurface: '#2d3335',
  low: '#f1f4f5',
  variant: '#5a6062',
  error: '#a8364b',
};
const HEADLINE = { fontFamily: 'Manrope, Inter, sans-serif' };

const EMPLOYEE = { name: 'Aarav Mehta', initials: 'AM', loginId: 'E201', email: 'aarav.mehta@bncglobal.in' };

const NAV = [
  { label: 'Home', icon: 'dashboard', active: true },
  { label: 'Calendar', icon: 'date_range' },
  { label: 'Attendance', icon: 'calendar_today' },
  { label: 'Daily Work Log', icon: 'assignment', more: true },
  { label: 'Regularization', icon: 'edit_calendar', more: true },
  { label: 'Policy Manual', icon: 'menu_book' },
  { label: 'Tickets & Requests', icon: 'support_agent' },
  { label: 'Expense Claims', icon: 'receipt_long' },
  { label: 'Organization Chart', icon: 'account_tree' },
  { label: 'Leave Management', icon: 'event_busy' },
  { label: 'Payroll', icon: 'payments' },
  { label: 'My Profile', icon: 'person' },
];

// this week's hours per day (Mon–Sun); 0 = no data yet
const WEEK = [
  { label: 'Mon', mins: 525 }, { label: 'Tue', mins: 548 }, { label: 'Wed', mins: 506 }, { label: 'Thu', mins: 561 },
  { label: 'Fri', mins: 492 }, { label: 'Sat', mins: 0, working: true }, { label: 'Sun', mins: 0, working: false },
];

const HOLIDAYS = [
  { month: 'NOV', day: 24, title: 'Guru Nanak Jayanti', meta: 'Tue • Public Holiday' },
  { month: 'DEC', day: 25, title: 'Christmas Day', meta: 'Fri • Public Holiday' },
  { month: 'JAN', day: 1, title: "New Year's Day", meta: 'Fri • Public Holiday' },
];

const TEAM = [
  { name: 'Riya Sharma', role: 'Senior Consultant', status: 'Present', in: '09:02 AM', out: '-', logged: '8h 14m', swipes: 2 },
  { name: 'Kabir Singh', role: 'Associate – Audit', status: 'Half Day', in: '09:41 AM', out: '01:55 PM', logged: '4h 14m', swipes: 3 },
  { name: 'Neha Verma', role: 'HR Executive', status: 'Present', in: '08:55 AM', out: '-', logged: '8h 21m', swipes: 2 },
];
const STATUS = {
  Present: ['bg-emerald-50 text-emerald-700 border-emerald-200', 'border-emerald-500'],
  'Half Day': ['bg-amber-50 text-amber-700 border-amber-200', 'border-amber-500'],
};

const Icon = ({ name, className = '', fill = false }) => (
  <span className={`material-symbols-outlined ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{name}</span>
);

const hm = (mins) => (mins ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : '0h 00m');

function greetingFor(hour) {
  if (hour >= 5 && hour < 12) return { title: 'Good Morning', emoji: '🌤️', note: 'Start the day with clarity and stay ahead of your tasks.' };
  if (hour >= 12 && hour < 17) return { title: 'Good Afternoon', emoji: '☀️', note: 'Everything you need for the workday is lined up here.' };
  return { title: 'Good Evening', emoji: '🌙', note: 'Wrap up the day smoothly and keep tomorrow prepared.' };
}

function Sidebar() {
  const pill = 'mr-3 flex items-center gap-3 rounded-r-full py-2.5 pl-5';
  return (
    <aside className="flex w-64 flex-none flex-col py-5" style={{ background: C.low }}>
      <div className="mb-5 flex flex-col items-center px-5 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#DBEAFE] text-2xl font-bold text-[#1E3A8A] shadow-md">{EMPLOYEE.initials}</div>
        <p className="mt-3 text-sm font-bold" style={{ ...HEADLINE, color: C.onSurface }}>{EMPLOYEE.name}</p>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: C.variant }}>{EMPLOYEE.loginId}</p>
        <p className="mt-1 text-[11px]" style={{ color: C.variant }}>{EMPLOYEE.email}</p>
      </div>
      <nav className="flex-1 space-y-0.5">
        {NAV.map((n) => (
          <div key={n.label} className={`${pill} ${n.active ? 'bg-white font-bold shadow-sm' : ''}`} style={{ color: n.active ? C.primary : C.variant }}>
            <Icon name={n.icon} className="shrink-0 text-[20px]" fill={n.active} />
            <span className={`flex-1 whitespace-nowrap text-sm ${n.active ? 'font-bold' : 'font-medium'}`}>{n.label}</span>
            {n.more ? <Icon name="expand_more" className="mr-1 shrink-0 text-[18px]" /> : null}
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-[#adb3b5]/10 pt-3">
        <div className="flex items-center gap-3 px-5 py-2.5" style={{ color: `${C.error}cc` }}><Icon name="logout" className="text-[20px]" /><span className="text-sm font-medium">Logout</span></div>
        <div className="flex items-center gap-3 px-5 py-2.5" style={{ color: C.variant }}><Icon name="widgets" className="text-[20px]" /><span className="text-sm font-medium">Other Modules</span></div>
        <div className="flex items-center gap-3 px-5 py-2.5" style={{ color: C.variant }}><Icon name="home" className="text-[20px]" /><span className="text-sm font-medium">Home Page</span></div>
      </div>
    </aside>
  );
}

/** Two cartoon eyes that look around (stands in for the dashboard's pointer-following eyes). */
function Eyes() {
  const reduce = useReducedMotion();
  const look = reduce ? undefined : { x: [0, 6, 6, -6, -6, 0], y: [0, -3, 3, 3, -2, 0] };
  return (
    <div className="flex gap-3">
      {[0, 1].map((k) => (
        <div key={k} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-[inset_0_-3px_0_rgba(49,112,198,.12)] ring-2 ring-[#3170c6]/15">
          <motion.div
            className="grid h-[18px] w-[18px] place-items-center rounded-full"
            style={{ background: 'radial-gradient(circle at 35% 35%, #6aa0e6, #3170c6)' }}
            animate={look}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="h-2 w-2 rounded-full bg-[#0d1a33]" />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/** Live clock: hh : mm : ss, ticking each second. */
function Clock({ now }) {
  const [t, setT] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const d = t || now;
  const p = (n) => String(n).padStart(2, '0');
  const [h, m, s] = d ? [p(d.getHours()), p(d.getMinutes()), p(d.getSeconds())] : ['--', '--', '--'];
  return (
    <div className="flex items-end justify-center gap-1 text-center font-mono text-blue-500">
      <span className="text-6xl font-semibold tracking-tight">{h}</span>
      <span className="mb-1 text-5xl font-semibold text-blue-300">:</span>
      <span className="text-6xl font-semibold tracking-tight">{m}</span>
      <span className="mb-0.5 ml-2 text-3xl font-medium text-blue-300">:</span>
      <span className="text-3xl font-medium tracking-tight text-blue-300">{s}</span>
    </div>
  );
}

export default function HrmScreen({ start }) {
  const reduce = useReducedMotion();
  const now = useToday();
  const g = greetingFor(now ? now.getHours() : 18);
  const fullDate = now ? now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const dayName = now ? now.toLocaleDateString('en-GB', { weekday: 'long' }) : '';
  const maxMins = Math.max(...WEEK.map((w) => w.mins));
  const card = 'rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(45,51,53,0.04)]';

  return (
    <div className="flex h-full text-left" style={{ background: C.surface, color: C.onSurface, fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div className="relative min-w-0 flex-1 overflow-hidden px-6 pb-8 pt-5">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* welcome header */}
          <section className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d7e7f9] text-[#1d4581] shadow-[0_12px_28px_rgba(49,112,197,0.14)]">
                <Icon name="space_dashboard" className="text-[24px]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={HEADLINE}>{g.title}, {EMPLOYEE.name}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6" style={{ color: C.variant }}>{g.note} Your login ID is {EMPLOYEE.loginId}.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-[#adb3b5]/10 bg-white px-5 py-4 shadow-[0_10px_40px_rgba(45,51,53,0.04)]">
              <span className="text-3xl leading-none">{g.emoji}</span>
              <div>
                <p className="text-sm font-bold" style={HEADLINE}>{fullDate}</p>
                <p className="text-xs" style={{ color: C.variant }}>{dayName}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-12 gap-6">
            {/* attendance summary */}
            <div className={`col-span-8 ${card}`}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold" style={HEADLINE}>Attendance Summary</h3>
                <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ background: C.low, color: C.variant }}>This Week</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3170c5]/10 text-[#3170c5]"><Icon name="schedule" className="text-lg" /></div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: C.variant }}>Avg. Work Hours</p>
                      <p className="text-xl font-bold" style={HEADLINE}><CountUp value={8} start={start} />h <CountUp value={46} start={start} />m</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f7ff]/70 text-[#4f8be4]"><Icon name="check_circle" className="text-lg" /></div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: C.variant }}>On-time Arrival</p>
                      <p className="text-xl font-bold" style={HEADLINE}><CountUp value={92} start={start} />%</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 border-l border-[#adb3b5]/10 pl-5">
                  <div className="flex h-36 items-end justify-between gap-3">
                    {WEEK.map((w, i) => (
                      <div key={w.label} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-[10px] font-semibold" style={{ color: C.variant }}>{hm(w.mins)}</span>
                        <div className="flex h-28 w-full items-end justify-center">
                          <motion.div
                            className={`${w.mins ? 'bg-blue-400' : w.working ? 'bg-blue-200/90' : 'bg-blue-100/80'} w-full max-w-[2.75rem] rounded-t-xl`}
                            style={{ height: `${w.mins ? Math.max(12, (w.mins / maxMins) * 100) : 12}%`, transformOrigin: 'bottom' }}
                            initial={reduce ? false : { scaleY: 0 }}
                            animate={start ? { scaleY: 1 } : undefined}
                            transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE }}
                          />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wide ${w.working === false ? 'text-blue-300' : ''}`} style={w.working === false ? undefined : { color: C.variant }}>{w.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* daily inspiration */}
            <div className="col-span-4 flex flex-col items-center justify-center rounded-[28px] border border-blue-200/25 bg-[#edf4fc] p-6 text-center shadow-[0_16px_40px_-10px_rgba(49,112,198,0.12),0_8px_20px_-6px_rgba(49,112,198,0.06)]">
              <div className="mb-5 flex h-16 items-center justify-center"><Eyes /></div>
              <h3 className="mb-1.5 text-lg font-black tracking-tight text-blue-950">Keep Going</h3>
              <p className="max-w-[240px] font-serif text-sm font-medium italic leading-relaxed text-blue-800/90">
                &ldquo;Small steps every day build strong results. Stay steady, stay proud, and keep moving forward.&rdquo;
              </p>
              <div className="mt-6 inline-flex rounded-full border border-blue-100/40 bg-white/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm">Daily Inspiration</div>
            </div>

            {/* upcoming holidays */}
            <div className={`col-span-4 ${card}`}>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold" style={HEADLINE}>Upcoming Holidays</h3>
                <Icon name="more_horiz" className="text-xl" />
              </div>
              <div className="space-y-4">
                {HOLIDAYS.map((h) => (
                  <div key={h.title} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-[#adb3b5]/15" style={{ background: C.low }}>
                      <span className="text-[10px] font-bold uppercase" style={{ color: C.variant }}>{h.month}</span>
                      <span className="text-base font-bold" style={{ color: C.primary }}>{h.day}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{h.title}</p>
                      <p className="text-xs" style={{ color: C.variant }}>{h.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 w-full rounded-lg py-2 text-center text-sm font-semibold" style={{ background: C.low, color: C.variant }}>Full Calendar</div>
            </div>

            {/* quick actions + live clock */}
            <div className="col-span-8 grid h-full grid-cols-2 gap-6">
              <div className="flex h-full min-h-[260px] flex-col">
                <div className="flex flex-1 flex-col justify-between rounded-t-2xl bg-gradient-to-br from-[#3170c5] to-[#4f8be4] p-6 text-[#faf8ff] shadow-lg shadow-[#3170c5]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Icon name="flight_takeoff" className="text-lg" /><h4 className="text-base font-bold" style={HEADLINE}>Request Leave</h4></div>
                    <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-[#3170c5] shadow-sm">Apply Now</span>
                  </div>
                  <p className="mt-1 text-xs opacity-80">Planning a getaway? Submit your leave application in just a few clicks.</p>
                </div>
                <div className="flex flex-1 flex-col justify-between rounded-b-2xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Icon name="menu_book" className="text-lg text-slate-500" /><h4 className="text-base font-bold text-slate-700" style={HEADLINE}>Policy Manual</h4></div>
                    <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">View</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Access company policies, HR guidelines, and workplace rules.</p>
                </div>
              </div>

              <div className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="absolute right-5 top-5 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">Live</span>
                </div>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2"><Icon name="calendar_today" className="text-base text-slate-400" /><p className="text-sm font-medium text-slate-600">{fullDate}</p></div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{dayName}</span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1"><span className="font-mono text-[11px] font-bold text-blue-600">{EMPLOYEE.loginId}</span></span>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center"><Clock now={now} /></div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-xs font-semibold text-blue-700"><Icon name="badge" className="text-base" />View Swipes</span>
                  <span className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-[#4d8be6] via-[#3170c6] to-[#225091] px-4 py-3 text-center text-xs font-semibold text-white shadow-[0_14px_28px_rgba(49,112,198,0.28)]">
                    <span className="flex items-center justify-center gap-2"><Icon name="logout" className="text-base" />Check Out</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* team attendance (shown to managers) */}
          <section className="rounded-2xl border border-[#adb3b5]/10 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold" style={HEADLINE}>Team Attendance Summary</h3>
                <p className="text-xs" style={{ color: C.variant }}>Real-time status of employees reporting directly to you</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{TEAM.length} Direct Reportees</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {TEAM.map((t) => (
                <div key={t.name} className="flex flex-col justify-between rounded-2xl border border-[#adb3b5]/15 bg-white p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] bg-blue-100/90 text-base font-bold text-blue-700 ${STATUS[t.status][1]}`}>
                      {t.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div><h4 className="text-sm font-bold leading-snug">{t.name}</h4><p className="text-xs" style={{ color: C.variant }}>{t.role}</p></div>
                  </div>
                  <div className="mb-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs">
                    <div className="flex justify-between"><span style={{ color: C.variant }}>Check In</span><span className="font-semibold">{t.in}</span></div>
                    <div className="flex justify-between"><span style={{ color: C.variant }}>Check Out</span><span className="font-semibold">{t.out}</span></div>
                    <div className="flex justify-between"><span style={{ color: C.variant }}>Logged Time</span><span className="font-semibold">{t.logged}</span></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-wide ${STATUS[t.status][0]}`}>{t.status}</span>
                    <span className="text-[10px] font-medium" style={{ color: C.variant }}>{t.swipes} Door Swipes</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* the page continues below the window edge, like a real screenshot */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${C.surface}, transparent)` }} />
      </div>
    </div>
  );
}
