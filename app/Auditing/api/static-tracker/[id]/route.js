import { NextResponse } from 'next/server';
import { requirePdplActor } from '@/utils/auditing-pdpl';
import {
  deleteStaticTracker,
  getStaticTrackerById,
  isMissingStaticTrackerSchemaError,
  updateStaticTracker,
} from '@/utils/auditing-static-tracker';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const { id } = await params;
    const tracker = await getStaticTrackerById(id);

    return NextResponse.json({ tracker }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /Auditing/api/static-tracker/[id]:', error);
    if (isMissingStaticTrackerSchemaError(error)) {
      return NextResponse.json(
        { error: 'Database table not found. Apply migration.' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch static tracker' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const updated = await updateStaticTracker(id, body, auth.actor);

    return NextResponse.json({ tracker: updated }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH /Auditing/api/static-tracker/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update static tracker' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const { id } = await params;
    await deleteStaticTracker(id, auth.actor);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /Auditing/api/static-tracker/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete static tracker' },
      { status: 500 }
    );
  }
}

