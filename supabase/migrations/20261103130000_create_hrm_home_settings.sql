-- Global (single-row) settings that control which sections appear on the employee HRM home page.
CREATE TABLE IF NOT EXISTS public.hrm_home_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  show_greeting BOOLEAN NOT NULL DEFAULT TRUE,
  show_date_card BOOLEAN NOT NULL DEFAULT TRUE,
  show_attendance_notice BOOLEAN NOT NULL DEFAULT TRUE,
  show_festive_decor BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.hrm_home_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Accessed only through server routes using the service role.
ALTER TABLE public.hrm_home_settings ENABLE ROW LEVEL SECURITY;
