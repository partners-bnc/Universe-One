export const metadata = {
  title: 'CRM Dashboard - BnC',
  description: 'Manage customer relationships, sales pipelines, and track leads.',
};

import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import { CrmProvider } from './context/CrmContext';
import { ToastProvider } from './context/ToastContext';

export default function CRMLayout({ children }) {
  return (
    <CrmProvider>
      <ToastProvider>
        <div 
          className="flex h-screen flex-col overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-200 dark:bg-[#1D1D1F] dark:text-[#F5F5F7] md:flex-row antialiased"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
        >
          <div className="hidden md:block">
            <Sidebar />
          </div>
          {/* Frosted Mobile Header */}
          <div className="flex items-center justify-between border-b border-[#D2D2D7] bg-white/80 backdrop-blur-xl px-5 py-3 text-[#1D1D1F] dark:border-white/10 dark:bg-[#1D1D1F]/80 dark:text-white md:hidden z-20">
            <span className="text-base font-semibold tracking-tight">BnC CRM</span>
            <span className="rounded-full bg-[#0071E3]/10 px-3 py-0.5 text-xs font-semibold text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF]">
              Mobile
            </span>
          </div>
          <main className="min-h-0 w-full flex-1 overflow-y-auto bg-[#F5F5F7] dark:bg-[#161617]">
            {children}
          </main>
          <CommandPalette />
        </div>
      </ToastProvider>
    </CrmProvider>
  );
}

