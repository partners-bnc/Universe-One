'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components-homepage/Navbar';
import { useWorkspaceRouting } from '@/app/components-homepage/useWorkspaceRouting';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { ModuleAccessGate } from '@/app/components-homepage/ModuleAccessGate';

export default function FinanceHubPage() {
  const { loading, isAuthenticated, workspaceHref, user } = useWorkspaceRouting();
  const workspaceLabel = loading ? 'Loading' : isAuthenticated ? 'Workspace' : 'Login';

  const financeModules = [
    {
      id: 'compliance-calendar',
      title: 'Compliance Calendar Tracker',
      badge: 'Active',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      href: '/other-modules/finance/compliance-calendar',
      icon: Calendar,
      description: 'Track statutory due dates, payment status, and compliance heat maps across financial years.',
      tags: ['Statutory Deadlines', 'Payment Tracking', 'Category Heat Map', 'Email Reports'],
      actionText: 'Open Calendar',
    },
  ];

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
        <div className="max-w-6xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#3170c6] bg-[#edf4fc] border border-[#afd0f4] shadow-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Financial Suite
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Finance Module
            </h1>
          </div>

          {/* Card Layout */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {financeModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 bg-white/95 hover:bg-white border border-slate-200/90 hover:border-[#afd0f4] rounded-2xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_32px_rgba(49,112,198,0.1)] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-xl"
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#edf4fc] group-hover:bg-[#3170c6] text-[#3170c6] group-hover:text-white rounded-xl flex items-center justify-center transition-colors duration-300 shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${module.badgeColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {module.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#3170c6] transition-colors mb-1.5">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
                      {module.description}
                    </p>

                    {/* Feature Tags */}
                    {module.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {module.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100/80 text-slate-600 border border-slate-200/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">Statutory Suite</span>
                    <Link
                      href={module.href}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white font-bold text-xs transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>{module.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </ModuleAccessGate>
  );
}
