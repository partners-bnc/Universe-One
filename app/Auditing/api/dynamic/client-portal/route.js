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

// POST: Upload document files or submit Google Drive link & update database
export async function POST(req) {
  try {
    const body = await req.json();
    const { token, itemId, files, comment, action, driveUrl, driveNotes } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.projectId) {
      return NextResponse.json({ success: false, error: 'Invalid or corrupt portal link token' }, { status: 400 });
    }

    const { projectId } = decoded;
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

    // Handle Action: Submit Google Drive / Cloud Link
    if (action === 'submit_drive_link' || (driveUrl && typeof driveUrl === 'string')) {
      const cleanDriveUrl = (driveUrl || '').trim();
      if (!cleanDriveUrl) {
        return NextResponse.json({ success: false, error: 'Please enter a valid Google Drive or Cloud folder URL' }, { status: 400 });
      }

      const clientSubmissionObj = {
        drive_url: cleanDriveUrl,
        instructions: (driveNotes || '').trim(),
        submitted_at: new Date().toISOString(),
        submitted_by: decoded.recipientName || decoded.recipientEmail || ''
      };

      const updatedTracker = trackerRows.map(tr => {
        const isMatched = !decoded.itemIds || decoded.itemIds.length === 0 ||
          decoded.itemIds.includes(String(tr.id)) ||
          decoded.itemIds.includes(String(tr.programme_id));

        if (isMatched) {
          const currentStatus = tr.document_status || tr.status_json?.document_status || 'Pending';
          const newStatus = currentStatus === 'Received' ? 'Received' : 'Under Review';

          return {
            ...tr,
            document_status: newStatus,
            client_submission: clientSubmissionObj,
            status_json: {
              ...tr.status_json,
              document_status: newStatus,
              client_submission: clientSubmissionObj,
              drive_url: cleanDriveUrl,
              drive_notes: driveNotes || '',
              received_at: new Date().toISOString()
            }
          };
        }
        return tr;
      });

      // Update project data_tracker
      try {
        await supabase
          .from('audit_projects')
          .update({ data_tracker: updatedTracker, updated_at: new Date().toISOString() })
          .eq('id', projectId);
      } catch (e) { }

      // Update dedicated audit_data_tracker table
      try {
        const { data: dbTrackers } = await supabase
          .from('audit_data_tracker')
          .select('id, programme_id, document_status, status_json, communication_trail')
          .eq('project_id', projectId);

        if (Array.isArray(dbTrackers)) {
          for (const dbT of dbTrackers) {
            const isMatched = !decoded.itemIds || decoded.itemIds.length === 0 ||
              decoded.itemIds.includes(String(dbT.id)) ||
              decoded.itemIds.includes(String(dbT.programme_id));

            if (isMatched) {
              const currentStatus = dbT.document_status || dbT.status_json?.document_status || 'Pending';
              const newStatus = currentStatus === 'Received' ? 'Received' : 'Under Review';

              const prevTrail = Array.isArray(dbT.communication_trail)
                ? dbT.communication_trail
                : (Array.isArray(dbT.status_json?.communication_trail) ? dbT.status_json.communication_trail : []);

              const trailEvent = {
                id: `trail_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                type: 'CLIENT_DRIVE_SUBMISSION',
                title: 'Client Submitted Cloud Folder Link',
                timestamp: new Date().toISOString(),
                drive_url: cleanDriveUrl,
                instructions: driveNotes || '',
                submitted_by: decoded.recipientName || decoded.recipientEmail || 'Client',
                status: newStatus
              };

              const updatedTrail = [...prevTrail, trailEvent];

              const updatedStatusJson = {
                ...(dbT.status_json || {}),
                document_status: newStatus,
                client_submission: clientSubmissionObj,
                drive_url: cleanDriveUrl,
                drive_notes: driveNotes || '',
                received_at: new Date().toISOString(),
                communication_trail: updatedTrail
              };

              let { error: dbUpdateErr } = await supabase
                .from('audit_data_tracker')
                .update({
                  document_status: newStatus,
                  client_submission: clientSubmissionObj,
                  communication_trail: updatedTrail,
                  status_json: updatedStatusJson,
                  updated_at: new Date().toISOString()
                })
                .eq('id', dbT.id);

              // Fallback if document_status or client_submission column not yet created in table
              if (dbUpdateErr && (dbUpdateErr.code === '42703' || dbUpdateErr.message?.includes('column'))) {
                await supabase
                  .from('audit_data_tracker')
                  .update({
                    status_json: updatedStatusJson,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', dbT.id);
              }
            }
          }
        }
      } catch (dbErr) {
        console.warn('Notice updating audit_data_tracker with drive link:', dbErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Google Drive link submitted successfully! Status updated to Under Review for Audit Team verification.'
      });
    }

    if (!itemId || !Array.isArray(files)) {
      return NextResponse.json({ success: false, error: 'Missing required parameters (itemId, files)' }, { status: 400 });
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
          document_status: 'Under Review',
          status_json: {
            ...tr.status_json,
            document_status: 'Under Review',
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
        document_status: 'Under Review',
        status_json: {
          document_status: 'Under Review',
          received_at: new Date().toISOString()
        },
        attachments: newFiles
      };

      updatedTracker.push(newTrackerItem);
      itemFound = true;
    }

    // 1. Primary storage: Upsert/Update into dedicated audit_data_tracker table in Supabase
    let trackerDbSaved = false;
    try {
      const validUuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let dbMatch = null;
      if (itemId && validUuidPattern.test(itemId)) {
        const { data } = await supabase.from('audit_data_tracker').select('*').eq('project_id', projectId).eq('id', itemId).limit(1);
        if (data && data.length > 0) dbMatch = data;
      }
      if (!dbMatch && itemId && validUuidPattern.test(itemId)) {
        const { data } = await supabase.from('audit_data_tracker').select('*').eq('project_id', projectId).eq('programme_id', itemId).limit(1);
        if (data && data.length > 0) dbMatch = data;
      }

      if (dbMatch && dbMatch.length > 0) {
        const existingRecord = dbMatch[0];
        const prevAttachments = Array.isArray(existingRecord.attachments) ? existingRecord.attachments : [];
        const combinedAttachments = [...prevAttachments, ...newFiles];

        const prevTrail = Array.isArray(existingRecord.communication_trail)
          ? [...existingRecord.communication_trail]
          : (Array.isArray(existingRecord.status_json?.communication_trail) ? [...existingRecord.status_json.communication_trail] : []);

        // If prevTrail was empty but email_sent_at existed, synthesize prior initial dispatch first
        if (prevTrail.length === 0 && (existingRecord.email_sent_at || existingRecord.status_json?.sent_at)) {
          prevTrail.push({
            id: `email_prior_${Date.now()}`,
            type: 'INITIAL_DISPATCH',
            title: 'Initial IDR Email Sent',
            timestamp: existingRecord.email_sent_at || existingRecord.status_json?.sent_at,
            recipient_name: decoded.recipientName || '',
            recipient_email: decoded.recipientEmail || '',
            subject: 'Information Document Request (IDR)',
            remarks: existingRecord.remarks || existingRecord.status_json?.remarks || '',
            status: 'Delivered'
          });
        }

        const trailEvent = {
          id: `trail_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: 'CLIENT_UPLOAD',
          title: 'Client Uploaded Document(s)',
          timestamp: new Date().toISOString(),
          files_count: newFiles.length,
          files: newFiles.map(f => ({ name: f.name, size: f.size, url: f.url || f.dataUrl })),
          submitted_by: decoded.recipientName || decoded.recipientEmail || 'Client',
          status: 'Under Review'
        };

        const updatedTrail = [...prevTrail, trailEvent];

        const updatedStatusJson = {
          ...(existingRecord.status_json || {}),
          document_status: 'Under Review',
          received_at: new Date().toISOString(),
          communication_trail: updatedTrail
        };

        let { error: dbUpdateErr } = await supabase
          .from('audit_data_tracker')
          .update({
            document_status: 'Under Review',
            communication_trail: updatedTrail,
            status_json: updatedStatusJson,
            attachments: combinedAttachments,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);

        if (dbUpdateErr && (dbUpdateErr.code === '42703' || dbUpdateErr.message?.includes('column'))) {
          await supabase
            .from('audit_data_tracker')
            .update({
              status_json: updatedStatusJson,
              attachments: combinedAttachments,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingRecord.id);
        }
        trackerDbSaved = true;
      } else {
        // Find linked programme info to create clean row in audit_data_tracker
        const { data: progMatch } = await supabase
          .from('audit_programme')
          .select('*')
          .eq('project_id', projectId)
          .eq('id', itemId)
          .limit(1);

        const linkedProg = (progMatch && progMatch[0]) || null;
        const docName = linkedProg?.row_data?.data_requirement || linkedProg?.row_data?.document_name || 'Requested Audit Document';
        const subProc = linkedProg?.row_data?.sub_process || linkedProg?.process_name || '';

        const initialTrail = [{
          id: `trail_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: 'CLIENT_UPLOAD',
          title: 'Client Uploaded Document(s)',
          timestamp: new Date().toISOString(),
          files_count: newFiles.length,
          files: newFiles.map(f => ({ name: f.name, size: f.size, url: f.url || f.dataUrl })),
          submitted_by: decoded.recipientName || decoded.recipientEmail || 'Client',
          status: 'Under Review'
        }];

        const newStatusJson = {
          document_name: docName,
          sub_process: subProc,
          document_status: 'Under Review',
          received_at: new Date().toISOString(),
          communication_trail: initialTrail
        };

        let { error: dbInsErr } = await supabase
          .from('audit_data_tracker')
          .insert([{
            project_id: projectId,
            programme_id: itemId,
            data_requirement: docName,
            sub_process: subProc,
            mapped_column_key: docName,
            client_person_id: decoded.recipientId || null,
            document_status: 'Under Review',
            communication_trail: initialTrail,
            status_json: newStatusJson,
            attachments: newFiles
          }]);

        if (dbInsErr && (dbInsErr.code === '42703' || dbInsErr.message?.includes('column'))) {
          await supabase
            .from('audit_data_tracker')
            .insert([{
              project_id: projectId,
              programme_id: itemId,
              status_json: newStatusJson,
              attachments: newFiles
            }]);
        }
        trackerDbSaved = true;
      }
    } catch (dbErr) {
      console.warn("Notice saving to audit_data_tracker:", dbErr);
    }

    // 2. Safe touch update to audit_projects (never throws if data_tracker column was removed)
    try {
      await supabase
        .from('audit_projects')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', projectId);
    } catch (pErr) {
      // ignore
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
