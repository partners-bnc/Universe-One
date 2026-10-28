'use client';

// Section 05 · Tools & Systems — entry point. Pick a platform in the hero; for Universe One pick a module,
// then work through its guides (video + written steps). Text and guides live in ./content.js.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PLATFORMS, SECTION_END } from './content';
import ToolsHero from './components/ToolsHero';
import ModuleGuides from './components/ModuleGuides';
import SectionEnd from '../../_shared/SectionEnd';
import { Icon, Reveal } from '../../_shared/ui';

/** Shown for a platform or module whose guides aren't written yet, with what they will cover. */
function ComingSoon({ name, planned }) {
  return (
    <Reveal>
      <div className="rounded-[28px] bg-[#f7f9fd] p-8 ring-1 ring-[#edf2fa] md:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[var(--ob-blue)] ring-1 ring-[#dbe7fa]"><Icon name="hourglass_top" className="text-[26px]" /></span>
        <p className="mt-5 text-[24px] font-bold tracking-[-0.02em] text-[var(--ob-ink)]">{name} guides are on the way.</p>
        <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-[var(--ob-body)]">They’ll work just like the HRMS guides: a short video and the same steps written out. Here’s what they will cover:</p>
        {planned?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {planned.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-[var(--ob-ink)] ring-1 ring-[var(--ob-line)]">
                <Icon name="radio_button_unchecked" className="text-[15px] text-[var(--ob-muted)]" /> {p}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export default function ToolsSystems({ nextTitle, onNext }) {
  const [platformId, setPlatformId] = useState(PLATFORMS[0].id);
  const [moduleId, setModuleId] = useState(PLATFORMS[0].modules[0].id);
  const platform = PLATFORMS.find((p) => p.id === platformId);
  const activeModule = platform.modules?.find((m) => m.id === moduleId) || platform.modules?.[0];

  const pickPlatform = (id) => {
    setPlatformId(id);
    const next = PLATFORMS.find((p) => p.id === id);
    if (next.modules) setModuleId(next.modules[0].id);
    const el = document.getElementById('tools-platform');
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  return (
    <div>
      <ToolsHero platforms={PLATFORMS} active={platformId} onPick={pickPlatform} />

      <div className="space-y-20 md:space-y-28">
        <section id="tools-platform" className="scroll-mt-6">
          {/* platform heading + module switcher */}
          <div className="mb-8 flex flex-col gap-5 border-b border-[var(--ob-line)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="ob-eyebrow">Platform</p>
              <h2 className="ob-h2 mt-3"><b>{platform.name}</b></h2>
              <p className="mt-2 max-w-[60ch] text-[15px] text-[var(--ob-body)]">{platform.tagline}</p>
            </div>
            {platform.modules ? (
              <div className="ob-scroll-x -mx-1 px-1">
                <div className="inline-flex gap-1 rounded-full bg-[#f2f6fc] p-1.5 ring-1 ring-[#e3ebf7]" role="tablist" aria-label={`${platform.name} modules`}>
                  {platform.modules.map((m) => {
                    const on = m.id === activeModule.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        onClick={() => setModuleId(m.id)}
                        className={`relative flex flex-none items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${on ? 'text-[var(--ob-ink)]' : 'text-[var(--ob-muted)] hover:text-[var(--ob-ink)]'}`}
                      >
                        {on ? <motion.span layoutId="ob-tools-module" className="absolute inset-0 rounded-full bg-white shadow-[0_6px_16px_-8px_rgba(13,27,61,.35)] ring-1 ring-[#dbe5f4]" transition={{ type: 'spring', stiffness: 420, damping: 36 }} /> : null}
                        <Icon name={m.icon} className="relative text-[18px]" />
                        <span className="relative whitespace-nowrap">{m.name}</span>
                        {!m.ready ? <span className="relative rounded-full bg-white px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[var(--ob-muted)] ring-1 ring-[#e3ebf7]">Soon</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {platform.modules ? (
            activeModule.ready ? <ModuleGuides key={activeModule.id} module={activeModule} /> : <ComingSoon name={activeModule.name} planned={activeModule.planned} />
          ) : (
            <ComingSoon name={platform.name} planned={platform.planned} />
          )}
        </section>

        <SectionEnd number={SECTION_END.number} headline={SECTION_END.headline} nextTitle={nextTitle} onNext={onNext} />
      </div>
    </div>
  );
}
