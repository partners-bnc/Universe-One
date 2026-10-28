'use client';

import { CHAPTERS } from '../content';
import richTitle from '../../03-our-team/components/richTitle';
import ChapterHead from '../../../_shared/ChapterHead';
import { Glass, Icon, RevealGroup, RevealItem } from '../../../_shared/ui';

// Contact details on the left (a navy card), personal facts as tiles on the right.

function Contact({ icon, label, value, href }) {
  const body = (
    <>
      <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-white/10 text-[#7db4ff] ring-1 ring-white/15">
        <Icon name={icon} className="text-[20px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#8fa0c2]">{label}</span>
        <span className="mt-0.5 block text-[15px] [overflow-wrap:anywhere] font-semibold text-white">{value || 'Not on record'}</span>
      </span>
    </>
  );
  return value && href ? (
    <a href={href} className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white/5">{body}</a>
  ) : (
    <div className="flex items-center gap-4 p-2">{body}</div>
  );
}

export default function AboutYou({ data }) {
  const { profile: p } = data;
  const c = CHAPTERS.about;
  const facts = [
    { icon: 'flag', label: 'Nationality', value: p.nationality },
    { icon: 'favorite', label: 'Marital status', value: p.maritalStatus },
    { icon: 'badge', label: 'Login ID', value: p.code || p.email },
    { icon: 'category', label: 'Employee type', value: p.employeeType },
  ];
  return (
    <section>
      <ChapterHead index={c.index} eyebrow={c.eyebrow} title={richTitle(c.title)} text={c.text} />
      <RevealGroup className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <RevealItem>
          <div className="relative h-full overflow-hidden rounded-[28px_8px_28px_8px] bg-[var(--ob-navy)] p-6 shadow-[0_30px_60px_-30px_rgba(13,27,61,.6)] md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7db4ff]">How to reach you</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Contact icon="alternate_email" label="Work email" value={p.email} href={`mailto:${p.email}`} />
              <Contact icon="mail" label="Personal email" value={p.personalEmail} href={`mailto:${p.personalEmail}`} />
              <Contact icon="call" label="Phone" value={p.phone} href={`tel:${p.phone}`} />
              <Contact icon="home_pin" label="Address" value={p.address} />
            </div>
          </div>
        </RevealItem>
        <RevealItem>
          <div className="grid h-full grid-cols-2 gap-4">
            {facts.map((f) => (
              <Glass key={f.label} tint className="rounded-[22px] p-5">
                <Icon name={f.icon} className="text-[22px] text-[var(--ob-blue)]" />
                <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--ob-muted)]">{f.label}</p>
                <p className="mt-1 break-words text-[16px] font-bold text-[var(--ob-ink)]">{f.value || '—'}</p>
              </Glass>
            ))}
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
