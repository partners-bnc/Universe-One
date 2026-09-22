-- Migration: Add company_category and plants columns to audit_projects without defaults
ALTER TABLE IF EXISTS public.audit_projects 
  ADD COLUMN IF NOT EXISTS company_category text;

ALTER TABLE IF EXISTS public.audit_projects 
  ADD COLUMN IF NOT EXISTS plants jsonb;
