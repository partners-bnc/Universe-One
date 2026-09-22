import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

// Helper to decode token safely across base64, base64url, and URL encoding
function decodeToken(token) {
  if (!token) return null;
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch (err) {
    try {
      const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
      return JSON.parse(jsonStr);
    } catch (e) {
      try {
        const decodedUri = decodeURIComponent(token);
        return JSON.parse(Buffer.from(decodedUri, 'base64').toString('utf-8'));
      } catch (e2) {
        return null;
      }
    }
  }
}

// GET: Validate token & return requested document items for public portal
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.projectId) {
      return NextResponse.json({ success: false, error: 'Invalid or corrupt portal link token' }, { status: 400 });
    }

    const { projectId, recipientId, recipientName, recipientEmail, itemIds, createdAt } = decoded;

    // Portal Links are permanent (never expire)
    const tokenTime = typeof createdAt === 'number' ? createdAt : new Date(createdAt || Date.now()).getTime();
    const isExpired = false;
    const remainingMs = null;

    const supabase = adminClient;
    const { data: project, error } = await supabase
      .from('audit_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ success: false, error: 'Audit project engagement not found' }, { status: 404 });
    }

    // Parse programme rows & data tracker
    let progRows = project.programme_rows || [];
    if (typeof progRows === 'string') {
      try { progRows = JSON.parse(progRows); } catch (e) { progRows = []; }
    }

    let trackerRows = project.data_tracker || [];
    if (typeof trackerRows === 'string') {
      try { trackerRows = JSON.parse(trackerRows); } catch (e) { trackerRows = []; }
    }

    let orgMembers = project.organisation_structure || [];
    if (typeof orgMembers === 'string') {
      try { orgMembers = JSON.parse(orgMembers); } catch (e) { orgMembers = []; }
    }

    // Find Recipient details with multi-property lookup
    let recipient = (orgMembers || []).find(m =>
      String(m.id) === String(recipientId) ||
      (m.email && recipientEmail && m.email.toLowerCase() === recipientEmail.toLowerCase()) ||
      (m.member_name && recipientName && m.member_name.toLowerCase() === recipientName.toLowerCase())
    );

    if (!recipient) {
      recipient = {
        id: recipientId || 'client-recipient',
        member_name: recipientName || (recipientEmail && recipientEmail.includes('@') ? recipientEmail.split('@')[0] : 'Client Recipient'),
        email: recipientEmail || 'client@company.com',
        role: 'Contact Person'
      };
    }

    // Fetch audit_data_tracker & audit_programme from Supabase database tables for deep matching
    const [{ data: dbTrackers }, { data: dbProgs }] = await Promise.all([
      supabase.from('audit_data_tracker').select('*').eq('project_id', projectId),
      supabase.from('audit_programme').select('*').eq('project_id', projectId)
    ]);

    // Deduplicate tracker rows by programme_id / id so items never duplicate
    const trackerMap = new Map();
    (trackerRows || []).forEach(tr => {
      const key = String(tr.programme_id || tr.id);
      if (key) trackerMap.set(key, tr);
    });

    (dbTrackers || []).forEach(tr => {
      const key = String(tr.programme_id || tr.id);
      if (key) {
        const existing = trackerMap.get(key);
        trackerMap.set(key, {
          ...existing,
          ...tr,
          status_json: { ...(existing?.status_json || {}), ...(tr.status_json || {}) },
          attachments: (tr.attachments && tr.attachments.length > 0) ? tr.attachments : (existing?.attachments || [])
        });
      }
    });

    const deduplicatedTrackers = Array.from(trackerMap.values());
    const combinedProgs = [...progRows, ...(dbProgs || [])];
    const targetItemIds = Array.isArray(itemIds) && itemIds.length > 0 ? itemIds.map(String) : null;

    let matchedItems = [];

    if (targetItemIds && targetItemIds.length > 0) {
      // STRICT matching against only the requested items in the email token
      matchedItems = deduplicatedTrackers.filter(t => {
        return targetItemIds.includes(String(t.id)) || targetItemIds.includes(String(t.programme_id));
      });

      // Fallback: If any requested itemId is missing in data_tracker, resolve from combinedProgs
      const matchedKeys = new Set(matchedItems.map(m => String(m.programme_id || m.id)));
      const missingItemIds = targetItemIds.filter(id => !matchedKeys.has(id));

      if (missingItemIds.length > 0) {
        const extraProgItems = combinedProgs
          .filter(p => missingItemIds.includes(String(p.id)) || missingItemIds.includes(String(p.row_data?.serial_no)))
          .map(p => ({
            id: p.id,
            programme_id: p.id,
            data_requirement: p.row_data?.data_requirement || p.row_data?.document_name || 'Requested Audit Document',
            procedure: p.row_data?.procedure || '',
            sub_process: p.row_data?.sub_process || '',
            status_json: { document_status: 'Pending' },
            attachments: []
          }));

        matchedItems = [...matchedItems, ...extraProgItems];
      }
    } else {
      matchedItems = deduplicatedTrackers.filter(t => String(t.client_person_id) === String(recipientId));
    }

    const requestedItems = matchedItems.map(tr => {
      const linkedProg = combinedProgs.find(p => String(p.id) === String(tr.programme_id) || String(p.id) === String(tr.id));
      return {
        id: tr.id,
        programme_id: tr.programme_id,
        data_requirement: tr.data_requirement || linkedProg?.row_data?.data_requirement || linkedProg?.row_data?.document_name || 'Requested Audit Document',
        procedure: tr.procedure || linkedProg?.row_data?.procedure || linkedProg?.row_data?.sub_process || '',
        sub_process: tr.sub_process || linkedProg?.row_data?.sub_process || '',
        status: tr.status_json?.document_status || 'Pending',
        attachments: tr.attachments || [],
        client_person_id: tr.client_person_id
      };
    });

    return NextResponse.json({
      success: true,
      isExpired: false,
      remainingMs: null,
      createdAt: tokenTime,
      expiresAt: null,
      project: {
        id: project.id,
        project_name: project.project_name,
        client_name: project.client_name,
        financial_year: project.financial_year
      },
      recipient,
      requestedItems
    });
  } catch (err) {
    console.error('Error in client portal GET:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Upload document files for a requested item & update database
export async function POST(req) {
  try {
    const body = await req.json();
    const { token, itemId, files, comment } = body;

    if (!token || !itemId || !Array.isArray(files)) {
      return NextResponse.json({ success: false, error: 'Missing required parameters (token, itemId, files)' }, { status: 400 });
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.projectId) {
      return NextResponse.json({ success: false, error: 'Invalid or corrupt portal link token' }, { status: 400 });
    }

    const { projectId, createdAt } = decoded;



    const supabase = adminClient;
    const { data: project, error } = await supabase
      .from('audit_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ success: false, error: 'Audit project not found' }, { status: 404 });
    }

    let trackerRows = project.data_tracker || [];
    if (typeof trackerRows === 'string') {
      try { trackerRows = JSON.parse(trackerRows); } catch (e) { trackerRows = []; }
    }

    const BUCKET_NAME = 'auditing-documents';

    // Helper: Upload file base64 dataUrl directly to Supabase Storage Bucket
    const processFileUpload = async (fileObj) => {
      try {
        const rawDataUrl = fileObj.dataUrl || fileObj.url || '';
        if (!rawDataUrl) return fileObj;

        // If already a remote URL, keep as is
        if (rawDataUrl.startsWith('http://') || rawDataUrl.startsWith('https://')) {
          return {
            id: fileObj.id || `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: fileObj.name || 'Document File',
            size: fileObj.size || 0,
            type: fileObj.type || 'application/octet-stream',
            storage_bucket: BUCKET_NAME,
            url: rawDataUrl,
            dataUrl: rawDataUrl,
            uploadedAt: fileObj.uploadedAt || new Date().toISOString(),
            comment: comment || ''
          };
        }

        let buffer;
        let contentType = fileObj.type || 'application/octet-stream';

        if (rawDataUrl.startsWith('data:')) {
          const match = rawDataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            contentType = match[1];
            buffer = Buffer.from(match[2], 'base64');
          } else {
            const parts = rawDataUrl.split(',');
            buffer = Buffer.from(parts[1] || '', 'base64');
          }
        } else {
          buffer = Buffer.from(rawDataUrl, 'base64');
        }

        const sanitizedName = (fileObj.name || 'document').replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}_${sanitizedName}`;
        const storagePath = `projects/${projectId}/data-tracker/${uniqueFileName}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, buffer, {
            contentType: contentType,
            upsert: true
          });

        if (uploadErr) {
          console.warn('Storage upload error, keeping local fallback:', uploadErr.message);
          return {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            name: fileObj.name || 'Document File',
            size: fileObj.size || 0,
            type: contentType,
            dataUrl: rawDataUrl,
            url: rawDataUrl,
            uploadedAt: new Date().toISOString(),
            comment: comment || ''
          };
        }

        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        const publicUrl = urlData?.publicUrl || '';

        return {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: fileObj.name || 'Document File',
          size: fileObj.size || 0,
          type: contentType,
          storage_bucket: BUCKET_NAME,
          storage_path: storagePath,
          url: publicUrl,
          dataUrl: publicUrl,
          uploadedAt: new Date().toISOString(),
          comment: comment || ''
        };
      } catch (err) {
        console.error('Error processing client file upload:', err);
        return {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: fileObj.name || 'Document File',
          size: fileObj.size || 0,
          type: fileObj.type || 'application/octet-stream',
          dataUrl: fileObj.dataUrl || fileObj.url || '',
          url: fileObj.dataUrl || fileObj.url || '',
          uploadedAt: new Date().toISOString(),
          comment: comment || ''
        };
      }
    };

    const newFiles = await Promise.all(files.map(f => processFileUpload(f)));

    // Update target item in data_tracker
    let itemFound = false;
    const updatedTracker = trackerRows.map(tr => {
      if (String(tr.id) === String(itemId) || String(tr.programme_id) === String(itemId)) {
        itemFound = true;
        const existingFiles = tr.attachments || [];

        return {
          ...tr,
          status_json: {
            ...tr.status_json,
            document_status: 'Received',
            received_at: new Date().toISOString()
          },
          attachments: [...existingFiles, ...newFiles]
        };
      }
      return tr;
    });

    // Fallback: If item not found in trackerRows, extract details from audit_programme and create item!
    if (!itemFound) {
      let progRows = project.programme_rows || [];
      if (typeof progRows === 'string') {
        try { progRows = JSON.parse(progRows); } catch (e) { progRows = []; }
      }

      const { data: dbProgs } = await supabase.from('audit_programme').select('*').eq('project_id', projectId);
      const combinedProgs = [...progRows, ...(dbProgs || [])];
      const linkedProg = combinedProgs.find(p => String(p.id) === String(itemId) || String(p.row_data?.serial_no) === String(itemId));

      const newTrackerItem = {
        id: itemId,
        programme_id: linkedProg?.id || itemId,
        data_requirement: linkedProg?.row_data?.data_requirement || 'Requested Audit Document',
        procedure: linkedProg?.row_data?.procedure || '',
        sub_process: linkedProg?.row_data?.sub_process || '',
        client_person_id: decoded.recipientId || '',
        status_json: {
          document_status: 'Received',
          received_at: new Date().toISOString()
        },
        attachments: newFiles
      };

      updatedTracker.push(newTrackerItem);
      itemFound = true;
    }

    // Save back to audit_projects data_tracker JSON column
    const { error: updateErr } = await supabase
      .from('audit_projects')
      .update({ data_tracker: updatedTracker, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (updateErr) {
      throw updateErr;
    }

    // Also sync/upsert to audit_data_tracker table in Supabase
    for (const trItem of updatedTracker) {
      if (String(trItem.id) === String(itemId) || String(trItem.programme_id) === String(itemId)) {
        const { data: dbMatch } = await supabase
          .from('audit_data_tracker')
          .select('id')
          .eq('project_id', projectId)
          .or(`id.eq.${trItem.id},programme_id.eq.${trItem.programme_id || trItem.id}`)
          .limit(1);

        if (dbMatch && dbMatch.length > 0) {
          await supabase
            .from('audit_data_tracker')
            .update({
              status_json: trItem.status_json,
              attachments: trItem.attachments,
              updated_at: new Date().toISOString()
            })
            .eq('id', dbMatch[0].id);
        } else {
          await supabase
            .from('audit_data_tracker')
            .insert([{
              project_id: projectId,
              programme_id: trItem.programme_id || trItem.id,
              client_person_id: trItem.client_person_id || null,
              status_json: trItem.status_json,
              attachments: trItem.attachments
            }]);
        }
      }
    }

    // Mark upload token as used in audit_upload_tokens
    const tokenStr = token ? (typeof token === 'string' && token.length > 10 ? token : null) : null;
    if (tokenStr) {
      try {
        await supabase
          .from('audit_upload_tokens')
          .update({ is_used: true })
          .eq('token', tokenStr);
      } catch (tErr) {
        console.warn("Notice: audit_upload_tokens update:", tErr.message);
      }
    }

    // Write audit log entry to audit_logs table
    try {
      await supabase.from('audit_logs').insert([{
        module_name: 'Data Tracker Portal',
        entity_type: 'CLIENT_UPLOAD',
        entity_id: projectId,
        action: 'DOCUMENT_UPLOADED',
        actor_id: null,
        old_payload: null,
        new_payload: {
          itemId,
          uploaded_files_count: newFiles.length,
          files: newFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
          comment: comment || ''
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1',
        user_agent: req.headers.get('user-agent') || 'Browser'
      }]);
    } catch (lErr) {
      console.warn("Notice: audit_logs insert:", lErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully and document status updated to Received!',
      updatedTracker
    });
  } catch (err) {
    console.error('Error in client portal POST upload:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
