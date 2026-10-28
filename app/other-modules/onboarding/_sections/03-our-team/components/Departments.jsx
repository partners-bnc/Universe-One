'use client';

import { DEPARTMENTS_COPY } from '../content';
import { groupByDepartment } from '../useTeamMembers';
import Avatar from './Avatar';
import richTitle from './richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, RevealGroup, RevealItem } from '../../../_shared/ui';

// Bento grid of departments: the largest one gets a wide photo card, the rest show a row of faces.
export default function Departments({ members, loading }) {
  const groups = groupByDepartment(members);
  if (loading || !groups.length) return null;
  const [lead, ...rest] = groups;
  return (
    <section id="team-departments" className="scroll-mt-24">
      <ChapterHead index={DEPARTMENTS_COPY.index} eyebrow={DEPARTMENTS_COPY.eyebrow} title={richTitle(DEPARTMENTS_COPY.title)} text={DEPARTMENTS_COPY.text} />
      <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RevealItem className="md:col-span-2">
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-[28px_8px_28px_8px] bg-[var(--ob-navy)] p-7 text-white shadow-[0_30px_60px_-24px_rgba(13,27,61,.5)] md:p-9">
            <div className="absolute inset-y-0 right-0 hidden w-[52%] grid-cols-3 gap-2 p-4 md:grid">
              {lead.people.slice(0, 6).map((p) => (
                <Avatar key={p.id} person={p} className="h-full min-h-[110px] w-full rounded-2xl" textClass="text-[18px]" />
              ))}
            </div>
            <div className="relative max-w-[46%] max-md:max-w-none">
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7db4ff]">Largest team</p>
              <p className="mt-4 text-[30px] font-bold leading-tight tracking-[-0.03em] md:text-[36px]">{lead.name}</p>
              <p className="mt-2 text-[15px] text-[#b9c5de]">{lead.people.length} {lead.people.length === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
        </RevealItem>
        {rest.map((d, i) => (
          <RevealItem key={d.name}>
            <Glass tint hover className={`flex h-full flex-col justify-between gap-6 p-6 ${i % 2 ? 'ob-diag-l' : 'ob-diag-r'}`}>
              <div>
                <p className="text-[19px] font-bold tracking-[-0.02em]">{d.name}</p>
                <p className="mt-1 text-[13.5px] text-[var(--ob-muted)]">{d.people.length} {d.people.length === 1 ? 'person' : 'people'}</p>
              </div>
              <div className="flex items-center">
                {d.people.slice(0, 5).map((p, k) => (
                  <Avatar key={p.id} person={p} className={`h-11 w-11 rounded-full ring-[3px] ring-white ${k ? '-ml-3' : ''}`} textClass="text-[12px]" />
                ))}
                {d.people.length > 5 ? (
                  <span className="-ml-3 grid h-11 w-11 place-items-center rounded-full bg-[var(--ob-navy)] text-[12px] font-bold text-white ring-[3px] ring-white">+{d.people.length - 5}</span>
                ) : null}
              </div>
            </Glass>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
