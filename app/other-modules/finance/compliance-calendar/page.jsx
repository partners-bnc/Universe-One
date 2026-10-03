'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components-homepage/Navbar';
import { useWorkspaceRouting } from '@/app/components-homepage/useWorkspaceRouting';
import {
  Building2,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  Trash2,
  FileSpreadsheet,
  X,
  ArrowLeft,
  Sparkles,
  FileText,
  MapPin,
  FileCheck,
  Globe,
  CreditCard,
  Hash,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Lock,
} from 'lucide-react';

import { ModuleAccessGate } from '@/app/components-homepage/ModuleAccessGate';

const STORAGE_COMPANIES_KEY = 'finance_compliance_companies_v2';
const STORAGE_ITEMS_PREFIX = 'finance_compliance_items_';
const STORAGE_PERSONS_PREFIX = 'finance_compliance_persons_';

export default function ComplianceCalendarCompaniesPage() {
  const router = useRouter();
  const { loading, isAuthenticated, workspaceHref, user } = useWorkspaceRouting();
  const workspaceLabel = loading ? 'Loading' : isAuthenticated ? 'Workspace' : 'Login';

  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Two-step verification deletion state
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [deleteStep1Input, setDeleteStep1Input] = useState('');
  const [deleteStep2Input, setDeleteStep2Input] = useState('');
  const [pasteWarning, setPasteWarning] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Company Form State with optional PAN, CIN, Website
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    address: '',
    gst_number: '',
    pan_number: '',
    cin_number: '',
    website: '',
    note: '',
  });

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      setLoadingData(true);
      let list = [];
      try {
        const res = await fetch('/api/finance/companies');
        const data = await res.json().catch(() => ({}));
        if (data.companies && data.companies.length > 0) {
          list = data.companies;
        }
      } catch (err) {
        console.warn('API error fetching companies:', err);
      }

      if (list.length === 0 && typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_COMPANIES_KEY);
        if (stored) {
          list = JSON.parse(stored);
        }
      }

      setCompanies(list);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    const term = searchTerm.toLowerCase();
    return companies.filter(
      (c) =>
        c.company_name?.toLowerCase().includes(term) ||
        c.industry?.toLowerCase().includes(term) ||
        c.gstin?.toLowerCase().includes(term) ||
        c.gst_number?.toLowerCase().includes(term) ||
        c.pan_number?.toLowerCase().includes(term) ||
        c.cin_number?.toLowerCase().includes(term) ||
        c.address?.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  // Handle Create Company
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      alert('Please enter a Company Name.');
      return;
    }

    setSubmitting(true);
    const companySlug = formData.company_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newId = `company-${companySlug}-${Date.now()}`;

    const newCompany = {
      id: newId,
      company_name: formData.company_name.trim(),
      industry: formData.industry.trim() || '',
      address: formData.address.trim() || '',
      gstin: formData.gst_number.trim() || '',
      gst_number: formData.gst_number.trim() || '',
      pan_number: formData.pan_number.trim() || '',
      cin_number: formData.cin_number.trim() || '',
      website: formData.website.trim() || '',
      note: formData.note.trim() || '',
      is_active: true,
      itemsCount: 0,
      compliance_items: [],
      personsCount: 0,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/finance/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCompany,
          load_default_template: false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.company?.id) {
        newCompany.id = data.company.id;
      }
    } catch (err) {
      console.warn('API create company fallback:', err);
    }

    // Save locally
    const updated = [...companies, newCompany];
    setCompanies(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(updated));
      localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${newCompany.id}`, JSON.stringify([]));
    }

    setFormData({
      company_name: '',
      industry: '',
      address: '',
      gst_number: '',
      pan_number: '',
      cin_number: '',
      website: '',
      note: '',
    });
    setSubmitting(false);
    setIsAddDrawerOpen(false);

    // Navigate to company workspace
    router.push(`/other-modules/finance/compliance-calendar/${newCompany.id}`);
  };

  // Open 2-step verification modal
  const openDeleteModal = (company, e) => {
    if (e) e.stopPropagation();
    setCompanyToDelete(company);
    setDeleteStep1Input('');
    setDeleteStep2Input('');
    setPasteWarning('');
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (isDeleting) return;
    setCompanyToDelete(null);
    setDeleteStep1Input('');
    setDeleteStep2Input('');
    setPasteWarning('');
  };

  // Anti-Copy-Paste handler
  const handlePreventPaste = (e) => {
    e.preventDefault();
    setPasteWarning('Copy & paste is strictly blocked for security verification. Please type manually.');
    setTimeout(() => {
      setPasteWarning('');
    }, 4000);
  };

  // Verification checks
  const isStep1Valid = Boolean(
    companyToDelete &&
      deleteStep1Input.trim().toLowerCase() === companyToDelete.company_name.trim().toLowerCase()
  );
  const isStep2Valid = deleteStep2Input.trim().toUpperCase() === 'DELETE';
  const isDeleteReady = isStep1Valid && isStep2Valid;

  // Handle Confirmed Delete Company
  const handleConfirmDeleteCompany = async () => {
    if (!companyToDelete || !isDeleteReady || isDeleting) return;

    setIsDeleting(true);
    const id = companyToDelete.id;

    try {
      await fetch(`/api/finance/companies/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete company fallback:', err);
    }

    const updated = companies.filter((c) => c.id !== id);
    setCompanies(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(updated));
      localStorage.removeItem(`${STORAGE_ITEMS_PREFIX}${id}`);
      localStorage.removeItem(`${STORAGE_PERSONS_PREFIX}${id}`);
    }

    setIsDeleting(false);
    setCompanyToDelete(null);
    setDeleteStep1Input('');
    setDeleteStep2Input('');
    setPasteWarning('');
  };

  return (
    <ModuleAccessGate moduleKey="finance" moduleLabel="Finance">
      <Navbar
        workspaceHref={workspaceHref}
        workspaceLabel={workspaceLabel}
        othersHref="/other-modules"
        isOthersActive
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <main
        className="relative min-h-screen w-screen pt-28 md:pt-32 pb-20 bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_50%,#f0fdf4_100%)] overflow-y-auto"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Soft Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header section with back button, small stylish heading & action */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push('/other-modules/finance')}
                  className="p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                  title="Back to Finance Module"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#3170c6] bg-[#edf4fc] border border-[#afd0f4] shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Compliance Governance
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Compliance Calendar Tracker
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search companies..."
                  className="bg-white/90 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#3170c6] shadow-xs"
                />
              </div>

              <button
                onClick={() => setIsAddDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white font-bold text-xs transition-all duration-300 shadow-md shadow-[#3170c6]/20 hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company / Client</span>
              </button>
            </div>
          </div>

          {/* Companies 3-Card Grid */}
          {filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 bg-white/70 border border-white/80 rounded-3xl backdrop-blur-2xl shadow-[0_10px_30px_rgba(15,23,42,0.03)] text-center">
              <div className="w-16 h-16 bg-[#edf4fc] text-[#3170c6] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Companies Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Add your first company/client to start tracking statutory due dates, payment records, and client reports.
              </p>
              <button
                onClick={() => setIsAddDrawerOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white font-bold text-xs shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company / Client</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => router.push(`/other-modules/finance/compliance-calendar/${comp.id}`)}
                  className="group relative cursor-pointer flex flex-col justify-between p-6 bg-white/85 hover:bg-white border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(49,112,198,0.08)] hover:border-[#afd0f4] backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="w-12 h-12 bg-[#edf4fc] group-hover:bg-[#3170c6] text-[#3170c6] group-hover:text-white rounded-xl flex items-center justify-center transition-colors duration-300 shadow-xs">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => openDeleteModal(comp, e)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#3170c6] transition-colors truncate">
                      {comp.company_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {comp.industry || 'Corporate Client'}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {(comp.gst_number || comp.gstin) && (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-[10px] font-bold text-slate-600">
                          GSTIN: {comp.gst_number || comp.gstin}
                        </span>
                      )}
                      {comp.pan_number && (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-[10px] font-bold text-slate-600">
                          PAN: {comp.pan_number}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp.compliance_items ? comp.compliance_items.length : (comp.itemsCount ?? 0)} Compliances</span>
                    </div>

                    <span className="font-bold text-[#3170c6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                      Open Tracker →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          SLIDE-OVER RIGHT PANEL (DRAWER): ADD COMPANY / CLIENT
          Includes Company Name, Industry, Address, GST, PAN, CIN, Website, Note
         ========================================================================= */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsAddDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Vibrant ambient liquid glass background glow orbs */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/30 via-sky-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 via-teal-300/20 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-8 w-72 h-72 bg-gradient-to-tl from-[#3170c6]/25 via-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Drawer Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add Company / Client</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Register a company entity to start compliance tracking
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Form */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                <form id="add-company-form" onSubmit={handleCreateCompany} className="space-y-4 text-xs">
                  
                  {/* 1. Company Name */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#3170c6]" />
                      <span>Company Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp Private Limited"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* 2. Industry / Sector */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#3170c6]" />
                      <span>Industry / Sector</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Financial Services / Manufacturing / IT"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* 3. Address */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3170c6]" />
                      <span>Address</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. DLF Cyber City, Tower B, Level 8, Gurugram, Haryana"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* 4. GST Number & PAN Number (2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>GST Number</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={formData.gst_number}
                        onChange={(e) => setFormData({ ...formData, gst_number: e.target.value.toUpperCase() })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all uppercase"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>PAN Number</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ABCDE1234F"
                        value={formData.pan_number}
                        onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all uppercase"
                      />
                    </div>
                  </div>

                  {/* 5. CIN Number & Website (2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>CIN Number</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. U74140DL2020PTC123456"
                        value={formData.cin_number}
                        onChange={(e) => setFormData({ ...formData, cin_number: e.target.value.toUpperCase() })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all uppercase"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>Website</span>
                      </label>
                      <input
                        type="url"
                        placeholder="e.g. https://company.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* 6. Note / Remarks */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#3170c6]" />
                      <span>Note / Remarks</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Statutory audit handling, quarterly review schedule..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Drawer Footer with transparent liquid glass */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-company-form"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all hover:shadow-lg cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TWO-STEP VERIFICATION COMPANY DELETION MODAL (ANTI-COPY/PASTE PROTECTED)
         ========================================================================= */}
      {companyToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={closeDeleteModal} />

          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-red-200/80 rounded-3xl shadow-[0_25px_70px_rgba(220,38,38,0.2)] overflow-hidden z-10 transition-all duration-300">
            {/* Ambient liquid glow */}
            <div className="absolute -top-16 -right-16 w-60 h-60 bg-red-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative z-10 flex items-start justify-between p-6 border-b border-red-100 bg-red-50/40">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-xs shrink-0 border border-red-200">
                  <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-200">
                      High-Security Action
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    2-Step Verification to Delete
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Permanent destructive action for company workspace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 p-6 space-y-5">
              {/* Warning box */}
              <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200/80 text-xs text-red-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Permanent Data Deletion Notice</span>
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed pl-6">
                  Deleting <strong className="select-none font-semibold text-red-950 underline decoration-red-300">{companyToDelete.company_name}</strong> will wipe out all statutory compliance schedules, payment records, email logs, and assigned members. This action cannot be reversed.
                </p>
              </div>

              {/* Anti Copy-Paste Badge */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy-paste is disabled for confirmation safety.</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  Manual Typing Only
                </span>
              </div>

              {/* Paste Attempt Warning Alert */}
              {pasteWarning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 animate-in slide-in-from-top duration-200 shadow-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold">{pasteWarning}</span>
                </div>
              )}

              {/* Verification 1: Type Company Name */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center">1</span>
                    <span>Type Company Name to verify:</span>
                  </label>
                  {isStep1Valid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">Step 1 of 2</span>
                  )}
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500">Target name:</span>
                  <span className="font-semibold text-slate-900 select-none bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {companyToDelete.company_name}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={deleteStep1Input}
                    onChange={(e) => setDeleteStep1Input(e.target.value)}
                    onPaste={handlePreventPaste}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Type the exact company name..."
                    className={`w-full bg-white border ${
                      isStep1Valid
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : deleteStep1Input.length > 0
                        ? 'border-amber-400 ring-1 ring-amber-400/20'
                        : 'border-slate-200 focus:border-[#3170c6] focus:ring-2 focus:ring-[#3170c6]/20'
                    } rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none transition-all shadow-2xs`}
                  />
                  {isStep1Valid && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Verification 2: Type DELETE */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center">2</span>
                    <span>Type <span className="font-mono font-black text-red-600 select-none">DELETE</span> to confirm:</span>
                  </label>
                  {isStep2Valid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">Step 2 of 2</span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={deleteStep2Input}
                    onChange={(e) => setDeleteStep2Input(e.target.value)}
                    onPaste={handlePreventPaste}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onDrop={(e) => e.preventDefault()}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="Type DELETE in capital letters..."
                    className={`w-full bg-white border uppercase ${
                      isStep2Valid
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : deleteStep2Input.length > 0
                        ? 'border-amber-400 ring-1 ring-amber-400/20'
                        : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    } rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none transition-all shadow-2xs`}
                  />
                  {isStep2Valid && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="relative z-10 px-6 py-4 border-t border-slate-100 bg-slate-50/60 backdrop-blur-xl flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteCompany}
                disabled={!isDeleteReady || isDeleting}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isDeleteReady && !isDeleting
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                }`}
              >
                {isDeleting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Deleting Company...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeleteReady ? 'Permanently Delete Company' : 'Complete 2 Steps to Delete'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleAccessGate>
  );
}

