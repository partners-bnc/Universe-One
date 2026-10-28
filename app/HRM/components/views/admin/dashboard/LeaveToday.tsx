'use client';

import React from 'react';
import HrmEmptyState from '../../../ui/HrmEmptyState';
import { Avatar, Panel } from './shared';

// Employees on approved leave today: photo, name, ID, dates and session.

function fmt(value) {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function windowLabel(start, end) {
  if (!start && !end) return 'Today';
  const a = fmt(start), b = fmt(end);
  return a === b ? a : `${a} → ${b}`;
}

function daysBetween(start, end) {
  if (!start || !end) return 1;
  return Math.round((new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime()) / 86400000) + 1;
}

export default function LeaveToday({ employees, onOpenEmployee }) {
  return (
    <Panel
      title="On Leave Today"
      icon="beach_access"
      badge={<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">{employees.length} away</span>}
    >
      {employees.length === 0 ? (
        <HrmEmptyState
          compact
          icon="event_available"
          title="No leave record for today"
          message="Employees who are approved for leave today will appear here."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                <th className="pb-2 pl-2 font-bold">Employee</th>
                <th className="pb-2 font-bold">Dates</th>
                <th className="pb-2 font-bold">Session</th>
                <th className="pb-2 pr-2 text-right font-bold">Days</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => {
                const days = daysBetween(employee.startDate, employee.endDate);
                return (
                  <tr key={employee.id} onClick={() => onOpenEmployee(employee.employeeId)} className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-amber-50/40">
                    <td className="py-3 pl-2">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="relative">
                          <Avatar name={employee.name} src={employee.profilePictureUrl} size={38} className="ring-2 ring-amber-200" />
                          <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-amber-400 ring-2 ring-white">
                            <span className="material-symbols-outlined text-[10px] text-white">flight</span>
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-slate-900">{employee.name || 'Employee'}</p>
                          <p className="truncate font-mono text-[11px] font-semibold text-slate-500">{employee.employeeCode || '—'}{employee.designation ? <span className="font-sans font-medium"> · {employee.designation}</span> : null}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[13px] font-semibold text-slate-800">{windowLabel(employee.startDate, employee.endDate)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-600">{String(employee.session || 'full_day').replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <span className="inline-grid h-8 min-w-8 place-items-center rounded-xl bg-amber-50 px-2 text-[13px] font-extrabold text-amber-700 ring-1 ring-amber-200">{days}</span>
                    </td>
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
