'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Mail,
  Phone,
  Lock,
  Copy,
  Check,
  X,
  CreditCard,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function VendorClientsPage() {
  const [vendors, setVendors] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'invoices'
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVendorForDocs, setSelectedVendorForDocs] = useState(null);
  const [selectedInvoiceForAction, setSelectedInvoiceForAction] = useState(null);
  
  // Form states for creating vendor
  const [createForm, setCreateForm] = useState({
    vendorName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Status update state for invoice action
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: '',
    payment_reference: '',
    remarks: ''
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/other-modules/vendor/api/clients');
      if (res.ok) {
        const data = await res.json();
        setVendors(data.vendors || []);
        setInvoices(data.invoices || []);
      }
    } catch (err) {
      console.error('Failed to load vendor clients data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const res = await fetch('/other-modules/vendor/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create vendor');
      }

      setCreatedCredentials(data.credentials);
      setCreateForm({ vendorName: '', email: '', phoneNumber: '', password: '' });
      fetchData();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateInvoiceStatus = async (e) => {
    e.preventDefault();
    if (!selectedInvoiceForAction) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch('/other-modules/vendor/api/clients/invoices/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedInvoiceForAction.id,
          status: statusUpdateForm.status,
          payment_reference: statusUpdateForm.payment_reference,
          remarks: statusUpdateForm.remarks
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update invoice');
      }

      setSelectedInvoiceForAction(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      (v.vendor_name && v.vendor_name.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.phone_number && v.phone_number.toLowerCase().includes(q)) ||
      (v.gst_number && v.gst_number.toLowerCase().includes(q))
    );
    const matchesVendor = selectedVendorFilter === 'ALL' || v.id === selectedVendorFilter;
    return matchesSearch && matchesVendor;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const vendorName = inv.vendor?.vendor_name || '';
    const matchesSearch = (
      vendorName.toLowerCase().includes(q) ||
      (inv.invoice_number && inv.invoice_number.toLowerCase().includes(q)) ||
      (inv.description_of_services && inv.description_of_services.toLowerCase().includes(q)) ||
      (inv.bnc_poc && inv.bnc_poc.toLowerCase().includes(q)) ||
      (inv.payment_reference && inv.payment_reference.toLowerCase().includes(q))
    );
    const matchesVendor = selectedVendorFilter === 'ALL' || inv.vendor_id === selectedVendorFilter || (inv.vendor?.id === selectedVendorFilter);
    return matchesSearch && matchesVendor;
  });

  const totalVendorsCount = vendors.length;
  const completedProfilesCount = vendors.filter((v) => v.is_profile_completed).length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'submitted' || i.status === 'under_review').length;
  const approvedInvoicesCount = invoices.filter((i) => i.status === 'approved' || i.status === 'paid').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Vendor Directory & Compliance
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setCreatedCredentials(null);
              setCreateError('');
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0372CC] hover:bg-[#025da7] active:scale-95 text-white text-sm font-semibold shadow-sm shadow-[#0372CC]/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Vendor Account</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Vendors</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalVendorsCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profiles Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{completedProfilesCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Invoices</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingInvoicesCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved / Paid</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{approvedInvoicesCount}</p>
        </div>
      </div>

      {/* Tabs, Vendor Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vendor Directory ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'invoices'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Submitted Invoices ({invoices.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Filter by Vendor Dropdown (Left of Search Bar, compact width & fixed padding) */}
          <div className="relative w-full sm:w-40">
            <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <select
              value={selectedVendorFilter}
              onChange={(e) => setSelectedVendorFilter(e.target.value)}
              className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] bg-slate-50/50 font-medium text-slate-800 cursor-pointer transition-all appearance-none"
            >
              <option value="ALL">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vendor_name || v.email}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Bar (Matching height) */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder={activeTab === 'directory' ? 'Search vendors, emails...' : 'Search invoices, POC...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] bg-slate-50/50 placeholder:text-slate-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'directory' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="px-5 py-3.5">Vendor Name</th>
                  <th className="px-4 py-3.5">Contact Details</th>
                  <th className="px-3.5 py-3.5 text-center">TDS</th>
                  <th className="px-3.5 py-3.5 text-center">Lower Ded.</th>
                  <th className="px-3.5 py-3.5 text-center">MSME</th>
                  <th className="px-3.5 py-3.5 text-center">GST</th>
                  <th className="px-3.5 py-3.5 text-center">RCM</th>
                  <th className="px-4 py-3.5">Profile Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                        <span>Loading vendor directory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-600">No vendor records found.</p>
                        <p className="text-xs text-slate-400">Click &quot;Create Vendor Account&quot; to add a new vendor.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {(vendor.vendor_name || 'V').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-semibold text-slate-900">{vendor.vendor_name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">ID: {vendor.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{vendor.email}</span>
                          </div>
                          {vendor.phone_number ? (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{vendor.phone_number}</span>
                            </div>
                          ) : null}
                        </div>
                      </td>
                      {/* 1. TDS Column */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        {vendor.subject_to_tds ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      {/* 2. Lower Ded. Column */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        {vendor.lower_deduction_cert ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      {/* 3. MSME Column */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        {vendor.msme_certificate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      {/* 4. GST Column */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        {vendor.has_gst || vendor.gst_number ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      {/* 5. RCM Column */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        {vendor.reverse_charge_applicable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          vendor.is_profile_completed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {vendor.is_profile_completed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending Onboarding</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedVendorForDocs(vendor)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold shadow-2xs transition-all"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Docs</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="px-5 py-3.5">Vendor</th>
                  <th className="px-4 py-3.5">Invoice Details</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Service Description</th>
                  <th className="px-4 py-3.5">BNC POC</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                        <span>Loading invoices...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-600">No vendor invoices submitted yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <span>{inv.vendor?.vendor_name || 'Vendor'}</span>
                        <span className="block text-xs font-normal text-slate-400">{inv.vendor?.email}</span>
                      </td>
                      <td className="px-4 py-4 text-xs whitespace-nowrap">
                        <span className="font-mono font-medium text-slate-800">{inv.invoice_number || 'INV-UNSPECIFIED'}</span>
                        <span className="block text-slate-400">{inv.invoice_date}</span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {inv.currency || 'INR'} {Number(inv.invoice_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 min-w-[220px] max-w-sm text-xs text-slate-700 leading-relaxed break-words whitespace-normal font-medium">
                        {inv.description_of_services}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                        {inv.bnc_poc}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'paid'
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
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">Ref: {inv.payment_reference}</span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedInvoiceForAction(inv);
                            setStatusUpdateForm({
                              status: inv.status || 'submitted',
                              payment_reference: inv.payment_reference || '',
                              remarks: inv.remarks || ''
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold shadow-2xs transition-all"
                        >
                          <span>Review & Status</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Right Panel Drawer: Create Vendor Account */}
      {showCreateModal ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setShowCreateModal(false)}
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
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      Create Vendor Account
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                      Generate portal login & dispatch access credentials.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/40 backdrop-blur-md border border-white/40 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {createdCredentials ? (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-950 backdrop-blur-xl shadow-xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Vendor Account Created & Email Dispatched!</span>
                      </div>
                      <p className="text-xs text-emerald-800 mt-1 font-medium">
                        The vendor has been notified with their login link and password.
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-xl shadow-xs space-y-3 text-xs">
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">Login Portal URL</span>
                        <span className="font-mono text-slate-900 font-bold">{createdCredentials.loginUrl}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">User ID / Email</span>
                        <span className="font-mono text-slate-900 font-bold">{createdCredentials.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="font-medium">Password</span>
                        <span className="font-mono text-[#0372CC] font-bold text-sm">{createdCredentials.password}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`Portal: ${createdCredentials.loginUrl}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/60 bg-white/70 hover:bg-white text-slate-800 text-xs font-bold shadow-xs transition-colors backdrop-blur-md"
                      >
                        {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedKey ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <form id="createVendorForm" onSubmit={handleCreateVendor} className="space-y-4">
                    {createError ? (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                        {createError}
                      </div>
                    ) : null}

                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-xl shadow-xs space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Vendor Name *
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                            value={createForm.vendorName}
                            onChange={(e) => setCreateForm({ ...createForm, vendorName: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] placeholder:text-slate-700 font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Vendor Email (User ID) *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="billing@acmetech.com"
                            value={createForm.email}
                            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] placeholder:text-slate-700 font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Vendor Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={createForm.phoneNumber}
                            onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] placeholder:text-slate-700 font-medium text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Initial Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Min 6 characters (e.g. Partner@2026)"
                            value={createForm.password}
                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0372CC]/20 focus:border-[#0372CC] font-mono placeholder:text-slate-700 font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Informational Email Dispatch Note */}
                    <div className="p-3.5 rounded-2xl bg-[#0372CC]/10 border border-[#0372CC]/25 text-slate-800 backdrop-blur-md flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-[#0372CC] shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Automated Email Notification</span>
                        <p className="text-slate-600 font-medium">
                          An automated welcome email with login portal credentials will be sent to the registered email address. Kindly inform the client to check their inbox.
                        </p>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Drawer Footer with transparent liquid glass */}
              {!createdCredentials ? (
                <div className="relative z-10 px-4 sm:px-6 py-4 border-t border-white/35 bg-white/20 backdrop-blur-2xl flex items-center justify-end gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white/40 border border-white/40 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="createVendorForm"
                    disabled={creating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0372CC] hover:bg-[#025da7] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#0372CC]/25 transition-all disabled:opacity-50"
                  >
                    {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>Create & Dispatch Email</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Slide-over Right Panel Drawer: View Compliance Documents */}
      {selectedVendorForDocs ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedVendorForDocs(null)}
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
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      Compliance Documents
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                      Vendor: <span className="font-bold text-slate-900">{selectedVendorForDocs.vendor_name}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVendorForDocs(null)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/40 backdrop-blur-md border border-white/40 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="space-y-3">
                  {/* GST Certificate */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.04)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">GST Certificate</span>
                      {selectedVendorForDocs.gst_certificate_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white/50 border border-white/60 px-2.5 py-0.5 rounded-full font-medium">
                          <X className="w-3 h-3" />
                          <span>Not Uploaded</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 font-mono font-semibold">
                      GSTIN: {selectedVendorForDocs.gst_number || 'N/A'}
                    </p>
                    {selectedVendorForDocs.gst_certificate_url ? (
                      <a
                        href={selectedVendorForDocs.gst_certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 text-xs text-[#0372CC] font-bold shadow-2xs transition-colors backdrop-blur-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download GST Certificate</span>
                      </a>
                    ) : null}
                  </div>

                  {/* MSME Certificate */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.04)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">MSME Certificate</span>
                      {selectedVendorForDocs.msme_cert_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white/50 border border-white/60 px-2.5 py-0.5 rounded-full font-medium">
                          {selectedVendorForDocs.msme_certificate ? 'Yes (No Doc)' : 'No'}
                        </span>
                      )}
                    </div>
                    {selectedVendorForDocs.msme_cert_url ? (
                      <a
                        href={selectedVendorForDocs.msme_cert_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 text-xs text-[#0372CC] font-bold shadow-2xs transition-colors backdrop-blur-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download MSME Certificate</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No MSME file available</p>
                    )}
                  </div>

                  {/* Lower Deduction Certificate */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.04)] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lower Deduction Cert</span>
                      {selectedVendorForDocs.lower_deduction_cert_url ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white/50 border border-white/60 px-2.5 py-0.5 rounded-full font-medium">
                          {selectedVendorForDocs.lower_deduction_cert ? 'Yes (No Doc)' : 'No'}
                        </span>
                      )}
                    </div>
                    {selectedVendorForDocs.lower_deduction_cert_url ? (
                      <a
                        href={selectedVendorForDocs.lower_deduction_cert_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 text-xs text-[#0372CC] font-bold shadow-2xs transition-colors backdrop-blur-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Certificate</span>
                      </a>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No Lower Deduction file available</p>
                    )}
                  </div>

                  {/* TDS & RCM Summary */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.04)] space-y-2 text-xs">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tax & RCM Summary</span>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Subject to TDS:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                        {selectedVendorForDocs.subject_to_tds ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{selectedVendorForDocs.subject_to_tds ? 'Yes' : 'No'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span>Reverse Charge (RCM):</span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                        {selectedVendorForDocs.reverse_charge_applicable ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{selectedVendorForDocs.reverse_charge_applicable ? 'Yes' : 'No'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Documents List */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0372CC]" />
                    <span>Additional Documents & Contracts</span>
                  </span>
                  {Array.isArray(selectedVendorForDocs.other_documents) && selectedVendorForDocs.other_documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVendorForDocs.other_documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.03)]">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-800 truncate max-w-[200px] sm:max-w-[240px]">
                            <FileText className="w-4 h-4 text-[#0372CC] shrink-0" />
                            <span className="truncate">{doc.name || `Document ${idx + 1}`}</span>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 text-xs text-[#0372CC] font-bold shadow-2xs transition-colors backdrop-blur-md shrink-0"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50">No additional documents uploaded.</p>
                  )}
                </div>
              </div>

              {/* Drawer Footer with transparent liquid glass */}
              <div className="relative z-10 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/35 bg-white/20 backdrop-blur-2xl flex items-center justify-end gap-2.5 sm:gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setSelectedVendorForDocs(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Slide-over Right Panel Drawer: Review & Status of Invoice */}
      {selectedInvoiceForAction ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedInvoiceForAction(null)}
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
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      Review Invoice: {selectedInvoiceForAction.invoice_number || 'INV'}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate">
                      Vendor: <span className="font-bold text-slate-900">{selectedInvoiceForAction.vendor?.vendor_name || 'Vendor'}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForAction(null)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/40 backdrop-blur-md border border-white/40 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Invoice Summary with Liquid Glass */}
                <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.04)] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Invoice Amount</span>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {selectedInvoiceForAction.currency || 'INR'} {Number(selectedInvoiceForAction.invoice_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Invoice Date</span>
                      <p className="text-xs font-semibold text-slate-800 mt-1">
                        {selectedInvoiceForAction.invoice_date}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">BNC POC</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {selectedInvoiceForAction.bnc_poc || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Current Status</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold mt-0.5 shadow-2xs ${
                        selectedInvoiceForAction.status === 'paid'
                          ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300'
                          : selectedInvoiceForAction.status === 'approved'
                            ? 'bg-blue-100/90 text-blue-800 border border-blue-300'
                            : selectedInvoiceForAction.status === 'rejected'
                              ? 'bg-rose-100/90 text-rose-800 border border-rose-300'
                              : 'bg-amber-100/90 text-amber-800 border border-amber-300'
                      }`}>
                        {selectedInvoiceForAction.status === 'paid' ? 'Paid' : selectedInvoiceForAction.status === 'approved' ? 'Approved' : selectedInvoiceForAction.status === 'rejected' ? 'Rejected' : 'Under Review'}
                      </span>
                    </div>
                  </div>
                  {selectedInvoiceForAction.description_of_services ? (
                    <div className="pt-2.5 border-t border-white/50">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Description of Services</span>
                      <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                        {selectedInvoiceForAction.description_of_services}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Uploaded Invoice Files with Liquid Glass */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0372CC]" />
                    <span>Uploaded Invoice Documents</span>
                  </span>
                  {Array.isArray(selectedInvoiceForAction.invoice_documents) && selectedInvoiceForAction.invoice_documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedInvoiceForAction.invoice_documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.03)]">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-800 truncate max-w-[200px] sm:max-w-[240px]">
                            <FileText className="w-4 h-4 text-[#0372CC] shrink-0" />
                            <span className="truncate">{doc.name || `Invoice File ${idx + 1}`}</span>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 hover:bg-white/70 border border-white/60 text-xs text-[#0372CC] font-bold shadow-2xs transition-colors backdrop-blur-md shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View Copy</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50">No document file attached</p>
                  )}
                </div>

                {/* Status Update Form with Liquid Glass Inputs */}
                <form id="reviewInvoiceForm" onSubmit={handleUpdateInvoiceStatus} className="space-y-4 pt-4 border-t border-white/40">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Workflow Status *
                    </label>
                    <div className="w-full sm:w-64 max-w-full">
                      <select
                        value={statusUpdateForm.status}
                        onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/60 font-semibold text-slate-900 transition-all cursor-pointer"
                      >
                        <option value="submitted">Submitted (Pending Review)</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved for Payment</option>
                        <option value="paid">Paid (Settled)</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {statusUpdateForm.status === 'paid' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Payment Reference / UTR Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UTR-982348123"
                        value={statusUpdateForm.payment_reference}
                        onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, payment_reference: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/35 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/55 font-mono text-slate-800 placeholder:text-slate-700 transition-all"
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Internal Remarks / Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Verified with POC, cleared for batch payment"
                      value={statusUpdateForm.remarks}
                      onChange={(e) => setStatusUpdateForm({ ...statusUpdateForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-white/60 bg-white/35 backdrop-blur-xl shadow-[inset_0_1.5px_2.5px_rgba(255,255,255,0.7),0_4px_16px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#0372CC]/25 focus:border-[#0372CC]/60 focus:bg-white/55 text-slate-800 transition-all resize-none placeholder:text-slate-700"
                    />
                  </div>
                </form>
              </div>

              {/* Drawer Footer with transparent liquid glass */}
              <div className="relative z-10 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/35 bg-white/20 backdrop-blur-2xl flex items-center justify-end gap-2.5 sm:gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForAction(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl bg-white/30 hover:bg-white/50 border border-white/50 backdrop-blur-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="reviewInvoiceForm"
                  disabled={updatingStatus}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-[#0372CC] hover:bg-[#025da7] text-white text-xs sm:text-sm font-semibold shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_8px_16px_-4px_rgba(3,114,204,0.35)] hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_12px_20px_-4px_rgba(3,114,204,0.45)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {updatingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Invoice Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
