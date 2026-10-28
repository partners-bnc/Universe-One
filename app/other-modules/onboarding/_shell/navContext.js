'use client';

import { createContext, useContext } from 'react';

// Shared state from OnboardingShell: the active section, how to switch section, the user, which sections are read,
// recordProgress(stepId, event, extra) to save onboarding progress, and videoProgress ({ [guideId]: { pct, done } })
// for the guide video ticks (see ./useOnboardingProgress.js).
export const OnboardingNavContext = createContext(null);

export function useOnboardingNav() {
  const ctx = useContext(OnboardingNavContext);
  if (!ctx) throw new Error('useOnboardingNav must be used inside OnboardingShell');
  return ctx;
}
