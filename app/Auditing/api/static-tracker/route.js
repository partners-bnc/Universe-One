import { NextResponse } from 'next/server';
import { requirePdplActor } from '@/utils/auditing-pdpl';
import {
  createStaticTracker,
  isMissingStaticTrackerSchemaError,
  listStaticTrackers,
} from '@/utils/auditing-static-tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    let trackers = [];
    try {
      trackers = await listStaticTrackers();
    } catch (err) {
      if (isMissingStaticTrackerSchemaError(err)) {
        return NextResponse.json({
          setupPending: true,
          trackers: [],
          message: 'auditing_static_tracker table setup is pending. Please run the migration.',
        }, { status: 200 });
      }
      throw err;
    }

    return NextResponse.json({
      setupPending: false,
      actor: auth.actor,
      trackers,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /Auditing/api/static-tracker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch static trackers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const body = await request.json();
    const newTracker = await createStaticTracker(body, auth.actor);

    return NextResponse.json({ tracker: newTracker }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /Auditing/api/static-tracker:', error);
    if (isMissingStaticTrackerSchemaError(error)) {
      return NextResponse.json(
        { error: 'auditing_static_tracker table not created yet. Please apply migration.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create static tracker' },
      { status: 500 }
    );
  }
}

