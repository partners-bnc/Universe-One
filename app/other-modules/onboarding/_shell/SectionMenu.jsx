'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ONBOARDING_SECTIONS } from '../_sections';
import { Glass, Icon } from '../_shared/ui';
import { useOnboardingNav } from './navContext';


/** Three-dot button that opens the section list (click, or hover on devices with a mouse). */
export function SectionMenu() {
  const { activeId, select, user, readIds } = useOnboardingNav();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const closeTimer = useRef(null);
  const reduce = useReducedMotion();
  const available = ONBOARDING_SECTIONS.filter((s) => s.available).length;
  const readCount = ONBOARDING_SECTIONS.filter((s) => s.available && readIds.includes(s.id)).length;
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const hoverOpen = () => { if (!canHover) return; clearTimeout(closeTimer.current); setOpen(true); };
  const hoverClose = () => { if (!canHover) return; closeTimer.current = setTimeout(() => setOpen(false), 220); };
  const name = user?.name || user?.email || '';

  return (
    <div ref={rootRef} className="relative flex-none" onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
      <Glass
        as="button"
        type="button"
        orbs={false}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? 'Close onboarding sections' : 'Open onboarding sections'}
        className="grid h-[46px] w-[46px] place-items-center rounded-full text-[var(--ob-ink)]"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.1, 1] }} className="grid place-items-center">
          <Icon name="more_horiz" className="text-[24px]" />
        </motion.span>
      </Glass>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.1, 1] }}
            style={{ transformOrigin: 'top left' }}
            className="absolute left-0 top-[calc(100%+10px)] z-50 w-[min(340px,calc(100vw-32px))]"
          >
            {/* the panel never runs past the bottom of the screen: header and footer stay, the section list scrolls */}
            <Glass className="ob-glass-solid ob-diag-l flex max-h-[calc(100svh-92px)] flex-col p-4 md:max-h-[calc(100svh-108px)]">
              <div className="flex-none px-2 pb-4 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ob-blue)]">Your onboarding</p>
                <p className="mt-2 text-[20px] font-bold leading-tight tracking-[-0.025em]">Getting started at BNC</p>
                <p className="mt-1.5 text-[13px] text-[var(--ob-muted)]">
                  {ONBOARDING_SECTIONS.length} sections · {available} available now
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgba(13,27,61,.07)]">
                    <motion.div
                      className="h-full rounded-full bg-[#0f9d63]"
                      initial={false}
                      animate={{ width: `${available ? (readCount / available) * 100 : 0}%` }}
                      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.1, 1] }}
                    />
                  </div>
                  <span className="flex-none text-[12px] font-bold text-[#0f7a4f]">{readCount} of {available} read</span>
                </div>
              </div>
              <nav className="ob-scroll-y -mx-2 -my-1 min-h-0 flex-1 space-y-1 px-2 py-1" aria-label="Onboarding sections">
                {ONBOARDING_SECTIONS.map((s, i) => {
                  const on = s.id === activeId;
                  const done = s.available && readIds.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      disabled={!s.available}
                      onClick={() => { setOpen(false); select(s.id); }}
                      aria-current={on ? 'step' : undefined}
                      className={`ob-step ${on ? 'is-active' : ''} ${done ? 'is-read' : ''}`}
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 * i }}
                    >
                      <span className="ob-step-num">
                        {done ? <Icon name="check" className="text-[19px]" /> : s.available ? s.number : <Icon name="lock" className="text-[17px]" />}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-[14.5px] font-bold leading-snug ${s.available ? '' : 'text-[var(--ob-muted)]'}`}>{s.title}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--ob-muted)]">{s.available ? s.description : 'Coming soon'}</span>
                        {done ? (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#e7f6ee] px-2 py-0.5 text-[11px] font-bold text-[#0f7a4f]">
                            <Icon name="task_alt" className="text-[14px]" /> Read
                          </span>
                        ) : null}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
              <div className="mt-3 flex flex-none items-center justify-between gap-2 border-t border-[var(--ob-line)] px-2 pt-3">
                <span className="min-w-0 truncate text-[12.5px] font-semibold text-[var(--ob-muted)]">{name}</span>
                <Link href="/other-modules" className="ob-chip flex-none transition hover:bg-white">
                  <Icon name="apps" className="text-[18px] text-[var(--ob-blue)]" />
                  All Modules
                </Link>
              </div>
            </Glass>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
