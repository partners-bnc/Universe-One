'use client';

import { useEffect, useRef, useState } from 'react';
import { useOnboardingNav } from '../../_shell/navContext';

/*
 * Section 02 — About the Founders.
 * This is the BNC Global founders site (hero, founder profiles, practices, India–Saudi corridor,
 * industries, journey, credentials, partner program), kept as-is in ./site/ with its own images and
 * scripts (three.js, GSAP, Lenis). ../../founders-site/[...file]/route.js serves those files to the browser. It runs full screen in an iframe so its smooth
 * scrolling, pinned sections and 3D globe keep working without touching the rest of Universe One.
 * In the iframe the site hides its own top bar; the onboarding three-dot menu stays on top.
 * The site's closing section has this section's "Mark as read" and "Continue" buttons: they post a message here
 * ({ source: 'ob-founders', type: 'ready' | 'markRead' | 'next' }) and this page sends back the current state.
 */
export default function AboutFounders({ nextTitle, onNext }) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);
  const { activeId, readIds, markRead } = useOnboardingNav();
  const isRead = readIds.includes(activeId);

  // tell the site whether this section is read and where Continue goes
  const sync = () => {
    frameRef.current?.contentWindow?.postMessage(
      { source: 'ob-shell', isRead, nextTitle, hasNext: Boolean(onNext) },
      window.location.origin,
    );
  };
  useEffect(sync);

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow || e.data?.source !== 'ob-founders') return;
      if (e.data.type === 'ready') sync();
      if (e.data.type === 'markRead') markRead(activeId);
      if (e.data.type === 'next') onNext?.();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  return (
    <section aria-label="About the Founders" className="relative left-1/2 w-screen -translate-x-1/2 bg-white">
      {!loaded ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--ob-blue)] border-t-transparent" aria-label="Loading" />
        </div>
      ) : null}
      <iframe
        ref={frameRef}
        src="/other-modules/onboarding/founders-site/index.html"
        title="About the Founders"
        onLoad={() => { setLoaded(true); sync(); }}
        className={`block h-[100svh] w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </section>
  );
}
