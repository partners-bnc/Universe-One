import { AlertTriangle } from 'lucide-react';
import { getBounceKpi } from '@/utils/crm-bounce-metrics';

export default function CampaignBounceKpi({ campaign, detail = false, compact = false, hideLabel = false }) {
  const metric = getBounceKpi(campaign);
  const explanation = 'Archived bounced addresses divided by the preserved original send total when available, otherwise the current Sent count. Historical rates use the retained data even when records are incomplete.';
  if (detail) {
    return (
      <div title={explanation} className="bg-white dark:bg-slate-850 p-4.5 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Bounce Rate</span>
          <div className="flex items-center justify-between mt-1.5 w-full">
            <span className="text-3xl font-medium text-rose-500 dark:text-rose-400 leading-none">{metric.label}</span>
            <AlertTriangle className="w-5.5 h-5.5 text-rose-500 shrink-0" />
          </div>
        </div>
        <p className="text-[11px] text-slate-450 mt-3 block font-normal">{metric.caption}</p>
        {metric.note && <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">{metric.note}</p>}
      </div>
    );
  }
  return (
    <div title={explanation} className={compact ? 'text-xs leading-relaxed' : 'mb-5 rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2.5 dark:border-rose-900/30 dark:bg-rose-950/10'}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {!hideLabel && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400"><AlertTriangle size={13} />Bounce rate</span>}
        <span className="font-semibold text-rose-600 dark:text-rose-400">{metric.label}</span>
      </div>
      <p className="mt-0.5 text-[11px] font-normal text-slate-500 dark:text-slate-400">{metric.caption}</p>
      {metric.note && <p className="text-[11px] font-normal text-amber-700 dark:text-amber-400">{metric.note}</p>}
    </div>
  );
}
