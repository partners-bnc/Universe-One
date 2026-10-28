"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCrm } from '../context/CrmContext';
import {
  Search,
  LayoutDashboard,
  Users,
  Activity,
  CheckSquare,
  Calendar,
  Link as LinkIcon,
  Mail,
  Zap,
  ArrowRight,
  Command,
  FolderKanban,
} from 'lucide-react';

const PAGES = [
  { label: 'Dashboard', path: '/other-modules/crm/dashboard', icon: LayoutDashboard },
  { label: 'Lead Tracking', path: '/other-modules/crm/leads', icon: Users },
  { label: 'Lead Lists & Buckets', path: '/other-modules/crm/lists', icon: FolderKanban },
  { label: 'Tasks', path: '/other-modules/crm/tasks', icon: CheckSquare },
  { label: 'Follow-ups', path: '/other-modules/crm/followups', icon: Calendar },
  { label: 'Calendar', path: '/other-modules/crm/calendar', icon: Calendar },
  { label: 'Lead Sources', path: '/other-modules/crm/sources', icon: LinkIcon },
  { label: 'Email Templates', path: '/other-modules/crm/templates', icon: Mail },
  { label: 'Campaigns', path: '/other-modules/crm/campaigns', icon: Zap },
];

const MAX_PER_CATEGORY = 5;

const statusColors = {
  New: 'bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF] border border-[#0071E3]/20',
  Contacted: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20',
  Qualified: 'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20',
  Won: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20',
  Lost: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20',
};

const priorityColors = {
  High: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20',
  Low: 'bg-[#F5F5F7] text-[#6E6E73] dark:bg-white/10 dark:text-white/70 border border-[#D2D2D7]/60 dark:border-white/10',
};

const taskStatusColors = {
  Pending: 'bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0071E3]/20 dark:text-[#2997FF] border border-[#0071E3]/20',
  'In Progress': 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20',
  Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20',
  Overdue: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/20',
  Cancelled: 'bg-[#F5F5F7] text-[#6E6E73] dark:bg-white/10 dark:text-white/70 border border-[#D2D2D7]/60 dark:border-white/10',
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const router = useRouter();
  const { leads, tasks } = useCrm();

  // Toggle open/close with Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Delay to ensure the DOM has rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Build filtered results
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const sections = [];

    // Pages
    const filteredPages = PAGES.filter((p) =>
      p.label.toLowerCase().includes(q)
    ).slice(0, MAX_PER_CATEGORY);
    if (filteredPages.length > 0) {
      sections.push({
        title: 'Pages',
        items: filteredPages.map((p) => ({
          type: 'page',
          label: p.label,
          path: p.path,
          icon: p.icon,
        })),
      });
    }

    // Leads
    if (q.length > 0) {
      const filteredLeads = leads
        .filter(
          (l) =>
            l.company?.toLowerCase().includes(q) ||
            l.contact?.toLowerCase().includes(q)
        )
        .slice(0, MAX_PER_CATEGORY);
      if (filteredLeads.length > 0) {
        sections.push({
          title: 'Leads',
          items: filteredLeads.map((l) => ({
            type: 'lead',
            label: l.company,
            subtitle: l.contact,
            status: l.status,
            value: l.value,
            path: '/other-modules/crm/leads',
          })),
        });
      }

      // Tasks
      const filteredTasks = tasks
        .filter((t) => t.title?.toLowerCase().includes(q))
        .slice(0, MAX_PER_CATEGORY);
      if (filteredTasks.length > 0) {
        sections.push({
          title: 'Tasks',
          items: filteredTasks.map((t) => ({
            type: 'task',
            label: t.title,
            status: t.status,
            priority: t.priority,
            path: '/other-modules/crm/tasks',
          })),
        });
      }
    }

    return sections;
  }, [query, leads, tasks]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    return results.flatMap((section) => section.items);
  }, [results]);

  // Clamp selectedIndex when results change
  useEffect(() => {
    if (selectedIndex >= flatItems.length) {
      setSelectedIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, selectedIndex]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      if (item?.path) {
        router.push(item.path);
      }
      close();
    },
    [router, close]
  );

  // Keyboard navigation inside the palette
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatItems.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatItems.length - 1
        );
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          handleSelect(flatItems[selectedIndex]);
        }
      }
    },
    [flatItems, selectedIndex, handleSelect, close]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector('[data-selected="true"]');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] p-4 animate-in fade-in duration-150"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[620px] rounded-[22px] border border-[#D2D2D7]/80 dark:border-white/10 bg-white/90 dark:bg-[#1D1D1F]/90 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.22)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D2D2D7]/70 dark:border-white/10">
          <Search className="w-5 h-5 text-[#0071E3] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search pages, leads, tasks..."
            className="flex-1 bg-transparent text-[16px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-[6px] bg-[#F5F5F7] dark:bg-white/10 border border-[#D2D2D7]/60 dark:border-white/10 text-[11px] font-medium text-[#6E6E73] dark:text-white/70 select-none">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2.5 px-2 scroll-smooth space-y-1">
          {results.length === 0 && query.length > 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="w-8 h-8 text-[#86868B] mb-2.5 opacity-60" />
              <p className="text-[14px] font-medium text-[#1D1D1F] dark:text-white">
                No results found
              </p>
              <p className="text-[12px] text-[#86868B] mt-0.5">
                Try searching with different keywords
              </p>
            </div>
          )}

          {results.length === 0 && query.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Command className="w-8 h-8 text-[#86868B] mb-2.5 opacity-60" />
              <p className="text-[14px] font-medium text-[#1D1D1F] dark:text-white">
                Spotlight Search
              </p>
              <p className="text-[12px] text-[#86868B] mt-0.5">
                Quick jump to pages, active leads, and team tasks
              </p>
            </div>
          )}

          {results.map((section) => (
            <div key={section.title} className="mb-2">
              {/* Section Header */}
              <div className="px-4 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
                  {section.title}
                </span>
              </div>

              {/* Items */}
              {section.items.map((item) => {
                flatIndex++;
                const isSelected = flatIndex === selectedIndex;
                const currentIdx = flatIndex;

                return (
                  <button
                    key={`${item.type}-${item.label}-${currentIdx}`}
                    data-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(currentIdx)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-left transition-all duration-100 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)]'
                        : 'hover:bg-[#F5F5F7] dark:hover:bg-white/5 text-[#1D1D1F] dark:text-white'
                    }`}
                  >
                    {/* Icon */}
                    {item.type === 'page' && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#F5F5F7] text-[#1D1D1F] dark:bg-white/10 dark:text-white'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'lead' && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'task' && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        <CheckSquare className="w-4 h-4" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[14px] font-medium truncate ${
                            isSelected ? 'text-white' : 'text-[#1D1D1F] dark:text-white'
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Status badge for leads/tasks */}
                        {item.type === 'lead' && item.status && (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : statusColors[item.status] || 'bg-[#F5F5F7] text-[#6E6E73]'
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                        {item.type === 'task' && item.status && (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : taskStatusColors[item.status] || 'bg-[#F5F5F7] text-[#6E6E73]'
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                        {item.type === 'task' && item.priority && (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                              isSelected
                                ? 'bg-white/25 text-white'
                                : priorityColors[item.priority] || 'bg-[#F5F5F7] text-[#6E6E73]'
                            }`}
                          >
                            {item.priority}
                          </span>
                        )}
                      </div>

                      {/* Subtitle for leads */}
                      {item.type === 'lead' && (
                        <p
                          className={`text-[12px] truncate mt-0.5 ${
                            isSelected ? 'text-white/80' : 'text-[#86868B]'
                          }`}
                        >
                          {item.subtitle}
                          {item.value && (
                            <span
                              className={`ml-2 font-semibold ${
                                isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {item.value}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-all duration-150 ${
                        isSelected
                          ? 'opacity-100 text-white translate-x-0'
                          : 'opacity-0 -translate-x-1 text-[#86868B]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#D2D2D7]/70 dark:border-white/10 bg-[#F5F5F7]/80 dark:bg-[#1D1D1F]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 text-[11px] text-[#86868B]">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white dark:bg-white/10 border border-[#D2D2D7]/60 dark:border-white/10 font-semibold text-[#1D1D1F] dark:text-white">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white dark:bg-white/10 border border-[#D2D2D7]/60 dark:border-white/10 font-semibold text-[#1D1D1F] dark:text-white">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-[5px] bg-white dark:bg-white/10 border border-[#D2D2D7]/60 dark:border-white/10 font-semibold text-[#1D1D1F] dark:text-white">
                esc
              </kbd>
              close
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#86868B] font-medium">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Fade-in animation style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInPalette {
          from { opacity: 0; transform: scale(0.98) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: fadeInPalette 0.15s ease-out both; }
      `}} />
    </div>
  );
}
