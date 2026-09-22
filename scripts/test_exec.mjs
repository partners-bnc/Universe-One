import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '20260908000000_create_dynamic_saas_audit_engine.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

async function tryExec() {
  console.log("Testing SQL execution endpoints...");

  // Try endpoint 1: /rest/v1/rpc/execute_sql if service key can invoke postgres SQL query
  const res1 = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  console.log("Endpoint 1 status:", res1.status, await res1.text().catch(() => ''));

  // Try endpoint 2: Management API query endpoint
  const res2 = await fetch(`https://api.supabase.com/v1/projects/llfoaqnljjbneouiedbg/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  console.log("Endpoint 2 status:", res2.status, await res2.text().catch(() => ''));
}

tryExec();
