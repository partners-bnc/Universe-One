'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Info, 
  Star, 
  TrendingUp, 
  Users, 
  Home, 
  Layers, 
  Calendar as CalendarIcon, 
  Trello, 
  Clock, 
  Plus, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  ArrowUpDown, 
  EyeOff, 
  Eye, 
  ChevronDown, 
  ChevronRight, 
  Share2, 
  Zap, 
  CheckSquare, 
  Square, 
  MoreHorizontal, 
  Paperclip, 
  SlidersHorizontal,
  ChevronUp,
  ChevronLeft,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  Play,
  UserPlus,
  Briefcase,
  Flag,
  ArrowRight,
  X
} from 'lucide-react';
import { useData } from './DataContext';

const normalizeLabelValue = (value) => String(value || '').trim().toLowerCase();

export default function ManageTasks({ onNavigate }) {
  const router = useRouter();
  const { tasks, users, taskLabels, isAdminMode, updateTaskStatus } = useData();

  // State Management
  const [activeView, setActiveView] = useState('main'); // 'main' (Table) | 'gantt' | 'milestones' | 'kanban' | 'card' | 'time'
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [labelFilter, setLabelFilter] = useState('All');
  const [createdByFilter, setCreatedByFilter] = useState('All');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  
  // Dropdown States
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showHideDropdown, setShowHideDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  
  // Collapsing and Dropdowns
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [activeDropdownTaskId, setActiveDropdownTaskId] = useState(null);
  const [navigatingTaskId, setNavigatingTaskId] = useState(null);
  
  // Sorting & Column Visibility
  const [sortBy, setSortBy] = useState('status'); // 'status' (default) | 'dueDate' | 'title' | 'priority' | 'progress' | 'member' | 'trackingTime' | 'recentCreated' | 'upcomingDue' | 'oldestCreated'
  const [hideCompleted, setHideCompleted] = useState(false);
  const [hideProgress, setHideProgress] = useState(false);
  const [hideTrackingTime, setHideTrackingTime] = useState(false);

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedActiveView = localStorage.getItem('tm_activeView');
      const storedSearchQuery = localStorage.getItem('tm_searchQuery');
      const storedEmployeeFilter = localStorage.getItem('tm_employeeFilter');
      const storedStatusFilter = localStorage.getItem('tm_statusFilter');
      const storedPriorityFilter = localStorage.getItem('tm_priorityFilter');
      const storedLabelFilter = localStorage.getItem('tm_labelFilter');
      const storedCreatedByFilter = localStorage.getItem('tm_createdByFilter');
      const storedOwnershipFilter = localStorage.getItem('tm_ownershipFilter');
      const storedSortBy = localStorage.getItem('tm_sortBy');
      const storedHideCompleted = localStorage.getItem('tm_hideCompleted');

      if (storedActiveView) setActiveView(storedActiveView);
      if (storedSearchQuery !== null) setSearchQuery(storedSearchQuery);
      if (storedEmployeeFilter) setEmployeeFilter(storedEmployeeFilter);
      if (storedStatusFilter) setStatusFilter(storedStatusFilter);
      if (storedPriorityFilter) setPriorityFilter(storedPriorityFilter);
      if (storedLabelFilter) setLabelFilter(storedLabelFilter);
      if (storedCreatedByFilter) setCreatedByFilter(storedCreatedByFilter);
      if (storedOwnershipFilter) setOwnershipFilter(storedOwnershipFilter);
      if (storedSortBy) setSortBy(storedSortBy);
      if (storedHideCompleted !== null) setHideCompleted(storedHideCompleted === 'true');
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_activeView', activeView);
    }
  }, [activeView, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_searchQuery', searchQuery);
    }
  }, [searchQuery, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_employeeFilter', employeeFilter);
    }
  }, [employeeFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_statusFilter', statusFilter);
    }
  }, [statusFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_priorityFilter', priorityFilter);
    }
  }, [priorityFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_labelFilter', labelFilter);
    }
  }, [labelFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_createdByFilter', createdByFilter);
    }
  }, [createdByFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_ownershipFilter', ownershipFilter);
    }
  }, [ownershipFilter, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_sortBy', sortBy);
    }
  }, [sortBy, hasHydrated]);

  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('tm_hideCompleted', String(hideCompleted));
    }
  }, [hideCompleted, hasHydrated]);

  // Dropdown States for Date Filter
  const [showDateSortDropdown, setShowDateSortDropdown] = useState(false);

  // References to close dropdowns
  const filtersRef = useRef(null);
  const sortRef = useRef(null);
  const hideRef = useRef(null);
  const employeeRef = useRef(null);
  const dateSortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) setShowFiltersDropdown(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortDropdown(false);
      if (hideRef.current && !hideRef.current.contains(event.target)) setShowHideDropdown(false);
      if (employeeRef.current && !employeeRef.current.contains(event.target)) setShowEmployeeDropdown(false);
      if (dateSortRef.current && !dateSortRef.current.contains(event.target)) setShowDateSortDropdown(false);
      if (activeDropdownTaskId && !event.target.closest('.status-selector-cell')) setActiveDropdownTaskId(null);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownTaskId]);

  // Color mappings
  const getPriorityColor = (p) => {
    switch (p) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColorBlock = (s) => {
    switch (s) {
      case 'Completed': return 'bg-[#54D39B]';
      case 'In Progress': return 'bg-[#FBBF24]';
      case 'Stuck': return 'bg-[#F87171]';
      case 'In Review': return 'bg-[#60A5FA]';
      default: return 'bg-[#94A3B8]'; // Pending / To Do
    }
  };

  const getProgressColor = (s) => {
    switch (s) {
      case 'Completed': return '#54D39B';
      case 'In Progress': return '#FBBF24';
      case 'Stuck': return '#F87171';
      case 'In Review': return '#60A5FA';
      default: return '#94A3B8';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Pending') return 'To Do';
    return status;
  };

  const getUserById = (id) => users.find((u) => u.id === id);

  // Grouping logic (by month)
  const getTaskMonthGroup = (task) => {
    if (!task.dueDate) return 'Later / Other';
    const datePart = task.dueDate.split(',')[0];
    const d = new Date(datePart);
    if (isNaN(d.getTime())) return 'Later / Other';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const taskYear = d.getFullYear();
    const taskMonth = d.getMonth();

    if (taskYear === currentYear && taskMonth === currentMonth) {
      return 'This month';
    } else if (
      (taskYear === currentYear && taskMonth === currentMonth + 1) ||
      (taskYear === currentYear + 1 && currentMonth === 11 && taskMonth === 0)
    ) {
      return 'Next Month';
    } else {
      return 'Later / Other';
    }
  };

  // Tracking Time Calculator logic:
  // Uses total logged hours submitted by employees in their Daily Work Logs
  const getCalculatedTrackingTimeMs = (task) => {
    const totalHours = Number(task.total_logged_hours ?? task.totalLoggedHours ?? 0);
    return Math.max(0, totalHours * 3600 * 1000);
  };

  const getCalculatedTrackingTime = (task) => {
    const totalHours = Number(task.total_logged_hours ?? task.totalLoggedHours ?? 0);
    if (!totalHours || isNaN(totalHours) || totalHours <= 0) {
      return '0 hrs 0 mins';
    }
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    if (hours === 0 && minutes === 0) {
      return '0 hrs 0 mins';
    }
    if (hours === 0) {
      return `${minutes} mins`;
    }
    if (minutes === 0) {
      return `${hours} hrs`;
    }
    return `${hours} hrs ${minutes} mins`;
  };

  const formatDateTime = (dateVal) => {
    if (!dateVal) return '—';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return String(dateVal);
    
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Options lists
  const mergedLabelOptions = useMemo(() => {
    return Array.from(
      new Map(
        [...taskLabels, ...tasks.map((task) => task.label).filter(Boolean)]
          .map((label) => [normalizeLabelValue(label), String(label).trim()])
          .filter(([key, value]) => key && value)
      ).values()
    ).sort((left, right) => left.localeCompare(right));
  }, [taskLabels, tasks]);

  const createdByOptions = useMemo(() => {
    return Array.from(
      new Map(
        tasks
          .map((task) => String(task.createdBy || '').trim())
          .filter(Boolean)
          .map((name) => [name.toLowerCase(), name])
      ).values()
    ).sort((left, right) => left.localeCompare(right));
  }, [tasks]);

  const isFilterActive = useMemo(() => {
    return (
      statusFilter !== 'All' ||
      priorityFilter !== 'All' ||
      labelFilter !== 'All' ||
      createdByFilter !== 'All' ||
      ownershipFilter !== 'all' ||
      employeeFilter !== 'All' ||
      searchQuery !== '' ||
      hideCompleted !== false
    );
  }, [statusFilter, priorityFilter, labelFilter, createdByFilter, ownershipFilter, employeeFilter, searchQuery, hideCompleted]);

  const handleClearAllFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setLabelFilter('All');
    setCreatedByFilter('All');
    setOwnershipFilter('all');
    setEmployeeFilter('All');
    setSearchQuery('');
    setHideCompleted(false);
  };

  // Filtering & Sorting Logic
  const displayTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchesLabel = labelFilter === 'All' || normalizeLabelValue(task.label) === normalizeLabelValue(labelFilter);
      const matchesCreatedBy = createdByFilter === 'All' || String(task.createdBy || '').trim().toLowerCase() === String(createdByFilter).trim().toLowerCase();
      
      const matchesOwnership = (() => {
        if (ownershipFilter === 'assigned_to_me') return task.isAssignedToCurrentUser;
        if (ownershipFilter === 'assigned_by_me') return task.isAssignedByCurrentUser;
        return true;
      })();

      const matchesSearch = !searchQuery || 
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEmployee = employeeFilter === 'All' || task.assignees.includes(employeeFilter);

      const matchesHide = !hideCompleted || task.status !== 'Completed';

      return matchesStatus && matchesPriority && matchesLabel && matchesCreatedBy && matchesOwnership && matchesSearch && matchesEmployee && matchesHide;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'progress') {
        return (b.progressPercentage || 0) - (a.progressPercentage || 0);
      }
      if (sortBy === 'priority') {
        const priorities = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorities[b.priority] || 0) - (priorities[a.priority] || 0);
      }
      if (sortBy === 'status') {
        const statusOrder = { 'In Progress': 1, 'Pending': 2, 'Completed': 3, 'In Review': 4, 'Stuck': 5 };
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }
      if (sortBy === 'member') {
        return b.assignees.length - a.assignees.length;
      }
      if (sortBy === 'trackingTime') {
        return getCalculatedTrackingTimeMs(b) - getCalculatedTrackingTimeMs(a);
      }
      if (sortBy === 'recentCreated') {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da; // Descending (recent first)
      }
      if (sortBy === 'upcomingDue') {
        const da = a.dueDate ? new Date(a.dueDate.split(',')[0]).getTime() : 8640000000000000;
        const db = b.dueDate ? new Date(b.dueDate.split(',')[0]).getTime() : 8640000000000000;
        return da - db; // Ascending (closest due first)
      }
      if (sortBy === 'oldestCreated') {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return da - db; // Ascending (oldest first)
      }
      // Default: Due date
      const da = new Date(a.dueDate?.split(',')[0] || 0);
      const db = new Date(b.dueDate?.split(',')[0] || 0);
      return da - db;
    });
  }, [tasks, statusFilter, priorityFilter, labelFilter, createdByFilter, ownershipFilter, searchQuery, employeeFilter, hideCompleted, sortBy]);

  // Next.js Route Prefetcher for instant loading on click
  useEffect(() => {
    displayTasks.forEach((task) => {
      const path = isAdminMode ? `/Taskmanager/admin/tasks/${task.id}` : `/Taskmanager/dashboard/tasks/${task.id}`;
      router.prefetch(path);
    });
  }, [displayTasks, isAdminMode, router]);

  // Grouped tasks by month
  const groupedTasks = useMemo(() => {
    const groups = {
      'This month': [],
      'Next Month': [],
      'Later / Other': []
    };
    displayTasks.forEach((task) => {
      const g = getTaskMonthGroup(task);
      groups[g].push(task);
    });
    return groups;
  }, [displayTasks]);

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  const openTaskDetail = (taskId) => {
    setNavigatingTaskId(taskId);
    const path = isAdminMode ? `/Taskmanager/admin/tasks/${taskId}` : `/Taskmanager/dashboard/tasks/${taskId}`;
    router.push(path);
  };

  const handleNewTaskClick = () => {
    if (onNavigate) {
      onNavigate('create-task');
    } else {
      router.push(isAdminMode ? '/Taskmanager/admin/tasks/create' : '/Taskmanager/dashboard/tasks/create');
    }
  };

  // Toggle helper for header sorting click
  const toggleHeaderSort = (key) => {
    setSortBy(prev => (prev === key ? 'dueDate' : key));
  };

  const ganttScrollRef = useRef(null);

  const parseTaskDate = (dateVal) => {
    if (!dateVal) return null;
    if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
    const directDate = new Date(dateVal);
    if (!isNaN(directDate.getTime())) return directDate;

    const clean = String(dateVal).split(',')[0].trim();
    const parts = clean.split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1];
      const year = parseInt(parts[2], 10);
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIdx = monthNames.findIndex((m) => monthStr.toLowerCase().startsWith(m));
      if (!isNaN(day) && monthIdx !== -1 && !isNaN(year)) {
        return new Date(year, monthIdx, day);
      }
    }
    return null;
  };

  // Build continuous multi-month Gantt timeline
  const ganttTimelineData = useMemo(() => {
    const DAY_WIDTH = 42; // width of each day column in px
    const now = new Date();
    let minDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let maxDate = new Date(now.getFullYear(), now.getMonth() + 3, 0);

    // Find earliest and latest date among tasks
    displayTasks.forEach((t) => {
      const start = parseTaskDate(t.createdAt || t.startDate);
      const end = parseTaskDate(t.dueDate);
      if (start && start < minDate) minDate = new Date(start.getFullYear(), start.getMonth(), 1);
      if (end && end > maxDate) maxDate = new Date(end.getFullYear(), end.getMonth() + 1, 0);
    });

    const startYear = minDate.getFullYear();
    const startMonth = minDate.getMonth();
    const timelineStart = new Date(startYear, startMonth, 1);

    const endYear = maxDate.getFullYear();
    const endMonth = maxDate.getMonth();
    const timelineEnd = new Date(endYear, endMonth + 1, 0);

    const months = [];
    const allDays = [];
    let cur = new Date(timelineStart);

    while (cur <= timelineEnd) {
      const y = cur.getFullYear();
      const m = cur.getMonth();
      const monthName = cur.toLocaleString('default', { month: 'short', year: 'numeric' });
      const daysInThisMonth = new Date(y, m + 1, 0).getDate();
      const monthStartIndex = allDays.length;

      const monthDays = [];
      for (let d = 1; d <= daysInThisMonth; d++) {
        const dayDate = new Date(y, m, d);
        const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'narrow' });
        const isToday = dayDate.toDateString() === now.toDateString();
        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
        const dayObj = {
          date: dayDate,
          dayNum: d,
          dayName,
          isToday,
          isWeekend,
          index: allDays.length,
        };
        monthDays.push(dayObj);
        allDays.push(dayObj);
      }

      months.push({
        name: monthName,
        year: y,
        month: m,
        daysCount: daysInThisMonth,
        startIndex: monthStartIndex,
        days: monthDays,
      });

      cur = new Date(y, m + 1, 1);
    }

    const totalDays = allDays.length;
    const totalWidth = totalDays * DAY_WIDTH;

    // Precalculate placement for each task
    const taskPlacements = displayTasks.map((t) => {
      let start = parseTaskDate(t.createdAt || t.startDate);
      let end = parseTaskDate(t.dueDate);

      if (!start) start = now;
      if (!end) end = new Date(start.getTime() + 7 * 24 * 3600 * 1000);
      if (end < start) end = start;

      const diffStartMs = start.getTime() - timelineStart.getTime();
      const startDayIndex = Math.max(0, Math.floor(diffStartMs / (1000 * 60 * 60 * 24)));

      const diffEndMs = end.getTime() - timelineStart.getTime();
      const endDayIndex = Math.max(startDayIndex, Math.floor(diffEndMs / (1000 * 60 * 60 * 24)));

      const spanDays = Math.max(1, (endDayIndex - startDayIndex) + 1);

      const leftPx = startDayIndex * DAY_WIDTH;
      const widthPx = Math.max(DAY_WIDTH, spanDays * DAY_WIDTH);

      return {
        taskId: t.id,
        leftPx,
        widthPx,
        startFormatted: start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endFormatted: end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
    });

    const placementsMap = new Map(taskPlacements.map((p) => [p.taskId, p]));

    const todayIndex = allDays.findIndex((d) => d.isToday);
    const todayLeftPx = todayIndex !== -1 ? todayIndex * DAY_WIDTH + (DAY_WIDTH / 2) : null;

    return {
      DAY_WIDTH,
      months,
      allDays,
      totalDays,
      totalWidth,
      placementsMap,
      todayLeftPx,
      timelineStart,
      timelineEnd,
    };
  }, [displayTasks]);

  const [selectedGanttMonthIndex, setSelectedGanttMonthIndex] = useState(0);

  // Sync selected month index with current month or timeline updates
  useEffect(() => {
    if (ganttTimelineData.months && ganttTimelineData.months.length > 0) {
      const now = new Date();
      const currentMonthIndex = ganttTimelineData.months.findIndex(
        (m) => m.year === now.getFullYear() && m.month === now.getMonth()
      );
      if (currentMonthIndex !== -1) {
        setSelectedGanttMonthIndex(currentMonthIndex);
      }
    }
  }, [ganttTimelineData.months]);

  const handleSelectGanttMonth = (startIndex, idx) => {
    setSelectedGanttMonthIndex(idx);
    if (ganttScrollRef.current) {
      ganttScrollRef.current.scrollTo({
        left: startIndex * ganttTimelineData.DAY_WIDTH,
        behavior: 'smooth',
      });
    }
  };

  const stepGanttMonth = (direction) => {
    const nextIdx = Math.max(0, Math.min(ganttTimelineData.months.length - 1, selectedGanttMonthIndex + direction));
    const targetMonth = ganttTimelineData.months[nextIdx];
    if (targetMonth) {
      handleSelectGanttMonth(targetMonth.startIndex, nextIdx);
    }
  };

  const scrollToToday = () => {
    if (ganttScrollRef.current && ganttTimelineData.todayLeftPx !== null) {
      ganttScrollRef.current.scrollTo({
        left: Math.max(0, ganttTimelineData.todayLeftPx - 150),
        behavior: 'smooth',
      });
      const now = new Date();
      const currentMonthIndex = ganttTimelineData.months.findIndex(
        (m) => m.year === now.getFullYear() && m.month === now.getMonth()
      );
      if (currentMonthIndex !== -1) {
        setSelectedGanttMonthIndex(currentMonthIndex);
      }
    }
  };

  const scrollGanttBy = (offsetPx) => {
    if (ganttScrollRef.current) {
      ganttScrollRef.current.scrollBy({
        left: offsetPx,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* ════ HEADER SECTION ════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
        <div className="flex items-start gap-3">
          <Briefcase size={28} className="text-[#3170c5] stroke-[1.8] shrink-0 mt-0.5" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-none">Projects</h1>
            <p className="text-xs text-slate-500 font-medium mt-1.5">
              Manage projects by assigning owners, setting timelines, and tracking progress.
            </p>
          </div>
        </div>
        
        {/* Top-Right Panel Actions */}
        <div className="flex items-center gap-2">
          <button className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer">
            <TrendingUp size={15} className="text-black" />
            <span>Activity</span>
          </button>
          <button className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer">
            <Users size={15} className="text-black" />
            <span>Member</span>
          </button>
          <button className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-850 rounded-full transition-colors cursor-pointer">
            <MoreHorizontal size={15} className="text-black" />
          </button>
        </div>
      </div>

      {/* ════ TAB VIEW SWITCHER ════ */}
      <div className="flex justify-between items-center border-b border-slate-200 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex gap-4">
          {[
            { id: 'main', label: 'Main View', icon: Home },
            { id: 'card', label: 'Card view', icon: LayoutGrid },
            { id: 'gantt', label: 'Gantt view', icon: Layers },
            { id: 'milestones', label: 'Milestones view', icon: CalendarIcon },
            { id: 'kanban', label: 'Kanban view', icon: Trello },
            { id: 'time', label: 'Time Tracking', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`py-3 px-1.5 text-sm font-semibold inline-flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  active 
                    ? 'border-[#3170c5] text-[#3170c5]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ════ CONTROLS SUB-BAR ════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        
        {/* Left Bar Elements */}
        <div className="flex flex-wrap items-center gap-2">
          {/* New Task Button */}
          <button 
            onClick={handleNewTaskClick}
            className="px-6 bg-[#3170c5] hover:bg-[#2158a4] text-white text-[13px] font-semibold rounded-full shadow-sm inline-flex items-center gap-2 transition-all active:scale-[0.98] h-[40px]"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>

          {/* Search box */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3.5 w-56 h-[40px] focus-within:border-slate-300 transition-all">
            <SearchIcon size={15} className="text-black mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none w-full p-0 text-slate-800 placeholder-slate-400 text-[13px]"
            />
          </div>

          {/* Employee (Assignee) Filter Dropdown */}
          <div className="relative" ref={employeeRef}>
            <button 
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer focus:outline-none"
            >
              <Users size={15} className="text-black" />
              <span>
                {employeeFilter === 'All' ? 'Employee' : getUserById(employeeFilter)?.name || 'Employee'}
              </span>
              <ChevronDown size={13} className="text-black ml-1" />
            </button>

            {showEmployeeDropdown && (
              <div className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                <button 
                  onClick={() => { setEmployeeFilter('All'); setShowEmployeeDropdown(false); }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 font-medium ${employeeFilter === 'All' ? 'bg-[#3170c5]/5 text-[#3170c5]' : 'text-slate-600'}`}
                >
                  All Employees
                </button>
                {users.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => { setEmployeeFilter(u.id); setShowEmployeeDropdown(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium ${employeeFilter === u.id ? 'bg-[#3170c5]/5 text-[#3170c5]' : 'text-slate-600'}`}
                  >
                    {u.avatar ? (
                      <Image src={u.avatar} width={18} height={18} alt={u.name} className="w-[18px] h-[18px] rounded-full object-cover shrink-0" unoptimized />
                    ) : (
                      <div className="w-[18px] h-[18px] bg-slate-200 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{u.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filtersRef}>
            <button 
              onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer focus:outline-none"
            >
              <FilterIcon size={15} className="text-black" />
              <span>Filter</span>
              <ChevronDown size={13} className="text-black ml-1" />
            </button>

            {showFiltersDropdown && (
              <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-3.5 space-y-3.5 text-xs text-slate-600">
                <div className="font-bold text-slate-800 border-b pb-1.5 flex justify-between items-center">
                  <span>Advanced Filters</span>
                  <button onClick={() => {
                    setStatusFilter('All');
                    setPriorityFilter('All');
                    setLabelFilter('All');
                    setCreatedByFilter('All');
                    setOwnershipFilter('all');
                  }} className="text-[#3170c5] font-semibold hover:underline">Clear All</button>
                </div>
                
                {/* Status Filter */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Priority</label>
                  <select 
                    value={priorityFilter} 
                    onChange={e => setPriorityFilter(e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Labels Filter */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Labels</label>
                  <select 
                    value={labelFilter} 
                    onChange={e => setLabelFilter(e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
                  >
                    <option value="All">All Labels</option>
                    {mergedLabelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Creators Filter */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Created By</label>
                  <select 
                    value={createdByFilter} 
                    onChange={e => setCreatedByFilter(e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
                  >
                    <option value="All">All Creators</option>
                    {createdByOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Ownership Filter */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assignment Type</label>
                  <select 
                    value={ownershipFilter} 
                    onChange={e => setOwnershipFilter(e.target.value)} 
                    className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 outline-none"
                  >
                    <option value="all">All Tasks</option>
                    <option value="assigned_to_me">Assigned To Me</option>
                    <option value="assigned_by_me">Assigned By Me</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer focus:outline-none"
            >
              <ArrowUpDown size={15} className="text-black" />
              <span>Sort</span>
              <ChevronDown size={13} className="text-black ml-1" />
            </button>

            {showSortDropdown && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs text-slate-600">
                {[
                  { key: 'dueDate', label: 'Due Date' },
                  { key: 'title', label: 'Task Name' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'progress', label: 'Progress' },
                  { key: 'status', label: 'Status' },
                  { key: 'member', label: 'Members Count' },
                  { key: 'trackingTime', label: 'Tracking Time' }
                ].map(opt => (
                  <button 
                    key={opt.key}
                    onClick={() => { setSortBy(opt.key); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 font-medium ${sortBy === opt.key ? 'bg-[#3170c5]/5 text-[#3170c5] font-bold' : ''}`}
                  >
                    Sort by {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hide Dropdown */}
          <div className="relative" ref={hideRef}>
            <button 
              onClick={() => setShowHideDropdown(!showHideDropdown)}
              className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer focus:outline-none"
            >
              <EyeOff size={15} className="text-black" />
              <span>Hide</span>
              <ChevronDown size={13} className="text-black ml-1" />
            </button>

            {showHideDropdown && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-3 text-xs text-slate-600 space-y-2.5">
                <div className="font-bold text-slate-800 border-b pb-1">Visibility settings</div>
                <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={hideCompleted}
                    onChange={(e) => setHideCompleted(e.target.checked)}
                    className="rounded border-slate-300 text-[#3170c5] focus:ring-[#3170c5]"
                  />
                  <span>Hide Completed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={hideProgress}
                    onChange={(e) => setHideProgress(e.target.checked)}
                    className="rounded border-slate-300 text-[#3170c5] focus:ring-[#3170c5]"
                  />
                  <span>Hide Progress Column</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-slate-800">
                  <input 
                    type="checkbox" 
                    checked={hideTrackingTime}
                    onChange={(e) => setHideTrackingTime(e.target.checked)}
                    className="rounded border-slate-300 text-[#3170c5] focus:ring-[#3170c5]"
                  />
                  <span>Hide Tracking Time</span>
                </label>
              </div>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative" ref={dateSortRef}>
            <button 
              onClick={() => setShowDateSortDropdown(!showDateSortDropdown)}
              className="px-4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-[13px] font-semibold text-slate-800 rounded-full inline-flex items-center gap-1.5 transition-colors h-[40px] cursor-pointer focus:outline-none"
            >
              <CalendarIcon size={15} className="text-black" />
              <span>Date Filter</span>
              <ChevronDown size={13} className="text-black ml-1" />
            </button>

            {showDateSortDropdown && (
              <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs text-slate-600">
                {[
                  { key: 'recentCreated', label: 'Recently Assigned' },
                  { key: 'upcomingDue', label: 'Upcoming Due Date' },
                  { key: 'oldestCreated', label: 'Oldest Assigned' }
                ].map(opt => (
                  <button 
                    key={opt.key}
                    onClick={() => { setSortBy(opt.key); setShowDateSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 font-medium ${sortBy === opt.key ? 'bg-[#3170c5]/5 text-[#3170c5] font-bold' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isFilterActive && (
            <button
              onClick={handleClearAllFilters}
              title="Clear all filters"
              className="flex items-center justify-center border border-red-200 hover:border-red-300 bg-red-50/50 hover:bg-red-50 text-red-650 rounded-full w-[40px] h-[40px] cursor-pointer focus:outline-none active:scale-[0.98] shrink-0 transition-colors"
            >
              <X size={16} className="text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* ════ VIEW CONDITIONAL RENDER ════ */}
      
      {/* 1. GRID TABLE VIEW (Default) */}
      {activeView === 'main' && (
        <div className="space-y-8">
          {displayTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
              No tasks match the selected criteria.
            </div>
          ) : (
            Object.entries(groupedTasks).map(([groupName, groupTasks]) => {
              const isCollapsed = collapsedGroups.has(groupName);

              if (groupTasks.length === 0) return null;

              return (
                <div key={groupName} className="select-none">
                  
                  {/* Collapsible Group Header: Simple, Black, Normal/Medium weight text */}
                  <div 
                    onClick={() => toggleGroup(groupName)}
                    className="flex items-center gap-2.5 py-4 cursor-pointer font-medium text-slate-900 hover:text-slate-700 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronRight size={15} className="text-black stroke-[2.5]" />
                    ) : (
                      <ChevronDown size={15} className="text-black stroke-[2.5]" />
                    )}
                    <span className="text-[15px] font-medium tracking-tight text-black">{groupName}</span>
                  </div>

                  {/* Grid Table (Expanded State) */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm bg-white">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          {/* Header row: bg-slate-50 fill, medium text, NO VERTICAL BORDERS, single bottom border */}
                          <tr className="bg-slate-50 border-b border-slate-200">
                            {/* Member Header (Aligned slightly to the right, medium black text, no vertical border) */}
                            <th 
                              onClick={() => toggleHeaderSort('member')}
                              className="py-3 px-4 font-medium text-slate-900 text-[14px] w-44 cursor-pointer hover:bg-slate-100/60 transition-all select-none text-center pl-10"
                            >
                              <div className="inline-flex items-center gap-1.5">
                                <span>Member</span>
                                <ArrowUpDown size={12} className="text-black stroke-[2]" />
                              </div>
                            </th>
                            {/* Project Header (Medium black text, no vertical border) */}
                            <th 
                              onClick={() => toggleHeaderSort('title')}
                              className="py-3 px-4 font-medium text-slate-900 text-[14px] cursor-pointer hover:bg-slate-100/60 transition-all select-none"
                            >
                              <div className="inline-flex items-center gap-1.5">
                                <span>Tasks</span>
                                <ArrowUpDown size={12} className="text-black stroke-[2]" />
                              </div>
                            </th>
                            {/* Status Header (no vertical border) */}
                            <th 
                              onClick={() => toggleHeaderSort('status')}
                              className="py-3 px-4 font-medium text-slate-900 text-[14px] w-44 cursor-pointer hover:bg-slate-100/60 transition-all select-none"
                            >
                              <div className="flex items-center gap-1.5 justify-between">
                                <span>Status</span>
                                <ArrowUpDown size={12} className="text-black stroke-[2]" />
                              </div>
                            </th>
                            {/* Progress Header (no vertical border) */}
                            {!hideProgress && (
                              <th 
                                onClick={() => toggleHeaderSort('progress')}
                                className="py-3 px-4 font-medium text-slate-900 text-[14px] w-44 cursor-pointer hover:bg-slate-100/60 transition-all select-none"
                              >
                                <div className="inline-flex items-center gap-1.5">
                                  <span>Progess</span>
                                  <ArrowUpDown size={12} className="text-black stroke-[2]" />
                                </div>
                              </th>
                            )}
                            {/* Tracking Time Header with info trigger (no vertical border) */}
                            {!hideTrackingTime && (
                              <th 
                                onClick={() => toggleHeaderSort('trackingTime')}
                                className="py-3 px-4 font-medium text-slate-900 text-[14px] w-44 cursor-pointer hover:bg-slate-100/60 transition-all select-none"
                              >
                                <div className="flex items-center gap-1.5 justify-between">
                                  <div className="flex items-center gap-1">
                                    <span>Tracking Time</span>
                                    <div className="relative group/tooltip inline-flex items-center">
                                      <Info size={13} className="text-black stroke-[2] cursor-help" />
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-slate-900 text-white text-[11px] font-normal rounded px-2.5 py-1.5 w-60 text-center shadow-lg leading-normal z-50 pointer-events-none normal-case">
                                        Calculates active duration from task creation to completion, or live time elapsed for pending tasks.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowUpDown size={12} className="text-black stroke-[2]" />
                                </div>
                              </th>
                            )}
                            {/* Visible Header (no vertical border) */}
                            <th className="py-3 px-4 font-medium text-slate-900 text-[14px] w-36 text-center select-none">
                              Visible
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[14px] font-medium text-slate-900 bg-white">
                          {groupTasks.map((task) => {
                            const isNavigating = navigatingTaskId === task.id;
                            return (
                              <tr 
                                key={task.id} 
                                className="hover:bg-slate-50/30 transition-colors border-b border-slate-200"
                              >
                                {/* Member Cell: Centered avatars with slightly increased dimensions (w-10 h-10) and compact padding */}
                                <td className="py-1.5 px-4 border border-slate-200">
                                  <div className="flex -space-x-3 items-center justify-center">
                                    {task.assignees.length === 0 ? (
                                      <span className="text-[12px] text-slate-400 font-medium">Unassigned</span>
                                    ) : (
                                      task.assignees.slice(0, 3).map((uid) => {
                                        const ass = getUserById(uid);
                                        const init = ass?.name?.charAt(0).toUpperCase() || 'U';
                                        return ass?.avatar ? (
                                          <Image 
                                            key={uid} 
                                            src={ass.avatar} 
                                            width={40} 
                                            height={40} 
                                            alt={ass.name} 
                                            title={ass.name} 
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover shrink-0 shadow-sm"
                                            unoptimized
                                          />
                                        ) : (
                                          <div 
                                            key={uid} 
                                            title={ass?.name || 'User'}
                                            className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 text-[13px] font-bold text-slate-700 flex items-center justify-center shrink-0 shadow-sm"
                                          >
                                            {init}
                                          </div>
                                        );
                                      })
                                    )}
                                    {task.assignees.length > 3 && (
                                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#3170c5] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                                        +{task.assignees.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Project Title Cell: Title only (no description), normal font weight, compact padding */}
                                <td className="py-1.5 px-4 border border-slate-200 font-medium text-slate-900">
                                  <span 
                                    className="hover:text-[#3170c5] cursor-pointer hover:underline text-[14px]" 
                                    onClick={() => openTaskDetail(task.id)}
                                  >
                                    {task.title}
                                  </span>
                                </td>

                                {/* Status Cell: Custom status cell with block color indicator, compact padding */}
                                <td className="py-1.5 px-4 border border-slate-200 relative status-selector-cell">
                                  <button 
                                    onClick={() => setActiveDropdownTaskId(activeDropdownTaskId === task.id ? null : task.id)}
                                    className="inline-flex items-center gap-2 text-slate-900 font-medium bg-white focus:outline-none transition-all py-1"
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-[4px] shrink-0 ${getStatusColorBlock(task.status)}`} />
                                    <span className="text-[14px]">{getStatusLabel(task.status)}</span>
                                  </button>

                                  {activeDropdownTaskId === task.id && (
                                    <div className="absolute left-4 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs text-slate-600 animate-fadeIn">
                                      {['Pending', 'In Progress', 'Completed'].map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => {
                                            updateTaskStatus(task.id, opt);
                                            setActiveDropdownTaskId(null);
                                          }}
                                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-normal ${task.status === opt ? 'text-[#3170c5] bg-[#3170c5]/5' : ''}`}
                                        >
                                          {opt === 'Pending' ? 'To Do' : opt}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </td>

                                {/* Progress Slider Cell: Thin progress bar + % text on the right, compact padding */}
                                {!hideProgress && (
                                  <td className="py-1.5 px-4 border border-slate-200">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-500"
                                          style={{ 
                                            width: `${task.progressPercentage ?? 0}%`,
                                            backgroundColor: getProgressColor(task.status)
                                          }}
                                        />
                                      </div>
                                      <span className="text-[13px] font-medium text-slate-900">
                                        {task.progressPercentage ?? 0}%
                                      </span>
                                    </div>
                                  </td>
                                )}

                                {/* Tracking Time Cell: Dynamically calculated duration, compact padding */}
                                {!hideTrackingTime && (
                                  <td className="py-1.5 px-4 border border-slate-200">
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                      <Clock size={17} className="text-black stroke-[1.8] shrink-0" />
                                      <span className="leading-none text-[14px] text-slate-900 font-medium">{getCalculatedTrackingTime(task)}</span>
                                    </div>
                                  </td>
                                )}

                                {/* Action Visible Column: Outlined single line Show Task button (instant redirect + loading indicator), compact padding */}
                                <td className="py-1.5 px-4 border border-slate-200 text-center">
                                  <button 
                                    onClick={() => openTaskDetail(task.id)}
                                    disabled={isNavigating}
                                    className="px-4 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-350 text-[12px] font-medium text-slate-800 rounded-full shadow-sm inline-flex items-center gap-2 transition-all active:scale-[0.97] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    {isNavigating ? (
                                      <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Eye size={15} className="text-black stroke-[1.8]" />
                                    )}
                                    <span>{isNavigating ? 'Opening...' : 'Show Task'}</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. GANTT TIMELINE VIEW */}
      {activeView === 'gantt' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 overflow-hidden">
          {/* Header Controls & Month Nav */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#edf4fc] flex items-center justify-center text-[#3170c5]">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Project Gantt Timeline</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    {displayTasks.length} {displayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scroll horizontally to navigate across all project timelines and months.
                </p>
              </div>
            </div>

            {/* Month Select Dropdown & Stepper Navigation */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Stepper controls */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => stepGanttMonth(-1)}
                  className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition"
                  title="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={scrollToToday}
                  className="px-2.5 py-1 text-xs font-bold text-[#3170c5] hover:bg-white rounded-lg transition flex items-center gap-1"
                  title="Jump to Today"
                >
                  <Clock size={13} />
                  <span>Today</span>
                </button>
                <button
                  type="button"
                  onClick={() => stepGanttMonth(1)}
                  className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition"
                  title="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Month Dropdown Selector */}
              {ganttTimelineData.months.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedGanttMonthIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      const targetMonth = ganttTimelineData.months[idx];
                      if (targetMonth) {
                        handleSelectGanttMonth(targetMonth.startIndex, idx);
                      }
                    }}
                    className="h-8.5 pl-3 pr-8 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3170c5]/20 focus:border-[#3170c5] cursor-pointer appearance-none"
                  >
                    {ganttTimelineData.months.map((m, idx) => (
                      <option key={`${m.year}-${m.month}`} value={idx}>
                        {m.name} ({m.daysCount} days)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Continuous Multi-Month Timeline Container */}
          <div
            ref={ganttScrollRef}
            className="overflow-auto border border-slate-200 rounded-2xl relative max-h-[70vh] bg-white scrollbar-thin [scrollbar-color:#94a3b8_#f1f5f9] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
          >
            <div
              className="relative"
              style={{ minWidth: `${340 + ganttTimelineData.totalWidth}px` }}
            >
              {/* TOP HEADER: Unified sticky top-0 across entire grid */}
              <div className="sticky top-0 z-30 flex bg-slate-50 border-b border-slate-200 h-[72px]">
                {/* Top-Left Corner Box: Sticky top-0 left-0 (both horizontal & vertical) */}
                <div className="w-[340px] shrink-0 sticky left-0 z-40 bg-slate-100 border-r border-slate-200 px-4 flex items-center justify-between shadow-[2px_0_6px_rgba(0,0,0,0.04)]">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Task / Project
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {displayTasks.length} {displayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                {/* Right Date Headers Container */}
                <div
                  className="flex flex-col"
                  style={{ width: `${ganttTimelineData.totalWidth}px` }}
                >
                  {/* Month Headers (Row 1) */}
                  <div className="h-[38px] flex border-b border-slate-200 divide-x divide-slate-200 bg-slate-50">
                    {ganttTimelineData.months.map((m) => (
                      <div
                        key={`${m.year}-${m.month}`}
                        style={{ width: `${m.daysCount * ganttTimelineData.DAY_WIDTH}px` }}
                        className="shrink-0 flex items-center justify-center font-bold text-xs text-slate-700 uppercase tracking-wider bg-slate-50/95"
                      >
                        {m.name}
                      </div>
                    ))}
                  </div>

                  {/* Day Numbers & Weekdays (Row 2) */}
                  <div className="h-[34px] flex divide-x divide-slate-100 bg-slate-50/70">
                    {ganttTimelineData.allDays.map((d) => (
                      <div
                        key={d.index}
                        style={{ width: `${ganttTimelineData.DAY_WIDTH}px` }}
                        className={`shrink-0 flex flex-col items-center justify-center text-[10px] leading-tight ${
                          d.isToday
                            ? 'bg-[#edf4fc] font-bold text-[#3170c5]'
                            : d.isWeekend
                            ? 'bg-slate-100/60 text-slate-400'
                            : 'text-slate-500'
                        }`}
                        title={d.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      >
                        <span className="font-bold text-[11px]">{d.dayNum}</span>
                        <span className="text-[8px] uppercase opacity-75">{d.dayName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Today Vertical Line Indicator across all rows */}
              {ganttTimelineData.todayLeftPx !== null && (
                <div
                  style={{ left: `${340 + ganttTimelineData.todayLeftPx}px` }}
                  className="absolute top-[72px] bottom-0 w-0.5 bg-rose-500 z-25 pointer-events-none"
                >
                  <span className="absolute -top-3 -left-3.5 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[9px] font-bold shadow-xs">
                    Today
                  </span>
                </div>
              )}

              {/* Task Rows: unified flex rows ensuring 1-to-1 vertical sync */}
              <div className="divide-y divide-slate-100 relative bg-white">
                {displayTasks.map((t) => {
                  const placement = ganttTimelineData.placementsMap.get(t.id);
                  const barColor = getProgressColor(t.status);
                  const assignee = getUserById(t.assignees[0]);

                  return (
                    <div
                      key={t.id}
                      className="flex h-[52px] group hover:bg-slate-50/60 transition-colors relative"
                    >
                      {/* Left Column: Pinned Sticky Task Title */}
                      <div
                        className="w-[340px] shrink-0 sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-r border-slate-200 px-3.5 flex items-center justify-between gap-2.5 cursor-pointer shadow-[2px_0_6px_rgba(0,0,0,0.04)]"
                        onClick={() => openTaskDetail(t.id)}
                        title={t.title}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: barColor }}
                          />
                          <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#3170c5] transition-colors">
                            {t.title}
                          </span>
                        </div>
                        {assignee && (
                          <div
                            className="shrink-0 w-6 h-6 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700"
                            title={assignee.name}
                          >
                            {assignee.avatar ? (
                              <Image src={assignee.avatar} width={24} height={24} alt={assignee.name} className="w-full h-full object-cover" unoptimized />
                            ) : (
                              assignee.name.charAt(0).toUpperCase()
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Column: Timeline Row Grid & Task Bar */}
                      <div
                        className="relative h-full flex-1"
                        style={{ width: `${ganttTimelineData.totalWidth}px` }}
                      >
                        {/* Background Day Guidelines */}
                        <div className="absolute inset-0 flex divide-x divide-slate-100/70 pointer-events-none">
                          {ganttTimelineData.allDays.map((d) => (
                            <div
                              key={d.index}
                              style={{ width: `${ganttTimelineData.DAY_WIDTH}px` }}
                              className={`shrink-0 h-full ${
                                d.isWeekend ? 'bg-slate-50/50' : ''
                              }`}
                            />
                          ))}
                        </div>

                        {/* Task Bar */}
                        {placement && (
                          <div
                            style={{
                              left: `${placement.leftPx}px`,
                              width: `${placement.widthPx}px`,
                              backgroundColor: barColor,
                            }}
                            title={`${t.title} (${t.status}) • ${placement.startFormatted} to ${placement.endFormatted} • ${t.progressPercentage ?? 0}% completed`}
                            className="absolute top-[10px] z-10 h-8 rounded-xl text-[11px] font-bold text-white px-3 flex items-center justify-between shadow-xs cursor-pointer hover:brightness-95 hover:shadow-md transition-all truncate"
                            onClick={() => openTaskDetail(t.id)}
                          >
                            <span className="truncate mr-2">
                              {t.startDate?.split(',')[0] || placement.startFormatted} – {t.dueDate?.split(',')[0] || placement.endFormatted}
                            </span>
                            <span className="shrink-0 font-bold opacity-95">
                              {t.progressPercentage ?? 0}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {displayTasks.length === 0 && (
                  <div className="p-12 text-center text-xs text-slate-400">
                    No tasks found matching your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MILESTONES VIEW */}
      {activeView === 'milestones' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <CalendarIcon size={16} className="text-[#3170c5]" />
              <span>Project Key Milestones</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Active Timeline</span>
          </div>

          <div className="relative border-l-2 border-slate-150 pl-6 ml-4 space-y-6">
            {displayTasks.map(t => (
              <div key={t.id} className="relative">
                {/* Milestone Node Dot */}
                <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                  t.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-400'
                }`} />

                <div className="bg-slate-50 hover:bg-slate-100/75 p-4 rounded-xl border border-slate-100 transition-all cursor-pointer" onClick={() => openTaskDetail(t.id)}>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h4 className="font-medium text-[14px] text-slate-900 hover:text-[#3170c5] hover:underline">{t.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {getStatusLabel(t.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{t.description || 'No description provided.'}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Target Date: {t.dueDate}</span>
                    <span className="font-bold text-[#3170c5]">{t.priority} Priority</span>
                  </div>
                </div>
              </div>
            ))}

            {displayTasks.length === 0 && (
              <div className="text-center text-slate-400 text-xs py-8">
                No milestone tasks defined.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. KANBAN BOARD VIEW */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: 'Pending', label: 'To Do', pillColor: 'bg-[#344054]' },
            { key: 'In Progress', label: 'In Progress', pillColor: 'bg-[#0070c0]' },
            { key: 'Completed', label: 'Completed', pillColor: 'bg-[#039855]' }
          ].map((column) => {
            const columnTasks = displayTasks.filter(t => t.status === column.key);
            return (
              <div key={column.key} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ${column.pillColor}`}>
                    {column.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {columnTasks.map(task => (
                    <div 
                      key={task.id}
                      className="w-full rounded-2xl border border-slate-200 p-4 text-left transition-all duration-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer"
                      onClick={() => openTaskDetail(task.id)}
                    >
                      {/* Title and arrow on the right */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-slate-800 leading-snug break-words group-hover:text-[#3170c5]">
                            {task.title}
                          </h4>
                        </div>
                        <ArrowRight size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      </div>

                      {/* Bottom row: Assignees, Due Date pill, Priority pill, Move actions */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                        {/* Assignee Avatar(s) */}
                        <div className="flex -space-x-1.5 items-center">
                          {task.assignees && task.assignees.length > 0 ? (
                            task.assignees.slice(0, 3).map(uid => {
                              const ass = getUserById(uid);
                              return ass?.avatar ? (
                                <Image key={uid} src={ass.avatar} width={24} height={24} alt={ass.name} className="w-6 h-6 rounded-full border border-white object-cover shadow-sm" unoptimized />
                              ) : (
                                <div key={uid} className="w-6 h-6 rounded-full border border-white bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center shadow-sm">
                                  {ass?.name?.charAt(0).toUpperCase()}
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-350 bg-slate-50 text-slate-400">
                              <UserPlus size={10} className="text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Due Date Indicator */}
                        <div className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 border ${
                          task.dueDate
                            ? 'bg-slate-50 text-slate-600 border-slate-100'
                            : 'bg-slate-50/50 text-slate-400 border-dashed border-slate-200'
                        }`}>
                          <CalendarIcon size={12} className="text-slate-450" />
                          <span>{task.dueDate ? task.dueDate.split(',')[0] : 'No date'}</span>
                        </div>

                        {/* Priority Flag */}
                        {(() => {
                          const priority = task.priority || 'medium';
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
                    </div>
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
      )}

      {/* 5. CARD VIEW (Original Grid Cards) */}
      {activeView === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              role="button"
              tabIndex={0}
              onClick={() => openTaskDetail(task.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openTaskDetail(task.id);
                }
              }}
              className="relative bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-[#3170c5]/25 transition-all hover:shadow-md group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                    task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {getStatusLabel(task.status)}
                  </span>
                  <span className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  {task.label && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {task.label}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-medium text-[14px] text-slate-900 mb-2 group-hover:text-[#3170c5] group-hover:underline transition-colors">{task.title}</h3>
              <p className="text-xs text-slate-400 mb-4 font-semibold">Created by: {task.createdBy || 'Unknown'}</p>

              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
                  <span className="font-headline text-[1.35rem] font-light tracking-[0.02em] text-slate-800">
                    {task.completedSubtasks}/{task.totalSubtasks} Subtasks
                  </span>
                  {task.attachments > 0 && (
                    <div className="flex items-center text-[#3170c5] gap-1 bg-[#3170c5]/10 px-2 py-0.5 rounded-full">
                      <Paperclip size={12} />
                      <span>{task.attachments}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
                  <span>Task Progress</span>
                  <span>{task.progressPercentage ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${task.progressPercentage ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                <div className="flex -space-x-3 items-center">
                  {task.assignees.slice(0, 4).map((uid) => {
                    const assignee = getUserById(uid);
                    const avatarSrc = assignee?.avatar || null;
                    const fallbackInitial = assignee?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

                    if (!avatarSrc) {
                      return (
                        <div
                          key={uid}
                          className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 text-sm font-bold flex items-center justify-center text-slate-700 shrink-0 shadow-sm"
                          title={assignee?.name || 'Assignee'}
                        >
                          {fallbackInitial}
                        </div>
                      );
                    }

                    return (
                      <Image
                        key={uid}
                        src={avatarSrc}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 rounded-full border-2 border-white object-cover shrink-0 shadow-sm"
                        alt={assignee?.name || 'Assignee'}
                        title={assignee?.name || 'Assignee'}
                      />
                    );
                  })}
                  {task.assignees.length > 4 && (
                    <div
                      className="h-10 w-10 rounded-full border-2 border-white bg-[#3170c5] text-xs font-bold flex items-center justify-center text-white shrink-0 shadow-sm"
                    >
                      +{task.assignees.length - 4}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="text-slate-400 font-medium">Start Date</div>
                    <div className="text-slate-800 font-semibold">{task.startDate}</div>
                    <div className="text-slate-400 font-medium">Due Date</div>
                    <div className="text-slate-800 font-semibold">{task.dueDate?.split(',')[0]}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. TIME TRACKING VIEW */}
      {activeView === 'time' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Clock size={16} className="text-[#3170c5]" />
              <span>Project Work Hours Summary</span>
            </h3>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3 px-4 whitespace-nowrap">Member</th>
                  <th className="p-3 px-4 whitespace-nowrap">Project / Task</th>
                  <th className="p-3 px-4 whitespace-nowrap">Start Date & Time</th>
                  <th className="p-3 px-4 whitespace-nowrap">End Date & Time</th>
                  <th className="p-3 px-4 text-right whitespace-nowrap">Total Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {displayTasks.map((t) => {
                  const assignee = getUserById(t.assignees[0]) || users[0];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 px-4 flex items-center gap-3 whitespace-nowrap">
                        {assignee?.avatar ? (
                          <Image src={assignee.avatar} width={32} height={32} alt={assignee.name} className="w-8 h-8 rounded-full object-cover shadow-sm" unoptimized />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[12px] font-bold text-slate-600 shadow-sm">
                            {assignee?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-[14px] font-semibold text-slate-800">{assignee?.name || 'Unassigned'}</span>
                      </td>
                      <td className="p-3.5 px-4 font-medium text-slate-900 text-[14px]">
                        <span className="hover:text-[#3170c5] cursor-pointer hover:underline" onClick={() => openTaskDetail(t.id)}>
                          {t.title}
                        </span>
                      </td>
                      <td className="p-3.5 px-4 text-[13px] text-slate-600 font-medium whitespace-nowrap">
                        {t.createdAt 
                          ? formatDateTime(t.createdAt) 
                          : (t.startDate ? `${t.startDate}, 09:00 AM` : '—')}
                      </td>
                      <td className="p-3.5 px-4 text-[13px] text-slate-600 font-medium whitespace-nowrap">
                        {(t.status === 'Completed' || t.rawStatus === 'completed')
                          ? (t.completedAt ? formatDateTime(t.completedAt) : (t.updatedAt ? formatDateTime(t.updatedAt) : 'Closed'))
                          : <span className="text-emerald-650 text-[#039855] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[11px] uppercase tracking-wider">Active</span>}
                      </td>
                      <td className="p-3.5 px-4 text-[14px] font-semibold text-slate-900 text-right whitespace-nowrap">{getCalculatedTrackingTime(t)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
