-- Migration: Add MOM and Testing columns to audit_projects
-- Safe non-destructive column additions

alter table public.audit_projects 
  add column if not exists mom_data jsonb default '{}'::jsonb,
  add column if not exists mom_columns jsonb default '[]'::jsonb,
  add column if not exists testing_data jsonb default '{}'::jsonb,
  add column if not exists testing_columns jsonb default '[]'::jsonb;
