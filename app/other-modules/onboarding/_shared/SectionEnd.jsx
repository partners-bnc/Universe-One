'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useOnboardingNav } from '../_shell/navContext';
import { Icon, Reveal } from './ui';

/*
 * Closing card at the end of every section: "Mark as read" and "Continue to" the next section.
 * Marking is the employee's own choice: it is never done for them (Continue does not mark the section),
 * and once marked it stays marked. The three-dot menu then shows the section in green.
 */
export default function SectionEnd({ number, headline, nextTitle, onNext }) {
  const { activeId, readIds, markRead } = useOnboardingNav();
  const read = readIds.includes(activeId);
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[28px_8px_28px_8px] bg-[var(--ob-navy)] p-7 text-white shadow-[0_30px_60px_-24px_rgba(13,27,61,.55)] md:p-10">
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7db4ff]">End of section {number}</p>
            <p className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.03em] md:text-[32px]">{headline}</p>
            <p className="mt-2 text-[15px] text-[#b9c5de]">Next up: {nextTitle}{onNext ? '.' : ' (coming soon).'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => markRead(activeId)}
              disabled={read}
              aria-pressed={read}
              className={`ob-btn ${read ? 'cursor-default bg-[#0f9d63] text-white shadow-[0_10px_26px_rgba(15,157,99,.35)]' : 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15'}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={read ? 'done' : 'todo'}
                  className="inline-flex items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <Icon name={read ? 'task_alt' : 'check_circle'} className="text-[20px]" />
                  {read ? 'Marked as read' : 'Mark as read'}
                </motion.span>
              </AnimatePresence>
            </button>
            {onNext ? (
              <button type="button" onClick={onNext} className="ob-btn bg-white text-[var(--ob-navy)] hover:bg-[#e9f0ff]">
                Continue to {nextTitle} <Icon name="arrow_forward" className="text-[20px]" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
