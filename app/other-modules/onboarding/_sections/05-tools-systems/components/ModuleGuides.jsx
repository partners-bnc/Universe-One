'use client';

import { useRef, useState } from 'react';
import GuideViewer from './GuideViewer';
import { Icon } from '../../../_shared/ui';
import { useOnboardingNav } from '../../../_shell/navContext';

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * All guides of one module: a numbered list on the left (a scrollable strip on phones) and the open guide on the right.
 * A guide gets a green tick once its video has been watched (>= 90%, saved in onboarding_progress, so it survives a
 * refresh); a started video shows "x% watched".
 */
export default function ModuleGuides({ module }) {
  const { videoProgress = {} } = useOnboardingNav();
  const [active, setActive] = useState(0);
  const viewerRef = useRef(null);
  const guides = module.guides;
  const doneCount = guides.filter((g) => videoProgress[g.id]?.done).length;

  const open = (i) => {
    setActive(i);
    // bring the top of the guide into view if the reader had scrolled down
    const el = viewerRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-10">
      <nav aria-label={`${module.name} guides`} className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 hidden text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ob-muted)] lg:block">
          {guides.length} guides · {doneCount} completed
        </p>
        {/* padding on every side so the cards' borders and shadow are never clipped by the scroll area */}
        <div className="ob-scroll-x -mx-1.5 flex gap-2 px-1.5 py-1.5 lg:flex-col lg:gap-2">
          {guides.map((g, i) => {
            const on = i === active;
            const progress = videoProgress[g.id];
            const done = Boolean(progress?.done);
            const started = !done && progress?.pct > 0;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => open(i)}
                aria-current={on ? 'step' : undefined}
                className={`group flex flex-none items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition lg:w-full ${on ? 'bg-[var(--ob-navy)] text-white shadow-[0_16px_30px_-18px_rgba(13,27,61,.7)]' : 'bg-[#f8fafd] ring-1 ring-[#e1e9f5] hover:bg-white hover:ring-[var(--ob-blue)] hover:shadow-[0_10px_24px_-18px_rgba(13,27,61,.45)]'}`}
              >
                <span
                  className={`grid h-9 w-9 flex-none place-items-center rounded-xl text-[12px] font-bold ${done ? (on ? 'bg-[#22a06b] text-white' : 'bg-[#e7f6ee] text-[#0f7a4f]') : on ? 'bg-white/12 text-white' : 'bg-[#f2f6fc] text-[var(--ob-blue)]'}`}
                  title={done ? 'Video watched' : started ? `${Math.round(progress.pct)}% watched` : 'Not watched yet'}
                >
                  {done ? <Icon name="check" className="text-[18px]" /> : pad2(i + 1)}
                </span>
                <span className="min-w-0">
                  <span className={`block whitespace-nowrap text-[14px] font-bold lg:whitespace-normal ${on ? 'text-white' : 'text-[var(--ob-ink)]'}`}>{g.title}</span>
                  <span className={`hidden text-[12px] leading-snug lg:block ${on ? 'text-[#b9c5de]' : 'text-[var(--ob-muted)]'}`}>
                    {g.short}
                    {done ? <span className={`mt-0.5 block font-semibold ${on ? 'text-[#7fe0b0]' : 'text-[#0f7a4f]'}`}>Video watched</span> : null}
                    {started ? <span className={`mt-0.5 block font-semibold ${on ? 'text-[#f5c46f]' : 'text-[#b26a00]'}`}>{Math.round(progress.pct)}% watched</span> : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div ref={viewerRef} className="min-w-0">
        <GuideViewer
          guide={guides[active]}
          index={active}
          total={guides.length}
          moduleName={module.name}
          prevTitle={guides[active - 1]?.title}
          nextTitle={guides[active + 1]?.title}
          onPrev={() => open(active - 1)}
          onNext={() => open(active + 1)}
        />
      </div>
    </div>
  );
}
