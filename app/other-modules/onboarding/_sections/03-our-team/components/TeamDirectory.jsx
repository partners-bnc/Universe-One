'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DIRECTORY_COPY } from '../content';
import { groupByDepartment } from '../useTeamMembers';
import Avatar from './Avatar';
import richTitle from './richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Icon, Reveal } from '../../../_shared/ui';

/*
 * The whole team, one person at a time: photo in the centre, details on the left and right,
 * arrows / keyboard / swipe to move. Department filter and a search narrow the list.
 * On every change the photo flips, the people behind it slide along and each value flips up or down.
 */

const pad2 = (n) => String(n).padStart(2, '0');
const EASE = [0.22, 1, 0.36, 1];

// "2023-03-12" → Date (local, so the day never shifts with the time zone)
function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return Number.isNaN(d.getTime()) ? null : d;
}

const formatDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// whole years and months between joining and today
function tenure(d) {
  const now = new Date();
  let months = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) months -= 1;
  months = Math.max(0, months);
  return { years: Math.floor(months / 12), months: months % 12 };
}

/** A value that flips like a split-flap board when it changes: up when moving forward, down when moving back. */
function Flip({ id, dir, delay = 0, className = '', children }) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-block max-w-full align-bottom [perspective:600px] ${className}`}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={id}
          custom={dir}
          className="block truncate [backface-visibility:hidden] [transform-origin:50%_50%_-12px]"
          initial={reduce ? false : { rotateX: dir * -90, y: dir * 14, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE, delay } }}
          exit={reduce ? undefined : { rotateX: dir * 90, y: dir * -14, opacity: 0, transition: { duration: 0.28, ease: 'easeIn', delay: delay * 0.5 } }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Detail({ icon, label, align = 'left', children }) {
  return (
    <div className={`flex items-center gap-3.5 ${align === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
      <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[#eef4fd] text-[var(--ob-blue)] ring-1 ring-[#dbe7fa]">
        <Icon name={icon} className="text-[21px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">{label}</p>
        <div className="mt-0.5 text-[15.5px] font-bold text-[var(--ob-ink)]">{children}</div>
      </div>
    </div>
  );
}

/** Department filter: one soft rail, the active choice is a white pill that glides between options. */
function DepartmentFilter({ options, value, onChange }) {
  return (
    <div className="ob-scroll-x -mx-1 min-w-0 flex-1 px-1 [mask-image:linear-gradient(90deg,#000_calc(100%-48px),transparent)]">
      <div className="inline-flex gap-1 rounded-full bg-[#f2f6fc] p-1.5 ring-1 ring-[#e3ebf7]" role="tablist" aria-label="Filter by department">
        {options.map(({ name, count }) => {
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(name)}
              className={`relative flex flex-none items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${active ? 'text-[var(--ob-ink)]' : 'text-[var(--ob-muted)] hover:text-[var(--ob-ink)]'}`}
            >
              {active ? (
                <motion.span
                  layoutId="ob-dept-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_-8px_rgba(13,27,61,.35)] ring-1 ring-[#dbe5f4]"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className="relative whitespace-nowrap">{name}</span>
              <span className={`relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10.5px] font-bold transition-colors ${active ? 'bg-[var(--ob-navy)] text-white' : 'bg-white text-[var(--ob-muted)] ring-1 ring-[#e3ebf7]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamDirectory({ members, loading, error }) {
  const reduce = useReducedMotion();
  const [dept, setDept] = useState('All');
  const [query, setQuery] = useState('');
  const [[index, dir], setPos] = useState([0, 1]);
  const options = useMemo(
    () => [{ name: 'All', count: members.length }, ...groupByDepartment(members).map((d) => ({ name: d.name, count: d.people.length }))],
    [members],
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (dept !== 'All' && (m.department || 'Other') !== dept) return false;
      return !q || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || (m.code || '').toLowerCase().includes(q);
    });
  }, [members, dept, query]);

  const count = shown.length;
  const i = count ? Math.min(index, count - 1) : 0;
  const person = shown[i];
  const go = (step) => count > 1 && setPos([(i + step + count) % count, step]);
  const pickDept = (d) => { setDept(d); setPos([0, 1]); };
  const search = (q) => { setQuery(q); setPos([0, 1]); };

  const joined = parseDate(person?.joined);
  const time = joined ? tenure(joined) : null;
  const neighbour = (step) => (count > 1 ? shown[(i + step + count) % count] : null);
  const key = person?.id;

  return (
    <section id="team-directory" className="scroll-mt-24">
      <ChapterHead index={DIRECTORY_COPY.index} eyebrow={DIRECTORY_COPY.eyebrow} title={richTitle(DIRECTORY_COPY.title)} text={DIRECTORY_COPY.text} />

      <Reveal className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <DepartmentFilter options={options} value={dept} onChange={pickDept} />
        <label className="relative block flex-none lg:w-72">
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[var(--ob-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search by name, role or ID"
            className="w-full rounded-full bg-[#f2f6fc] py-3 pl-11 pr-4 text-[14px] outline-none ring-1 ring-[#e3ebf7] transition focus:bg-white focus:ring-2 focus:ring-[var(--ob-blue)]"
          />
        </label>
      </Reveal>

      {loading ? (
        <div className="mt-6 h-[460px] animate-pulse rounded-[28px] bg-[#f3f7fd]" />
      ) : error ? (
        <p className="mt-8 text-[14px] text-[var(--ob-muted)]">The team list could not be loaded right now. Please refresh the page.</p>
      ) : !count ? (
        <p className="mt-8 rounded-[28px] bg-[#f6f9fe] px-6 py-16 text-center text-[14px] text-[var(--ob-muted)]">No one matches this filter.</p>
      ) : (
        <Reveal>
          <div
            className="relative mt-6 overflow-hidden rounded-[28px] bg-white px-5 py-8 shadow-[0_40px_90px_-50px_rgba(13,27,61,.45)] ring-1 ring-[var(--ob-line)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ob-blue)] sm:px-8 lg:px-12 lg:py-12"
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            aria-label="Team member details"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
              if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
            }}
          >
            <span className="ob-index pointer-events-none absolute right-6 top-4 hidden select-none text-[96px] leading-none opacity-60 lg:block" aria-hidden="true">
              <Flip id={key} dir={dir}>{pad2(i + 1)}</Flip>
            </span>

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
              {/* left: who they are */}
              <div className="order-2 min-w-0 space-y-6 lg:order-1 lg:text-right">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ob-blue)]">
                    Team member · <Flip id={key} dir={dir}>{pad2(i + 1)}</Flip> of {pad2(count)}
                  </p>
                  <h3 className="ob-serif mt-2 text-[38px] leading-[1.08] text-[var(--ob-ink)] sm:text-[46px]">
                    <Flip id={key} dir={dir} className="w-full">{person.name}</Flip>
                  </h3>
                </div>
                <Detail icon="badge" label="Employee ID" align="right">
                  <Flip id={key} dir={dir} delay={0.06} className="font-mono tracking-wide">{person.code || 'Not assigned'}</Flip>
                </Detail>
                <Detail icon="work" label="Designation" align="right">
                  <Flip id={key} dir={dir} delay={0.12} className="w-full">{person.role || '—'}</Flip>
                </Detail>
              </div>

              {/* centre: the photo flips over to the next person; the people behind slide along */}
              <div className="relative order-1 mx-auto [perspective:1400px] lg:order-2">
                {[-1, 1].map((side) => {
                  const p = neighbour(side);
                  return (
                    <AnimatePresence key={side} initial={false} custom={dir}>
                      {p ? (
                        <motion.div
                          key={p.id}
                          className={`absolute top-1/2 hidden h-[78%] w-[70%] overflow-hidden rounded-[22px] opacity-50 grayscale shadow-[0_20px_40px_-24px_rgba(13,27,61,.5)] ring-4 ring-white sm:block ${side > 0 ? '-right-9' : '-left-9'}`}
                          initial={reduce ? false : { x: dir * 70, y: '-50%', rotate: side * 5, opacity: 0 }}
                          animate={{ x: 0, y: '-50%', rotate: side * 5, opacity: 0.5, transition: { duration: 0.55, ease: EASE, delay: 0.08 } }}
                          exit={reduce ? undefined : { x: dir * -70, y: '-50%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
                          aria-hidden="true"
                        >
                          <Avatar person={p} className="h-full w-full" textClass="text-[28px]" />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  );
                })}
                <div className="relative h-[340px] w-[260px] [transform-style:preserve-3d] sm:h-[400px] sm:w-[300px]">
                  <AnimatePresence initial={false} custom={dir}>
                    <motion.div
                      key={key}
                      className="absolute inset-0 cursor-grab overflow-hidden rounded-[26px] bg-[#eef3fb] shadow-[0_30px_60px_-28px_rgba(13,27,61,.55)] ring-4 ring-white [backface-visibility:hidden] active:cursor-grabbing"
                      initial={reduce ? false : { rotateY: dir * 90, x: dir * 40, opacity: 0 }}
                      animate={{ rotateY: 0, x: 0, opacity: 1, transition: { duration: 0.6, ease: EASE, delay: 0.12 } }}
                      exit={reduce ? undefined : { rotateY: dir * -90, x: dir * -40, opacity: 0, transition: { duration: 0.32, ease: 'easeIn' } }}
                      drag={count > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.25}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) go(1);
                        else if (info.offset.x > 60) go(-1);
                      }}
                    >
                      <Avatar person={person} className="pointer-events-none h-full w-full" textClass="text-[56px]" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* right: their time at BNC */}
              <div className="order-3 min-w-0 space-y-6">
                <Detail icon="apartment" label="Department">
                  <Flip id={key} dir={dir} delay={0.06} className="w-full">{person.department || '—'}</Flip>
                </Detail>
                <Detail icon="event" label="Joined on">
                  <Flip id={key} dir={dir} delay={0.12}>{joined ? formatDate(joined) : 'Not recorded'}</Flip>
                </Detail>
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">With BNC Global</p>
                  <Flip id={key} dir={dir} delay={0.18} className="mt-1">
                    {time ? (
                      <span className="flex items-baseline gap-2 text-[var(--ob-ink)]">
                        {time.years || !time.months ? (
                          <>
                            <span className="text-[52px] font-bold leading-none tracking-tight">{time.years}</span>
                            <span className="text-[15px] font-semibold text-[var(--ob-body)]">{time.years === 1 ? 'year' : 'years'}</span>
                          </>
                        ) : null}
                        {time.months ? (
                          <>
                            <span className={`font-bold leading-none tracking-tight ${time.years ? 'ml-1 text-[30px]' : 'text-[52px]'}`}>{time.months}</span>
                            <span className="text-[15px] font-semibold text-[var(--ob-body)]">{time.months === 1 ? 'month' : 'months'}</span>
                          </>
                        ) : null}
                      </span>
                    ) : (
                      <span className="text-[15.5px] font-bold text-[var(--ob-ink)]">—</span>
                    )}
                  </Flip>
                </div>
              </div>
            </div>

            {/* previous / next, centred under the photo */}
            <div className="relative mt-10 flex items-center justify-center gap-4">
              {[
                { step: -1, icon: 'arrow_back', label: 'Previous person' },
                { step: 1, icon: 'arrow_forward', label: 'Next person' },
              ].map((b) => (
                <motion.button
                  key={b.step}
                  type="button"
                  onClick={() => go(b.step)}
                  disabled={count < 2}
                  aria-label={b.label}
                  whileTap={{ scale: 0.9 }}
                  className="grid h-14 w-14 touch-manipulation place-items-center rounded-full bg-[var(--ob-navy)] text-white shadow-[0_12px_26px_-12px_rgba(13,27,61,.7)] transition-colors hover:bg-[var(--ob-blue)] disabled:opacity-40"
                >
                  <Icon name={b.icon} className="text-[22px]" />
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
