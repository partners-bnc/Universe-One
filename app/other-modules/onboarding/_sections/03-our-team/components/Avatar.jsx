'use client';

import { useState } from 'react';
import { initials } from '../useTeamMembers';

// Profile photo with an initials fallback (no photo, or the image fails to load).
export default function Avatar({ person, className = '', textClass = 'text-[13px]' }) {
  const [broken, setBroken] = useState(false);
  if (person.photo && !broken) {
    return <img src={person.photo} alt={person.name} loading="lazy" onError={() => setBroken(true)} className={`object-cover ${className}`} />;
  }
  return (
    <span className={`grid place-items-center bg-[#eaf1fd] font-bold text-[var(--ob-blue)] ${textClass} ${className}`} aria-label={person.name}>
      {initials(person.name)}
    </span>
  );
}
