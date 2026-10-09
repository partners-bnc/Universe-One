'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import CreateTask from '@/app/Taskmanager/components/CreateTask';
import { DataProvider } from '@/app/Taskmanager/components/DataContext';

interface Task {
  id: string;
  task_name: string;
  created_at: string;
  status?: string;
  completed_at?: string | null;
  updated_at?: string | null;
}

interface LogEntry {
  id?: string;
  client_name: string;
  task_id: string;
  task_name_snapshot: string;
  hours_spent: string;
  remarks: string;
  isExisting?: boolean;
}

interface DailyWorkLogModalProps {
  date: string;
  tasks: Task[];
  onSubmitAndCheckout: (entries: LogEntry[]) => Promise<void>;
  onClose: () => void;
  isCheckout?: boolean;
}

const EMPTY_FORM: Omit<LogEntry, 'isExisting'> = {
  client_name: '',
  task_id: '',
  task_name_snapshot: '',
  hours_spent: '',
  remarks: '',
};

export default function DailyWorkLogModal({
  date,
  tasks,
  onSubmitAndCheckout,
  onClose,
  isCheckout = true,
}: DailyWorkLogModalProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // local tasks state for task list
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  // inline edit state: index -> edited values
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<LogEntry, 'isExisting'>>({ ...EMPTY_FORM });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const clientRef = useRef<HTMLInputElement>(null);

  // Sync tasks prop
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/HRM/api/employee/tasks');
      const data = await res.json();
      if (data.tasks) {
        setLocalTasks((data.tasks || []).slice().sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  // Categorize and sort tasks:
  // 1. In Progress tasks (shown first)
  // 2. Pending tasks (shown next)
  // 3. Completed tasks (only if completed within last 48 hours, shown at bottom)
  // Tasks completed > 48 hours ago are filtered out from the selectable list.
  const categorizedTasks = useMemo(() => {
    const now = Date.now();
    const inProgressTasks: Task[] = [];
    const pendingTasks: Task[] = [];
    const completedTasks: Task[] = [];

    localTasks.forEach((t) => {
      const status = (t.status || '').toLowerCase();
      if (status === 'completed') {
        const compTime = t.completed_at || t.updated_at || t.created_at;
        if (compTime) {
          const hoursAgo = (now - new Date(compTime).getTime()) / (1000 * 60 * 60);
          if (hoursAgo <= 48) {
            completedTasks.push(t);
          }
        } else {
          completedTasks.push(t);
        }
      } else if (status === 'in_progress') {
        inProgressTasks.push(t);
      } else {
        // Pending / not_started / todo / review
        pendingTasks.push(t);
      }
    });

    return {
      inProgressTasks,
      pendingTasks,
      completedTasks,
      allSelectableTasks: [...inProgressTasks, ...pendingTasks, ...completedTasks],
    };
  }, [localTasks]);

  // Selected task status checks
  const selectedTask = useMemo(() => {
    return localTasks.find((t) => t.id === form.task_id);
  }, [localTasks, form.task_id]);

  const isSelectedTaskPending = useMemo(() => {
    if (!selectedTask) return false;
    const status = (selectedTask.status || '').toLowerCase();
    return status === 'pending' || status === 'not_started' || status === 'todo';
  }, [selectedTask]);

  const isSelectedTaskCompletedOlder = useMemo(() => {
    if (!selectedTask) return false;
    const status = (selectedTask.status || '').toLowerCase();
    if (status !== 'completed') return false;
    const compTime = selectedTask.completed_at || selectedTask.updated_at || selectedTask.created_at;
    if (!compTime) return false;
    const hoursAgo = (Date.now() - new Date(compTime).getTime()) / (1000 * 60 * 60);
    return hoursAgo > 48;
  }, [selectedTask]);

  // Determine if editing is allowed (only today and yesterday)
  const isEditable = (() => {
    try {
      const getTzDateStr = (d: Date) => {
        const parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).formatToParts(d);
        const val = Object.fromEntries(parts.map(p => [p.type, p.value]));
        return `${val.year}-${val.month}-${val.day}`;
      };

      const todayStr = getTzDateStr(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getTzDateStr(yesterday);

      return date === todayStr || date === yesterdayStr;
    } catch {
      const todayStr = new Date().toLocaleDateString('en-CA');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');
      return date === todayStr || date === yesterdayStr;
    }
  })();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/HRM/api/attendance/work-log?date=${date}`);
        const result = await res.json();
        if (active && Array.isArray(result.logs) && result.logs.length > 0) {
          setEntries(
            result.logs.map((log: any) => ({
              id: log.id,
              client_name: log.client_name,
              task_id: log.task_id || '',
              task_name_snapshot: log.task_name_snapshot || '',
              hours_spent: String(log.hours_spent),
              remarks: log.remarks || '',
              isExisting: true,
            }))
          );
        }
      } catch {
        // silently ignore
      } finally {
        if (active) setLoadingExisting(false);
      }
    }
    load();
    return () => { active = false; };
  }, [date]);

  useEffect(() => {
    if (!loadingExisting && isEditable) setTimeout(() => clientRef.current?.focus(), 80);
  }, [loadingExisting, isEditable]);

  const extractClientFromProject = (projectName: string) => {
    if (!projectName) return '';
    const parts = projectName.split('-');
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return '';
  };

  const getStatusLabel = (status?: string) => {
    switch (String(status || '').toLowerCase()) {
      case 'completed':
        return '✅ [Completed] ';
      case 'in_progress':
        return '⏳ [In Progress] ';
      case 'pending':
        return '📋 [Pending] ';
      case 'review':
        return '🔍 [In Review] ';
      default:
        return '';
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormError('');
    if (field === 'task_id') {
      const task = localTasks.find((t) => t.id === value);
      const extractedClient = task ? extractClientFromProject(task.task_name) : '';
      setForm((prev) => ({
        ...prev,
        task_id: value,
        task_name_snapshot: task?.task_name || '',
        client_name: extractedClient || prev.client_name,
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddEntry = () => {
    if (!isEditable) return;
    if (!form.task_id) {
      setFormError('Please select a project/task.');
      return;
    }
    if (isSelectedTaskPending) {
      setFormError('You cannot log work on a Pending task. Please start the task in Task Manager first.');
      return;
    }
    if (isSelectedTaskCompletedOlder) {
      setFormError('This task was completed more than 48 hours ago and cannot be logged.');
      return;
    }
    if (!form.client_name.trim()) {
      setFormError('Client name is required.');
      clientRef.current?.focus();
      return;
    }
    const hours = parseFloat(form.hours_spent);
    if (!form.hours_spent || isNaN(hours) || hours <= 0 || hours > 24) {
      setFormError('Enter valid hours (0.5 – 24).');
      return;
    }
    setEntries((prev) => [...prev, { ...form, client_name: form.client_name.trim(), remarks: form.remarks.trim() }]);
    setForm({ ...EMPTY_FORM });
    setFormError('');
  };

  // Delete — removes from DB if existing, else just from state
  const handleDelete = async (index: number) => {
    if (!isEditable) return;
    const entry = entries[index];
    if (entry.isExisting && entry.id) {
      setDeletingIndex(index);
      try {
        const res = await fetch(`/HRM/api/attendance/work-log?id=${entry.id}`, { method: 'DELETE' });
        if (!res.ok) {
          const r = await res.json();
          alert(r.error || 'Failed to delete');
          return;
        }
      } catch {
        alert('Failed to delete');
        return;
      } finally {
        setDeletingIndex(null);
      }
    }
    setEntries((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  // Start edit
  const handleStartEdit = (index: number) => {
    if (!isEditable) return;
    const entry = entries[index];
    setEditForm({
      client_name: entry.client_name,
      task_id: entry.task_id,
      task_name_snapshot: entry.task_name_snapshot,
      hours_spent: entry.hours_spent,
      remarks: entry.remarks,
    });
    setEditingIndex(index);
  };

  const handleEditFormChange = (field: string, value: string) => {
    if (field === 'task_id') {
      const task = localTasks.find((t) => t.id === value);
      const extractedClient = task ? extractClientFromProject(task.task_name) : '';
      setEditForm((prev) => ({
        ...prev,
        task_id: value,
        task_name_snapshot: task?.task_name || prev.task_name_snapshot,
        client_name: extractedClient || prev.client_name,
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Save edit — updates DB if existing, else just updates state
  const handleSaveEdit = async (index: number) => {
    if (!isEditable) return;
    if (!editForm.task_id) {
      alert('Please select a project/task.');
      return;
    }
    if (!editForm.client_name.trim()) {
      alert('Client name is required.');
      return;
    }
    const hours = parseFloat(editForm.hours_spent);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      alert('Enter valid hours.');
      return;
    }

    const entry = entries[index];
    setSavingEdit(true);
    try {
      if (entry.isExisting && entry.id) {
        const res = await fetch(`/HRM/api/attendance/work-log?id=${entry.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: editForm.client_name.trim(),
            task_id: editForm.task_id || null,
            task_name_snapshot: editForm.task_name_snapshot || null,
            hours_spent: hours,
            remarks: editForm.remarks.trim() || null,
          }),
        });
        if (!res.ok) {
          const r = await res.json();
          alert(r.error || 'Failed to update');
          return;
        }
      }
      setEntries((prev) =>
        prev.map((e, i) =>
          i === index
            ? { ...e, ...editForm, hours_spent: String(hours) }
            : e
        )
      );
      setEditingIndex(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + (parseFloat(e.hours_spent) || 0), 0);
  const canCheckout = entries.length > 0 && totalHours > 0 && totalHours <= 8;

  const handleSubmit = async () => {
    if (!isEditable) return;
    if (entries.length === 0) {
      setSubmitError('Add at least one work log entry.');
      return;
    }
    if (totalHours > 8) {
      setSubmitError('Total hours logged cannot exceed 8 hours. Currently: ' + totalHours.toFixed(1) + ' hrs.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmitAndCheckout(entries);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
      setSubmitting(false);
    }
  };

  const formattedDate = (() => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  })();

  const newEntriesCount = entries.filter((e) => !e.isExisting).length;
  const existingEntriesCount = entries.filter((e) => e.isExisting).length;

  const handleOpenTaskManager = () => {
    if (form.task_id) {
      window.open(`/Taskmanager/dashboard/tasks/${form.task_id}`, '_blank');
    } else {
      window.open('/Taskmanager/dashboard/tasks', '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[95vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3170c6] text-xl">assignment_turned_in</span>
              Daily Work Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {formattedDate} · {isEditable ? (isCheckout ? 'Fill your work summary before checking out' : 'Manage your daily work logs') : 'Read-only log view'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body — Guaranteed 2-Panel Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[480px] max-h-[calc(95vh-140px)] divide-y md:divide-y-0 md:divide-x divide-slate-200/80 overflow-y-auto md:overflow-hidden">

          {/* LEFT PANEL — Add Entry Form (5 cols) */}
          <div className="md:col-span-5 lg:col-span-5 p-5 bg-white flex flex-col gap-3.5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#3170c6]">edit_note</span>
                Add Work Entry
              </p>
              {isEditable && (
                <span className="text-[10px] text-slate-400 font-medium">* Required fields</span>
              )}
            </div>

            {formError && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-150 rounded-xl px-3 py-2.5 font-medium flex items-center gap-2 animate-fadeIn">
                <span className="material-symbols-outlined text-base shrink-0 text-rose-500">error</span>
                <span>{formError}</span>
              </div>
            )}

            {isEditable ? (
              <div className="space-y-3">
                <div title="Select the project that you have worked on today.">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project / Task <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-col gap-1.5">
                    <select
                      value={form.task_id}
                      onChange={(e) => handleFormChange('task_id', e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs text-slate-800 outline-none transition bg-white ${isSelectedTaskPending
                          ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                          : isSelectedTaskCompletedOlder
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#3170c6] focus:ring-2 focus:ring-[#afd0f4]/50'
                        }`}
                    >
                      <option value="">— Select a task —</option>

                      {categorizedTasks.inProgressTasks.length > 0 && (
                        <optgroup label="⏳ In Progress Tasks">
                          {categorizedTasks.inProgressTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                              ⏳ [In Progress] {task.task_name}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {categorizedTasks.pendingTasks.length > 0 && (
                        <optgroup label="📋 Pending Tasks (Must start first)">
                          {categorizedTasks.pendingTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                              📋 [Pending] {task.task_name}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {categorizedTasks.completedTasks.length > 0 && (
                        <optgroup label="✅ Completed Tasks (Within 48h)">
                          {categorizedTasks.completedTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                              ✅ [Completed] {task.task_name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* Pending Task Warning Alert Card */}
                    {isSelectedTaskPending && (
                      <div className="mt-1 p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">warning</span>
                          <div className="text-xs text-amber-900 leading-relaxed">
                            <strong className="font-bold block text-amber-950 mb-0.5">Task Status is Pending</strong>
                            You do not have permission to log daily work on a Pending task. Go to your task in Task Manager and change the status from <strong>Pending</strong> to <strong>In Progress</strong>.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenTaskManager}
                          className="self-end px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm hover:shadow"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Open in Task Manager
                        </button>
                      </div>
                    )}

                    {/* Completed Older than 48 Hours Warning Alert Card */}
                    {isSelectedTaskCompletedOlder && (
                      <div className="mt-1 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">history_toggle_off</span>
                        <div className="text-xs text-rose-900 leading-relaxed">
                          <strong className="font-bold block text-rose-950 mb-0.5">Completed &gt; 48 Hours Ago</strong>
                          This task was marked completed more than 48 hours ago. Daily work logs cannot be submitted for expired tasks. Please select the task that you have worked on today.
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowCreateTaskModal(true)}
                      className="text-left text-[#3170c6] hover:text-[#2158a4] hover:underline text-[11px] font-bold flex items-center gap-1 mt-0.5 w-fit transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px] font-bold">add</span>
                      Create New Task
                    </button>
                  </div>
                </div>

                <div title="Client name will be automatically filled from the selected project (text before the first hyphen), or you can edit/type it manually.">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Client <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={clientRef}
                    type="text"
                    value={form.client_name}
                    onChange={(e) => handleFormChange('client_name', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#3170c6] focus:ring-2 focus:ring-[#afd0f4]/50 transition"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddEntry(); } }}
                  />
                </div>

                <div title="Enter the exact hours spent working on this task today (between 0.5 and 24 hours).">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hours Spent <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={form.hours_spent}
                    onChange={(e) => handleFormChange('hours_spent', e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#3170c6] focus:ring-2 focus:ring-[#afd0f4]/50 transition"
                  />
                </div>

                <div title="Provide optional remarks summarizing your accomplishments for this task today.">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Remarks <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.remarks}
                    onChange={(e) => handleFormChange('remarks', e.target.value)}
                    placeholder="What did you accomplish?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-[#3170c6] focus:ring-2 focus:ring-[#afd0f4]/50 resize-none transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddEntry}
                  disabled={!form.task_id || isSelectedTaskPending || isSelectedTaskCompletedOlder}
                  className="mt-2 w-full py-2.5 rounded-xl bg-[#edf4fc] border border-[#afd0f4] text-[#3170c6] text-xs font-bold hover:bg-[#d7e7f9] active:bg-[#afd0f4] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  Add to List
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-6 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <span className="material-symbols-outlined text-3xl mb-1.5 text-slate-350 select-none">lock</span>
                <p className="text-xs font-bold text-slate-500">Read-Only Mode</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Work logs for dates older than yesterday are locked and cannot be edited.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL — Entries Table (7 cols) */}
          <div className="md:col-span-7 lg:col-span-7 p-5 bg-slate-50/60 flex flex-col min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3.5 shrink-0">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#3170c6]">view_list</span>
                  Work Entries
                </p>
                <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {entries.length} {entries.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              {entries.length > 0 && (
                <span className="text-xs font-bold text-[#3170c6] bg-[#edf4fc] border border-[#afd0f4] px-3 py-1 rounded-full shadow-2xs">
                  Total: {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)} hrs
                </span>
              )}
            </div>

            {loadingExisting ? (
              <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 gap-2 min-h-[220px]">
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-[#3170c6] border-t-transparent" />
                <span>Loading existing entries...</span>
              </div>
            ) : entries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12 px-4 bg-white/80 border border-dashed border-slate-200 rounded-2xl min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <span className="material-symbols-outlined text-2xl">table_chart_view</span>
                </div>
                <p className="text-sm font-bold text-slate-600 mb-1">No Entries Added Yet</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Fill the form on the left and click "Add to List" to log your tasks for today.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-slate-50/90 border-b border-slate-200/80 sticky top-0 z-10 backdrop-blur-xs">
                    <tr>
                      <th className="py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider text-slate-500 w-[20%]">Client</th>
                      <th className="py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider text-slate-500 w-[38%]">Project / Task</th>
                      <th className="py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider text-slate-500 w-[12%]">Hours</th>
                      <th className="py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider text-slate-500">Remarks</th>
                      {isEditable && <th className="py-2.5 px-3 w-20 text-right font-bold text-[10px] uppercase tracking-wider text-slate-500">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entries.map((entry, index) => (
                      <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                        {editingIndex === index ? (
                          /* Inline edit row */
                          <>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={editForm.client_name}
                                onChange={(e) => handleEditFormChange('client_name', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-lg border border-[#3170c6] text-xs outline-none focus:ring-1 focus:ring-[#afd0f4]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={editForm.task_id}
                                onChange={(e) => handleEditFormChange('task_id', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-lg border border-[#3170c6] text-xs outline-none bg-white focus:ring-1 focus:ring-[#afd0f4]"
                              >
                                <option value="">— No task —</option>

                                {categorizedTasks.inProgressTasks.length > 0 && (
                                  <optgroup label="⏳ In Progress Tasks">
                                    {categorizedTasks.inProgressTasks.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        ⏳ [In Progress] {t.task_name}
                                      </option>
                                    ))}
                                  </optgroup>
                                )}

                                {categorizedTasks.pendingTasks.length > 0 && (
                                  <optgroup label="📋 Pending Tasks">
                                    {categorizedTasks.pendingTasks.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        📋 [Pending] {t.task_name}
                                      </option>
                                    ))}
                                  </optgroup>
                                )}

                                {categorizedTasks.completedTasks.length > 0 && (
                                  <optgroup label="✅ Completed Tasks (Within 48h)">
                                    {categorizedTasks.completedTasks.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        ✅ [Completed] {t.task_name}
                                      </option>
                                    ))}
                                  </optgroup>
                                )}
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min="0.5"
                                max="24"
                                step="0.5"
                                value={editForm.hours_spent}
                                onChange={(e) => handleEditFormChange('hours_spent', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-lg border border-[#3170c6] text-xs outline-none focus:ring-1 focus:ring-[#afd0f4]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={editForm.remarks}
                                onChange={(e) => handleEditFormChange('remarks', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-lg border border-[#3170c6] text-xs outline-none focus:ring-1 focus:ring-[#afd0f4]"
                              />
                            </td>
                            <td className="py-2 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(index)}
                                  disabled={savingEdit}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Save"
                                >
                                  <span className="material-symbols-outlined text-base">check</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingIndex(null)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                                  title="Cancel edit"
                                >
                                  <span className="material-symbols-outlined text-base">close</span>
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          /* Normal display row */
                          <>
                            <td className="py-2.5 px-3 font-medium text-slate-800 truncate max-w-0 w-[20%]">
                              <span className="block truncate font-semibold">{entry.client_name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 truncate max-w-0 w-[38%]">
                              <span className="block truncate">{entry.task_name_snapshot || <span className="text-slate-300">—</span>}</span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap w-[12%]">
                              <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded-md">{entry.hours_spent}h</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 truncate max-w-0">
                              <span className="block truncate">{entry.remarks || <span className="text-slate-300">—</span>}</span>
                            </td>
                            {isEditable && (
                              <td className="py-2.5 px-3 text-right w-20">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(index)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#3170c6] hover:bg-[#edf4fc] transition-colors"
                                    title="Edit"
                                  >
                                    <span className="material-symbols-outlined text-[17px]">edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(index)}
                                    disabled={deletingIndex === index}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete"
                                  >
                                    <span className="material-symbols-outlined text-[17px]">
                                      {deletingIndex === index ? 'hourglass_top' : 'delete'}
                                    </span>
                                  </button>
                                </div>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 bg-slate-50/80">
          <div className="text-xs leading-relaxed">
            {isEditable ? (
              totalHours > 0 && totalHours <= 8 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] font-bold text-emerald-600">check_circle</span>
                  Ready to submit! ({totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)} hrs logged across {entries.length} {entries.length === 1 ? 'task' : 'tasks'})
                </span>
              ) : totalHours === 0 ? (
                <span className="text-amber-700 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] font-bold text-amber-600">info</span>
                  Please log at least one entry. Maximum: 8 hours.
                </span>
              ) : (
                <span className="text-rose-600 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] font-bold text-rose-600">warning</span>
                  Total hours logged cannot exceed 8 hours. Currently: {totalHours.toFixed(1)} hrs.
                </span>
              )
            ) : (
              <span className="text-slate-500 font-semibold">Locked. Under read-only compliance rule.</span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {submitError && (
              <span className="text-xs text-rose-600 mr-2 font-medium">{submitError}</span>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition disabled:opacity-50"
            >
              {isEditable ? 'Cancel' : 'Close'}
            </button>
            {isEditable && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !canCheckout}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-[#4d8be6] via-[#3170c6] to-[#225091] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_10px_20px_rgba(49,112,198,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(49,112,198,0.32)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    {submitting ? 'hourglass_top' : (isCheckout ? 'logout' : 'save')}
                  </span>
                  {submitting ? (isCheckout ? 'Checking Out...' : 'Saving...') : (isCheckout ? 'Submit & Check Out' : 'Save Logs')}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {showCreateTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[1250px] max-h-[95vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateTaskModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 p-2 rounded-lg hover:bg-slate-100 transition-colors z-[101]"
              title="Close"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <DataProvider mode="employee">
              <CreateTask
                onCancel={() => {
                  setShowCreateTaskModal(false);
                  fetchTasks();
                }}
              />
            </DataProvider>
          </div>
        </div>
      )}
    </div>
  );
}
