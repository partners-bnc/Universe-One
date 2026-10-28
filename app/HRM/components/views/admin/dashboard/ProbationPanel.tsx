'use client';

import React from 'react';
import HrmEmptyState from '../../../ui/HrmEmptyState';
import { Avatar, Panel, Skeleton } from './shared';

// Employees on probation with how much of the period is done.
// Built from the existing employee directory API (GET /HRM/api/employees).

const DAY_MS = 86400000;
const DEFAULT_PROBATION_DAYS = 180;
const SEGMENTS = 6; // one block per month of the 6-month probation

function toLocalDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

export function buildProbationRows(employees = []) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return employees
    .filter((employee) => {
      const stage = String(employee.resolved_current_stage || employee.current_stage || '').toLowerCase();
      const lifecycle = String(employee.resolved_employment_lifecycle_status || employee.employment_lifecycle_status || '').toLowerCase();
      return stage === 'probation' && lifecycle !== 'separated';
    })
    .map((employee) => {
      const start = toLocalDate(employee.probation_started_at) || toLocalDate(employee.date_of_joining);
      if (!start) return null;
      const periodDays = Number(employee.probation_period_days) || DEFAULT_PROBATION_DAYS;
      const end = toLocalDate(employee.probation_ends_at) || new Date(start.getTime() + periodDays * DAY_MS);
      const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_MS));
      const doneDays = Math.min(totalDays, Math.max(0, Math.round((today.getTime() - start.getTime()) / DAY_MS)));
      return {
        id: employee.id,
        name: employee.name || 'Employee',
        code: employee.employee_id || '',
        designation: employee.resolved_designation_title || employee.designation?.title || '',
        photo: employee.profile_picture_url || '',
        end,
        totalDays,
        doneDays,
        daysLeft: Math.round((end.getTime() - today.getTime()) / DAY_MS),
        percent: Math.round((doneDays / totalDays) * 100),
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.daysLeft - right.daysLeft);
}

function tone(row) {
  if (row.daysLeft < 0) return { bar: 'from-[#34c38f] to-[#0f8a63]', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200', label: 'Completed · confirm' };
  if (row.daysLeft <= 15) return { bar: 'from-[#f6b24a] to-[#d97706]', chip: 'bg-amber-50 text-amber-700 ring-amber-200', label: `${row.daysLeft}d left` };
  return { bar: 'from-[#6aa5f2] to-[#2559b0]', chip: 'bg-[#eef4ff] text-[#2558a2] ring-[#d3e2f8]', label: `${row.daysLeft}d left` };
}

export default function ProbationPanel({ rows, loading, error, onOpenEmployee }) {
  return (
    <Panel
      title="On Probation"
      icon="hourglass_top"
      badge={<span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2558a2]">{loading ? '…' : rows.length} people</span>}
    >
      {loading ? (
        <div className="space-y-2">{[0, 1, 2].map((k) => <Skeleton key={k} className="h-14" />)}</div>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
      ) : rows.length === 0 ? (
        <HrmEmptyState compact icon="verified" title="No one is on probation" message="Employees in their probation period will appear here with their progress." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left">
            <thead>
              <tr className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                <th className="pb-2 pl-2 font-bold">Employee</th>
                <th className="pb-2 font-bold">ID</th>
                <th className="pb-2 font-bold">Progress</th>
                <th className="pb-2 pr-2 text-right font-bold">Ends</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const t = tone(row);
                return (
                  <tr key={row.id} onClick={() => onOpenEmployee(row.id)} className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-[#f6f9ff]">
                    <td className="py-3 pl-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={row.name} src={row.photo} size={36} className="ring-2 ring-white shadow-sm" />
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-slate-900">{row.name}</p>
                          <p className="truncate text-xs text-slate-500">{row.designation || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">{row.code || '—'}</span></td>
                    <td className="w-[46%] py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-1 gap-1" title={`${row.percent}% of probation done`}>
                          {Array.from({ length: SEGMENTS }, (_, i) => {
                            const fill = Math.min(1, Math.max(0, (row.percent / 100) * SEGMENTS - i));
                            return (
                              <span key={i} className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <span className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${t.bar} transition-[width] duration-1000`} style={{ width: `${fill * 100}%`, transitionDelay: `${i * 120}ms` }} />
                              </span>
                            );
                          })}
                        </div>
                        <span className="w-10 text-right text-xs font-bold tabular-nums text-slate-700">{row.percent}%</span>
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${t.chip}`}>{t.label}</span>
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-slate-400">Month {Math.min(SEGMENTS, Math.floor((row.percent / 100) * SEGMENTS) + 1)} of {SEGMENTS} · Day {row.doneDays} of {row.totalDays}</p>
                    </td>
                    <td className="py-3 pr-2 text-right text-xs font-semibold text-slate-700">{row.end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
