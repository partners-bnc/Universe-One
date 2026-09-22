-- Migration: Add progress column to audit_pre_execution_calendar without default constraints
ALTER TABLE IF EXISTS public.audit_pre_execution_calendar 
  ADD COLUMN IF NOT EXISTS progress integer;

-- Backfill progress for existing records based on current status
UPDATE public.audit_pre_execution_calendar
SET progress = CASE 
  WHEN status = 'Done' THEN 100
  WHEN status = 'In Progress' THEN 50
  ELSE 0
END
WHERE progress IS NULL;
