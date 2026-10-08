'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Mail,
  Send,
  History,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  ArrowLeft,
  Trash2,
  Sparkles,
  X,
  RefreshCw,
  ChevronDown,
  LayoutDashboard,
  Users,
  Building,
  ShieldCheck,
  UserPlus,
  Menu,
  FileText,
  MapPin,
  FileCheck,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Activity,
  PieChart as PieChartIcon,
  SlidersHorizontal,
  Edit3,
  Globe,
  ExternalLink,
  CreditCard,
  Hash,
} from 'lucide-react';
import {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  formatPeriodLabel,
  formatPeriodFull,
  resolveStatutoryDueDate,
  computeEffectiveStatus,
  resolveEffectiveEntry,
} from '@/utils/finance-compliance-master';
import { ModuleAccessGate } from '@/app/components-homepage/ModuleAccessGate';

const STORAGE_COMPANIES_KEY = 'finance_compliance_companies_v2';
const STORAGE_PERSONS_PREFIX = 'finance_compliance_persons_';
const STORAGE_ITEMS_PREFIX = 'finance_compliance_items_';
const STORAGE_ENTRIES_PREFIX = 'finance_compliance_entries_';

const DAYS_OPTIONS = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
  '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th',
  '31st', 'Last day'
];

const QUARTERLY_PRESETS = [
  '15th of next month after quarter',
  '20th of next month after quarter',
  '30th of next month after quarter',
  '31st of next month after quarter',
  'Last day of month following quarter',
  '30th April, 31st July, 31st Oct, 31st Jan',
];

const HALFYEARLY_PRESETS = [
  '30th September & 31st March',
  '15th October & 15th April',
  '30th June & 31st December',
];

const CATEGORY_OPTIONS = [
  'GST',
  'TAX',
  'BRS',
  'Form 16',
  'PF',
  'Salary',
  'ESI',
  'ROC / Secretarial',
  'Audit',
  'Other',
];

export function resolveItemCategory(item) {
  if (item?.category && typeof item.category === 'string' && item.category.trim()) {
    return item.category.trim();
  }
  const text = `${item?.compliance_nature || ''} ${item?.statutory_due_date || ''}`.toLowerCase();
  if (text.includes('gst')) return 'GST';
  if (text.includes('tds') || text.includes('advance tax') || text.includes('income tax') || text.includes('tax') || text.includes('form 26qb') || text.includes('form 26qc')) return 'TAX';
  if (text.includes('brs') || text.includes('bank') || text.includes('reconciliation')) return 'BRS';
  if (text.includes('form 16') || text.includes('form-16') || text.includes('form16') || text.includes('24q') || text.includes('26q') || text.includes('27q')) return 'Form 16';
  if (text.includes('pf') || text.includes('provident') || text.includes('epf') || text.includes('ecr')) return 'PF';
  if (text.includes('esi') || text.includes('esic')) return 'ESI';
  if (text.includes('salary') || text.includes('payroll') || text.includes('wages') || text.includes('bonus') || text.includes('gratuity') || text.includes('professional tax') || text.includes('ptax') || text.includes('p-tax')) return 'Salary';
  if (text.includes('roc') || text.includes('mca') || text.includes('director') || text.includes('agm') || text.includes('aoc') || text.includes('mgt') || text.includes('din')) return 'ROC / Secretarial';
  if (text.includes('audit') || text.includes('statutory audit') || text.includes('tax audit')) return 'Audit';
  return 'Other';
}

export function getCategoryBadgeStyle(category) {
  const cat = (category || 'Other').toUpperCase();
  if (cat.includes('GST')) return 'bg-purple-100 text-purple-800 border-purple-300';
  if (cat.includes('TAX') || cat.includes('TDS')) return 'bg-blue-100 text-[#3170c6] border-blue-300';
  if (cat.includes('BRS') || cat.includes('BANK')) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (cat.includes('FORM 16')) return 'bg-cyan-100 text-cyan-800 border-cyan-300';
  if (cat.includes('PF')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (cat.includes('SALARY')) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
  if (cat.includes('ESI')) return 'bg-teal-100 text-teal-800 border-teal-300';
  if (cat.includes('ROC') || cat.includes('SECRETARIAL')) return 'bg-rose-100 text-rose-800 border-rose-300';
  if (cat.includes('AUDIT')) return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-slate-100 text-slate-700 border-slate-300';
}

const FY_MONTHS = [
  { month: 4, name: 'Apr', label: 'April', yearOffset: 0 },
  { month: 5, name: 'May', label: 'May', yearOffset: 0 },
  { month: 6, name: 'Jun', label: 'June', yearOffset: 0 },
  { month: 7, name: 'Jul', label: 'July', yearOffset: 0 },
  { month: 8, name: 'Aug', label: 'August', yearOffset: 0 },
  { month: 9, name: 'Sep', label: 'September', yearOffset: 0 },
  { month: 10, name: 'Oct', label: 'October', yearOffset: 0 },
  { month: 11, name: 'Nov', label: 'November', yearOffset: 0 },
  { month: 12, name: 'Dec', label: 'December', yearOffset: 0 },
  { month: 1, name: 'Jan', label: 'January', yearOffset: 1 },
  { month: 2, name: 'Feb', label: 'February', yearOffset: 1 },
  { month: 3, name: 'Mar', label: 'March', yearOffset: 1 },
];

function getCellComplianceState(item, mObj, fyStartYear, company, now = new Date()) {
  const calcYear = fyStartYear + mObj.yearOffset;
  const month = mObj.month;

  // 1. Check pre-inception
  if (company?.created_at) {
    const cd = new Date(company.created_at);
    if (!isNaN(cd.getTime())) {
      const createdYear = cd.getFullYear();
      const createdMonth = cd.getMonth() + 1;
      if (calcYear < createdYear || (calcYear === createdYear && month < createdMonth)) {
        return {
          status: 'NA',
          label: '—',
          tooltip: `Pre-inception period (Entity onboarded ${formatPeriodLabel(createdMonth, createdYear)})`,
          periodKey: `${calcYear}_${month}`,
          entry: null,
          isApplicable: false,
          month,
          year: calcYear,
        };
      }
    }
  }

  // 2. Frequency Cadence / Applicability rules
  const freq = (item.frequency || 'Monthly').toLowerCase().trim();
  const statRaw = item.statutory_due_date || '';
  let isScheduledMonth = true;

  if (freq === 'monthly') {
    isScheduledMonth = true;
  } else if (freq.includes('quarter')) {
    if (statRaw.toLowerCase().includes('end of quarter') || statRaw.toLowerCase().includes('last day of quarter')) {
      isScheduledMonth = [6, 9, 12, 3].includes(month);
    } else {
      isScheduledMonth = [7, 10, 1, 4].includes(month);
    }
  } else if (freq.includes('half')) {
    if (statRaw.toLowerCase().includes('oct') || statRaw.toLowerCase().includes('apr') || statRaw.toLowerCase().includes('following')) {
      isScheduledMonth = [10, 4].includes(month);
    } else {
      isScheduledMonth = [9, 3].includes(month);
    }
  } else if (freq === 'annual' || freq === 'yearly' || freq.includes('year')) {
    let targetDueMonth = 9; // default September
    const monthMatch = statRaw.match(/(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/i);
    if (monthMatch) {
      const foundIdx = MONTH_NAMES.findIndex((m) =>
        m.toLowerCase().startsWith(monthMatch[0].toLowerCase().slice(0, 3))
      );
      if (foundIdx !== -1) targetDueMonth = foundIdx + 1;
    }
    isScheduledMonth = (month === targetDueMonth);
  } else if (freq === 'one time' || freq === 'onetime' || freq === 'one-time') {
    let targetDueMonth = 9;
    let targetDueYear = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(statRaw.trim())) {
      const [y, m] = statRaw.trim().split('-').map(Number);
      targetDueYear = y;
      targetDueMonth = m;
    } else {
      const yearMatch = statRaw.match(/\b(20\d{2})\b/);
      if (yearMatch) targetDueYear = parseInt(yearMatch[1], 10);
      const monthMatch = statRaw.match(/(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/i);
      if (monthMatch) {
        const foundIdx = MONTH_NAMES.findIndex((m) =>
          m.toLowerCase().startsWith(monthMatch[0].toLowerCase().slice(0, 3))
        );
        if (foundIdx !== -1) targetDueMonth = foundIdx + 1;
      }
    }
    isScheduledMonth = (month === targetDueMonth) && (targetDueYear === null || calcYear === targetDueYear);
  }

  // If not scheduled in this month, strictly return NA (blank dash)
  if (!isScheduledMonth) {
    return {
      status: 'NA',
      label: '—',
      tooltip: `${item.frequency || 'Periodic'} – Not scheduled in ${mObj.name} ${calcYear}`,
      periodKey: `${calcYear}_${month}`,
      entry: null,
      isApplicable: false,
      month,
      year: calcYear,
    };
  }

  // 3. Resolve entry for this scheduled slot
  const entry = resolveEffectiveEntry(item, company?.monthly_entries, month, calcYear);

  // 4. Compute effective status
  const effectiveStatus = computeEffectiveStatus(item, entry, month, calcYear, now, company?.created_at);

  let label = effectiveStatus;
  let tooltip = `${item.compliance_nature} (${mObj.name} ${calcYear}): ${effectiveStatus}`;
  if (entry?.actual_payment_date) {
    tooltip += ` • Paid on ${entry.actual_payment_date}`;
  }

  return {
    status: effectiveStatus,
    label,
    tooltip,
    periodKey: `${calcYear}_${month}`,
    entry,
    isApplicable: true,
    month,
    year: calcYear,
  };
}

function getCategoryMonthRollupState(categoryItems, mObj, fyStartYear, company, now = new Date()) {
  const calcYear = fyStartYear + mObj.yearOffset;
  const month = mObj.month;

  // Gather states of all items in this category for this month
  const itemStates = categoryItems.map((item) => ({
    item,
    cell: getCellComplianceState(item, mObj, fyStartYear, company, now),
  }));

  // Filter to only those applicable / scheduled in this month
  const applicableItems = itemStates.filter((s) => s.cell.isApplicable && s.cell.status !== 'NA');

  if (applicableItems.length === 0) {
    return {
      status: 'NA',
      label: '—',
      tooltip: `No compliances scheduled in ${mObj.name} ${calcYear}`,
      isApplicable: false,
      totalCount: 0,
      completedCount: 0,
      overdueCount: 0,
      inProgressCount: 0,
      pendingCount: 0,
      items: [],
    };
  }

  const totalCount = applicableItems.length;
  const completedCount = applicableItems.filter((s) => s.cell.status === 'Completed').length;
  const overdueCount = applicableItems.filter((s) => s.cell.status === 'Overdue').length;
  const inProgressCount = applicableItems.filter((s) => s.cell.status === 'In Progress').length;
  const pendingCount = applicableItems.filter((s) => s.cell.status === 'Pending').length;

  // RULE 1: If ANY is Overdue -> Overdue (Red)
  if (overdueCount > 0) {
    return {
      status: 'Overdue',
      label: overdueCount === 1 && totalCount === 1 ? 'Overdue' : `${overdueCount} Overdue`,
      tooltip: `${overdueCount} of ${totalCount} Overdue (${completedCount} paid, ${pendingCount} pending) in ${mObj.name} ${calcYear}`,
      isApplicable: true,
      totalCount,
      completedCount,
      overdueCount,
      inProgressCount,
      pendingCount,
      items: applicableItems,
    };
  }

  // RULE 2: If ALL are Paid / Completed -> Paid (Green)
  if (completedCount === totalCount) {
    return {
      status: 'Completed',
      label: totalCount > 1 ? `Paid (${totalCount})` : 'Paid',
      tooltip: `All ${totalCount} compliances Paid in ${mObj.name} ${calcYear}`,
      isApplicable: true,
      totalCount,
      completedCount,
      overdueCount,
      inProgressCount,
      pendingCount,
      items: applicableItems,
    };
  }

  // RULE 3: If SOME are Paid and some are Pending/In Progress -> In Progress / Partial (Amber / Yellow)
  if (completedCount > 0 && completedCount < totalCount) {
    return {
      status: 'In Progress',
      label: `${completedCount}/${totalCount} Paid`,
      tooltip: `${completedCount} of ${totalCount} Paid (${pendingCount + inProgressCount} remaining) in ${mObj.name} ${calcYear}`,
      isApplicable: true,
      totalCount,
      completedCount,
      overdueCount,
      inProgressCount,
      pendingCount,
      items: applicableItems,
    };
  }

  // RULE 4: If any In Progress -> In Progress (Amber)
  if (inProgressCount > 0) {
    return {
      status: 'In Progress',
      label: 'In Prog',
      tooltip: `${inProgressCount} in progress in ${mObj.name} ${calcYear}`,
      isApplicable: true,
      totalCount,
      completedCount,
      overdueCount,
      inProgressCount,
      pendingCount,
      items: applicableItems,
    };
  }

  // RULE 5: Default Pending (None completed, none overdue)
  return {
    status: 'Pending',
    label: 'Pending',
    tooltip: `${pendingCount} compliances pending in ${mObj.name} ${calcYear}`,
    isApplicable: true,
    totalCount,
    completedCount,
    overdueCount,
    inProgressCount,
    pendingCount,
    items: applicableItems,
  };
}

function getResolvedDatesForForm(formState) {
  const freq = formState.frequency || 'Monthly';
  let statutory = '';
  let internal = '';

  if (freq === 'Monthly') {
    statutory = formState.use_custom_statutory
      ? (formState.custom_statutory_text || '')
      : `${formState.monthly_statutory_day || '7th'} ${formState.monthly_statutory_timing || 'of following month'}`;
    internal = formState.use_custom_internal
      ? (formState.custom_internal_text || '')
      : `${formState.monthly_internal_day || '1st'} ${formState.monthly_internal_timing || 'of following month'}`;
  } else if (freq === 'Quarterly') {
    statutory = formState.use_custom_statutory
      ? (formState.custom_statutory_text || '')
      : (formState.quarterly_statutory_preset || '30th of month following quarter');
    internal = formState.use_custom_internal
      ? (formState.custom_internal_text || '')
      : (formState.quarterly_internal_preset || '25th of month following quarter');
  } else if (freq === 'Half-Yearly') {
    statutory = formState.use_custom_statutory
      ? (formState.custom_statutory_text || '')
      : (formState.halfyearly_statutory_preset || '30th September & 31st March');
    internal = formState.use_custom_internal
      ? (formState.custom_internal_text || '')
      : (formState.halfyearly_internal_preset || '20th September & 20th March');
  } else if (freq === 'Annual') {
    statutory = formState.use_custom_statutory
      ? (formState.custom_statutory_text || '')
      : `${formState.annual_statutory_day || '30th'} ${formState.annual_statutory_month || 'September'}`;
    internal = formState.use_custom_internal
      ? (formState.custom_internal_text || '')
      : `${formState.annual_internal_day || '20th'} ${formState.annual_internal_month || 'September'}`;
  } else if (freq === 'One time') {
    statutory = formState.use_custom_statutory
      ? (formState.custom_statutory_text || '')
      : (formState.onetime_statutory_date || '2026-09-30');
    internal = formState.use_custom_internal
      ? (formState.custom_internal_text || '')
      : (formState.onetime_internal_date || '2026-09-25');
  } else {
    statutory = formState.custom_statutory_text || formState.statutory_due_date || 'As applicable';
    internal = formState.custom_internal_text || formState.internal_control_due_date || 'As applicable';
  }

  return { statutory: statutory.trim(), internal: internal.trim() };
}

export default function CompanyComplianceWorkspace() {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.companyId;

  // Sidebar Open State (FAR layout style)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active View Tab: 'dashboard' | 'calendar' | 'people' | 'profile' | 'email_logs'
  const [activeTab, setActiveTab] = useState('calendar');

  // Tracking Period State (Defaults dynamically to current month & year)
  const [activeMonth, setActiveMonth] = useState(() => new Date().getMonth() + 1);
  const [activeYear, setActiveYear] = useState(() => new Date().getFullYear());

  // Company State
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);

  // Inception / Onboarding Period Calculation
  const companyInception = useMemo(() => {
    if (!company?.created_at) return null;
    const d = new Date(company.created_at);
    if (isNaN(d.getTime())) return null;
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    return {
      year: y,
      month: m,
      label: formatPeriodLabel(m, y),
      fullLabel: formatPeriodFull(m, y),
    };
  }, [company?.created_at]);

  const isBeforeInception = useMemo(() => {
    if (!companyInception) return false;
    if (activeYear < companyInception.year) return true;
    if (activeYear === companyInception.year && activeMonth < companyInception.month) return true;
    return false;
  }, [companyInception, activeYear, activeMonth]);

  // Company Profile Edit State & Drawer
  const [isEditProfileDrawerOpen, setIsEditProfileDrawerOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    company_name: '',
    industry: '',
    address: '',
    gstin: '',
    pan_number: '',
    cin_number: '',
    website: '',
    note: '',
  });

  // Company People / Members
  const [persons, setPersons] = useState([]);
  const [isAddPersonDrawerOpen, setIsAddPersonDrawerOpen] = useState(false);
  const [personForm, setPersonForm] = useState({
    person_type: 'Director', // 'Director' | 'Team'
    name: '',
    designation: 'Director',
    company_directory: 'Company Director',
    email: '',
    phone: '',
    is_primary: false,
  });

  // Edit Person State & Drawer
  const [isEditPersonDrawerOpen, setIsEditPersonDrawerOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editPersonForm, setEditPersonForm] = useState({
    person_type: 'Director',
    name: '',
    designation: 'Director',
    company_directory: 'Company Director',
    email: '',
    phone: '',
    is_primary: false,
  });
  const [savingPerson, setSavingPerson] = useState(false);

  // Split persons into Company Directors and Team Members
  const directors = useMemo(() => {
    return persons.filter((p) => {
      const dir = (p.company_directory || '').toLowerCase();
      const des = (p.designation || '').toLowerCase();
      return dir.includes('director') || des.includes('director');
    });
  }, [persons]);

  const teamMembers = useMemo(() => {
    return persons.filter((p) => {
      const dir = (p.company_directory || '').toLowerCase();
      const des = (p.designation || '').toLowerCase();
      return !dir.includes('director') && !des.includes('director');
    });
  }, [persons]);

  // Items & Entries State
  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [frequencyFilter, setFrequencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dashboardFilter, setDashboardFilter] = useState('ALL');

  // Dynamic Category Options for Calendar Tab Filter
  const calendarCategoryOptions = useMemo(() => {
    const list = [...CATEGORY_OPTIONS];
    items.forEach((it) => {
      const c = it.category || resolveItemCategory(it);
      if (c && !list.some((existing) => existing.toUpperCase() === c.toUpperCase())) {
        list.push(c);
      }
    });
    return list;
  }, [items]);

  // Heatmap State (Annual Financial Year Matrix: April to March)
  const currentCalendarYear = new Date().getFullYear();
  const currentCalendarMonth = new Date().getMonth() + 1;
  const defaultFyStart = currentCalendarMonth >= 4 ? currentCalendarYear : currentCalendarYear - 1;
  const [selectedFyYear, setSelectedFyYear] = useState(defaultFyStart);
  const [heatmapSearchTerm, setHeatmapSearchTerm] = useState('');
  const [heatmapFreqFilter, setHeatmapFreqFilter] = useState('ALL');
  const [heatmapMonthSubFilter, setHeatmapMonthSubFilter] = useState('ALL');
  const [heatmapQuarterSubFilter, setHeatmapQuarterSubFilter] = useState('ALL');
  const [heatmapHalfYearSubFilter, setHeatmapHalfYearSubFilter] = useState('ALL');

  // FY Options list
  const availableFyYears = useMemo(() => {
    return [
      defaultFyStart - 2,
      defaultFyStart - 1,
      defaultFyStart,
      defaultFyStart + 1,
      defaultFyStart + 2,
    ];
  }, [defaultFyStart]);

  // Dynamic Visible Columns for Heatmap based on frequency & sub-filters
  const visibleHeatmapMonths = useMemo(() => {
    if (heatmapFreqFilter === 'Monthly' && heatmapMonthSubFilter !== 'ALL') {
      const targetM = Number(heatmapMonthSubFilter);
      return FY_MONTHS.filter((m) => m.month === targetM);
    }
    if (heatmapFreqFilter === 'Quarterly' && heatmapQuarterSubFilter !== 'ALL') {
      if (heatmapQuarterSubFilter === 'Q1') return FY_MONTHS.filter((m) => [4, 5, 6].includes(m.month));
      if (heatmapQuarterSubFilter === 'Q2') return FY_MONTHS.filter((m) => [7, 8, 9].includes(m.month));
      if (heatmapQuarterSubFilter === 'Q3') return FY_MONTHS.filter((m) => [10, 11, 12].includes(m.month));
      if (heatmapQuarterSubFilter === 'Q4') return FY_MONTHS.filter((m) => [1, 2, 3].includes(m.month));
    }
    if (heatmapFreqFilter === 'Half-Yearly' && heatmapHalfYearSubFilter !== 'ALL') {
      if (heatmapHalfYearSubFilter === 'H1') return FY_MONTHS.filter((m) => [4, 5, 6, 7, 8, 9].includes(m.month));
      if (heatmapHalfYearSubFilter === 'H2') return FY_MONTHS.filter((m) => [10, 11, 12, 1, 2, 3].includes(m.month));
    }
    return FY_MONTHS;
  }, [heatmapFreqFilter, heatmapMonthSubFilter, heatmapQuarterSubFilter, heatmapHalfYearSubFilter]);

  // Filtered Items for Heatmap (Sorted by Category in Ascending Order)
  const heatmapItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (heatmapFreqFilter !== 'ALL') {
        const itemFreq = (item.frequency || '').toLowerCase().trim();
        const filterFreq = heatmapFreqFilter.toLowerCase().trim();
        if (filterFreq === 'one time' || filterFreq === 'onetime' || filterFreq === 'one-time') {
          if (!itemFreq.includes('one') && !itemFreq.includes('onetime')) return false;
        } else if (filterFreq === 'monthly') {
          if (!itemFreq.includes('monthly') && !itemFreq.includes('month')) return false;
        } else if (filterFreq === 'quarterly') {
          if (!itemFreq.includes('quarter')) return false;
        } else if (filterFreq === 'annual') {
          if (!itemFreq.includes('annual') && !itemFreq.includes('yearly') && !itemFreq.includes('year')) return false;
        } else if (filterFreq === 'half-yearly' || filterFreq === 'half yearly') {
          if (!itemFreq.includes('half')) return false;
        } else if (!itemFreq.includes(filterFreq)) {
          return false;
        }
      }
      if (heatmapSearchTerm.trim()) {
        const q = heatmapSearchTerm.toLowerCase();
        const matchName = item.compliance_nature?.toLowerCase().includes(q);
        const matchStat = item.statutory_due_date?.toLowerCase().includes(q);
        const matchFreq = item.frequency?.toLowerCase().includes(q);
        const matchCat = (item.category || resolveItemCategory(item)).toLowerCase().includes(q);
        if (!matchName && !matchStat && !matchFreq && !matchCat) return false;
      }
      return true;
    });

    // Sort by Category in Ascending Order (A to Z)
    return [...filtered].sort((a, b) => {
      const catA = (a.category || resolveItemCategory(a)).toUpperCase();
      const catB = (b.category || resolveItemCategory(b)).toUpperCase();
      if (catA < catB) return -1;
      if (catA > catB) return 1;
      return (a.s_no || 0) - (b.s_no || 0);
    });
  }, [items, heatmapSearchTerm, heatmapFreqFilter]);

  // Grouped Unique Categories with Priority Sorting: GST, TAX, BRS, Form 16, PF, Salary, ESI, etc.
  const groupedHeatmapCategories = useMemo(() => {
    const priorityList = [
      'GST',
      'TAX',
      'BRS',
      'FORM 16',
      'PF',
      'SALARY',
      'ESI',
      'ROC / SECRETARIAL',
      'AUDIT',
      'OTHER',
    ];
    const priorityMap = {};
    priorityList.forEach((cat, idx) => {
      priorityMap[cat] = idx;
    });

    const map = new Map();
    heatmapItems.forEach((item) => {
      const cat = item.category || resolveItemCategory(item);
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat).push(item);
    });

    const groups = Array.from(map.entries()).map(([category, catItems]) => {
      const sortedItems = [...catItems].sort((a, b) => (a.s_no || 0) - (b.s_no || 0));
      return {
        category,
        items: sortedItems,
      };
    });

    groups.sort((a, b) => {
      const keyA = a.category.toUpperCase().trim();
      const keyB = b.category.toUpperCase().trim();
      const pA = priorityMap[keyA] !== undefined ? priorityMap[keyA] : 900;
      const pB = priorityMap[keyB] !== undefined ? priorityMap[keyB] : 900;
      if (pA !== pB) return pA - pB;
      return a.category.localeCompare(b.category);
    });

    return groups;
  }, [heatmapItems]);

  // Accordion State for Categories in Heat Map
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  const handleExpandAllCategories = () => {
    const all = {};
    groupedHeatmapCategories.forEach((g) => {
      all[g.category] = true;
    });
    setExpandedCategories(all);
  };

  const handleCollapseAllCategories = () => {
    setExpandedCategories({});
  };

  const isAllCategoriesExpanded = useMemo(() => {
    if (groupedHeatmapCategories.length === 0) return false;
    return groupedHeatmapCategories.every((g) => Boolean(expandedCategories[g.category]));
  }, [groupedHeatmapCategories, expandedCategories]);

  // Aggregate FY Stats
  const fyStats = useMemo(() => {
    let totalSlots = 0;
    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    let pending = 0;

    items.forEach((item) => {
      FY_MONTHS.forEach((mObj) => {
        const cell = getCellComplianceState(item, mObj, selectedFyYear, company);
        if (cell.isApplicable) {
          totalSlots++;
          if (cell.status === 'Completed') completed++;
          else if (cell.status === 'In Progress') inProgress++;
          else if (cell.status === 'Overdue') overdue++;
          else pending++;
        }
      });
    });

    const completionPct = totalSlots > 0 ? Math.round((completed / totalSlots) * 100) : 0;
    return {
      totalSlots,
      completed,
      inProgress,
      overdue,
      pending,
      completionPct,
    };
  }, [items, selectedFyYear, company]);

  // Slide-over Drawers
  const [isAddItemDrawerOpen, setIsAddItemDrawerOpen] = useState(false);
  const [isEditItemDrawerOpen, setIsEditItemDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormWarning, setEditFormWarning] = useState('');
  const [editForm, setEditForm] = useState({
    compliance_nature: '',
    frequency: 'Monthly',
    statutory_due_date: '',
    internal_control_due_date: '',
    actual_payment_date: '',
    status: 'Pending',
    remarks: '',
    // Dynamic Pickers
    monthly_statutory_day: '7th',
    monthly_statutory_timing: 'of following month',
    monthly_internal_day: '1st',
    monthly_internal_timing: 'of following month',
    quarterly_statutory_preset: '30th of month following quarter',
    quarterly_internal_preset: '25th of month following quarter',
    halfyearly_statutory_preset: '30th September & 31st March',
    halfyearly_internal_preset: '20th September & 20th March',
    annual_statutory_month: 'September',
    annual_statutory_day: '30th',
    annual_internal_month: 'September',
    annual_internal_day: '20th',
    onetime_statutory_date: '2026-09-30',
    onetime_internal_date: '2026-09-25',
    use_custom_statutory: false,
    use_custom_internal: false,
    custom_statutory_text: '',
    custom_internal_text: '',
  });

  // Email Drawer (Supports multi-recipients, CC, FY selection, and Heat Map inclusion)
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState('');
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState([]);
  const [customToEmail, setCustomToEmail] = useState('');
  const [selectedCcEmails, setSelectedCcEmails] = useState([]);
  const [customCcEmail, setCustomCcEmail] = useState('');
  const [emailFyYear, setEmailFyYear] = useState(defaultFyStart);
  const [includeHeatmapInEmail, setIncludeHeatmapInEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailCustomMessage, setEmailCustomMessage] = useState('');
  const [emailSuccessMessage, setEmailSuccessMessage] = useState('');
  const [emailLogs, setEmailLogs] = useState([]);

  // Top-Right Floating Toast Notification State
  const [toastNotification, setToastNotification] = useState(null); // { id, type: 'warning'|'success'|'error', title, message }

  const showToast = (type, title, message) => {
    setToastNotification({ id: Date.now(), type, title, message });
  };

  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Dynamic Add Item Form
  const [itemForm, setItemForm] = useState({
    compliance_nature: '',
    category: 'GST',
    use_custom_category: false,
    custom_category: '',
    frequency: 'Monthly',
    monthly_statutory_day: '7th',
    monthly_statutory_timing: 'of following month',
    monthly_internal_day: '1st',
    monthly_internal_timing: 'of following month',
    quarterly_statutory_preset: '30th of month following quarter',
    quarterly_internal_preset: '25th of month following quarter',
    halfyearly_statutory_preset: '30th September & 31st March',
    halfyearly_internal_preset: '20th September & 20th March',
    annual_statutory_month: 'September',
    annual_statutory_day: '30th',
    annual_internal_month: 'September',
    annual_internal_day: '20th',
    onetime_statutory_date: '2026-09-30',
    onetime_internal_date: '2026-09-25',
    use_custom_statutory: false,
    use_custom_internal: false,
    custom_statutory_text: '',
    custom_internal_text: '',
  });

  // Auto detect width for responsive sidebar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  }, []);

  // 1. Load Company and All Companies list for Switcher
  useEffect(() => {
    const loadCompany = async () => {
      if (!companyId) return;

      let list = [];
      try {
        const res = await fetch('/api/finance/companies');
        const data = await res.json().catch(() => ({}));
        if (data.companies && data.companies.length > 0) {
          list = data.companies;
        }
      } catch (e) {
        console.warn('API companies fetch error:', e);
      }

      if (list.length === 0 && typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_COMPANIES_KEY);
        if (stored) list = JSON.parse(stored);
      }

      setCompanies(list);

      // Fetch fresh individual company details
      let currentCompany = list.find((c) => c.id === companyId);
      try {
        const singleRes = await fetch(`/api/finance/companies/${companyId}`);
        const singleData = await singleRes.json().catch(() => ({}));
        if (singleData.company) {
          currentCompany = singleData.company;
        }
      } catch (e) {
        console.warn('API single company fetch error:', e);
      }

      if (!currentCompany) {
        currentCompany = {
          id: companyId,
          company_name: 'Company Workspace',
          industry: '',
        };
      }
      setCompany(currentCompany);

      if (currentCompany?.email_logs && Array.isArray(currentCompany.email_logs)) {
        setEmailLogs(currentCompany.email_logs);
      }

      // Pre-populate email subject
      const periodLbl = formatPeriodLabel(activeMonth, activeYear);
      setEmailSubject(`Statutory Compliance Calendar - ${currentCompany.company_name} (${periodLbl})`);
    };

    loadCompany();
  }, [companyId, activeMonth, activeYear]);

  // 2. Load Details for this Company
  const loadCompanyDetails = async (targetId, month, year) => {
    if (!targetId) return;
    setLoadingData(true);

    // Fetch Persons
    let loadedPersons = [];
    try {
      const pRes = await fetch(`/api/finance/companies/${targetId}/persons`);
      const pData = await pRes.json().catch(() => ({}));
      if (pData.persons && pData.persons.length > 0) {
        loadedPersons = pData.persons;
      }
    } catch (e) {
      console.warn('API persons error:', e);
    }

    if (loadedPersons.length === 0 && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${STORAGE_PERSONS_PREFIX}${targetId}`);
      if (stored) {
        loadedPersons = JSON.parse(stored);
      }
    }
    setPersons(loadedPersons);
    if (loadedPersons.length > 0) {
      const primary = loadedPersons.find((p) => p.is_primary) || loadedPersons[0];
      setSelectedRecipientEmail(primary.email);
      setSelectedRecipientEmails([primary.email]);
    }

    // Fetch Items
    let loadedItems = [];
    try {
      const itemsRes = await fetch(`/api/finance/compliance-calendar/items?companyId=${targetId}`);
      const itemsData = await itemsRes.json().catch(() => ({}));
      if (itemsData.items && itemsData.items.length > 0) {
        loadedItems = itemsData.items;
      }
    } catch (e) {
      console.warn('API items error:', e);
    }

    if (loadedItems.length === 0 && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${STORAGE_ITEMS_PREFIX}${targetId}`);
      if (stored) {
        loadedItems = JSON.parse(stored);
      }
    }

    // Ensure all items have persistent category property
    let hasUpdatedCat = false;
    loadedItems = loadedItems.map((it) => {
      if (!it.category || typeof it.category !== 'string' || !it.category.trim()) {
        hasUpdatedCat = true;
        return {
          ...it,
          category: resolveItemCategory(it),
        };
      }
      return it;
    });

    if (hasUpdatedCat && typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${targetId}`, JSON.stringify(loadedItems));
    }

    // Fetch Entries for Period
    let loadedEntries = {};
    try {
      const entriesRes = await fetch(
        `/api/finance/compliance-calendar/entries?companyId=${targetId}&month=${month}&year=${year}`
      );
      const entriesData = await entriesRes.json().catch(() => ({}));
      if (entriesData.entries) {
        loadedEntries = entriesData.entries;
      }
    } catch (e) {
      console.warn('API entries error:', e);
    }

    if (Object.keys(loadedEntries).length === 0 && typeof window !== 'undefined') {
      const storageKey = `${STORAGE_ENTRIES_PREFIX}${targetId}_${year}_${month}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        loadedEntries = JSON.parse(stored);
      }
    }

    // Fetch Email Logs
    try {
      const elRes = await fetch(`/api/finance/compliance-calendar/email-logs?companyId=${targetId}`);
      const elData = await elRes.json().catch(() => ({}));
      if (Array.isArray(elData.logs)) {
        setEmailLogs(elData.logs);
      }
    } catch (e) {
      console.warn('API email-logs fetch error:', e);
    }

    setItems(loadedItems);
    setEntries(loadedEntries);
    setLoadingData(false);
  };

  useEffect(() => {
    if (companyId) {
      loadCompanyDetails(companyId, activeMonth, activeYear);
    }
  }, [companyId, activeMonth, activeYear]);

  // Handle Switch Company
  const handleCompanyChange = (newId) => {
    router.push(`/other-modules/finance/compliance-calendar/${newId}`);
  };

  // Month Steppers
  const handlePrevMonth = () => {
    if (activeMonth === 1) {
      setActiveMonth(12);
      setActiveYear((y) => y - 1);
    } else {
      setActiveMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonth === 12) {
      setActiveMonth(1);
      setActiveYear((y) => y + 1);
    } else {
      setActiveMonth((m) => m + 1);
    }
  };

  // Open Edit Drawer for a Row
  const handleOpenEditDrawer = (item, options = {}) => {
    const targetMonth = options.targetMonth !== undefined ? options.targetMonth : activeMonth;
    const targetYear = options.targetYear !== undefined ? options.targetYear : activeYear;

    if (options.targetMonth !== undefined && options.targetMonth !== activeMonth) {
      setActiveMonth(options.targetMonth);
    }
    if (options.targetYear !== undefined && options.targetYear !== activeYear) {
      setActiveYear(options.targetYear);
    }

    setEditingItem(item);
    const targetPeriodKey = `${targetYear}_${targetMonth}`;
    const periodEntries = company?.monthly_entries?.[targetPeriodKey] || {};
    const entry = {
      ...(periodEntries[item.id] || entries[item.id] || {}),
      ...resolveEffectiveEntry(item, company?.monthly_entries, targetMonth, targetYear),
    };
    const effectiveSt = computeEffectiveStatus(item, entry, targetMonth, targetYear, new Date(), company?.created_at);
    const initialStatus = options.forcedStatus || entry.status || effectiveSt || 'Pending';

    setEditFormWarning(options.warning || '');

    const statRaw = item.statutory_due_date || '';
    const internalRaw = item.internal_control_due_date || '';
    const freq = item.frequency || 'Monthly';

    // Parse day and month if available
    let annualMonth = 'September';
    let annualDay = '30th';
    const annualMatch = statRaw.match(/(\d{1,2}(?:st|nd|rd|th)?)\s+([A-Za-z]+)/i);
    if (annualMatch) {
      annualDay = annualMatch[1];
      const foundMonth = MONTH_NAMES.find((m) =>
        m.toLowerCase().startsWith(annualMatch[2].toLowerCase().slice(0, 3))
      );
      if (foundMonth) annualMonth = foundMonth;
    }

    let monthlyDay = '7th';
    const monthlyMatch = statRaw.match(/(\d{1,2}(?:st|nd|rd|th)?)/i);
    if (monthlyMatch) {
      monthlyDay =
        monthlyMatch[1].endsWith('th') ||
        monthlyMatch[1].endsWith('st') ||
        monthlyMatch[1].endsWith('nd') ||
        monthlyMatch[1].endsWith('rd')
          ? monthlyMatch[1]
          : `${monthlyMatch[1]}th`;
    }

    let monthlyInternalDay = '1st';
    const internalMatch = internalRaw.match(/(\d{1,2}(?:st|nd|rd|th)?)/i);
    if (internalMatch) {
      monthlyInternalDay =
        internalMatch[1].endsWith('th') ||
        internalMatch[1].endsWith('st') ||
        internalMatch[1].endsWith('nd') ||
        internalMatch[1].endsWith('rd')
          ? internalMatch[1]
          : `${internalMatch[1]}th`;
    }

    const resolvedCategory = item.category || resolveItemCategory(item);
    setEditForm({
      compliance_nature: item.compliance_nature || '',
      category: resolvedCategory,
      use_custom_category: !CATEGORY_OPTIONS.includes(resolvedCategory),
      custom_category: resolvedCategory,
      frequency: freq,
      statutory_due_date: statRaw,
      internal_control_due_date: internalRaw,
      actual_payment_date: entry.actual_payment_date || '',
      status: initialStatus,
      remarks: entry.remarks || '',
      // Smart Pickers
      monthly_statutory_day: monthlyDay,
      monthly_statutory_timing: statRaw.includes('same month') ? 'of same month' : 'of following month',
      monthly_internal_day: monthlyInternalDay,
      monthly_internal_timing: internalRaw.includes('same month') ? 'of same month' : 'of following month',
      quarterly_statutory_preset: statRaw || '30th of month following quarter',
      quarterly_internal_preset: internalRaw || '25th of month following quarter',
      halfyearly_statutory_preset: statRaw || '30th September & 31st March',
      halfyearly_internal_preset: internalRaw || '20th September & 20th March',
      annual_statutory_month: annualMonth,
      annual_statutory_day: annualDay,
      annual_internal_month: annualMonth,
      annual_internal_day: '20th',
      onetime_statutory_date: /^\d{4}-\d{2}-\d{2}$/.test(statRaw) ? statRaw : `${activeYear}-09-30`,
      onetime_internal_date: /^\d{4}-\d{2}-\d{2}$/.test(internalRaw) ? internalRaw : `${activeYear}-09-25`,
      use_custom_statutory: false,
      use_custom_internal: false,
      custom_statutory_text: statRaw,
      custom_internal_text: internalRaw,
    });
    setIsEditItemDrawerOpen(true);
  };

  // Save Edit Item Changes from Drawer
  const handleSaveEditItem = async (e) => {
    e.preventDefault();
    if (!editingItem || !companyId) return;

    // RULE 1: Enforce payment date before marking Completed
    if (editForm.status === 'Completed' && !editForm.actual_payment_date?.trim()) {
      showToast(
        'warning',
        'Actual Payment Date Required',
        'Actual Payment / Execution Date is required before marking this compliance as Completed.'
      );
      setEditFormWarning('Actual Payment / Execution Date is required before marking this compliance as Completed.');
      return;
    }

    setEditFormWarning('');
    const { statutory, internal } = getResolvedDatesForForm(editForm);
    const finalStatutory = statutory || editForm.statutory_due_date || '7th of following month';
    const finalInternal = internal || editForm.internal_control_due_date || '1st of following month';

    // 1. Update item master details locally
    const updatedItems = items.map((it) => {
      if (it.id === editingItem.id) {
        return {
          ...it,
          compliance_nature: editForm.compliance_nature.trim(),
          category: editForm.category?.trim() || 'Other',
          frequency: editForm.frequency,
          statutory_due_date: finalStatutory,
          internal_control_due_date: finalInternal,
        };
      }
      return it;
    });
    setItems(updatedItems);

    // 2. Update execution entry locally
    const updatedEntries = {
      ...entries,
      [editingItem.id]: {
        ...(entries[editingItem.id] || {}),
        status: editForm.status,
        actual_payment_date: editForm.actual_payment_date || null,
        remarks: editForm.remarks || '',
      },
    };
    setEntries(updatedEntries);

    // Update company.monthly_entries so cross-month inheritance immediately reflects
    const periodKey = `${activeYear}_${activeMonth}`;
    setCompany((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        monthly_entries: {
          ...(prev.monthly_entries || {}),
          [periodKey]: {
            ...(prev.monthly_entries?.[periodKey] || {}),
            [editingItem.id]: updatedEntries[editingItem.id],
          },
        },
      };
    });

    // 3. Save to API & Supabase in parallel
    try {
      const [entryRes, itemRes] = await Promise.all([
        fetch('/api/finance/compliance-calendar/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyId,
            item_id: editingItem.id,
            period_month: activeMonth,
            period_year: activeYear,
            status: editForm.status,
            actual_payment_date: editForm.actual_payment_date || null,
            remarks: editForm.remarks || '',
          }),
        }),
        fetch('/api/finance/compliance-calendar/items', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_id: companyId,
            item_id: editingItem.id,
            compliance_nature: editForm.compliance_nature.trim(),
            category: editForm.category?.trim() || 'Other',
            frequency: editForm.frequency,
            statutory_due_date: finalStatutory,
            internal_control_due_date: finalInternal,
          }),
        }),
      ]);

      const itemData = await itemRes.json().catch(() => ({}));
      if (itemData.items && Array.isArray(itemData.items)) {
        setItems(itemData.items);
      }
    } catch (err) {
      console.warn('API save edit fallback:', err);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${companyId}`, JSON.stringify(updatedItems));
      localStorage.setItem(
        `${STORAGE_ENTRIES_PREFIX}${companyId}_${activeYear}_${activeMonth}`,
        JSON.stringify(updatedEntries)
      );
    }

    showToast('success', 'Changes Saved', `Updated "${editForm.compliance_nature}" successfully.`);
    setIsEditItemDrawerOpen(false);
  };

  // Delete Item from Edit Drawer or Table
  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this compliance item?')) return;
    try {
      await fetch(`/api/finance/compliance-calendar/items?id=${itemId}&companyId=${companyId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete item fallback:', err);
    }
    const updated = items.filter((it) => it.id !== itemId);
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${companyId}`, JSON.stringify(updated));
    }
    showToast('success', 'Item Deleted', 'Compliance row removed successfully.');
    setIsEditItemDrawerOpen(false);
  };

  // Quick Status Change on Table
  const handleStatusChange = async (itemId, newStatus, e) => {
    if (e) e.stopPropagation();

    // RULE: If selecting Completed, must have an actual_payment_date
    const currentEntry = entries[itemId] || {};
    if (newStatus === 'Completed' && !currentEntry.actual_payment_date?.trim()) {
      const matchedItem = items.find((it) => it.id === itemId);
      showToast(
        'warning',
        'Actual Payment Date Required',
        `Please enter the Actual Payment Date before marking "${matchedItem?.compliance_nature || 'Compliance'}" as Completed.`
      );
      if (matchedItem) {
        handleOpenEditDrawer(matchedItem, {
          forcedStatus: 'Completed',
          warning: 'Please specify the Actual Payment / Execution Date to mark this item as Completed.',
        });
      }
      return;
    }

    const updatedEntries = {
      ...entries,
      [itemId]: {
        ...currentEntry,
        status: newStatus,
      },
    };
    setEntries(updatedEntries);

    setSavingKey(itemId);
    try {
      await fetch('/api/finance/compliance-calendar/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          item_id: itemId,
          period_month: activeMonth,
          period_year: activeYear,
          status: newStatus,
          actual_payment_date: updatedEntries[itemId].actual_payment_date || null,
          remarks: updatedEntries[itemId].remarks || '',
        }),
      });
      showToast('success', 'Status Updated', `Status changed to ${newStatus}.`);
    } catch (err) {
      console.warn('Entry save fallback:', err);
    } finally {
      setTimeout(() => setSavingKey(null), 600);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `${STORAGE_ENTRIES_PREFIX}${companyId}_${activeYear}_${activeMonth}`,
        JSON.stringify(updatedEntries)
      );
    }
  };

  // Add Item Submit
  const handleAddItemSubmit = async (e) => {
    e.preventDefault();
    if (!itemForm.compliance_nature?.trim() || !companyId) return;

    const { statutory, internal } = getResolvedDatesForForm(itemForm);
    const finalStatutory = statutory || '7th of following month';
    const finalInternal = internal || '1st of following month';

    const nextSNo = items.length > 0 ? Math.max(...items.map((it) => it.s_no || 0)) + 1 : 1;

    let newItem = null;
    let allUpdatedItems = null;
    try {
      const res = await fetch('/api/finance/compliance-calendar/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          s_no: nextSNo,
          compliance_nature: itemForm.compliance_nature.trim(),
          category: itemForm.category?.trim() || 'GST',
          frequency: itemForm.frequency,
          statutory_due_date: finalStatutory,
          internal_control_due_date: finalInternal,
        }),
      });
      const data = await res.json();
      if (data.item) newItem = data.item;
      if (data.items) allUpdatedItems = data.items;
    } catch (err) {
      console.warn('API add item fallback:', err);
    }

    if (!newItem) {
      newItem = {
        id: `item-${Date.now()}`,
        company_id: companyId,
        s_no: nextSNo,
        compliance_nature: itemForm.compliance_nature.trim(),
        category: itemForm.category?.trim() || 'GST',
        frequency: itemForm.frequency,
        statutory_due_date: finalStatutory,
        internal_control_due_date: finalInternal,
      };
    }

    const updated = allUpdatedItems || [...items, newItem];
    setItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_ITEMS_PREFIX}${companyId}`, JSON.stringify(updated));
    }

    showToast('success', 'Item Created', `Added "${newItem.compliance_nature}" successfully.`);

    setItemForm({
      compliance_nature: '',
      category: 'GST',
      use_custom_category: false,
      custom_category: '',
      frequency: 'Monthly',
      monthly_statutory_day: '7th',
      monthly_statutory_timing: 'of following month',
      monthly_internal_day: '1st',
      monthly_internal_timing: 'of following month',
      quarterly_statutory_preset: '30th of month following quarter',
      quarterly_internal_preset: '25th of month following quarter',
      halfyearly_statutory_preset: '30th September & 31st March',
      halfyearly_internal_preset: '20th September & 20th March',
      annual_statutory_month: 'September',
      annual_statutory_day: '30th',
      annual_internal_month: 'September',
      annual_internal_day: '20th',
      onetime_statutory_date: '2026-09-30',
      onetime_internal_date: '2026-09-25',
      use_custom_statutory: false,
      use_custom_internal: false,
      custom_statutory_text: '',
      custom_internal_text: '',
    });
    setIsAddItemDrawerOpen(false);
  };

  // Add Person
  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!personForm.name.trim() || !personForm.email.trim() || !companyId) return;

    let newPerson = null;
    try {
      const res = await fetch(`/api/finance/companies/${companyId}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personForm),
      });
      const data = await res.json();
      if (data.person) newPerson = data.person;
    } catch (err) {
      console.warn('Person create fallback:', err);
    }

    if (!newPerson) {
      newPerson = {
        id: `person-${Date.now()}`,
        company_id: companyId,
        ...personForm,
      };
    }

    const updated = [...persons, newPerson];
    setPersons(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PERSONS_PREFIX}${companyId}`, JSON.stringify(updated));
    }

    setPersonForm({
      name: '',
      designation: '',
      company_directory: 'General Directory',
      email: '',
      phone: '',
      is_primary: false,
    });
    setIsAddPersonDrawerOpen(false);
  };

  // Open Add Director Drawer
  const handleOpenAddDirector = () => {
    setPersonForm({
      person_type: 'Director',
      name: '',
      designation: 'Director',
      company_directory: 'Company Director',
      email: '',
      phone: '',
      is_primary: false,
    });
    setIsAddPersonDrawerOpen(true);
  };

  // Open Add Team Member Drawer
  const handleOpenAddTeamMember = () => {
    setPersonForm({
      person_type: 'Team',
      name: '',
      designation: '',
      company_directory: 'Team Member',
      email: '',
      phone: '',
      is_primary: false,
    });
    setIsAddPersonDrawerOpen(true);
  };

  // Delete Person
  const handleDeletePerson = async (personId) => {
    if (!confirm('Are you sure you want to remove this contact from the company team?')) return;
    try {
      await fetch(`/api/finance/companies/${companyId}/persons?personId=${personId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Person delete fallback:', err);
    }
    const updated = persons.filter((p) => p.id !== personId);
    setPersons(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PERSONS_PREFIX}${companyId}`, JSON.stringify(updated));
    }
  };

  // Open Edit Person Drawer
  const handleOpenEditPerson = (person) => {
    const isDir = (person.company_directory || '').toLowerCase().includes('director') || (person.designation || '').toLowerCase().includes('director');
    setEditingPerson(person);
    setEditPersonForm({
      person_type: isDir ? 'Director' : 'Team',
      name: person.name || '',
      designation: person.designation || (isDir ? 'Director' : 'Team Member'),
      company_directory: person.company_directory || (isDir ? 'Company Director' : 'Team Member'),
      email: person.email || '',
      phone: person.phone || '',
      is_primary: Boolean(person.is_primary),
    });
    setIsEditPersonDrawerOpen(true);
  };

  // Save Person Edits directly to database
  const handleSaveEditPerson = async (e) => {
    e.preventDefault();
    if (!editingPerson || !companyId) return;

    if (!editPersonForm.name.trim() || !editPersonForm.email.trim()) {
      showToast('warning', 'Missing Details', 'Name and Email are required.');
      return;
    }

    setSavingPerson(true);
    const updatedPerson = {
      ...editingPerson,
      name: editPersonForm.name.trim(),
      designation: editPersonForm.designation.trim() || null,
      company_directory: editPersonForm.company_directory?.trim() || 'General Directory',
      email: editPersonForm.email.trim().toLowerCase(),
      phone: editPersonForm.phone.trim() || null,
      is_primary: editPersonForm.is_primary,
    };

    try {
      const res = await fetch(`/api/finance/companies/${companyId}/persons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: editingPerson.id,
          ...updatedPerson,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to update member');

      setPersons((prev) =>
        prev.map((p) => {
          if (p.id === editingPerson.id) return data.person || updatedPerson;
          if (updatedPerson.is_primary && p.id !== editingPerson.id) return { ...p, is_primary: false };
          return p;
        })
      );

      if (typeof window !== 'undefined') {
        const currentList = JSON.parse(localStorage.getItem(`${STORAGE_PERSONS_PREFIX}${companyId}`) || '[]');
        const updatedStorage = currentList.map((p) => (p.id === editingPerson.id ? (data.person || updatedPerson) : p));
        localStorage.setItem(`${STORAGE_PERSONS_PREFIX}${companyId}`, JSON.stringify(updatedStorage));
      }

      setIsEditPersonDrawerOpen(false);
      showToast('success', 'Contact Updated', `${updatedPerson.name}'s details were updated in database.`);
    } catch (err) {
      console.error('Update person error:', err);
      showToast('error', 'Update Failed', err.message || 'Could not update contact');
    } finally {
      setSavingPerson(false);
    }
  };

  // Open Edit Profile Drawer
  const handleOpenEditProfile = () => {
    if (!company) return;
    setProfileForm({
      company_name: company.company_name || '',
      industry: company.industry || '',
      address: company.address || '',
      gstin: company.gstin || company.gst_number || '',
      pan_number: company.pan_number || '',
      cin_number: company.cin_number || '',
      website: company.website || '',
      note: company.note || '',
    });
    setIsEditProfileDrawerOpen(true);
  };

  // Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.company_name?.trim() || !companyId) return;

    let updatedComp = null;
    try {
      const res = await fetch(`/api/finance/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.company) {
        updatedComp = data.company;
      }
    } catch (err) {
      console.warn('Company update error:', err);
    }

    const finalComp = updatedComp || {
      ...(company || {}),
      ...profileForm,
    };

    setCompany(finalComp);
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, ...finalComp } : c))
    );

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_COMPANIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedList = parsed.map((c) => (c.id === companyId ? { ...c, ...finalComp } : c));
        localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(updatedList));
      }
    }

    setIsEditProfileDrawerOpen(false);
  };

  // Send Email (Supports Multi-Recipients, CC, FY Selection, and Heat Map Table)
  const handleSendEmail = async (e) => {
    e.preventDefault();

    // Collect all TO recipients (checked persons + custom input)
    const toList = new Set();
    selectedRecipientEmails.forEach((em) => em && toList.add(em.trim()));
    if (toList.size === 0 && selectedRecipientEmail) toList.add(selectedRecipientEmail.trim());
    if (customToEmail.trim()) {
      customToEmail
        .split(/[,;\s]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((em) => toList.add(em));
    }

    const finalRecipients = Array.from(toList);
    if (finalRecipients.length === 0) {
      alert('Please select or specify at least one recipient email address.');
      return;
    }

    const recipientDetails = finalRecipients.map((email) => {
      const found = persons.find((p) => p.email && p.email.toLowerCase() === email.toLowerCase());
      return {
        email,
        name: found?.name || email.split('@')[0],
      };
    });
    const finalRecipientNames = recipientDetails.map((r) => r.name);
    const finalRecipientName =
      finalRecipientNames.length > 0
        ? (finalRecipientNames.length <= 3 ? finalRecipientNames.join(', ') : `${finalRecipientNames.slice(0, 2).join(', ')} & ${finalRecipientNames.length - 2} more`)
        : (company?.company_name || 'Valued Client');

    // Collect all CC recipients (checked persons + custom input)
    const ccList = new Set();
    selectedCcEmails.forEach((em) => em && ccList.add(em.trim()));
    if (customCcEmail.trim()) {
      customCcEmail
        .split(/[,;\s]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((em) => ccList.add(em));
    }
    const finalCcRecipients = Array.from(ccList).filter((em) => !toList.has(em));

    setEmailSending(true);
    setEmailSuccessMessage('');
    try {
      const res = await fetch('/api/finance/compliance-calendar/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          recipientEmails: finalRecipients,
          recipientEmail: finalRecipients[0],
          recipientName: finalRecipientName,
          recipientNames: finalRecipientNames,
          ccEmails: finalCcRecipients,
          subject: emailSubject,
          periodMonth: activeMonth,
          periodYear: activeYear,
          financialYear: emailFyYear || selectedFyYear,
          includeHeatmap: true,
          customMessage: emailCustomMessage,
          senderName: 'Universe One Finance Team',
          itemsOverride: items,
          entriesOverride: entries,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');

      if (data.logEntry) {
        setEmailLogs((prev) => [data.logEntry, ...prev]);
      } else {
        const elRes = await fetch(`/api/finance/compliance-calendar/email-logs?companyId=${companyId}`);
        const elData = await elRes.json().catch(() => ({}));
        if (Array.isArray(elData.logs)) setEmailLogs(elData.logs);
      }

      const sentSummary = finalCcRecipients.length > 0 
        ? `${finalRecipients.join(', ')} (CC: ${finalCcRecipients.join(', ')})`
        : finalRecipients.join(', ');

      showToast('success', 'Report Dispatched', `Compliance calendar emailed to ${sentSummary}`);
      setEmailSuccessMessage(data.message || `Compliance report emailed to ${sentSummary}`);
      setTimeout(() => {
        setIsEmailDrawerOpen(false);
        setEmailSuccessMessage('');
        setEmailCustomMessage('');
      }, 2500);
    } catch (err) {
      console.error('Email error:', err);
      showToast('error', 'Email Delivery Failed', err.message || 'Failed to send email');
      alert('Failed to send email: ' + err.message);
    } finally {
      setEmailSending(false);
    }
  };

  // Statistics & Breakdown
  const stats = useMemo(() => {
    if (isBeforeInception) {
      return {
        total: items.length,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
        score: 0,
        isPreInception: true,
        frequencyCounts: {
          Monthly: 0,
          Quarterly: 0,
          Annual: 0,
          'One time': 0,
          'Half-Yearly': 0,
        },
      };
    }

    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let overdue = 0;

    const frequencyCounts = {
      Monthly: 0,
      Quarterly: 0,
      Annual: 0,
      'One time': 0,
      'Half-Yearly': 0,
    };

    items.forEach((it) => {
      const entry = {
        ...(entries[it.id] || {}),
        ...resolveEffectiveEntry(it, company?.monthly_entries, activeMonth, activeYear),
      };
      const st = computeEffectiveStatus(it, entry, activeMonth, activeYear, new Date(), company?.created_at);
      if (st === 'Completed') completed++;
      else if (st === 'In Progress') inProgress++;
      else if (st === 'Overdue') overdue++;
      else pending++;

      const freq = it.frequency || 'Monthly';
      if (frequencyCounts[freq] !== undefined) {
        frequencyCounts[freq]++;
      }
    });

    const total = items.length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, pending, overdue, score, isPreInception: false, frequencyCounts };
  }, [items, entries, activeMonth, activeYear, isBeforeInception, company?.created_at, company?.monthly_entries]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const entry = {
        ...(entries[item.id] || {}),
        ...resolveEffectiveEntry(item, company?.monthly_entries, activeMonth, activeYear),
      };
      const effectiveSt = computeEffectiveStatus(item, entry, activeMonth, activeYear, new Date(), company?.created_at);
      const cat = item.category || resolveItemCategory(item);

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const natureMatch = item.compliance_nature?.toLowerCase().includes(term);
        const dueMatch = item.statutory_due_date?.toLowerCase().includes(term);
        const catMatch = cat.toLowerCase().includes(term);
        const remarkMatch = entry.remarks?.toLowerCase().includes(term);
        if (!natureMatch && !dueMatch && !catMatch && !remarkMatch) return false;
      }
      if (categoryFilter !== 'ALL' && cat.toUpperCase() !== categoryFilter.toUpperCase()) return false;
      if (frequencyFilter !== 'ALL' && item.frequency !== frequencyFilter) return false;
      if (statusFilter !== 'ALL') {
        if (effectiveSt !== statusFilter) return false;
      }
      return true;
    });
  }, [items, entries, activeMonth, activeYear, searchTerm, categoryFilter, frequencyFilter, statusFilter, company?.created_at, company?.monthly_entries]);

  // Dashboard filtered list
  const dashboardItems = useMemo(() => {
    if (dashboardFilter === 'ALL') return items;
    if (dashboardFilter === 'NEEDS_ACTION') {
      return items.filter((it) => {
        const entry = {
          ...(entries[it.id] || {}),
          ...resolveEffectiveEntry(it, company?.monthly_entries, activeMonth, activeYear),
        };
        const st = computeEffectiveStatus(it, entry, activeMonth, activeYear, new Date(), company?.created_at);
        return st === 'Pending' || st === 'Overdue';
      });
    }
    return items.filter((it) => {
      const entry = {
        ...(entries[it.id] || {}),
        ...resolveEffectiveEntry(it, company?.monthly_entries, activeMonth, activeYear),
      };
      const st = computeEffectiveStatus(it, entry, activeMonth, activeYear, new Date(), company?.created_at);
      return st === dashboardFilter;
    });
  }, [items, entries, activeMonth, activeYear, dashboardFilter, company?.created_at, company?.monthly_entries]);

  const activePeriodLabel = formatPeriodLabel(activeMonth, activeYear);
  const activePeriodFull = formatPeriodFull(activeMonth, activeYear);

  const sidebarNavItems = [
    {
      id: 'dashboard',
      label: 'Compliance Dashboard',
      icon: LayoutDashboard,
      badge: `${stats.score}%`,
    },
    {
      id: 'calendar',
      label: 'Compliance Calendar',
      icon: Calendar,
      badge: items.length.toString(),
    },
    {
      id: 'people',
      label: 'Company People',
      icon: Users,
      badge: persons.length.toString(),
    },
    {
      id: 'profile',
      label: 'Company Profile',
      icon: Building,
    },
    {
      id: 'email_logs',
      label: 'Email History & Logs',
      icon: History,
      badge: emailLogs.length.toString(),
    },
  ];

  return (
    <ModuleAccessGate moduleKey="finance" moduleLabel="Finance">
      <div
        className="flex h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_50%,#f0fdf4_100%)] text-slate-800 font-sans"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
      {/* Mobile Sidebar backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* =========================================================================
          1. FULL-HEIGHT APPLICATION SIDEBAR (FAR STYLE)
         ========================================================================= */}
      <aside
          className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/80 shadow-[10px_0_30px_rgba(15,23,42,0.02)] transition-all duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
          }`}
        >
        {/* Sidebar Top: Brand & Module Hub */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200/80 shrink-0 bg-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3170c6] to-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black tracking-tight text-slate-900 leading-tight">
                  Compliance Hub
                </span>
                <span className="text-[10px] font-semibold text-[#3170c6]">
                  Finance Operations
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Switcher Box in Sidebar */}
        {isSidebarOpen && (
          <div className="px-4 pt-3.5 pb-2 border-b border-slate-100/80">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Active Entity
            </label>
            <div className="relative flex items-center gap-1.5">
              <select
                value={companyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 cursor-pointer transition-colors truncate"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200">
          {sidebarNavItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#edf4fc] text-[#3170c6] shadow-xs shadow-[#3170c6]/5 font-extrabold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      isActive ? 'text-[#3170c6]' : 'text-slate-400'
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </div>

                {isSidebarOpen && item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#3170c6] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 shrink-0 space-y-2">
          {isSidebarOpen && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/60 to-indigo-50/60 border border-blue-100/80 text-[11px] space-y-1.5">
              <div className="flex justify-between items-center text-slate-500">
                <span>Period:</span>
                <span className="font-bold text-[#3170c6]">{activePeriodLabel}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Compliance:</span>
                <span className="font-bold text-emerald-700">{stats.score}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#3170c6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.score}%` }}
                />
              </div>
            </div>
          )}

          <Link
            href="/other-modules/finance/compliance-calendar"
            className="flex items-center gap-2.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
            {isSidebarOpen && <span>All Companies</span>}
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN WORKSPACE CONTENT AREA (TOP INFO HEADER + DYNAMIC TABS)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Workspace Top Info Header */}
        <header className="h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Information */}
            <div className="flex items-center gap-2 text-xs truncate font-medium">
              <Link
                href="/other-modules/finance"
                className="text-slate-400 hover:text-[#3170c6] transition-colors hidden sm:inline font-semibold"
              >
                Finance
              </Link>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <Link
                href="/other-modules/finance/compliance-calendar"
                className="text-slate-400 hover:text-[#3170c6] transition-colors hidden sm:inline font-semibold"
              >
                Compliance Calendar
              </Link>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-extrabold text-slate-900 truncate px-2.5 py-0.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-[#3170c6] text-xs">
                {company?.company_name || 'Loading...'}
              </span>
            </div>
          </div>

          {/* Top Info Actions: Period Stepper & Email Dispatch */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Period Stepper */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-800 px-2 min-w-[65px] text-center">
                {MONTH_SHORT_NAMES[activeMonth - 1]}'{(activeYear % 100)}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-white text-slate-600 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Email Calendar Button */}
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-sm shadow-[#3170c6]/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Email Calendar to Client</span>
              <span className="sm:hidden">Email</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* =========================================================================
              TAB 1: REDESIGNED COMPLIANCE DASHBOARD (Clean, Modern, Actionable)
             ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              
              {/* Pre-Inception Notice Banner */}
              {isBeforeInception && (
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/80 border border-blue-200 text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-[#3170c6] shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Data Not Available for {activePeriodFull}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        <strong>{company?.company_name || 'This entity'}</strong> was onboarded in <strong>{companyInception?.fullLabel || 'a later period'}</strong>. Statutory compliance tracking begins from {companyInception?.fullLabel || 'onboarding'} onwards.
                      </p>
                    </div>
                  </div>
                  {companyInception && (
                    <button
                      onClick={() => {
                        setActiveMonth(companyInception.month);
                        setActiveYear(companyInception.year);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
                    >
                      Go to {companyInception.label}
                    </button>
                  )}
                </div>
              )}

              {/* 1. KPI Metric Cards Directly at Top */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Statutory Scope
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">{stats.total}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Total monitored items</div>
                </div>

                <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-5 shadow-xs backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Completed
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-emerald-700">{stats.completed}</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Executed on schedule</div>
                </div>

                <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 shadow-xs backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      In Progress
                    </span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-amber-700">{stats.inProgress}</div>
                  <div className="text-[11px] text-amber-600 mt-1">Active processing</div>
                </div>

                <div className="bg-blue-50/90 border border-blue-200/90 rounded-2xl p-5 shadow-xs backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Health Rating
                    </span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-blue-700">{stats.score}%</div>
                  <div className="text-[11px] text-blue-600 mt-1">Execution standing</div>
                </div>
              </div>

              {/* 2. Middle Row: Visual Status Breakdown & Frequency Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: Execution Breakdown & Progress */}
                <div className="lg:col-span-7 bg-white/90 border border-slate-200/80 rounded-2xl p-6 shadow-xs backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3170c6] flex items-center justify-center font-bold">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Compliance Velocity & Breakdown</h4>
                        <p className="text-[11px] text-slate-500">Status split for {activePeriodFull}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#3170c6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                      {stats.completed} of {stats.total} Done
                    </span>
                  </div>

                  {/* Multi-segment Progress Bar */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                      title={`Completed: ${stats.completed}`}
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                      title={`In Progress: ${stats.inProgress}`}
                    />
                    <div
                      className="bg-red-400 h-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0}%` }}
                      title={`Overdue: ${stats.overdue}`}
                    />
                    <div
                      className="bg-slate-300 h-full transition-all duration-500"
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                      title={`Pending: ${stats.pending}`}
                    />
                  </div>

                  {/* Legend Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Completed</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{stats.completed}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>In Progress</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{stats.inProgress}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>Pending</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{stats.pending}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span>Overdue</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{stats.overdue}</div>
                    </div>
                  </div>

                  {/* Executive Operational Velocity & Governance Insights */}
                  <div className="pt-3 border-t border-slate-100/90 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-[#3170c6]">
                          <Activity className="w-3.5 h-3.5" />
                          Settlement Rate
                        </span>
                        <span className="font-mono font-bold text-slate-800">
                          {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {stats.completed} of {stats.total} statutory mandates executed
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Governance Risk
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                          stats.overdue > 0
                            ? 'bg-red-100 text-red-700'
                            : stats.pending > 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stats.overdue > 0 ? 'High Risk' : stats.pending > 10 ? 'Moderate' : 'Low Risk'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {stats.overdue > 0 ? `${stats.overdue} overdue filings require attention` : 'All items progressing on schedule'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/70 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          Active Month
                        </span>
                        <span className="font-bold text-slate-800 text-[11px]">
                          {activePeriodLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {stats.pending + stats.inProgress} pending execution this cycle
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Card: Frequency Schedule Distribution */}
                <div className="lg:col-span-5 bg-white/90 border border-slate-200/80 rounded-2xl p-6 shadow-xs backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <PieChartIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Frequency Schedules</h4>
                        <p className="text-[11px] text-slate-500">Recurrence cadence</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {Object.entries(stats.frequencyCounts).map(([freq, count]) => (
                      <div
                        key={freq}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                      >
                        <span className="font-semibold text-slate-700">{freq} Compliances</span>
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-white text-slate-900 border border-slate-200 shadow-2xs">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  COMPLIANCE HEAT MAP (FY APRIL - MARCH MATRIX)
                 ========================================================================= */}
              <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-xs backdrop-blur-xl space-y-4">
                
                {/* 1. Centered Heading */}
                <div className="text-center pb-2 border-b border-slate-100/90">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Statutory Compliance Category Heat Map
                  </h3>
                </div>

                {/* 2. Controls Bar: Left (FY) | Middle (Frequency + Sub-Filter Dropdown) | Right (Search) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
                  
                  {/* Left: Financial Year Switcher */}
                  <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs shrink-0 self-start lg:self-auto">
                    <button
                      onClick={() => setSelectedFyYear((y) => y - 1)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Previous Financial Year"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-extrabold text-slate-800 tracking-wide font-mono select-none whitespace-nowrap">
                      FY {selectedFyYear}–{String(selectedFyYear + 1).slice(-2)}
                    </span>
                    <button
                      onClick={() => setSelectedFyYear((y) => y + 1)}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Next Financial Year"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Middle: Frequency Filter Pills & Cascading Sub-Option Dropdown */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {/* Period Pills */}
                    <div className="flex items-center gap-0.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs shrink-0">
                      {['ALL', 'Monthly', 'Quarterly', 'Half-Yearly', 'Annual', 'One time'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => {
                            setHeatmapFreqFilter(freq);
                            if (freq === 'Monthly') setHeatmapMonthSubFilter('ALL');
                            if (freq === 'Quarterly') setHeatmapQuarterSubFilter('ALL');
                            if (freq === 'Half-Yearly') setHeatmapHalfYearSubFilter('ALL');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            heatmapFreqFilter === freq
                              ? 'bg-white text-slate-900 shadow-2xs font-bold'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>

                    {/* Monthly Sub-Option Dropdown */}
                    {heatmapFreqFilter === 'Monthly' && (
                      <div className="animate-in fade-in duration-200 shrink-0">
                        <select
                          value={heatmapMonthSubFilter}
                          onChange={(e) => setHeatmapMonthSubFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3170c6] shadow-2xs cursor-pointer"
                        >
                          <option value="ALL">All Months (Apr - Mar)</option>
                          {FY_MONTHS.map((m) => (
                            <option key={m.month} value={m.month}>
                              {m.label} ({m.name})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Quarterly Sub-Option Dropdown */}
                    {heatmapFreqFilter === 'Quarterly' && (
                      <div className="animate-in fade-in duration-200 shrink-0">
                        <select
                          value={heatmapQuarterSubFilter}
                          onChange={(e) => setHeatmapQuarterSubFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3170c6] shadow-2xs cursor-pointer"
                        >
                          <option value="ALL">All Quarters (Q1 - Q4)</option>
                          <option value="Q1">Q1 (Apr – Jun)</option>
                          <option value="Q2">Q2 (Jul – Sep)</option>
                          <option value="Q3">Q3 (Oct – Dec)</option>
                          <option value="Q4">Q4 (Jan – Mar)</option>
                        </select>
                      </div>
                    )}

                    {/* Half-Yearly Sub-Option Dropdown */}
                    {heatmapFreqFilter === 'Half-Yearly' && (
                      <div className="animate-in fade-in duration-200 shrink-0">
                        <select
                          value={heatmapHalfYearSubFilter}
                          onChange={(e) => setHeatmapHalfYearSubFilter(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3170c6] shadow-2xs cursor-pointer"
                        >
                          <option value="ALL">All Half-Years (H1 & H2)</option>
                          <option value="H1">H1 (Apr – Sep)</option>
                          <option value="H2">H2 (Oct – Mar)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Expand / Collapse All & Search */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
                    <button
                      type="button"
                      onClick={isAllCategoriesExpanded ? handleCollapseAllCategories : handleExpandAllCategories}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
                      title={isAllCategoriesExpanded ? 'Collapse all categories' : 'Expand all categories'}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isAllCategoriesExpanded ? 'rotate-180 text-[#3170c6]' : 'text-slate-500'
                        }`}
                      />
                      <span>{isAllCategoriesExpanded ? 'Collapse All' : 'Expand All'}</span>
                    </button>

                    <div className="relative shrink-0">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={heatmapSearchTerm}
                        onChange={(e) => setHeatmapSearchTerm(e.target.value)}
                        placeholder="Search compliances..."
                        className="pl-8.5 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 focus:border-[#3170c6] w-36 sm:w-44"
                      />
                      {heatmapSearchTerm && (
                        <button
                          onClick={() => setHeatmapSearchTerm('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Table Matrix Container (Compact layout, dynamic visible months) */}
                <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-2 w-8 min-w-[34px] max-w-[38px] text-center sticky left-0 bg-slate-100 z-10 font-bold text-slate-500 border-r border-slate-200 text-[10px]">
                          #
                        </th>
                        <th className="py-2.5 px-3 w-56 min-w-[180px] max-w-[260px] sticky left-8 bg-slate-100 z-10 font-extrabold text-slate-800 border-r border-slate-200 text-xs">
                          Category / Compliance
                        </th>
                        <th className="py-2.5 px-2 w-20 min-w-[70px] max-w-[80px] text-center font-bold text-slate-700 border-r border-slate-200 text-[11px]">
                          Frequency
                        </th>
                        {visibleHeatmapMonths.map((mObj, mIdx) => {
                          const mYear = selectedFyYear + mObj.yearOffset;
                          const isCurrentCalMonth = currentCalendarMonth === mObj.month && currentCalendarYear === mYear;
                          const nextMonthObj = visibleHeatmapMonths[mIdx + 1];
                          const isNextMonthCurrent = nextMonthObj && (currentCalendarMonth === nextMonthObj.month && currentCalendarYear === (selectedFyYear + nextMonthObj.yearOffset));
                          return (
                            <th
                              key={mObj.month}
                              className={`py-2 px-0.5 text-center min-w-[44px] max-w-[50px] last:border-r-0 ${
                                isCurrentCalMonth
                                  ? '!border-t !border-l !border-r !border-b !border-[#3170c6] bg-blue-100/90 text-[#3170c6] font-black shadow-xs relative z-20'
                                  : isNextMonthCurrent
                                  ? '!border-r !border-r-[#3170c6] text-slate-700 font-bold'
                                  : 'border-r border-slate-200 text-slate-700 font-bold'
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-[11px] font-bold leading-tight">{mObj.name}</span>
                                {isCurrentCalMonth && (
                                  <span className="mt-0.5 text-[7px] font-black px-1.5 py-0.2 rounded-full bg-[#3170c6] text-white uppercase tracking-wider shadow-2xs">
                                    Current
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {groupedHeatmapCategories.length === 0 ? (
                        <tr>
                          <td colSpan={3 + visibleHeatmapMonths.length} className="py-12 text-center text-slate-400">
                            <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-xs font-semibold">No compliances matching filters</p>
                          </td>
                        </tr>
                      ) : (
                        groupedHeatmapCategories.map((group, gIdx) => {
                          const isExpanded = Boolean(expandedCategories[group.category]);
                          const isLastGroup = gIdx === groupedHeatmapCategories.length - 1 && (!isExpanded || group.items.length === 0);

                          // Summarize frequency
                          const uniqueFreqs = Array.from(new Set(group.items.map((it) => it.frequency || 'Monthly')));
                          const summaryFreq = uniqueFreqs.length === 1 ? uniqueFreqs[0] : 'Multiple';

                          return (
                            <React.Fragment key={`group-${group.category}`}>
                              {/* Parent Unique Category Row */}
                              <tr className="bg-slate-50/80 hover:bg-blue-50/40 transition-colors border-b border-slate-200/80 group">
                                {/* S.No */}
                                <td className="py-2.5 px-1 text-center sticky left-0 bg-slate-50 group-hover:bg-blue-50/40 z-10 font-bold text-[11px] text-slate-600 border-r border-slate-200/80">
                                  {gIdx + 1}
                                </td>

                                {/* Category Title with Expand/Collapse Icon & Count */}
                                <td
                                  onClick={() => toggleCategory(group.category)}
                                  className="py-2.5 px-3 sticky left-8 bg-slate-50 group-hover:bg-blue-50/40 z-10 border-r border-slate-200/80 cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(group.category);
                                      }}
                                      className="p-1 rounded hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer"
                                      title={isExpanded ? 'Collapse category' : 'Expand category'}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-[#3170c6]" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                    </button>
                                    <span className="font-extrabold text-slate-900 text-xs">
                                      {group.category}
                                    </span>
                                    <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full text-[8px] font-bold bg-slate-200/60 text-slate-500 border border-slate-300/40 leading-none">
                                      {group.items.length}
                                    </span>
                                  </div>
                                </td>

                                {/* Frequency Summary */}
                                <td className="py-2 px-1 text-center border-r border-slate-200/80 bg-slate-50 group-hover:bg-blue-50/40 font-semibold text-slate-600 text-[10px]">
                                  {summaryFreq}
                                </td>

                                {/* Rollup Month Cells */}
                                {visibleHeatmapMonths.map((mObj, mIdx) => {
                                  const rollup = getCategoryMonthRollupState(group.items, mObj, selectedFyYear, company);
                                  const mYear = selectedFyYear + mObj.yearOffset;
                                  const isCurrentCalMonth = currentCalendarMonth === mObj.month && currentCalendarYear === mYear;
                                  const nextMonthObj = visibleHeatmapMonths[mIdx + 1];
                                  const isNextMonthCurrent = nextMonthObj && (currentCalendarMonth === nextMonthObj.month && currentCalendarYear === (selectedFyYear + nextMonthObj.yearOffset));

                                  const colBorderClass = isCurrentCalMonth
                                    ? isLastGroup
                                      ? '!border-l !border-r !border-b !border-l-[#3170c6] !border-r-[#3170c6] !border-b-[#3170c6] relative z-10'
                                      : '!border-l !border-r !border-l-[#3170c6] !border-r-[#3170c6] border-b border-b-slate-200/80 relative z-10'
                                    : isNextMonthCurrent
                                    ? '!border-r !border-r-[#3170c6] border-b border-slate-200/80'
                                    : 'border-r border-b border-slate-200/80 last:border-r-0';

                                  if (!rollup.isApplicable || rollup.status === 'NA') {
                                    return (
                                      <td
                                        key={mObj.month}
                                        className={`p-0 text-center ${isCurrentCalMonth ? 'bg-blue-50/20' : 'bg-slate-50/40'} text-slate-300 font-light select-none ${colBorderClass}`}
                                        title={rollup.tooltip}
                                      >
                                        <div className="w-full h-8 flex items-center justify-center text-[10px] font-light text-slate-300">
                                          —
                                        </div>
                                      </td>
                                    );
                                  }

                                  let cellBg = isCurrentCalMonth ? 'bg-slate-400 hover:bg-slate-500' : 'bg-slate-400 hover:bg-slate-500';
                                  let icon = <Clock className="w-2.5 h-2.5 text-white shrink-0" />;
                                  let textColor = 'text-white font-semibold';

                                  if (rollup.status === 'Completed') {
                                    cellBg = 'bg-emerald-600 hover:bg-emerald-700';
                                    icon = <CheckCircle2 className="w-2.5 h-2.5 text-white shrink-0" />;
                                    textColor = 'text-white font-bold';
                                  } else if (rollup.status === 'In Progress') {
                                    cellBg = 'bg-amber-500 hover:bg-amber-600';
                                    icon = <Clock className="w-2.5 h-2.5 text-slate-950 shrink-0" />;
                                    textColor = 'text-slate-950 font-bold';
                                  } else if (rollup.status === 'Overdue') {
                                    cellBg = 'bg-rose-600 hover:bg-rose-700';
                                    icon = <AlertCircle className="w-2.5 h-2.5 text-white shrink-0" />;
                                    textColor = 'text-white font-bold';
                                  }

                                  return (
                                    <td
                                      key={mObj.month}
                                      className={`p-0 text-center transition-colors ${colBorderClass} ${cellBg}`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (group.items.length === 1) {
                                            handleOpenEditDrawer(group.items[0], {
                                              targetMonth: mObj.month,
                                              targetYear: mYear,
                                            });
                                          } else {
                                            toggleCategory(group.category);
                                          }
                                        }}
                                        title={`${group.category} (${mObj.name} ${mYear})\n${rollup.tooltip}\n(Click to ${group.items.length === 1 ? 'view/edit compliance' : 'expand child compliances'})`}
                                        className={`w-full h-8 px-0.5 flex items-center justify-center gap-0.5 text-[10px] transition-transform active:scale-95 cursor-pointer ${textColor}`}
                                      >
                                        {icon}
                                        <span className="truncate">{rollup.label}</span>
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>

                              {/* Collapsible Child Rows (Individual Compliance Items) */}
                              {isExpanded &&
                                group.items.map((item, iIdx) => {
                                  const freq = item.frequency || 'Monthly';
                                  const isLastChildOfLastGroup = gIdx === groupedHeatmapCategories.length - 1 && iIdx === group.items.length - 1;

                                  return (
                                    <tr
                                      key={item.id}
                                      className="bg-white hover:bg-blue-50/30 transition-colors border-b border-slate-100 group"
                                    >
                                      {/* Sub-number */}
                                      <td className="py-2 px-1 text-center sticky left-0 bg-white group-hover:bg-blue-50/30 z-10 font-mono text-[9px] text-slate-400 border-r border-slate-200/80">
                                        {gIdx + 1}.{iIdx + 1}
                                      </td>

                                      {/* Indented Compliance Nature */}
                                      <td className="py-2 px-3 pl-6 sticky left-8 bg-white group-hover:bg-blue-50/30 z-10 border-r border-slate-200/80 font-medium text-slate-800 text-xs">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-slate-300 select-none text-[10px]">↳</span>
                                          <span
                                            className="hover:text-[#3170c6] transition-colors truncate max-w-[220px]"
                                            title={item.compliance_nature}
                                          >
                                            {item.compliance_nature}
                                          </span>
                                        </div>
                                      </td>

                                      {/* Individual Frequency */}
                                      <td className="py-2 px-1 text-center border-r border-slate-200/80 bg-white group-hover:bg-blue-50/30 font-medium text-slate-500 text-[10px]">
                                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-[9px]">
                                          {freq}
                                        </span>
                                      </td>

                                      {/* Visible Month Cells for this specific item */}
                                      {visibleHeatmapMonths.map((mObj, mIdx) => {
                                        const cell = getCellComplianceState(item, mObj, selectedFyYear, company);
                                        const mYear = selectedFyYear + mObj.yearOffset;
                                        const isCurrentCalMonth = currentCalendarMonth === mObj.month && currentCalendarYear === mYear;
                                        const nextMonthObj = visibleHeatmapMonths[mIdx + 1];
                                        const isNextMonthCurrent = nextMonthObj && (currentCalendarMonth === nextMonthObj.month && currentCalendarYear === (selectedFyYear + nextMonthObj.yearOffset));

                                        const colBorderClass = isCurrentCalMonth
                                          ? isLastChildOfLastGroup
                                            ? '!border-l !border-r !border-b !border-l-[#3170c6] !border-r-[#3170c6] !border-b-[#3170c6] relative z-10'
                                            : '!border-l !border-r !border-l-[#3170c6] !border-r-[#3170c6] border-b border-b-slate-200/80 relative z-10'
                                          : isNextMonthCurrent
                                          ? '!border-r !border-r-[#3170c6] border-b border-slate-200/80'
                                          : 'border-r border-b border-slate-200/80 last:border-r-0';

                                        if (!cell.isApplicable || cell.status === 'NA') {
                                          return (
                                            <td
                                              key={mObj.month}
                                              className={`p-0 text-center ${isCurrentCalMonth ? 'bg-blue-50/20' : 'bg-slate-50/40'} text-slate-300 font-light select-none ${colBorderClass}`}
                                              title={cell.tooltip}
                                            >
                                              <div className="w-full h-8 flex items-center justify-center text-[10px] font-light text-slate-300">
                                                —
                                              </div>
                                            </td>
                                          );
                                        }

                                        let cellBg = isCurrentCalMonth ? 'bg-slate-400 hover:bg-slate-500' : 'bg-slate-400 hover:bg-slate-500';
                                        let icon = <Clock className="w-2.5 h-2.5 text-white shrink-0" />;
                                        let shortText = 'Pending';
                                        let textColor = 'text-white font-semibold';

                                        if (cell.status === 'Completed') {
                                          cellBg = 'bg-emerald-600 hover:bg-emerald-700';
                                          icon = <CheckCircle2 className="w-2.5 h-2.5 text-white shrink-0" />;
                                          shortText = cell.entry?.actual_payment_date ? 'Paid' : 'Done';
                                          textColor = 'text-white font-bold';
                                        } else if (cell.status === 'In Progress') {
                                          cellBg = 'bg-amber-500 hover:bg-amber-600';
                                          icon = <Clock className="w-2.5 h-2.5 text-slate-950 shrink-0" />;
                                          shortText = 'In Prog';
                                          textColor = 'text-slate-950 font-bold';
                                        } else if (cell.status === 'Overdue') {
                                          cellBg = 'bg-rose-600 hover:bg-rose-700';
                                          icon = <AlertCircle className="w-2.5 h-2.5 text-white shrink-0" />;
                                          shortText = 'Overdue';
                                          textColor = 'text-white font-bold';
                                        }

                                        return (
                                          <td
                                            key={mObj.month}
                                            className={`p-0 text-center transition-colors ${colBorderClass} ${cellBg}`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() => {
                                                handleOpenEditDrawer(item, {
                                                  targetMonth: cell.month,
                                                  targetYear: cell.year,
                                                });
                                              }}
                                              title={`${cell.tooltip}\n(Click to view / edit for ${mObj.name} ${cell.year})`}
                                              className={`w-full h-8 px-0.5 flex items-center justify-center gap-0.5 text-[10px] transition-transform active:scale-95 cursor-pointer ${textColor}`}
                                            >
                                              {icon}
                                              <span className="truncate">{shortText}</span>
                                            </button>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Legend & Help Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-4 text-[11px]">
                    <span className="font-bold text-slate-700">Status Legend:</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </span>
                      <strong className="text-emerald-800">Completed / Paid</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 flex items-center justify-center">
                        <Clock className="w-2.5 h-2.5 text-slate-950" />
                      </span>
                      <strong className="text-amber-800">In Progress / Partial</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-rose-600 border border-rose-700 flex items-center justify-center">
                        <AlertCircle className="w-2.5 h-2.5 text-white" />
                      </span>
                      <strong className="text-rose-800">Overdue</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-slate-400 border border-slate-500 flex items-center justify-center">
                        <Clock className="w-2.5 h-2.5 text-white" />
                      </span>
                      <strong className="text-slate-700">Pending / Scheduled</strong>
                    </span>
                    <span className="text-slate-400">— Not Applicable</span>
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    💡 Tip: Click any cell to inspect or update statutory filings for that month.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: FULL COMPLIANCE CALENDAR SPREADSHEET (Row click opens edit drawer)
             ========================================================================= */}
          {activeTab === 'calendar' && (
            <div className="space-y-5 max-w-7xl mx-auto animate-fadeIn">
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#edf4fc] text-[#3170c6] flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Compliance Calendar — {activePeriodFull}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Click any row to open the full edit panel or adjust details
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search Input on left of filters */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search compliances..."
                      className="bg-slate-50 border border-slate-200/90 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 focus:border-[#3170c6] w-36 sm:w-44 shadow-2xs"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3170c6] cursor-pointer shadow-2xs transition-colors"
                  >
                    <option value="ALL">All Categories</option>
                    {calendarCategoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Frequency Filter */}
                  <select
                    value={frequencyFilter}
                    onChange={(e) => setFrequencyFilter(e.target.value)}
                    className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3170c6] cursor-pointer shadow-2xs transition-colors"
                  >
                    <option value="ALL">All Frequencies</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Annual">Annual</option>
                    <option value="One time">One time</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#3170c6] cursor-pointer shadow-2xs transition-colors"
                  >
                    <option value="ALL">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>

                  {/* Add Row Button */}
                  <button
                    onClick={() => setIsAddItemDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    Add Row
                  </button>
                </div>
              </div>

              {/* Calendar Spreadsheet Body / Pre-Inception Notice */}
              {isBeforeInception ? (
                <div className="bg-white/95 border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs backdrop-blur-xl space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3170c6] flex items-center justify-center mx-auto shadow-inner">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Data Not Available for {activePeriodFull}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <strong>{company?.company_name || 'This company'}</strong> was onboarded in <strong>{companyInception?.fullLabel || 'a later period'}</strong>. Statutory compliance monitoring and monthly tracking records begin from {companyInception?.fullLabel || 'onboarding'} onwards.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {companyInception && (
                      <button
                        onClick={() => {
                          setActiveMonth(companyInception.month);
                          setActiveYear(companyInception.year);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Switch to Onboarded Month ({companyInception.label})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const now = new Date();
                        setActiveMonth(now.getMonth() + 1);
                        setActiveYear(now.getFullYear());
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Jump to Current Month
                    </button>
                  </div>
                </div>
              ) : (
                /* Spreadsheet Grid with Increased Status Column Width */
                <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                          <th className="py-3.5 px-3 w-12 text-center">S.No</th>
                          <th className="py-3.5 px-4 min-w-[240px]">Compliance Nature</th>
                          <th className="py-3.5 px-3 w-28 text-center">Category</th>
                          <th className="py-3.5 px-3 w-28 text-center">Frequency</th>
                          <th className="py-3.5 px-4 min-w-[180px]">Statutory Due Date</th>
                          <th className="py-3.5 px-4 min-w-[180px]">Internal Control Date</th>
                          <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Actual Payment Date</th>
                          
                          {/* Increased Status Column Width */}
                          <th className="py-3.5 px-4 w-44 min-w-[170px] text-center">Status</th>
                          
                          <th className="py-3.5 px-4 min-w-[240px]">Remarks / Notes</th>
                          <th className="py-3.5 px-3 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredItems.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-12 text-center text-slate-400">
                              No compliance items recorded yet. Click "Add Row" above to add your first compliance item.
                            </td>
                          </tr>
                        ) : (
                          filteredItems.map((item, index) => {
                            const entry = {
                              ...(entries[item.id] || {}),
                              ...resolveEffectiveEntry(item, company?.monthly_entries, activeMonth, activeYear),
                            };
                            const status = computeEffectiveStatus(item, entry, activeMonth, activeYear, new Date(), company?.created_at);
                            const cat = item.category || resolveItemCategory(item);

                          return (
                            <tr
                              key={item.id}
                              onClick={() => handleOpenEditDrawer(item)}
                              className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                            >
                              {/* S.No */}
                              <td className="py-3 px-3 text-center font-bold text-slate-400">
                                {item.s_no || index + 1}
                              </td>

                              {/* Compliance Nature */}
                              <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-[#3170c6] transition-colors">
                                {item.compliance_nature}
                              </td>

                              {/* Category (After Compliance Nature, Before Frequency) */}
                              <td className="py-3 px-3 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${getCategoryBadgeStyle(cat)}`}>
                                  {cat}
                                </span>
                              </td>

                              {/* Frequency */}
                              <td className="py-3 px-3 text-center">
                                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                                  {item.frequency}
                                </span>
                              </td>

                              {/* Statutory Due Date */}
                              <td className="py-3 px-4 font-medium text-slate-800">
                                {item.statutory_due_date}
                              </td>

                              {/* Internal Control Due Date */}
                              <td className="py-3 px-4 text-slate-500">
                                {item.internal_control_due_date || '—'}
                              </td>

                              {/* Actual Payment Date */}
                              <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                                {entry.actual_payment_date ? (
                                  <span className="font-semibold text-emerald-700">
                                    {entry.actual_payment_date}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              {/* Status with increased width and dropdown */}
                              <td className="py-2 px-3 text-center">
                                <select
                                  value={status}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleStatusChange(item.id, e.target.value, e)}
                                  className={`appearance-none w-full text-center px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none shadow-2xs ${
                                    status === 'Completed'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : status === 'In Progress'
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : status === 'Overdue'
                                      ? 'bg-red-50 text-red-700 border-red-300'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  <option value="Completed">Completed</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Overdue">Overdue</option>
                                </select>
                              </td>

                              {/* Remarks */}
                              <td className="py-2 px-3 text-slate-700 whitespace-normal break-words max-w-[320px]">
                                {entry.remarks || <span className="text-slate-300 italic">None</span>}
                              </td>

                              {/* Action Trigger for Edit Drawer */}
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditDrawer(item);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#3170c6] hover:bg-blue-50 transition-colors"
                                  title="Edit & Update Row"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPANY PEOPLE (SPLIT INTO TWO TABLES: 1. DIRECTORS & 2. TEAM MEMBERS) */}
          {activeTab === 'people' && (
            <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn">
              
              {/* TOP ACTION BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs backdrop-blur-xl">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Company Directory & People
                  </h3>
                  <p className="text-xs text-slate-500">
                    Directory of company directors and key team stakeholders receiving statutory reports
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleOpenAddDirector}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Add Director
                  </button>
                  <button
                    onClick={handleOpenAddTeamMember}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Team Member
                  </button>
                </div>
              </div>

              {/* TABLE 1: COMPANY DIRECTORS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Company Directors</h4>
                      <p className="text-[11px] text-slate-500">Statutory directors & legal signatories</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {directors.length} {directors.length === 1 ? 'Director' : 'Directors'}
                  </span>
                </div>

                <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4 min-w-[200px]">Director Name</th>
                          <th className="py-3 px-4 min-w-[170px]">Designation / Role</th>
                          <th className="py-3 px-4 min-w-[220px]">Email Address</th>
                          <th className="py-3 px-4 min-w-[140px]">Phone</th>
                          <th className="py-3 px-4 w-28 text-center">Primary POC</th>
                          <th className="py-3 px-4 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {directors.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              <p className="text-xs font-medium">No company directors added yet.</p>
                              <button
                                onClick={handleOpenAddDirector}
                                className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                              >
                                + Add Company Director
                              </button>
                            </td>
                          </tr>
                        ) : (
                          directors.map((person, idx) => (
                            <tr key={person.id} className="hover:bg-indigo-50/30 transition-colors">
                              <td className="py-3 px-4 text-center font-bold text-slate-400">
                                {idx + 1}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-xs shrink-0">
                                    {person.name?.[0]?.toUpperCase() || 'D'}
                                  </div>
                                  <span className="font-bold text-slate-900">{person.name}</span>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/70">
                                  {person.designation || 'Director'}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-slate-800 font-semibold">
                                {person.email}
                              </td>

                              <td className="py-3 px-4 text-slate-600">
                                {person.phone || '—'}
                              </td>

                              <td className="py-3 px-4 text-center">
                                {person.is_primary ? (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#3170c6] border border-blue-200">
                                    Primary POC
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditPerson(person)}
                                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                    title="Edit director details"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePerson(person.id)}
                                    className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Remove director"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* TABLE 2: TEAM MEMBERS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3170c6] flex items-center justify-center font-extrabold text-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Company Team Members</h4>
                      <p className="text-[11px] text-slate-500">Finance, tax, accounting & operational key contacts</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#3170c6] border border-blue-200">
                    {teamMembers.length} {teamMembers.length === 1 ? 'Team Member' : 'Team Members'}
                  </span>
                </div>

                <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden backdrop-blur-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4 w-12 text-center">#</th>
                          <th className="py-3 px-4 min-w-[200px]">Member Name</th>
                          <th className="py-3 px-4 min-w-[170px]">Designation / Role</th>
                          <th className="py-3 px-4 min-w-[220px]">Email Address</th>
                          <th className="py-3 px-4 min-w-[140px]">Phone</th>
                          <th className="py-3 px-4 w-28 text-center">Primary POC</th>
                          <th className="py-3 px-4 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {teamMembers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              <p className="text-xs font-medium">No operational team members added yet.</p>
                              <button
                                onClick={handleOpenAddTeamMember}
                                className="mt-2 text-xs font-bold text-[#3170c6] hover:text-[#2558a2] underline cursor-pointer"
                              >
                                + Add Team Member
                              </button>
                            </td>
                          </tr>
                        ) : (
                          teamMembers.map((person, idx) => (
                            <tr key={person.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-3 px-4 text-center font-bold text-slate-400">
                                {idx + 1}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#3170c6] flex items-center justify-center font-extrabold text-xs shrink-0">
                                    {person.name?.[0]?.toUpperCase() || 'M'}
                                  </div>
                                  <span className="font-bold text-slate-900">{person.name}</span>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-slate-600 font-medium">
                                {person.designation || 'Team Member'}
                              </td>

                              <td className="py-3 px-4 text-slate-800 font-semibold">
                                {person.email}
                              </td>

                              <td className="py-3 px-4 text-slate-600">
                                {person.phone || '—'}
                              </td>

                              <td className="py-3 px-4 text-center">
                                {person.is_primary ? (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#3170c6] border border-blue-200">
                                    Primary POC
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditPerson(person)}
                                    className="p-1 rounded-md text-slate-400 hover:text-[#3170c6] hover:bg-blue-50 transition-colors cursor-pointer"
                                    title="Edit member details"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePerson(person.id)}
                                    className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Remove member"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: COMPANY PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
              {/* Profile Card Header */}
              <div className="bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl p-6 shadow-[0_10px_35px_rgba(49,112,198,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3170c6] to-sky-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-[#3170c6]/20 shrink-0">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {company?.company_name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Entity
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {company?.industry || 'Corporate Client'} • Universe One Finance Compliance
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenEditProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 hover:shadow-lg hover:shadow-[#3170c6]/30 transition-all cursor-pointer shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Company Profile
                </button>
              </div>

              {/* Profile Attributes Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. PAN Number */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CreditCard className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Permanent Account No (PAN)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 block font-mono">
                    {company?.pan_number || <span className="text-slate-400 font-normal italic">Not specified</span>}
                  </span>
                </div>

                {/* 2. GST Number / GSTIN */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileCheck className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      GSTIN / GST Number
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 block font-mono">
                    {company?.gstin || company?.gst_number || <span className="text-slate-400 font-normal italic">Not specified</span>}
                  </span>
                </div>

                {/* 3. CIN Number */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Hash className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Corporate ID (CIN)
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 block font-mono">
                    {company?.cin_number || <span className="text-slate-400 font-normal italic">Not specified</span>}
                  </span>
                </div>

                {/* 4. Industry / Sector */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Industry / Sector
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {company?.industry || <span className="text-slate-400 font-normal italic">Not specified</span>}
                  </span>
                </div>

                {/* 5. Website URL */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90 sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Globe className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Official Website
                    </span>
                  </div>
                  {company?.website ? (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3170c6] hover:underline"
                    >
                      <span>{company.website}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Not specified</span>
                  )}
                </div>

                {/* 6. Registered Address */}
                <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90 sm:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-[#3170c6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Registered Office Address
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-relaxed">
                    {company?.address || <span className="text-slate-400 italic">No registered office address provided</span>}
                  </p>
                </div>

                {/* 7. Note / Remarks */}
                {company?.note && (
                  <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-1.5 transition-all hover:bg-white/90 sm:col-span-2 lg:col-span-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileText className="w-4 h-4 text-[#3170c6]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Operational Notes & Remarks
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {company.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: EMAIL HISTORY & LOGS */}
          {activeTab === 'email_logs' && (
            <div className="max-w-7xl mx-auto space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Email Dispatch History & Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Records of statutory compliance calendars emailed to company stakeholders
                  </p>
                </div>
                <button
                  onClick={() => setIsEmailDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Email Calendar to Client
                </button>
              </div>

              {/* Table / List */}
              <div className="bg-white/95 border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden backdrop-blur-xl">
                {emailLogs.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#3170c6] flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No email records found yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click "Email Calendar to Client" to dispatch the statutory compliance summary for {activePeriodFull}.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                          <th className="py-3.5 px-4 w-12 text-center">#</th>
                          <th className="py-3.5 px-4 min-w-[220px]">Recipient</th>
                          <th className="py-3.5 px-4 min-w-[260px]">Subject & Scope</th>
                          <th className="py-3.5 px-4 min-w-[160px]">Sent Date & Time</th>
                          <th className="py-3.5 px-4 w-32 text-center">Status</th>
                          <th className="py-3.5 px-4 min-w-[160px]">Dispatched By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {emailLogs.map((log, index) => {
                          const formattedDate = log.sent_at
                            ? new Date(log.sent_at).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—';
                          const isSent = log.status === 'sent';

                          return (
                            <tr key={log.id || index} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                                {index + 1}
                              </td>

                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {log.recipient_name || log.recipient_email}
                                  </span>
                                  <span className="text-slate-500 text-[11px] block">
                                    {log.recipient_email}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-semibold text-slate-800 block">
                                    {log.subject}
                                  </span>
                                  <span className="text-slate-400 text-[11px] block mt-0.5">
                                    {log.items_count || 0} Mandates • {log.completed_count || 0} Completed
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                                {formattedDate}
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                    isSent
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}
                                >
                                  {isSent ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                  {log.status || 'Sent'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-slate-600 font-medium">
                                {log.sent_by || 'Universe One Finance Team'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          3. SLIDE-OVER RIGHT PANELS (LIQUID GLASSMORPHIC FORM DRAWERS)
         ========================================================================= */}

      {/* DRAWER 1: EDIT / UPDATE COMPLIANCE ITEM (ROW CLICK PANEL) */}
      {isEditItemDrawerOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsEditItemDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Vibrant ambient liquid glass background glow orbs */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/30 via-sky-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 via-teal-300/20 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-8 w-72 h-72 bg-gradient-to-tl from-[#3170c6]/25 via-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Edit Compliance Item</h3>
                    <p className="text-xs text-slate-500 font-medium">Update status, payment date, and statutory dates</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditItemDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                {/* Warning Alert if validation fails */}
                {editFormWarning && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-amber-900 flex items-center gap-2.5 backdrop-blur-xl animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-semibold leading-tight">{editFormWarning}</span>
                  </div>
                )}

                <form id="edit-item-form" onSubmit={handleSaveEditItem} className="space-y-4 text-xs">
                  
                  {/* Status Dropdown */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Compliance Status *</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setEditForm({ ...editForm, status: newSt });
                        if (newSt === 'Completed' && !editForm.actual_payment_date?.trim()) {
                          setEditFormWarning('Please enter the Actual Payment Date to mark as Completed.');
                        } else {
                          setEditFormWarning('');
                        }
                      }}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                    >
                      <option value="Completed">🟢 Completed</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Pending">⚪ Pending</option>
                      <option value="Overdue">🔴 Overdue</option>
                    </select>
                  </div>

                  {/* Actual Payment Date */}
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur-2xl transition-all space-y-1.5 ${
                      editForm.status === 'Completed' && !editForm.actual_payment_date?.trim()
                        ? 'border-amber-400/80 bg-amber-50/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'border-white/60 bg-white/50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>Actual Payment / Execution Date</span>
                        {editForm.status === 'Completed' && (
                          <span className="text-amber-700 font-bold text-[10px]">* Required for Completed</span>
                        )}
                      </label>
                    </div>
                    <input
                      type="date"
                      value={editForm.actual_payment_date || ''}
                      onChange={(e) => {
                        setEditForm({ ...editForm, actual_payment_date: e.target.value });
                        if (e.target.value?.trim()) {
                          setEditFormWarning('');
                        }
                      }}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                    {editForm.status === 'Completed' && !editForm.actual_payment_date?.trim() && (
                      <p className="text-[11px] text-amber-700 font-semibold">
                        ⚠️ Must be provided before marking this compliance as Completed.
                      </p>
                    )}
                  </div>

                  {/* Compliance Nature */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Compliance Nature / Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.compliance_nature}
                      onChange={(e) => setEditForm({ ...editForm, compliance_nature: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Category Selector */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">Compliance Category *</label>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, use_custom_category: !editForm.use_custom_category })}
                        className="text-[11px] font-semibold text-[#3170c6] hover:underline cursor-pointer"
                      >
                        {editForm.use_custom_category ? '⚡ Preset Options' : '✍️ Custom Category'}
                      </button>
                    </div>
                    {editForm.use_custom_category ? (
                      <input
                        type="text"
                        required
                        placeholder="e.g. GST, TAX, BRS, Form 16, PF, Salary, ESI..."
                        value={editForm.custom_category || editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, custom_category: e.target.value, category: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    ) : (
                      <select
                        value={editForm.category || 'GST'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Other') {
                            setEditForm({ ...editForm, category: val, use_custom_category: true, custom_category: '' });
                          } else {
                            setEditForm({ ...editForm, category: val });
                          }
                        }}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Frequency */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Frequency</label>
                    <select
                      value={editForm.frequency}
                      onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                      <option value="One time">One time</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Custom">Custom / Other</option>
                    </select>
                  </div>

                  {/* SECTION 1: STATUTORY DUE DATE */}
                  <div className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/40 backdrop-blur-2xl shadow-[0_8px_25px_rgba(49,112,198,0.04)] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>Statutory Due Date</span>
                        <span className="text-[10px] text-slate-500 font-normal">({editForm.frequency})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            use_custom_statutory: !editForm.use_custom_statutory,
                          })
                        }
                        className="text-[11px] font-semibold text-[#3170c6] hover:underline cursor-pointer"
                      >
                        {editForm.use_custom_statutory ? '⚡ Switch to Dropdowns' : '✍️ Custom Text'}
                      </button>
                    </div>

                    {editForm.use_custom_statutory ? (
                      <div>
                        <input
                          type="text"
                          value={editForm.custom_statutory_text}
                          onChange={(e) => setEditForm({ ...editForm, custom_statutory_text: e.target.value })}
                          placeholder="e.g. 7th of following month / 30th Sep"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Monthly */}
                        {editForm.frequency === 'Monthly' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={editForm.monthly_statutory_day}
                                onChange={(e) => setEditForm({ ...editForm, monthly_statutory_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Month Cycle</label>
                              <select
                                value={editForm.monthly_statutory_timing}
                                onChange={(e) => setEditForm({ ...editForm, monthly_statutory_timing: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="of following month">of following month</option>
                                <option value="of same month">of same month</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Annual */}
                        {editForm.frequency === 'Annual' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Month (Jan-Dec)</label>
                              <select
                                value={editForm.annual_statutory_month}
                                onChange={(e) => setEditForm({ ...editForm, annual_statutory_month: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {MONTH_NAMES.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={editForm.annual_statutory_day}
                                onChange={(e) => setEditForm({ ...editForm, annual_statutory_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Quarterly */}
                        {editForm.frequency === 'Quarterly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Quarterly Due Schedule</label>
                              <select
                                value={editForm.quarterly_statutory_preset}
                                onChange={(e) => setEditForm({ ...editForm, quarterly_statutory_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {QUARTERLY_PRESETS.map((q) => (
                                  <option key={q} value={q}>{q}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Half-Yearly */}
                        {editForm.frequency === 'Half-Yearly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Half-Yearly Schedule</label>
                              <select
                                value={editForm.halfyearly_statutory_preset}
                                onChange={(e) => setEditForm({ ...editForm, halfyearly_statutory_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {HALFYEARLY_PRESETS.map((h) => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* One time */}
                        {editForm.frequency === 'One time' && (
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">Choose Calendar Date</label>
                            <input
                              type="date"
                              value={editForm.onetime_statutory_date}
                              onChange={(e) => setEditForm({ ...editForm, onetime_statutory_date: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Custom */}
                        {editForm.frequency === 'Custom' && (
                          <div>
                            <input
                              type="text"
                              value={editForm.custom_statutory_text}
                              onChange={(e) => setEditForm({ ...editForm, custom_statutory_text: e.target.value })}
                              placeholder="e.g. Within 30 days of AGM"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="pt-1.5 text-[11px] text-[#3170c6] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3170c6]" />
                      <span><strong>Statutory Due:</strong> {getResolvedDatesForForm(editForm).statutory || '—'}</span>
                    </div>
                  </div>

                  {/* SECTION 2: INTERNAL CONTROL DATE */}
                  <div className="p-4 rounded-2xl border border-teal-200/80 bg-teal-50/30 backdrop-blur-2xl shadow-[0_8px_25px_rgba(20,184,166,0.04)] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-teal-200/60">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Internal Control Date (Review / Preparation)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            use_custom_internal: !editForm.use_custom_internal,
                          })
                        }
                        className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        {editForm.use_custom_internal ? '⚡ Switch to Dropdowns' : '✍️ Custom Text'}
                      </button>
                    </div>

                    {editForm.use_custom_internal ? (
                      <div>
                        <input
                          type="text"
                          value={editForm.custom_internal_text}
                          onChange={(e) => setEditForm({ ...editForm, custom_internal_text: e.target.value })}
                          placeholder="e.g. 1st of following month / 20th Sep"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Monthly */}
                        {editForm.frequency === 'Monthly' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={editForm.monthly_internal_day}
                                onChange={(e) => setEditForm({ ...editForm, monthly_internal_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Month Cycle</label>
                              <select
                                value={editForm.monthly_internal_timing}
                                onChange={(e) => setEditForm({ ...editForm, monthly_internal_timing: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="of following month">of following month</option>
                                <option value="of same month">of same month</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Annual */}
                        {editForm.frequency === 'Annual' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Month (Jan-Dec)</label>
                              <select
                                value={editForm.annual_internal_month}
                                onChange={(e) => setEditForm({ ...editForm, annual_internal_month: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {MONTH_NAMES.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={editForm.annual_internal_day}
                                onChange={(e) => setEditForm({ ...editForm, annual_internal_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Quarterly */}
                        {editForm.frequency === 'Quarterly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Quarterly Internal Schedule</label>
                              <select
                                value={editForm.quarterly_internal_preset}
                                onChange={(e) => setEditForm({ ...editForm, quarterly_internal_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="25th of month following quarter">25th of month following quarter</option>
                                <option value="15th of month following quarter">15th of month following quarter</option>
                                <option value="20th of month following quarter">20th of month following quarter</option>
                                <option value="10th of month following quarter">10th of month following quarter</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Half-Yearly */}
                        {editForm.frequency === 'Half-Yearly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Half-Yearly Internal Schedule</label>
                              <select
                                value={editForm.halfyearly_internal_preset}
                                onChange={(e) => setEditForm({ ...editForm, halfyearly_internal_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="20th September & 20th March">20th September & 20th March</option>
                                <option value="10th October & 10th April">10th October & 10th April</option>
                                <option value="20th June & 20th December">20th June & 20th December</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* One time */}
                        {editForm.frequency === 'One time' && (
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">Internal Target Date</label>
                            <input
                              type="date"
                              value={editForm.onetime_internal_date}
                              onChange={(e) => setEditForm({ ...editForm, onetime_internal_date: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Custom */}
                        {editForm.frequency === 'Custom' && (
                          <div>
                            <input
                              type="text"
                              value={editForm.custom_internal_text}
                              onChange={(e) => setEditForm({ ...editForm, custom_internal_text: e.target.value })}
                              placeholder="e.g. Within 15 days of AGM"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="pt-1.5 text-[11px] text-teal-700 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span><strong>Internal Control:</strong> {getResolvedDatesForForm(editForm).internal || '—'}</span>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Remarks / Notes</label>
                    <textarea
                      rows={2}
                      value={editForm.remarks || ''}
                      onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                      placeholder="e.g. Challan generated and verified on portal"
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Footer with Delete & Save */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-between shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(editingItem.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200/60 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Row</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditItemDrawerOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-item-form"
                    className="px-5 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 2: ADD COMPLIANCE ITEM */}
      {isAddItemDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsAddItemDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Ambient Glows */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/30 via-sky-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 via-teal-300/20 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add Compliance Item</h3>
                    <p className="text-xs text-slate-500 font-medium">Create a new statutory / internal control row</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddItemDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                <form id="add-item-form" onSubmit={handleAddItemSubmit} className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Compliance Nature / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TDS - Salary Payments, GST Return 3B..."
                      value={itemForm.compliance_nature}
                      onChange={(e) => setItemForm({ ...itemForm, compliance_nature: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Category Selector */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">Compliance Category *</label>
                      <button
                        type="button"
                        onClick={() => setItemForm({ ...itemForm, use_custom_category: !itemForm.use_custom_category })}
                        className="text-[11px] font-semibold text-[#3170c6] hover:underline cursor-pointer"
                      >
                        {itemForm.use_custom_category ? '⚡ Preset Options' : '✍️ Custom Category'}
                      </button>
                    </div>
                    {itemForm.use_custom_category ? (
                      <input
                        type="text"
                        required
                        placeholder="e.g. GST, TAX, BRS, Form 16, PF, Salary, ESI..."
                        value={itemForm.custom_category || itemForm.category}
                        onChange={(e) => setItemForm({ ...itemForm, custom_category: e.target.value, category: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    ) : (
                      <select
                        value={itemForm.category || 'GST'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Other') {
                            setItemForm({ ...itemForm, category: val, use_custom_category: true, custom_category: '' });
                          } else {
                            setItemForm({ ...itemForm, category: val });
                          }
                        }}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Frequency</label>
                    <select
                      value={itemForm.frequency}
                      onChange={(e) => setItemForm({ ...itemForm, frequency: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annual">Annual</option>
                      <option value="One time">One time</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Custom">Custom / Other</option>
                    </select>
                  </div>

                  {/* SECTION 1: STATUTORY DUE DATE */}
                  <div className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/40 backdrop-blur-2xl shadow-[0_8px_25px_rgba(49,112,198,0.04)] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>Statutory Due Date</span>
                        <span className="text-[10px] text-slate-500 font-normal">({itemForm.frequency})</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setItemForm({
                            ...itemForm,
                            use_custom_statutory: !itemForm.use_custom_statutory,
                          })
                        }
                        className="text-[11px] font-semibold text-[#3170c6] hover:underline cursor-pointer"
                      >
                        {itemForm.use_custom_statutory ? '⚡ Switch to Dropdowns' : '✍️ Custom Text'}
                      </button>
                    </div>

                    {itemForm.use_custom_statutory ? (
                      <div>
                        <input
                          type="text"
                          value={itemForm.custom_statutory_text}
                          onChange={(e) => setItemForm({ ...itemForm, custom_statutory_text: e.target.value })}
                          placeholder="e.g. 7th of following month / 30th Sep"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Monthly */}
                        {itemForm.frequency === 'Monthly' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={itemForm.monthly_statutory_day}
                                onChange={(e) => setItemForm({ ...itemForm, monthly_statutory_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Month Cycle</label>
                              <select
                                value={itemForm.monthly_statutory_timing}
                                onChange={(e) => setItemForm({ ...itemForm, monthly_statutory_timing: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="of following month">of following month</option>
                                <option value="of same month">of same month</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Annual */}
                        {itemForm.frequency === 'Annual' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Month (Jan-Dec)</label>
                              <select
                                value={itemForm.annual_statutory_month}
                                onChange={(e) => setItemForm({ ...itemForm, annual_statutory_month: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {MONTH_NAMES.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={itemForm.annual_statutory_day}
                                onChange={(e) => setItemForm({ ...itemForm, annual_statutory_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Quarterly */}
                        {itemForm.frequency === 'Quarterly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Quarterly Due Schedule</label>
                              <select
                                value={itemForm.quarterly_statutory_preset}
                                onChange={(e) => setItemForm({ ...itemForm, quarterly_statutory_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {QUARTERLY_PRESETS.map((q) => (
                                  <option key={q} value={q}>{q}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Half-Yearly */}
                        {itemForm.frequency === 'Half-Yearly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Half-Yearly Schedule</label>
                              <select
                                value={itemForm.halfyearly_statutory_preset}
                                onChange={(e) => setItemForm({ ...itemForm, halfyearly_statutory_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {HALFYEARLY_PRESETS.map((h) => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* One time */}
                        {itemForm.frequency === 'One time' && (
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">Choose Calendar Date</label>
                            <input
                              type="date"
                              value={itemForm.onetime_statutory_date}
                              onChange={(e) => setItemForm({ ...itemForm, onetime_statutory_date: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Custom */}
                        {itemForm.frequency === 'Custom' && (
                          <div>
                            <input
                              type="text"
                              value={itemForm.custom_statutory_text}
                              onChange={(e) => setItemForm({ ...itemForm, custom_statutory_text: e.target.value })}
                              placeholder="e.g. Within 30 days of AGM"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="pt-1.5 text-[11px] text-[#3170c6] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3170c6]" />
                      <span><strong>Statutory Due:</strong> {getResolvedDatesForForm(itemForm).statutory || '—'}</span>
                    </div>
                  </div>

                  {/* SECTION 2: INTERNAL CONTROL DATE */}
                  <div className="p-4 rounded-2xl border border-teal-200/80 bg-teal-50/30 backdrop-blur-2xl shadow-[0_8px_25px_rgba(20,184,166,0.04)] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-teal-200/60">
                      <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Internal Control Date (Review / Preparation)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setItemForm({
                            ...itemForm,
                            use_custom_internal: !itemForm.use_custom_internal,
                          })
                        }
                        className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        {itemForm.use_custom_internal ? '⚡ Switch to Dropdowns' : '✍️ Custom Text'}
                      </button>
                    </div>

                    {itemForm.use_custom_internal ? (
                      <div>
                        <input
                          type="text"
                          value={itemForm.custom_internal_text}
                          onChange={(e) => setItemForm({ ...itemForm, custom_internal_text: e.target.value })}
                          placeholder="e.g. 1st of following month / 20th Sep"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Monthly */}
                        {itemForm.frequency === 'Monthly' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={itemForm.monthly_internal_day}
                                onChange={(e) => setItemForm({ ...itemForm, monthly_internal_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Month Cycle</label>
                              <select
                                value={itemForm.monthly_internal_timing}
                                onChange={(e) => setItemForm({ ...itemForm, monthly_internal_timing: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="of following month">of following month</option>
                                <option value="of same month">of same month</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Annual */}
                        {itemForm.frequency === 'Annual' && (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Month (Jan-Dec)</label>
                              <select
                                value={itemForm.annual_internal_month}
                                onChange={(e) => setItemForm({ ...itemForm, annual_internal_month: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                {MONTH_NAMES.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Day (1 to 31)</label>
                              <select
                                value={itemForm.annual_internal_day}
                                onChange={(e) => setItemForm({ ...itemForm, annual_internal_day: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                              >
                                {DAYS_OPTIONS.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Quarterly */}
                        {itemForm.frequency === 'Quarterly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Quarterly Internal Schedule</label>
                              <select
                                value={itemForm.quarterly_internal_preset}
                                onChange={(e) => setItemForm({ ...itemForm, quarterly_internal_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="25th of month following quarter">25th of month following quarter</option>
                                <option value="15th of month following quarter">15th of month following quarter</option>
                                <option value="20th of month following quarter">20th of month following quarter</option>
                                <option value="10th of month following quarter">10th of month following quarter</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Half-Yearly */}
                        {itemForm.frequency === 'Half-Yearly' && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[11px] font-bold text-slate-700 block mb-1">Half-Yearly Internal Schedule</label>
                              <select
                                value={itemForm.halfyearly_internal_preset}
                                onChange={(e) => setItemForm({ ...itemForm, halfyearly_internal_preset: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="20th September & 20th March">20th September & 20th March</option>
                                <option value="10th October & 10th April">10th October & 10th April</option>
                                <option value="20th June & 20th December">20th June & 20th December</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* One time */}
                        {itemForm.frequency === 'One time' && (
                          <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">Internal Target Date</label>
                            <input
                              type="date"
                              value={itemForm.onetime_internal_date}
                              onChange={(e) => setItemForm({ ...itemForm, onetime_internal_date: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                            />
                          </div>
                        )}

                        {/* Custom */}
                        {itemForm.frequency === 'Custom' && (
                          <div>
                            <input
                              type="text"
                              value={itemForm.custom_internal_text}
                              onChange={(e) => setItemForm({ ...itemForm, custom_internal_text: e.target.value })}
                              placeholder="e.g. Within 15 days of AGM"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="pt-1.5 text-[11px] text-teal-700 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                      <span><strong>Internal Control:</strong> {getResolvedDatesForForm(itemForm).internal || '—'}</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setIsAddItemDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-item-form"
                  className="px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 3: ADD COMPANY MEMBER / CONTACT */}
      {isAddPersonDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsAddPersonDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Add Member / Contact</h3>
                    <p className="text-xs text-slate-500 font-medium">Add stakeholder to receive compliance reports</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddPersonDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                <form id="add-person-form" onSubmit={handleAddPerson} className="space-y-4 text-xs">
                  
                  {/* Directory Type Toggle: Company Director vs Team Member */}
                  <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPersonForm({
                          ...personForm,
                          person_type: 'Director',
                          company_directory: 'Company Director',
                          designation: 'Director',
                        });
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        personForm.person_type === 'Director'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Company Director</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPersonForm({
                          ...personForm,
                          person_type: 'Team',
                          company_directory: 'Team Member',
                          designation: personForm.designation === 'Director' ? 'Finance Controller' : personForm.designation,
                        });
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        personForm.person_type === 'Team'
                          ? 'bg-[#3170c6] text-white shadow-md shadow-[#3170c6]/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Team Member</span>
                    </button>
                  </div>

                  {/* Name Input */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">
                      {personForm.person_type === 'Director' ? 'Company Director Name *' : 'Team Member Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={personForm.person_type === 'Director' ? 'e.g. Rajesh Kumar (Director)' : 'e.g. Dave Smith (Finance Lead)'}
                      value={personForm.name}
                      onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Designation / Role */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">
                      {personForm.person_type === 'Director' ? 'Director Designation *' : 'Designation / Role *'}
                    </label>
                    {personForm.person_type === 'Director' ? (
                      <select
                        value={personForm.designation}
                        onChange={(e) => setPersonForm({ ...personForm, designation: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all cursor-pointer"
                      >
                        <option value="Director">Director</option>
                        <option value="Managing Director">Managing Director (MD)</option>
                        <option value="Whole-Time Director">Whole-Time Director (WTD)</option>
                        <option value="Executive Director">Executive Director</option>
                        <option value="Independent Director">Independent Director</option>
                        <option value="Additional Director">Additional Director</option>
                        <option value="Nominee Director">Nominee Director</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Finance Controller, Tax Manager, Chief Accountant..."
                        value={personForm.designation}
                        onChange={(e) => setPersonForm({ ...personForm, designation: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder={personForm.person_type === 'Director' ? 'director@company.com' : 'finance@company.com'}
                      value={personForm.email}
                      onChange={(e) => setPersonForm({ ...personForm, email: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={personForm.phone}
                      onChange={(e) => setPersonForm({ ...personForm, phone: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Primary POC */}
                  <div className="p-3.5 rounded-2xl border border-blue-200/60 bg-blue-50/50 backdrop-blur-xl flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="chk-primary-person-drawer"
                      checked={personForm.is_primary}
                      onChange={(e) => setPersonForm({ ...personForm, is_primary: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#3170c6] focus:ring-[#3170c6]"
                    />
                    <label
                      htmlFor="chk-primary-person-drawer"
                      className="text-xs text-slate-700 font-semibold cursor-pointer"
                    >
                      Mark as Primary Point of Contact (Default for email dispatches)
                    </label>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setIsAddPersonDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-person-form"
                  className="px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer"
                >
                  {personForm.person_type === 'Director' ? 'Save Company Director' : 'Save Team Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 3B: EDIT COMPANY MEMBER / CONTACT */}
      {isEditPersonDrawerOpen && editingPerson && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsEditPersonDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-lg flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Vibrant ambient liquid glass background glow orbs */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/30 via-sky-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 via-teal-300/20 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Edit {editPersonForm.person_type === 'Director' ? 'Company Director' : 'Team Member'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Update stakeholder contact info in database</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditPersonDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                <form id="edit-person-form" onSubmit={handleSaveEditPerson} className="space-y-4 text-xs">
                  
                  {/* Directory Type Toggle */}
                  <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditPersonForm({
                          ...editPersonForm,
                          person_type: 'Director',
                          company_directory: 'Company Director',
                          designation: editPersonForm.designation && !editPersonForm.designation.toLowerCase().includes('member') ? editPersonForm.designation : 'Director',
                        });
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editPersonForm.person_type === 'Director'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Company Director</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditPersonForm({
                          ...editPersonForm,
                          person_type: 'Team',
                          company_directory: 'Team Member',
                          designation: editPersonForm.designation === 'Director' ? 'Finance Controller' : editPersonForm.designation,
                        });
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        editPersonForm.person_type === 'Team'
                          ? 'bg-[#3170c6] text-white shadow-md shadow-[#3170c6]/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Team Member</span>
                    </button>
                  </div>

                  {/* Name Input */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">
                      {editPersonForm.person_type === 'Director' ? 'Company Director Name *' : 'Team Member Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={editPersonForm.person_type === 'Director' ? 'e.g. Rajesh Kumar (Director)' : 'e.g. Dave Smith (Finance Lead)'}
                      value={editPersonForm.name}
                      onChange={(e) => setEditPersonForm({ ...editPersonForm, name: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Designation / Role */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">
                      {editPersonForm.person_type === 'Director' ? 'Director Designation *' : 'Designation / Role *'}
                    </label>
                    {editPersonForm.person_type === 'Director' ? (
                      <select
                        value={editPersonForm.designation}
                        onChange={(e) => setEditPersonForm({ ...editPersonForm, designation: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-indigo-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all cursor-pointer"
                      >
                        <option value="Director">Director</option>
                        <option value="Managing Director">Managing Director (MD)</option>
                        <option value="Whole-Time Director">Whole-Time Director (WTD)</option>
                        <option value="Executive Director">Executive Director</option>
                        <option value="Independent Director">Independent Director</option>
                        <option value="Additional Director">Additional Director</option>
                        <option value="Nominee Director">Nominee Director</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Finance Controller, Tax Manager, Chief Accountant..."
                        value={editPersonForm.designation}
                        onChange={(e) => setEditPersonForm({ ...editPersonForm, designation: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder={editPersonForm.person_type === 'Director' ? 'director@company.com' : 'finance@company.com'}
                      value={editPersonForm.email}
                      onChange={(e) => setEditPersonForm({ ...editPersonForm, email: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={editPersonForm.phone}
                      onChange={(e) => setEditPersonForm({ ...editPersonForm, phone: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Primary POC */}
                  <div className="p-3.5 rounded-2xl border border-blue-200/60 bg-blue-50/50 backdrop-blur-xl flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="chk-edit-primary-person-drawer"
                      checked={editPersonForm.is_primary}
                      onChange={(e) => setEditPersonForm({ ...editPersonForm, is_primary: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#3170c6] focus:ring-[#3170c6]"
                    />
                    <label
                      htmlFor="chk-edit-primary-person-drawer"
                      className="text-xs text-slate-700 font-semibold cursor-pointer"
                    >
                      Mark as Primary Point of Contact (Default for email dispatches)
                    </label>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setIsEditPersonDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-person-form"
                  disabled={savingPerson}
                  className="px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingPerson ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 4: EMAIL CALENDAR TO CLIENT (WITH MULTI-RECIPIENTS, CC, FY MATRIX SELECTION & HEAT MAP) */}
      {isEmailDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsEmailDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-xl flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/20 via-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Email Calendar & Heat Map to Client</h3>
                    <p className="text-xs text-slate-500 font-medium">Send monthly statutory report & 12-month FY heat map matrix</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEmailDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                {emailSuccessMessage ? (
                  <div className="p-6 rounded-3xl border border-emerald-300 bg-emerald-50/90 text-emerald-900 text-center space-y-3 backdrop-blur-xl">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-base">Report Dispatched Successfully</h4>
                    <p className="text-xs text-emerald-700">{emailSuccessMessage}</p>
                    <p className="text-[11px] text-slate-400">Closing panel automatically...</p>
                  </div>
                ) : (
                  <form id="email-calendar-form" onSubmit={handleSendEmail} className="space-y-4 text-xs">
                    
                    {/* Primary & Multiple TO Recipients */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">To: Recipients *</label>
                        <span className="text-[10px] text-slate-400 font-medium">Select multiple or add email</span>
                      </div>
                      
                      {persons.length === 0 ? (
                        <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                          No team members registered yet in "Company People". You can type recipient email below.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {persons.map((p) => {
                            const isSelected = selectedRecipientEmails.includes(p.email);
                            return (
                              <label
                                key={p.id}
                                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50/80 border-[#3170c6]/50 text-slate-900 font-bold'
                                    : 'bg-white/60 border-slate-200/80 text-slate-700 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedRecipientEmails((prev) => Array.from(new Set([...prev, p.email])));
                                        setSelectedRecipientEmail(p.email);
                                      } else {
                                        const updated = selectedRecipientEmails.filter((em) => em !== p.email);
                                        setSelectedRecipientEmails(updated);
                                        setSelectedRecipientEmail(updated[0] || '');
                                      }
                                    }}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#3170c6] focus:ring-[#3170c6]"
                                  />
                                  <div className="truncate text-xs">
                                    <span>{p.name}</span>
                                    <span className="text-slate-400 font-normal ml-1">({p.email})</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  {p.company_directory && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                      {p.company_directory}
                                    </span>
                                  )}
                                  {p.is_primary && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#3170c6] text-white font-bold">
                                      Primary
                                    </span>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Custom Additional TO Email */}
                      <div>
                        <input
                          type="text"
                          placeholder="Or type additional recipient email(s) (comma separated)..."
                          value={customToEmail}
                          onChange={(e) => setCustomToEmail(e.target.value)}
                          className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* CC Recipients */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">CC: Copy Recipients (Optional)</label>
                        <span className="text-[10px] text-slate-400 font-medium">Carbon copy stakeholders</span>
                      </div>

                      {persons.length > 0 && (
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                          {persons.map((p) => {
                            const isCc = selectedCcEmails.includes(p.email);
                            return (
                              <label
                                key={`cc-${p.id}`}
                                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                                  isCc
                                    ? 'bg-purple-50/80 border-purple-300 text-slate-900 font-bold'
                                    : 'bg-white/60 border-slate-200/80 text-slate-700 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isCc}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCcEmails((prev) => Array.from(new Set([...prev, p.email])));
                                      } else {
                                        setSelectedCcEmails((prev) => prev.filter((em) => em !== p.email));
                                      }
                                    }}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                                  />
                                  <div className="truncate text-xs">
                                    <span>{p.name}</span>
                                    <span className="text-slate-400 font-normal ml-1">({p.email})</span>
                                  </div>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0 ml-2">
                                  {p.company_directory || p.designation || 'Member'}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Custom Additional CC Email */}
                      <div>
                        <input
                          type="text"
                          placeholder="Type custom CC email(s) (e.g. audit@company.com, cfo@firm.com)..."
                          value={customCcEmail}
                          onChange={(e) => setCustomCcEmail(e.target.value)}
                          className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Financial Year Selection & Heat Map Inclusion */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800">Financial Year Heat Map Matrix</label>
                        <span className="text-[10px] text-slate-400 font-mono">12-Month Matrix</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Target Financial Year
                          </label>
                          <select
                            value={emailFyYear}
                            onChange={(e) => setEmailFyYear(Number(e.target.value))}
                            className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all cursor-pointer"
                          >
                            {availableFyYears.map((yr) => (
                              <option key={yr} value={yr}>
                                FY {yr}–{String(yr + 1).slice(-2)} (Apr'{String(yr).slice(-2)} – Mar'{String(yr + 1).slice(-2)})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={includeHeatmapInEmail}
                              onChange={(e) => setIncludeHeatmapInEmail(e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-[#3170c6] focus:ring-[#3170c6]"
                            />
                            <span className="text-xs font-bold text-slate-800">
                              Include 12-Month Heat Map Table
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">Email Subject Line *</label>
                      <input
                        type="text"
                        required
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="e.g. Statutory Compliance Calendar - Company Name (Sep'26)"
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>

                    {/* HTML Table Report Info */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#3170c6]" />
                        <span>HTML Report Payload Summary</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Company Entity:</span>
                        <strong className="text-slate-900">{company?.company_name}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Active Period:</span>
                        <strong className="text-slate-900">{activePeriodFull}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Heat Map Financial Year:</span>
                        <strong className="text-slate-900">FY {emailFyYear}–{String(emailFyYear + 1).slice(-2)} (12 Months)</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Compliances Included:</span>
                        <strong className="text-slate-900">
                          {items.length} items ({stats.completed} Completed, {stats.inProgress} In Progress, {stats.pending} Pending)
                        </strong>
                      </div>
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                        The email will include both the active monthly statutory breakdown and the complete 12-month FY heat map matrix.
                      </p>
                    </div>

                    {/* Pre-Inception Warning in Email Modal */}
                    {isBeforeInception && (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-800">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Pre-Onboarding Period Selected</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          You are viewing <strong>{activePeriodFull}</strong>, which is before the company's onboarding date (<strong>{companyInception?.fullLabel}</strong>). Switch to an active tracking period to dispatch reports.
                        </p>
                      </div>
                    )}

                    {/* Custom Note */}
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">Custom Note / Remarks (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Please review the statutory compliance status for September 2026. All TDS & GST returns have been verified..."
                        value={emailCustomMessage}
                        onChange={(e) => setEmailCustomMessage(e.target.value)}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {!emailSuccessMessage && (
                <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                  <button
                    type="button"
                    disabled={emailSending}
                    onClick={() => setIsEmailDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="email-calendar-form"
                    disabled={emailSending || isBeforeInception}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emailSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Report & Heat Map</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* DRAWER 5: EDIT COMPANY PROFILE */}
      {isEditProfileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsEditProfileDrawerOpen(false)} />

          <div className="fixed inset-y-0 right-0 w-full max-w-full sm:max-w-xl flex pointer-events-auto">
            <div className="relative w-full h-full bg-white/80 backdrop-blur-3xl border-l border-white/60 shadow-[-30px_0_70px_rgba(49,112,198,0.2)] flex flex-col justify-between animate-in slide-in-from-right duration-300 overflow-hidden">
              
              {/* Vibrant ambient liquid glass background glow orbs */}
              <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-[#3170c6]/30 via-sky-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 via-teal-300/20 to-sky-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 right-8 w-72 h-72 bg-gradient-to-tl from-[#3170c6]/25 via-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-[#3170c6]/15 text-[#3170c6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-md shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Edit Company Profile</h3>
                    <p className="text-xs text-slate-500 font-medium">Update entity registration details and compliance profile</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditProfileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-md border border-white/40 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
                <form id="edit-profile-form" onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  
                  {/* Company Name */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Company / Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp Private Limited"
                      value={profileForm.company_name}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Industry / Sector */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Industry / Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Services & Software Consulting"
                      value={profileForm.industry}
                      onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* PAN & GSTIN 2-column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">PAN Number</label>
                      <input
                        type="text"
                        placeholder="e.g. AAACS1234F"
                        value={profileForm.pan_number}
                        onChange={(e) => setProfileForm({ ...profileForm, pan_number: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">GSTIN / GST Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 07AAACS1234F1Z5"
                        value={profileForm.gstin}
                        onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* CIN Number & Website 2-column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">CIN Number</label>
                      <input
                        type="text"
                        placeholder="e.g. U72200DL2020PTC123456"
                        value={profileForm.cin_number}
                        onChange={(e) => setProfileForm({ ...profileForm, cin_number: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>

                    <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                      <label className="font-bold text-slate-800">Official Website</label>
                      <input
                        type="text"
                        placeholder="e.g. https://company.com"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Registered Address */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Registered Office Address</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Plot No 12, Cyber City, Phase 2, Gurugram, Haryana - 122002"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>

                  {/* Note / Remarks */}
                  <div className="p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.8),0_10px_30px_rgba(0,0,0,0.02)] space-y-1.5">
                    <label className="font-bold text-slate-800">Notes & Internal Remarks</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Priority client. Requires monthly advance compliance reviews before the 5th..."
                      value={profileForm.note}
                      onChange={(e) => setProfileForm({ ...profileForm, note: e.target.value })}
                      className="w-full bg-white/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#3170c6] rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3170c6]/20 transition-all"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="relative z-10 px-6 py-4 border-t border-white/40 bg-white/30 backdrop-blur-2xl flex items-center justify-end gap-3 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setIsEditProfileDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-profile-form"
                  className="px-6 py-2.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white text-xs font-bold shadow-md shadow-[#3170c6]/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM-RIGHT TOAST NOTIFICATION POPUP */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-auto">
          <div
            className={`p-4 rounded-2xl backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-start gap-3 transition-all ${
              toastNotification.type === 'warning'
                ? 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-500/20'
                : toastNotification.type === 'error'
                ? 'bg-red-50/95 border-red-300 text-red-950 shadow-red-500/20'
                : 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-500/20'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                toastNotification.type === 'warning'
                  ? 'bg-amber-200/80 text-amber-800'
                  : toastNotification.type === 'error'
                  ? 'bg-red-200/80 text-red-800'
                  : 'bg-emerald-200/80 text-emerald-800'
              }`}
            >
              {toastNotification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {toastNotification.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toastNotification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold leading-tight">{toastNotification.title}</h4>
              <p className="text-[11px] mt-0.5 opacity-90 leading-snug font-medium">{toastNotification.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToastNotification(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      </div>
    </ModuleAccessGate>
  );
}
