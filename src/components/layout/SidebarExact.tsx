import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Network,
  Clock,
  CalendarOff,
  Coins,
  UserPlus,
  TrendingUp,
  GraduationCap,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  FileSpreadsheet,
  Megaphone,
  User
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface SidebarExactProps {
  onOpenAuthModal?: () => void;
}

export const SidebarExact: React.FC<SidebarExactProps> = ({ onOpenAuthModal }) => {
  const {
    activeSubTab,
    setActiveSubTab,
    setActiveModule,
    activeRole,
    currentUser,
    logoutUser,
    leaveRequests,
    candidates,
    announcements,
  } = useHR();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const myPendingLeaves = leaveRequests.filter(
    (l) => l.employeeId === currentEmpId && l.status === 'Pending'
  ).length;
  const pendingLeavesAdmin = leaveRequests.filter((l) => l.status === 'Pending').length;

  // Dedicated Employee Sidebar Navigation (7 distinct employee features)
  const employeeMenuItems = [
    {
      id: 'employee-ess',
      label: 'My Dashboard',
      icon: LayoutDashboard,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'attendance-overview',
      label: 'My Attendance',
      icon: Clock,
      module: 'attendance' as const,
      badge: null,
    },
    {
      id: 'leave-tracker',
      label: 'Time-Off & Leaves',
      icon: CalendarOff,
      module: 'attendance' as const,
      badge: myPendingLeaves > 0 ? myPendingLeaves : null,
    },
    {
      id: 'project-timesheets',
      label: 'My Timesheets',
      icon: FileSpreadsheet,
      module: 'attendance' as const,
      badge: null,
    },
    {
      id: 'employee-payslips',
      label: 'My Payslips',
      icon: Coins,
      module: 'employee' as const,
      badge: null,
    },
    {
      id: 'employee-announcements',
      label: 'Announcements',
      icon: Megaphone,
      module: 'employee' as const,
      badge: announcements.length > 0 ? announcements.length : null,
    },
    {
      id: 'employee-profile',
      label: 'My Profile & Security',
      icon: User,
      module: 'employee' as const,
      badge: null,
    },
  ];

  // Exact 13 items from Image 1 for Admin Console
  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Network,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Clock,
      module: 'attendance' as const,
      badge: null,
    },
    {
      id: 'leave-management',
      label: 'Leave management',
      icon: CalendarOff,
      module: 'attendance' as const,
      badge: pendingLeavesAdmin > 0 ? pendingLeavesAdmin : null,
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: Coins,
      module: 'payroll' as const,
      badge: null,
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      icon: UserPlus,
      module: 'talent' as const,
      badge: candidates.length > 0 ? candidates.length : null,
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      module: 'performance' as const,
      badge: null,
    },
    {
      id: 'training',
      label: 'Training',
      icon: GraduationCap,
      module: 'performance' as const,
      badge: null,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      module: 'performance' as const,
      badge: null,
    },
    {
      id: 'user-management',
      label: 'User management',
      icon: ShieldCheck,
      module: 'core' as const,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      module: 'settings' as const,
      badge: null,
    },
  ];

  const isEmployee = activeRole === 'employee';
  const menuItems = isEmployee ? employeeMenuItems : adminMenuItems;

  const handleNavClick = (item: (typeof menuItems)[0]) => {
    setActiveModule(item.module);
    setActiveSubTab(item.id);
  };

  return (
    <aside
      className={`hidden md:flex h-screen shrink-0 bg-[#F1F9FA] border-r border-[#E2EEEE] flex-col justify-between transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="flex flex-col min-h-0">
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E6F2F2]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Teal circular badge with white "A" or "E" */}
            <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
              {isEmployee ? 'E' : 'A'}
            </div>
            {!isCollapsed && (
              <span className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {isEmployee ? 'Employee Portal' : 'App'}
              </span>
            )}
          </div>

          {/* Collapse icon button [ | ] from Image 1 */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Section Label: MAIN vs MY WORKSPACE */}
        <div className="px-4 pt-4 pb-1.5">
          {!isCollapsed ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isEmployee ? 'MY WORKSPACE' : 'MAIN'}
            </p>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-2.5 space-y-1 pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if active: exact match or normalized match
            const isActive =
              activeSubTab === item.id ||
              (isEmployee && item.id === 'employee-ess' && (activeSubTab === 'dashboard' || activeSubTab === 'employee-ess')) ||
              (isEmployee && item.id === 'leave-tracker' && (activeSubTab === 'leave-tracker' || activeSubTab === 'employee-applications')) ||
              (isEmployee && item.id === 'attendance-overview' && (activeSubTab === 'attendance-overview' || activeSubTab === 'attendance')) ||
              (!isEmployee && item.id === 'dashboard' && activeSubTab === 'dashboard') ||
              (!isEmployee && item.id === 'payroll' && (activeSubTab === 'payroll-engine' || activeSubTab === 'payslip-studio')) ||
              (!isEmployee && item.id === 'leave-management' && (activeSubTab === 'leave-tracker' || activeSubTab === 'applications')) ||
              (!isEmployee && item.id === 'attendance' && (activeSubTab === 'attendance-overview' || activeSubTab === 'project-timesheets')) ||
              (!isEmployee && item.id === 'organization' && activeSubTab === 'org-chart') ||
              (!isEmployee && item.id === 'recruitment' && activeSubTab === 'ats') ||
              (!isEmployee && item.id === 'training' && activeSubTab === 'lms') ||
              (!isEmployee && item.id === 'documents' && activeSubTab === 'document-vault') ||
              (!isEmployee && item.id === 'user-management' && activeSubTab === 'rbac') ||
              (!isEmployee && item.id === 'settings' && activeSubTab === 'company-profile');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#A7F3D0] text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                } ${isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-slate-900 stroke-[2.2]'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate tracking-tight">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0F766E] text-white shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section (Light/Dark pill switch from Image 2) */}
      <div className="p-3 border-t border-[#E6F2F2] flex flex-col gap-2 bg-[#F1F9FA]/80">
        {!isCollapsed ? (
          <div className="flex items-center bg-[#E1EFF0] p-1 rounded-xl">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Dark</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl bg-[#E1EFF0] text-slate-700 hover:bg-white transition-colors cursor-pointer"
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} mode`}
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
          </button>
        )}

        {/* User profile & Sign out */}
        <div className="flex items-center justify-between pt-1">
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                  {currentUser?.name || 'Amara Morgan'}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-tight capitalize">
                  {currentUser?.role || activeRole}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logoutUser}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
