'use client';

export default function LeadSourcesPage() {
  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] dark:bg-[#1D1D1F] p-8 font-sans">
      {/* Page Header */}
      <div className="mb-7 border-b border-[#D2D2D7]/70 dark:border-white/10 pb-5">
        <h1 className="text-[28px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white leading-tight">
          Lead Sources
        </h1>
        <p className="text-[13px] text-[#86868B] mt-0.5">
          Manage and analyze where your prospective leads and customers are originating
        </p>
      </div>

      {/* Feature Showcase Card */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#1D1D1F] border border-[#D2D2D7]/80 dark:border-white/10 rounded-[18px] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.121m-1.5-2.121c.251.023.501.05.75.082M19 14.5l-4.091-4.091A2.25 2.25 0 0114.25 8.82V3.104m0 0c-.251.023-.501.05-.75.082M9 21h6m-6 0a3 3 0 01-3-3v-1.5a3 3 0 013-3h6a3 3 0 013 3V18a3 3 0 01-3 3m-6 0h6" />
            </svg>
          </div>
          <div>
            <h2 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white">
              Lead Source Analytics
            </h2>
            <p className="text-[13px] text-[#86868B] mt-1 max-w-sm">
              Comprehensive channel attribution and multi-touch performance analytics are currently being calibrated for your workspace.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF] border border-[#0071E3]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
            In Active Development
          </span>
        </div>
      </div>
    </div>
  );
}
