'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useHrmFeedback } from '../../ui/HrmFeedback';
import HrmEmptyState from '../../ui/HrmEmptyState';
import { LoadingPanel } from '../../ui/Skeleton';

type InboxTab = 'pending' | 'history';

interface AdminRegularizationItem {
  id: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestType: string;
  timeRange: string;
  reason: string;
  appliedOn: string;
  currentStatusLabel?: string;
  sentToHr?: string;
  reportingManager?: string;
  approvalOutcome?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  canReview?: boolean;
  employeeName: string;
  employeeEmail: string;
  employeeCode: string;
}

function statusTone(status: AdminRegularizationItem['status']) {
  if (status === 'Approved') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Rejected') return 'bg-rose-50 text-rose-600';
  return 'bg-amber-50 text-amber-700';
}

const MONTH_OPTIONS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' },
];

export default function RegularizationInbox() {
  const { showFeedback } = useHrmFeedback();
  const [activeTab, setActiveTab] = useState<InboxTab>('pending');
  const [pendingForMe, setPendingForMe] = useState<AdminRegularizationItem[]>([]);
  const [history, setHistory] = useState<AdminRegularizationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewingId, setIsReviewingId] = useState('');
  const [error, setError] = useState('');
  const [setupPending, setSetupPending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const loadInbox = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/HRM/api/admin/regularization', { method: 'GET' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load regularization inbox');
      }

      setPendingForMe(result.pendingForMe || []);
      setHistory(result.history || []);
      setSetupPending(Boolean(result.setupPending));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load regularization inbox');
      setSetupPending(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const handleReview = async (
    id: string,
    decision: 'approved' | 'rejected',
    approvalOutcome?: 'full_day' | 'half_day'
  ) => {
    if (!id) {
      showFeedback({ type: 'warning', title: 'Request Missing', message: 'This request is missing its id, so it cannot be reviewed yet.' });
      return;
    }

    try {
      setIsReviewingId(id);
      const response = await fetch(`/HRM/api/attendance/regularization/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decision, approvalOutcome }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to review request');
      }

      await loadInbox();
      window.dispatchEvent(new CustomEvent('hrm-attendance-updated'));
      window.dispatchEvent(new CustomEvent('hrm-admin-sidebar-counts-refresh'));
      showFeedback({ type: 'success', title: 'Request Reviewed', message: 'Regularization request reviewed successfully.' });
    } catch (requestError) {
      showFeedback({ type: 'error', title: 'Review Failed', message: requestError instanceof Error ? requestError.message : 'Failed to review request' });
    } finally {
      setIsReviewingId('');
    }
  };

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear().toString();
    const yearsSet = new Set<string>([currentYear, '2025', '2026']);
    [...pendingForMe, ...history].forEach((item) => {
      if (item.date && item.date.length >= 4) {
        const y = item.date.slice(0, 4);
        if (/^\d{4}$/.test(y)) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [pendingForMe, history]);

  const dayOptions = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      return (i + 1).toString().padStart(2, '0');
    });
  }, []);

  const filteredPending = useMemo(() => {
    return pendingForMe.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.employeeName && item.employeeName.toLowerCase().includes(q)) ||
        (item.employeeCode && item.employeeCode.toLowerCase().includes(q));

      const matchYear = !selectedYear || (item.date && item.date.slice(0, 4) === selectedYear);
      const matchMonth = !selectedMonth || (item.date && item.date.slice(5, 7) === selectedMonth);
      const matchDay = !selectedDay || (item.date && item.date.slice(8, 10) === selectedDay);

      return matchSearch && matchYear && matchMonth && matchDay;
    });
  }, [pendingForMe, searchQuery, selectedYear, selectedMonth, selectedDay]);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.employeeName && item.employeeName.toLowerCase().includes(q)) ||
        (item.employeeCode && item.employeeCode.toLowerCase().includes(q));

      const matchYear = !selectedYear || (item.date && item.date.slice(0, 4) === selectedYear);
      const matchMonth = !selectedMonth || (item.date && item.date.slice(5, 7) === selectedMonth);
      const matchDay = !selectedDay || (item.date && item.date.slice(8, 10) === selectedDay);

      return matchSearch && matchYear && matchMonth && matchDay;
    });
  }, [history, searchQuery, selectedYear, selectedMonth, selectedDay]);

  const isFiltering = Boolean(searchQuery.trim() || selectedYear || selectedMonth || selectedDay);
  const totalList = activeTab === 'pending' ? pendingForMe : history;
  const list = activeTab === 'pending' ? filteredPending : filteredHistory;

  const switchTabs = useMemo(
    () => [
      {
        key: 'pending' as const,
        label: 'Pending',
        count: isFiltering ? filteredPending.length : pendingForMe.length,
        icon: 'hourglass_top',
      },
      {
        key: 'history' as const,
        label: 'History',
        count: isFiltering ? filteredHistory.length : history.length,
        icon: 'history',
      },
    ],
    [history.length, pendingForMe.length, filteredPending.length, filteredHistory.length, isFiltering]
  );

  const activeTabIndex = switchTabs.findIndex((tab) => tab.key === activeTab);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100/90 text-violet-700 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <h1 className="text-3xl font-headline font-bold text-on-background">Attendance Regularization</h1>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
        <div className="inline-grid min-w-[280px] sm:min-w-[340px] grid-cols-2 gap-2 rounded-full border border-outline-variant/10 bg-surface-container-lowest p-1 shadow-sm">
          {switchTabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`inline-flex min-w-4 items-center justify-center rounded-full px-1 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-[#edf4fc] text-primary' : 'bg-[#F1F4F5] text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3 Separate Date Selectors (Year, Month, Date) & Search Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-11 appearance-none rounded-full border border-outline-variant/20 bg-surface-container-lowest pl-3.5 pr-8 text-xs font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
              title="Filter by Year"
            >
              <option value="">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 text-slate-400 text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Month Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-11 appearance-none rounded-full border border-outline-variant/20 bg-surface-container-lowest pl-3.5 pr-8 text-xs font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
              title="Filter by Month"
            >
              <option value="">All Months</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 text-slate-400 text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Day / Date Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="h-11 appearance-none rounded-full border border-outline-variant/20 bg-surface-container-lowest pl-3.5 pr-8 text-xs font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
              title="Filter by Date / Day"
            >
              <option value="">All Days</option>
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 text-slate-400 text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Reset Date Button */}
          {selectedYear || selectedMonth || selectedDay ? (
            <button
              type="button"
              onClick={() => {
                setSelectedYear('');
                setSelectedMonth('');
                setSelectedDay('');
              }}
              className="inline-flex h-11 items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition shadow-sm"
              title="Reset date filters"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Date</span>
            </button>
          ) : null}

          {/* Search bar */}
          <div className="relative flex items-center min-w-[200px] sm:min-w-[250px]">
            <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] pointer-events-none">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee name, ID..."
              className="h-11 w-full rounded-full border border-outline-variant/20 bg-surface-container-lowest pl-9 pr-9 text-xs font-medium text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm placeholder:text-slate-400"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
        {isLoading ? (
          <LoadingPanel
            title="Loading regularization inbox"
            message="Pending approvals and review history are being prepared for this queue."
          />
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : setupPending ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
            Regularization database setup is pending. Apply the latest migration so the recipient table exists in Supabase.
          </div>
        ) : totalList.length === 0 ? (
          <HrmEmptyState
            icon={activeTab === 'pending' ? 'hourglass_disabled' : 'history'}
            title={activeTab === 'pending' ? 'No pending requests' : 'No history records yet'}
            message={
              activeTab === 'pending'
                ? 'Fresh regularization requests will appear here once employees send them for approval.'
                : 'Reviewed regularization records will begin showing here after the first approval cycle.'
            }
          />
        ) : list.length === 0 ? (
          <HrmEmptyState
            icon="search_off"
            title="No matching requests found"
            message={`No ${activeTab} regularization requests match the selected filters. Try adjusting your search query, year, month, or date filter.`}
          />
        ) : activeTab === 'pending' ? (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-headline font-bold text-on-background">Pending</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Review employee regularization requests in a cleaner approval queue.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {filteredPending.length} pending
              </span>
            </div>

            <div className="overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[1160px] text-left">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="border-b border-outline-variant/10">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Employee</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Request Type</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Current Status</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Requested Time</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Reporting Manager</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Reason</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Applied On</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredPending.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">
                        <p className="font-semibold truncate whitespace-nowrap">{item.employeeName}</p>
                        <p className="mt-1 text-xs text-on-surface-variant whitespace-nowrap">{item.employeeCode}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.date}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.requestType}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.currentStatusLabel || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.timeRange}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.reportingManager || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.reason || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.appliedOn}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {item.canReview ? (
                          (() => {
                            const isHalfDayRequest =
                              String(item.requestType || '').toLowerCase().includes('half');

                            if (isHalfDayRequest) {
                              return (
                                <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                                  <button
                                    type="button"
                                    disabled={isReviewingId === item.id}
                                    onClick={() => handleReview(item.id, 'rejected')}
                                    className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isReviewingId === item.id}
                                    onClick={() => handleReview(item.id, 'approved', 'half_day')}
                                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-sm hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  disabled={isReviewingId === item.id}
                                  onClick={() => handleReview(item.id, 'rejected')}
                                  className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  disabled={isReviewingId === item.id}
                                  onClick={() => handleReview(item.id, 'approved', 'half_day')}
                                  className="rounded-full border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                                >
                                  Half Day
                                </button>
                                <button
                                  type="button"
                                  disabled={isReviewingId === item.id}
                                  onClick={() => handleReview(item.id, 'approved', 'full_day')}
                                  className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"
                                >
                                  Full Day
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-sm text-on-surface-variant">Awaiting action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-headline font-bold text-on-background">History</h2>
                <p className="mt-1 text-sm text-on-surface-variant">View reviewed regularization requests with final decisions and audit trail.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {filteredHistory.length} records
              </span>
            </div>

            <div className="overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[1080px] text-left">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="border-b border-outline-variant/10">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Employee</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Requested Time</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Approval Result</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Reviewed By</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Reviewed At</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant/70 whitespace-nowrap">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">
                        <p className="font-semibold truncate whitespace-nowrap">{item.employeeName}</p>
                        <p className="mt-1 text-xs text-on-surface-variant whitespace-nowrap">{item.employeeCode}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.date}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.timeRange}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusTone(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.approvalOutcome || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.reviewedBy || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.reviewedAt || '-'}</td>
                      <td className="px-4 py-4 text-sm text-on-surface whitespace-nowrap">{item.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
