'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck, BriefcaseBusiness, Calendar, ChartNoAxesColumnIncreasing, ChevronLeft, ClipboardList, Clock3,
  FileSpreadsheet, Home, LayoutDashboard, ListTodo, LogOut, MessageSquare, PlusSquare, Settings, Users, ArrowRight,
} from 'lucide-react';
import { CountUp, EASE, ordinal, useToday } from './shared';

// Copy of the super-admin Task Manager dashboard (app/Taskmanager/components/Dashboard.js + Sidebar.js).
// The homepage is public, so the numbers are a fixed snapshot (25 Oct 2026) and the person / task names are samples.

const BLUE = '#3170c5';

const USER = { name: 'Aarav Mehta', initials: 'AM', role: 'Super Admin', email: 'aarav.mehta@bncglobal.in' };

const KPIS = [
  { label: 'Total Tasks', value: 1383, icon: BriefcaseBusiness },
  { label: 'Pending Tasks', value: 183, icon: Clock3 },
  { label: 'In Progress', value: 103, icon: ChartNoAxesColumnIncreasing },
  { label: 'Completed Tasks', value: 1097, icon: BadgeCheck },
  { label: 'Open Tickets', value: 5, icon: BriefcaseBusiness },
  { label: 'Late Tickets', value: 0, icon: Clock3 },
  { label: 'Breached SLA', value: 0, icon: ChartNoAxesColumnIncreasing },
  { label: 'Avg Resolve Hrs', value: 10, icon: BadgeCheck },
];

// tasks created per day over the last 15 days
const TREND = [1, 13, 12, 9, 21, 7, 5, 1, 15, 0, 12, 12, 8, 3, 1];

const DISTRIBUTION = [
  { name: 'Pending', value: 183, color: '#93c5fd' },
  { name: 'In Progress', value: 103, color: '#3170c5' },
  { name: 'Completed', value: 1097, color: '#1e3a8a' },
];

const PRIORITIES = [
  { name: 'Low', value: 21, color: '#93c5fd' },
  { name: 'Medium', value: 1132, color: '#3170c5' },
  { name: 'High', value: 209, color: '#1e3a8a' },
  { name: 'Urgent', value: 21, color: '#0f172a' },
];

const RECENT = [
  { name: 'Quarterly GST reconciliation – Q2', status: 'In Progress', priority: 'Medium', daysAgo: 0 },
  { name: 'Client onboarding checklist – Riyadh office', status: 'Pending', priority: 'High', daysAgo: 1 },
  { name: 'Prepare board meeting deck', status: 'In Progress', priority: 'Medium', daysAgo: 1 },
  { name: 'Payroll audit – October', status: 'Completed', priority: 'Medium', daysAgo: 2 },
  { name: 'Update ESG compliance report', status: 'Completed', priority: 'Urgent', daysAgo: 3 },
];

const MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Manage Tasks', icon: ListTodo },
  { label: 'Create Task', icon: PlusSquare },
  { label: 'Calendar', icon: Calendar },
  { label: 'Daily Work Log', icon: FileSpreadsheet },
  { label: 'Task Tickets', icon: ClipboardList },
  { label: 'Team Members', icon: Users },
  { label: 'Chat', icon: MessageSquare },
  { label: 'Settings', icon: Settings },
];

const STATUS_STYLE = {
  Pending: 'bg-[#d7e7f9] text-[#2558a2]',
  'In Progress': 'bg-[#3170c5]/10 text-[#3170c5]',
  Completed: 'bg-green-100 text-green-600',
};
const PRIORITY_STYLE = {
  Low: 'bg-green-100 text-green-600',
  Medium: 'bg-orange-100 text-orange-600',
  High: 'bg-red-100 text-red-600',
  Urgent: 'bg-purple-100 text-purple-700 font-semibold',
};

function Card({ className = '', children }) {
  return <div className={`rounded-xl bg-white shadow-sm ${className}`}>{children}</div>;
}

function Sidebar() {
  return (
    <aside className="flex w-56 flex-none flex-col border-r border-slate-200/90 bg-white">
      <div className="flex flex-col items-center border-b border-slate-200/80 px-5 py-4">
        <div className="mb-2 mt-1 grid h-16 w-16 place-items-center rounded-full border-4 border-[#3170c5]/20 bg-slate-200 text-xl font-semibold text-slate-700">
          {USER.initials}
        </div>
        <span className="mb-2 rounded-full bg-[#3170c5] px-3 py-1 text-[10px] text-white">{USER.role}</span>
        <p className="text-center text-base font-bold leading-tight text-slate-800">{USER.name}</p>
        <p className="mt-1 text-center text-[13px] leading-tight text-slate-600">{USER.email}</p>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-3">
        {MENU.map((m) => (
          <div
            key={m.label}
            className={`flex items-center space-x-3 rounded-lg px-4 py-2 ${m.active ? 'border-r-4 border-[#3170c5] bg-[#3170c5]/10 text-[#3170c5]' : 'text-slate-700'}`}
          >
            <m.icon size={20} className="shrink-0" />
            <span className="whitespace-nowrap text-[14px] font-medium">{m.label}</span>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200/80 p-3 pt-2">
        <div className="mb-1.5 flex justify-center rounded-lg px-4 py-2 text-slate-500"><ChevronLeft size={18} /></div>
        <div className="mb-1 flex items-center space-x-3 rounded-lg px-4 py-2 text-slate-700"><Home size={20} /><span className="text-[14px] font-medium">Home</span></div>
        <div className="flex items-center space-x-3 rounded-lg px-4 py-2 text-slate-700"><LogOut size={20} /><span className="text-[14px] font-medium">Logout</span></div>
      </div>
    </aside>
  );
}

function TrendChart({ start, now }) {
  const reduce = useReducedMotion();
  const W = 1060, H = 190, padX = 24, top = 22, bottom = 26;
  const max = Math.max(...TREND) * 1.15;
  const x = (i) => padX + (i * (W - padX * 2)) / (TREND.length - 1);
  const y = (v) => top + (H - top - bottom) * (1 - v / max);
  // smooth curve through the points (Catmull-Rom → Bézier), like recharts' "monotone" line
  const pts = TREND.map((v, i) => [x(i), y(v)]);
  const d = pts.reduce((acc, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [x0, y0] = pts[i - 2] || pts[i - 1];
    const [x1, y1] = pts[i - 1];
    const [x3, y3] = pts[i + 1] || [px, py];
    const c1 = [x1 + (px - x0) / 6, y1 + (py - y0) / 6];
    const c2 = [px - (x3 - x1) / 6, py - (y3 - y1) / 6];
    return `${acc} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${px},${py}`;
  }, '');
  const labels = TREND.map((_, i) => {
    if (!now) return '';
    const dt = new Date(now);
    dt.setDate(dt.getDate() - (TREND.length - 1 - i));
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[190px] w-full">
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={padX} x2={W - padX} y1={top + ((H - top - bottom) * k) / 3} y2={top + ((H - top - bottom) * k) / 3} stroke="#f1f5f9" strokeDasharray="3 3" />
      ))}
      <motion.path
        d={d}
        fill="none"
        stroke={BLUE}
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={start ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.6, ease: EASE }}
      />
      {pts.map(([px, py], i) => (
        <motion.g key={i} initial={reduce ? false : { opacity: 0 }} animate={start ? { opacity: 1 } : undefined} transition={{ delay: 0.3 + i * 0.07 }}>
          <circle cx={px} cy={py} r="4" fill="#fff" stroke={BLUE} strokeWidth="2" />
          <text x={px} y={py - 11} textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">{TREND[i]}</text>
          <text x={px} y={H - 6} textAnchor="middle" fontSize="11" fill="#64748b">{labels[i]}</text>
        </motion.g>
      ))}
    </svg>
  );
}

function Donut({ start }) {
  const reduce = useReducedMotion();
  const total = DISTRIBUTION.reduce((s, d) => s + d.value, 0);
  const r = 80, stroke = 24, C = 2 * Math.PI * r, gap = 6;
  // where each segment starts along the ring
  const starts = DISTRIBUTION.map((_, i) => DISTRIBUTION.slice(0, i).reduce((sum, d) => sum + (d.value / total) * C, 0));
  return (
    <svg viewBox="0 0 220 220" className="h-[190px] w-[190px] -rotate-90">
      {DISTRIBUTION.map((s, i) => {
        const len = Math.max(0, (s.value / total) * C - gap);
        return (
          <motion.circle
            key={s.name}
            cx="110" cy="110" r={r} fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDashoffset={-starts[i]}
            initial={reduce ? { strokeDasharray: `${len} ${C - len}` } : { strokeDasharray: `0 ${C}` }}
            animate={start || reduce ? { strokeDasharray: `${len} ${C - len}` } : undefined}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: EASE }}
          />
        );
      })}
    </svg>
  );
}

function PriorityBars({ start }) {
  const reduce = useReducedMotion();
  const max = Math.max(...PRIORITIES.map((p) => p.value));
  return (
    <div className="relative flex h-[200px] items-end justify-around border-b border-slate-100 px-6 pb-0">
      {[0, 1, 2, 3].map((k) => <div key={k} className="absolute inset-x-0 border-t border-dashed border-slate-100" style={{ bottom: `${(k + 1) * 22}%` }} />)}
      {PRIORITIES.map((p, i) => (
        <div key={p.name} className="relative flex h-full w-[60px] flex-col items-center justify-end">
          <span className="mb-2 text-[12px] font-semibold text-slate-600"><CountUp value={p.value} start={start} /></span>
          <motion.div
            className="w-full rounded-lg"
            style={{ background: p.color, height: `${Math.max(3, (p.value / max) * 82)}%`, transformOrigin: 'bottom' }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={start ? { scaleY: 1 } : undefined}
            transition={{ duration: 1, delay: 0.25 + i * 0.12, ease: EASE }}
          />
        </div>
      ))}
    </div>
  );
}

/** The super-admin Task Manager dashboard screen. */
export default function TaskManagerScreen({ start }) {
  const now = useToday();
  const hour = now ? now.getHours() : 18;
  const greeting = hour >= 5 && hour < 12 ? 'Good Morning' : hour >= 12 && hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateText = now
    ? `${now.toLocaleDateString('en-IN', { weekday: 'long' })} ${now.getDate()}${ordinal(now.getDate())} ${now.toLocaleDateString('en-IN', { month: 'short' })} ${now.getFullYear()}`
    : '';
  const created = (daysAgo) => {
    if (!now) return '';
    const dt = new Date(now);
    dt.setDate(dt.getDate() - daysAgo);
    return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex h-full bg-[#f5f7fb] text-left">
      <Sidebar />
      <div className="relative min-w-0 flex-1 overflow-hidden p-8">
        <Card className="mb-8 p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-black">{greeting}! {USER.name}</h2>
              <p className="text-slate-500">Your task dashboard overview</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Today</div>
              <p className="mt-1 text-slate-600">{dateText}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 justify-items-center gap-4">
            {KPIS.map((k) => (
              <div key={k.label} className="w-full max-w-[250px] rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-slate-500"><k.icon size={18} strokeWidth={2} /></div>
                  <div className="h-8 w-px shrink-0 bg-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-slate-500">{k.label}</div>
                    <div className="mt-0.5 text-xl font-bold tracking-tight text-slate-800"><CountUp value={k.value} start={start} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Task Creation Trend</h3>
              <p className="text-xs text-slate-500">Track task addition counts over time</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {['day', 'week', 'month'].map((o) => (
                <span key={o} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${o === 'day' ? 'bg-white text-[#3170c5] shadow-xs' : 'text-slate-600'}`}>{o}</span>
              ))}
            </div>
          </div>
          <TrendChart start={start} now={now} />
        </Card>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="mb-2 font-bold text-slate-800">Task Distribution</h3>
            <div className="flex h-[200px] items-center justify-center"><Donut start={start} /></div>
            <div className="mt-2 flex justify-center gap-6">
              {DISTRIBUTION.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm font-medium text-slate-600">{d.name}: <span className="font-semibold text-slate-800">{d.value.toLocaleString('en-IN')}</span></span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="mb-2 font-bold text-slate-800">Task Priority Levels</h3>
            <PriorityBars start={start} />
            <div className="flex justify-around px-6 pt-2.5">
              {PRIORITIES.map((p) => <span key={p.name} className="w-[60px] text-center text-[11px] text-slate-500">{p.name}</span>)}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent Tasks</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-slate-500">See All <ArrowRight size={16} /></span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-slate-500">
                <th className="pb-3 pl-2">Name</th><th className="pb-3">Status</th><th className="pb-3">Priority</th><th className="pb-3">Created On</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map((t) => (
                <tr key={t.name} className="border-b border-gray-50 last:border-none">
                  <td className="py-4 pl-2 font-medium text-slate-800">{t.name}</td>
                  <td className="py-4"><span className={`rounded px-3 py-1 text-xs font-medium ${STATUS_STYLE[t.status]}`}>{t.status}</span></td>
                  <td className="py-4"><span className={`rounded px-3 py-1 text-xs font-medium ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span></td>
                  <td className="py-4 text-sm text-slate-500">{created(t.daysAgo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        {/* the page continues below the window edge, like a real screenshot */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f5f7fb] to-transparent" />
      </div>
    </div>
  );
}

