import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULTS = {
  show_greeting: true,
  show_date_card: true,
  show_attendance_notice: true,
  show_festive_decor: false,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await adminClient
      .from('hrm_home_settings')
      .select('show_greeting, show_date_card, show_attendance_notice, show_festive_decor')
      .eq('id', 1)
      .maybeSingle();

    // Missing table/row => safe defaults so the home page never breaks.
    return NextResponse.json({ settings: error || !data ? DEFAULTS : { ...DEFAULTS, ...data } });
  } catch {
    return NextResponse.json({ settings: DEFAULTS });
  }
}
