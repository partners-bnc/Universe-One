"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCrm, MOCK_USERS } from '../context/CrmContext';
import { 
  X, Briefcase, Mail, Phone, Calendar, Clock, 
  Activity, MessageSquareCode, Send, Target, 
  CheckCircle, Plus
} from 'lucide-react';

export default function LeadProfilePanel({ isOpen, onClose, leadData, onSave }) {
  const { activities, addActivity, followups, campaigns, enrollLead, currentUser } = useCrm();
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState("");
  const panelRef = useRef(null);

  useEffect(() => {
    if (leadData) {
      setFormData({ ...leadData });
    }
  }, [leadData]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !leadData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Check if status changed to log activity automatically
    if (leadData.status !== formData.status) {
      addActivity({
        id: `ACT-${Date.now()}`,
        type: "status changed",
        date: new Date().toISOString().split('T')[0],
        subject: "Lead Status Updated",
        description: `Status changed from ${leadData.status} to ${formData.status}`,
        outcome: formData.status === "Won" ? "Positive" : "Neutral",
        duration: "-",
        assigneeId: currentUser.id,
        leadId: leadData.id
      });
    }

    // Check enrollment
    if (formData.enrollCampaignId && formData.enrollCampaignId !== 'None') {
      enrollLead(leadData.id, formData.enrollCampaignId);
      addActivity({
        id: `ACT-${Date.now()}-enr`,
        type: "system",
        date: new Date().toISOString().split('T')[0],
        subject: "Enrolled in Sequence",
        description: `Enrolled in campaign ${formData.enrollCampaignId}`,
        outcome: "Neutral",
        duration: "-",
        assigneeId: currentUser.id,
        leadId: leadData.id
      });
      delete formData.enrollCampaignId;
    }

    onSave(formData);
    onClose();
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addActivity({
      id: `ACT-NOTE-${Date.now()}`,
      type: "admin note added",
      date: new Date().toISOString().split('T')[0],
      subject: "Manual Note",
      description: newNote,
      outcome: "Neutral",
      duration: "-",
      assigneeId: currentUser.id,
      leadId: leadData.id
    });
    setNewNote("");
  };

  const leadActivities = activities.filter(a => a.leadId === leadData.id).sort((a,b) => new Date(b.date) - new Date(a.date));
  const leadFollowups = followups.filter(f => f.leadId === leadData.id && f.status !== 'Completed');

  const getStatusColor = (s) => {
    switch(s) {
      case 'New': return 'bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF]';
      case 'Contacted': return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Qualified': return 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400';
      case 'Won': return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Lost': return 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400';
      default: return 'bg-[#D2D2D7]/30 text-[#6E6E73] dark:bg-white/10 dark:text-[#A1A1A6]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity antialiased">
      <div 
        ref={panelRef}
        className="w-full max-w-4xl bg-[#F5F5F7] dark:bg-[#161617] h-full shadow-2xl flex flex-col transform transition-transform rounded-l-[24px] border-l border-[#D2D2D7]/80 dark:border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-5 bg-white/80 dark:bg-[#1D1D1F]/80 backdrop-blur-xl border-b border-[#D2D2D7]/60 dark:border-white/10 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h2 className="text-2xl font-semibold text-[#1D1D1F] dark:text-white tracking-[-0.28px]">{formData.company}</h2>
              <span className={`px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusColor(formData.status)}`}>
                {formData.status}
              </span>
              <span className={`px-3 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider border ${
                formData.priority === 'High' 
                  ? 'border-rose-200 text-rose-600 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400' 
                  : 'border-[#D2D2D7] text-[#6E6E73] dark:border-white/15 dark:text-[#A1A1A6]'
              }`}>
                {formData.priority} Priority
              </span>
            </div>
            <div className="text-xs font-medium text-[#6E6E73] dark:text-[#86868B] flex items-center space-x-4">
              <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#86868B]" /> {formData.contact}</span>
              <span className="flex items-center"><Target className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> {formData.value}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button 
               onClick={handleSave} 
               className="bg-[#0071E3] hover:bg-[#0076DF] text-white h-[44px] px-[21px] rounded-full font-medium transition-all shadow-xs text-sm cursor-pointer"
             >
               Save Changes
             </button>
             <button 
               onClick={onClose} 
               className="p-2 text-[#86868B] hover:bg-[#0000000A] dark:hover:bg-white/10 hover:text-[#1D1D1F] dark:hover:text-white rounded-full transition-colors cursor-pointer"
             >
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          
          {/* Left Column: Editable Details */}
          <div className="w-full md:w-[42%] bg-white dark:bg-[#1D1D1F] border-r border-[#D2D2D7]/60 dark:border-white/10 p-7 space-y-6">
            
            <div>
              <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-[0.12em] mb-4 border-b border-[#D2D2D7]/40 dark:border-white/10 pb-2">
                Lead Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Company</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={formData.company || ''} 
                    onChange={handleChange} 
                    className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3.5 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Contact Name</label>
                  <input 
                    type="text" 
                    name="contact" 
                    value={formData.contact || ''} 
                    onChange={handleChange} 
                    className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3.5 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Estimated Value</label>
                  <input 
                    type="text" 
                    name="value" 
                    value={formData.value || ''} 
                    onChange={handleChange} 
                    className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3.5 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Pipeline Status</label>
                    <select 
                      name="status" 
                      value={formData.status || ''} 
                      onChange={handleChange} 
                      className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Priority</label>
                    <select 
                      name="priority" 
                      value={formData.priority || ''} 
                      onChange={handleChange} 
                      className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6E6E73] dark:text-[#86868B] mb-1.5">Source</label>
                  <select 
                    name="source" 
                    value={formData.source || ''} 
                    onChange={handleChange} 
                    className="w-full h-[42px] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] px-3 text-sm bg-white dark:bg-[#161617] text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  >
                    <option value="Service Enquiry">Service Enquiry</option>
                    <option value="Expert Request">Expert Request</option>
                    <option value="Voice Requirement">Voice Requirement</option>
                    <option value="Partner Registration">Partner Registration</option>
                    <option value="Contact Form">Contact Form</option>
                    <option value="Import">Import</option>
                  </select>
                </div>
                
                {campaigns && (
                  <div className="mt-6 pt-4 border-t border-[#D2D2D7]/40 dark:border-white/10">
                    <label className="block text-xs font-semibold text-[#0071E3] mb-2 uppercase tracking-wide flex items-center">
                      <Send className="w-3.5 h-3.5 mr-1" /> Automation Sequence
                    </label>
                    <select 
                      name="enrollCampaignId" 
                      value={formData.enrollCampaignId || 'None'} 
                      onChange={handleChange} 
                      className="w-full h-[42px] border border-[#0071E3]/30 rounded-[11px] px-3 text-sm bg-[#0071E3]/5 text-[#0071E3] dark:text-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
                    >
                      <option value="None">-- Enroll in Email Sequence --</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Active Followups Box */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-[0.12em] mb-3 flex items-center">
                <MessageSquareCode className="w-4 h-4 mr-1.5 text-amber-500" /> Pending Action Items
              </h3>
              {leadFollowups.length > 0 ? (
                <div className="space-y-2.5">
                  {leadFollowups.map(fwp => (
                    <div key={fwp.id} className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-[14px]">
                      <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-amber-100">{fwp.title}</h4>
                      <div className="flex items-center text-xs text-[#6E6E73] dark:text-amber-200/70 mt-1">
                        <Clock className="w-3 h-3 mr-1" /> Due: {fwp.dueDate} {fwp.dueTime}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 border border-dashed border-[#D2D2D7] dark:border-white/15 rounded-[14px] text-center">
                  <p className="text-xs text-[#86868B]">No active follow-ups.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Timeline & Notes */}
          <div className="w-full md:w-[58%] bg-[#F5F5F7] dark:bg-[#161617] p-7 flex flex-col">
            <h3 className="text-xs font-semibold text-[#86868B] uppercase tracking-[0.12em] mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-[#0071E3]" /> Activity Timeline
            </h3>
            
            {/* Note Input */}
            <div className="mb-6 bg-white dark:bg-[#1D1D1F] p-4 rounded-[16px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0 text-xs font-bold">
                {currentUser.name.substring(0,2).toUpperCase()}
              </div>
              <div className="flex-1 flex flex-col items-end">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log a call, meeting, or internal note..."
                  className="w-full bg-transparent text-sm resize-none focus:outline-none h-16 text-[#1D1D1F] dark:text-white placeholder:text-[#86868B]"
                />
                <button 
                  onClick={handleAddNote} 
                  disabled={!newNote.trim()} 
                  className="mt-2 bg-[#1D1D1F] hover:bg-[#2D2D2F] dark:bg-white dark:text-[#1D1D1F] text-white h-[36px] px-[18px] rounded-full text-xs font-medium disabled:opacity-40 transition-all cursor-pointer"
                >
                  Log Note
                </button>
              </div>
            </div>

            {/* Timeline Feed */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-5 relative before:absolute before:inset-0 before:ml-[1.35rem] before:h-full before:w-px before:bg-[#D2D2D7] dark:before:bg-white/10">
              {leadActivities.length > 0 ? leadActivities.map((act) => (
                <div key={act.id} className="relative flex items-start gap-4 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#F5F5F7] dark:border-[#161617] shrink-0 shadow-xs ${
                    act.type.includes('note') 
                      ? 'bg-amber-500/10 text-amber-600' 
                      : act.type.includes('email') 
                      ? 'bg-[#0071E3]/10 text-[#0071E3]' 
                      : act.type.includes('status') 
                      ? 'bg-emerald-500/10 text-emerald-600' 
                      : 'bg-[#D2D2D7]/40 text-[#6E6E73]'
                  }`}>
                    {act.type.includes('note') ? <MessageSquareCode className="w-4 h-4" /> : act.type.includes('email') ? <Mail className="w-4 h-4" /> : act.type.includes('status') ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 bg-white dark:bg-[#1D1D1F] border border-[#D2D2D7]/80 dark:border-white/10 p-4 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] mt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-white">{act.subject}</h4>
                      <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">{new Date(act.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#6E6E73] dark:text-[#86868B] leading-relaxed">{act.description}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-[#D2D2D7]/30 dark:border-white/5 pt-2">
                       <span className="text-[10px] text-[#86868B] font-medium flex items-center">
                         By {MOCK_USERS[Object.keys(MOCK_USERS).find(k => MOCK_USERS[k].id === act.assigneeId)]?.name || 'System'}
                       </span>
                       <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                         act.outcome === 'Positive' 
                           ? 'bg-emerald-500/10 text-emerald-600' 
                           : act.outcome === 'Negative' 
                           ? 'bg-rose-500/10 text-rose-600' 
                           : 'bg-[#D2D2D7]/30 text-[#6E6E73]'
                       }`}>
                         {act.outcome}
                       </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-[#86868B] z-10 relative text-xs">No activities logged yet.</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
