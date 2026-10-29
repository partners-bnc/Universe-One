import { NextResponse } from 'next/server';
import { requirePdplActor } from '@/utils/auditing-pdpl';
import {
  removeStaticTrackerFile,
  uploadStaticTrackerFiles,
} from '@/utils/auditing-static-tracker';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const { id } = await params;
    const formData = await request.formData();

    const sectionType = formData.get('sectionType'); // 'ngo' or 'student'
    const questionId = formData.get('questionId');

    const files = formData.getAll('files').filter((entry) => entry instanceof File && entry.size > 0);
    const singleFile = formData.get('file');
    if (singleFile instanceof File && singleFile.size > 0 && !files.includes(singleFile)) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload.' }, { status: 400 });
    }

    const { updatedTracker, uploadedDocs } = await uploadStaticTrackerFiles({
      trackerId: id,
      sectionType,
      questionId,
      files,
      actor: auth.actor,
    });

    return NextResponse.json({
      success: true,
      tracker: updatedTracker,
      uploadedDocs,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /Auditing/api/static-tracker/[id]/upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requirePdplActor();
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const { sectionType, questionId, documentId } = body;

    const updated = await removeStaticTrackerFile({
      trackerId: id,
      sectionType,
      questionId,
      documentId,
      actor: auth.actor,
    });

    return NextResponse.json({ success: true, tracker: updated }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /Auditing/api/static-tracker/[id]/upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete document' },
      { status: 500 }
    );
  }
}

