import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

const rpcNames = [
  'execute_sql',
  'exec_sql',
  'exec',
  'run_sql',
  'query',
  'sql_exec',
  'pg_execute',
  'execute'
];

async function testRpcs() {
  for (const name of rpcNames) {
    const { data, error } = await supabase.rpc(name, { query: 'SELECT 1;' });
    if (error && !error.message.includes('Could not find the function')) {
      console.log(`FOUND RPC '${name}'! Error message:`, error.message);
    } else if (!error) {
      console.log(`SUCCESS RPC '${name}'! Result:`, data);
    } else {
      console.log(`RPC '${name}' not found.`);
    }
  }
}

testRpcs();
