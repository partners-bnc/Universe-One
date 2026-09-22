-- Migration: Add queries_data and queries_columns to audit_projects
alter table public.audit_projects 
  add column if not exists queries_data jsonb default '{}'::jsonb,
  add column if not exists queries_columns jsonb default '[]'::jsonb;
