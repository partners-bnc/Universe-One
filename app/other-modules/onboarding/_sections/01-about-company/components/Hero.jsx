'use client';

import { FOUNDERS, LEADERS, PRACTICES, BRANDS, OFFICES } from '../content';
import HeroBackdrop from './HeroBackdrop';
import { Counter, Glass, Icon, Reveal, RevealGroup, RevealItem, SplitHeading } from '../../../_shared/ui';

// Full-screen opening: "Welcome to BNC Global Consultech.", the Begin button and the 4 KPI cards.
const SNAPSHOT = [
  { value: PRACTICES.length, label: 'Practice areas', note: 'From finance and audit to ESG, privacy and technology' },
  { value: BRANDS.length, label: 'Brands', note: 'BNC Global, Sustaind, BNC Data Privacy, BNC LEG and BNC Hiring' },
  { value: OFFICES.length, label: 'Offices', note: 'Gurugram, India and Riyadh, Saudi Arabia' },
  { value: FOUNDERS.length + LEADERS.length, label: 'Leaders', note: 'Founders and heads of practice' },
];

export default function Hero() {
  const begin = () => {
    const el = document.getElementById('overview');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <section className="relative flex min-h-[100svh] flex-col">
      <HeroBackdrop />
      <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center pt-20 text-center md:pt-24">
        <Reveal>
          <span className="ob-chip">
            <span className="h-2 w-2 rounded-full bg-[var(--ob-blue)] shadow-[0_0_0_4px_rgba(18,87,192,.15)]" />
            Onboarding · Section 01
          </span>
        </Reveal>
        <h1 className="mt-6 text-[clamp(40px,5.6vw,84px)] font-light leading-[1.04] tracking-[-0.045em]">
          <SplitHeading as="span" className="block">Welcome to</SplitHeading>
          <SplitHeading as="span" className="block">
            {[<b key="b" className="font-bold">BNC Global</b>, ' ', <em key="e" className="ob-shine font-bold not-italic text-[var(--ob-blue)]">Consultech.</em>]}
          </SplitHeading>
        </h1>
        <Reveal delay={0.3}>
          <p className="ob-lead mx-auto mt-5 max-w-[52ch]">
            We’re glad you’re here. Start your onboarding by getting to know who we are, what we do and how the company runs.
          </p>
        </Reveal>
        <Reveal delay={0.4} className="mt-7">
          <button type="button" onClick={begin} className="ob-btn ob-btn-primary">
            Begin <span className="ob-arrow-bob inline-grid"><Icon name="arrow_downward" className="text-[18px]" /></span>
          </button>
        </Reveal>
      </div>

      {/* company snapshot */}
      <div className="relative z-10 mx-auto mt-auto w-full max-w-[1200px] pb-10 pt-16 md:pb-14">
        <RevealGroup className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" stagger={0.08}>
          {SNAPSHOT.map((s, i) => (
            <RevealItem key={s.label}>
              <Glass tint hover className={`ob-card-shine h-full p-5 md:p-6 ${i % 2 ? 'ob-diag-r' : 'ob-diag-l'}`} style={{ '--shine-delay': `${2 + i * 0.18}s` }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ob-muted)]">{s.label}</p>
                <Counter to={s.value} className="mt-3 block text-[40px] font-bold leading-none tracking-[-0.04em] md:text-[48px]" />
                <p className="mt-3 text-[13px] leading-snug text-[var(--ob-body)]">{s.note}</p>
              </Glass>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
