import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const process_name = searchParams.get('process') || 'P2P Audit';

    const supabase = adminClient;

    // Fetch distinct process names saved in audit_programme for this project
    const { data: allProcsData } = await supabase
      .from('audit_programme')
      .select('process_name')
      .eq('project_id', projectId);

    const distinctProcesses = Array.from(new Set((allProcsData || []).map(r => r.process_name).filter(Boolean)));

    // Fetch Audit Programme steps for this process
    const { data: progRows, error: progError } = await supabase
      .from('audit_programme')
      .select('*')
      .eq('project_id', projectId)
      .eq('process_name', process_name)
      .order('sort_order', { ascending: true });

    // Fetch Data Tracker items from audit_data_tracker table
    const { data: dbTrackers, error: trackerError } = await supabase
      .from('audit_data_tracker')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    // Fetch project record for data_tracker, mom, testing, and custom_columns
    const { data: project } = await supabase
      .from('audit_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    let jsonTrackers = project?.data_tracker || [];
    if (typeof jsonTrackers === 'string') {
      try { jsonTrackers = JSON.parse(jsonTrackers); } catch (e) { jsonTrackers = []; }
    }

    let momData = project?.mom_data || {};
    if (typeof momData === 'string') {
      try { momData = JSON.parse(momData); } catch (e) { momData = {}; }
    }

    let momColumns = project?.mom_columns || [];
    if (typeof momColumns === 'string') {
      try { momColumns = JSON.parse(momColumns); } catch (e) { momColumns = []; }
    }

    let testingData = project?.testing_data || {};
    if (typeof testingData === 'string') {
      try { testingData = JSON.parse(testingData); } catch (e) { testingData = {}; }
    }

    let testingColumns = project?.testing_columns || [];
    if (typeof testingColumns === 'string') {
      try { testingColumns = JSON.parse(testingColumns); } catch (e) { testingColumns = []; }
    }

    let queriesData = project?.queries_data || project?.meta_json?.queries_data || {};
    if (typeof queriesData === 'string') {
      try { queriesData = JSON.parse(queriesData); } catch (e) { queriesData = {}; }
    }

    let queriesColumns = project?.queries_columns || project?.meta_json?.queries_columns || [];
    if (typeof queriesColumns === 'string') {
      try { queriesColumns = JSON.parse(queriesColumns); } catch (e) { queriesColumns = []; }
    }

    let customColumns = project?.custom_columns || project?.meta_json?.custom_columns || [];
    if (typeof customColumns === 'string') {
      try { customColumns = JSON.parse(customColumns); } catch (e) { customColumns = []; }
    }
    if (!Array.isArray(customColumns)) customColumns = [];

    // Auto-discover custom columns from actual audit_programme row_data
    const knownKeys = new Set([
      'serial_no', 'sub_process', 'objective', 'procedure', 'risk_rating',
      'key_risk', 'expected_key_control', 'data_requirement', 'assigned_to',
      'status', 'is_header', 'title', 'sort_order', '_comments_feed', 'is_substep',
      'parent_id', 'id', 'project_id', 'process_name', 'created_at', 'updated_at',
      'row_type', 'step', 'risk', 'observations_findings', 'comments',
      ...customColumns.map(c => c.key)
    ]);

    // Fetch all audit_programme rows for this project to resolve 1-to-1 data_requirement titles, sort orders, and custom columns
    const { data: allProgs } = await supabase
      .from('audit_programme')
      .select('id, process_name, sort_order, row_data')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    const progTitleMap = new Map();
    const progSortMap = new Map();

    (allProgs || []).forEach((p, pIdx) => {
      if (p && p.id) {
        const title = p.row_data?.data_requirement || p.row_data?.data_req || p.row_data?.document_name || p.row_data?.procedure || p.row_data?.sub_process;
        if (title) progTitleMap.set(String(p.id), title);
        progSortMap.set(String(p.id), p.sort_order ?? pIdx);
      }
    });

    (allProgs || []).forEach(p => {
      const rd = p.row_data;
      if (rd && typeof rd === 'object') {
        Object.keys(rd).forEach(k => {
          if (!knownKeys.has(k)) {
            knownKeys.add(k);
            const label = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            customColumns.push({
              key: k,
              label: label,
              type: k.includes('rating') || k.includes('risk') ? 'risk_rating' : k.includes('status') ? 'status' : k.includes('date') ? 'date' : 'text',
              width: 180
            });
          }
        });
      }
    });

    const combinedTracker = Array.isArray(dbTrackers) && dbTrackers.length > 0 ? dbTrackers : (Array.isArray(jsonTrackers) ? jsonTrackers : []);

    const enrichedCombinedTracker = combinedTracker.map((item, iIdx) => {
      const docTitle = item?.data_requirement || item?.status_json?.document_name || item?.mapped_column_key || progTitleMap.get(String(item?.programme_id)) || progTitleMap.get(String(item?.id)) || item?.procedure || 'Requested Audit Document';
      const subProc = item?.sub_process || item?.status_json?.sub_process || '';
      const rem = (item?.remarks !== null && item?.remarks !== undefined && item?.remarks !== '') ? item.remarks : (item?.status_json?.remarks || '');
      const plants = item?.plants_status || item?.status_json?.plants_status || {};
      const sortVal = progSortMap.get(String(item?.programme_id)) ?? progSortMap.get(String(item?.id)) ?? (1000 + iIdx);

      // Separate Document Status and Email Status
      const rawDocStatus = (item?.document_status && item?.document_status !== 'Email Sent') ? item.document_status : (item?.status_json?.document_status || 'Pending');
      const docStatus = rawDocStatus === 'Email Sent' ? 'Pending' : rawDocStatus;

      const emailStatus = item?.email_status || item?.status_json?.email_status || (item?.email_sent_at || item?.status_json?.sent_at || item?.status_json?.document_status === 'Email Sent' ? 'Email Sent' : 'Not Sent');
      const emailSentAt = item?.email_sent_at || item?.status_json?.sent_at || null;
      const clientSubmission = item?.client_submission || item?.status_json?.client_submission || (item?.status_json?.drive_url ? { drive_url: item.status_json.drive_url, instructions: item.status_json.drive_notes, submitted_at: item.status_json.received_at } : {});
      const commTrail = Array.isArray(item?.communication_trail) ? item.communication_trail : (Array.isArray(item?.status_json?.communication_trail) ? item.status_json.communication_trail : []);

      return {
        ...item,
        data_requirement: docTitle,
        sub_process: subProc,
        document_status: docStatus,
        email_status: emailStatus,
        email_sent_at: emailSentAt,
        client_submission: clientSubmission,
        communication_trail: commTrail,
        remarks: rem,
        plants_status: plants,
        _sort_order: sortVal
      };
    });

    // Strictly sort Data Tracker in chronological sequence matching Audit Programme
    enrichedCombinedTracker.sort((a, b) => a._sort_order - b._sort_order);

    return NextResponse.json({
      success: true,
      programme: progRows || [],
      data_tracker: enrichedCombinedTracker,
      all_processes: distinctProcesses,
      mom_data: momData,
      mom_columns: momColumns,
      testing_data: testingData,
      testing_columns: testingColumns,
      queries_data: queriesData,
      queries_columns: queriesColumns,
      custom_columns: customColumns
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { action, process_name, parent_id, is_substep, is_header, row_data, sort_order, row_id, data_tracker_id, client_person_id, mapped_key, items, mom_data, mom_columns, testing_data, testing_columns, queries_data, queries_columns, custom_columns, column_key } = body;

    const supabase = adminClient;

    if (action === 'save_mom') {
      const { data: proj } = await supabase.from('audit_projects').select('meta_json').eq('id', projectId).single();
      const existingMeta = proj?.meta_json || {};
      const updatePayload = {
        updated_at: new Date().toISOString(),
        mom_data: mom_data !== undefined ? mom_data : undefined,
        mom_columns: mom_columns !== undefined ? mom_columns : undefined,
        meta_json: {
          ...existingMeta,
          ...(mom_data !== undefined ? { mom_data } : {}),
          ...(mom_columns !== undefined ? { mom_columns } : {})
        }
      };

      const { error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId);

      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        delete updatePayload.mom_data;
        delete updatePayload.mom_columns;
        await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
      }

      return NextResponse.json({ success: true, mom_data, mom_columns });
    }

    if (action === 'save_testing') {
      const { data: proj } = await supabase.from('audit_projects').select('meta_json').eq('id', projectId).single();
      const existingMeta = proj?.meta_json || {};
      const updatePayload = {
        updated_at: new Date().toISOString(),
        testing_data: testing_data !== undefined ? testing_data : undefined,
        testing_columns: testing_columns !== undefined ? testing_columns : undefined,
        meta_json: {
          ...existingMeta,
          ...(testing_data !== undefined ? { testing_data } : {}),
          ...(testing_columns !== undefined ? { testing_columns } : {})
        }
      };

      const { error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId);

      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        delete updatePayload.testing_data;
        delete updatePayload.testing_columns;
        await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
      }

      return NextResponse.json({ success: true, testing_data, testing_columns });
    }

    if (action === 'save_queries') {
      const { data: proj } = await supabase.from('audit_projects').select('meta_json').eq('id', projectId).single();
      const existingMeta = proj?.meta_json || {};
      const updatePayload = { 
        updated_at: new Date().toISOString(),
        queries_data: queries_data !== undefined ? queries_data : undefined,
        queries_columns: queries_columns !== undefined ? queries_columns : undefined,
        meta_json: {
          ...existingMeta,
          ...(queries_data !== undefined ? { queries_data } : {}),
          ...(queries_columns !== undefined ? { queries_columns } : {})
        }
      };

      const { error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId);

      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        delete updatePayload.queries_data;
        delete updatePayload.queries_columns;
        await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
      }

      return NextResponse.json({ success: true, queries_data, queries_columns });
    }

    if (action === 'save_custom_columns') {
      const { data: proj } = await supabase.from('audit_projects').select('meta_json').eq('id', projectId).single();
      const existingMeta = proj?.meta_json || {};
      const updatePayload = {
        updated_at: new Date().toISOString(),
        custom_columns: custom_columns,
        meta_json: {
          ...existingMeta,
          custom_columns: custom_columns
        }
      };

      let { error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId);

      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        delete updatePayload.custom_columns;
        await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
      }

      return NextResponse.json({ success: true, custom_columns });
    }

    if (action === 'delete_custom_column') {
      if (column_key) {
        // Remove key from all audit_programme rows for this project
        const { data: pRows } = await supabase
          .from('audit_programme')
          .select('id, row_data')
          .eq('project_id', projectId);

        if (Array.isArray(pRows)) {
          for (const r of pRows) {
            if (r.row_data && r.row_data[column_key] !== undefined) {
              const updatedRowData = { ...r.row_data };
              delete updatedRowData[column_key];
              await supabase
                .from('audit_programme')
                .update({ row_data: updatedRowData })
                .eq('id', r.id);
            }
          }
        }

        // Update project custom_columns
        const { data: proj } = await supabase.from('audit_projects').select('custom_columns, meta_json').eq('id', projectId).single();
        let currentCols = proj?.custom_columns || proj?.meta_json?.custom_columns || [];
        if (typeof currentCols === 'string') {
          try { currentCols = JSON.parse(currentCols); } catch (e) { currentCols = []; }
        }
        const filteredCols = (currentCols || []).filter(c => c.key !== column_key);
        const existingMeta = proj?.meta_json || {};

        const updatePayload = {
          updated_at: new Date().toISOString(),
          custom_columns: filteredCols,
          meta_json: {
            ...existingMeta,
            custom_columns: filteredCols
          }
        };

        const { error } = await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
        if (error && (error.code === '42703' || error.message?.includes('column'))) {
          delete updatePayload.custom_columns;
          await supabase.from('audit_projects').update(updatePayload).eq('id', projectId);
        }

        return NextResponse.json({ success: true, custom_columns: filteredCols });
      }
    }

    if (action === 'create_step') {
      const isHdr = !!is_header || !!row_data?.is_header;
      const cleanRowData = { ...(row_data || {}), is_header: isHdr };

      let inserted = null;
      let insertErr = null;

      const res1 = await supabase
        .from('audit_programme')
        .insert([{
          project_id: projectId,
          process_name: process_name || 'P2P Audit',
          parent_id: parent_id || null,
          is_substep: !!is_substep,
          is_header: isHdr,
          row_data: cleanRowData,
          sort_order: sort_order || 0
        }])
        .select()
        .single();

      inserted = res1.data;
      insertErr = res1.error;

      // Fallback if is_header column is missing in DB schema cache
      if (insertErr && (insertErr.message?.includes('is_header') || insertErr.code === 'PGRST204')) {
        const res2 = await supabase
          .from('audit_programme')
          .insert([{
            project_id: projectId,
            process_name: process_name || 'P2P Audit',
            parent_id: parent_id || null,
            is_substep: !!is_substep,
            row_data: cleanRowData,
            sort_order: sort_order || 0
          }])
          .select()
          .single();

        inserted = res2.data;
        insertErr = res2.error;
      }

      if (insertErr) return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });

      // Auto-sync Data Requirement to Data Tracker if content exists
      const dataReqValue = cleanRowData?.data_requirement || cleanRowData?.[mapped_key || 'data_requirement'];
      if (dataReqValue && typeof dataReqValue === 'string' && dataReqValue.trim().length > 0) {
        await supabase.from('audit_data_tracker').insert([{
          project_id: projectId,
          programme_id: inserted.id,
          mapped_column_key: mapped_key || 'data_requirement',
          status_json: { document_status: 'Not Received', remarks: '' }
        }]);
      }

      return NextResponse.json({ success: true, item: inserted });
    }

    if (action === 'bulk_create_steps') {
      const itemsToInsert = (items || []).map((item, idx) => {
        const isHdr = !!item.is_header || item.row_type === 'header' || !!item.row_data?.is_header;
        const cleanRowData = typeof item.row_data === 'object' ? { ...item.row_data, is_header: isHdr } : { ...item, is_header: isHdr };
        return {
          project_id: projectId,
          process_name: process_name || 'P2P Audit',
          is_substep: !!item.is_substep,
          is_header: isHdr,
          row_data: cleanRowData,
          sort_order: item.sort_order ?? idx
        };
      });

      let inserted = null;
      let insertErr = null;

      const res1 = await supabase
        .from('audit_programme')
        .insert(itemsToInsert)
        .select();

      inserted = res1.data;
      insertErr = res1.error;

      // Fallback if is_header column is missing in DB schema cache
      if (insertErr && (insertErr.message?.includes('is_header') || insertErr.code === 'PGRST204')) {
        const fallbackItems = itemsToInsert.map(({ is_header, ...rest }) => rest);
        const res2 = await supabase
          .from('audit_programme')
          .insert(fallbackItems)
          .select();

        inserted = res2.data;
        insertErr = res2.error;
      }

      if (insertErr) return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });

      // Auto-sync Data Requirement to Data Tracker
      const trackerInserts = [];
      (inserted || []).forEach(row => {
        const dataReqValue = row.row_data?.data_requirement || row.row_data?.data_req;
        if (dataReqValue && typeof dataReqValue === 'string' && dataReqValue.trim().length > 0) {
          trackerInserts.push({
            project_id: projectId,
            programme_id: row.id,
            mapped_column_key: 'data_requirement',
            status_json: { document_status: 'Not Received', remarks: '' }
          });
        }
      });

      if (trackerInserts.length > 0) {
        await supabase.from('audit_data_tracker').insert(trackerInserts);
      }

      return NextResponse.json({ success: true, items: inserted });
    }

    if (action === 'update_step') {
      const { data: updated, error } = await supabase
        .from('audit_programme')
        .update({ row_data, updated_at: new Date().toISOString() })
        .eq('id', row_id)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

      // Check if data requirement was updated, sync to tracker
      const dataReqValue = row_data?.data_requirement || row_data?.[mapped_key || 'data_requirement'];
      if (dataReqValue && typeof dataReqValue === 'string' && dataReqValue.trim().length > 0) {
        const { data: existing } = await supabase.from('audit_data_tracker').select('id').eq('programme_id', row_id).limit(1);
        if (!existing || existing.length === 0) {
          await supabase.from('audit_data_tracker').insert([{
            project_id: projectId,
            programme_id: row_id,
            mapped_column_key: mapped_key || 'data_requirement',
            status_json: { document_status: 'Not Received', remarks: '' }
          }]);
        }
      }

      return NextResponse.json({ success: true, item: updated });
    }

    if (action === 'refetch_from_programme') {
      // 1. Fetch all audit programme rows for this project
      const { data: progs, error: pErr } = await supabase
        .from('audit_programme')
        .select('id, project_id, process_name, row_data, sort_order')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });

      if (pErr) return NextResponse.json({ success: false, error: pErr.message }, { status: 500 });

      // 2. Fetch existing tracker items to retain contacts/attachments if already set
      const { data: existingTrackers } = await supabase
        .from('audit_data_tracker')
        .select('*')
        .eq('project_id', projectId);

      const existingMap = new Map();
      (existingTrackers || []).forEach(t => {
        const docName = (t.data_requirement || t.status_json?.document_name || t.mapped_column_key || '').trim().toLowerCase();
        if (docName) existingMap.set(docName, t);
      });

      const seen = new Set();
      const toInsert = [];

      for (const p of (progs || [])) {
        const rd = p.row_data || {};
        const rawReq = rd.data_requirement || rd.data_req || rd.document_name || rd.documents;
        if (!rawReq || typeof rawReq !== 'string') continue;

        // Split multi-document strings by comma, semicolon, or newline
        const docs = rawReq.split(/[,;\n\r]+/).map(d => d.trim()).filter(d => d.length > 1);

        for (const doc of docs) {
          const lowerDoc = doc.toLowerCase();
          if (seen.has(lowerDoc)) continue;
          seen.add(lowerDoc);

          const existing = existingMap.get(lowerDoc);
          toInsert.push({
            project_id: projectId,
            programme_id: p.id,
            mapped_column_key: doc,
            client_person_id: existing?.client_person_id || null,
            status_json: {
              document_name: doc,
              sub_process: rd.sub_process || p.process_name || null,
              document_status: existing?.status_json?.document_status || 'Pending',
              remarks: existing?.remarks || existing?.status_json?.remarks || '',
              plants_status: existing?.plants_status || existing?.status_json?.plants_status || {}
            },
            attachments: existing?.attachments || []
          });
        }
      }

      // Delete existing records for this project and re-insert fresh
      await supabase.from('audit_data_tracker').delete().eq('project_id', projectId);

      let finalInserted = [];
      if (toInsert.length > 0) {
        const { data: inserted, error: insErr } = await supabase
          .from('audit_data_tracker')
          .insert(toInsert)
          .select();

        if (insErr) {
          return NextResponse.json({ success: false, error: insErr.message }, { status: 500 });
        }
        finalInserted = inserted || [];
      }

      return NextResponse.json({ success: true, count: finalInserted.length, items: finalInserted });
    }

    if (action === 'save_data_tracker' || action === 'update_tracker_person') {
      const trackerItems = body.data_tracker || body.items || [];

      if (trackerItems.length > 0) {
        // Safe attempt to update audit_projects if column exists, ignore if not
        try {
          await supabase
            .from('audit_projects')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', projectId);
        } catch (e) {
          // ignore
        }

        // Upsert to audit_data_tracker table in Supabase
        for (const item of trackerItems) {
          if (item && (item.id || item.programme_id)) {
            const rawDocStatus = item.document_status || item.status_json?.document_status || 'Pending';
            const docStatus = rawDocStatus === 'Email Sent' ? 'Pending' : rawDocStatus;
            const emailStatus = item.email_status || item.status_json?.email_status || (item.email_sent_at || item.status_json?.sent_at ? 'Email Sent' : 'Not Sent');
            const emailSentAt = item.email_sent_at || item.status_json?.sent_at || null;
            const clientSubmission = item.client_submission || item.status_json?.client_submission || (item.status_json?.drive_url ? { drive_url: item.status_json.drive_url, instructions: item.status_json.drive_notes, submitted_at: item.status_json.received_at } : {});
            const cleanRemarks = item.remarks !== undefined ? item.remarks : (item.status_json?.remarks || '');
            const commTrail = Array.isArray(item.communication_trail) ? item.communication_trail : (Array.isArray(item.status_json?.communication_trail) ? item.status_json.communication_trail : []);

            const statusPayload = {
              ...(item.status_json || {}),
              document_name: item.data_requirement || item.status_json?.document_name || item.mapped_column_key || '',
              sub_process: item.sub_process || item.status_json?.sub_process || '',
              document_status: docStatus,
              email_status: emailStatus,
              sent_at: emailSentAt,
              client_submission: clientSubmission,
              communication_trail: commTrail,
              remarks: cleanRemarks,
              plants_status: item.plants_status || item.status_json?.plants_status || {}
            };

            const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

            let existing = null;
            // 1. Try finding by direct ID if valid UUID
            if (isUuid(item.id)) {
              const { data: byId } = await supabase
                .from('audit_data_tracker')
                .select('id')
                .eq('project_id', projectId)
                .eq('id', item.id)
                .limit(1);
              if (byId && byId.length > 0) existing = byId;
            }

            // 2. Try finding by programme_id if valid UUID
            if (!existing && isUuid(item.programme_id)) {
              const { data: byProg } = await supabase
                .from('audit_data_tracker')
                .select('id')
                .eq('project_id', projectId)
                .eq('programme_id', item.programme_id)
                .limit(1);
              if (byProg && byProg.length > 0) existing = byProg;
            }

            // 3. Try finding by document requirement title
            if (!existing) {
              const reqTitle = (item.data_requirement || item.mapped_column_key || '').trim();
              if (reqTitle) {
                const { data: byTitle } = await supabase
                  .from('audit_data_tracker')
                  .select('id')
                  .eq('project_id', projectId)
                  .ilike('data_requirement', reqTitle)
                  .limit(1);
                if (byTitle && byTitle.length > 0) existing = byTitle;
              }
            }

            const rowPayload = {
              client_person_id: isUuid(item.client_person_id) ? item.client_person_id : null,
              data_requirement: item.data_requirement || item.mapped_column_key || 'Requested Audit Document',
              sub_process: item.sub_process || '',
              remarks: cleanRemarks,
              document_status: docStatus,
              email_status: emailStatus,
              email_sent_at: emailSentAt,
              client_submission: clientSubmission,
              communication_trail: commTrail,
              plants_status: item.plants_status || item.status_json?.plants_status || {},
              status_json: statusPayload,
              attachments: item.attachments || [],
              updated_at: new Date().toISOString()
            };

            if (existing && existing.length > 0) {
              let { error: updateErr } = await supabase
                .from('audit_data_tracker')
                .update(rowPayload)
                .eq('id', existing[0].id);

              // Fallback if specific columns not yet in DB schema cache
              if (updateErr && (updateErr.code === '42703' || updateErr.message?.includes('column'))) {
                await supabase
                  .from('audit_data_tracker')
                  .update({
                    client_person_id: isUuid(item.client_person_id) ? item.client_person_id : null,
                    status_json: statusPayload,
                    attachments: item.attachments || [],
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existing[0].id);
              }
            } else {
              const insertPayload = {
                project_id: projectId,
                programme_id: isUuid(item.programme_id) ? item.programme_id : (isUuid(item.id) ? item.id : null),
                mapped_column_key: item.data_requirement || item.mapped_column_key || 'data_requirement',
                ...rowPayload
              };

              let { error: insErr } = await supabase
                .from('audit_data_tracker')
                .insert([insertPayload]);

              if (insErr && (insErr.code === '42703' || insErr.message?.includes('column'))) {
                await supabase
                  .from('audit_data_tracker')
                  .insert([{
                    project_id: projectId,
                    programme_id: isUuid(item.programme_id) ? item.programme_id : (isUuid(item.id) ? item.id : null),
                    mapped_column_key: item.data_requirement || item.mapped_column_key || 'data_requirement',
                    client_person_id: isUuid(item.client_person_id) ? item.client_person_id : null,
                    status_json: statusPayload,
                    attachments: item.attachments || []
                  }]);
              }
            }
          }
        }
      }

      return NextResponse.json({ success: true, data_tracker: trackerItems });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const rowId = searchParams.get('rowId');

    if (!rowId) return NextResponse.json({ success: false, error: "Missing rowId" }, { status: 400 });

    const supabase = adminClient;
    const { error } = await supabase.from('audit_programme').delete().eq('id', rowId).eq('project_id', projectId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

