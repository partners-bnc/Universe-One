import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AddTemplateModal({ isOpen, onClose, onAdd }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subject: '',
    body: '',
    variables: '{{Lead_Name}}, {{Company_Name}}',
    status: 'Draft'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) {
      toast.warning("Template Name and Subject Line are required.");
      return;
    }
    onAdd({
      id: Math.floor(Math.random() * 1000) + 700,
      name: formData.name,
      category: formData.category || "General",
      subject: formData.subject,
      body: formData.body,
      variables: formData.variables,
      status: formData.status
    });
    setFormData({ name: '', category: '', subject: '', body: '', variables: '{{Lead_Name}}, {{Company_Name}}', status: 'Draft' });
    onClose();
  };

  const availableVars = "{{Lead_Name}}, {{Company_Name}}, {{Product_Name}}, {{Agent_Name}}, {{Estimated_Value}}, {{Currency}}";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] w-full max-w-xl rounded-[24px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl px-7 py-4 flex items-center justify-between text-[#1D1D1F] dark:text-white border-b border-[#D2D2D7]/70 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">
                Create Email Template
              </h2>
              <p className="text-[12px] text-[#86868B]">Draft reusable personalized templates with placeholders</p>
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
        <div className="p-7 overflow-y-auto flex-1 space-y-5">
          <form id="add-template-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Template Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Initial Outreach" 
                  required 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Outreach">Outreach</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Subject Line *</label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="e.g. Exploring Partnership with {{Company_Name}}" 
                required 
                className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Body Content *</label>
              <textarea 
                name="body" 
                value={formData.body} 
                onChange={handleChange} 
                rows={6} 
                placeholder="Write your email template content here..."
                className="w-full p-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] resize-none focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
              />
              <p className="text-[12px] text-[#86868B] mt-2 flex items-center gap-1">
                <span>ℹ</span> Placeholders: <span className="text-[#0071E3]">{availableVars}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Active Variables</label>
                <input 
                  type="text" 
                  name="variables" 
                  value={formData.variables} 
                  onChange={handleChange} 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Status</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

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
            form="add-template-form" 
            className="h-11 px-7 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
