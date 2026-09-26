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

const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '20260926000000_create_vendor_portal_and_profiles.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

async function applyMigration() {
  console.log("Applying Vendor Portal migration...");

  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: sql
  });

  if (error) {
    console.error("Migration via execute_sql error:", error.message);
  } else {
    console.log("Migration executed successfully:", data);
  }

  // Ensure storage bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some(b => b.name === 'vendor-portal-docs');
  if (!exists) {
    console.log("Creating vendor-portal-docs bucket...");
    const { error: bucketError } = await supabase.storage.createBucket('vendor-portal-docs', {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024 // 20 MB limit
    });
    if (bucketError) console.error("Bucket creation error:", bucketError);
    else console.log("Bucket created successfully.");
  } else {
    console.log("vendor-portal-docs bucket already exists.");
  }
}

applyMigration();
