import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase URL or Service Role Key in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const sql = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260921000000_add_mom_and_testing_to_audit_projects.sql'), 'utf-8');
  console.log("Applying SQL migration:\n", sql);

  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql });
    if (error) {
      console.log("Notice on execute_sql RPC:", error.message);
    } else {
      console.log("✓ Migration applied successfully via execute_sql RPC!");
    }
  } catch (err) {
    console.log("RPC exception:", err.message);
  }

  // Verify columns on audit_projects
  const { data: testData, error: testError } = await supabase
    .from('audit_projects')
    .select('id, mom_data, mom_columns, testing_data, testing_columns')
    .limit(1);

  if (testError) {
    console.log("Column select check:", testError.message);
  } else {
    console.log("✓ Successfully verified mom_data, mom_columns, testing_data, testing_columns columns in audit_projects!");
  }
}

run();
