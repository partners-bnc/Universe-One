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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      href: '/other-modules/finance/compliance-calendar',
      icon: Calendar,
      description:
        'Track statutory & internal compliance deadlines, monthly payment records, multi-client schedules, and automated email reporting.',
      actionText: 'Open Compliance Calendar',
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
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#3170c6] bg-[#edf4fc] border border-[#afd0f4] shadow-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Financial Suite
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Finance Module
            </h1>
          </div>

          {/* 3-Column Card Layout */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {financeModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="group relative flex flex-col justify-between p-6 bg-white/90 hover:bg-white border border-slate-200/80 hover:border-[#afd0f4] rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_20px_40px_rgba(49,112,198,0.08)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="w-12 h-12 bg-[#edf4fc] group-hover:bg-[#3170c6] text-[#3170c6] group-hover:text-white rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${module.badgeColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {module.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3170c6] transition-colors mb-2">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      {module.description}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={module.href}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#3170c6] hover:bg-[#2558a2] text-white font-bold text-xs transition-all duration-300 shadow-md shadow-[#3170c6]/20 cursor-pointer"
                    >
                      <span>{module.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
