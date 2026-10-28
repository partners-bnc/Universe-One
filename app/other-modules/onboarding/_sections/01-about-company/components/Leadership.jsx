'use client';

import { FOUNDERS, LEADERS } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// Chapter 03 · Leadership: founders and senior leaders.
function initials(name) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('');
}

export default function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-24">
      <ChapterHead
        index="03" eyebrow="Leadership"
        title={['The people ', <b key="b">who lead BNC.</b>]}
        text="Our founders bring experience in consulting, chartered accountancy, finance transformation, enterprise risk, governance, assurance, internal controls, audit and process automation."
      />
      <RevealGroup className="grid gap-4 md:grid-cols-2">
        {FOUNDERS.map((f, i) => (
          <RevealItem key={f.name}>
            <Glass hover className={`flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-center md:p-7 ${i ? 'ob-diag-r' : 'ob-diag-l'}`}>
              <span className="h-24 w-24 flex-none overflow-hidden rounded-full bg-[#eef3fb] shadow-[0_0_0_3px_rgba(255,255,255,.95),0_0_0_5px_rgba(18,87,192,.22),0_10px_24px_rgba(13,27,61,.18)]">
                <img src={f.photo} alt={`Portrait of ${f.name}`} className="h-full w-full object-cover" />
              </span>
              <div>
                <span className="rounded-full bg-[var(--ob-navy)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">{f.title}</span>
                <p className="mt-3 text-[24px] font-bold tracking-[-0.025em]">{f.name}</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--ob-body)]">{f.focus}</p>
              </div>
            </Glass>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-8">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--ob-muted)]">Senior leaders</p>
      </Reveal>
      <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
        {LEADERS.map((l) => (
          <RevealItem key={l.name}>
            <Glass tint hover className="flex h-full items-center gap-3 rounded-2xl p-4">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/80 text-[13px] font-bold text-[var(--ob-blue)] shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgba(18,87,192,.15)]">
                {initials(l.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-bold">{l.name}</p>
                <p className="text-[12.5px] leading-snug text-[var(--ob-muted)]">{l.area}</p>
              </div>
            </Glass>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
