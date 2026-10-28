"use client";

import React from 'react';
import { useCrm, MOCK_USERS } from '../context/CrmContext';

const COLUMNS = ['New', 'Contacted', 'Qualified', 'Won'];

export default function KanbanBoard({ leads, setLeads, onLeadClick }) {
  const { currentUser, permissions } = useCrm();

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData("leadId", leadId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necessary to allow dropping
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (permissions.isReadOnly) return;

    const leadId = parseInt(e.dataTransfer.getData("leadId"));
    if (!leadId) return;

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: targetStatus } : lead
      )
    );
  };

  const getUserName = (id) => {
    const user = Object.values(MOCK_USERS).find(u => u.id === id);
    return user ? user.name : "Unassigned";
  };

  return (
    <div className="mt-8 bg-white dark:bg-[#1D1D1F] rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/80 dark:border-white/10 p-6 transition-colors duration-200 antialiased">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#1D1D1F] dark:text-white tracking-[-0.28px]">Pipeline Kanban</h2>
          <p className="text-xs text-[#6E6E73] dark:text-[#86868B] mt-0.5">Drag and drop leads between pipeline phases.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(status => {
          const columnLeads = leads.filter(l => l.status === status);
          
          return (
            <div 
              key={status}
              className="bg-[#F5F5F7] dark:bg-[#161617] rounded-[16px] p-3.5 border border-[#D2D2D7]/60 dark:border-white/5 min-h-[420px] flex flex-col transition-colors duration-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="flex justify-between items-center mb-3.5 px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F] dark:text-white">{status}</h3>
                <span className="bg-white dark:bg-[#1D1D1F] text-[#6E6E73] dark:text-[#A1A1A6] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#D2D2D7]/60 dark:border-white/10 shadow-2xs">
                  {columnLeads.length}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col space-y-2.5">
                {columnLeads.map(lead => {
                  const isOwner = lead.assigneeId === currentUser.id;
                  const canDrag = !permissions.isReadOnly;

                  return (
                    <div
                      key={lead.id}
                      draggable={canDrag}
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={(e) => { e.stopPropagation(); onLeadClick?.(lead); }}
                      className={`bg-white dark:bg-[#1D1D1F] p-4 rounded-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#D2D2D7]/80 dark:border-white/10 relative transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-[#0071E3]/50 ${
                        canDrag ? 'cursor-pointer active:cursor-grabbing' : 'cursor-pointer opacity-90'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#1D1D1F] dark:text-white mb-1 tracking-tight">
                        {lead.company}
                      </div>
                      <div className="text-xs text-[#6E6E73] dark:text-[#86868B] mb-3 truncate">
                        {lead.contact}
                      </div>
                      <div className="flex justify-between items-center mt-auto pt-2.5 border-t border-[#D2D2D7]/40 dark:border-white/10">
                        <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">{lead.value}</span>
                        <div 
                          className="w-6 h-6 rounded-full bg-[#F5F5F7] dark:bg-white/10 flex items-center justify-center text-[10px] font-semibold text-[#1D1D1F] dark:text-white relative border border-[#D2D2D7]/40 dark:border-transparent"
                          title={getUserName(lead.assigneeId)}
                        >
                          {getUserName(lead.assigneeId).substring(0,2).toUpperCase()}
                          {isOwner && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0071E3] border border-white dark:border-[#1D1D1F] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {columnLeads.length === 0 && (
                  <div className="text-center py-6 text-xs text-[#86868B] border border-dashed border-[#D2D2D7] dark:border-white/10 rounded-[12px] h-32 flex items-center justify-center">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

