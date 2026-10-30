import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Camera,
  Clock,
  Menu,
  X,
  Network,
  CalendarOff,
  Coins,
  UserPlus,
  TrendingUp,
  GraduationCap,
  FileText,
  BarChart3,
  ShieldCheck,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const MobileBottomBar: React.FC = () => {
  const {
    activeSubTab,
    setActiveSubTab,
    setActiveModule,
    activeRole,
    isPunchedIn,
    setIsPunchModalOpen,
    currentUser,
    logoutUser,
    leaveRequests,
    candidates,
    announcements,
  } = useHR();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const myPendingLeaves = leaveRequests.filter(
    (l) => l.employeeId === currentEmpId && l.status === 'Pending'
  ).length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;

  const isEmployee = activeRole === 'employee';

  const employeeLinks = [
    { id: 'employee-ess', label: 'My Dashboard', icon: LayoutDashboard, module: 'core' as const },
    { id: 'attendance-overview', label: 'My Attendance', icon: Clock, module: 'attendance' as const },
    { id: 'leave-tracker', label: 'Time-Off & Leaves', icon: CalendarOff, module: 'attendance' as const, badge: myPendingLeaves || null },
    { id: 'project-timesheets', label: 'My Timesheets', icon: FileText, module: 'attendance' as const },
    { id: 'employee-payslips', label: 'My Payslips', icon: Coins, module: 'employee' as const },
    { id: 'employee-announcements', label: 'Announcements', icon: Network, module: 'employee' as const, badge: announcements.length || null },
    { id: 'employee-profile', label: 'My Profile & Security', icon: Users, module: 'employee' as const },
  ];

  const adminLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, module: 'core' as const },
    { id: 'employees', label: 'Employees', icon: Users, module: 'core' as const },
    { id: 'organization', label: 'Organization', icon: Network, module: 'core' as const },
    { id: 'attendance', label: 'Attendance', icon: Clock, module: 'attendance' as const },
    { id: 'leave-management', label: 'Leave management', icon: CalendarOff, module: 'attendance' as const, badge: pendingLeaves || null },
    { id: 'payroll', label: 'Payroll', icon: Coins, module: 'payroll' as const },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus, module: 'talent' as const, badge: candidates.length || null },
    { id: 'performance', label: 'Performance', icon: TrendingUp, module: 'performance' as const },
    { id: 'training', label: 'Training', icon: GraduationCap, module: 'performance' as const },
    { id: 'documents', label: 'Documents', icon: FileText, module: 'core' as const },
    { id: 'reports', label: 'Reports', icon: BarChart3, module: 'performance' as const },
    { id: 'user-management', label: 'User management', icon: ShieldCheck, module: 'core' as const },
    { id: 'settings', label: 'Settings', icon: Settings, module: 'settings' as const },
  ];

  const allLinks = isEmployee ? employeeLinks : adminLinks;

  const handleSelectNav = (link: (typeof allLinks)[0]) => {
    setActiveModule(link.module);
    setActiveSubTab(link.id);
    setIsMenuOpen(false);
  };

  const isCurrentActive = (id: string) => {
    if (isEmployee) {
      if (id === 'dashboard' || id === 'employee-ess') return activeSubTab === 'employee-ess' || activeSubTab === 'dashboard';
      if (id === 'leave-tracker') return activeSubTab === 'leave-tracker' || activeSubTab === 'employee-applications';
      if (id === 'employee-payslips') return activeSubTab === 'employee-payslips';
      return activeSubTab === id;
    }
    return (
      activeSubTab === id ||
      (id === 'dashboard' && activeSubTab === 'dashboard') ||
      (id === 'attendance' && activeSubTab.includes('attendance')) ||
      (id === 'employees' && activeSubTab.includes('employee'))
    );
  };

  return (
    <>
      {/* 1. Mobile Bottom Bar Navigation (Screens < md) */}
      <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 items-center justify-around shadow-lg pb-[max(env(safe-area-inset-bottom),8px)]">
        {/* Button 1: Dashboard */}
        <button
          onClick={() => {
            setActiveModule('core');
            setActiveSubTab(isEmployee ? 'employee-ess' : 'dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isCurrentActive('dashboard')
              ? 'text-[#0F766E] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
        </button>

        {/* Button 2: Employee Leaves OR Admin Employees */}
        {isEmployee ? (
          <button
            onClick={() => {
              setActiveModule('attendance');
              setActiveSubTab('leave-tracker');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
              isCurrentActive('leave-tracker')
                ? 'text-[#0F766E] font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <CalendarOff className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Leaves</span>
            {myPendingLeaves > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveModule('core');
              setActiveSubTab('employees');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              isCurrentActive('employees')
                ? 'text-[#0F766E] font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">People</span>
          </button>
        )}

        {/* Button 3: Floating Camera Biometric Punch with Glow */}
        <button
          onClick={() => setIsPunchModalOpen(true)}
          className={`relative -top-3 w-12 h-12 rounded-full flex flex-col items-center justify-center text-white transition-transform active:scale-95 cursor-pointer border border-white/80 ${
            isPunchedIn
              ? 'bg-emerald-600 btn-glow-emerald ring-4 ring-emerald-500/20'
              : 'bg-[#0F766E] btn-glow-teal ring-4 ring-teal-500/20'
          }`}
          title="Camera Punch In / Out"
        >
          <Camera className="w-5 h-5" />
          <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">
            {isPunchedIn ? 'Out' : 'Punch'}
          </span>
        </button>

        {/* Button 4: Employee Payslips OR Admin Time */}
        {isEmployee ? (
          <button
            onClick={() => {
              setActiveModule('employee');
              setActiveSubTab('employee-payslips');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              isCurrentActive('employee-payslips')
                ? 'text-[#0F766E] font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Coins className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Payslips</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveModule('attendance');
              setActiveSubTab('attendance-overview');
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              isCurrentActive('attendance')
                ? 'text-[#0F766E] font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Time</span>
          </button>
        )}

        {/* Button 5: All Menu Drawer */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isMenuOpen
              ? 'text-[#0F766E] font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
        </button>
      </nav>

      {/* 2. Full Menu Bottom Sheet Drawer (Mobile Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-extrabold text-xs">
                  A
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isEmployee ? 'Employee Workspace' : 'All Modules & Navigation'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isEmployee ? 'Access your personal portal features' : 'Select any enterprise section'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2">
              {allLinks.map((link) => {
                const Icon = link.icon;
                const isSelected = activeSubTab === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => handleSelectNav(link)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-[#A7F3D0] text-slate-900 font-bold shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`} />
                    <span className="truncate flex-1">{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#0F766E] text-white">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <div className="flex items-center bg-[#E1EFF0] p-1 rounded-xl text-xs">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center gap-1 px-3 py-1 font-bold rounded-lg ${
                    themeMode === 'light' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`flex items-center gap-1 px-3 py-1 font-bold rounded-lg ${
                    themeMode === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logoutUser();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
