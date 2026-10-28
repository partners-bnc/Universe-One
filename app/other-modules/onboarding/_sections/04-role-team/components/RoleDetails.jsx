'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CHAPTERS, MODULES } from '../content';
import { formatDate, formatMoney, parseDate } from '../format';
import richTitle from '../../03-our-team/components/richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, RevealGroup, RevealItem } from '../../../_shared/ui';

// Bento of the employee's job set-up: employment, probation, working week, experience, pay and module access.

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function CardTitle({ icon, children }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef4fd] text-[var(--ob-blue)] ring-1 ring-[#dbe7fa]">
        <Icon name={icon} className="text-[19px]" />
      </span>
      <h3 className="text-[15px] font-bold tracking-[-0.01em] text-[var(--ob-ink)]">{children}</h3>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-[var(--ob-line)] py-3 last:border-0">
      <span className="text-[13px] text-[var(--ob-muted)]">{label}</span>
      <span className="text-right text-[14px] font-bold text-[var(--ob-ink)]">{value || '—'}</span>
    </div>
  );
}

/** Probation start → end with how far through it the employee is today. */
function Probation({ start, end }) {
  const reduce = useReducedMotion();
  const [now] = useState(() => Date.now());
  const s = parseDate(start), e = parseDate(end);
  if (!s || !e) return null;
  const pct = Math.round(Math.min(1, Math.max(0, (now - s) / (e - s))) * 100);
  return (
    <div className="mt-5 rounded-2xl bg-[#f7f9fd] p-4 ring-1 ring-[#edf2fa]">
      <div className="flex items-center justify-between text-[12px] font-semibold text-[var(--ob-muted)]">
        <span>Probation</span>
        <span className={pct >= 100 ? 'text-[#0f7a4f]' : 'text-[var(--ob-blue)]'}>{pct >= 100 ? 'Completed' : `${pct}% done`}</span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white ring-1 ring-[#e3ebf7]">
        <motion.div
          className={`h-full rounded-full ${pct >= 100 ? 'bg-[#0f9d63]' : 'bg-[var(--ob-blue)]'}`}
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[12px] font-bold text-[var(--ob-ink)]">
        <span>{formatDate(start)}</span>
        <span>{formatDate(end)}</span>
      </div>
    </div>
  );
}

function Salary({ value }) {
  const [shown, setShown] = useState(false);
  const money = formatMoney(value);
  return (
    <div>
      <p className="text-[12px] text-[var(--ob-muted)]">Salary on record</p>
      <div className="mt-2 flex items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-[30px] font-bold tracking-tight text-[var(--ob-ink)]">
          {money ? (shown ? money : '₹ • • • • • •') : 'Not on record'}
        </p>
        {money ? (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? 'Hide salary' : 'Show salary'}
            className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#f2f6fc] text-[var(--ob-ink)] ring-1 ring-[#e3ebf7] transition hover:bg-white"
          >
            <Icon name={shown ? 'visibility_off' : 'visibility'} className="text-[19px]" />
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-[var(--ob-muted)]">Hidden by default. Payslips are in HRM → Payroll.</p>
    </div>
  );
}

export default function RoleDetails({ data }) {
  const { profile: p, manager } = data;
  const c = CHAPTERS.role;
  const days = Array.isArray(p.workingDays) ? p.workingDays.map((d) => String(d).toLowerCase()) : [];
  const modules = MODULES.map((m) => ({ ...m, on: Boolean(p.modules?.[m.key]), role: m.role ? p.modules?.[m.role] : '' }));
  const exp = p.totalExperience !== '' && p.totalExperience !== null ? String(p.totalExperience) : '';

  return (
    <section>
      <ChapterHead index={c.index} eyebrow={c.eyebrow} title={richTitle(c.title)} text={c.text} />
      <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <RevealItem className="lg:col-span-7 lg:row-span-2">
          <Glass className="h-full rounded-[26px] p-6 md:p-7">
            <CardTitle icon="work">Employment</CardTitle>
            <Row label="Designation" value={p.role} />
            <Row label="Department" value={p.department} />
            <Row label="Reporting to" value={manager ? `${manager.name}${manager.code ? ` (${manager.code})` : ''}` : 'Not assigned'} />
            <Row label="Employee type" value={p.employeeType} />
            <Row label="Status" value={p.lifecycle} />
            <Row label="Current stage" value={p.stage} />
            <Row label="Date of joining" value={formatDate(p.joined)} />
            <Row label="Confirmation date" value={formatDate(p.confirmed)} />
            <Probation start={p.probationStart} end={p.probationEnd} />
          </Glass>
        </RevealItem>

        <RevealItem className="lg:col-span-5">
          <Glass className="h-full rounded-[26px] p-6 md:p-7">
            <CardTitle icon="calendar_month">Working week</CardTitle>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((d) => {
                const on = days.includes(d);
                return (
                  <div
                    key={d}
                    className={`rounded-xl py-3 text-center text-[12px] font-bold ${on ? 'bg-[var(--ob-navy)] text-white' : 'bg-[#f2f6fc] text-[var(--ob-muted)]'}`}
                    title={`${d[0].toUpperCase()}${d.slice(1)}${on ? ': working day' : ': off'}`}
                  >
                    {d.slice(0, 2).toUpperCase()}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[14px] font-bold text-[var(--ob-ink)]">{p.schedule || `${days.length} working days`}</p>
            {p.secondSaturdayOff ? (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e7f6ee] px-3 py-1 text-[12px] font-bold text-[#0f7a4f]">
                <Icon name="event_available" className="text-[15px]" /> Second Saturday off
              </p>
            ) : null}
          </Glass>
        </RevealItem>

        <RevealItem className="lg:col-span-5">
          <div className="grid h-full gap-4 sm:grid-cols-2">
            <Glass tint className="rounded-[26px] p-6">
              <CardTitle icon="trending_up">Experience</CardTitle>
              <p className="text-[40px] font-bold leading-none tracking-tight text-[var(--ob-ink)]">
                {exp || '—'}
                {exp ? <span className="ml-1.5 text-[14px] font-semibold text-[var(--ob-body)]">{Number(exp) === 1 ? 'year' : 'years'}</span> : null}
              </p>
              <p className="mt-3 text-[12.5px] text-[var(--ob-muted)]">
                {p.previousCompany ? <>Previously at <b className="text-[var(--ob-ink)]">{p.previousCompany}</b></> : 'Total experience before BNC'}
              </p>
            </Glass>
            <Glass className="rounded-[26px] p-6">
              <CardTitle icon="payments">Pay</CardTitle>
              <Salary value={p.salary} />
            </Glass>
          </div>
        </RevealItem>

        <RevealItem className="md:col-span-2 lg:col-span-12">
          <Glass className="rounded-[26px] p-6 md:p-7">
            <CardTitle icon="widgets">Your Universe One access</CardTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {modules.map((m) => (
                <div
                  key={m.key}
                  className={`rounded-2xl p-4 ring-1 transition ${m.on ? 'bg-white ring-[#cfe0f7] shadow-[0_14px_30px_-22px_rgba(18,87,192,.6)]' : 'bg-[#f7f9fd] ring-[#edf2fa]'}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon name={m.icon} className={`text-[22px] ${m.on ? 'text-[var(--ob-blue)]' : 'text-[#b4bdd0]'}`} />
                    <span className={`h-2 w-2 rounded-full ${m.on ? 'bg-[#0f9d63] shadow-[0_0_0_4px_rgba(15,157,99,.15)]' : 'bg-[#cfd6e4]'}`} />
                  </div>
                  <p className={`mt-3 text-[14px] font-bold ${m.on ? 'text-[var(--ob-ink)]' : 'text-[var(--ob-muted)]'}`}>{m.label}</p>
                  <p className="mt-0.5 text-[12px] capitalize text-[var(--ob-muted)]">{m.on ? (m.role ? `${m.role} access` : 'Enabled') : 'Not enabled'}</p>
                </div>
              ))}
            </div>
          </Glass>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
