'use client';

import { useCallback, useEffect, useState } from 'react';

// Server-side onboarding progress for the signed-in employee (tables: onboarding_steps / onboarding_progress).
// - loads which sections are completed and how much of each guide video was watched, so ticks follow the
//   employee across refreshes and browsers (videoProgress: { [guideId]: { pct, done } }, done = watched >= 90%)
// - record(stepId, event, extra) saves one event: 'open', 'complete' (sections) or 'watch' (videos)
// - copies "Mark as read" ticks saved in this browser before tracking existed, once
// If tracking isn't set up yet (migration not run / login not linked to an employee) everything is a no-op.

const API = '/other-modules/onboarding/api/progress';

function send(body) {
  return fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true, // lets the last video update finish while the page closes
  })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
}

export function useOnboardingProgress({ enabled, localReadIds }) {
  const [state, setState] = useState({ loaded: false, tracking: false, completedSections: [], videoProgress: {} });

  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    fetch(API, { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (!alive || !result) return;
        const completedSections = (result.progress || [])
          .filter((row) => row.completed_at && String(row.step_id).startsWith('section:'))
          .map((row) => String(row.step_id).slice('section:'.length));
        const videoProgress = {};
        (result.progress || [])
          .filter((row) => String(row.step_id).startsWith('video:'))
          .forEach((row) => {
            videoProgress[String(row.step_id).slice('video:'.length)] = { pct: Number(row.watched_pct) || 0, done: Boolean(row.completed_at) };
          });
        setState({ loaded: true, tracking: Boolean(result.tracking), completedSections, videoProgress });
      });
    return () => { alive = false; };
  }, [enabled]);

  // one-time copy of browser-only ticks to the server
  useEffect(() => {
    if (!state.tracking) return;
    const missing = localReadIds.filter((id) => !state.completedSections.includes(id));
    if (!missing.length) return;
    Promise.all(missing.map((id) => send({ stepId: `section:${id}`, event: 'complete' }))).then(() => {
      setState((current) => ({ ...current, completedSections: [...new Set([...current.completedSections, ...missing])] }));
    });
  }, [state.tracking, state.completedSections, localReadIds]);

  const record = useCallback((stepId, event, extra = {}) => {
    if (!enabled) return;
    send({ stepId, event, ...extra });
    // show video progress straight away (same rule as the database: completed at 90%, never goes down)
    if (event === 'watch' && stepId.startsWith('video:') && extra.durationSeconds > 0) {
      const id = stepId.slice('video:'.length);
      const pct = Math.min(100, (100 * (extra.watchedSeconds || 0)) / extra.durationSeconds);
      setState((current) => {
        const before = current.videoProgress[id] || { pct: 0, done: false };
        const next = { pct: Math.max(before.pct, pct), done: before.done || pct >= 90 };
        if (next.pct === before.pct && next.done === before.done) return current;
        return { ...current, videoProgress: { ...current.videoProgress, [id]: next } };
      });
    }
    if (event === 'complete' && stepId.startsWith('section:')) {
      const id = stepId.slice('section:'.length);
      setState((current) => (current.completedSections.includes(id) ? current : { ...current, completedSections: [...current.completedSections, id] }));
    }
  }, [enabled]);

  return { completedSections: state.completedSections, videoProgress: state.videoProgress, record };
}
