"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrm } from '../context/CrmContext';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Clock, Calendar, Briefcase, Globe, Activity as ActivityIcon, 
  Mail, RefreshCw, Layers, Award, CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useCrm();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/other-modules/crm/api/dashboard');
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  if (!mounted) return null; // Avoid Hydration mismatch on Recharts

  // Strict RBAC: Only Admin & Manager
  if (!["admin", "manager"].includes(currentUser?.role)) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-8 text-center transition-colors">
        <div className="max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-red-200 dark:border-red-900/50">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-medium">!</div>
          <h1 className="text-2xl font-medium text-slate-800 dark:text-white mb-2">Executive Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-normal">
            Your role (<span className="uppercase font-semibold">{currentUser?.role}</span>) does not have authorization to view macro-level analytical statistics.
          </p>
          <button 
            onClick={() => router.push('/other-modules/crm/leads')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Return to Pipeline
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-450">Assembling executive analytics...</span>
        </div>
      </div>
    );
  }

  // Fallbacks in case tables are empty
  const totalLeads = data?.totalLeads || 0;
  const campaignsMetrics = data?.campaignsMetrics || { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 };
  const experienceMetrics = data?.experienceMetrics || { topCompanies: [], avgDuration: 0, totalEntries: 0 };
  const educationMetrics = data?.educationMetrics || { topInstitutions: [], topDegrees: [], totalEntries: 0 };
  const leadsTrend = data?.leadsTrend || [];
  const recentActivities = data?.recentActivities || [];

  // Funnel Data parsing
  const leadsByStatus = data?.leadsByStatus || {};
  const funnelData = [
    { name: 'New', count: leadsByStatus['New'] || 0, color: '#94a3b8' },
    { name: 'Contacted', count: leadsByStatus['Contacted'] || 0, color: '#3b82f6' },
    { name: 'Qualified', count: leadsByStatus['Qualified'] || 0, color: '#8b5cf6' },
    { name: 'Converted', count: leadsByStatus['Converted'] || 0, color: '#10b981' }
  ];

  // Campaign rates
  const deliveryRate = campaignsMetrics.sent > 0 ? ((campaignsMetrics.delivered / campaignsMetrics.sent) * 100).toFixed(0) : 0;
  const openRate = campaignsMetrics.delivered > 0 ? ((campaignsMetrics.opened / campaignsMetrics.delivered) * 100).toFixed(0) : 0;
  const clickRate = campaignsMetrics.opened > 0 ? ((campaignsMetrics.clicked / campaignsMetrics.opened) * 100).toFixed(0) : 0;

  // Followups rates
  const followupsByStatus = data?.followupsByStatus || {};
  const completedFollowups = followupsByStatus['Completed'] || 0;
  const scheduledFollowups = followupsByStatus['Scheduled'] || 0;
  const totalFollowupsCount = completedFollowups + scheduledFollowups;
  const followupsSuccessRate = totalFollowupsCount > 0 ? ((completedFollowups / totalFollowupsCount) * 100).toFixed(0) : 0;

  const formatDateValue = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200 h-full overflow-y-auto bg-[#F5F5F7] dark:bg-[#161617] antialiased">
      
      {/* Header bar */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.28px] text-[#1D1D1F] dark:text-white">
            Executive Dashboard
          </h1>
          <p className="text-sm text-[#6E6E73] dark:text-[#86868B] mt-1 tracking-tight">
            Macro analytical insights compiled from live pipelines, campaigns, and candidate backgrounds.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-[#0071E3] hover:bg-[#0076DF] text-white h-[44px] px-[21px] rounded-full font-medium transition-all shadow-xs hover:shadow-sm text-sm cursor-pointer active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4 text-white" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Pipeline Density */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em]">Pipeline Density</span>
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-2">{totalLeads}</h3>
          <p className="text-xs text-[#6E6E73] mt-2">Active lead entities tracked</p>
        </div>

        {/* Card 2: Campaign Reach */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em]">Campaign Outreach</span>
            <div className="w-8 h-8 rounded-full bg-[#686CCC]/10 flex items-center justify-center text-[#686CCC]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-2">{campaignsMetrics.sent.toLocaleString()}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">
            <span className="text-[#0071E3] font-semibold">{openRate}% Open</span>
            <span>•</span>
            <span className="text-[#686CCC] font-semibold">{clickRate}% Click</span>
          </div>
        </div>

        {/* Card 3: Followups completed */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em]">Outreach Success</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-2">{followupsSuccessRate}%</h3>
          <p className="text-xs text-[#6E6E73] mt-2">{completedFollowups} of {totalFollowupsCount} interactions met</p>
        </div>

        {/* Card 4: Background Profiling Coverage */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em]">Profile Coverage</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white mt-2">{experienceMetrics.totalEntries + educationMetrics.totalEntries}</h3>
          <p className="text-xs text-[#6E6E73] mt-2">Relational history records linked</p>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Weekly Ingestion Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="mb-6 border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4">
            <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white">Lead Ingestion Trend</h2>
            <p className="text-xs text-[#6E6E73] dark:text-[#86868B] mt-0.5">Weekly compile of new lead creations over the last 6 cycles.</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D2D2D7" opacity={0.6} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 11, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 11, fontWeight: 500}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1D1D1FE6', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [value, 'New Leads']}
                />
                <Area type="monotone" dataKey="leads" stroke="#0071E3" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Pipeline Phase Funnel */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="mb-6 border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4">
            <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white">Pipeline Phase Funnel</h2>
            <p className="text-xs text-[#6E6E73] dark:text-[#86868B] mt-0.5">Density distribution by current status.</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnelData} margin={{ top: 0, right: 20, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#D2D2D7" opacity={0.6} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#86868B', fontSize: 12, fontWeight: 500}} width={90} />
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ backgroundColor: '#1D1D1FE6', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#fff', fontSize: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} 
                />
                <Bar dataKey="count" radius={[0, 980, 980, 0]} maxBarSize={28}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


      {/* Relational Candidate Profiles Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Career Profile Insights */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="mb-4 border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4">
              <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0071E3]" /> Career Profile Insights
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#86868B] mt-0.5">Aggregated from experiences linked to candidates records.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-2.5">Top Past Companies</h3>
                <div className="space-y-2">
                  {experienceMetrics.topCompanies.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-[#D2D2D7]/30 dark:border-white/5 last:border-0">
                      <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#E8E8ED]">{c.name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF]">
                        {c.count} leads
                      </span>
                    </div>
                  ))}
                  {experienceMetrics.topCompanies.length === 0 && (
                    <p className="text-xs text-[#86868B] py-2">No work experiences recorded in the database yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#D2D2D7]/40 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">Average Tenure</span>
            <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white">{experienceMetrics.avgDuration} years</span>
          </div>
        </div>

        {/* Academic Profile Insights */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="mb-4 border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4">
              <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" /> Academic Profile Insights
              </h2>
              <p className="text-xs text-[#6E6E73] dark:text-[#86868B] mt-0.5">Aggregated from education histories linked to candidates.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-[11px] font-semibold text-[#86868B] uppercase tracking-[0.08em] mb-2.5">Top Universities / Schools</h3>
                <div className="space-y-2">
                  {educationMetrics.topInstitutions.map((inst, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-[#D2D2D7]/30 dark:border-white/5 last:border-0">
                      <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#E8E8ED] truncate max-w-[200px]">{inst.name}</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        {inst.count} grads
                      </span>
                    </div>
                  ))}
                  {educationMetrics.topInstitutions.length === 0 && (
                    <p className="text-xs text-[#86868B] py-2">No educational qualifications recorded in the database yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D2D2D7]/40 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">Total Education Profiles</span>
            <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white">{educationMetrics.totalEntries} entries</span>
          </div>
        </div>

      </div>

      {/* Campaigns and Operational Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Email Campaigns KPI Summary */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="mb-6 flex justify-between items-center border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4">
              <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0071E3]" /> Mass Mailing Performance
              </h2>
              <span className="text-xs font-semibold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full">
                Live Campaigns
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B] mb-1">Emails Sent</span>
                <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">{campaignsMetrics.sent.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B] mb-1">Delivered</span>
                <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">{campaignsMetrics.delivered.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B] mb-1">Opens</span>
                <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">{campaignsMetrics.opened.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#86868B] mb-1">Clicks</span>
                <span className="text-2xl font-semibold tracking-tight text-[#1D1D1F] dark:text-white">{campaignsMetrics.clicked.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 pt-4 border-t border-[#D2D2D7]/40 dark:border-white/10 text-center">
            <div>
              <div className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">Delivery Rate</div>
              <div className="text-sm font-semibold text-[#1D1D1F] dark:text-white mt-1">{deliveryRate}%</div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">Open Rate</div>
              <div className="text-sm font-semibold text-[#0071E3] mt-1">{openRate}%</div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">Click Rate</div>
              <div className="text-sm font-semibold text-[#686CCC] mt-1">{clickRate}%</div>
            </div>
          </div>
        </div>

        {/* Operational activity feed */}
        <div className="bg-white dark:bg-[#1D1D1F] p-6 rounded-[18px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col h-[340px]">
          <div className="mb-4 flex items-center justify-between border-b border-[#D2D2D7]/40 dark:border-white/10 pb-4 shrink-0">
            <h2 className="text-base font-semibold tracking-[-0.14px] text-[#1D1D1F] dark:text-white flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-emerald-600" /> Operational Feed
            </h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
              Recent Logs
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
            {recentActivities.map((act, i) => (
              <div key={act.id || i} className="flex gap-3 items-start py-2 border-b border-[#D2D2D7]/30 dark:border-white/5 last:border-0">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#1D1D1F] dark:text-[#E8E8ED] leading-snug break-words">
                    {act.assigned_to || 'Sales Representative'} completed a <span className="lowercase font-semibold text-[#0071E3]">{act.type}</span> outreach.
                  </p>
                  {act.outcome && (
                    <p className="text-xs font-normal text-[#6E6E73] dark:text-[#86868B] mt-1 truncate">
                      {act.outcome}
                    </p>
                  )}
                  <p className="text-[10px] text-[#86868B] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateValue(act.date)}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Clock className="w-8 h-8 text-[#86868B]/40 mb-2" />
                <p className="text-xs font-normal text-[#86868B]">No interaction feed logs logged in this cycle.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

