'use client';

import { Glass, Icon } from '../_shared/ui';

// Placeholder screen for sections that are listed but not built yet.
export default function ComingSoon({ section }) {
  return (
    <div className="pt-20">
      <Glass className="ob-diag-l grid min-h-[70vh] place-items-center p-10 text-center">
        <div>
          <Icon name={section.icon} className="text-[44px] text-[var(--ob-blue)]" />
          <p className="mt-4 text-[26px] font-bold tracking-[-0.03em]">{section.title}</p>
          <p className="mt-2 text-[var(--ob-muted)]">This section is coming soon.</p>
        </div>
      </Glass>
    </div>
  );
}
