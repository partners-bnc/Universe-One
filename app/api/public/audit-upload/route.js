import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, error: "Upload token is missing" }, { status: 400 });
    }

    const supabase = adminClient();

    // Fetch token record
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('audit_upload_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenRecord) {
      return NextResponse.json({ success: false, error: "Invalid or expired upload link token" }, { status: 404 });
    }

    // Check expiration (24 hours)
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: "This upload link has expired after 24 hours. Please request a new link from your auditor." }, { status: 410 });
    }

    // Fetch project details
    const { data: project } = await supabase
      .from('audit_projects')
      .select('project_name, client_name')
      .eq('id', tokenRecord.project_id)
      .single();

    // Fetch requested Data Tracker items
    let trackerItems = [];
    if (tokenRecord.data_tracker_ids && tokenRecord.data_tracker_ids.length > 0) {
      const { data: items } = await supabase
        .from('audit_data_tracker')
        .select('*')
        .in('id', tokenRecord.data_tracker_ids);
      trackerItems = items || [];
    } else {
      const { data: items } = await supabase
        .from('audit_data_tracker')
        .select('*')
        .eq('project_id', tokenRecord.project_id);
      trackerItems = items || [];
    }

    return NextResponse.json({
      success: true,
      project_name: project?.project_name || "Audit Project",
      client_name: project?.client_name || tokenRecord.client_email,
      client_email: tokenRecord.client_email,
      expires_at: tokenRecord.expires_at,
      tracker_items: trackerItems
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const token = formData.get('token');
    const trackerId = formData.get('trackerId');
    const file = formData.get('file');

    if (!token || !trackerId || !file) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = adminClient();

    // Verify token
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('audit_upload_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenRecord || new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: "Upload token is invalid or expired" }, { status: 403 });
    }

    // Upload file to Supabase Storage bucket 'auditing-documents'
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `client_uploads/${tokenRecord.project_id}/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { data: storageData, error: storageError } = await supabase.storage
      .from('auditing-documents')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true
      });

    let publicUrl = '';
    if (!storageError && storageData) {
      const { data: urlData } = supabase.storage.from('auditing-documents').getPublicUrl(filePath);
      publicUrl = urlData?.publicUrl || '';
    }

    // Update Data Tracker row
    const fileAttachment = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      url: publicUrl,
      uploadedAt: new Date().toISOString()
    };

    const { data: existingTracker } = await supabase
      .from('audit_data_tracker')
      .select('attachments, status_json')
      .eq('id', trackerId)
      .single();

    const currentAttachments = Array.isArray(existingTracker?.attachments) ? existingTracker.attachments : [];
    const newAttachments = [...currentAttachments, fileAttachment];

    const { data: updatedTracker, error: updateError } = await supabase
      .from('audit_data_tracker')
      .update({
        attachments: newAttachments,
        status_json: { ...(existingTracker?.status_json || {}), document_status: 'Received' },
        updated_at: new Date().toISOString()
      })
      .eq('id', trackerId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // Write audit trail log to audit_logs table
    try {
      await supabase.from('audit_logs').insert([{
        module_name: 'Data Tracker Public Portal',
        entity_type: 'CLIENT_UPLOAD',
        entity_id: tokenRecord.project_id || null,
        action: 'DOCUMENT_UPLOADED',
        actor_id: null,
        old_payload: null,
        new_payload: {
          tracker_id: trackerId,
          file_name: file.name,
          file_size: file.size,
          file_url: publicUrl,
          client_email: tokenRecord.client_email || ''
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
        user_agent: req.headers.get('user-agent') || 'Browser'
      }]);
    } catch (lErr) {
      console.warn("Notice: audit_logs insert in public upload:", lErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully!",
      attachment: fileAttachment,
      tracker: updatedTracker
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
