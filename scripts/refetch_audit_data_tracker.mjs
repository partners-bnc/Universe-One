import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function syncTracker() {
  console.log("Fetching all audit_programme rows to extract document requirements...");
  const { data: progs, error: pErr } = await supabase
    .from('audit_programme')
    .select('id, project_id, process_name, row_data, sort_order')
    .order('sort_order', { ascending: true });

  if (pErr) {
    console.error("Error fetching progs:", pErr);
    return;
  }

  // Fetch existing trackers to preserve existing client mappings / attachments / statuses if any
  const { data: existingTrackers } = await supabase
    .from('audit_data_tracker')
    .select('*');

  const existingMap = new Map();
  (existingTrackers || []).forEach(t => {
    const docName = (t.data_requirement || t.mapped_column_key || '').trim().toLowerCase();
    const key = t.project_id + '_' + docName;
    existingMap.set(key, t);
  });

  console.log(`Found ${progs.length} audit programme rows.`);
  console.log(`Found ${existingTrackers?.length || 0} existing tracker rows.`);

  const seenPerProject = new Set();
  const toInsert = [];

  for (const p of progs) {
    const rd = p.row_data || {};
    const rawReq = rd.data_requirement || rd.data_req || rd.document_name || rd.documents;
    if (!rawReq || typeof rawReq !== 'string') continue;

    // Split multi-document strings by comma, semicolon, or newline
    const docs = rawReq.split(/[,;\n\r]+/).map(d => d.trim()).filter(d => d.length > 1);

    for (const doc of docs) {
      const dedupKey = p.project_id + '_' + doc.toLowerCase();
      if (seenPerProject.has(dedupKey)) continue;
      seenPerProject.add(dedupKey);

      const existing = existingMap.get(dedupKey);
      toInsert.push({
        project_id: p.project_id,
        programme_id: p.id,
        mapped_column_key: 'data_requirement',
        data_requirement: doc,
        sub_process: rd.sub_process || p.process_name || null,
        client_person_id: existing?.client_person_id || null,
        status_json: existing?.status_json || { document_status: 'Pending', remarks: '' },
        remarks: existing?.remarks || '',
        plants_status: existing?.plants_status || {},
        attachments: existing?.attachments || []
      });
    }
  }

  console.log(`Extracted ${toInsert.length} distinct document requirements across all projects.`);

  // Clear existing tracker records and insert fresh extracted list
  const { error: delErr } = await supabase
    .from('audit_data_tracker')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (delErr) console.warn("Notice clearing old tracker rows:", delErr.message);

  if (toInsert.length > 0) {
    const { data: inserted, error: insErr } = await supabase
      .from('audit_data_tracker')
      .insert(toInsert)
      .select();

    if (insErr) {
      console.warn("Retrying with base schema fields into audit_data_tracker...", insErr.message);
      const fallbackItems = toInsert.map(item => ({
        project_id: item.project_id,
        programme_id: item.programme_id,
        mapped_column_key: item.data_requirement,
        client_person_id: item.client_person_id,
        status_json: {
          document_name: item.data_requirement,
          sub_process: item.sub_process,
          document_status: item.status_json?.document_status || 'Pending',
          remarks: item.remarks || '',
          plants_status: item.plants_status || {}
        },
        attachments: item.attachments || []
      }));

      const { data: fbInserted, error: fbErr } = await supabase
        .from('audit_data_tracker')
        .insert(fallbackItems)
        .select();

      if (fbErr) {
        console.error("Fallback insert error:", fbErr);
      } else {
        console.log(`✓ Successfully populated audit_data_tracker via base schema with ${fbInserted.length} unique document rows!`);
      }
    } else {
      console.log(`✓ Successfully populated audit_data_tracker with ${inserted.length} unique document rows!`);
    }
  }
}

syncTracker();
