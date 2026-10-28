'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import HrmScreen from './dashboard-preview/HrmScreen';
import TaskManagerScreen from './dashboard-preview/TaskManagerScreen';
import { EASE, SCREEN_H, SCREEN_W } from './dashboard-preview/shared';

/*
 * Hero preview: Universe One dashboards built in code (not screenshots) inside a Mac window.
 * The title bar shows "Universe One"; small arrow buttons (top right) switch between the HRM employee dashboard
 * and the super-admin Task Manager. It also moves to the next one on its own every few seconds
 * (paused while the pointer is over the window).
 * Each screen is drawn at a fixed SCREEN_W × SCREEN_H and scaled to fit, so it looks like a real screenshot at every size.
 */

const SCREENS = [
  { id: 'hrm', label: 'HRM', Screen: HrmScreen },
  { id: 'task-manager', label: 'Task Manager', Screen: TaskManagerScreen },
];
const AUTO_MS = 7000;

export default function DashboardPreview() {
  const reduce = useReducedMotion();
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const inView = useInView(boxRef, { margin: '0px 0px -15% 0px' });

  // draw the fixed-size screen and scale it to the space available
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const fit = () => setScale(el.clientWidth / SCREEN_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // move to the next dashboard on a timer while the preview is on screen
  useEffect(() => {
    if (paused || !inView || reduce) return undefined;
    const id = setTimeout(() => setActive((i) => (i + 1) % SCREENS.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, paused, inView, reduce]);

  const { Screen, label } = SCREENS[active];
  const go = (step) => setActive((i) => (i + step + SCREENS.length) % SCREENS.length);

  return (
    <div
      className="overflow-hidden rounded-3xl bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Mac window title bar with the dashboard switcher */}
      <div className="relative flex h-10 items-center border-b border-slate-200/80 bg-[#f6f7f9] px-4 md:h-11">
        <div className="flex gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/5" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/5" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/5" />
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-white px-3 py-1 text-[11.5px] font-semibold text-slate-600 ring-1 ring-slate-200 sm:text-[12px]">
          <span className="h-2 w-2 rounded-full bg-[#3170c5]" />
          Universe One
        </div>
        {/* previous / next dashboard */}
        <div className="ml-auto flex items-center gap-1.5">
          {[
            { step: -1, icon: 'chevron_left', label: 'Previous dashboard' },
            { step: 1, icon: 'chevron_right', label: 'Next dashboard' },
          ].map((b) => (
            <button
              key={b.step}
              type="button"
              onClick={() => go(b.step)}
              aria-label={b.label}
              className="grid h-6 w-6 place-items-center rounded-md bg-white text-slate-500 ring-1 ring-slate-200 transition hover:bg-[#3170c5] hover:text-white hover:ring-[#3170c5] active:scale-90"
            >
              <span className="material-symbols-outlined text-[16px]">{b.icon}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-[#f8f9fa]"
        style={{ height: scale ? SCREEN_H * scale : undefined, aspectRatio: scale ? undefined : `${SCREEN_W} / ${SCREEN_H}` }}
        role="img"
        aria-label={`Universe One ${label} dashboard preview`}
      >
        {scale ? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={active}
              className="absolute left-0 top-0 origin-top-left"
              style={{ width: SCREEN_W, height: SCREEN_H, scale }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: EASE }}
              aria-hidden="true"
            >
              <Screen start={inView} />
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
