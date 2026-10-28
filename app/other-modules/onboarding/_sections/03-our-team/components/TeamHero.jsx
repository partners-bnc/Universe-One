'use client';

import { TEAM_HERO } from '../content';
import CurvedCarousel from './CurvedCarousel';
import TeamHighlights from './TeamHighlights';
import { Icon, Reveal, SplitHeading } from '../../../_shared/ui';

// One full screen: compact centred heading at the top, the curved photo circle in the middle and the
// three highlight columns at the bottom. The section label sits in the top-right corner.
export default function TeamHero({ members, loading, error }) {
  const toDirectory = () => {
    const el = document.getElementById('team-directory');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center gap-5 pb-6 pt-16 md:gap-7 md:pt-12">
      <Reveal className="absolute right-0 top-4 md:top-5">
        <span className="ob-chip text-[12px]">
          <span className="h-2 w-2 rounded-full bg-[var(--ob-blue)] shadow-[0_0_0_4px_rgba(18,87,192,.15)]" />
          {TEAM_HERO.eyebrow}
        </span>
      </Reveal>

      <div className="mx-auto flex max-w-[760px] flex-col items-center px-2 text-center">
        <h1 className="leading-[1.04] tracking-[-0.035em]">
          <SplitHeading as="span" className="ob-serif block text-[clamp(32px,3.6vw,54px)]">{TEAM_HERO.serifLine}</SplitHeading>
          <SplitHeading as="span" className="block text-[clamp(28px,3.1vw,46px)] font-bold">{TEAM_HERO.boldLine}</SplitHeading>
        </h1>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-[var(--ob-body)] md:text-[15.5px]">{TEAM_HERO.intro}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-4">
          <button type="button" onClick={toDirectory} className="inline-flex items-center gap-2.5 rounded-full bg-[var(--ob-navy)] py-2 pl-5 pr-2 text-[13.5px] font-bold text-white transition hover:bg-[#16295a]">
            {TEAM_HERO.cta}
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15"><Icon name="arrow_forward" className="text-[16px]" /></span>
          </button>
        </Reveal>
      </div>

      {/* the photo circle runs edge to edge */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        {error ? (
          <p className="py-16 text-center text-[14px] text-[var(--ob-muted)]">Team photos could not be loaded right now.</p>
        ) : (
          <CurvedCarousel people={members} loading={loading} />
        )}
      </div>

      <TeamHighlights members={members} loading={loading} />
    </section>
  );
}
