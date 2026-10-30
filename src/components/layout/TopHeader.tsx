import React from 'react';
import {
  Search,
  Camera,
  Bell,
  Clock,
  Download,
  Bot,
  Building2,
  ChevronDown,
  LogOut,
  Calendar
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface TopHeaderProps {
  onOpenAuthModal: () => void;
  onOpenGlobalSearch: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenAuthModal, onOpenGlobalSearch }) => {
  const {
    currentUser,
    activeRole,
    isPunchedIn,
    currentAttendanceRecord,
    setIsPunchModalOpen,
    isAssistantOpen,
    setIsAssistantOpen,
    logoutUser,
  } = useHR();

  // Date formatted like Image 1: "Monday, September 21, 2026"
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const userFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Amara';
  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AM';

  return (
    <header className="h-16 px-5 lg:px-8 bg-white border-b border-slate-100 flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Left: Greeting and Date (exact layout from Image 1) */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#E0F2F1] text-[#0F766E] flex items-center justify-center shrink-0 shadow-2xs">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-tight truncate">
            <span>Good morning, {userFirstName}</span>
            <span className="hidden sm:inline text-xs font-normal text-slate-400">✨</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: Search, Actions, Period Filter, and Profile (Image 1 + Image 2) */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Search Pill Input on Desktop / Tablet */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full transition-colors cursor-pointer text-left"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search employees...</span>
          </button>
        </div>

        {/* Mobile Search Icon Button */}
        <button
          onClick={onOpenGlobalSearch}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors flex md:hidden cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* History / Clock Icon from Image 1 */}
        <button
          onClick={onOpenGlobalSearch}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors hidden sm:flex cursor-pointer"
          title="Recent activity history"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Notification Bell from Image 1 */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          title="Notifications and Signals"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
        </button>

        {/* Period Selector (from Image 2: "This Month ▾") */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100/60 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>This Month</span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
        </div>

        {/* Export Button (from Image 2: "Export") */}
        <button
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ exportDate: new Date(), app: 'HRMate Enterprise' }));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', `hrms_export_${Date.now()}.json`);
            downloadAnchor.click();
          }}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
          title="Export CSV/JSON report"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        {/* Camera Biometric Punch Button with Glow and Border Effect */}
        <button
          onClick={() => setIsPunchModalOpen(true)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
            isPunchedIn
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400/40 ring-2 ring-emerald-500/20 btn-glow-emerald'
              : 'bg-[#0F766E] hover:bg-[#0D645E] text-white border-teal-400/40 ring-2 ring-teal-500/20 btn-glow-teal'
          }`}
          title="Biometric Camera Punch"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap hidden sm:inline">
            {isPunchedIn ? 'Punched In' : 'Punch In'}
          </span>
        </button>

        {/* User Profile Avatar with Name & Title (exact layout from Image 1) */}
        <div className="flex items-center gap-2.5 pl-1.5 sm:pl-2">
          <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-blue-700 font-bold text-xs flex items-center justify-center ring-2 ring-blue-100 shrink-0">
            {userInitials}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name || 'Amara Morgan'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              {currentUser?.designation || (activeRole === 'admin' ? 'HR Director' : 'Product Designer')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
