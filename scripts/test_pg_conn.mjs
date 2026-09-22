import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

// Read migration SQL
const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '20260908000000_create_dynamic_saas_audit_engine.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Also add RLS disable statements for dev simplicity
const rlsSql = sql + `
  ALTER TABLE IF EXISTS public.audit_templates DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_projects DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_pre_execution_org DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_pre_execution_calendar DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_programme DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_data_tracker DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS public.audit_upload_tokens DISABLE ROW LEVEL SECURITY;
`;

async function tryConnect() {
  const hosts = [
    'db.llfoaqnljjbneouiedbg.supabase.co',
    'aws-0-ap-south-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com'
  ];

  // Passwords to try if env has password
  const dbPassword = process.env.DATABASE_PASSWORD || process.env.SUPABASE_DB_PASSWORD || process.env.POSTGRES_PASSWORD;

  if (!dbPassword) {
    console.log("No explicit DATABASE_PASSWORD in env. Please check if executing direct API or CLI is possible.");
    return;
  }

  for (const host of hosts) {
    console.log(`Trying connection to ${host}...`);
    const client = new Client({
      host,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`Connected successfully to ${host}! Executing migration...`);
      await client.query(rlsSql);
      console.log("Migration executed cleanly!");
      await client.end();
      return;
    } catch (e) {
      console.log(`Failed to connect to ${host}:`, e.message);
    }
  }
}

tryConnect();
