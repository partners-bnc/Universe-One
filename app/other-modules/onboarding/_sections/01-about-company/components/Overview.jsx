'use client';

import logoWhite from '../assets/bnc-logo-white.png';
import { COMPANY, AT_A_GLANCE } from '../content';
import { Eyebrow, Glass, Icon, Reveal, RevealGroup, RevealItem, SplitHeading } from '../../../_shared/ui';

// Chapter 01 · Overview: the "Welcome to BNC Global." panel and the five At-a-glance cards.
export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-24">
      <Glass className="ob-diag-l p-7 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Section 01 · About the Company</Eyebrow>
            <SplitHeading as="h1" className="ob-h1 mt-5">
              Welcome to <b>BNC Global.</b>
            </SplitHeading>
            <Reveal delay={0.15}>
              <p className="ob-lead mt-6 max-w-[56ch]">{COMPANY.intro}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-7 flex flex-wrap gap-2">
              <span className="ob-chip"><Icon name="verified" className="text-[18px] text-[var(--ob-blue)]" />{COMPANY.legalName}</span>
              <span className="ob-chip"><Icon name="location_on" className="text-[18px] text-[var(--ob-blue)]" />Gurugram · Riyadh</span>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative rounded-[24px] bg-[var(--ob-navy)] p-7 text-white shadow-[0_30px_60px_-24px_rgba(13,27,61,.55)] md:p-8">
              <img src={logoWhite.src} alt="BNC Global — Clarity. Compliance. Confidence." className="relative w-44" />
              <p className="relative mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7db4ff]">Our positioning</p>
              <p className="relative mt-3 text-[19px] font-medium leading-snug tracking-[-0.01em] md:text-[21px]">“{COMPANY.positioning}”</p>
            </div>
          </Reveal>
        </div>
      </Glass>

      <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {AT_A_GLANCE.map((g, i) => (
          <RevealItem key={g.label}>
            <Glass tint hover className={`h-full p-5 ${i % 2 ? 'ob-diag-r' : 'ob-diag-l'}`}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 text-[var(--ob-blue)] shadow-[inset_0_1px_0_#fff,0_2px_6px_rgba(13,27,61,.08)]">
                <Icon name={g.icon} className="text-[20px]" />
              </span>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ob-muted)]">{g.label}</p>
              <p className="mt-1.5 text-[14.5px] font-semibold leading-snug">{g.value}</p>
            </Glass>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
