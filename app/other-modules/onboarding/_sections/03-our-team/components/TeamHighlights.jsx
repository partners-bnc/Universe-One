'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { OFFICE_NOTE } from '../content';
import { groupByDepartment } from '../useTeamMembers';
import { Counter } from '../../../_shared/ui';

// Three short columns under the photo ring, separated by thin dividers (live counts from HRM).
export default function TeamHighlights({ members, loading }) {
  const reduce = useReducedMotion();
  const departments = groupByDepartment(members).filter((d) => d.name !== 'Other');
  const columns = [
    { value: members.length, title: 'People on the team', text: 'Consultants, chartered accountants, technologists and specialists.' },
    { value: departments.length, title: 'Departments', text: departments.slice(0, 3).map((d) => d.name).join(', ') + (departments.length > 3 ? ' and more.' : '.') },
    { value: OFFICE_NOTE.count, title: 'Offices', text: OFFICE_NOTE.text },
  ];
  return (
    <div className="mx-auto grid w-full max-w-[960px] gap-4 sm:grid-cols-3 sm:gap-0">
      {columns.map((c, i) => (
        // animates on load (not on scroll): these sit at the very bottom of the first screen
        <motion.div
          key={c.title}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 + 0.1 * i, ease: [0.2, 0.7, 0.1, 1] }}
          className={`px-6 text-center ${i ? 'sm:border-l sm:border-[var(--ob-line)]' : ''}`}
        >
          <p className="text-[26px] font-bold leading-none tracking-[-0.04em]">
            {loading ? '–' : <Counter to={c.value} />}
          </p>
          <p className="mt-1.5 text-[14px] font-bold">{c.title}</p>
          <p className="mx-auto mt-1 max-w-[32ch] text-[12.5px] leading-snug text-[var(--ob-body)]">{loading ? ' ' : c.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
