-- Migration: Create auditing_static_tracker table
-- Stores CSR Static Audit tracker records with JSON fields for company details, NGO questions, Student questions, and financials.

CREATE TABLE IF NOT EXISTS public.auditing_static_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  csr_donor TEXT,
  project_name TEXT,
  company_details JSONB DEFAULT '{}'::jsonb,
  expense_data JSONB DEFAULT '[]'::jsonb,
  invoice_data JSONB DEFAULT '[]'::jsonb,
  ngo_questions JSONB DEFAULT '[]'::jsonb,
  student_questions JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'in_progress',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auditing_static_tracker_name_idx ON public.auditing_static_tracker (company_name);
CREATE INDEX IF NOT EXISTS auditing_static_tracker_status_idx ON public.auditing_static_tracker (status);
CREATE INDEX IF NOT EXISTS auditing_static_tracker_updated_idx ON public.auditing_static_tracker (updated_at DESC);

ALTER TABLE public.auditing_static_tracker DISABLE ROW LEVEL SECURITY;

