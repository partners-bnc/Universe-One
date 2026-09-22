import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing supabase URL or service key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '20260908000000_create_dynamic_saas_audit_engine.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

async function applyMigration() {
  console.log("Applying Dynamic SaaS Audit Engine migration...");

  // Disable RLS or grant access for dev ease if needed
  const rlsBypassSql = sql + `
    ALTER TABLE public.audit_templates DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_projects DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_pre_execution_org DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_pre_execution_calendar DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_programme DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_data_tracker DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_upload_tokens DISABLE ROW LEVEL SECURITY;
  `;

  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: rlsBypassSql
  });

  if (error) {
    console.error("Migration via execute_sql error:", error.message);
  } else {
    console.log("Migration executed successfully:", data);
  }
}

applyMigration();
