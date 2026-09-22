-- Migration: Add Bank Passbook / Cancel Cheque to Onboarding and Employee Documents constraints

alter table if exists public.hrm_onboarding_documents
  drop constraint if exists hrm_onboarding_documents_document_type_check;

alter table if exists public.hrm_onboarding_documents
  add constraint hrm_onboarding_documents_document_type_check check (
    document_type in (
      'aadhaar_card',
      'pan_card',
      'passport',
      'appointment_letter',
      'experience_letter',
      'salary_slip',
      'bank_passbook_cancel_cheque'
    )
  );

alter table if exists public.hrm_employee_documentsx
  drop constraint if exists employee_documents_type_check,
  drop constraint if exists hrm_employee_documents_type_check;

alter table if exists public.hrm_employee_documents
  add constraint hrm_employee_documents_type_check check (
    document_type = any (array[
      'aadhaar_card',
      'pan_card',
      'passport',
      'appointment_letter',
      'experience_letter',
      'salary_slip',
      'bank_passbook_cancel_cheque'
    ])
  );

