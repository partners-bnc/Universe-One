'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  WEEKDAYS,
  buildMonthGrid,
  formatDateLong,
  formatMonthYear,
  type AttendanceRecord,
  type AttendanceResponse,
  type AttendanceStatus,
} from './attendanceShared';
import EmployeePageHeader from '../ui/EmployeePageHeader';
import { MetricCardSkeleton, Skeleton } from '../ui/Skeleton';
import HrmEmptyState from '../ui/HrmEmptyState';
import SwipesModal from './SwipesModal';

interface TeamMember {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  profile_picture_url?: string | null;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; bg: string; text: string; dot: string; icon: string }> = {
  present: { label: 'Present', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: 'check_circle' },
  absent: { label: 'Absent', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500', icon: 'cancel' },
  halfday: { label: 'Half Day', bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500', icon: 'timelapse' },
  weekend: { label: 'Weekend', bg: 'bg-surface-container-low', text: 'text-on-surface-variant', dot: 'bg-on-surface/20', icon: 'weekend' },
  holiday: { label: 'Holiday', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', icon: 'celebration' },
  on_leave: { label: 'On Leave', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500', icon: 'event_available' },
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function TeamAttendance() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isTeamLoading, setIsTeamLoading] = useState(true);

  const [activeMonth, setActiveMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState({ presentCount: 0, absentCount: 0, halfDayCount: 0 });
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [isSwipesModalOpen, setIsSwipesModalOpen] = useState(false);
  const selectedDateRef = useRef(selectedDate);

  // Load team members
  useEffect(() => {
    let active = true;
    async function loadTeam() {
      try {
        setIsTeamLoading(true);
        const res = await fetch('/HRM/api/employee/team-members');
        const data = await res.json();
        if (active && Array.isArray(data.team_members)) {
          setTeamMembers(data.team_members);
          if (data.team_members.length > 0) {
            setSelectedMemberId(data.team_members[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        if (active) setIsTeamLoading(false);
      }
    }
    loadTeam();
    return () => { active = false; };
  }, []);

  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();
  const monthKey = getMonthKey(activeMonth);
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const recordMap = useMemo(() => {
    const map: Record<string, AttendanceRecord> = {};
    records.forEach((record) => {
      map[record.date] = record;
    });
    return map;
  }, [records]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  // Load selected team member's attendance
  useEffect(() => {
    if (!selectedMemberId) {
      setRecords([]);
      setSummary({ presentCount: 0, absentCount: 0, halfDayCount: 0 });
      return;
    }

    let active = true;

    async function loadAttendance() {
      try {
        setIsAttendanceLoading(true);
        const response = await fetch(`/HRM/api/attendance?month=${monthKey}&employeeId=${selectedMemberId}`, { method: 'GET' });
        const result: AttendanceResponse | { error?: string } = await response.json();

        if (!active || !response.ok || !('records' in result)) {
          if (active) {
            setRecords([]);
            setSummary({ presentCount: 0, absentCount: 0, halfDayCount: 0 });
          }
          return;
        }

        setRecords(result.records || []);
        setSummary(result.summary || { presentCount: 0, absentCount: 0, halfDayCount: 0 });

        const existingSelected = result.records.find((record) => record.date === selectedDateRef.current);
        if (!existingSelected) {
          const firstRecord = result.records[0];
          const firstOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          setSelectedDate(firstRecord?.date || firstOfMonth);
        }
      } catch {
        if (active) {
          setRecords([]);
          setSummary({ presentCount: 0, absentCount: 0, halfDayCount: 0 });
        }
      } finally {
        if (active) {
          setIsAttendanceLoading(false);
        }
      }
    }

    loadAttendance();
    return () => { active = false; };
  }, [selectedMemberId, monthKey, month, year]);

  const selectedRecord = selectedDate ? recordMap[selectedDate] ?? null : null;
  const selectedMember = teamMembers.find(m => m.id === selectedMemberId) || null;

  const getStatus = (dateStr: string): AttendanceStatus | null => {
    const record = recordMap[dateStr];
    if (record) return record.status;
    return null;
  };

  const changeMonth = (offset: number) => {
    const next = new Date(year, month + offset, 1);
    setActiveMonth(next);
  };

  const hasNoRecord = (dateStr: string) => !recordMap[dateStr];

  const kpiItems = [
    {
      label: 'On Time',
      value: String(summary.presentCount).padStart(2, '0'),
      helper: 'Days team member closed attendance within shift timing',
      icon: 'check_circle',
      shell: 'bg-emerald-50',
    },
    {
      label: 'Half Day',
      value: String(summary.halfDayCount).padStart(2, '0'),
      helper: 'Days where the required work hours were not completed',
      icon: 'timelapse',
      shell: 'bg-violet-50',
    },
    {
      label: 'Absent',
      value: String(summary.absentCount).padStart(2, '0'),
      helper: 'Working days marked without attendance activity',
      icon: 'cancel',
      shell: 'bg-rose-50',
    },
  ];

  if (isTeamLoading) {
    return (
      <div className="space-y-6 p-6">
        <EmployeePageHeader
          icon="groups"
          title="Team Attendance"
          description="Review and monitor attendance records for your team members."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <EmployeePageHeader
          icon="groups"
          title="Team Attendance"
          description="Review and monitor attendance records for your team members."
        />
        <HrmEmptyState
          icon="groups"
          title="No Team Members Found"
          message="You currently do not have any employees assigned to report to you. Once team members are assigned, their attendance and swipe logs will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header with Team Dropdown on the Top Corner */}
      <EmployeePageHeader
        icon="groups"
        title="Team Attendance"
        description="Monitor daily presence, review monthly calendars, and inspect swipe records for your reporting team members."
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Team:</span>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="rounded-xl border-0 bg-transparent py-1 pl-2 pr-8 text-sm font-bold text-on-surface outline-none cursor-pointer focus:ring-2 focus:ring-primary/20"
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.employee_id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      {/* Selected Member Header Card */}
      {selectedMember ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-5 editorial-shadow">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container shadow-sm">
              <Image
                src={
                  selectedMember.profile_picture_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=DBEAFE&color=1E3A8A&size=160`
                }
                alt={selectedMember.name}
                fill
                className="object-cover"
                unoptimized={!selectedMember.profile_picture_url}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-on-surface font-headline">{selectedMember.name}</h3>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {selectedMember.employee_id}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-on-surface-variant">{selectedMember.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/50">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Direct Reportee
            </span>
          </div>
        </div>
      ) : null}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiItems.map((kpi, idx) => {
          if (isAttendanceLoading) {
            return <MetricCardSkeleton key={idx} />;
          }

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 editorial-shadow transition-transform duration-200 hover:-translate-y-1 ${kpi.shell}`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant/80">{kpi.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/80">
                  {kpi.label}
                </span>
              </div>

              <div className="mt-4 text-4xl font-headline font-bold text-on-surface">
                {kpi.value}
              </div>

              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                {kpi.helper}
              </p>
            </div>
          );
        })}
      </div>

      {/* Calendar & Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Card */}
        <div className="lg:col-span-8 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 editorial-shadow">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => changeMonth(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Previous month"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              {formatMonthYear(year, month)}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Next month"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-4">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {cells.map((cell, idx) => {
              if (!cell.isCurrentMonth || cell.day === null) {
                return <div key={idx} className="h-16 rounded-2xl" />;
              }

              const isSelected = cell.dateStr === selectedDate;
              const status = getStatus(cell.dateStr);
              const config = status ? STATUS_CONFIG[status] : null;
              const noRecord = hasNoRecord(cell.dateStr);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`relative flex flex-col items-center justify-between p-2 h-16 rounded-2xl transition-all ${
                    config && !noRecord ? config.bg : 'bg-surface-container-lowest'
                  } ${
                    isSelected ? 'ring-2 ring-primary shadow-md shadow-primary/10' : 'hover:scale-[1.02]'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isSelected
                        ? 'text-primary font-bold'
                        : config && !noRecord
                        ? config.text
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {config && !noRecord ? (
                    <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Status Legend */}
          <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-wrap items-center gap-6 text-xs text-on-surface-variant font-medium">
            {Object.entries(STATUS_CONFIG).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${value.dot}`} />
                <span>{value.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="lg:col-span-4 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 editorial-shadow space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSwipesModalOpen(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-xs"
                  title="View All Swipes for Selected Date"
                  aria-label="View Swipes"
                >
                  <span className="material-symbols-outlined text-[17px]">fingerprint</span>
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                  Selected Date
                </span>
              </div>
              <h4 className="font-headline text-lg font-bold text-on-surface mt-1">
                {selectedDate ? formatDateLong(selectedDate) : '-'}
              </h4>
            </div>

            <div className="flex items-center gap-2">

              {selectedRecord && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    STATUS_CONFIG[selectedRecord.status]?.bg || 'bg-surface-container-low'
                  } ${STATUS_CONFIG[selectedRecord.status]?.text || 'text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {STATUS_CONFIG[selectedRecord.status]?.icon}
                  </span>
                  {STATUS_CONFIG[selectedRecord.status]?.label || selectedRecord.status}
                </span>
              )}
            </div>
          </div>

          {/* Shift Target */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Shift target: <strong className="text-on-surface">{selectedRecord?.shiftHours || '8h 30m'}</strong></span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">login</span> Check-in
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.checkIn || '-'}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">logout</span> Check-out
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.checkOut || '-'}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span> Late In
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.lateIn || '-'}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">directions_walk</span> Early Out
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.earlyOut || '-'}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">hourglass_bottom</span> Work Hours
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.workHours || '-'}
              </p>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">work_outline</span> Shift Hours
              </span>
              <p className="text-base font-bold text-on-surface mt-1">
                {selectedRecord?.shiftHours || '8h 30m'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {selectedRecord?.notes ? (
            <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/50 p-4 text-xs text-on-surface-variant">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">info</span>
                <p className="leading-relaxed">{selectedRecord.notes}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isSwipesModalOpen && (
        <SwipesModal
          isOpen={isSwipesModalOpen}
          onClose={() => setIsSwipesModalOpen(false)}
          date={selectedDate}
          employeeId={selectedMemberId}
          employeeName={teamMembers.find((m) => m.id === selectedMemberId)?.name}
        />
      )}
    </div>
  );
}
