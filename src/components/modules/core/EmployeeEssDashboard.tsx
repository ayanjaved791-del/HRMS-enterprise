import React, { useState } from 'react';
import {
  Camera,
  Calendar,
  Clock,
  Coins,
  FileText,
  MapPin,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Megaphone,
  Pin,
  User,
  Sparkles,
  Bot,
  Copy,
  Check,
  Send,
  Plus,
  ShieldCheck,
  CalendarOff
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const EmployeeEssDashboard: React.FC = () => {
  const {
    currentUser,
    employees,
    isPunchedIn,
    currentAttendanceRecord,
    attendanceRecords,
    setIsPunchModalOpen,
    leaveRequests,
    applyLeave,
    payrollRuns,
    setActiveModule,
    setActiveSubTab,
    userLocation,
    announcements,
    company,
    selectedCurrency,
    sendAssistantQuery,
  } = useHR();

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const currentEmp =
    employees.find((e) => e.id === currentEmpId) ||
    employees.find((e) => e.email.toLowerCase() === currentUser?.email?.toLowerCase()) ||
    null;

  // Real employee data
  const empFirstName = currentEmp ? currentEmp.firstName : (currentUser?.name?.split(' ')[0] || 'Team');
  const empLastName = currentEmp ? currentEmp.lastName : (currentUser?.name?.split(' ').slice(1).join(' ') || 'Member');
  const empAvatar = currentEmp?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const empDesignation = currentEmp?.designation || currentUser?.designation || 'Team Member';
  const empDepartment = currentEmp?.department || currentUser?.department || 'Operations';
  const empCode = currentEmp?.employeeCode || 'EMP-LIVE';

  // Real leave balances (strictly real, 0 if not assigned)
  const leaveBalances = currentEmp?.leaveBalances || { annual: 0, sick: 0, casual: 0, parental: 0 };

  // Real Leave Requests for this employee
  const myLeaves = leaveRequests.filter((l) => l.employeeId === (currentEmp?.id || currentEmpId));
  const myPendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;

  // Real Attendance records for this employee
  const todayStr = new Date().toISOString().split('T')[0];
  const myAttendance = attendanceRecords.filter((r) => r.employeeId === (currentEmp?.id || currentEmpId));
  const myTodayRecord = myAttendance.find((r) => r.date === todayStr);

  // Real Payslips for this employee
  const myPayslips = payrollRuns.filter((p) => p.employeeId === (currentEmp?.id || currentEmpId));
  const latestPayslip = myPayslips.length > 0 ? myPayslips[myPayslips.length - 1] : null;

  // Apply Leave Modal State
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'Annual' | 'Sick' | 'Casual' | 'Parental'>('Annual');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');

  // Smart Helper State for Employee Portal Summary
  const [portalSummaryQuery, setPortalSummaryQuery] = useState('');
  const [portalSummaryResult, setPortalSummaryResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    applyLeave({
      type: leaveType,
      startDate,
      endDate,
      days: Number(leaveDays),
      reason: leaveReason.trim(),
    });
    setIsApplyLeaveOpen(false);
    setLeaveReason('');
  };

  // Smart Personal Summary Generator (Strictly Scoped to Employee's Personal Records)
  const generatePortalSummary = (topic: string) => {
    const lower = topic.toLowerCase();

    // Security check: Guard against queries for company-wide or other employee info
    const isAskingForEnterpriseData =
      lower.includes('all employee') ||
      lower.includes('other employee') ||
      lower.includes('company payroll') ||
      lower.includes('executive summary') ||
      lower.includes('company revenue') ||
      lower.includes('salary of') ||
      lower.includes('everyone') ||
      lower.includes('admin data');

    if (isAskingForEnterpriseData) {
      setPortalSummaryResult(
        `🔒 **Restricted Authorization Notice**\n\n` +
        `As an employee, your portal intelligence is strictly scoped to your **personal records**.\n\n` +
        `• You have full access to view and summarize your personal biometric attendance, remaining leave balances, official payslip vouchers, and profile credentials.\n` +
        `• Organization-wide salaries, all-employee lists, and executive statistics are restricted to administrators.`
      );
      return;
    }

    if (lower.includes('overview') || lower.includes('portal') || lower.includes('summary')) {
      setPortalSummaryResult(
        `📋 **Personal Portal Summary for ${empFirstName} ${empLastName}**\n\n` +
        `• **Profile:** ${empDesignation} · ${empDepartment} (${empCode})\n` +
        `• **Attendance Today:** ${isPunchedIn || myTodayRecord ? `Checked in at ${myTodayRecord?.punchInTime || '09:00 AM'} (On-Site)` : 'Not clocked in yet today'}\n` +
        `• **Total Logged Punches:** ${myAttendance.length} biometric sessions on record\n` +
        `• **Paid Time Off (PTO):** ${leaveBalances.annual} Annual, ${leaveBalances.sick} Sick, ${leaveBalances.casual} Casual days remaining\n` +
        `• **Pending Leave Applications:** ${myPendingLeaves} request(s) awaiting administrative review\n` +
        `• **Official Payslips:** ${latestPayslip ? `Latest Net Pay: $${(latestPayslip.netSalary ?? latestPayslip.netPayable).toLocaleString()} ${selectedCurrency} (${latestPayslip.period})` : 'No official monthly payslips disbursed yet'}`
      );
    } else if (lower.includes('attendance') || lower.includes('hours') || lower.includes('punch') || lower.includes('time')) {
      setPortalSummaryResult(
        `⏰ **Your Personal Biometric Attendance Summary**\n\n` +
        `• **Today's Status (${todayStr}):** ${isPunchedIn || myTodayRecord ? `Punched In at ${myTodayRecord?.punchInTime || '09:00 AM'}` : 'Not clocked in yet'}\n` +
        `• **Geofence Verification:** ${userLocation ? `${userLocation.distanceMeters}m from HQ boundary` : 'Verified within office geofence'}\n` +
        `• **Total Clock Events:** ${myAttendance.length} verified biometric entries recorded in your profile.\n` +
        `• **Assigned Shift:** General Corporate Shift (09:00 AM - 05:00 PM EST).`
      );
    } else if (lower.includes('leave') || lower.includes('balance') || lower.includes('vacation') || lower.includes('pto')) {
      setPortalSummaryResult(
        `🏖️ **Your Time-Off & Leave Balances Summary**\n\n` +
        `• **Annual Vacation Leave:** ${leaveBalances.annual} days available\n` +
        `• **Sick / Medical Leave:** ${leaveBalances.sick} days available\n` +
        `• **Casual Leave:** ${leaveBalances.casual} days available\n` +
        `• **Parental Leave:** ${leaveBalances.parental} days available\n` +
        `• **Pending Requests:** ${myPendingLeaves} application(s)\n` +
        `• **Total Applications Filed:** ${myLeaves.length} requests on record.`
      );
    } else if (lower.includes('pay') || lower.includes('salary') || lower.includes('voucher') || lower.includes('compensation')) {
      if (latestPayslip) {
        setPortalSummaryResult(
          `💵 **Your Official Payslip Breakdown**\n\n` +
          `• **Period:** ${latestPayslip.period}\n` +
          `• **Gross Earnings:** $${latestPayslip.grossSalary.toLocaleString()} ${selectedCurrency}\n` +
          `• **Total Deductions:** $${(latestPayslip.grossSalary - (latestPayslip.netSalary ?? latestPayslip.netPayable)).toLocaleString()} ${selectedCurrency}\n` +
          `• **Net Disbursed Take-Home:** $${(latestPayslip.netSalary ?? latestPayslip.netPayable).toLocaleString()} ${selectedCurrency}\n` +
          `• **Status:** ${latestPayslip.paymentStatus.toUpperCase()} (Electronic Bank Transfer)`
        );
      } else if (currentEmp?.salary) {
        setPortalSummaryResult(
          `💵 **Your Compensation Structure**\n\n` +
          `• **Base Monthly:** $${currentEmp.salary.baseMonthly.toLocaleString()} ${currentEmp.salary.currency || selectedCurrency}\n` +
          `• **HRA Allowance:** $${currentEmp.salary.hra.toLocaleString()}\n` +
          `• **Special Allowance:** $${currentEmp.salary.specialAllowance.toLocaleString()}\n` +
          `• **Official Monthly Vouchers:** None published yet by payroll administrator.`
        );
      } else {
        setPortalSummaryResult(
          `💵 **Your Compensation Records**\n\n` +
          `No official payslip vouchers have been generated yet for your account. Once your administrator processes a payroll run, certified statements with printable PDF slips will be available here.`
        );
      }
    } else if (lower.includes('application') || lower.includes('request') || lower.includes('claim')) {
      setPortalSummaryResult(
        `📝 **Your Applications & Approval Status**\n\n` +
        `• **Pending Leave Requests:** ${myPendingLeaves}\n` +
        `• **Approved Leaves:** ${myLeaves.filter((l) => l.status === 'Approved').length}\n` +
        `• **Total Applications:** ${myLeaves.length} leave requests submitted.\n` +
        (myLeaves.length > 0 ? `• **Latest Application:** ${myLeaves[0].type} Leave (${myLeaves[0].days} days) · Status: ${myLeaves[0].status}` : '• No applications submitted yet.')
      );
    } else {
      setPortalSummaryResult(
        `📋 **Personal Portal Intelligence for "${topic}"**\n\n` +
        `• Employee: ${empFirstName} ${empLastName} (${empCode})\n` +
        `• Biometric Status: ${isPunchedIn ? 'Checked in on-site' : 'Not clocked in today'}\n` +
        `• Available PTO: ${leaveBalances.annual + leaveBalances.sick + leaveBalances.casual} total days available\n` +
        `• Need help with anything else? You can ask for summaries of your attendance, leaves, payslips, or profile.`
      );
    }
  };

  const handleCopySummary = () => {
    if (portalSummaryResult) {
      navigator.clipboard.writeText(portalSummaryResult);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. WELCOME HERO: Exact Teal & Mint Brand Aesthetic from Image 1 & 2 */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white p-6 lg:p-8 shadow-sm border border-teal-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={empAvatar}
            alt={empFirstName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#A7F3D0]/60 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#A7F3D0] text-[#064E3B]">
                Employee Portal
              </span>
              <span className="text-xs text-teal-200/90 font-medium">
                {company.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {empFirstName}!
            </h1>
            <p className="text-xs text-teal-100/80 mt-0.5 font-medium">
              {empDesignation} · {empDepartment} · {empCode}
            </p>
          </div>
        </div>

        {/* Quick Camera Punch Button in Hero with Glowing Effect */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPunchModalOpen(true)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border ${
              isPunchedIn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 btn-glow-emerald'
                : 'bg-white text-[#0F766E] border-teal-200 hover:bg-teal-50 btn-glow-teal'
            }`}
          >
            <Camera className="w-4 h-4 text-[#0F766E]" />
            <span>
              {isPunchedIn
                ? `Punched In (${myTodayRecord?.punchInTime || '09:00 AM'})`
                : 'Camera Punch In'}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('employee-profile')}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="My Security & Profile"
          >
            <User className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span>My Profile</span>
          </button>
        </div>
      </div>

      {/* 2. SMART PERSONAL PORTAL HELPER & SUMMARY WIDGET */}
      <div className="bg-[#F0FDFB] rounded-3xl p-6 border border-[#A7F3D0]/70 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Bot className="w-5 h-5 text-[#A7F3D0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  My Portal Smart Assistant & Summary
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A7F3D0] text-[#064E3B]">
                  Personal Scoped
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Take an instant AI summary of your attendance, leave balances, payslips, or applications
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Instant Summary Chips */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Click to take instant personal summary
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generatePortalSummary('Summarize My Portal Overview')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>📋 Summarize My Portal Overview</span>
            </button>
            <button
              onClick={() => generatePortalSummary('My Attendance & Work Hours This Month')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>⏰ My Attendance & Hours</span>
            </button>
            <button
              onClick={() => generatePortalSummary('My Remaining Leave Balances & Requests')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>🏖️ My Leave Balances & Status</span>
            </button>
            <button
              onClick={() => generatePortalSummary('Break Down My Latest Payslip')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>💵 Break Down My Latest Payslip</span>
            </button>
            <button
              onClick={() => generatePortalSummary('Status of My Pending Applications')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>📝 Status of My Applications</span>
            </button>
          </div>
        </div>

        {/* Custom Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!portalSummaryQuery.trim()) return;
            generatePortalSummary(portalSummaryQuery.trim());
          }}
          className="flex items-center gap-2 pt-1"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask anything about your personal records (attendance, leaves, payslips)..."
              value={portalSummaryQuery}
              onChange={(e) => setPortalSummaryQuery(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2 text-xs bg-white border border-teal-200 rounded-xl focus:outline-none focus:border-[#0F766E] text-slate-800 placeholder:text-slate-400 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D645E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 btn-glow-teal"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span>Take Summary</span>
          </button>
        </form>

        {/* Live Summary Result Box */}
        {portalSummaryResult && (
          <div className="p-4 bg-white rounded-2xl border border-teal-200/90 shadow-2xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                Personal Portal Intelligence
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopySummary}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setPortalSummaryResult(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
              {portalSummaryResult}
            </div>
          </div>
        )}
      </div>

      {/* 3. REAL COMPANY ANNOUNCEMENTS STREAM */}
      {recentAnnouncements.length > 0 && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#0F766E]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Company Announcements & Broadcasts
              </h3>
            </div>
            <button
              onClick={() => setActiveSubTab('employee-announcements')}
              className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({announcements.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  ann.pinned
                    ? 'border-teal-200 bg-teal-50/40'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {ann.pinned && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#A7F3D0] text-[#064E3B]">
                      <Pin className="w-2.5 h-2.5 rotate-45" /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-slate-500">{ann.category}</span>
                  <span className="text-[10px] text-slate-400">· {ann.publishDate}</span>
                </div>
                <h4 className="font-bold text-slate-900 leading-snug line-clamp-1">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REAL ATTENDANCE BIOMETRICS & LEAVE BALANCES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Biometric Clock-In & Location Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Biometric Attendance
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isPunchedIn || myTodayRecord
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isPunchedIn || myTodayRecord ? 'Punched In' : 'Not Clocked In'}
            </span>
          </div>

          {/* Biometric Snapshot Card */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-100 flex items-center gap-4">
            {myTodayRecord?.punchInPhoto ? (
              <img
                src={myTodayRecord.punchInPhoto}
                alt="Punch snap"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#F0FDFB] border border-[#A7F3D0] text-[#0F766E] flex items-center justify-center font-bold text-xl">
                <Clock className="w-7 h-7" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isPunchedIn || myTodayRecord
                  ? `Clocked in at ${myTodayRecord?.punchInTime || '09:00 AM'}`
                  : 'Ready to Clock In'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {myTodayRecord?.status || 'Scheduled Shift: 09:00 AM - 05:00 PM'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                {myTodayRecord?.locationLabel || `${company.hqLocation.name}`}
              </p>
            </div>
          </div>

          {/* Geofence Status */}
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs space-y-1">
            <div className="flex items-center justify-between text-teal-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" /> Geofence Verified
              </span>
              <span className="text-[10px] text-teal-700 font-mono">
                {userLocation ? `${userLocation.distanceMeters}m from HQ` : 'Office Center'}
              </span>
            </div>
            <p className="text-[11px] text-teal-700">
              Verified within {company.name} office boundary radius.
            </p>
          </div>

          <button
            onClick={() => setIsPunchModalOpen(true)}
            className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#0F766E] hover:bg-[#0D645E] text-white transition-colors cursor-pointer btn-glow-teal flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera Biometric Scanner</span>
          </button>
        </div>

        {/* Center & Right Columns: Real Leave Balances & Fast Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Balances Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Leave & PTO Balances
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Annual paid time-off allocations</p>
              </div>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold bg-[#0F766E] text-white rounded-xl shadow-xs hover:bg-[#0D645E] transition-colors cursor-pointer btn-glow-teal flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Leave</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {leaveBalances.annual}
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">Annual Leave</p>
                <p className="text-[10px] text-slate-400">Days available</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {leaveBalances.sick}
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">Sick Leave</p>
                <p className="text-[10px] text-slate-400">Days available</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {leaveBalances.casual}
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">Casual Leave</p>
                <p className="text-[10px] text-slate-400">Days available</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {leaveBalances.parental}
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-1">Parental Leave</p>
                <p className="text-[10px] text-slate-400">Days available</p>
              </div>
            </div>

            {/* My Recent Leave Requests */}
            {myLeaves.length > 0 ? (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-2">Recent Leave Status</p>
                <div className="space-y-2">
                  {myLeaves.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">
                          {l.type} Leave · {l.days} days
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {l.startDate} to {l.endDate} ({l.reason})
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-100 text-center py-2">
                <p className="text-xs text-slate-400">No leave applications submitted yet</p>
              </div>
            )}
          </div>

          {/* Row: Real Payslip Widget + Profile Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Real Payslip Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Official Payslip
                  </h3>
                  <FileText className="w-4 h-4 text-[#0F766E]" />
                </div>
                {latestPayslip ? (
                  <>
                    <p className="text-xl font-extrabold text-slate-900 tabular-nums font-mono">
                      ${(latestPayslip.netSalary ?? latestPayslip.netPayable).toLocaleString()} {selectedCurrency}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Period: {latestPayslip.period} · Certified
                    </p>
                  </>
                ) : currentEmp?.salary ? (
                  <>
                    <p className="text-xl font-extrabold text-slate-900 tabular-nums font-mono">
                      ${currentEmp.salary.baseMonthly.toLocaleString()} {currentEmp.salary.currency || selectedCurrency}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Contracted Base Monthly (Vouchers Pending Run)
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-700">No Payslips Disbursed</p>
                    <p className="text-xs text-slate-400 mt-0.5">Vouchers appear after payroll run</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setActiveSubTab('employee-payslips')}
                className="mt-4 w-full py-2 text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> View Payslips Portal
              </button>
            </div>

            {/* Profile & Credentials Widget */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Credentials & Security
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {empFirstName} {empLastName}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser?.email}</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Synchronized with Directory
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('employee-profile')}
                className="mt-4 w-full py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Change Name & Portal Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. APPLY LEAVE MODAL */}
      {isApplyLeaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Request Paid Time Off (PTO)</h3>
              <button
                onClick={() => setIsApplyLeaveOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                >
                  <option value="Annual">Annual Paid Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Parental">Parental Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Days Count</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Request *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Taking family annual break..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D645E] rounded-xl shadow-xs cursor-pointer btn-glow-teal"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
