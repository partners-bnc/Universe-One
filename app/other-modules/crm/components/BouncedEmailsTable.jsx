"use client";

import { useEffect, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw, Search, UserX } from 'lucide-react';

const PAGE_SIZE = 50;
const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

export default function BouncedEmailsTable({ onCountChange }) {
  const [search, setSearch] = useState('');
  const [campaign, setCampaign] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState({ rows: [], total: 0, archive_total: 0, unique_emails: 0, campaigns: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const params = new URLSearchParams({ search, campaign, type, page: String(page), limit: String(PAGE_SIZE) });
        const response = await fetch(`/other-modules/crm/api/campaigns/bounces?${params}`, { signal: controller.signal, cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load bounced emails.');
        if (controller.signal.aborted) return;
        setData(result); onCountChange?.(result.archive_total);
        const lastPage = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
        if (page > lastPage) setPage(lastPage);
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message || 'Unable to load bounced emails.');
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, search ? 250 : 0);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, campaign, type, page, refresh, onCountChange]);

  function changeFilter(setter, value) { setter(value); setPage(1); }
  const pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const fieldClass = 'h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400';

  return (
    <section aria-label="Bounced emails archive" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bounced emails</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{data.archive_total} archived entries · {data.unique_emails} unique email addresses</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">These addresses are blocked from future campaigns. Bounce records remain here after lead cleanup.</p>
        </div>
        <button type="button" onClick={() => setRefresh(v => v + 1)} disabled={loading} className={`${fieldClass} inline-flex items-center gap-2 disabled:opacity-50`}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" aria-hidden="true" />
          <input aria-label="Search bounced email addresses" value={search} onChange={e => changeFilter(setSearch, e.target.value)} placeholder="Search email address" className={`${fieldClass} w-full pl-9`} />
        </div>
        <select aria-label="Filter by campaign" value={campaign} onChange={e => changeFilter(setCampaign, e.target.value)} className={`${fieldClass} max-w-full sm:max-w-72`}>
          <option value="">All campaigns</option>
          {data.campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select aria-label="Filter by bounce type" value={type} onChange={e => changeFilter(setType, e.target.value)} className={fieldClass}>
          <option value="">All bounce types</option><option value="hard">Hard bounce</option><option value="soft">Soft bounce</option><option value="unknown">Not retained</option>
        </select>
      </div>
      {error ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle size={18} /><span>{error}</span><button type="button" onClick={() => setRefresh(v => v + 1)} className="font-semibold underline">Retry</button>
        </div>
      ) : (
        <div aria-busy={loading} className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              {['Email', 'Campaign', 'Bounce type', 'Reason', 'Bounce date (IST)'].map(label => <th key={label} scope="col" className="px-4 py-3 font-medium text-slate-900 dark:text-slate-200">{label}</th>)}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500" role="status">Loading bounced emails…</td></tr>
                : data.rows.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  <UserX size={28} className="mx-auto mb-2 text-slate-400" />{search || campaign || type ? 'No bounced emails match these filters.' : 'No bounced emails have been archived yet.'}
                </td></tr> : data.rows.map(row => (
                  <tr key={row.id} className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/30">
                    <td className="min-w-56 max-w-xs px-4 py-4 font-medium text-slate-900 dark:text-slate-100 break-all">{row.email}</td>
                    <td className="min-w-44 max-w-60 px-4 py-4 text-slate-700 dark:text-slate-300"><div>{row.campaign_name}</div>
                      {!row.campaign_id && row.subject && <div className="mt-1 text-xs text-slate-500">{row.subject}</div>}
                    </td>
                    <td className="px-4 py-4"><span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${row.bounce_type === 'hard' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                      {row.bounce_type === 'unknown' ? 'Not retained' : `${row.bounce_type === 'hard' ? 'Hard' : 'Soft'} bounce`}
                    </span></td>
                    <td className="min-w-64 max-w-md break-words px-4 py-4 leading-relaxed text-slate-600 dark:text-slate-400">{row.reason}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-400">{dateFormat.format(new Date(row.bounced_at))}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {!error && <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span aria-live="polite">{data.total ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, data.total)} of ${data.total}` : '0 results'}</span>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Previous page" disabled={loading || page <= 1} onClick={() => setPage(v => v - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"><ChevronLeft size={16} /></button>
          <span>Page {page} of {pages}</span>
          <button type="button" aria-label="Next page" disabled={loading || page >= pages} onClick={() => setPage(v => v + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-700"><ChevronRight size={16} /></button>
        </div>
      </div>}
    </section>
  );
}
