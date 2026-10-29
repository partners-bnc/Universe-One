import { NextResponse } from 'next/server';
import { requirePdplActor } from '@/utils/auditing-pdpl';
import { seedDefaultTrackers } from '@/utils/auditing-static-tracker';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const seeded = await seedDefaultTrackers(auth.actor?.authUserId);
    return NextResponse.json({ success: true, count: seeded.length, trackers: seeded }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /Auditing/api/static-tracker/seed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed default trackers' },
      { status: 500 }
    );
  }
}

