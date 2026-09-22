import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

const candidateTables = [
  'auditing_pdpl_projects',
  'auditing_pdpl_controls',
  'auditing_pdpl_policies',
  'auditing_pdpl_documents',
  'auditing_cst_projects',
  'auditing_cst_gantt_tasks',
  'audit_templates',
  'audit_projects',
  'audit_programme',
  'audit_pre_execution_org',
  'audit_pre_execution_calendar',
  'audit_data_tracker',
  'crm_leads',
  'crm_lists',
  'hrm_employees',
  'hrm_profiles'
];

async function check() {
  console.log("Checking table existence in Supabase...");
  for (const table of candidateTables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table '${table}':`, error.message);
    } else {
      console.log(`✅ Table '${table}': Exists (rows: ${data.length})`);
    }
  }
}

check();
