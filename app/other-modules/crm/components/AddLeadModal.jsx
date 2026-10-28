import React, { useState } from 'react';
import { X, User, Building2, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AddLeadModal({ isOpen, onClose, onAdd }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    leadName: '',
    email: '',
    phone: '',
    phoneSecondary: '',
    customerName: '',
    companyName: '',
    jobTitle: '',
    industry: '',
    leadSource: '',
    status: 'New',
    priority: 'Medium',
    value: '',
    currency: 'USD'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.leadName) {
      toast.warning("Lead Name is required.");
      return;
    }
    
    // Pass transformed data back up
    onAdd({
      id: Math.floor(Math.random() * 1000) + 100,
      company: formData.companyName || "Unknown Company",
      contact: formData.leadName,
      value: formData.value ? `$${formData.value}` : "$0",
      status: formData.status,
      // Need assigneeId injected at parent, or pass it here
    });
    
    // Reset and close
    setFormData({
      leadName: '', email: '', phone: '', phoneSecondary: '', customerName: '', companyName: '', jobTitle: '', industry: '', leadSource: '', status: 'New', priority: 'Medium', value: '', currency: 'USD'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] w-full max-w-3xl rounded-[24px] border border-[#D2D2D7]/80 dark:border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Apple Frosted Style */}
        <div className="bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl px-7 py-4 flex items-center justify-between text-[#1D1D1F] dark:text-white border-b border-[#D2D2D7]/70 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 dark:bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
              <span className="text-lg font-semibold leading-none">+</span>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">
                Add New Lead
              </h2>
              <p className="text-[12px] text-[#86868B]">Enter contact and company information to track prospective deals</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-white/70 dark:hover:text-white hover:bg-[#E8E8ED] dark:hover:bg-white/15 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-7 overflow-y-auto max-h-[72vh] space-y-7">
          <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-7">
            
            {/* Basic Information Section */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white mb-4 pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <User className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Lead Name *</label>
                  <input 
                    type="text" 
                    name="leadName" 
                    placeholder="Full name"
                    value={formData.leadName} 
                    onChange={handleChange} 
                    required 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="email@example.com"
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Phone (Secondary)</label>
                  <input 
                    type="tel" 
                    name="phoneSecondary" 
                    placeholder="Alternative number"
                    value={formData.phoneSecondary} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
              </div>
            </section>

            {/* Company Details Section */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white mb-4 pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <Building2 className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Company Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Customer Name</label>
                  <input 
                    type="text" 
                    name="customerName" 
                    placeholder="Search or type customer name" 
                    value={formData.customerName} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName" 
                    placeholder="Organization name"
                    value={formData.companyName} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Job Title</label>
                  <input 
                    type="text" 
                    name="jobTitle" 
                    placeholder="e.g. VP of Product"
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Industry</label>
                  <select 
                    name="industry" 
                    value={formData.industry} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Industry</option>
                    <option value="Tech">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Classification Section */}
            <section className="bg-[#F5F5F7]/60 dark:bg-white/[0.03] p-5 rounded-[16px] border border-[#D2D2D7]/50 dark:border-white/5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] dark:text-white mb-4 pb-2 border-b border-[#D2D2D7]/50 dark:border-white/10">
                <Tag className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-[13px] uppercase tracking-wider font-semibold">Classification & Valuation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Lead Source</label>
                  <select 
                    name="leadSource" 
                    value={formData.leadSource} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="">Select Source</option>
                    <option value="Service Enquiry">Service Enquiry</option>
                    <option value="Expert Request">Expert Request</option>
                    <option value="Voice Requirement">Voice Requirement</option>
                    <option value="Partner Registration">Partner Registration</option>
                    <option value="Contact Form">Contact Form</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Lead Status</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Won">Won</option>
                  </select>
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
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Estimated Value</label>
                  <input 
                    type="text" 
                    name="value" 
                    placeholder="e.g. 25000"
                    value={formData.value} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-white dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#1D1D1F] dark:text-white/90 mb-1.5">Currency</label>
                  <input 
                    type="text" 
                    name="currency" 
                    value={formData.currency} 
                    onChange={handleChange} 
                    className="w-full h-[42px] px-3.5 bg-[#F5F5F7] dark:bg-white/5 border border-[#D2D2D7] dark:border-white/15 rounded-[11px] text-[14px] text-[#1D1D1F] dark:text-white font-medium" 
                    readOnly 
                  />
                </div>
              </div>
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
            form="add-lead-form"
            className="h-11 px-7 rounded-full text-[14px] font-semibold text-white bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
          >
            Save Lead
          </button>
        </div>

      </div>
    </div>
  );
}
