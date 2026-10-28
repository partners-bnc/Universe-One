import React, { useState } from 'react';
import { X, Phone, FileText, Paperclip } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import MOCK_DATA from '../data/mockData.json';

export default function AddActivityModal({ isOpen, onClose, onAdd }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    leadId: '',
    type: 'admin note added',
    subject: '',
    description: '',
    outcome: '',
    nextAction: '',
    duration: '',
    callStatus: 'N/A',
    participants: '',
    attachmentUrl: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.leadId || !formData.subject) {
      toast.warning("Lead and Subject are required.");
      return;
    }
    onAdd({
      id: "ACT" + (Math.floor(Math.random() * 900) + 100),
      type: formData.type,
      date: new Date().toISOString().split('T')[0],
      subject: formData.subject,
      description: formData.description,
      outcome: formData.outcome || "Neutral",
      duration: formData.duration ? formData.duration + " min" : "-",
      assigneeId: "u1",
      leadId: parseInt(formData.leadId)
    });
    setFormData({ leadId: '', type: 'admin note added', subject: '', description: '', outcome: '', nextAction: '', duration: '', callStatus: 'N/A', participants: '', attachmentUrl: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] w-full max-w-2xl rounded-[24px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl px-7 py-4 flex items-center justify-between text-[#1D1D1F] dark:text-white border-b border-[#D2D2D7]/70 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <span className="text-lg font-semibold leading-none">+</span>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">
                Log Activity
              </h2>
              <p className="text-[12px] text-[#86868B]">Record calls, emails, notes, and milestones</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-white/70 dark:hover:text-white hover:bg-[#E8E8ED] dark:hover:bg-white/15 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-7 overflow-y-auto flex-1 space-y-6">
          <form id="add-activity-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Activity Details */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <Phone className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Activity Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Associated Lead *</label>
                  <select 
                    name="leadId" 
                    value={formData.leadId} 
                    onChange={handleChange} 
                    required 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Lead</option>
                    {MOCK_DATA.leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.contact} ({lead.company})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Activity Type *</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="registered">registered</option>
                    <option value="logged in">logged in</option>
                    <option value="profile updated">profile updated</option>
                    <option value="AI profile submitted">AI profile submitted</option>
                    <option value="agreement signed">agreement signed</option>
                    <option value="requirement submitted">requirement submitted</option>
                    <option value="WhatsApp sent">WhatsApp sent</option>
                    <option value="email sent">email sent</option>
                    <option value="call completed">call completed</option>
                    <option value="admin note added">admin note added</option>
                    <option value="status changed">status changed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Subject *</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="e.g. Introduction call with Operations head"
                  required 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
            </section>

            {/* Description & Outcome */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <FileText className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Description & Outcome</h3>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Summary / Notes</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={3} 
                  placeholder="Key discussion points and remarks..."
                  className="w-full p-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] resize-none focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Outcome</label>
                  <select 
                    name="outcome" 
                    value={formData.outcome} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Outcome</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Next Action</label>
                  <input 
                    type="text" 
                    name="nextAction" 
                    placeholder="e.g. Follow up in 3 days"
                    value={formData.nextAction} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Duration (Mins)</label>
                  <input 
                    type="number" 
                    name="duration" 
                    placeholder="e.g. 15"
                    value={formData.duration} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
              </div>
            </section>

            {/* Call Details — only if type is call completed */}
            {(formData.type === 'call completed') && (
              <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                  <Phone className="w-4 h-4 text-[#0071E3]" />
                  <h3 className="text-[13px] uppercase tracking-wider font-semibold">Call Details</h3>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Call Status</label>
                  <select 
                    name="callStatus" 
                    value={formData.callStatus} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="N/A">N/A</option>
                    <option value="Completed">Completed</option>
                    <option value="No Answer">No Answer</option>
                    <option value="Voicemail">Voicemail</option>
                  </select>
                </div>
              </section>
            )}

            {/* Additional */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <Paperclip className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Additional Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Participants</label>
                  <input 
                    type="text" 
                    name="participants" 
                    placeholder="e.g. John Doe, Sarah Smith"
                    value={formData.participants} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Attachment URL</label>
                  <input 
                    type="text" 
                    name="attachmentUrl" 
                    value={formData.attachmentUrl} 
                    onChange={handleChange} 
                    placeholder="https://" 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
              </div>
            </section>

          </form>
        </div>

        {/* Footer */}
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
            form="add-activity-form" 
            className="h-11 px-7 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
}
