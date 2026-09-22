import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function checkTables() {
  console.log("Checking if audit_templates table exists...");
  const { data, error } = await supabase.from('audit_templates').select('*').limit(5);
  if (error) {
    console.log("audit_templates result:", error.message);
  } else {
    console.log("audit_templates data:", data);
  }
}

checkTables();
