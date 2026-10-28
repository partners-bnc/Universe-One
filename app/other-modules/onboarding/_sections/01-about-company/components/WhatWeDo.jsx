'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PRACTICES } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Counter, Glass, Icon, Reveal } from '../../../_shared/ui';

// Chapter 04 · What we do: the six practice areas as tabs.
export default function WhatWeDo() {
  const [active, setActive] = useState(PRACTICES[0].id);
  const reduce = useReducedMotion();
  const p = PRACTICES.find((x) => x.id === active);
  return (
    <section id="what-we-do" className="scroll-mt-24">
      <ChapterHead
        index="04" eyebrow="What we do"
        title={['Six practices, ', <b key="b">organised around business needs.</b>]}
        text="Our services are organised around what clients need rather than one industry. Exact deliverables, geography and scope depend on each engagement."
      />
      <Reveal>
        <Glass orbs={false} className="inline-flex max-w-full rounded-full p-1.5">
          <div className="ob-scroll-x flex gap-1" role="tablist" aria-label="Practice areas">
            {PRACTICES.map((x) => {
              const on = x.id === active;
              return (
                <button key={x.id} type="button" role="tab" aria-selected={on} onClick={() => setActive(x.id)} className="ob-tab inline-flex items-center gap-2">
                  {on ? (
                    <motion.span layoutId="ob-practice-pill" className="absolute inset-0 -z-10 rounded-full bg-[var(--ob-navy)] shadow-[0_6px_16px_rgba(13,27,61,.25)]" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                  ) : null}
                  <Icon name={x.icon} className="text-[18px]" />
                  {x.short}
                </button>
              );
            })}
          </div>
        </Glass>
      </Reveal>

      <Glass className="ob-diag-r mt-5 p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
            className="grid gap-8 lg:grid-cols-[1fr_1.4fr]"
          >
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--ob-blue)] text-white shadow-[0_12px_24px_-8px_rgba(18,87,192,.6)]">
                <Icon name={p.icon} className="text-[28px]" />
              </span>
              {p.brand ? <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--ob-blue)]">Delivered through {p.brand}</p> : null}
              <h3 className={`${p.brand ? 'mt-2' : 'mt-6'} text-[26px] font-semibold leading-tight tracking-[-0.03em] md:text-[30px]`}>{p.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--ob-body)]">{p.summary}</p>
              {p.frameworks ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.frameworks.map((f) => <span key={f} className="ob-chip">{f}</span>)}
                </div>
              ) : null}
              {p.stats ? (
                <div className="mt-7 grid grid-cols-3 gap-2">
                  {p.stats.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/65 p-3 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgba(13,27,61,.05)]">
                      <Counter to={s.value} suffix={s.suffix} className="block text-[26px] font-bold tracking-[-0.03em] text-[var(--ob-blue)]" />
                      <span className="mt-1 block text-[11.5px] leading-snug text-[var(--ob-muted)]">{s.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="grid content-start gap-3 sm:grid-cols-2">
              {p.items.map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.2, 0.7, 0.1, 1] }}
                  className="group relative overflow-hidden rounded-2xl bg-white/60 p-5 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgba(13,27,61,.05)] transition hover:-translate-y-0.5 hover:bg-white/85"
                >
                  <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[var(--ob-blue)] transition-transform duration-500 group-hover:scale-x-100" />
                  <p className="text-[12px] font-bold text-[var(--ob-muted)]">{String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-3 text-[15.5px] font-bold tracking-[-0.01em]">{it.title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ob-body)]">{it.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Glass>
    </section>
  );
}
