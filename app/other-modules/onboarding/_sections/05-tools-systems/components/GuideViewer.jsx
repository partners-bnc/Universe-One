'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import VideoSlot from './VideoSlot';
import { Glass, Icon } from '../../../_shared/ui';

const pad2 = (n) => String(n).padStart(2, '0');

function Where({ path }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 rounded-full bg-[#f2f6fc] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--ob-ink)] ring-1 ring-[#e3ebf7]">
      <Icon name="location_on" className="text-[16px] text-[var(--ob-blue)]" />
      {path.map((p, i) => (
        <span key={p} className="inline-flex items-center gap-1">
          {i ? <Icon name="chevron_right" className="text-[15px] text-[var(--ob-muted)]" /> : null}
          {p}
        </span>
      ))}
    </span>
  );
}

function Steps({ steps }) {
  return (
    <ol className="relative space-y-4">
      {/* the line joining the steps */}
      <span className="absolute bottom-6 left-[19px] top-6 w-px bg-[#dbe5f4]" aria-hidden="true" />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4">
          <span className="relative z-10 grid h-10 w-10 flex-none place-items-center rounded-full bg-white text-[13px] font-bold text-[var(--ob-blue)] ring-2 ring-[#cfe0f7]">{i + 1}</span>
          <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 ring-1 ring-[var(--ob-line)]">
            <p className="text-[15px] font-bold text-[var(--ob-ink)]">{s.title}</p>
            {s.text ? <p className="mt-1 text-[14px] leading-relaxed text-[var(--ob-body)]">{s.text}</p> : null}
            {s.points ? (
              <ul className="mt-2 space-y-1">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--ob-body)]">
                    <span className="mt-[9px] h-1 w-1 flex-none rounded-full bg-[var(--ob-blue)]" />
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Fields({ fields }) {
  return (
    <Glass className="rounded-[22px] p-5">
      <p className="mb-3 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--ob-muted)]">
        <Icon name="edit_note" className="text-[18px] text-[var(--ob-blue)]" /> The form
      </p>
      <div className="divide-y divide-dashed divide-[var(--ob-line)]">
        {fields.map((f) => (
          <div key={f.name} className="py-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] font-bold text-[var(--ob-ink)]">{f.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${f.required ? 'bg-[#fff1e6] text-[#b45309]' : 'bg-[#f2f5fa] text-[var(--ob-muted)]'}`}>
                {f.required ? 'Required' : 'Optional'}
              </span>
            </div>
            {f.note ? <p className="mt-0.5 text-[12.5px] leading-relaxed text-[var(--ob-muted)]">{f.note}</p> : null}
          </div>
        ))}
      </div>
    </Glass>
  );
}

function Note({ kind, items }) {
  const warn = kind === 'warn';
  return (
    <div className={`rounded-[22px] p-5 ring-1 ${warn ? 'bg-[#fffaf3] ring-[#f6e1c4]' : 'bg-[#f3f8ff] ring-[#dbe7fa]'}`}>
      <p className={`mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] ${warn ? 'text-[#b45309]' : 'text-[var(--ob-blue)]'}`}>
        <Icon name={warn ? 'warning' : 'lightbulb'} className="text-[18px]" /> {warn ? 'Watch out' : 'Good to know'}
      </p>
      <ul className="space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--ob-body)]">
            <span className={`mt-[9px] h-1 w-1 flex-none rounded-full ${warn ? 'bg-[#d97706]' : 'bg-[var(--ob-blue)]'}`} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One how-to guide: video (or placeholder), numbered steps, the form, what happens next and tips. */
export default function GuideViewer({ guide, index, total, moduleName, onPrev, onNext, prevTitle, nextTitle }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={guide.id}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0"
        aria-labelledby={`guide-${guide.id}`}
      >
        <p className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[var(--ob-blue)]">
          {moduleName} · Guide {pad2(index + 1)} of {pad2(total)}
        </p>
        <h3 id={`guide-${guide.id}`} className="mt-2 text-[clamp(28px,3vw,40px)] font-bold leading-[1.08] tracking-[-0.035em] text-[var(--ob-ink)]">{guide.title}</h3>
        <p className="mt-2 max-w-[70ch] text-[15.5px] leading-relaxed text-[var(--ob-body)]">{guide.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Where path={guide.where} />
          {guide.minutes ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[var(--ob-muted)] ring-1 ring-[var(--ob-line)]">
              <Icon name="schedule" className="text-[16px]" /> {guide.minutes} min read
            </span>
          ) : null}
        </div>

        <div className="mt-6"><VideoSlot guideId={guide.id} file={guide.video} title={guide.title} /></div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--ob-muted)]">
              <Icon name="format_list_numbered" className="text-[18px] text-[var(--ob-blue)]" /> Step by step
            </p>
            <Steps steps={guide.steps} />
          </div>
          <div className="space-y-4">
            {guide.fields?.length ? <Fields fields={guide.fields} /> : null}
            {guide.after ? (
              <div className="rounded-[22px] bg-[var(--ob-navy)] p-5 text-white">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-[#7db4ff]">
                  <Icon name="task_alt" className="text-[18px]" /> What happens next
                </p>
                <p className="text-[14px] leading-relaxed text-[#dbe6ff]">{guide.after}</p>
              </div>
            ) : null}
            {guide.tips?.length ? <Note kind="tip" items={guide.tips} /> : null}
            {guide.warnings?.length ? <Note kind="warn" items={guide.warnings} /> : null}
          </div>
        </div>

        {/* compact previous / next, side by side on the left */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {prevTitle ? (
            <button type="button" onClick={onPrev} title={prevTitle} className="group inline-flex items-center gap-1.5 rounded-full bg-white py-2 pl-2.5 pr-4 text-[13px] font-bold text-[var(--ob-ink)] ring-1 ring-[var(--ob-line)] transition hover:ring-[var(--ob-blue)]">
              <Icon name="arrow_back" className="text-[17px] transition group-hover:-translate-x-0.5" /> Previous
            </button>
          ) : null}
          {nextTitle ? (
            <button type="button" onClick={onNext} title={nextTitle} className="group inline-flex max-w-full items-center gap-1.5 rounded-full bg-[var(--ob-navy)] py-2 pl-4 pr-2.5 text-[13px] font-bold text-white transition hover:bg-[#16295a]">
              <span className="truncate">Next: {nextTitle}</span>
              <Icon name="arrow_forward" className="text-[17px] transition group-hover:translate-x-0.5" />
            </button>
          ) : null}
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
