-- Create vendor_profiles table for Vendor Client Portal Onboarding
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id                UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_name                 TEXT NOT NULL,
  email                       TEXT NOT NULL,
  phone_number                TEXT,
  
  -- Compliance Fields
  subject_to_tds              BOOLEAN DEFAULT FALSE,
  lower_deduction_cert        BOOLEAN DEFAULT FALSE,
  lower_deduction_cert_url    TEXT,
  
  msme_certificate            BOOLEAN DEFAULT FALSE,
  msme_cert_url               TEXT,
  
  reverse_charge_applicable   BOOLEAN DEFAULT FALSE,
  
  gst_number                  TEXT,
  gst_certificate_url         TEXT,
  
  -- Multiple other documents stored as JSON array [{ name, url, file_size, uploaded_at }]
  other_documents             JSONB DEFAULT '[]'::jsonb,
  
  is_profile_completed        BOOLEAN DEFAULT FALSE,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vendor_invoices table for Vendor self-service and internal tracking
CREATE TABLE IF NOT EXISTS public.vendor_invoices (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id                   UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  invoice_number              TEXT,
  invoice_amount              NUMERIC(15, 2) NOT NULL,
  currency                    TEXT DEFAULT 'INR',
  invoice_date                DATE NOT NULL,
  description_of_services     TEXT NOT NULL,
  
  -- Multiple invoice copies / supporting documents stored as JSON array [{ name, url, file_size, uploaded_at }]
  invoice_documents           JSONB DEFAULT '[]'::jsonb,
  
  -- BNC POC as text
  bnc_poc                     TEXT NOT NULL,
  
  -- Status & Tracking
  status                      TEXT CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'paid')) DEFAULT 'submitted',
  payment_reference           TEXT,
  paid_at                     TIMESTAMPTZ,
  remarks                     TEXT,
  
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_auth_user_id ON public.vendor_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_email ON public.vendor_profiles(email);
CREATE INDEX IF NOT EXISTS idx_vendor_invoices_vendor_id ON public.vendor_invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_invoices_status ON public.vendor_invoices(status);
CREATE INDEX IF NOT EXISTS idx_vendor_invoices_invoice_date ON public.vendor_invoices(invoice_date);

-- Ensure RLS is disabled or open for backend service_role
ALTER TABLE public.vendor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_invoices DISABLE ROW LEVEL SECURITY;
