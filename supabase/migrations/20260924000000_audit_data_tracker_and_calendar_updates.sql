-- ==============================================================================
-- Migration: Clean Schema & Populate Dedicated Audit Data Tracker Table
-- Date: 2026-09-24
-- ==============================================================================

-- 1. Remove redundant JSON data_tracker column from public.audit_projects
ALTER TABLE IF EXISTS public.audit_projects 
DROP COLUMN IF EXISTS data_tracker;

-- 2. Ensure activity_date exists on audit_pre_execution_calendar (without default date)
ALTER TABLE IF EXISTS public.audit_pre_execution_calendar 
ADD COLUMN IF NOT EXISTS activity_date date;

-- 3. Ensure dedicated audit_data_tracker table has all necessary columns
ALTER TABLE IF EXISTS public.audit_data_tracker 
ADD COLUMN IF NOT EXISTS data_requirement text,
ADD COLUMN IF NOT EXISTS sub_process text,
ADD COLUMN IF NOT EXISTS remarks text,
ADD COLUMN IF NOT EXISTS document_status text DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS email_status text DEFAULT 'Not Sent',
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
ADD COLUMN IF NOT EXISTS client_submission jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS plants_status jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- 4. Ensure audit_projects table has custom columns & sub-tab metadata
ALTER TABLE IF EXISTS public.audit_projects 
ADD COLUMN IF NOT EXISTS custom_columns jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mom_columns jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mom_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS testing_columns jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS testing_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS queries_columns jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS queries_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS meta_json jsonb DEFAULT '{}'::jsonb;

-- 5. Enable Row Level Security (RLS) policies if not already active
ALTER TABLE IF EXISTS public.audit_data_tracker ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_data_tracker' AND policyname = 'Allow public and authenticated access to audit_data_tracker'
  ) THEN
    CREATE POLICY "Allow public and authenticated access to audit_data_tracker" 
    ON public.audit_data_tracker FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. SQL Query to re-populate / extract unique document requirements from audit_programme
-- Note: This parses comma/newline-separated document strings and inserts distinct records.
DO $$
DECLARE
  rec RECORD;
  doc_item text;
  doc_list text[];
  sub_proc text;
BEGIN
  -- Iterate over all programme rows containing data requirement text
  FOR rec IN 
    SELECT 
      id as programme_id, 
      project_id, 
      process_name,
      COALESCE(row_data->>'data_requirement', row_data->>'data_req', row_data->>'document_name') AS raw_docs,
      COALESCE(row_data->>'sub_process', process_name) AS sub_process
    FROM public.audit_programme
    WHERE COALESCE(row_data->>'data_requirement', row_data->>'data_req', row_data->>'document_name') IS NOT NULL
      AND TRIM(COALESCE(row_data->>'data_requirement', row_data->>'data_req', row_data->>'document_name')) <> ''
  LOOP
    -- Split by comma, semicolon, or newlines
    doc_list := regexp_split_to_array(rec.raw_docs, '[,;\n\r]+');
    
    FOREACH doc_item IN ARRAY doc_list
    LOOP
      doc_item := TRIM(doc_item);
      IF LENGTH(doc_item) > 1 THEN
        -- Insert unique record if not already existing for this project & document
        IF NOT EXISTS (
          SELECT 1 FROM public.audit_data_tracker 
          WHERE project_id = rec.project_id 
            AND LOWER(TRIM(COALESCE(data_requirement, mapped_column_key, status_json->>'document_name'))) = LOWER(doc_item)
        ) THEN
          INSERT INTO public.audit_data_tracker (
            project_id,
            programme_id,
            mapped_column_key,
            data_requirement,
            sub_process,
            status_json,
            remarks,
            plants_status,
            attachments
          ) VALUES (
            rec.project_id,
            rec.programme_id,
            doc_item,
            doc_item,
            rec.sub_process,
            jsonb_build_object(
              'document_name', doc_item,
              'sub_process', rec.sub_process,
              'document_status', 'Pending',
              'remarks', '',
              'plants_status', '{}'::jsonb
            ),
            '',
            '{}'::jsonb,
            '[]'::jsonb
          );
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END $$;
