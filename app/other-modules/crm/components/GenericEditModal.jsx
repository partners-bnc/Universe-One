"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * GenericEditModal
 * @param {boolean} isOpen 
 * @param {function} onClose 
 * @param {object} itemData - The data object to edit
 * @param {Array} fields - Array of field configs: { key: 'name', label: 'Company Name', type: 'text' }
 * @param {function} onSave - Callback with updated data object
 */
export default function GenericEditModal({ isOpen, onClose, itemData, fields, onSave, title = "Edit Record" }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (itemData) {
      setFormData({ ...itemData });
    }
  }, [itemData]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-opacity">
      <div className="bg-white dark:bg-[#1D1D1F] rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.18)] w-full max-w-lg overflow-hidden border border-[#D2D2D7]/80 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-4 border-b border-[#D2D2D7]/70 dark:border-white/10 bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-xl">
          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] dark:text-white/70 dark:hover:text-white hover:bg-[#E8E8ED] dark:hover:bg-white/15 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 max-h-[70vh] overflow-y-auto space-y-4">
          {fields.map(field => (
            <div key={field.key} className="flex flex-col">
              <label className="mb-1.5 text-[13px] font-medium text-[#1D1D1F] dark:text-white/90">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea 
                  className="w-full p-3.5 rounded-[11px] border border-[#D2D2D7] dark:border-white/15 bg-white dark:bg-[#2C2C2E] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] resize-none focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  rows={3}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  className="w-full h-[42px] px-3.5 rounded-[11px] border border-[#D2D2D7] dark:border-white/15 bg-white dark:bg-[#2C2C2E] text-[14px] text-[#1D1D1F] dark:text-white focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input 
                  type={field.type || 'text'}
                  className="w-full h-[42px] px-3.5 rounded-[11px] border border-[#D2D2D7] dark:border-white/15 bg-white dark:bg-[#2C2C2E] text-[14px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] focus:outline-none focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 transition-all"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 py-4 border-t border-[#D2D2D7]/70 dark:border-white/10 bg-[#F5F5F7]/80 dark:bg-[#1D1D1F]/80 backdrop-blur-md">
          <button 
            onClick={onClose}
            className="h-11 px-6 text-[14px] font-medium rounded-full border border-[#D2D2D7] dark:border-white/15 bg-white dark:bg-white/10 text-[#1D1D1F] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-white/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="h-11 px-7 text-[14px] font-semibold rounded-full bg-[#0071E3] hover:bg-[#0076DF] active:scale-[0.98] text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all"
          >
            Save Changes
          </button>
        </div>
        
      </div>
    </div>
  );
}
