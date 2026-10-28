'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

// Shared bits for the homepage dashboard previews (see ../DashboardPreview.jsx).

export const SCREEN_W = 1440; // every preview screen is drawn at this size and scaled to fit
export const SCREEN_H = 980;
export const EASE = [0.22, 1, 0.36, 1];

export const ordinal = (d) => (d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][d % 10] || 'th');

// greeting + dates follow the viewer's clock; the server renders without them so the first paint matches
let clientNow = null;
const noSubscribe = () => () => {};
export function useToday() {
  return useSyncExternalStore(noSubscribe, () => (clientNow ??= new Date()), () => null);
}

/** Counts up from 0 once the preview scrolls into view. */
export function CountUp({ value, start }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!start || reduce) return undefined;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduce]);
  return <>{(reduce ? value : shown).toLocaleString('en-IN')}</>;
}

