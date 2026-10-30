import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Wallet,
  Users2,
  FileCheck2,
  Megaphone,
  Palette,
  ShieldCheck,
  Building2,
  User,
  LogOut,
  FolderLock
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface SidebarPrimaryProps {
  onOpenAuthModal: () => void;
}

export const SidebarPrimary: React.FC<SidebarPrimaryProps> = ({ onOpenAuthModal }) => {
  const {
    activeModule,
    setActiveModule,
    setActiveSubTab,
    activeRole,
    currentUser,
    leaveRequests,
    expenseClaims,
    announcements,
    logoutUser,
    company
  } = useHR();

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingExpenses = expenseClaims.filter((e) => e.status === 'Pending').length;
  const totalPendingApps = pendingLeaves + pendingExpenses;

  // Role-specific primary modules
  const adminModules = [
    {
      id: 'core' as const,
      label: 'Core Admin',
      icon: LayoutDashboard,
      defaultTab: 'dashboard',
      badge: totalPendingApps > 0 ? totalPendingApps : null,
    },
    {
      id: 'attendance' as const,
      label: 'Attendance',
      icon: Clock,
      defaultTab: 'attendance-overview',
      badge: null,
    },
    {
      id: 'payroll' as const,
      label: 'Compensation',
      icon: Wallet,
      defaultTab: 'payslip-studio',
      badge: null,
    },
    {
      id: 'settings' as const,
      label: 'Company',
      icon: Building2,
      defaultTab: 'company-profile',
      badge: null,
    },
  ];

  const employeeModules = [
    {
      id: 'core' as const,
      label: 'My Portal',
      icon: User,
      defaultTab: 'employee-ess',
      badge: announcements.length > 0 ? announcements.length : null,
    },
    {
      id: 'attendance' as const,
      label: 'Attendance',
      icon: Clock,
      defaultTab: 'attendance-overview',
      badge: null,
    },
    {
      id: 'payroll' as const,
      label: 'Payslips',
      icon: Wallet,
      defaultTab: 'employee-payslips',
      badge: null,
    },
  ];

  const modules = activeRole === 'admin' ? adminModules : employeeModules;

  return (
    <aside className="w-18 shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between z-30 select-none">
      {/* Top: Brand Logo */}
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          onClick={() => {
            setActiveModule('core');
            setActiveSubTab(activeRole === 'admin' ? 'dashboard' : 'employee-ess');
          }}
          className="group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors shadow-2xs"
          title={`${company.name} Home`}
        >
          <div className="w-7 h-7 flex items-center justify-center font-black text-lg tracking-tighter">
            <span className="text-orange-600 font-black">{company.logo || 'HR'}</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        {/* Modules navigation stack */}
        <nav className="flex flex-col items-center gap-2.5 w-full px-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  setActiveSubTab(mod.defaultTab);
                }}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={mod.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold mt-1 tracking-tight truncate max-w-[44px]">
                  {mod.label}
                </span>

                {mod.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-2xs ring-2 ring-white">
                    {mod.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        <button
          onClick={logoutUser}
          className="flex flex-col items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[8px] font-semibold mt-0.5">Exit</span>
        </button>
      </div>
    </aside>
  );
};
