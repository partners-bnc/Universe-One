'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ROLE_HERO } from '../content';
import { firstName, formatDate, tenure, tenureText } from '../format';
import Avatar from '../../03-our-team/components/Avatar';
import { Glass, Icon, Reveal, RevealGroup, RevealItem, SplitHeading } from '../../../_shared/ui';

/** The employee's ID card, layered over a tinted card behind it; tilts gently towards the pointer. */
function IdCard({ profile }) {
  const reduce = useReducedMotion();
  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const onLeave = (e) => { e.currentTarget.style.transform = ''; };
  return (
    <div className="relative mx-auto w-[300px] [perspective:1200px] sm:w-[330px]">
      {/* layers behind the card */}
      <div className="absolute inset-0 translate-x-6 translate-y-5 rotate-[6deg] rounded-[30px] bg-[#e8f0fc]" aria-hidden="true" />
      <div className="absolute inset-0 translate-x-3 translate-y-2.5 rotate-[3deg] rounded-[30px] bg-[#f3f7fd] ring-1 ring-[#e3ebf7]" aria-hidden="true" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative overflow-hidden rounded-[30px] bg-white p-4 shadow-[0_40px_80px_-40px_rgba(13,27,61,.55)] ring-1 ring-[var(--ob-line)] transition-transform duration-300 ease-out"
        >
          {/* lanyard slot + company line */}
          <div className="flex items-center justify-between px-1 pb-3">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--ob-blue)]">BNC Global</span>
            <span className="h-2 w-12 rounded-full bg-[#eef3fb] ring-1 ring-[#dfe8f6]" aria-hidden="true" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--ob-muted)]">Staff</span>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-[22px] bg-[#eef3fb] sm:h-[330px]">
            <Avatar person={profile} className="h-full w-full" textClass="text-[64px]" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#0f7a4f] shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f9d63]" /> {profile.lifecycle || 'Active'}
            </span>
          </div>
          <div className="px-1 pb-1 pt-4">
            <p className="ob-serif text-[30px] leading-none text-[var(--ob-ink)]">{profile.name}</p>
            <p className="mt-1.5 text-[14px] font-semibold text-[var(--ob-body)]">{profile.role || 'Team member'}</p>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-[var(--ob-line)] pt-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">Department</p>
                <p className="truncate text-[13px] font-bold text-[var(--ob-ink)]">{profile.department || '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">Employee ID</p>
                <p className="font-mono text-[15px] font-bold tracking-wider text-[var(--ob-ink)]">{profile.code || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RoleHero({ data }) {
  const { profile, manager, reports } = data;
  const t = tenure(profile.joined);
  const stats = [
    { icon: 'event', label: 'Joined on', value: formatDate(profile.joined) || '—' },
    { icon: 'hourglass_top', label: 'With BNC', value: tenureText(t) || '—' },
    { icon: 'supervisor_account', label: 'Reports to', value: manager?.name || 'Not assigned' },
    { icon: 'groups', label: 'Your team', value: reports.length ? `${reports.length} ${reports.length === 1 ? 'person reports' : 'people report'} to you` : 'No direct reports' },
  ];
  const chips = [profile.employeeType, profile.stage && profile.stage !== 'None' ? profile.stage : '', profile.schedule].filter(Boolean);

  return (
    <section className="relative grid min-h-[100svh] items-center gap-12 pb-10 pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-12">
      <Reveal className="absolute right-0 top-4 md:top-5">
        <span className="ob-chip text-[12px]">
          <span className="h-2 w-2 rounded-full bg-[var(--ob-blue)] shadow-[0_0_0_4px_rgba(18,87,192,.15)]" />
          {ROLE_HERO.eyebrow}
        </span>
      </Reveal>

      <div className="order-2 lg:order-1">
        <h1 className="leading-[1.02] tracking-[-0.035em]">
          <SplitHeading as="span" className="ob-serif block text-[clamp(38px,4.4vw,68px)]">{ROLE_HERO.serifLine}</SplitHeading>
          <SplitHeading as="span" className="block text-[clamp(34px,3.9vw,60px)] font-bold">{ROLE_HERO.boldLine}</SplitHeading>
        </h1>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--ob-body)] md:text-[17px]">
            Welcome, <b className="font-bold text-[var(--ob-ink)]">{firstName(profile.name)}</b>. {ROLE_HERO.intro}
          </p>
        </Reveal>
        {chips.length ? (
          <Reveal delay={0.22} className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-[#f2f6fc] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--ob-body)] ring-1 ring-[#e3ebf7]">{c}</span>
            ))}
          </Reveal>
        ) : null}
        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <Glass tint className="h-full rounded-[20px] p-4 sm:p-5">
                <Icon name={s.icon} className="text-[22px] text-[var(--ob-blue)]" />
                <p className="mt-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">{s.label}</p>
                <p className="mt-1 text-[16px] font-bold leading-snug text-[var(--ob-ink)] sm:text-[18px]">{s.value}</p>
              </Glass>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div className="order-1 lg:order-2">
        <IdCard profile={profile} />
      </div>
    </section>
  );
}
