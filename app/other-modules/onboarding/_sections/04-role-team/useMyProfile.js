'use client';

import { useEffect, useState } from 'react';

/** Loads the signed-in employee's role, reporting line, team and documents from ../../api/me. */
export default function useMyProfile() {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let alive = true;
    fetch('/other-modules/onboarding/api/me')
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || 'Could not load your profile.');
        return body;
      })
      .then((data) => { if (alive) setState({ data, loading: false, error: '' }); })
      .catch((err) => { if (alive) setState({ data: null, loading: false, error: err.message }); });
    return () => { alive = false; };
  }, []);
  return state;
}
