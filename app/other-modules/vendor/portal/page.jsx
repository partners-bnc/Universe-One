'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Building2,
  FileText,
  Upload,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Mail,
  Phone,
  HelpCircle,
  RefreshCw,
  Sparkles,
  DollarSign,
  Briefcase,
  Paperclip,
  UploadCloud,
  FileCheck,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ProfessionalFileInput({
  id,
  label,
  multiple = false,
  accept = '.pdf',
  files,
  onChange,
  existingUrl,
  existingLabel = 'View Current PDF',
  helperText = 'PDF document only (Max 10MB)'
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileList = multiple
    ? (Array.isArray(files) ? files : [])
    : (files ? [files] : []);

  const handleFileSelect = (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    // Filter only PDF files
    const validFiles = Array.from(selected).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (validFiles.length === 0) {
      alert('Please select a valid PDF file.');
      return;
    }

    if (multiple) {
      const newArr = [...fileList, ...validFiles];
      onChange(newArr);
    } else {
      onChange(validFiles[0]);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const validFiles = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (validFiles.length === 0) {
      alert('Please upload a valid PDF file.');
      return;
    }

    if (multiple) {
      const newArr = [...fileList, ...validFiles];
      onChange(newArr);
    } else {
      onChange(validFiles[0]);
    }
  };

  const handleRemove = (indexToRemove, e) => {
    e.stopPropagation();
    if (multiple) {
      const updated = fileList.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange(null);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2">
      {label ? (
        <label className="block text-xs font-bold text-slate-700 tracking-wide">
          {label}
        </label>
      ) : null}

      {/* Hidden native input */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple={multiple}
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Modern, Self-Contained Glassmorphic Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative w-full overflow-hidden flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragging
            ? 'border-[#0372CC] bg-[#0372CC]/10 ring-4 ring-[#0372CC]/15 shadow-md'
            : 'border-slate-300/80 hover:border-[#0372CC] bg-white/70 hover:bg-white/95 backdrop-blur-md shadow-xs hover:shadow-[0_8px_24px_rgba(3,114,204,0.12)]'
          }`}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0372CC]/15 to-[#0372CC]/5 text-[#0372CC] flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 group-hover:bg-[#0372CC] group-hover:text-white transition-all duration-300">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-slate-800">
            <span className="text-[#0372CC] group-hover:underline">Choose PDF {multiple ? 'Files' : 'File'}</span> or drag & drop here
          </p>
          <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0372CC] bg-[#0372CC]/10 px-2.5 py-0.5 rounded-full">
            <span>{helperText}</span>
          </div>
        </div>
      </div>

      {/* Selected PDF Files List */}
      {fileList.length > 0 ? (
        <div className="space-y-1.5 pt-1 w-full">
          {fileList.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white/95 border border-slate-200/90 text-xs shadow-xs backdrop-blur-sm animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  PDF
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate text-xs">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleRemove(idx, e)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Remove PDF"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Existing Server Document Link */}
      {existingUrl ? (
        <div className="pt-0.5">
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0372CC]/10 hover:bg-[#0372CC]/15 border border-[#0372CC]/25 text-[11px] text-[#0372CC] font-semibold transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{existingLabel}</span>
            <Download className="w-3 h-3 ml-0.5 opacity-70" />
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function VendorPortalPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'profile'

  // Submit Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    invoice_amount: '',
    currency: 'INR',
    invoice_date: new Date().toISOString().split('T')[0],
    description_of_services: '',
    bnc_poc: '',
    files: []
  });
  const [invoiceError, setInvoiceError] = useState('');

  // Profile Form State
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileForm, setProfileForm] = useState({
    vendor_name: '',
    email: '',
    phone_number: '',
    subject_to_tds: false,
    lower_deduction_cert: false,
    lower_deduction_cert_file: null,
    existing_lower_deduction_cert_url: '',
    msme_certificate: false,
    msme_cert_file: null,
    existing_msme_cert_url: '',
    reverse_charge_applicable: false,
    has_gst: false,
    gst_number: '',
    gst_certificate_file: null,
    existing_gst_certificate_url: '',
    other_documents: [],
    new_other_documents: []
  });

  // Feedback Modal State for Animated Success / Error Pop-up
  const [feedbackModal, setFeedbackModal] = useState({
    show: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: '',
    onAction: null,
  });

  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const [showSubmittedDetails, setShowSubmittedDetails] = useState(false);

  // Safe JSON Response reader
  const readSafeJsonResponse = async (res, fallbackError = 'Request failed') => {
    if (!res) return { ok: false, data: null, error: 'Network error or server unreachable' };
    let data = null;
    let text = '';
    try {
      text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
    } catch (err) {
      return { ok: false, data: null, error: err.message || 'Failed to read response' };
    }

    if (!res.ok) {
      const msg = data?.error || data?.message || (text && !text.startsWith('<') ? text : `${fallbackError} (${res.status})`);
      return { ok: false, data, error: msg };
    }

    return { ok: true, data: data || {}, error: null };
  };

  const fetchPortalData = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
      const user = data?.user;
      if (user) {
        const initialName = user.user_metadata?.full_name || '';
        const initialEmail = user.email || '';
        const initialPhone = user.phone || user.user_metadata?.phone_number || '';
        setProfileForm((prev) => ({
          ...prev,
          vendor_name: prev.vendor_name || initialName,
          email: prev.email || initialEmail,
          phone_number: prev.phone_number || initialPhone,
        }));
        if (initialName && typeof window !== 'undefined') {
          localStorage.setItem('portal_vendor_name', initialName);
          window.dispatchEvent(new CustomEvent('vendor_profile_updated', { detail: { vendor_name: initialName } }));
        }
      }

      const [profileRes, invoicesRes] = await Promise.all([
        fetch('/other-modules/vendor/api/portal/profile').catch(() => null),
        fetch('/other-modules/vendor/api/portal/invoices').catch(() => null)
      ]);

      const profileParsed = await readSafeJsonResponse(profileRes, 'Failed to load profile');
      if (profileParsed.ok && profileParsed.data?.profile) {
        const p = profileParsed.data.profile;
        setProfile(p);
        const resolvedName = p.vendor_name || user?.user_metadata?.full_name || '';
        if (resolvedName && typeof window !== 'undefined') {
          localStorage.setItem('portal_vendor_name', resolvedName);
          window.dispatchEvent(new CustomEvent('vendor_profile_updated', { detail: { vendor_name: resolvedName, is_profile_completed: p.is_profile_completed } }));
        }

        setProfileForm({
          vendor_name: resolvedName,
          email: p.email || user?.email || '',
          phone_number: p.phone_number || user?.phone || user?.user_metadata?.phone_number || '',
          subject_to_tds: Boolean(p.subject_to_tds),
          lower_deduction_cert: Boolean(p.lower_deduction_cert),
          lower_deduction_cert_file: null,
          existing_lower_deduction_cert_url: p.lower_deduction_cert_url || '',
          msme_certificate: Boolean(p.msme_certificate),
          msme_cert_file: null,
          existing_msme_cert_url: p.msme_cert_url || '',
          reverse_charge_applicable: Boolean(p.reverse_charge_applicable),
          has_gst: Boolean(p.gst_number || p.gst_certificate_url),
          gst_number: p.gst_number || '',
          gst_certificate_file: null,
          existing_gst_certificate_url: p.gst_certificate_url || '',
          other_documents: Array.isArray(p.other_documents) ? p.other_documents : [],
          new_other_documents: []
        });

        // If profile is not yet completed, default activeTab to profile
        if (!p.is_profile_completed) {
          setActiveTab('profile');
        }
      }

      const invoicesParsed = await readSafeJsonResponse(invoicesRes, 'Failed to load invoices');
      if (invoicesParsed.ok && invoicesParsed.data?.invoices) {
        setInvoices(invoicesParsed.data.invoices || []);
      }
    } catch (err) {
      console.error('Failed to load vendor portal data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortalData();
  }, [fetchPortalData]);

  // Handle Profile Save / Submit
  const handleSaveProfile = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    setProfileError('');
    setProfileSuccess('');
    setSavingProfile(true);

    try {
      const fd = new FormData();
      fd.append('vendor_name', profileForm.vendor_name || 'Vendor');
      fd.append('email', profileForm.email);
      fd.append('phone_number', profileForm.phone_number);
      fd.append('subject_to_tds', String(profileForm.subject_to_tds));
      fd.append('lower_deduction_cert', String(profileForm.lower_deduction_cert));
      fd.append('msme_certificate', String(profileForm.msme_certificate));
      fd.append('reverse_charge_applicable', String(profileForm.reverse_charge_applicable));
      fd.append('gst_number', profileForm.gst_number || '');

      fd.append('existing_gst_certificate_url', profileForm.existing_gst_certificate_url || '');
      fd.append('existing_lower_deduction_cert_url', profileForm.existing_lower_deduction_cert_url || '');
      fd.append('existing_msme_cert_url', profileForm.existing_msme_cert_url || '');
      fd.append('existing_other_documents', JSON.stringify(profileForm.other_documents || []));

      if (profileForm.gst_certificate_file) {
        fd.append('gst_certificate_file', profileForm.gst_certificate_file);
      }
      if (profileForm.lower_deduction_cert_file) {
        fd.append('lower_deduction_cert_file', profileForm.lower_deduction_cert_file);
      }
      if (profileForm.msme_cert_file) {
        fd.append('msme_cert_file', profileForm.msme_cert_file);
      }

      for (const file of profileForm.new_other_documents) {
        fd.append('new_other_documents', file);
      }

      const res = await fetch('/other-modules/vendor/api/portal/profile', {
        method: 'POST',
        body: fd
      }).catch((netErr) => {
        throw new Error('Network error: ' + (netErr.message || 'Service unreachable'));
      });

      const parsed = await readSafeJsonResponse(res, 'Failed to update profile');
      if (!parsed.ok) {
        throw new Error(parsed.error || 'Failed to update profile');
      }

      setProfileSuccess('Vendor profile registration saved successfully!');
      if (parsed.data?.profile) {
        setProfile(parsed.data.profile);
      }
      await fetchPortalData();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vendor_profile_updated', {
          detail: {
            vendor_name: profileForm.vendor_name,
            is_profile_completed: true
          }
        }));
      }

      // Animated Success Pop-up Card
      setFeedbackModal({
        show: true,
        type: 'success',
        title: 'Submission Complete!',
        message: 'Your vendor profile & compliance details have been registered successfully. Invoice submissions are now active.',
        onAction: () => setActiveTab('invoices')
      });
    } catch (err) {
      const errorMsg = err.message || 'Failed to save profile';
      setProfileError(errorMsg);
      // Animated Failure Pop-up Card
      setFeedbackModal({
        show: true,
        type: 'error',
        title: 'Submission Failed',
        message: errorMsg,
        onAction: null
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Invoice Submit
  const handleSubmitInvoice = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    setInvoiceError('');
    
    if (!profile?.is_profile_completed) {
      const msg = 'Action Required: Please complete your vendor profile registration first.';
      setInvoiceError(msg);
      setShowInvoiceModal(false);
      setActiveTab('profile');
      setFeedbackModal({
        show: true,
        type: 'error',
        title: 'Registration Required',
        message: msg,
        onAction: () => setActiveTab('profile')
      });
      return;
    }

    setSubmittingInvoice(true);

    try {
      if (!invoiceForm.invoice_amount || !invoiceForm.invoice_date || !invoiceForm.description_of_services || !invoiceForm.bnc_poc) {
        throw new Error('Please fill all mandatory fields.');
      }

      const fd = new FormData();
      fd.append('invoice_number', invoiceForm.invoice_number);
      fd.append('invoice_amount', invoiceForm.invoice_amount);
      fd.append('currency', invoiceForm.currency);
      fd.append('invoice_date', invoiceForm.invoice_date);
      fd.append('description_of_services', invoiceForm.description_of_services);
      fd.append('bnc_poc', invoiceForm.bnc_poc);

      for (const file of invoiceForm.files) {
        fd.append('invoice_files', file);
      }

      const res = await fetch('/other-modules/vendor/api/portal/invoices', {
        method: 'POST',
        body: fd
      }).catch((netErr) => {
        throw new Error('Network error: ' + (netErr.message || 'Service unreachable'));
      });

      const parsed = await readSafeJsonResponse(res, 'Failed to submit invoice');
      if (!parsed.ok) {
        throw new Error(parsed.error || 'Failed to submit invoice');
      }

      setShowInvoiceModal(false);
      setInvoiceForm({
        invoice_number: '',
        invoice_amount: '',
        currency: 'INR',
        invoice_date: new Date().toISOString().split('T')[0],
        description_of_services: '',
        bnc_poc: '',
        files: []
      });
      await fetchPortalData();

      // Animated Success Pop-up Card for Invoice
      setFeedbackModal({
        show: true,
        type: 'success',
        title: 'Invoice Submitted Successfully!',
        message: 'Your invoice has been submitted and is currently queued for review and clearance by the finance team.',
        onAction: () => setActiveTab('invoices')
      });
    } catch (err) {
      const errorMsg = err.message || 'Failed to submit invoice';
      setInvoiceError(errorMsg);
      setFeedbackModal({
        show: true,
        type: 'error',
        title: 'Invoice Submission Failed',
        message: errorMsg,
        onAction: null
      });
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.invoice_amount || 0), 0);
  const pendingInvoices = invoices.filter(i => i.status === 'submitted' || i.status === 'under_review');
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const totalPaidAmount = paidInvoices.reduce((sum, i) => sum + Number(i.invoice_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading your Partner Portal...</p>
      </div>
    );
  }

  const isProfileNotCompleted = !profile || !profile.is_profile_completed;

  return (
    <div className="space-y-6">
      {/* First-time Onboarding Alert Banner */}
      {isProfileNotCompleted ? (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-sm shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Action Required: Complete Compliance Onboarding
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Please complete your tax, MSME, and GST documentation below to activate seamless invoice submissions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Profile registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Hero Welcome Header & Action */}
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 truncate">
            Welcome, {profile?.vendor_name || profileForm.vendor_name || 'Vendor'}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (isProfileNotCompleted) {
                setActiveTab('profile');
                return;
              }
              setShowInvoiceModal(true);
            }}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              isProfileNotCompleted
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-300/80'
                : 'bg-[#0372CC] hover:bg-[#025da7] active:scale-95 text-white shadow-sm shadow-[#0372CC]/25'
            }`}
            title={isProfileNotCompleted ? "Complete profile registration to unlock invoice submission" : "Submit New Invoice"}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Submit New Invoice</span>
            <span className="inline sm:hidden">Submit Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoiced</span>
            <div className="p-2 rounded-xl bg-slate-100/80 text-slate-700 shadow-2xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹ {totalInvoiced.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{invoices.length} invoices submitted</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Clearance / Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {pendingInvoices.length} <span className="text-sm font-normal text-slate-500">Invoices</span>
          </p>
          <span className="text-xs text-amber-600 mt-1 block font-medium">Pending Finance Approval</span>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Settled (Paid)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            ₹ {totalPaidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">{paidInvoices.length} settled payments</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit backdrop-blur-sm border border-slate-200/70">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'invoices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Invoices ({invoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Profile registration</span>
          {!profile?.is_profile_completed ? (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          ) : null}
        </button>
      </div>

      {/* Tab 1: Submitted Invoices List */}
      {activeTab === 'invoices' ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-150 flex flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Submitted Invoices History</h3>
            </div>
            <button
              onClick={() => {
                if (isProfileNotCompleted) {
                  setActiveTab('profile');
                  return;
                }
                setShowInvoiceModal(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 shadow-2xs ${
                isProfileNotCompleted
                  ? 'bg-slate-200/80 text-slate-500 cursor-not-allowed hover:bg-slate-300'
                  : 'bg-[#0372CC]/10 text-[#0372CC] hover:bg-[#0372CC]/20 border border-[#0372CC]/20'
              }`}
              title={isProfileNotCompleted ? "Complete profile registration to submit invoices" : "New Entry"}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Entry</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Description of Services</th>
                  <th className="px-4 py-3.5">BNC POC</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-700">No invoices submitted yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-semibold text-slate-900">
                        {inv.invoice_number || 'INV-UNSPECIFIED'}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {inv.invoice_date}
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-900">
                        {inv.currency || 'INR'} {Number(inv.invoice_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 min-w-[220px] max-w-sm text-xs text-slate-700 leading-relaxed break-words whitespace-normal font-medium">
                        {inv.description_of_services}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {inv.bnc_poc}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.status === 'approved'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : inv.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                            {inv.status === 'paid' ? 'Paid' : inv.status === 'approved' ? 'Approved' : inv.status === 'rejected' ? 'Rejected' : 'Under Review'}
                          </span>
                          {inv.payment_reference ? (
                            <span className="block text-[10px] text-slate-500 font-mono">
                              UTR: {inv.payment_reference}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {Array.isArray(inv.invoice_documents) && inv.invoice_documents.length > 0 ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.invoice_documents.map((doc, idx) => (
                              <a
                                key={idx}
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-[#0372CC] font-semibold shadow-2xs transition-colors"
                                title={doc.name}
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Copy {idx + 1}</span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No File</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : profile?.is_profile_completed ? (
        /* Tab 2 (Completed): Verified Profile Status Card & Read-Only Details View */
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Premium Glassmorphic Verification Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] p-6 sm:p-8 text-center transition-all">
            {/* Ambient liquid glass decorative glows */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 right-0 w-36 h-36 bg-[#0372CC]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Animated Shield Icon with Glowing Aura */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-emerald-500/25 rounded-2xl blur-lg scale-110" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/30">
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-xs" />
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-2.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Verified Account</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Vendor Profile Registered & Saved Successfully
              </h3>

              {/* 5 Compliance Subcards: TDS, LOWER DED., MSME, GST, RCM */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full mt-5 pt-5 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TDS</span>
                  <div className="mt-1">
                    {profile?.subject_to_tds ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <X className="w-3.5 h-3.5 stroke-[3] text-slate-400" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LOWER DED.</span>
                  <div className="mt-1">
                    {profile?.lower_deduction_cert ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <X className="w-3.5 h-3.5 stroke-[3] text-slate-400" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MSME</span>
                  <div className="mt-1">
                    {profile?.msme_certificate ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <X className="w-3.5 h-3.5 stroke-[3] text-slate-400" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GST</span>
                  <div className="mt-1">
                    {(profile?.is_gst_registered || profile?.gst_number) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <X className="w-3.5 h-3.5 stroke-[3] text-slate-400" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/90 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RCM</span>
                  <div className="mt-1">
                    {profile?.reverse_charge_applicable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <X className="w-3.5 h-3.5 stroke-[3] text-slate-400" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 w-full">
                <button
                  type="button"
                  onClick={() => setShowSubmittedDetails((prev) => !prev)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-98"
                >
                  <Eye className="w-4 h-4 text-[#0372CC]" />
                  <span>{showSubmittedDetails ? 'Hide Details' : 'See Details'}</span>
                  {showSubmittedDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Read-Only Details Section (Expanded when See Details is clicked) */}
          {showSubmittedDetails ? (
            <div className="space-y-6 pt-2 animate-in fade-in-50 duration-200">
              {/* Section 1: Basic Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>1. Basic Company Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Company / Vendor Name</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {profile?.vendor_name || profileForm.vendor_name || 'Vendor'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registered Email</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 truncate" title={profile?.email || profileForm.email}>
                      {profile?.email || profileForm.email || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {profile?.phone_number || profileForm.phone_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: TDS & Tax Deductions */}
              <div className="pt-4 border-t border-slate-150">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  2. TDS & Tax Deductions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Subject to TDS</span>
                      <span className="text-[11px] text-slate-500">Applicable for TDS deductions under Income Tax Act</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      profile?.subject_to_tds
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {profile?.subject_to_tds ? 'Yes (Applicable)' : 'No'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Lower Deduction Certificate</span>
                        <span className="text-[11px] text-slate-500">Lower / Nil TDS certificate</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        profile?.lower_deduction_cert
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {profile?.lower_deduction_cert ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {profile?.lower_deduction_cert && profile?.lower_deduction_cert_url ? (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">Uploaded Certificate:</span>
                        <a
                          href={profile.lower_deduction_cert_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0372CC] hover:bg-blue-50 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Section 3: MSME & GST Compliance */}
              <div className="pt-4 border-t border-slate-150">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  3. MSME & GST Compliance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">MSME Registered</span>
                        <span className="text-[11px] text-slate-500">Registered under MSME Development Act</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        profile?.msme_certificate
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {profile?.msme_certificate ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {profile?.msme_certificate && profile?.msme_cert_url ? (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">MSME Certificate:</span>
                        <a
                          href={profile.msme_cert_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0372CC] hover:bg-blue-50 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Reverse Charge Applicable (RCM)</span>
                      <span className="text-[11px] text-slate-500">Reverse charge basis tax liability</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      profile?.reverse_charge_applicable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {profile?.reverse_charge_applicable ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {/* GST Registration Info */}
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">GST Identification</span>
                        <span className="text-[11px] text-slate-500">
                          {profile?.gst_number ? `GSTIN: ${profile.gst_number}` : 'No GST registration submitted'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        profile?.gst_number
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {profile?.gst_number ? 'GST Registered' : 'Not Registered'}
                      </span>
                    </div>
                    {profile?.gst_certificate_url ? (
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-medium">GST Certificate Copy:</span>
                        <a
                          href={profile.gst_certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0372CC] hover:bg-blue-50 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download GST PDF</span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Section 4: Supporting Documents */}
              {Array.isArray(profile?.other_documents) && profile.other_documents.length > 0 ? (
                <div className="pt-4 border-t border-slate-150">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    4. Supporting Documents On Record
                  </h4>
                  <div className="space-y-2">
                    {profile.other_documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-xs">
                        <span className="text-slate-800 font-medium truncate max-w-sm">{doc.name || `Document ${idx + 1}`}</span>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0372CC] hover:bg-blue-50 transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Security & Authorization Notice */}
              <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-200 text-slate-600 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Registration Details Locked</span>
                  <span>
                    Compliance details cannot be edited directly once submitted. If you need to update your GSTIN, MSME, or tax status, please contact the BNC Finance Operations team.
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* Tab 2 (Incomplete): Profile & Compliance Onboarding Form */
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="pb-6 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-100 text-[#0372CC]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vendor profile registration</h3>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {profileError ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
                {profileError}
              </div>
            ) : null}

            {profileSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            ) : null}

            {/* Section 1: Basic Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                1. Basic Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vendor / Company Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={profileForm.vendor_name || 'Vendor'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-800 font-semibold cursor-not-allowed shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={profileForm.email}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-800 font-semibold cursor-not-allowed shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Phone Number
                  </label>
                  <input
                    type="tel"
                    readOnly
                    disabled
                    value={profileForm.phone_number || 'N/A'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-100/80 text-slate-800 font-semibold cursor-not-allowed shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: TDS & Lower Deduction */}
            <div className="pt-4 border-t border-slate-150">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                2. TDS & Tax Deductions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Subject to TDS */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">Subject to TDS</span>
                    <span className="text-xs text-slate-500">Applicable for TDS deductions under Income Tax Act</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.subject_to_tds}
                      onChange={(e) => setProfileForm({ ...profileForm, subject_to_tds: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0372CC]"></div>
                  </label>
                </div>

                {/* Lower Deduction Certificate */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">Lower Deduction Certificate</span>
                      <span className="text-xs text-slate-500">Do you possess a Lower / Nil TDS certificate?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.lower_deduction_cert}
                        onChange={(e) => setProfileForm({ ...profileForm, lower_deduction_cert: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0372CC]"></div>
                    </label>
                  </div>

                  {profileForm.lower_deduction_cert ? (
                    <div className="pt-2 border-t border-slate-200/80">
                      <ProfessionalFileInput
                        id="lower_deduction_file"
                        label="Upload Lower Deduction Certificate (PDF only)"
                        accept=".pdf"
                        files={profileForm.lower_deduction_cert_file}
                        onChange={(file) => setProfileForm({ ...profileForm, lower_deduction_cert_file: file })}
                        existingUrl={profileForm.existing_lower_deduction_cert_url}
                        existingLabel="View Current PDF Certificate"
                        helperText="PDF document only (Max 10MB)"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Section 3: MSME & GST */}
            <div className="pt-4 border-t border-slate-150">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                3. MSME & GST Compliance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* MSME Certificate */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">MSME Certificate</span>
                      <span className="text-xs text-slate-500">Registered under MSME Development Act</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.msme_certificate}
                        onChange={(e) => setProfileForm({ ...profileForm, msme_certificate: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0372CC]"></div>
                    </label>
                  </div>

                  {profileForm.msme_certificate ? (
                    <div className="pt-2 border-t border-slate-200/80">
                      <ProfessionalFileInput
                        id="msme_file"
                        label="Upload MSME Certificate (PDF only)"
                        accept=".pdf"
                        files={profileForm.msme_cert_file}
                        onChange={(file) => setProfileForm({ ...profileForm, msme_cert_file: file })}
                        existingUrl={profileForm.existing_msme_cert_url}
                        existingLabel="View Current MSME Certificate"
                        helperText="PDF document only (Max 10MB)"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Reverse Charge Applicable */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">Reverse Charge Applicable (RCM)</span>
                    <span className="text-xs text-slate-500">Is tax liability payable on reverse charge basis?</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.reverse_charge_applicable}
                      onChange={(e) => setProfileForm({ ...profileForm, reverse_charge_applicable: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0372CC]"></div>
                  </label>
                </div>

                {/* GST Registration Toggle & Upload */}
                <div className="sm:col-span-2 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block">GST Registered</span>
                      <span className="text-xs text-slate-500">Do you possess a GST Identification Number (GSTIN)?</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileForm.has_gst}
                        onChange={(e) => setProfileForm({ ...profileForm, has_gst: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0372CC]"></div>
                    </label>
                  </div>

                  {profileForm.has_gst ? (
                    <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          GST Identification Number (GSTIN) *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 29AAAAA0000A1Z5"
                          value={profileForm.gst_number}
                          onChange={(e) => setProfileForm({ ...profileForm, gst_number: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] font-mono uppercase bg-white shadow-2xs placeholder:text-slate-700"
                        />
                      </div>
                      <div>
                        <ProfessionalFileInput
                          id="gst_cert_file"
                          label="Upload GST Certificate (PDF only)"
                          accept=".pdf"
                          files={profileForm.gst_certificate_file}
                          onChange={(file) => setProfileForm({ ...profileForm, gst_certificate_file: file })}
                          existingUrl={profileForm.existing_gst_certificate_url}
                          existingLabel="View Current GST Certificate"
                          helperText="PDF document only (Max 10MB)"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Section 4: Other Documents Upload */}
            <div className="pt-4 border-t border-slate-150">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                4. Other Documents (Multiple PDFs)
              </h4>
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 shadow-2xs">
                <ProfessionalFileInput
                  id="other_documents_file"
                  label="Upload Additional Supporting Documents (PDF only)"
                  multiple={true}
                  accept=".pdf"
                  files={profileForm.new_other_documents}
                  onChange={(files) => setProfileForm({ ...profileForm, new_other_documents: files || [] })}
                  helperText="Multiple PDF documents allowed (Max 10MB each)"
                />

                {profileForm.other_documents.length > 0 ? (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-700 block mb-1.5">Existing Uploaded Files on Record:</span>
                    <div className="space-y-1.5">
                      {profileForm.other_documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                          <span className="text-slate-700 font-medium truncate max-w-xs">{doc.name || `File ${idx + 1}`}</span>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#0372CC] hover:text-[#025da7] font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50/60"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0372CC] hover:bg-[#025da7] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_8px_16px_-4px_rgba(3,114,204,0.35)] hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_12px_20px_-4px_rgba(3,114,204,0.45)] transition-all duration-300 disabled:opacity-50"
              >
                {savingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{savingProfile ? 'Saving Registration...' : 'Profile registration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Full-Height Drawer: Submit New Invoice */}
      {showInvoiceModal ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setShowInvoiceModal(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/30 backdrop-blur-3xl border-l border-white/50 shadow-[-30px_0_70px_rgba(3,114,204,0.22)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              {/* Vibrant ambient liquid glass background glow orbs */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#0372CC]/40 via-sky-400/30 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-500/30 via-violet-400/25 to-sky-300/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-8 w-72 h-72 bg-gradient-to-tl from-[#0372CC]/35 via-blue-400/30 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Drawer Header with transparent liquid glass */}
              <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/35 bg-white/20 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0372CC]/15 text-[#0372CC] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">Submit New Invoice</h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">Provide invoice details and upload bill copy</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/40 backdrop-blur-md border border-white/40 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              {isProfileNotCompleted ? (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-amber-100/90 text-amber-600 flex items-center justify-center shadow-inner">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h4 className="text-lg font-bold text-slate-900">Profile Registration Required</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      You must complete your company profile registration and compliance setup (GST, MSME, TDS exemptions) before you can submit service invoices.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInvoiceModal(false);
                      setActiveTab('profile');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0372CC] hover:bg-[#025da7] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#0372CC]/25 transition-all active:scale-95"
                  >
                    <span>Complete Profile Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {invoiceError ? (
                      <div className="p-3.5 rounded-xl bg-rose-100/90 border border-rose-300 text-rose-800 text-xs font-semibold backdrop-blur-md">
                        {invoiceError}
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. INV-2026-089"
                          value={invoiceForm.invoice_number}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 font-mono text-slate-900 placeholder:text-slate-700 placeholder:font-sans transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Invoice Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={invoiceForm.invoice_date}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 text-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Invoice Amount *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="0.00"
                          value={invoiceForm.invoice_amount}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_amount: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 font-bold text-slate-900 placeholder:text-slate-700 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Currency
                        </label>
                        <select
                          value={invoiceForm.currency}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, currency: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 font-semibold text-slate-900 transition-all cursor-pointer"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        BNC Point of Contact (BNC POC) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe / Finance Department"
                        value={invoiceForm.bnc_poc}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, bnc_poc: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 text-slate-900 placeholder:text-slate-700 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Description of Services *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide brief details of products, services, or milestones delivered"
                        value={invoiceForm.description_of_services}
                        onChange={(e) => setInvoiceForm({ ...invoiceForm, description_of_services: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 text-slate-900 placeholder:text-slate-700 transition-all resize-none"
                      />
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.03)] w-full max-w-full overflow-hidden">
                      <ProfessionalFileInput
                        id="drawer_invoice_files"
                        label="Upload Invoice Copy / Documents (PDF only, Multiple allowed)"
                        multiple={true}
                        accept=".pdf"
                        files={invoiceForm.files}
                        onChange={(files) => setInvoiceForm({ ...invoiceForm, files: files || [] })}
                        helperText="PDF documents only (Max 10MB each)"
                      />
                    </div>
                  </div>

                  {/* Sticky Drawer Footer with Glassmorphism */}
                  <div className="relative z-10 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/35 bg-white/20 backdrop-blur-2xl flex items-center justify-end gap-2.5 sm:gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                    <button
                      type="button"
                      onClick={() => setShowInvoiceModal(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl bg-white/30 hover:bg-white/50 border border-white/50 backdrop-blur-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitInvoice}
                      disabled={submittingInvoice}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-[#0372CC] hover:bg-[#025da7] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_8px_16px_-4px_rgba(3,114,204,0.35)] hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_12px_20px_-4px_rgba(3,114,204,0.45)] transition-all duration-300 disabled:opacity-50"
                    >
                      {submittingInvoice ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>{submittingInvoice ? 'Submitting...' : 'Submit Invoice'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Animated Pop-Up Feedback Card (Clean, Modern, Simple) */}
      {feedbackModal.show ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            {/* Clean Icon Badge */}
            <div className="mx-auto flex items-center justify-center pt-1">
              {feedbackModal.type === 'success' ? (
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs">
                  <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {feedbackModal.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed px-2">
                {feedbackModal.message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const action = feedbackModal.onAction;
                  setFeedbackModal({ show: false, type: 'success', title: '', message: '', onAction: null });
                  if (action) action();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-xs transition-all duration-150 active:scale-98 ${
                  feedbackModal.type === 'success'
                    ? 'bg-[#0372CC] hover:bg-[#025da7]'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {feedbackModal.type === 'success' ? 'Continue' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
