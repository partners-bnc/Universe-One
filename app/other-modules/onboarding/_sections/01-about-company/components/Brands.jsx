'use client';

import { BRANDS } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// Chapter 05 · Our brands.
export default function Brands() {
  const [core, ...rest] = BRANDS;
  return (
    <section id="brands" className="scroll-mt-24">
      <ChapterHead
        index="05" eyebrow="Our brands"
        title={['How the brands ', <b key="b">fit together.</b>]}
        text="Core business and finance services, specialist privacy and sustainability practices, and an ecosystem through which external partners collaborate and extend delivery."
      />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="relative h-full overflow-hidden rounded-[28px_8px_28px_8px] bg-[var(--ob-navy)] p-7 text-white shadow-[0_30px_60px_-24px_rgba(13,27,61,.55)] md:p-9">
            <span className="relative rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9cc8ff]">Core brand</span>
            <p className="relative mt-8 text-[34px] font-bold tracking-[-0.035em]">{core.name}</p>
            <p className="relative mt-3 max-w-[44ch] text-[16px] leading-relaxed text-[#b9c5de]">{core.focus}</p>
            <a href={core.url} target="_blank" rel="noopener noreferrer" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[var(--ob-navy)] transition hover:bg-[#e9f0ff]">
              Visit website <Icon name="arrow_outward" className="text-[18px]" />
            </a>
          </div>
        </Reveal>
        <RevealGroup className="grid gap-3">
          {rest.map((b, i) => (
            <RevealItem key={b.name}>
              <Glass tint hover className={`flex h-full items-center gap-4 p-5 ${i % 2 ? 'ob-diag-l' : 'ob-diag-r'}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] font-bold tracking-[-0.015em]">{b.name}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ob-body)]">{b.focus}</p>
                </div>
                {b.url ? (
                  <a href={b.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${b.name} website`} className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[var(--ob-navy)] text-white shadow-[0_6px_14px_rgba(13,27,61,.25)] transition hover:bg-[var(--ob-blue)]">
                    <Icon name="arrow_outward" className="text-[18px]" />
                  </a>
                ) : null}
              </Glass>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
