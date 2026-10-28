import React, { useState } from 'react';
import { X, ListChecks, Edit3 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { MOCK_USERS } from '../context/CrmContext';
import MOCK_DATA from '../data/mockData.json';

export default function TaskDetailsModal({ isOpen, task, onClose, onEditTask }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  if (!isOpen || !task) return null;

  const getAssigneeName = (id) => {
    const key = Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === id);
    return key ? MOCK_USERS[key].name : "Unassigned";
  };

  const getLeadName = (leadId) => {
    // Tasks may reference a lead via assigneeId context
    const lead = MOCK_DATA.leads.find(l => l.assigneeId === task.assigneeId);
    return lead ? lead.contact : "—";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20';
      case 'In Progress': return 'bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF] border border-[#0071E3]/20';
      default: return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': return 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20';
      case 'Medium': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20';
      default: return 'bg-[#F5F5F7] text-[#6E6E73] dark:bg-white/10 dark:text-white/70 border border-[#D2D2D7]/60 dark:border-white/10';
    }
  };

  const formattedDate = new Date(task.dueDate).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = new Date(task.dueDate).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  const startEditing = () => {
    setEditData({
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      notes: task.notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEditTask(task.id, {
      title: editData.title,
      status: editData.status,
      priority: editData.priority,
      dueDate: editData.dueDate + "T" + (task.dueDate.split('T')[1] || "10:00:00"),
      notes: editData.notes
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] w-full max-w-lg rounded-[24px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl px-7 py-4 flex items-center justify-between text-[#1D1D1F] dark:text-white border-b border-[#D2D2D7]/70 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">
                Task Details
              </h2>
              <p className="text-[12px] text-[#86868B]">{task.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-white/70 dark:hover:text-white hover:bg-[#E8E8ED] dark:hover:bg-white/15 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 space-y-4 overflow-y-auto max-h-[70vh]">
          {!isEditing ? (
            <div className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[18px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-3.5">
              <DetailRow label="TITLE" value={<span className="font-semibold text-[#1D1D1F] dark:text-white">{task.title}</span>} />
              <DetailRow label="TYPE" value={
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF] border border-[#0071E3]/20">
                  <ListChecks className="w-3.5 h-3.5" /> {task.status === 'Completed' ? 'Completed Task' : 'Pending Task'}
                </span>
              } />
              <DetailRow label="DUE DATE" value={
                <div className="text-[14px] text-[#1D1D1F] dark:text-white">
                  {formattedDate} 
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#0071E3]/10 text-[#0071E3] dark:text-[#2997FF]">
                    {formattedTime}
                  </span>
                </div>
              } />
              <DetailRow label="ASSOCIATED LEAD" value={<span className="text-[14px] text-[#1D1D1F] dark:text-white">{getLeadName()}</span>} />
              <DetailRow label="STATUS" value={
                <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${getStatusBadge(task.status)}`}>
                  {task.status}
                </span>
              } />
              <DetailRow label="PRIORITY" value={
                <span className={`px-3 py-1 rounded-full text-[12px] font-medium ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              } />
              <DetailRow label="ASSIGNED TO" value={<span className="text-[14px] text-[#1D1D1F] dark:text-white">{getAssigneeName(task.assigneeId)}</span>} />
              <DetailRow label="NOTES" value={<span className="text-[14px] text-[#6E6E73] dark:text-white/70 whitespace-pre-wrap">{task.notes || "No notes attached."}</span>} />
            </div>
          ) : (
            <div className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[18px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Task Title</label>
                <input 
                  type="text" 
                  value={editData.title} 
                  onChange={e => setEditData({...editData, title: e.target.value})} 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Status</label>
                  <select 
                    value={editData.status} 
                    onChange={e => setEditData({...editData, status: e.target.value})} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Priority</label>
                  <select 
                    value={editData.priority} 
                    onChange={e => setEditData({...editData, priority: e.target.value})} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Due Date</label>
                <input 
                  type="date" 
                  value={editData.dueDate} 
                  onChange={e => setEditData({...editData, dueDate: e.target.value})} 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Notes</label>
                <textarea 
                  value={editData.notes} 
                  onChange={e => setEditData({...editData, notes: e.target.value})} 
                  rows={3} 
                  className="w-full p-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white resize-none focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F5F5F7]/80 dark:bg-[#1D1D1F]/80 backdrop-blur-md border-t border-[#D2D2D7]/70 dark:border-white/10 px-7 py-4 flex justify-between gap-3 shrink-0">
          {!isEditing ? (
            <>
              <button 
                onClick={() => toast.info('Navigating to lead...')} 
                className="h-11 px-5 rounded-full text-[14px] font-medium text-[#1D1D1F] dark:text-white bg-white dark:bg-white/10 border border-[#D2D2D7] dark:border-white/15 hover:bg-[#F5F5F7] dark:hover:bg-white/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Lead
              </button>
              <button 
                onClick={startEditing} 
                className="h-11 px-6 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Task
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)} 
                className="h-11 px-5 rounded-full text-[14px] font-medium text-[#1D1D1F] dark:text-white bg-white dark:bg-white/10 border border-[#D2D2D7] dark:border-white/15 hover:bg-[#F5F5F7] dark:hover:bg-white/15 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="h-11 px-6 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between border-b border-[#D2D2D7]/40 dark:border-white/5 pb-2.5 last:border-0 last:pb-0">
      <span className="text-[12px] font-semibold text-[#86868B] uppercase tracking-wider w-32 shrink-0 pt-0.5">{label}</span>
      <div className="text-right flex-1">{value}</div>
    </div>
  );
}
