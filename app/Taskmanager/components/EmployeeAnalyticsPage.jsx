'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight,
  CalendarDays, 
  CircleCheckBig, 
  Clock3, 
  Loader2, 
  Star, 
  TriangleAlert, 
  UserRoundCheck, 
  FileDown, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Clock, 
  Users, 
  Flag,
  UserPlus
} from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-[#d7e7f9] text-[#1d4581]',
  in_progress: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

const PRIORITY_STYLES = {
  low: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
};

const DUE_TIMING_STYLES = {
  completedWithinTime: 'bg-emerald-100 text-emerald-700',
  completedOnDueTime: 'bg-sky-100 text-sky-700',
  completedLate: 'bg-rose-100 text-rose-700',
  exceededDueDate: 'bg-rose-100 text-rose-700',
  withinDueDate: 'bg-amber-100 text-amber-700',
  noDueDate: 'bg-slate-100 text-slate-600',
  completedTimeUnknown: 'bg-slate-100 text-slate-700',
};

function isDateOnlyValue(value) {
  return typeof value === 'string' && !value.includes('T');
}

function getTaskDueTiming(task) {
  const dueValue = task?.due_date;
  const dueAt = dueValue ? new Date(dueValue) : null;
  const isCompleted = task?.status === 'completed';

  if (!dueAt || Number.isNaN(dueAt.getTime())) {
    return isCompleted
      ? { label: 'Completed (no due date)', className: DUE_TIMING_STYLES.completedWithinTime }
      : { label: 'No due date set', className: DUE_TIMING_STYLES.noDueDate };
  }

  const hasExplicitDueTime = !isDateOnlyValue(dueValue);
  const dueDeadline = new Date(dueAt);

  if (!hasExplicitDueTime) {
    dueDeadline.setHours(23, 59, 59, 999);
  }

  if (isCompleted) {
    const completedAt = task?.updated_at ? new Date(task.updated_at) : null;
    if (!completedAt || Number.isNaN(completedAt.getTime())) {
      return { label: 'Completed (time unknown)', className: DUE_TIMING_STYLES.completedTimeUnknown };
    }

    if (!hasExplicitDueTime) {
      const dueDayStart = new Date(dueAt);
      dueDayStart.setHours(0, 0, 0, 0);

      const dueDayEnd = new Date(dueAt);
      dueDayEnd.setHours(23, 59, 59, 999);

      if (completedAt.getTime() < dueDayStart.getTime()) {
        return { label: 'Completed in time', className: DUE_TIMING_STYLES.completedWithinTime };
      }

      if (completedAt.getTime() > dueDayEnd.getTime()) {
        return { label: 'Completed late', className: DUE_TIMING_STYLES.completedLate };
      }

      return { label: 'Completed on due date', className: DUE_TIMING_STYLES.completedOnDueTime };
    }

    if (completedAt.getTime() < dueDeadline.getTime()) {
      return { label: 'Completed in time', className: DUE_TIMING_STYLES.completedWithinTime };
    }

    if (completedAt.getTime() > dueDeadline.getTime()) {
      return { label: 'Completed late', className: DUE_TIMING_STYLES.completedLate };
    }

    return { label: 'Completed on due date', className: DUE_TIMING_STYLES.completedOnDueTime };
  }

  if (Date.now() > dueDeadline.getTime()) {
    return { label: 'Exceeded due date', className: DUE_TIMING_STYLES.exceededDueDate };
  }

  return { label: 'Within due date', className: DUE_TIMING_STYLES.withinDueDate };
}

function formatDate(value, { includeTime = false } = {}) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString('en-GB', includeTime
    ? {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    : {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
}

function getAvatarInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || 'U';
}

function formatTrackingTime(totalHours) {
  const num = Number(totalHours || 0);
  if (!num || isNaN(num) || num <= 0) return '0 hrs 0 mins';
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  if (hours === 0 && minutes === 0) return '0 hrs 0 mins';
  if (hours === 0) return `${minutes} mins`;
  if (minutes === 0) return `${hours} hrs`;
  return `${hours} hrs ${minutes} mins`;
}

function MetricCard({ icon: Icon, label, value, tone = 'slate' }) {
  const toneConfig = {
    slate: { icon: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100' },
    purple: { icon: 'text-[#1d4581]', bg: 'bg-[#d7e7f9]/60', border: 'border-[#3170c5]/20' },
    sky: { icon: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
    emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    rose: { icon: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    amber: { icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  }[tone] || { icon: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100' };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-xs hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${toneConfig.border} ${toneConfig.bg} ${toneConfig.icon}`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div className="h-7 w-px shrink-0 bg-slate-100"></div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400" title={label}>{label}</p>
          <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 leading-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function EmployeeAnalyticsPage({ employeeId }) {
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadEmployeeAnalytics() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/HRM/api/employees/${employeeId}/analytics`, { method: 'GET' });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load employee analytics');
        }

        if (!isMounted) return;
        setEmployee(result.employee || null);
        setTasks(Array.isArray(result.tasks) ? result.tasks : []);
        setStats(result.stats || null);
        setTicketStats(result.ticketStats || null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError.message || 'Failed to load employee analytics');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEmployeeAnalytics();

    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const monthDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthOptions = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      const dateVal = t.created_at || t.assigned_at;
      if (!dateVal) return;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!map.has(key)) {
        map.set(key, { key, label, count: 0 });
      }
      map.get(key).count += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedMonth === 'All') return tasks;
    return tasks.filter((t) => {
      const dateVal = t.created_at || t.assigned_at;
      if (!dateVal) return false;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return false;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [tasks, selectedMonth]);

  const activeStats = useMemo(() => {
    const now = Date.now();
    const totalAssigned = filteredTasks.length;
    const pending = filteredTasks.filter((task) => task.status === 'pending').length;
    const inProgress = filteredTasks.filter((task) => task.status === 'in_progress').length;
    const completed = filteredTasks.filter((task) => task.status === 'completed').length;
    const overdue = filteredTasks.filter((task) => {
      if (!task?.due_date || task.status === 'completed') return false;
      const dueAt = new Date(task.due_date).getTime();
      return Number.isFinite(dueAt) && dueAt < now;
    }).length;

    const ratedTasks = filteredTasks.filter((task) => typeof task.employee_rating === 'number');
    const totalRatedTasks = ratedTasks.length;
    const avgRating = totalRatedTasks > 0
      ? ratedTasks.reduce((sum, t) => sum + t.employee_rating, 0) / totalRatedTasks
      : (selectedMonth === 'All' ? stats?.averageRating ?? null : null);
    const completionRate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

    const nextDueTask = [...filteredTasks]
      .filter((task) => task?.due_date && task.status !== 'completed')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0] || null;

    return {
      totalAssigned,
      pending,
      inProgress,
      completed,
      overdue,
      completionRate,
      averageRating: avgRating,
      totalRatedTasks,
      nextDueTask,
    };
  }, [filteredTasks, stats, selectedMonth]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((left, right) => {
      const statusOrder = {
        pending: 0,
        in_progress: 1,
        completed: 2,
      };

      const leftStatus = statusOrder[left?.status] ?? 3;
      const rightStatus = statusOrder[right?.status] ?? 3;
      if (leftStatus !== rightStatus) {
        return leftStatus - rightStatus;
      }

      const leftDue = left?.due_date ? new Date(left.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      const rightDue = right?.due_date ? new Date(right.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      if (leftDue !== rightDue) {
        return leftDue - rightDue;
      }

      return String(left?.task_name || '').localeCompare(String(right?.task_name || ''));
    });
  }, [filteredTasks]);

  const employeeName = employee?.name || 'Employee';
  const employeeFirstName = employeeName.trim().split(' ')[0] || 'Employee';
  const employeeTimeLabel = `${employeeFirstName} Time`;

  const handleExport = async () => {
    const ensureXlsxLoaded = () => {
      if (typeof window !== 'undefined' && window.XLSX) return Promise.resolve(window.XLSX);
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load xlsx-js-style'));
        document.head.appendChild(script);
      });
    };

    try {
      const XLSX = await ensureXlsxLoaded();
      const workbook = XLSX.utils.book_new();

      // Border styles
      const thinBorder = {
        top: { style: 'thin', color: { rgb: 'CBD5E1' } },
        bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
        left: { style: 'thin', color: { rgb: 'CBD5E1' } },
        right: { style: 'thin', color: { rgb: 'CBD5E1' } }
      };

      // Styles for Sheet 1: Profile & KPIs
      const titleStyle = {
        font: { bold: true, color: { rgb: '0F172A' }, sz: 14, name: 'Calibri' },
        alignment: { horizontal: 'left', vertical: 'center' }
      };

      const sectionHeaderStyle = {
        fill: { fgColor: { rgb: '1E293B' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11, name: 'Calibri' },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      const keyStyle = {
        fill: { fgColor: { rgb: 'F8FAFC' } },
        font: { bold: true, color: { rgb: '1E293B' }, sz: 10, name: 'Calibri' },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      const valStyle = {
        fill: { fgColor: { rgb: 'FFFFFF' } },
        font: { color: { rgb: '334155' }, sz: 10, name: 'Calibri' },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: thinBorder
      };

      // --- SHEET 1: Profile & KPIs ---
      const sheet1Data = [
        ["Employee Analytics Report", ""],
        ["Filtered Month", selectedMonth !== 'All' ? (monthOptions.find(m => m.key === selectedMonth)?.label || selectedMonth) : 'All Months'],
        [],
        ["Profile Information", ""],
        ["Name", employee?.name || 'N/A'],
        ["Email", employee?.email || 'N/A'],
        ["Employee ID", employee?.employee_id || 'N/A'],
        ["Role", employee?.role || 'N/A'],
        [],
        ["Performance KPIs", ""],
        ["Completion Rate", `${activeStats?.completionRate ?? 0}%`],
        ["Average Rating", activeStats?.averageRating ? activeStats.averageRating.toFixed(1) : 'N/A'],
        ["Total Assigned", activeStats?.totalAssigned ?? 0],
        ["Pending Tasks", activeStats?.pending ?? 0],
        ["In Progress Tasks", activeStats?.inProgress ?? 0],
        ["Completed Tasks", activeStats?.completed ?? 0],
        ["Rated Tasks", activeStats?.totalRatedTasks ?? 0],
        ["Overdue Tasks", activeStats?.overdue ?? 0],
        [],
        ["Support Ticket Metrics", ""],
        ["Ticket Total", ticketStats?.total ?? 0],
        ["Ticket Open", ticketStats?.open ?? 0],
        ["Ticket Late", ticketStats?.late ?? 0],
        ["Ticket Breached", ticketStats?.breached ?? 0],
        ["Avg Resolve Hours", ticketStats?.avgResolutionHours ?? 0]
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
      ws1['!cols'] = [{ wch: 25 }, { wch: 35 }];
      const range1 = XLSX.utils.decode_range(ws1['!ref'] || 'A1');
      for (let r = range1.s.r; r <= range1.e.r; r++) {
        for (let c = range1.s.c; c <= range1.e.c; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          const cell = ws1[addr];
          if (!cell) continue;

          if (r === 0) {
            cell.s = titleStyle;
          } else if (r === 3 || r === 9 || r === 19) {
            cell.s = sectionHeaderStyle;
          } else if (r > 0) {
            cell.s = c === 0 ? keyStyle : valStyle;
          }
        }
      }
      XLSX.utils.book_append_sheet(workbook, ws1, "Profile & KPIs");

      // --- SHEET 2: Assigned Tasks ---
      // Column Order: Task Name, Status, Priority, Assigned At, Due Date, Due Timeline, Progress, Subtasks, Rating, [Employee] Time, Team Time, Assigned By
      const taskHeaders = [
        "Task Name",
        "Status",
        "Priority",
        "Assigned At",
        "Due Date",
        "Due Timeline",
        "Progress",
        "Subtasks",
        "Rating",
        employeeTimeLabel,
        "Team Time",
        "Assigned By"
      ];

      const taskRows = sortedTasks.map(task => {
        const dueTiming = getTaskDueTiming(task);
        const statusLabel = task.status ? String(task.status).replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Pending';
        const priorityLabel = task.priority ? String(task.priority).replace(/\b\w/g, c => c.toUpperCase()) : 'Medium';
        const subtasksLabel = `${task.subtasks_completed || 0}/${task.subtasks_total || 0}`;
        return [
          task.task_name || 'Untitled task',
          statusLabel,
          priorityLabel,
          formatDate(task.assigned_at, { includeTime: true }),
          formatDate(task.due_date, { includeTime: true }),
          dueTiming.label,
          `${task.progress_percentage || 0}%`,
          subtasksLabel,
          typeof task.employee_rating === 'number' ? `${task.employee_rating.toFixed(1)} / 5` : 'Not rated',
          formatTrackingTime(task.employee_logged_hours),
          formatTrackingTime(task.total_logged_hours),
          task.assigned_by || 'Assigned'
        ];
      });

      const ws2 = XLSX.utils.aoa_to_sheet([taskHeaders, ...taskRows]);
      ws2['!cols'] = [
        { wch: 34 }, // 0: Task Name
        { wch: 14 }, // 1: Status
        { wch: 12 }, // 2: Priority
        { wch: 20 }, // 3: Assigned At (left of Due Date)
        { wch: 20 }, // 4: Due Date
        { wch: 24 }, // 5: Due Timeline
        { wch: 14 }, // 6: Progress (Conditional formatted)
        { wch: 14 }, // 7: Subtasks
        { wch: 14 }, // 8: Rating
        { wch: 18 }, // 9: [Employee] Time
        { wch: 18 }, // 10: Team Time
        { wch: 20 }  // 11: Assigned By
      ];

      const taskHeaderStyle = {
        fill: { fgColor: { rgb: '1E293B' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10, name: 'Calibri' },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: '94A3B8' } },
          bottom: { style: 'medium', color: { rgb: '475569' } },
          left: { style: 'thin', color: { rgb: '94A3B8' } },
          right: { style: 'thin', color: { rgb: '94A3B8' } }
        }
      };

      const range2 = XLSX.utils.decode_range(ws2['!ref'] || 'A1');
      for (let r = range2.s.r; r <= range2.e.r; r++) {
        const isHeader = (r === 0);
        const task = !isHeader ? sortedTasks[r - 1] : null;
        const isEven = (r % 2 === 0);
        const baseRowBg = isEven ? 'F8FAFC' : 'FFFFFF';

        for (let c = range2.s.c; c <= range2.e.c; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          const cell = ws2[addr];
          if (!cell) continue;

          if (isHeader) {
            cell.s = taskHeaderStyle;
            continue;
          }

          // Data row styling with rich conditional formatting
          let cellFill = baseRowBg;
          let fontColor = '334155';
          let fontBold = false;
          let horizAlign = 'left';

          if (c === 0) {
            // Task Name
            fontBold = true;
            fontColor = '0F172A';
            horizAlign = 'left';
          } else if (c === 1) {
            // Status: Conditional badge fill
            horizAlign = 'center';
            fontBold = true;
            const statusKey = String(task?.status || '').toLowerCase();
            if (statusKey === 'completed') {
              cellFill = 'DEF7EC'; // Emerald light
              fontColor = '03543F';
            } else if (statusKey === 'in_progress') {
              cellFill = 'E1EFFE'; // Sky light
              fontColor = '1E429F';
            } else {
              cellFill = 'FEF08A'; // Yellow light
              fontColor = '713F12';
            }
          } else if (c === 2) {
            // Priority
            horizAlign = 'center';
            const priorityKey = String(task?.priority || '').toLowerCase();
            if (priorityKey === 'high' || priorityKey === 'urgent') {
              cellFill = 'FDE8E8'; // Rose light
              fontColor = '9B1C1C';
              fontBold = true;
            } else if (priorityKey === 'medium') {
              cellFill = 'FEF3C7'; // Amber light
              fontColor = '92400E';
            } else {
              cellFill = 'F3F4F6'; // Slate light
              fontColor = '374151';
            }
          } else if (c === 3 || c === 4) {
            // Assigned At & Due Date
            horizAlign = 'center';
            fontColor = '475569';
          } else if (c === 5) {
            // Due Timeline: Conditional formatting
            horizAlign = 'center';
            const dueTiming = getTaskDueTiming(task);
            const labelLower = dueTiming.label.toLowerCase();
            if (labelLower.includes('in time') || labelLower.includes('within time') || labelLower.includes('on due')) {
              cellFill = 'DEF7EC';
              fontColor = '03543F';
              fontBold = true;
            } else if (labelLower.includes('late') || labelLower.includes('exceeded')) {
              cellFill = 'FDE8E8';
              fontColor = '9B1C1C';
              fontBold = true;
            } else if (labelLower.includes('within due')) {
              cellFill = 'FEF3C7';
              fontColor = '92400E';
            } else {
              fontColor = '64748B';
            }
          } else if (c === 6) {
            // PROGRESS COLUMN: High-priority conditional formatting
            horizAlign = 'center';
            fontBold = true;
            const progressNum = Number(task?.progress_percentage || 0);
            if (progressNum === 100) {
              cellFill = 'D1FAE5'; // Rich emerald 100
              fontColor = '065F46'; // Emerald 800
            } else if (progressNum >= 75) {
              cellFill = 'E0F2FE'; // Sky 100
              fontColor = '0369A1'; // Sky 700
            } else if (progressNum >= 50) {
              cellFill = 'EEF2FF'; // Indigo 100
              fontColor = '3730A3'; // Indigo 800
            } else if (progressNum >= 25) {
              cellFill = 'FEF3C7'; // Amber 100
              fontColor = '92400E'; // Amber 800
            } else if (progressNum > 0) {
              cellFill = 'FFEDD5'; // Orange 100
              fontColor = 'C2410C'; // Orange 700
            } else {
              cellFill = 'F1F5F9'; // Slate 100
              fontColor = '64748B'; // Slate 500
            }
          } else if (c === 7) {
            // Subtasks
            horizAlign = 'center';
            fontColor = '475569';
          } else if (c === 8) {
            // Rating
            horizAlign = 'center';
            if (typeof task?.employee_rating === 'number') {
              cellFill = 'FFFBEB';
              fontColor = 'B45309';
              fontBold = true;
            } else {
              fontColor = '94A3B8';
            }
          } else if (c === 9) {
            // Employee Time (e.g. Anjali Time)
            horizAlign = 'center';
            cellFill = 'EFF6FF'; // Soft blue
            fontColor = '1D4ED8'; // Blue 700
            fontBold = true;
          } else if (c === 10) {
            // Team Time
            horizAlign = 'center';
            cellFill = 'F8FAFC';
            fontColor = '334155';
          } else {
            // Assigned By
            horizAlign = 'left';
            fontColor = '334155';
          }

          cell.s = {
            fill: { fgColor: { rgb: cellFill } },
            font: { bold: fontBold, color: { rgb: fontColor }, sz: 10, name: 'Calibri' },
            alignment: { horizontal: horizAlign, vertical: 'center' },
            border: thinBorder
          };
        }
      }

      XLSX.utils.book_append_sheet(workbook, ws2, "Assigned Tasks");

      // Write File
      XLSX.writeFile(workbook, `employee_analytics_${employee?.name ? employee.name.toLowerCase().replace(/\s+/g, '_') : 'report'}.xlsx`);
    } catch (err) {
      console.error('Failed to export to Excel:', err);
      alert('Failed to export data to Excel.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading employee analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 md:px-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <div className="flex items-start gap-3 text-red-700">
            <TriangleAlert size={20} className="mt-0.5" />
            <div>
              <h1 className="text-lg font-semibold">Failed to load employee analytics</h1>
              <p className="mt-1 text-sm">{error}</p>
              <Link href="/Taskmanager/admin/team" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline">
                <ArrowLeft size={14} />
                Back to Team Members
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avatarSrc = employee?.profile_picture_url || null;
  const nextDue = activeStats?.nextDueTask || stats?.nextDueTask;
  const nextDueLabel = nextDue?.due_date ? formatDate(nextDue.due_date, { includeTime: true }) : 'No upcoming due date';

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 md:px-10">
      <div className="mx-auto max-w-[1560px] space-y-7">
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/Taskmanager/admin/team" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} />
              Back to Team Members
            </Link>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <FileDown size={16} />
              Export to Excel
            </button>

            {/* Month Filter Dropdown */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                type="button"
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer ${
                  selectedMonth !== 'All'
                    ? 'border-[#3170c5] bg-[#3170c5]/10 text-[#1d4581]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <CalendarIcon size={15} className={selectedMonth !== 'All' ? 'text-[#3170c5]' : 'text-slate-600'} />
                <span>
                  {selectedMonth === 'All'
                    ? 'Month'
                    : monthOptions.find((m) => m.key === selectedMonth)?.label || selectedMonth}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${selectedMonth !== 'All' ? 'bg-[#3170c5] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {filteredTasks.length}
                </span>
                <ChevronDown size={14} className={selectedMonth !== 'All' ? 'text-[#3170c5]' : 'text-slate-500'} />
              </button>

              {showMonthDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl z-30 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2 font-bold text-slate-700">
                    <span>Filter by Creation Month</span>
                    {selectedMonth !== 'All' && (
                      <button
                        onClick={() => { setSelectedMonth('All'); setShowMonthDropdown(false); }}
                        className="text-[#3170c5] text-[11px] font-semibold hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setSelectedMonth('All'); setShowMonthDropdown(false); }}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 font-medium transition-colors hover:bg-slate-50 cursor-pointer ${
                      selectedMonth === 'All' ? 'bg-[#3170c5]/10 font-bold text-[#1d4581]' : 'text-slate-700'
                    }`}
                  >
                    <span>All Months</span>
                    <span className="text-[11px] text-slate-400 font-normal">{tasks.length} tasks</span>
                  </button>
                  {monthOptions.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => { setSelectedMonth(m.key); setShowMonthDropdown(false); }}
                      className={`flex w-full items-center justify-between px-3.5 py-2.5 font-medium transition-colors hover:bg-slate-50 cursor-pointer ${
                        selectedMonth === m.key ? 'bg-[#3170c5]/10 font-bold text-[#1d4581]' : 'text-slate-700'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${selectedMonth === m.key ? 'bg-[#3170c5] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {m.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Next due: <span className="font-semibold text-slate-800">{nextDueLabel}</span>
          </div>
        </div>

        {/* Profile Card Banner */}
        <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#334155_100%)] px-8 py-10 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-3xl font-bold">
                  {avatarSrc ? (
                    <Image src={avatarSrc} alt={employeeName} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                  ) : (
                    <span>{getAvatarInitial(employeeName)}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Employee Analytics</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">{employeeName}</h1>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
                    <span className="rounded-full bg-white/10 px-3 py-1">{employee?.role || 'Employee'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{employee?.email || 'No email'}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">Employee ID: {employee?.employee_id || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Completion Rate</p>
                  <p className="mt-2 text-4xl font-bold text-white">{activeStats?.completionRate ?? 0}%</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Avg Rating</p>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {activeStats?.averageRating ? activeStats.averageRating.toFixed(1) : 'N/A'}
                    <span className="ml-2 text-2xl align-middle">⭐</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 ROWS ONLY FOR KPIS */}
        {/* Row 1: Task KPIs (6 Columns) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard icon={UserRoundCheck} label="Total Assigned" value={activeStats?.totalAssigned ?? 0} tone="slate" />
          <MetricCard icon={Clock3} label="Pending" value={activeStats?.pending ?? 0} tone="purple" />
          <MetricCard icon={CalendarDays} label="In Progress" value={activeStats?.inProgress ?? 0} tone="sky" />
          <MetricCard icon={CircleCheckBig} label="Completed" value={activeStats?.completed ?? 0} tone="emerald" />
          <MetricCard icon={Star} label="Rated Tasks" value={activeStats?.totalRatedTasks ?? 0} tone="amber" />
          <MetricCard icon={TriangleAlert} label="Overdue" value={activeStats?.overdue ?? 0} tone="rose" />
        </section>

        {/* Row 2: Ticket KPIs (5 Columns) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricCard icon={UserRoundCheck} label="Ticket Total" value={ticketStats?.total ?? 0} tone="slate" />
          <MetricCard icon={Clock3} label="Ticket Open" value={ticketStats?.open ?? 0} tone="purple" />
          <MetricCard icon={TriangleAlert} label="Ticket Late" value={ticketStats?.late ?? 0} tone="amber" />
          <MetricCard icon={TriangleAlert} label="Ticket Breached" value={ticketStats?.breached ?? 0} tone="rose" />
          <MetricCard icon={CircleCheckBig} label="Avg Resolve Hrs" value={ticketStats?.avgResolutionHours ?? 0} tone="emerald" />
        </section>

        {/* KANBAN BOARD VIEW (Replacing the 3 horizontal cards) */}
        <section className="min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'pending', label: 'To Do', pillColor: 'bg-[#1e293b]' },
              { key: 'in_progress', label: 'In Progress', pillColor: 'bg-[#0070c0]' },
              { key: 'completed', label: 'Completed', pillColor: 'bg-[#039855]' }
            ].map((column) => {
              const columnTasks = sortedTasks.filter((t) => t.status === column.key);
              return (
                <div key={column.key} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 flex flex-col min-h-[480px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${column.pillColor}`}>
                      {column.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Scrollable Column Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {columnTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/Taskmanager/admin/tasks/${task.id}`}
                        className="group block w-full rounded-2xl border border-slate-200 p-4 text-left transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer"
                      >
                        {/* Title and arrow on right */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-slate-800 leading-snug break-words group-hover:text-[#3170c5]">
                              {task.task_name}
                            </h4>
                          </div>
                          <ArrowRight size={14} className="mt-0.5 shrink-0 text-slate-400 group-hover:text-[#3170c5] transition-colors" />
                        </div>

                        {/* Bottom row: Assignee Avatar, Due Date pill, Priority flag */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                          {/* Assignee Avatar */}
                          <div className="flex -space-x-1.5 items-center">
                            {avatarSrc ? (
                              <Image
                                src={avatarSrc}
                                width={24}
                                height={24}
                                alt={employeeName}
                                className="w-6 h-6 rounded-full border border-white object-cover shadow-sm"
                                unoptimized
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-white bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center shadow-sm">
                                {getAvatarInitial(employeeName)}
                              </div>
                            )}
                          </div>

                          {/* Due Date Indicator */}
                          <div className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 border ${
                            task.due_date
                              ? 'bg-slate-50 text-slate-600 border-slate-100'
                              : 'bg-slate-50/50 text-slate-400 border-dashed border-slate-200'
                          }`}>
                            <CalendarIcon size={12} className="text-slate-400" />
                            <span>{task.due_date ? formatDate(task.due_date, { includeTime: true }) : 'No date'}</span>
                          </div>

                          {/* Priority Flag */}
                          {(() => {
                            const priority = String(task.priority || 'medium').toLowerCase();
                            if (priority === 'high' || priority === 'urgent') {
                              return (
                                <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 font-medium">
                                  <Flag size={12} className="fill-rose-500 text-rose-500" />
                                  <span>High</span>
                                </div>
                              );
                            }
                            if (priority === 'medium') {
                              return (
                                <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 font-medium">
                                  <Flag size={12} className="fill-amber-500 text-amber-500" />
                                  <span>Medium</span>
                                </div>
                              );
                            }
                            return (
                              <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-slate-50 text-slate-600 border border-slate-100">
                                <Flag size={12} className="text-slate-400" />
                                <span>Low</span>
                              </div>
                            );
                          })()}
                        </div>
                      </Link>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-400">
                        No tasks here.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Assigned Tasks Table */}
        <section className="min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Assigned Tasks</h2>
                <p className="mt-1 text-sm text-slate-500">Pending work appears first, followed by due-date priority and employee performance details.</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedMonth !== 'All' && (
                  <button
                    onClick={() => setSelectedMonth('All')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#3170c5]/10 px-3 py-1 text-xs font-semibold text-[#1d4581] hover:bg-[#3170c5]/20 cursor-pointer transition-colors"
                    title="Clear month filter"
                  >
                    <span>{monthOptions.find((m) => m.key === selectedMonth)?.label || selectedMonth}</span>
                    <span className="text-sm leading-none">&times;</span>
                  </button>
                )}
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {sortedTasks.length} tasks
                </div>
              </div>
            </div>

            {sortedTasks.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                {selectedMonth !== 'All'
                  ? `No tasks found for ${monthOptions.find((m) => m.key === selectedMonth)?.label || selectedMonth}.`
                  : 'No assigned tasks found for this employee.'}
              </div>
            ) : (
              <div className="mt-6 w-full overflow-x-auto">
                <table className="w-full min-w-[1380px] divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                      <th className="pb-3 pr-6 font-semibold min-w-[220px]">Task</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[110px]">Status</th>
                      <th className="pb-3 pr-8 font-semibold min-w-[175px]">Assigned At</th>
                      <th className="pb-3 pr-8 font-semibold min-w-[175px]">Due</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[160px]">Due Timeline</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[110px]">Progress</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[100px]">Rating</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[130px]">{employeeTimeLabel}</th>
                      <th className="pb-3 pr-6 font-semibold min-w-[130px]">Team Time</th>
                      <th className="pb-3 font-semibold min-w-[140px]">Assigned By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedTasks.map((task) => {
                      const dueTiming = getTaskDueTiming(task);

                      return (
                        <tr key={task.id} className="align-top">
                          <td className="py-4 pr-6">
                            <div>
                              <Link href={`/Taskmanager/admin/tasks/${task.id}`} className="wrap-break-word font-semibold text-slate-900 hover:text-[#3170c5]">
                                {task.task_name}
                              </Link>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
                                  {task.priority} priority
                                </span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                  {task.subtasks_completed || 0}/{task.subtasks_total || 0} subtasks
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-6">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${STATUS_STYLES[task.status] || STATUS_STYLES.pending}`}>
                              {String(task.status || 'pending').replace('_', ' ')}
                            </span>
                          </td>
                          {/* Assigned At - Placed left of Due Date with generous spacing */}
                          <td className="py-4 pr-8 text-slate-700 whitespace-nowrap font-medium">
                            {formatDate(task.assigned_at, { includeTime: true })}
                          </td>
                          {/* Due Date with generous spacing */}
                          <td className="py-4 pr-8 text-slate-700 whitespace-nowrap font-medium">
                            {formatDate(task.due_date, { includeTime: true })}
                          </td>
                          <td className="py-4 pr-6">
                            <span className={`inline-block max-w-full whitespace-normal rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ${dueTiming.className}`}>
                              {dueTiming.label}
                            </span>
                          </td>
                          <td className="py-4 pr-6">
                            <div className="w-24">
                              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                <span>{task.progress_percentage || 0}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100">
                                <div
                                  className="h-2 rounded-full bg-[#3170c5]"
                                  style={{ width: `${task.progress_percentage || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-6">
                            {typeof task.employee_rating === 'number' ? (
                              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                {task.employee_rating.toFixed(1)} / 5
                              </span>
                            ) : (
                              <span className="text-slate-400">Not rated</span>
                            )}
                          </td>
                          {/* Dedicated Employee Logged Hours */}
                          <td className="py-4 pr-6">
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#3170c5]/10 px-2.5 py-1 text-slate-800">
                              <Clock size={13} className="text-[#3170c5] shrink-0" />
                              <span className="font-semibold text-xs whitespace-nowrap text-[#1d4581]">
                                {formatTrackingTime(task.employee_logged_hours)}
                              </span>
                            </div>
                          </td>
                          {/* Total Team Logged Hours on this task */}
                          <td className="py-4 pr-6">
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">
                              <Users size={13} className="text-slate-500 shrink-0" />
                              <span className="font-medium text-xs whitespace-nowrap text-slate-700">
                                {formatTrackingTime(task.total_logged_hours)}
                              </span>
                            </div>
                          </td>
                          <td className="wrap-break-word py-4 text-slate-700">{task.assigned_by || 'Assigned'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
