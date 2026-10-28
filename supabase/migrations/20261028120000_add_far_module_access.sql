-- Add FAR module access columns to hrm_module_access
ALTER TABLE public.hrm_module_access ADD COLUMN IF NOT EXISTS far BOOLEAN NOT NULL DEFAULT FALSE;
