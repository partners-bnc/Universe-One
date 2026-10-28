'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../_shared/ui';
import { useOnboardingNav } from '../../../_shell/navContext';

const VIDEO_API = '/other-modules/onboarding/api/video/';
const SAVE_EVERY_MS = 15000;

// seconds actually played (skipped parts don't count)
function playedSeconds(video) {
  let total = 0;
  for (let i = 0; i < video.played.length; i += 1) total += video.played.end(i) - video.played.start(i);
  return total;
}

/**
 * 16:9 video area for one guide. The video comes from the private `onboarding-videos` bucket
 * (onboarding_steps.video_path, signed link from ../../../api/video/) or, as a fallback, from ../videos/<file>.
 * Until a video exists, a "Video coming soon" placeholder shows.
 * While it plays, how much was watched is saved to onboarding_progress (step `video:<guideId>`).
 */
export default function VideoSlot({ guideId, file, title }) {
  const { recordProgress } = useOnboardingNav();
  const key = `${guideId || ''}|${file || ''}`;
  const [status, setStatus] = useState({ key: '', url: '' });
  const videoRef = useRef(null);
  const lastSent = useRef({ at: 0, seconds: 0 });

  useEffect(() => {
    if (!guideId) return undefined;
    let alive = true;
    fetch(`${VIDEO_API}${guideId}${file ? `?file=${encodeURIComponent(file)}` : ''}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((result) => { if (alive) setStatus({ key, url: result?.url || '' }); })
      .catch(() => { if (alive) setStatus({ key, url: '' }); });
    return () => { alive = false; };
  }, [guideId, file, key]);

  const checking = Boolean(guideId) && status.key !== key;
  const url = status.key === key ? status.url : '';
  const stepId = `video:${guideId}`;

  const save = (force = false) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const seconds = Math.round(playedSeconds(video));
    const now = Date.now();
    if (seconds <= lastSent.current.seconds) return;
    if (!force && now - lastSent.current.at < SAVE_EVERY_MS) return;
    lastSent.current = { at: now, seconds };
    recordProgress?.(stepId, 'watch', { watchedSeconds: seconds, durationSeconds: Math.round(video.duration) });
  };

  // save the last bit when the guide closes or the tab is hidden
  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; });
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') saveRef.current(true); };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      saveRef.current(true);
    };
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-[var(--ob-navy)] shadow-[0_30px_60px_-34px_rgba(13,27,61,.65)]">
      {url ? (
        <video
          ref={videoRef}
          key={url}
          src={url}
          controls
          preload="metadata"
          playsInline
          controlsList="nodownload"
          className="h-full w-full bg-black object-contain"
          aria-label={`${title} — video walkthrough`}
          onPlay={() => recordProgress?.(stepId, 'open')}
          onTimeUpdate={() => save(false)}
          onPause={() => save(true)}
          onEnded={() => save(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          {/* quiet frame so the empty slot still looks deliberate */}
          <div className="pointer-events-none absolute inset-4 rounded-[16px] border border-dashed border-white/15" aria-hidden="true" />
          <div className="relative">
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 ${checking ? 'animate-pulse' : ''}`}>
              <Icon name="play_arrow" className="text-[34px]" />
            </span>
            {checking ? null : (
              <>
                <p className="mt-4 text-[17px] font-bold text-white">Video coming soon</p>
                <p className="mx-auto mt-1.5 max-w-[42ch] text-[13.5px] leading-relaxed text-[#b9c5de]">
                  This walkthrough is being recorded. Until it&rsquo;s here, follow the written steps below.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
