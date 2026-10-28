import React, { useState } from 'react';
import { X, ListChecks, CalendarIcon, RefreshCw, Users, FileText } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { MOCK_USERS } from '../context/CrmContext';
import MOCK_DATA from '../data/mockData.json';

export default function AddTaskModal({ isOpen, onClose, onAdd }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Follow Up Call',
    leadId: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium',
    repeat: 'None',
    repeatEndDate: '',
    assigneeId: '',
    relatedActivity: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      toast.warning("Task Title and Due Date are required.");
      return;
    }
    onAdd({
      id: "TSK" + (Math.floor(Math.random() * 900) + 100),
      title: formData.title,
      type: formData.type,
      leadId: formData.leadId ? parseInt(formData.leadId) : null,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime || "-",
      priority: formData.priority,
      status: "Pending",
      assigneeId: formData.assigneeId || "u1",
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notes: formData.notes
    });
    setFormData({ title: '', type: 'Follow Up Call', leadId: '', dueDate: '', dueTime: '', priority: 'Medium', repeat: 'None', repeatEndDate: '', assigneeId: '', relatedActivity: '', notes: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] w-full max-w-2xl rounded-[24px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl px-7 py-4 flex items-center justify-between text-[#1D1D1F] dark:text-white border-b border-[#D2D2D7]/70 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <ListChecks className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">
                Create New Task
              </h2>
              <p className="text-[12px] text-[#86868B]">Schedule follow-ups, calls, and action items</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-white/70 dark:hover:text-white hover:bg-[#E8E8ED] dark:hover:bg-white/15 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-7 overflow-y-auto flex-1 space-y-6">
          <form id="add-task-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Task Details */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <ListChecks className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Task Details</h3>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Task Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="e.g. Follow up on Q4 Enterprise proposal" 
                  required 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Task Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="Follow Up Call">Follow Up Call</option>
                    <option value="Send Email">Send Email</option>
                    <option value="Prepare Quote">Prepare Quote</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Associated Lead *</label>
                  <select 
                    name="leadId" 
                    value={formData.leadId} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Lead</option>
                    {MOCK_DATA.leads.map(l => (
                      <option key={l.id} value={l.id}>{l.contact} ({l.company})</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Scheduling */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <CalendarIcon className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Scheduling & Priority</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Due Date *</label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    value={formData.dueDate} 
                    onChange={handleChange} 
                    required 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Due Time</label>
                  <input 
                    type="time" 
                    name="dueTime" 
                    value={formData.dueTime} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Priority</label>
                  <select 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Recurrence & Assignment */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <Users className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Assignment & Recurrence</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Assigned To *</label>
                  <select 
                    name="assigneeId" 
                    value={formData.assigneeId} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Assignee</option>
                    {Object.values(MOCK_USERS).map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Repeat Cadence</label>
                  <select 
                    name="repeat" 
                    value={formData.repeat} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="None">None (One-time)</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
              {formData.repeat !== 'None' && (
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">End Date (Optional)</label>
                  <input 
                    type="date" 
                    name="repeatEndDate" 
                    value={formData.repeatEndDate} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
              )}
            </section>

            {/* Notes */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-2">
              <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90">Task Instructions & Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Additional notes or action steps..." 
                className="w-full p-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] resize-none focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
              />
            </section>

          </form>
        </div>

        {/* Footer actions - Apple Clean Pills */}
        <div className="bg-[#F5F5F7]/80 dark:bg-[#1D1D1F]/80 backdrop-blur-md border-t border-[#D2D2D7]/70 dark:border-white/10 px-7 py-4 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="h-11 px-6 rounded-full text-[14px] font-medium text-[#1D1D1F] dark:text-white bg-white dark:bg-white/10 border border-[#D2D2D7] dark:border-white/15 hover:bg-[#F5F5F7] dark:hover:bg-white/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-task-form" 
            className="h-11 px-7 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
