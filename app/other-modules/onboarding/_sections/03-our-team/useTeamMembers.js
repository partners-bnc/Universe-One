'use client';

import { useEffect, useState } from 'react';

// Loads current employees (name, role, department, profile photo) from the onboarding team API.
export default function useTeamMembers() {
  const [state, setState] = useState({ members: [], loading: true, error: '' });
  useEffect(() => {
    let alive = true;
    fetch('/other-modules/onboarding/api/team', { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || 'Could not load the team');
        if (alive) setState({ members: body.members || [], loading: false, error: '' });
      })
      .catch((err) => alive && setState({ members: [], loading: false, error: err.message }));
    return () => { alive = false; };
  }, []);
  return state;
}

/** Groups members by department, largest first. Members without a department go under "Other". */
export function groupByDepartment(members) {
  const map = new Map();
  members.forEach((m) => {
    const key = m.department || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(m);
  });
  return [...map.entries()]
    .map(([name, people]) => ({ name, people }))
    .sort((a, b) => b.people.length - a.people.length || a.name.localeCompare(b.name));
}

export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}
