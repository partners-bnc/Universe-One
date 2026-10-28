"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Activity,
  CheckSquare,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Mail,
  ChevronLeft,
  Moon,
  Sun,
  MessageSquareCode,
  Database,
  Megaphone,
  Rocket,
  LayoutGrid,
  FolderKanban,
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

const SidebarItem = ({ icon: Icon, label, href, isCollapsed, badge }) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  return (
    <Link
      href={href || '#'}
      className={`group flex items-center h-[38px] cursor-pointer transition-all duration-150 rounded-full mx-2.5 ${
        isActive
          ? 'bg-[#0071E3] text-white shadow-xs font-medium'
          : 'text-[#1D1D1F] dark:text-[#E8E8ED] hover:bg-[#0000000A] dark:hover:bg-white/5'
      } ${isCollapsed ? 'justify-center px-0' : 'px-3.5'}`}
      title={isCollapsed ? label : undefined}
    >
      <div className={`${badge ? 'relative' : ''} flex-shrink-0`}>
        <Icon className={`w-4.5 h-4.5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-[#6E6E73] group-hover:text-[#1D1D1F] dark:group-hover:text-white transition-colors'}`} />
        {isCollapsed && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full" />
        )}
      </div>
      {!isCollapsed && (
        <>
          <span className="text-[13px] truncate flex-1 tracking-tight">{label}</span>
          {badge > 0 && (
            <span className={`text-[10px] font-bold min-w-[18px] h-4.5 flex items-center justify-center px-1.5 rounded-full ml-auto ${
              isActive ? 'bg-white text-[#0071E3]' : 'bg-[#FF3B30] text-white'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

const SectionLabel = ({ label, isCollapsed }) => {
  if (isCollapsed) return <div className="w-6 mx-auto my-2 border-t border-[#D2D2D7] dark:border-white/10" />;
  return (
    <div className="px-5 pt-3.5 pb-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868B]">{label}</span>
    </div>
  );
};

const Divider = () => (
  <div className="my-2 border-t border-[#D2D2D7]/60 dark:border-white/10 mx-4" />
);

const Sidebar = () => {
  const { isDarkMode, toggleDarkMode, permissions, isSidebarCollapsed, toggleSidebar, followups, tasks, currentUser } = useCrm();

  const canViewDashboard = ['admin', 'manager'].includes(currentUser.role);

  return (
    <aside
      className={`flex flex-col h-screen bg-white/80 dark:bg-[#1D1D1F]/80 backdrop-blur-xl text-[#1D1D1F] dark:text-[#F5F5F7] flex-shrink-0 border-r border-[#D2D2D7] dark:border-white/10 transition-all duration-200 ease-in-out select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-56'
      }`}
    >
      {/* Header / Brand */}
      <div className={`flex items-center h-16 border-b border-[#D2D2D7]/60 dark:border-white/10 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-[-0.28px] text-[#1D1D1F] dark:text-white">
              BnC CRM
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-full hover:bg-[#0000000A] dark:hover:bg-white/10 transition-colors text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white shrink-0 cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`w-4.5 h-4.5 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col py-3 space-y-1 overflow-y-auto scrollbar-hide">
        {canViewDashboard && (
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/other-modules/crm/dashboard" isCollapsed={isSidebarCollapsed} />
        )}
        <SidebarItem icon={Users} label="Lead Tracking" href="/other-modules/crm/leads" isCollapsed={isSidebarCollapsed} />
        <SidebarItem icon={FolderKanban} label="Lead Lists" href="/other-modules/crm/lists" isCollapsed={isSidebarCollapsed} />
        <SidebarItem icon={MessageSquareCode} label="Follow-ups" href="/other-modules/crm/followups" isCollapsed={isSidebarCollapsed} />
        {permissions.canManageEmailTemplates && (
          <SidebarItem icon={Rocket} label="Campaigns" href="/other-modules/crm/campaigns" isCollapsed={isSidebarCollapsed} />
        )}
        {permissions.canManageEmailTemplates && (
          <SidebarItem icon={Mail} label="Email Templates" href="/other-modules/crm/templates" isCollapsed={isSidebarCollapsed} />
        )}

        <Divider />

        <SidebarItem icon={CalendarIcon} label="Calendar" href="/other-modules/crm/calendar" isCollapsed={isSidebarCollapsed} />
        <SidebarItem icon={LinkIcon} label="Lead Sources" href="/other-modules/crm/sources" isCollapsed={isSidebarCollapsed} />
        <SidebarItem icon={CheckSquare} label="Task Manager" href="/Taskmanager/dashboard" isCollapsed={isSidebarCollapsed} />
        <SidebarItem icon={LayoutGrid} label="All Modules" href="/other-modules" isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Theme Toggle */}
      <div
        className={`p-3 border-t border-[#D2D2D7]/60 dark:border-white/10 bg-transparent ${
          isSidebarCollapsed ? 'flex justify-center' : 'flex items-center justify-between px-5'
        }`}
      >
        {!isSidebarCollapsed && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868B]">
            Appearance
          </span>
        )}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-[#0000000A] dark:hover:bg-white/10 transition-colors text-[#6E6E73] dark:text-[#A1A1A6] cursor-pointer"
          title="Toggle Appearance"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#6E6E73]" />
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `
      }} />
    </aside>
  );
};

export default Sidebar;

