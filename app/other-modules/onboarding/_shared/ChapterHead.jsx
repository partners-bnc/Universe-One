'use client';

import { Eyebrow, Reveal, SplitHeading } from './ui';

// Shared section heading (used by every section's chapters): eyebrow + title on the left, outlined chapter number on the right, intro text below.
export default function ChapterHead({ index, eyebrow, title, text }) {
  // heading runs the full width (fewer, wider lines); the chapter number sits on the right; any intro text goes underneath
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-end justify-between gap-6 border-b border-[var(--ob-line)] pb-6">
        <div className="min-w-0 flex-1">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SplitHeading className="ob-h2 mt-4 max-w-[30ch]">{title}</SplitHeading>
        </div>
        {index ? <span aria-hidden="true" className="ob-index">{index}</span> : null}
      </div>
      {text ? (
        <Reveal>
          <p className="ob-lead mt-6 max-w-[78ch]">{text}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
