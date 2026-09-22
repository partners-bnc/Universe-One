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

    let customColumns = project?.custom_columns || [];
    if (typeof customColumns === 'string') {
      try { customColumns = JSON.parse(customColumns); } catch (e) { customColumns = []; }
    }

    // Merge dbTrackers and jsonTrackers ensuring status & attachments updates are preserved
    const trackerMap = new Map();
    (jsonTrackers || []).forEach(item => {
      if (item && item.id) trackerMap.set(String(item.id), item);
    });
    (dbTrackers || []).forEach(item => {
      if (item && item.id) {
        const existing = trackerMap.get(String(item.id));
        trackerMap.set(String(item.id), { ...existing, ...item });
      }
    });

    const combinedTracker = Array.from(trackerMap.values());

    // Fetch all audit_programme rows for this project to resolve 1-to-1 data_requirement titles
    const { data: allProgs } = await supabase
      .from('audit_programme')
      .select('id, row_data')
      .eq('project_id', projectId);

    const progTitleMap = new Map();
    (allProgs || []).forEach(p => {
      if (p && p.id) {
        const title = p.row_data?.data_requirement || p.row_data?.document_name || p.row_data?.procedure || p.row_data?.sub_process;
        if (title) progTitleMap.set(String(p.id), title);
      }
    });

    const enrichedCombinedTracker = (combinedTracker.length > 0 ? combinedTracker : (jsonTrackers || [])).map(item => {
      const docTitle = item.data_requirement || progTitleMap.get(String(item.programme_id)) || progTitleMap.get(String(item.id)) || item.procedure || 'Requested Audit Document';
      return {
        ...item,
        data_requirement: docTitle
      };
    });

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
    const { action, process_name, parent_id, is_substep, is_header, row_data, sort_order, row_id, data_tracker_id, client_person_id, mapped_key, items, mom_data, mom_columns, testing_data, testing_columns, queries_data, queries_columns, custom_columns } = body;

    const supabase = adminClient;

    if (action === 'save_mom') {
      const updatePayload = { updated_at: new Date().toISOString() };
      if (mom_data !== undefined) updatePayload.mom_data = mom_data;
      if (mom_columns !== undefined) updatePayload.mom_columns = mom_columns;

      const { data, error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId)
        .select('mom_data, mom_columns')
        .single();

      if (error) {
        console.warn("Notice saving mom_data to audit_projects:", error.message);
      }

      return NextResponse.json({ success: true, mom_data, mom_columns });
    }

    if (action === 'save_testing') {
      const updatePayload = { updated_at: new Date().toISOString() };
      if (testing_data !== undefined) updatePayload.testing_data = testing_data;
      if (testing_columns !== undefined) updatePayload.testing_columns = testing_columns;

      const { data, error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId)
        .select('testing_data, testing_columns')
        .single();

      if (error) {
        console.warn("Notice saving testing_data to audit_projects:", error.message);
      }

      return NextResponse.json({ success: true, testing_data, testing_columns });
    }

    if (action === 'save_queries') {
      // Get existing meta_json
      const { data: proj } = await supabase
        .from('audit_projects')
        .select('meta_json')
        .eq('id', projectId)
        .single();

      const existingMeta = (proj && proj.meta_json) || {};
      const updatePayload = { 
        updated_at: new Date().toISOString(),
        meta_json: {
          ...existingMeta,
          queries_data,
          queries_columns
        }
      };

      const { error } = await supabase
        .from('audit_projects')
        .update(updatePayload)
        .eq('id', projectId);

      if (error) {
        console.warn("Notice saving queries to audit_projects:", error.message);
      }

      return NextResponse.json({ success: true, queries_data, queries_columns });
    }

    if (action === 'save_custom_columns') {
      const { data, error } = await supabase
        .from('audit_projects')
        .update({ custom_columns, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select('custom_columns')
        .single();

      if (error) {
        console.warn("Notice saving custom_columns:", error.message);
      }

      return NextResponse.json({ success: true, custom_columns });
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

    if (action === 'save_data_tracker' || action === 'update_tracker_person') {
      const trackerItems = body.data_tracker || body.items || [];

      // Update audit_projects.data_tracker JSON column
      if (trackerItems.length > 0) {
        await supabase
          .from('audit_projects')
          .update({ data_tracker: trackerItems, updated_at: new Date().toISOString() })
          .eq('id', projectId);

        // Upsert to audit_data_tracker table in Supabase
        for (const item of trackerItems) {
          if (item && (item.id || item.programme_id)) {
            const { data: existing } = await supabase
              .from('audit_data_tracker')
              .select('id')
              .eq('project_id', projectId)
              .or(`id.eq.${item.id},programme_id.eq.${item.programme_id || item.id}`)
              .limit(1);

            if (existing && existing.length > 0) {
              await supabase
                .from('audit_data_tracker')
                .update({
                  client_person_id: item.client_person_id || null,
                  status_json: item.status_json || { document_status: 'Pending' },
                  attachments: item.attachments || [],
                  updated_at: new Date().toISOString()
                })
                .eq('id', existing[0].id);
            } else {
              await supabase
                .from('audit_data_tracker')
                .insert([{
                  project_id: projectId,
                  programme_id: item.programme_id || item.id,
                  client_person_id: item.client_person_id || null,
                  status_json: item.status_json || { document_status: 'Pending' },
                  attachments: item.attachments || []
                }]);
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

