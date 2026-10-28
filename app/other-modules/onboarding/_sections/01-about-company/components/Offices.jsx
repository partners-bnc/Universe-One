'use client';

import { OFFICES, CONTACTS } from '../content';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, Reveal } from '../../../_shared/ui';

// Chapter 07 · Offices & contacts.
export default function Offices() {
  return (
    <section id="offices" className="scroll-mt-24">
      <ChapterHead index="07" eyebrow="Offices & contacts" title={['Where to ', <b key="b">find us.</b>]} />
      <div className="grid gap-4 lg:grid-cols-3">
        {OFFICES.map((o, i) => (
          <Reveal key={o.city} delay={i * 0.08}>
            <Glass tint hover className={`h-full p-6 md:p-7 ${i ? 'ob-diag-r' : 'ob-diag-l'}`}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--ob-blue)] text-white shadow-[0_8px_18px_-6px_rgba(18,87,192,.6)]">
                <Icon name="location_on" className="text-[22px]" />
              </span>
              <p className="mt-6 text-[26px] font-bold tracking-[-0.03em]">{o.city}</p>
              <p className="text-[14px] font-semibold text-[var(--ob-blue)]">{o.country} · <span className="font-medium text-[var(--ob-muted)]">{o.role}</span></p>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--ob-body)]">{o.address}</p>
            </Glass>
          </Reveal>
        ))}
        <Reveal delay={0.16}>
          <div className="h-full rounded-[28px_8px_28px_8px] bg-[var(--ob-navy)] p-6 text-white shadow-[0_30px_60px_-24px_rgba(13,27,61,.55)] md:p-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#7db4ff]">Contacts</p>
            <ul className="mt-4 divide-y divide-white/10">
              {CONTACTS.map((c) => (
                <li key={c.label} className="py-3 first:pt-1">
                  <p className="text-[12px] text-[#9aa8c7]">{c.label}</p>
                  <p className="mt-0.5 select-all break-words text-[14.5px] font-semibold">{c.value}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
