'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CHAPTERS, DOCUMENT_SLOTS } from '../content';
import { formatDate, formatSize } from '../format';
import richTitle from '../../03-our-team/components/richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Icon, Reveal, RevealGroup, RevealItem } from '../../../_shared/ui';

// Document checklist: a progress ring for the required documents, then one tile per document
// (uploaded files open in a new tab; missing ones point to HRM, where they are uploaded).

const label = (key) => key.split('_').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

function Ring({ done, total }) {
  const reduce = useReducedMotion();
  const r = 52, len = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <div className="relative h-[136px] w-[136px] flex-none">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e8eef8" strokeWidth="9" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="9" strokeLinecap="round"
          stroke={pct >= 1 ? '#0f9d63' : 'var(--ob-blue)'}
          strokeDasharray={len}
          initial={reduce ? false : { strokeDashoffset: len }}
          whileInView={{ strokeDashoffset: len * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[30px] font-bold leading-none text-[var(--ob-ink)]">{done}<span className="text-[16px] text-[var(--ob-muted)]">/{total}</span></p>
          <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ob-muted)]">Required</p>
        </div>
      </div>
    </div>
  );
}

export default function Documents({ data }) {
  const c = CHAPTERS.documents;
  const byType = new Map();
  data.documents.forEach((d) => { if (!byType.has(d.type)) byType.set(d.type, d); });
  const known = new Set(DOCUMENT_SLOTS.map((s) => s.key));
  const slots = [
    ...DOCUMENT_SLOTS,
    ...[...byType.keys()].filter((k) => k && !known.has(k)).map((k) => ({ key: k, label: label(k), hint: 'Submitted document', required: false, icon: 'folder_open' })),
  ];
  const required = slots.filter((s) => s.required);
  const requiredDone = required.filter((s) => byType.has(s.key)).length;
  const uploaded = slots.filter((s) => byType.has(s.key)).length;

  return (
    <section>
      <ChapterHead index={c.index} eyebrow={c.eyebrow} title={richTitle(c.title)} text={c.text} />

      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-[28px] bg-[#f7f9fd] p-6 ring-1 ring-[#edf2fa] sm:flex-row sm:items-center md:p-8">
          <Ring done={requiredDone} total={required.length} />
          <div className="min-w-0 flex-1">
            <p className="text-[22px] font-bold tracking-[-0.02em] text-[var(--ob-ink)]">
              {requiredDone === required.length ? 'All required documents are in.' : `${required.length - requiredDone} required ${required.length - requiredDone === 1 ? 'document is' : 'documents are'} still missing.`}
            </p>
            <p className="mt-1.5 text-[14px] text-[var(--ob-body)]">
              {uploaded} of {slots.length} documents uploaded in total. Optional documents help HR complete your file.
            </p>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((s) => {
          const doc = byType.get(s.key);
          const meta = doc ? [formatSize(doc.size), formatDate(doc.uploaded)].filter(Boolean).join(' · ') : '';
          return (
            <RevealItem key={s.key}>
              <div className={`flex h-full flex-col rounded-[22px] p-5 transition ${doc ? 'bg-white shadow-[0_20px_40px_-32px_rgba(13,27,61,.5)] ring-1 ring-[var(--ob-line)]' : 'border border-dashed border-[#cfd9ea] bg-white/60'}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-11 w-11 flex-none place-items-center rounded-2xl ${doc ? 'bg-[#eef4fd] text-[var(--ob-blue)]' : 'bg-[#f2f5fa] text-[#9aa6bd]'}`}>
                    <Icon name={s.icon} className="text-[21px]" />
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${doc ? 'bg-[#e7f6ee] text-[#0f7a4f]' : s.required ? 'bg-[#fff1e6] text-[#b45309]' : 'bg-[#f2f5fa] text-[var(--ob-muted)]'}`}>
                    <Icon name={doc ? 'check_circle' : s.required ? 'error' : 'schedule'} className="text-[14px]" />
                    {doc ? 'Uploaded' : s.required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-bold text-[var(--ob-ink)]">{s.label}</p>
                <p className="mt-0.5 text-[12.5px] text-[var(--ob-muted)]">{s.hint}</p>
                <div className="mt-auto pt-4">
                  {doc ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f9fd] px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-[var(--ob-ink)]">{doc.name || 'Document'}</p>
                        {meta ? <p className="text-[11.5px] text-[var(--ob-muted)]">{meta}</p> : null}
                      </div>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex flex-none items-center gap-1 rounded-full bg-[var(--ob-navy)] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[var(--ob-blue)]">
                          Open <Icon name="open_in_new" className="text-[14px]" />
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-[12.5px] font-semibold text-[var(--ob-muted)]">Upload from HRM → My Profile → Documents</p>
                  )}
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
