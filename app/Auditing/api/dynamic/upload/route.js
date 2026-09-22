import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'auditing-documents';

async function ensureAuditingBucket() {
  try {
    const { data: buckets, error } = await adminClient.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some(b => b.name === BUCKET_NAME);
      if (!exists) {
        await adminClient.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 104857600 // 100MB
        });
      }
    }
  } catch (err) {
    console.warn("Could not automatically check/create auditing-documents bucket:", err);
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const projectId = formData.get('projectId') || 'general';
    const folder = formData.get('folder') || 'annexures';
    const rowId = formData.get('rowId') || '';

    // Collect all uploaded files (supports single and multiple)
    const files = formData.getAll('files');
    const singleFile = formData.get('file');
    const allFiles = [...files];
    if (singleFile && !allFiles.includes(singleFile)) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided for upload.' }, { status: 400 });
    }

    await ensureAuditingBucket();

    const uploadedResults = [];

    for (const file of allFiles) {
      if (!file || typeof file.arrayBuffer !== 'function') continue;

      const sanitizedName = (file.name || 'document').replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}_${sanitizedName}`;
      const storagePath = `projects/${projectId}/${folder}/${uniqueFileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: storageData, error: uploadError } = await adminClient.storage
        .from(BUCKET_NAME)
        .upload(storagePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true
        });

      if (uploadError) {
        console.error(`Failed to upload ${file.name} to bucket ${BUCKET_NAME}:`, uploadError);
        return NextResponse.json({
          success: false,
          error: `Storage upload failed for ${file.name}: ${uploadError.message}`
        }, { status: 500 });
      }

      const { data: urlData } = adminClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      const publicUrl = urlData?.publicUrl || '';

      uploadedResults.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: file.size,
        formatted_size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'application/octet-stream',
        storage_bucket: BUCKET_NAME,
        storage_path: storagePath,
        url: publicUrl,
        dataUrl: publicUrl,
        uploadedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      bucket: BUCKET_NAME,
      projectId,
      folder,
      rowId,
      files: uploadedResults
    });
  } catch (error) {
    console.error('Error in /Auditing/api/dynamic/upload:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { storagePaths, storagePath } = await req.json();
    const pathsToDelete = Array.isArray(storagePaths) ? storagePaths : (storagePath ? [storagePath] : []);

    if (pathsToDelete.length === 0) {
      return NextResponse.json({ success: false, error: 'No storage paths provided' }, { status: 400 });
    }

    const { data, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .remove(pathsToDelete);

    if (error) {
      console.error('Error deleting files from bucket:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (error) {
    console.error('Error in DELETE /Auditing/api/dynamic/upload:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
