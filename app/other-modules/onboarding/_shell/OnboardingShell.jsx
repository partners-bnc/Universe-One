'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useWorkspaceRouting } from '@/app/components-homepage/useWorkspaceRouting';
import { ONBOARDING_SECTIONS } from '../_sections';
import ComingSoon from './ComingSoon';
import { SectionMenu } from './SectionMenu';
import { OnboardingNavContext } from './navContext';
import { useOnboardingProgress } from './useOnboardingProgress';

const READ_EVENT = 'ob-read-change';
const subscribeRead = (cb) => {
  window.addEventListener('storage', cb);
  window.addEventListener(READ_EVENT, cb);
  return () => { window.removeEventListener('storage', cb); window.removeEventListener(READ_EVENT, cb); };
};
const readStore = (key) => {
  try { return window.localStorage.getItem(key) || '[]'; } catch { return '[]'; }
};

export default function OnboardingShell() {
  const { user } = useWorkspaceRouting();
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(ONBOARDING_SECTIONS.find((s) => s.available)?.id);
  const activeIndex = ONBOARDING_SECTIONS.findIndex((s) => s.id === activeId);
  const active = ONBOARDING_SECTIONS[activeIndex];
  const next = ONBOARDING_SECTIONS[activeIndex + 1];
  const View = active?.component;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // keep the whole page (including overscroll areas) white while onboarding is open
  useEffect(() => {
    const html = document.documentElement, body = document.body;
    const prev = [html.style.background, body.style.background];
    html.style.background = '#fff'; body.style.background = '#fff';
    return () => { html.style.background = prev[0]; body.style.background = prev[1]; };
  }, []);

  // sections the employee has marked as read: kept in this browser per user, and saved to onboarding_progress
  // (see ./useOnboardingProgress.js) so HR can track it and the ticks follow the employee to other browsers.
  const storeKey = `ob-read:${user?.id || user?.email || 'guest'}`;
  const savedRead = useSyncExternalStore(subscribeRead, () => readStore(storeKey), () => '[]');
  const localReadIds = useMemo(() => {
    try {
      const ids = JSON.parse(savedRead);
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  }, [savedRead]);
  const { completedSections, videoProgress, record } = useOnboardingProgress({ enabled: Boolean(user), localReadIds });
  const readIds = useMemo(() => [...new Set([...localReadIds, ...completedSections])], [localReadIds, completedSections]);
  // marking is one-way: once a section is read it stays read
  const markRead = (id) => {
    if (readIds.includes(id)) return;
    try { window.localStorage.setItem(storeKey, JSON.stringify([...readIds, id])); } catch { /* storage unavailable */ }
    window.dispatchEvent(new Event(READ_EVENT));
    record(`section:${id}`, 'complete');
  };

  // log that the employee opened the section (first / last opened, open count)
  useEffect(() => {
    if (activeId && ONBOARDING_SECTIONS.find((s) => s.id === activeId)?.available) record(`section:${activeId}`, 'open');
  }, [activeId, record]);

  const select = (id) => {
    if (id === activeId) return;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setActiveId(id);
  };

  return (
    <OnboardingNavContext.Provider value={{ activeId, select, user, readIds, markRead, recordProgress: record, videoProgress }}>
      <div className="ob relative" style={{ background: '#FFFFFF' }}>
        <div className="fixed left-4 top-4 z-50 md:left-6 md:top-6">
          <SectionMenu />
        </div>
        <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--ob-blue)]" style={{ scaleX: progress }} />
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 md:px-8">
          {/* each section closes and the next one opens as a full-width screen */}
          <AnimatePresence mode="wait">
            <motion.main
              key={activeId}
              className="min-w-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.985 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.1, 1] }}
            >
              {View ? (
                <View nextTitle={next?.title || 'the next section'} onNext={next?.available ? () => select(next.id) : undefined} />
              ) : (
                <ComingSoon section={active} />
              )}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </OnboardingNavContext.Provider>
  );
}
