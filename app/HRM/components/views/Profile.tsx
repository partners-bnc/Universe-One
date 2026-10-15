'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatEmploymentValue, getEmployeeTypeLabel } from '@/utils/hrm-employment';
import EmployeePageHeader from '../ui/EmployeePageHeader';
import { useHrmFeedback } from '../ui/HrmFeedback';
import HrmEmptyState from '../ui/HrmEmptyState';

const PROFILE_PICTURE_MAX_SIZE_BYTES = 4 * 1024 * 1024;

function extractPlainErrorText(rawText: string) {
  const normalized = String(rawText || '').trim();
  if (!normalized) return '';
  if (normalized.startsWith('<!DOCTYPE') || normalized.startsWith('<html')) {
    return '';
  }
  return normalized;
}

async function parseApiResponse(response: Response) {
  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const plainText = extractPlainErrorText(rawText);

  if (!rawText) {
    return { data: null as Record<string, unknown> | null, plainText: '' };
  }

  if (contentType.includes('application/json')) {
    try {
      return { data: JSON.parse(rawText) as Record<string, unknown>, plainText };
    } catch {
      return { data: null, plainText };
    }
  }

  try {
    return { data: JSON.parse(rawText) as Record<string, unknown>, plainText };
  } catch {
    return { data: null, plainText };
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className="text-xs font-semibold text-on-surface">{value || 'Not available'}</p>
    </div>
  );
}

function formatSalary(value?: string | number | null) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'Not available';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(numeric);
}

function formatDate(value?: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatStatus(status?: string | null) {
  return formatEmploymentValue(status || 'active');
}

function formatReportingTarget(employee?: any) {
  if (employee?.reporting_manager) {
    if (typeof employee.reporting_manager === 'object') {
      return (
        employee.reporting_manager.name ||
        employee.reporting_manager.full_name ||
        employee.reporting_manager.employee_id ||
        'Not assigned'
      );
    }
    return String(employee.reporting_manager);
  }
  return (
    employee?.reporting_manager_name ||
    employee?.directory_reporting_manager ||
    employee?.manager_name ||
    employee?.manager ||
    'Not assigned'
  );
}

function pickFirstText(...values: Array<string | number | null | undefined>) {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }

  return '';
}

function formatDocumentLabel(value?: string | null) {
  const normalized = String(value || '').trim();
  if (!normalized) return 'Employee Document';

  return normalized
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getDocumentIcon(documentType?: string | null, fileName?: string | null) {
  const normalizedType = String(documentType || '').toLowerCase();
  const extension = String(fileName || '').split('.').pop()?.toLowerCase();

  if (normalizedType.includes('aadhaar') || normalizedType.includes('pan') || normalizedType.includes('passport')) {
    return 'badge';
  }

  if (normalizedType.includes('bank') || normalizedType.includes('cheque') || normalizedType.includes('passbook')) {
    return 'account_balance';
  }

  if (normalizedType.includes('salary')) return 'receipt_long';
  if (normalizedType.includes('letter') || normalizedType.includes('appointment') || normalizedType.includes('experience')) return 'description';
  if (extension === 'pdf') return 'picture_as_pdf';
  if (['jpg', 'jpeg', 'png', 'webp'].includes(extension || '')) return 'image';

  return 'folder_open';
}

const EMPLOYEE_DOCUMENT_SLOTS = [
  { key: 'aadhaar_card', label: 'Aadhaar Card', description: 'Government issued Aadhaar identification card', required: true },
  { key: 'pan_card', label: 'PAN Card', description: 'Permanent Account Number card', required: true },
  { key: 'bank_passbook_cancel_cheque', label: 'Bank Passbook / Cancel Cheque', description: 'Bank passbook copy or cancelled cheque for salary processing', required: true },
  { key: 'passport', label: 'Passport', description: 'Passport first and last page (optional)', required: false },
  { key: 'appointment_letter', label: 'Appointment Letter', description: 'Appointment / offer letter from previous organisation', required: false },
  { key: 'experience_letter', label: 'Experience Letter', description: 'Relieving / experience certificate from past employers', required: false },
  { key: 'salary_slip', label: 'Salary Slip', description: 'Recent salary payslip from previous organisation', required: false },
];

function formatFileSize(bytes?: number | null) {
  const numeric = Number(bytes);
  if (!Number.isFinite(numeric) || numeric <= 0) return '--';
  if (numeric < 1024) return `${numeric} B`;
  if (numeric < 1024 * 1024) return `${(numeric / 1024).toFixed(1)} KB`;
  return `${(numeric / (1024 * 1024)).toFixed(1)} MB`;
}

function validateDocumentFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = String(file.type || '').toLowerCase();
  const isAllowedExt = ['pdf', 'png', 'jpg', 'jpeg'].includes(extension);
  const isAllowedMime = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/pjpeg'].includes(mimeType) || !mimeType;

  if (!isAllowedExt || !isAllowedMime) {
    return {
      valid: false,
      warning: 'The file type is different. Please upload with the correct file type (PDF, PNG, JPEG).',
    };
  }

  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      warning: 'File size exceeds maximum allowed limit of 10 MB.',
    };
  }

  return { valid: true };
}

export default function Profile({
  employee,
  onEmployeeChange,
  onRefreshEmployee,
}: {
  employee?: any;
  onEmployeeChange?: (employee: any) => void;
  onRefreshEmployee?: () => Promise<any>;
}) {
  const { showFeedback } = useHrmFeedback();
  const [activeSection, setActiveSection] = useState('personal');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const name = employee?.name || 'Employee';
  const employeeId = employee?.employee_id || 'Not assigned';
  const loginId = employee?.employee_id || employee?.email || 'Not assigned';
  const designation = employee?.designation?.title || employee?.resolved_designation_title || employee?.role || 'Employee';
  const department = employee?.department?.name || employee?.resolved_department_name || 'Unassigned';
  const avatar = employee?.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F3E8FF&color=6D28D9`;

  const lifecycleStatus = formatStatus(employee?.employment_lifecycle_status || employee?.employee_status);
  const currentStage = formatStatus(employee?.current_stage);
  const separationDate = formatDate(employee?.separated_at);
  const accessDisabledAt = formatDate(employee?.access_disabled_at);
  const employeeType = getEmployeeTypeLabel(employee?.resolved_employee_type || employee?.employee_type);
  const reportingManager = formatReportingTarget(employee);
  const workPhone = pickFirstText(employee?.phone, employee?.mobile_phone, employee?.alternate_phone, 'Not available');
  const moduleAccess = Array.isArray(employee?.module_access) ? employee.module_access[0] : employee?.module_access;
  const address = pickFirstText(
    employee?.address,
    [employee?.city, employee?.district, employee?.state, employee?.country].filter(Boolean).join(', ')
  ) || 'Not available';
  const [localDocuments, setLocalDocuments] = useState<any[]>(() => {
    return Array.isArray(employee?.documents) ? employee.documents : [];
  });
  const [selectedDocFiles, setSelectedDocFiles] = useState<Record<string, File>>({});
  const [docWarnings, setDocWarnings] = useState<Record<string, string>>({});
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    if (Array.isArray(employee?.team_members) && employee.team_members.length > 0) {
      return employee.team_members.filter((m: any) => {
        const lifecycle = (m.employment_lifecycle_status || '').toLowerCase();
        const status = (m.employee_status || '').toLowerCase();
        if (lifecycle === 'separated' || status === 'separated' || m.separated_at || m.access_disabled_at) return false;
        return lifecycle === 'active' || ['active', 'probation', 'confirmed'].includes(status);
      });
    }
    return [];
  });
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadTeamMembers() {
      try {
        setLoadingTeam(true);
        const query = employee?.id ? `?managerId=${encodeURIComponent(employee.id)}` : '';
        const res = await fetch(`/HRM/api/employee/team-members${query}`);
        const data = await res.json();
        if (active && Array.isArray(data.team_members)) {
          setTeamMembers(data.team_members);
        }
      } catch {
        // ignore
      } finally {
        if (active) setLoadingTeam(false);
      }
    }
    loadTeamMembers();
    return () => {
      active = false;
    };
  }, [employee?.id]);

  useEffect(() => {
    if (Array.isArray(employee?.documents)) {
      setLocalDocuments(employee.documents);
    }
  }, [employee?.documents]);

  useEffect(() => {
    let active = true;
    async function loadDocuments() {
      try {
        const res = await fetch('/HRM/api/employee/documents');
        const data = await res.json();
        if (active && Array.isArray(data.documents)) {
          setLocalDocuments(data.documents);
        }
      } catch {
        // ignore
      }
    }
    loadDocuments();
    return () => { active = false; };
  }, []);

  const documents = useMemo(() => {
    return [...localDocuments].sort((left: any, right: any) => {
      const leftTime = new Date(left?.updated_at || left?.created_at || 0).getTime();
      const rightTime = new Date(right?.updated_at || right?.created_at || 0).getTime();
      return rightTime - leftTime;
    });
  }, [localDocuments]);

  const documentMap = useMemo(() => {
    const map = new Map<string, any>();
    documents.forEach((doc: any) => {
      if (doc?.document_type && !map.has(doc.document_type)) {
        map.set(doc.document_type, doc);
      }
    });
    return map;
  }, [documents]);

  const allDocumentSlots = useMemo(() => {
    const standardKeys = new Set(EMPLOYEE_DOCUMENT_SLOTS.map((s) => s.key));
    const extraDocs: any[] = [];

    documents.forEach((doc: any) => {
      if (doc?.document_type && !standardKeys.has(doc.document_type)) {
        extraDocs.push({
          key: doc.document_type,
          label: formatDocumentLabel(doc.document_type),
          description: 'Employee submitted document',
          required: false,
        });
      }
    });

    return [...EMPLOYEE_DOCUMENT_SLOTS, ...extraDocs];
  }, [documents]);

  const uploadedCount = useMemo(() => {
    return allDocumentSlots.filter((slot) => documentMap.has(slot.key)).length;
  }, [allDocumentSlots, documentMap]);

  const handleDocFileSelect = (slotKey: string, file: File | null) => {
    if (!file) {
      setSelectedDocFiles((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      setDocWarnings((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      return;
    }

    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setSelectedDocFiles((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      setDocWarnings((prev) => ({
        ...prev,
        [slotKey]: validation.warning || 'The file type is different. Please upload with the correct file type (PDF, PNG, JPEG).',
      }));
      showFeedback({
        type: 'warning',
        title: 'Incorrect File Type',
        message: validation.warning || 'The file type is different. Please upload with the correct file type (PDF, PNG, JPEG).',
      });
      return;
    }

    setDocWarnings((prev) => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });
    setSelectedDocFiles((prev) => ({
      ...prev,
      [slotKey]: file,
    }));
  };

  const handleUploadDocument = async (slotKey: string) => {
    const file = selectedDocFiles[slotKey];
    if (!file) return;

    if (documentMap.has(slotKey)) {
      showFeedback({
        type: 'warning',
        title: 'Already Uploaded',
        message: 'This document is already uploaded and is in view-only mode.',
      });
      return;
    }

    try {
      setUploadingDocType(slotKey);
      const formData = new FormData();
      formData.set('document_type', slotKey);
      formData.set('file', file);

      const response = await fetch('/HRM/api/employee/documents', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload document');
      }

      setSelectedDocFiles((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      setDocWarnings((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });

      if (result.document) {
        setLocalDocuments((prev) => [result.document, ...prev.filter((d: any) => d.document_type !== slotKey)]);
        if (employee) {
          const currentDocs = Array.isArray(employee.documents) ? employee.documents : [];
          const nextDocs = [result.document, ...currentDocs.filter((d: any) => d.document_type !== slotKey)];
          const nextEmployee = { ...employee, documents: nextDocs };
          if (onEmployeeChange) {
            onEmployeeChange(nextEmployee);
          }
        }
      }

      if (onRefreshEmployee) {
        try {
          await onRefreshEmployee();
        } catch {}
      }

      showFeedback({
        type: 'success',
        title: 'Document Uploaded',
        message: `${formatDocumentLabel(slotKey)} has been uploaded successfully and is now locked in view mode.`,
      });
    } catch (err: any) {
      showFeedback({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Failed to upload document. Please try again.',
      });
    } finally {
      setUploadingDocType(null);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'job', label: 'Job Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'performance', label: 'Performance' },
    { id: 'skills', label: 'Skills & Certs' },
  ];

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!String(file.type || '').startsWith('image/')) {
      showFeedback({
        type: 'error',
        title: 'Profile picture not updated',
        message: 'Please upload a valid image file.',
      });
      return;
    }

    if (file.size > PROFILE_PICTURE_MAX_SIZE_BYTES) {
      showFeedback({
        type: 'error',
        title: 'Profile picture not updated',
        message: 'Profile picture must be 4 MB or smaller.',
      });
      return;
    }

    try {
      setAvatarUploading(true);
      const formData = new FormData();
      formData.set('avatar', file);

      const response = await fetch('/HRM/api/employee/avatar', {
        method: 'POST',
        body: formData,
      });
      const { data: result, plainText } = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(
          (typeof result?.error === 'string' && result.error) ||
          plainText ||
          'Failed to update profile picture'
        );
      }

      let nextEmployee = employee ? { ...employee, profile_picture_url: result.avatarUrl } : employee;
      if (onEmployeeChange) {
        onEmployeeChange(nextEmployee);
      }

      if (onRefreshEmployee) {
        try {
          const refreshedEmployee = await onRefreshEmployee();
          if (refreshedEmployee) {
            nextEmployee = refreshedEmployee;
          }
        } catch {
          // Keep the optimistic avatar update if the refresh request fails.
        }
      }

      showFeedback({
        type: 'success',
        title: 'Profile picture updated',
        message: 'Your previous profile picture was replaced successfully.',
      });
    } catch (error: any) {
      showFeedback({
        type: 'error',
        title: 'Profile picture not updated',
        message: error?.message || 'Please try again.',
      });
    } finally {
      setAvatarUploading(false);
    }
  }

  function renderPersonalSection() {
    return {
      main: (
        <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
          <h2 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">badge</span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <InfoRow label="Full Name" value={name} />
            <InfoRow label="Login ID" value={loginId} />
            <InfoRow label="Employee Code" value={employeeId} />
            <InfoRow label="Date of Joining" value={formatDate(employee?.date_of_joining)} />
            <InfoRow label="Designation" value={designation} />
            <InfoRow label="Nationality" value={employee?.nationality} />
            <InfoRow label="Marital Status" value={employee?.marital_status} />
            <InfoRow label="Date of Birth" value={formatDate(employee?.date_of_birth)} />
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">alternate_email</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Work Email</p>
                  <p className="text-xs font-semibold text-on-surface mt-0.5">{employee?.email || 'Not available'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">call</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Phone Number</p>
                  <p className="text-xs font-semibold text-on-surface mt-0.5">{workPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant">Current Address</p>
                  <p className="text-xs font-semibold text-on-surface mt-0.5">{address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      side: (
        <>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Profile Snapshot</h3>
            <div className="space-y-5">
              <InfoRow label="Lifecycle Status" value={lifecycleStatus} />
              <InfoRow label="Employee Type" value={employeeType} />
              <InfoRow label="Current Stage" value={currentStage} />
              <InfoRow label="Separated At" value={employee?.separated_at ? separationDate : 'Not separated'} />
              <InfoRow label="Access Disabled At" value={employee?.access_disabled_at ? accessDisabledAt : 'Active access'} />
              <InfoRow label="Department" value={department} />
              <InfoRow label="Designation" value={designation} />
              <InfoRow label="Reporting To" value={reportingManager} />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Quick Contact</h3>
            <div className="space-y-3 text-sm text-on-surface-variant">
              <p>{employee?.email || 'No work email available.'}</p>
              <p>{workPhone}</p>
            </div>
          </div>
        </>
      ),
    };
  }

  function renderJobSection() {
    return {
      main: (
        <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
          <h2 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">business_center</span>
            Job Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <InfoRow label="Department" value={department} />
            <InfoRow label="Designation" value={designation} />
            <InfoRow label="Reporting To" value={reportingManager} />
            <InfoRow label="Lifecycle Status" value={lifecycleStatus} />
            <InfoRow label="Employee Type" value={employeeType} />
            <InfoRow label="Current Stage" value={currentStage} />
            <InfoRow label="Date of Joining" value={formatDate(employee?.date_of_joining)} />
            <InfoRow label="Separated At" value={employee?.separated_at ? separationDate : 'Not separated'} />
            <InfoRow label="Separation Reason" value={employee?.separation_reason || 'Not applicable'} />
            <InfoRow label="Access Disabled At" value={employee?.access_disabled_at ? accessDisabledAt : 'Active access'} />
            <InfoRow label="Confirmation Date" value={formatDate(employee?.confirmation_date)} />
            <InfoRow label="Salary" value={formatSalary(employee?.salary)} />
            <InfoRow label="Experience Company Name" value={employee?.experience_company_name} />
            <InfoRow label="Total Years Of Experience" value={employee?.total_experience} />
            <InfoRow label="Working Schedule" value={employee?.working_schedule_label} />
            <InfoRow label="Second Saturday Off" value={employee?.second_saturday_off ? 'Yes' : 'No'} />
            <InfoRow label="Task Manager Access" value={moduleAccess?.task_manager ? 'Enabled' : 'Not enabled'} />
          </div>
        </div>
      ),
      side: (
        <>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Employment Summary</h3>
            <div className="space-y-5">
              <InfoRow label="Employee ID" value={employeeId} />
              <InfoRow label="Join Date" value={formatDate(employee?.date_of_joining)} />
              <InfoRow label="Company" value={employee?.company} />
              <InfoRow label="Salary" value={formatSalary(employee?.salary)} />
              <InfoRow label="Division" value={employee?.division} />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Manager Notes</h3>
            <div className="text-sm text-on-surface-variant">
              Reporting structure and additional role details will continue to appear here as HR completes the employee setup.
            </div>
          </div>
        </>
      ),
    };
  }

  function renderDocumentsSection() {
    const compliancePercent = allDocumentSlots.length > 0
      ? Math.round((uploadedCount / allDocumentSlots.length) * 100)
      : 0;

    return {
      main: (
        <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-lg font-bold font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
              Documents
            </h2>

            {/* Circular Progress Compliance Badge (Light Theme) */}
            <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-2xl shadow-2xs border border-slate-200/90 self-start sm:self-auto hover:shadow-xs transition-shadow">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <svg className="w-9 h-9 -rotate-90 transform" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r={14}
                    className="stroke-slate-100"
                    strokeWidth="3.2"
                    fill="transparent"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r={14}
                    className="stroke-primary transition-all duration-700 ease-out"
                    strokeWidth="3.4"
                    strokeDasharray={87.96}
                    strokeDashoffset={87.96 - (compliancePercent / 100) * 87.96}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-slate-800">
                  {compliancePercent}%
                </span>
              </div>
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] text-slate-400 uppercase leading-none mb-1">
                  COMPLIANCE
                </p>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {uploadedCount} of {allDocumentSlots.length} Uploaded
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {allDocumentSlots.map((slot) => {
              const item = documentMap.get(slot.key);
              const isUploaded = Boolean(item);
              const isUploading = uploadingDocType === slot.key;
              const selectedFile = selectedDocFiles[slot.key];
              const warning = docWarnings[slot.key];

              if (isUploaded) {
                return (
                  <div
                    key={slot.key}
                    className="flex flex-col justify-between rounded-2xl border-[1.5px] border-dashed border-primary/45 bg-primary/[0.02] hover:bg-primary/[0.05] hover:border-primary p-3.5 shadow-2xs hover:shadow-xs transition-all duration-200 min-h-[105px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-[18px]">
                              {getDocumentIcon(slot.key, item?.file_name)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={slot.label}>
                              {slot.label}
                            </h4>
                          </div>
                        </div>

                        {/* Professional Icon-based Open button (no background, small) */}
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Document"
                          aria-label="Open Document"
                          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-primary transition-colors active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            open_in_new
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 mt-1 border-t border-primary/10 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate font-medium text-slate-700 text-[11px] mr-2" title={item.file_name}>
                        {item.file_name || 'Document'}
                      </span>
                      <span className="shrink-0 text-slate-400 text-[10px] font-medium">
                        {formatFileSize(item.file_size)}
                      </span>
                    </div>
                  </div>
                );
              }

              const isDragging = dragOverSlot === slot.key;

              return (
                <div
                  key={slot.key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(slot.key);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    const f = e.dataTransfer?.files?.[0];
                    if (f) handleDocFileSelect(slot.key, f);
                  }}
                  className={`flex flex-col justify-between rounded-2xl border-[1.5px] border-dashed transition-all duration-300 min-h-[105px] p-3.5 relative ${
                    isDragging
                      ? 'border-solid border-orange-500 bg-orange-100/40 ring-4 ring-orange-400/25 scale-[1.01]'
                      : 'border-orange-300 hover:border-orange-400 bg-orange-50/[0.08] hover:bg-orange-50/[0.15]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 border border-orange-200/60">
                          <span className="material-symbols-outlined text-[18px]">
                            {getDocumentIcon(slot.key, null)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate" title={slot.label}>
                            {slot.label}
                          </h4>
                        </div>
                      </div>

                      {slot.required ? (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100/80 border border-orange-200/80 px-2 py-0.5 rounded-md shrink-0">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md shrink-0">
                          Optional
                        </span>
                      )}
                    </div>

                    {/* Warning banner if wrong file format was chosen */}
                    {warning && (
                      <div className="mb-2 p-1.5 bg-rose-50 border border-rose-200 rounded-lg text-[10px] text-rose-700 flex items-start gap-1.5 leading-snug animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="material-symbols-outlined text-[13px] text-rose-600 shrink-0 mt-0.5">warning</span>
                        <span className="flex-1 font-semibold">{warning}</span>
                        <button
                          type="button"
                          onClick={() => setDocWarnings((prev) => { const n = { ...prev }; delete n[slot.key]; return n; })}
                          className="text-rose-400 hover:text-rose-700 p-0.5 shrink-0"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-1.5">
                    {selectedFile ? (
                      <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0 bg-white border border-orange-200/90 rounded-lg px-2.5 py-1 flex items-center gap-2 text-xs shadow-2xs">
                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-[9px] font-bold ${
                              selectedFile.name.toLowerCase().endsWith('.pdf')
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {selectedFile.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG'}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-slate-800 text-[11px] leading-tight" title={selectedFile.name}>
                                {selectedFile.name}
                              </p>
                              <p className="text-[9px] text-slate-400 leading-none mt-0.5">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDocFileSelect(slot.key, null)}
                              disabled={isUploading}
                              className="text-slate-400 hover:text-rose-500 shrink-0 p-0.5 rounded hover:bg-rose-50 transition-all duration-200 hover:rotate-90"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUploadDocument(slot.key)}
                            disabled={isUploading}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 active:scale-[0.98] disabled:opacity-50 shadow-2xs hover:shadow-xs transition-all duration-200 shrink-0 flex items-center gap-1"
                          >
                            {isUploading ? (
                              <>
                                <span className="animate-spin rounded-full h-2.5 w-2.5 border-2 border-white border-t-transparent" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                                <span>Confirm</span>
                              </>
                            )}
                          </button>
                        </div>

                        {isUploading && (
                          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-0.5">
                            <div className="h-full bg-primary animate-pulse rounded-full w-full" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="group/drop cursor-pointer relative flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-orange-300/80 bg-white hover:bg-orange-50/50 hover:border-orange-400 text-xs font-semibold text-slate-700 hover:text-orange-900 transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-[0.99] text-center">
                        <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-500 group-hover/drop:bg-orange-500 group-hover/drop:text-white flex items-center justify-center shrink-0 transition-colors duration-200 shadow-2xs">
                          <span className="material-symbols-outlined text-[15px] group-hover/drop:-translate-y-0.5 transition-transform duration-200">
                            cloud_upload
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-slate-800 group-hover/drop:text-orange-900 truncate">
                            {dragOverSlot === slot.key ? 'Drop file to upload' : 'Upload Document'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            (PDF, PNG, JPEG)
                          </span>
                        </div>

                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            e.target.value = '';
                            handleDocFileSelect(slot.key, f);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      side: (
        <>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Document Summary</h3>
            <div className="space-y-5">
              <InfoRow label="Uploaded Files" value={`${uploadedCount} / ${allDocumentSlots.length}`} />
              <InfoRow label="Pending Uploads" value={String(allDocumentSlots.length - uploadedCount)} />
              <InfoRow label="Latest Update" value={formatDate(documents[0]?.updated_at || documents[0]?.created_at)} />
              <InfoRow label="Employee Code" value={employeeId} />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Access & Compliance</h3>
            <div className="text-sm text-on-surface-variant leading-relaxed">
              Documents can be uploaded once by the employee. Once uploaded, documents enter locked view-only mode for audit compliance. For replacements or updates, please contact HR administration.
            </div>
          </div>
        </>
      ),
    };
  }

  function renderPerformanceSection() {
    return {
      main: (
        <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
          <h2 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">monitoring</span>
            Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <HrmEmptyState
                icon="monitoring"
                title="No active review cycle"
                message="Performance reviews, appraisal notes, and manager feedback will appear here once they are published internally."
              />
            </div>
          </div>
        </div>
      ),
      side: (
        <>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Review Snapshot</h3>
            <div className="space-y-5">
              <InfoRow label="Last Published Review" value="Not available" />
              <InfoRow label="Goals" value="Not linked yet" />
              <InfoRow label="Appraisal Status" value="No pending action" />
            </div>
          </div>
        </>
      ),
    };
  }

  function renderSkillsSection() {
    return {
      main: (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h2 className="text-lg font-bold font-headline mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">workspace_premium</span>
              Skills
            </h2>
            <HrmEmptyState
              compact
              icon="workspace_premium"
              title="No skills linked yet"
              message="Skill records will appear here once HR or your manager starts mapping your profile."
            />
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h2 className="text-lg font-bold font-headline mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">military_tech</span>
              Certifications
            </h2>
            <HrmEmptyState
              compact
              icon="military_tech"
              title="No certifications uploaded"
              message="Certification records will appear here after they are uploaded or linked from HR."
            />
          </div>
        </div>
      ),
      side: (
        <>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <h3 className="text-base font-bold font-headline mb-5">Development Summary</h3>
            <div className="space-y-5">
              <InfoRow label="Skill Records" value="0 linked" />
              <InfoRow label="Certifications" value="0 uploaded" />
              <InfoRow label="Learning Status" value="Managed by HR" />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">groups</span>
                Team Members
              </h3>
              {teamMembers.length > 0 && (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {teamMembers.length} {teamMembers.length === 1 ? 'Reportee' : 'Reportees'}
                </span>
              )}
            </div>

            {loadingTeam && teamMembers.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                <span className="text-xs font-medium">Loading reportees...</span>
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {teamMembers.map((member) => {
                  const memberName = member.name || member.email || 'Employee';
                  const memberAvatar =
                    member.profile_picture_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=EFF6FF&color=3170c6`;
                  const memberCode = member.employee_id || 'Not assigned';
                  const isMemberActive =
                    member.employment_lifecycle_status === 'active' ||
                    member.employee_status === 'active' ||
                    member.employee_status === 'probation';

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 py-2 border-b border-outline-variant/15 last:border-0"
                    >
                      <div className="relative shrink-0">
                        <Image
                          src={memberAvatar}
                          alt={memberName}
                          width={36}
                          height={36}
                          unoptimized={!member.profile_picture_url}
                          className="w-9 h-9 rounded-full object-cover border border-white shadow-2xs"
                        />
                        {isMemberActive && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"
                            title="Active"
                          />
                        )}
                      </div>

                      <p className="text-xs font-semibold text-on-surface truncate flex-1 min-w-0" title={memberName}>
                        {memberName}
                      </p>

                      <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md shrink-0">
                        {memberCode}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <HrmEmptyState
                compact
                icon="groups"
                title="No direct reportees"
                message="No employees currently have you assigned as their reporting manager."
              />
            )}
          </div>

        </>
      ),
    };
  }

  let sectionContent = renderPersonalSection();
  if (activeSection === 'job') sectionContent = renderJobSection();
  if (activeSection === 'documents') sectionContent = renderDocumentsSection();
  if (activeSection === 'performance') sectionContent = renderPerformanceSection();
  if (activeSection === 'skills') sectionContent = renderSkillsSection();

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <EmployeePageHeader
        icon="person"
        title="Profile Overview"
        description="View your personal details, reporting structure, documents, and employment information in one place."
      />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-surface-container-lowest p-5 rounded-3xl flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden editorial-shadow sm:p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

          <div className="relative z-10 shrink-0">
            <div className="group relative">
              <Image
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover shadow-xl shadow-on-surface/5 border-4 border-surface-container-lowest"
                alt={`${name} profile avatar`}
                src={avatar}
                width={160}
                height={160}
                unoptimized={!employee?.profile_picture_url}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/35 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold">
                  {avatarUploading ? 'Uploading...' : 'Update'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-md border-2 border-surface-container-lowest transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Update profile picture"
              >
                <span className="material-symbols-outlined text-[17px]">photo_camera</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={avatarUploading}
              />
            </div>
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left z-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">{name}</h1>
                <p className="text-primary font-semibold text-sm mt-1">
                  {designation} <span className="text-on-surface-variant font-medium mx-1">|</span>
                  <span className="text-on-surface-variant font-medium">{department}</span>
                </p>
              </div>
              <div className="inline-flex items-center gap-2 self-center rounded-full bg-emerald-50 px-3 py-2 text-emerald-700 md:self-start">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Verified</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">id_card</span>
                <span className="text-[10px] font-medium text-on-surface-variant">{loginId}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-bold text-on-secondary-container uppercase tracking-wider">Active Now</span>
              </div>
            </div>

            <div className="pt-1.5 flex items-center gap-1.5 justify-center md:justify-start">
              <span className="material-symbols-outlined text-[17px] text-primary shrink-0">account_tree</span>
              <span className="text-xs font-semibold text-on-surface truncate" title={reportingManager}>
                {reportingManager}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4">
          <div className="bg-surface-container-lowest p-5 rounded-3xl flex flex-col justify-center items-center text-center editorial-shadow">
            <span className="text-2xl font-extrabold font-headline text-on-surface">{lifecycleStatus}</span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Status</span>
          </div>
          <div className="bg-tertiary-container p-5 rounded-3xl flex flex-col justify-center items-center text-center editorial-shadow">
            <span className="text-2xl font-extrabold font-headline text-on-tertiary-container">{department}</span>
            <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest mt-1">Department</span>
          </div>
          <div className="col-span-2 bg-surface-container-lowest p-5 rounded-3xl flex items-center gap-3 editorial-shadow">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">work_history</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">{employee?.experience_company_name || 'Not available'}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                {employee?.total_experience ? `${employee.total_experience} years experience` : 'Experience'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="flex items-center gap-5 border-b border-outline-variant/15 overflow-x-auto no-scrollbar pt-4 sm:gap-8">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`pb-4 whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? 'text-sm font-bold text-primary border-b-2 border-primary'
                : 'text-sm font-medium text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {sectionContent.main}
        </div>

        <div className="lg:col-span-4 space-y-6">
          {sectionContent.side}
        </div>
      </div>
    </div>
  );
}
