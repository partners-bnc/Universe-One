'use client';

import { CHAPTERS } from '../content';
import Avatar from '../../03-our-team/components/Avatar';
import richTitle from '../../03-our-team/components/richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Icon, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// The employee's reporting line, top to bottom: their manager → the employee → the people who report to them.

function TierLabel({ icon, children, count }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ob-muted)] ring-1 ring-[var(--ob-line)]">
        <Icon name={icon} className="text-[16px] text-[var(--ob-blue)]" />
        {children}
        {count !== undefined ? <span className="rounded-full bg-[#eef4fd] px-2 py-0.5 text-[10.5px] text-[var(--ob-blue)]">{count}</span> : null}
      </span>
    </div>
  );
}

// a short vertical line joining two tiers
const Connector = () => (
  <div className="flex justify-center py-1" aria-hidden="true">
    <span className="relative h-12 w-px bg-[#c9d8ef]">
      <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--ob-blue)] ring-4 ring-[#e8f0fc]" />
    </span>
  </div>
);

function PersonCard({ person, you = false }) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-[22px] p-2.5 transition duration-300 ${you ? 'bg-[var(--ob-navy)] text-white shadow-[0_24px_50px_-24px_rgba(13,27,61,.7)]' : 'bg-white ring-1 ring-[var(--ob-line)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(13,27,61,.5)]'}`}
    >
      <div className="relative aspect-[4/4.4] overflow-hidden rounded-[16px] bg-[#eef3fb]">
        <Avatar person={person} className="h-full w-full transition duration-500 group-hover:scale-[1.04]" textClass="text-[28px]" />
        {you ? <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--ob-navy)]">You</span> : null}
      </div>
      <div className="px-1.5 pb-1 pt-3">
        <p className={`truncate text-[14px] font-bold ${you ? 'text-white' : 'text-[var(--ob-ink)]'}`}>{person.name}</p>
        <p className={`truncate text-[12.5px] ${you ? 'text-[#b9c5de]' : 'text-[var(--ob-muted)]'}`}>{person.role || '—'}</p>
        <p className={`mt-1.5 font-mono text-[11px] font-semibold tracking-wider ${you ? 'text-[#7db4ff]' : 'text-[var(--ob-blue)]'}`}>{person.code}</p>
      </div>
    </div>
  );
}

/** Wide card for the manager (white) and for the employee themself (navy, marked "You"). */
function WideCard({ person, label, you = false }) {
  return (
    <div className={`mx-auto flex max-w-[560px] items-center gap-5 rounded-[26px] p-3 pr-6 ${you ? 'bg-[var(--ob-navy)] text-white shadow-[0_30px_60px_-30px_rgba(13,27,61,.75)]' : 'bg-white shadow-[0_30px_60px_-36px_rgba(13,27,61,.5)] ring-1 ring-[var(--ob-line)]'}`}>
      <div className="relative h-[104px] w-[88px] flex-none overflow-hidden rounded-[18px] bg-[#eef3fb]">
        <Avatar person={person} className="h-full w-full" textClass="text-[24px]" />
        {you ? <span className="absolute left-1.5 top-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ob-navy)]">You</span> : null}
      </div>
      <div className="min-w-0">
        <p className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] ${you ? 'text-[#7db4ff]' : 'text-[var(--ob-blue)]'}`}>{label}</p>
        <p className={`ob-serif mt-1 truncate text-[28px] leading-none ${you ? 'text-white' : 'text-[var(--ob-ink)]'}`}>{person.name}</p>
        <p className={`mt-1.5 truncate text-[13.5px] ${you ? 'text-[#b9c5de]' : 'text-[var(--ob-body)]'}`}>
          {person.role || '—'}{person.department ? ` · ${person.department}` : ''}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[12px]">
          {person.code ? <span className={`rounded-full px-2.5 py-1 font-mono font-semibold ${you ? 'bg-white/10 text-white' : 'bg-[#f2f6fc] text-[var(--ob-ink)]'}`}>{person.code}</span> : null}
          {person.email ? (
            <a href={`mailto:${person.email}`} className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${you ? 'bg-white/10 text-[#cfe0ff] hover:bg-white/15' : 'bg-[#f2f6fc] text-[var(--ob-blue)] hover:bg-[#e8f0fc]'}`}>
              <Icon name="mail" className="text-[14px]" /> <span className="truncate">{person.email}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ReportingLine({ data }) {
  const { profile, manager, reports } = data;
  const c = CHAPTERS.line;
  return (
    <section>
      <ChapterHead index={c.index} eyebrow={c.eyebrow} title={richTitle(c.title)} text={c.text} />
      <div className="rounded-[32px] bg-[#f7f9fd] px-4 py-10 ring-1 ring-[#edf2fa] sm:px-8 md:py-14">
        <Reveal>
          <TierLabel icon="supervisor_account">Reports to</TierLabel>
          {manager ? (
            <WideCard person={manager} label="Your reporting manager" />
          ) : (
            <p className="mx-auto max-w-[420px] rounded-[22px] bg-white px-6 py-5 text-center text-[14px] text-[var(--ob-muted)] ring-1 ring-[var(--ob-line)]">
              No reporting manager is set in HRM yet.
            </p>
          )}
        </Reveal>

        <Connector />

        <Reveal>
          <TierLabel icon="person">You</TierLabel>
          <WideCard person={profile} label="Your profile" you />
        </Reveal>

        <Connector />

        <Reveal>
          <TierLabel icon="groups" count={reports.length}>Your team</TierLabel>
        </Reveal>
        {reports.length ? (
          <RevealGroup className="flex flex-wrap justify-center gap-3 md:gap-4">
            {reports.map((p) => (
              <RevealItem key={p.id} className="w-[calc(50%-6px)] sm:w-[200px]"><PersonCard person={p} /></RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="mx-auto max-w-[420px] rounded-[22px] bg-white px-6 py-5 text-center text-[14px] text-[var(--ob-muted)] ring-1 ring-[var(--ob-line)]">
            No one reports to you yet. When HR sets you as someone’s reporting manager, they will appear here.
          </p>
        )}
      </div>
    </section>
  );
}
