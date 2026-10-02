-- Migration: Unified Single-Table Finance Compliance Schema (with Clean Drop of Previous Tables)
-- File: supabase/migrations/20260930000000_create_finance_compliance_calendar.sql

-- =========================================================================
-- 1. Clean up & Drop any previous tables created earlier (Idempotent / Safe)
-- =========================================================================
DROP TABLE IF EXISTS public.finance_compliance_calendar_email_logs CASCADE;
DROP TABLE IF EXISTS public.finance_compliance_calendar_entries CASCADE;
DROP TABLE IF EXISTS public.finance_compliance_calendar_items CASCADE;
DROP TABLE IF EXISTS public.finance_compliance_calendar_clients CASCADE;
DROP TABLE IF EXISTS public.finance_compliance_company_persons CASCADE;
DROP TABLE IF EXISTS public.finance_compliance_companies CASCADE;

-- =========================================================================
-- 2. Add Finance module access columns to HRM module access table
-- =========================================================================
ALTER TABLE public.hrm_module_access ADD COLUMN IF NOT EXISTS finance BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.hrm_module_access ADD COLUMN IF NOT EXISTS finance_role TEXT CHECK (finance_role IN ('admin','member','viewer')) DEFAULT 'viewer';

-- =========================================================================
-- 3. Create the Unified Single Table: finance_compliance
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.finance_compliance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name      TEXT NOT NULL,
  industry          TEXT,
  address           TEXT,
  gstin             TEXT,
  pan_number        TEXT,
  cin_number        TEXT,
  website           TEXT,
  note              TEXT,
  
  -- Company Contacts / Members (JSONB Array: [{id, name, designation, email, phone, is_primary}])
  persons           JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Master Compliance Items (JSONB Array: [{id, s_no, compliance_nature, frequency, statutory_due_date, internal_control_due_date}])
  compliance_items  JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Monthly Tracking Execution Map: {"2026_9": { "item_id": { "actual_payment_date": "...", "status": "Completed", "remarks": "..." } }}
  monthly_entries   JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Email Dispatch History (JSONB Array: [{id, sent_at, recipient_email, recipient_name, subject, status, items_count}])
  email_logs        JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- High-performance index
CREATE INDEX IF NOT EXISTS idx_finance_compliance_active ON public.finance_compliance(is_active, created_at DESC);

-- =========================================================================
-- 4. Access Control Function & Row Level Security (RLS)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.finance_has_module_access()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.hrm_profiles p
    WHERE p.id = auth.uid()
      AND LOWER(COALESCE(p.role, '')) IN ('admin', 'hr_admin', 'super_admin')
  ) OR EXISTS (
    SELECT 1
    FROM public.hrm_employees e
    JOIN public.hrm_module_access ma ON ma.employee_id = e.id
    WHERE e.auth_user_id = auth.uid()
      AND COALESCE(ma.finance, FALSE) = TRUE
  );
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.finance_compliance ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policy
DROP POLICY IF EXISTS finance_compliance_all ON public.finance_compliance;

CREATE POLICY finance_compliance_all ON public.finance_compliance
  FOR ALL USING (public.finance_has_module_access()) WITH CHECK (public.finance_has_module_access());
