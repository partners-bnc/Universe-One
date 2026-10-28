'use client';

import { WHO_WE_ARE } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// Chapter 02 · Who we are.
export default function WhoWeAre() {
  return (
    <section id="who-we-are" className="scroll-mt-24">
      <ChapterHead index="02" eyebrow="Who we are" title={['An integrated firm for ', <b key="b">business change and growth.</b>]} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="space-y-5">
            {WHO_WE_ARE.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-[17px] leading-[1.75] text-[var(--ob-body)] first:text-[19px] first:font-medium first:text-[var(--ob-ink)]">{p}</p>
            ))}
          </div>
        </Reveal>
        <RevealGroup className="grid gap-3">
          {WHO_WE_ARE.principles.map((p, i) => (
            <RevealItem key={p.title}>
              <Glass tint hover className={`flex gap-4 p-5 ${i % 2 ? 'ob-diag-r' : 'ob-diag-l'}`}>
                <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[var(--ob-blue)] text-white shadow-[0_8px_18px_-6px_rgba(18,87,192,.6)]">
                  <Icon name={p.icon} className="text-[22px]" />
                </span>
                <div>
                  <p className="text-[16px] font-bold tracking-[-0.01em]">{p.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--ob-body)]">{p.text}</p>
                </div>
              </Glass>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
