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

async function resetDataTracker() {
  console.log("Resetting Data Tracker statuses and tokens to Pending for end-to-end testing...");

  try {
    // 1. Reset all rows in audit_data_tracker table
    const { data: trackerRows, error: trackerErr } = await supabase
      .from('audit_data_tracker')
      .update({
        status_json: { document_status: 'Pending', remarks: '' },
        attachments: [],
        client_person_id: null,
        updated_at: new Date().toISOString()
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (trackerErr) {
      console.warn("Notice updating audit_data_tracker:", trackerErr.message);
    } else {
      console.log("✓ Reset audit_data_tracker table rows to Pending.");
    }

    // 2. Reset data_tracker JSON column in all audit_projects
    const { data: projects, error: projErr } = await supabase
      .from('audit_projects')
      .select('id, data_tracker');

    if (projects && projects.length > 0) {
      for (const proj of projects) {
        let tracker = proj.data_tracker || [];
        if (typeof tracker === 'string') {
          try { tracker = JSON.parse(tracker); } catch (e) { tracker = []; }
        }

        const resetTracker = (tracker || []).map(item => ({
          ...item,
          client_person_id: null,
          status_json: { document_status: 'Pending', remarks: '' },
          attachments: []
        }));

        await supabase
          .from('audit_projects')
          .update({ data_tracker: resetTracker, updated_at: new Date().toISOString() })
          .eq('id', proj.id);
      }
      console.log("✓ Reset data_tracker JSON column in audit_projects to Pending.");
    }

    // 3. Clear generated upload tokens from audit_upload_tokens
    const { error: deleteTokensErr } = await supabase
      .from('audit_upload_tokens')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteTokensErr) {
      console.warn("Notice clearing audit_upload_tokens:", deleteTokensErr.message);
    } else {
      console.log("✓ Cleared all test upload tokens from audit_upload_tokens.");
    }

    console.log("✓ All Data Tracker statuses reset to Pending successfully!");
  } catch (err) {
    console.error("Error resetting Data Tracker:", err);
  }
}

resetDataTracker();
