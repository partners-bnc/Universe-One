'use client';

import './onboarding-styles.css';
import OnboardingShell from './_shell/OnboardingShell';

// Front-end only for now: no module-access gate or completion tracking yet.
// Login is still required — middleware protects every /other-modules route.
export default function OnboardingPage() {
  return <OnboardingShell />;
}
