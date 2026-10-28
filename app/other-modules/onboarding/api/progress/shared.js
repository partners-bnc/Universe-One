import { createClient } from '@/utils/supabase/server';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';

// Helpers shared by the onboarding progress and video routes.

export const VIDEO_BUCKET = 'onboarding-videos';

/** The signed-in user and their HRM employee id (null when the login isn't linked to an employee). */
export async function getSignedInEmployee() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, employeeId: null };
  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  return { user, employeeId: authContext?.employee?.id || null };
}

/** True when the tracking tables haven't been created yet (migration not run). */
export function isMissingTable(error) {
  const code = String(error?.code || '');
  return code === '42P01' || code === 'PGRST205' || code === 'PGRST202' || /does not exist|could not find/i.test(String(error?.message || ''));
}
