'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { TOOLS_HERO } from '../content';
import { Icon, Reveal, RevealGroup, RevealItem, SplitHeading } from '../../../_shared/ui';

/** Opening screen: heading plus one card per platform; picking a card opens that platform below. */
export default function ToolsHero({ platforms, active, onPick }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center gap-10 pb-10 pt-20 md:pt-14">
      <Reveal className="absolute right-0 top-4 md:top-5">
        <span className="ob-chip text-[12px]">
          <span className="h-2 w-2 rounded-full bg-[var(--ob-blue)] shadow-[0_0_0_4px_rgba(18,87,192,.15)]" />
          {TOOLS_HERO.eyebrow}
        </span>
      </Reveal>

      <div className="mx-auto max-w-[820px] text-center">
        <h1 className="leading-[1.03] tracking-[-0.035em]">
          <SplitHeading as="span" className="ob-serif block text-[clamp(38px,4.4vw,68px)]">{TOOLS_HERO.serifLine}</SplitHeading>
          <SplitHeading as="span" className="block text-[clamp(34px,3.9vw,60px)] font-bold">{TOOLS_HERO.boldLine}</SplitHeading>
        </h1>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-[60ch] text-[16px] leading-relaxed text-[var(--ob-body)] md:text-[17px]">{TOOLS_HERO.intro}</p>
        </Reveal>
      </div>

      <RevealGroup className="mx-auto grid w-full max-w-[1100px] gap-4 md:grid-cols-3">
        {platforms.map((p, i) => {
          const on = p.id === active;
          return (
            <RevealItem key={p.id}>
              <motion.button
                type="button"
                onClick={() => onPick(p.id)}
                whileHover={reduce ? undefined : { y: -4 }}
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-white p-6 text-left transition-shadow ${on ? 'ring-2 ring-[var(--ob-blue)] shadow-[0_30px_60px_-34px_rgba(18,87,192,.55)]' : 'ring-1 ring-[var(--ob-line)] hover:ring-[var(--ob-blue)]'}`}
              >
                <span aria-hidden="true" className={`pointer-events-none absolute -bottom-8 right-2 text-[130px] font-extrabold leading-none tracking-[-0.06em] text-[#f1f5fb]`}>{String(i + 1).padStart(2, '0')}</span>
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex h-14 min-w-0 flex-1 items-center">
                    <Image src={p.logo} alt={`${p.name} logo`} className="h-auto max-h-14 w-auto max-w-[190px] object-contain" />
                  </div>
                  <span className={`flex-none rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${p.ready ? 'bg-[#e7f6ee] text-[#0f7a4f]' : 'bg-[#f2f5fa] text-[var(--ob-muted)]'}`}>
                    {p.ready ? 'Guides ready' : 'Coming soon'}
                  </span>
                </div>
                <p className="relative mt-5 text-[22px] font-bold tracking-[-0.02em] text-[var(--ob-ink)]">{p.name}</p>
                <p className="relative mt-1 text-[13.5px] leading-relaxed text-[var(--ob-muted)]">{p.tagline}</p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[var(--ob-blue)]">
                  {on ? 'Showing below' : 'Open'} <Icon name={on ? 'south' : 'arrow_forward'} className="text-[17px]" />
                </span>
              </motion.button>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
