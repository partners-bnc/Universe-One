'use client';

import { WEBSITES } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, Reveal } from '../../../_shared/ui';

// Chapter 08 · Official websites.
export default function Websites() {
  return (
    <section id="websites" className="scroll-mt-24">
      <ChapterHead index="08" eyebrow="Websites" title={['Official ', <b key="b">websites & pages.</b>]} text="The live websites are the current reference for public-facing details. Bookmark the ones relevant to your role." />
      <Reveal>
        <Glass orbs={false} className="ob-diag-l overflow-hidden">
          <ul className="divide-y divide-[var(--ob-line-2)]">
            {WEBSITES.map((w) => (
              <li key={w.url}>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="group grid gap-1 px-5 py-4 transition hover:bg-white/60 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-6 md:px-7">
                  <span className="text-[15px] font-bold">{w.name}</span>
                  <span className="text-[13.5px] text-[var(--ob-body)]">{w.covers}</span>
                  <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--ob-blue)]">
                    {w.url.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                    <Icon name="arrow_outward" className="text-[16px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Glass>
      </Reveal>
    </section>
  );
}
