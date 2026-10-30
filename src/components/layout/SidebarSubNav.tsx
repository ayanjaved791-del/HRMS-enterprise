import React from 'react';
import {
  Users,
  Network,
  Clock,
  Camera,
  FileSpreadsheet,
  CalendarDays,
  Coins,
  Receipt,
  Gift,
  Globe2,
  Calculator,
  FileText,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Target,
  BarChart3,
  Building,
  UserCircle2,
  ChevronRight,
  Megaphone,
  FileCheck2,
  Palette,
  KeyRound,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface SubNavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number | null;
}

export const SidebarSubNav: React.FC = () => {
  const {
    activeModule,
    activeSubTab,
    setActiveSubTab,
    activeRole,
    company,
    leaveRequests,
    expenseClaims,
    announcements,
  } = useHR();

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingExpenses = expenseClaims.filter((e) => e.status === 'Pending').length;
  const totalPendingApps = pendingLeaves + pendingExpenses;

  const getSubNavItems = (): SubNavItem[] => {
    if (activeRole === 'admin') {
      switch (activeModule) {
        case 'core':
          return [
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
            { id: 'employees', label: 'Staff Management & Directory', icon: Users },
            {
              id: 'applications',
              label: 'Applications & Approvals',
              icon: FileCheck2,
              badge: totalPendingApps > 0 ? totalPendingApps : null,
            },
            {
              id: 'announcements',
              label: 'Broadcast Announcements',
              icon: Megaphone,
              badge: announcements.length > 0 ? announcements.length : null,
            },
            { id: 'org-chart', label: 'Dynamic Org Chart', icon: Network },
          ];

        case 'attendance':
          return [
            { id: 'attendance-overview', label: 'Biometric Daily Logs', icon: Clock },
            { id: 'project-timesheets', label: 'Project Timesheets', icon: FileSpreadsheet },
            { id: 'holiday-calendar', label: 'Company Holiday Calendar', icon: CalendarDays },
          ];

        case 'payroll':
          return [
            { id: 'payslip-studio', label: 'Custom Payslip Designer', icon: Palette },
            { id: 'payroll-engine', label: 'Monthly Payroll Disbursal', icon: Coins },
            { id: 'tax-calculator', label: 'Statutory Tax Calculator', icon: Calculator },
          ];

        case 'settings':
          return [
            { id: 'company-profile', label: 'Company Profile & Geofence', icon: Building },
          ];

        default:
          return [
            { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
          ];
      }
    } else {
      // Employee Portal Sub-nav
      switch (activeModule) {
        case 'core':
          return [
            { id: 'employee-ess', label: 'My Personal Dashboard', icon: UserCircle2 },
            {
              id: 'employee-announcements',
              label: 'Company Announcements',
              icon: Megaphone,
              badge: announcements.length > 0 ? announcements.length : null,
            },
            { id: 'employee-applications', label: 'My Applications & Requests', icon: FileCheck2 },
            { id: 'employee-payslips', label: 'My Payslips & Compensation', icon: FileText },
            { id: 'employee-profile', label: 'My Profile & Credentials', icon: User },
          ];

        case 'attendance':
          return [
            { id: 'attendance-overview', label: 'My Attendance Logs', icon: Clock },
            { id: 'project-timesheets', label: 'My Timesheet Logs', icon: FileSpreadsheet },
          ];

        case 'payroll':
          return [
            { id: 'employee-payslips', label: 'My Payslips & Vouchers', icon: FileText },
          ];

        default:
          return [
            { id: 'employee-ess', label: 'My Personal Dashboard', icon: UserCircle2 },
          ];
      }
    }
  };

  const navItems = getSubNavItems();

  const getModuleTitle = () => {
    if (activeRole === 'admin') {
      switch (activeModule) {
        case 'core':
          return { title: 'Admin Console', subtitle: 'Workforce governance' };
        case 'attendance':
          return { title: 'Time & Attendance', subtitle: 'Biometrics & logs' };
        case 'payroll':
          return { title: 'Compensation', subtitle: 'Custom payslips & payroll' };
        case 'settings':
          return { title: 'Settings', subtitle: 'Corporate configurations' };
        default:
          return { title: 'Workspace', subtitle: 'System navigation' };
      }
    } else {
      switch (activeModule) {
        case 'core':
          return { title: 'Employee Portal', subtitle: 'Personal operations' };
        case 'attendance':
          return { title: 'My Attendance', subtitle: 'Camera punches & logs' };
        case 'payroll':
          return { title: 'My Payslips', subtitle: 'Salary statements' };
        default:
          return { title: 'Employee ESS', subtitle: 'Personal operations' };
      }
    }
  };

  const { title, subtitle } = getModuleTitle();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 hidden md:flex flex-col z-20 select-none">
      {/* Module Title Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Nav List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-50 text-orange-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Company Branding */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">{company.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-bold text-slate-600 uppercase">
          {activeRole}
        </span>
      </div>
    </aside>
  );
};
