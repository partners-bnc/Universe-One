'use client';

import { PARTNER_TYPES, PARTNER_JOURNEY, PARTNER_FEATURES } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// Chapter 06 · Partner network (BNC LEG).
export default function Partners() {
  return (
    <section id="partners" className="scroll-mt-24">
      <ChapterHead
        index="06" eyebrow="Partner network · BNC LEG"
        title={['An ecosystem that ', <b key="b">extends our reach.</b>]}
        text="BNC LEG is our partner ecosystem and collaboration portal, connecting businesses, technology providers, service experts, sales partners and international partners."
      />
      <RevealGroup className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PARTNER_TYPES.map((t, i) => (
          <RevealItem key={t.title}>
            <Glass tint hover className={`h-full p-5 ${i % 2 ? 'ob-diag-r' : 'ob-diag-l'}`}>
              <Icon name={t.icon} className="text-[26px] text-[var(--ob-blue)]" />
              <p className="mt-5 text-[16px] font-bold tracking-[-0.01em]">{t.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ob-body)]">{t.text}</p>
            </Glass>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <Glass className="ob-diag-l h-full p-6 md:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--ob-muted)]">How a partner joins</p>
            <ol className="relative mt-6 grid gap-5 sm:grid-cols-4 sm:gap-3">
              <span className="absolute left-[18px] top-0 h-full w-px bg-[var(--ob-line)] sm:left-0 sm:top-[18px] sm:h-px sm:w-full" aria-hidden="true" />
              {PARTNER_JOURNEY.map((step, i) => (
                <li key={step} className="relative flex items-center gap-3 sm:flex-col sm:items-start">
                  <span className="relative grid h-9 w-9 flex-none place-items-center rounded-full bg-[var(--ob-blue)] text-[13px] font-bold text-white shadow-[0_0_0_5px_rgba(255,255,255,.8)]">{i + 1}</span>
                  <span className="text-[14px] font-semibold leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </Glass>
        </Reveal>
        <Reveal delay={0.1}>
          <Glass className="ob-diag-r h-full p-6 md:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--ob-muted)]">Platform features</p>
            <ul className="mt-4 space-y-2.5">
              {PARTNER_FEATURES.map((f) => (
                <li key={f} className="flex gap-2.5 text-[14px] leading-snug text-[var(--ob-body)]">
                  <Icon name="check_circle" className="mt-px text-[18px] text-[var(--ob-blue)]" />
                  {f}
                </li>
              ))}
            </ul>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}
