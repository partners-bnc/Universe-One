-- Dynamic SaaS Audit Engine Migration
-- Safe non-destructive creation of dynamic audit schema

-- 1. CENTRAL AUDIT TEMPLATES
create table if not exists public.audit_templates (
  id uuid primary key default gen_random_uuid(),
  template_name text not null,               -- e.g. "Internal Audit", "HR Audit", "Saudi Audit", "CST Audit"
  category text default 'Internal Audit',
  description text,
  icon text default '📋',
  color text default '#0d9488',
  default_processes text[] default '{"P2P Audit", "Inventory Audit", "HR Audit", "O2C Audit"}',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 2. COMPANY AUDIT PROJECTS
create table if not exists public.audit_projects (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.audit_templates(id) on delete set null,
  project_name text not null,                -- e.g. "P2P & HR Audit FY 2026-27"
  client_name text not null,                 -- Company Name (e.g. "Lixil Window Systems")
  financial_year text default 'FY 2026-27',
  project_leader uuid references public.hrm_employees(id),
  start_date date,
  end_date date,
  project_length integer,                    -- Number of days
  assigned_team uuid[] default '{}'::uuid[],  -- Array of employee IDs
  current_stage integer default 1 check (current_stage between 1 and 2),
  status text default 'active' check (status in ('active', 'completed', 'archived')),
  created_by uuid references public.hrm_employees(id),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 3. STAGE 1: ORG STRUCTURE
create table if not exists public.audit_pre_execution_org (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.audit_projects(id) on delete cascade,
  member_name text not null,
  designation text,
  department text,
  email text not null,
  phone text,
  reporting_to text,
  created_at timestamptz default timezone('utc', now())
);

-- 4. STAGE 1: WEEKLY CALENDAR
create table if not exists public.audit_pre_execution_calendar (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.audit_projects(id) on delete cascade,
  week_name text not null,                   -- e.g. "Week 1", "Week 2"
  week_description text,                     -- e.g. "Planning & Data Collection"
  activity text not null,                    -- e.g. "Kick-off Meeting"
  detailed_audit_work text,                  -- Detailed description
  status text default 'Pending' check (status in ('Done', 'Pending', 'In Progress')),
  remarks text,
  assigned_team_id uuid references public.hrm_employees(id),
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now())
);

-- 5. STAGE 2: UNIFIED AUDIT PROGRAMME TABLE
create table if not exists public.audit_programme (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.audit_projects(id) on delete cascade,
  process_name text not null,                -- e.g. "P2P Audit", "Inventory Audit", "HR Audit", "O2C Audit"
  parent_id uuid references public.audit_programme(id) on delete cascade, -- Null for main step, non-null for sub-step
  is_substep boolean default false,
  is_header boolean default false,
  row_data jsonb not null default '{}'::jsonb, -- Dynamic key-value row fields
  sort_order integer default 0,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- SAFE ALTER COLUMN IF TABLE PREVIOUSLY CREATED
alter table public.audit_projects add column if not exists custom_columns jsonb default '[]'::jsonb;
alter table public.audit_projects add column if not exists data_tracker jsonb default '[]'::jsonb;
alter table public.audit_programme add column if not exists is_header boolean default false;
alter table public.audit_programme add column if not exists is_substep boolean default false;


-- 6. STAGE 2: DATA TRACKER / IDR TABLE
create table if not exists public.audit_data_tracker (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.audit_projects(id) on delete cascade,
  programme_id uuid references public.audit_programme(id) on delete cascade,
  mapped_column_key text default 'data_requirement', -- Dynamic JSON key inside programme row_data
  client_person_id uuid references public.audit_pre_execution_org(id) on delete set null,
  status_json jsonb not null default '{"document_status": "Not Received", "remarks": ""}'::jsonb,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- 7. SECURE 24-HOUR CLIENT UPLOAD TOKENS
create table if not exists public.audit_upload_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  project_id uuid not null references public.audit_projects(id) on delete cascade,
  client_person_id uuid references public.audit_pre_execution_org(id) on delete cascade,
  client_email text not null,
  data_tracker_ids uuid[] not null default '{}'::uuid[],
  expires_at timestamptz not null default (timezone('utc', now()) + interval '24 hours'),
  is_used boolean default false,
  created_at timestamptz default timezone('utc', now())
);

-- INDEXES FOR FAST QUERYING
create index if not exists idx_audit_projects_template on public.audit_projects(template_id);
create index if not exists idx_audit_pre_execution_org_project on public.audit_pre_execution_org(project_id);
create index if not exists idx_audit_pre_execution_cal_project on public.audit_pre_execution_calendar(project_id, sort_order);
create index if not exists idx_audit_programme_project_process on public.audit_programme(project_id, process_name, sort_order);
create index if not exists idx_audit_data_tracker_project on public.audit_data_tracker(project_id, programme_id);
create index if not exists idx_audit_upload_tokens_lookup on public.audit_upload_tokens(token, expires_at);

-- SEED INITIAL TEMPLATES IF NONE EXIST
insert into public.audit_templates (template_name, category, description, icon, color, default_processes)
select 'Internal Audit', 'Internal Audit', 'Standard internal audit workflow with pre-execution planning, org structure, and execution tabs.', '🛡️', '#0d9488', Array['P2P Audit', 'Inventory Audit', 'HR Audit', 'O2C Audit']
where not exists (select 1 from public.audit_templates where template_name = 'Internal Audit');

insert into public.audit_templates (template_name, category, description, icon, color, default_processes)
select 'IFC / ICFR Audit', 'Compliance', 'Internal Financial Controls & Financial Reporting audit template.', '🏦', '#2563eb', Array['Entity Level Controls', 'Financial Reporting Controls', 'IT General Controls']
where not exists (select 1 from public.audit_templates where template_name = 'IFC / ICFR Audit');

insert into public.audit_templates (template_name, category, description, icon, color, default_processes)
select 'PDPL Audit', 'Privacy & Data', 'Personal Data Protection Law compliance audit.', '🏭', '#d97706', Array['Data Collection', 'Consent Management', 'Third-Party Transfer']
where not exists (select 1 from public.audit_templates where template_name = 'PDPL Audit');

insert into public.audit_templates (template_name, category, description, icon, color, default_processes)
select 'CST Audit', 'Process Audit', 'CST execution audit template.', '📊', '#0f766e', Array['Execution Planning', 'Process Review', 'Reporting'data:image/png;base64,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]
where not exists (select 1 from public.audit_templates where template_name = 'CST Audit');

insert into public.audit_templates (template_name, category, description, icon, color, default_processes)
select 'Saudi Audit', 'Internal Audit', 'Saudi Arabia internal audit workspace structure.', '🇸🇦', '#1e3a8a', Array['Planning & RCM', 'Data Tracker', 'Org Chart']
where not exists (select 1 from public.audit_templates where template_name = 'Saudi Audit');
