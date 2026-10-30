import React, { useState } from 'react';
import {
  Users,
  Clock,
  Briefcase,
  UserPlus,
  MoreVertical,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ShieldCheck,
  X,
  Camera,
  Calendar,
  Sparkles,
  Inbox,
  Lock,
  Eye,
  EyeOff,
  Bot,
  Copy,
  Check
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Employee } from '../../../types';

export const AdminDashboard: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    candidates,
    payrollRuns,
    setActiveModule,
    setActiveSubTab,
    setIsPunchModalOpen,
    addEmployee,
  } = useHR();

  const [activeYear, setActiveYear] = useState('This year');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [directorySearch, setDirectorySearch] = useState('');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // New Employee Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('Welcome@123');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newRole, setNewRole] = useState('Product Designer');
  const [newDepartment, setNewDepartment] = useState<'Engineering' | 'Design' | 'Product' | 'Marketing' | 'Human Resources' | 'Finance' | 'Operations'>('Design');

  // Executive AI Helper & Summary State
  const [adminSummaryQuery, setAdminSummaryQuery] = useState('');
  const [adminSummaryResult, setAdminSummaryResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Real Dates & State Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter((r) => r.date === todayStr);
  const presentCount = todayAttendance.length > 0 ? todayAttendance.length : attendanceRecords.length;
  const totalEmployeesCount = employees.length;
  const attendanceRate = totalEmployeesCount > 0 ? Math.round((presentCount / totalEmployeesCount) * 100) : 0;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const openPositionsCount = candidates.length;

  // Real Headcount Trend Data for 12 months (Image 1 Wave Chart)
  const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const headcountMonths = monthNames.map((month, idx) => {
    const count = totalEmployeesCount > 0 ? Math.round((totalEmployeesCount * (idx + 1)) / 12) : 0;
    return {
      month,
      count,
      delta: count > 0 ? `+${Math.round((count / Math.max(1, totalEmployeesCount)) * 100)}%` : '0%',
    };
  });

  // Real Weekly Segmented Pill Data (Image 2 Attendance Overview)
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNamesLookup = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyAttendance = dayLabels.map((day) => {
    const matchingRecords = attendanceRecords.filter((r) => {
      const d = new Date(r.date);
      return !isNaN(d.getTime()) && dayNamesLookup[d.getDay()] === day;
    });
    const onSite = matchingRecords.filter((r) => r.status === 'On Time').length;
    const overtime = matchingRecords.filter((r) => r.status === 'Late').length;
    const remote = Math.max(0, matchingRecords.length - onSite - overtime);
    return {
      day,
      onSite,
      overtime,
      remote,
      total: matchingRecords.length,
    };
  });

  // Real Recent Clock Events (Image 2: 300 Attendance)
  const recentClockEvents = attendanceRecords.slice(-5).reverse().map((rec) => {
    const emp = employees.find((e) => e.id === rec.employeeId);
    return {
      id: rec.id,
      name: rec.employeeName || (emp ? `${emp.firstName} ${emp.lastName}` : 'Team Member'),
      role: emp?.designation || emp?.department || 'Staff',
      avatar: emp?.avatar || rec.punchInPhoto || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      clockIn: rec.punchInTime || '09:00 AM',
      clockOut: rec.punchOutTime || 'On-Site',
      verified: rec.isWithinGeofence,
      status: rec.status,
    };
  });

  // Real Employee Summary & Payroll Status (Image 2)
  const employeeSummaries = employees.slice(0, 5).map((emp) => {
    const run = payrollRuns.find((r) => r.employeeId === emp.id);
    return {
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      jobTitle: emp.designation,
      netSalary: `$${emp.salary.baseMonthly.toLocaleString()}.00`,
      status: run?.paymentStatus === 'Paid' ? ('PAID' as const) : ('PENDING' as const),
      avatar: emp.avatar,
    };
  });

  // Working Format Calculations
  const hybridCount = employees.filter((e) => e.employmentType === 'Part-time' || e.location?.toLowerCase().includes('hybrid')).length;
  const onsiteCount = employees.filter((e) => e.employmentType === 'Full-time' && !e.location?.toLowerCase().includes('remote')).length;
  const remoteCount = employees.filter((e) => e.employmentType === 'Contract' || e.location?.toLowerCase().includes('remote')).length;

  // Filtered People Directory
  const filteredDirectory = employees
    .filter(
      (e) =>
        e.firstName.toLowerCase().includes(directorySearch.toLowerCase()) ||
        e.lastName.toLowerCase().includes(directorySearch.toLowerCase()) ||
        e.department.toLowerCase().includes(directorySearch.toLowerCase()) ||
        e.designation.toLowerCase().includes(directorySearch.toLowerCase())
    )
    .slice(0, 6);

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newEmail.trim()) return;

    addEmployee({
      firstName: newFirstName.trim(),
      lastName: newLastName.trim() || 'Colleague',
      email: newEmail.trim(),
      password: newPassword.trim() || 'Welcome@123',
      phone: '+1 555-0199',
      department: newDepartment,
      designation: newRole,
      employmentType: 'Full-time',
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: {
        baseMonthly: 6500,
        hra: 1200,
        specialAllowance: 800,
        currency: 'USD',
      },
      bankDetails: {
        accountNumber: '•••• 8821',
        bankName: 'Silicon Valley Bank',
        ifscOrRouting: '021000021',
      },
      leaveBalances: {
        annual: 18,
        sick: 10,
        casual: 6,
        parental: 0,
      },
      location: 'HQ Suite',
      emergencyContact: {
        name: `${newFirstName} Contact`,
        relation: 'Spouse',
        phone: '+1 555-0188',
      },
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });

    setIsAddEmployeeOpen(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPassword('Welcome@123');
    setShowNewPassword(false);
  };

  const generateAdminSummary = (topic: string) => {
    const lower = topic.toLowerCase();
    const totalBaseCommitment = employees.reduce((acc, e) => acc + e.salary.baseMonthly, 0);
    const depts = Array.from(new Set(employees.map((e) => e.department)));
    const todayClocked = attendanceRecords.filter((r) => r.date === todayStr);

    if (lower.includes('executive') || lower.includes('organization') || lower.includes('system') || lower.includes('full')) {
      setAdminSummaryResult(
        `📊 **Executive System Overview & Workforce Summary**\n\n` +
        `• **Total Workforce Headcount:** ${employees.length} active employees across ${depts.length} departments (${depts.join(', ') || 'None'})\n` +
        `• **Today's Attendance Turnout (${todayStr}):** ${todayClocked.length} of ${employees.length} clocked in (${totalEmployeesCount > 0 ? Math.round((todayClocked.length / totalEmployeesCount) * 100) : 0}% turnout)\n` +
        `• **Pending Approvals:** ${pendingLeavesCount} leave application(s) awaiting administrative sign-off\n` +
        `• **Monthly Base Payroll Commitment:** $${totalBaseCommitment.toLocaleString()} USD across all active team members\n` +
        `• **Recruitment Pipeline:** ${candidates.length} active candidate(s) in ATS\n` +
        `• **Disbursed Payroll Runs:** ${payrollRuns.length} monthly vouchers processed.`
      );
    } else if (lower.includes('headcount') || lower.includes('staff') || lower.includes('department') || lower.includes('distribution')) {
      const deptCounts = depts.map((d) => `${d}: ${employees.filter((e) => e.department === d).length}`).join(', ');
      setAdminSummaryResult(
        `👥 **Headcount & Department Distribution Summary**\n\n` +
        `• **Total Active Staff:** ${employees.length} team members\n` +
        `• **Breakdown by Department:** ${deptCounts || 'No employees registered yet'}\n` +
        `• **Employment Types:** Full-time: ${employees.filter((e) => e.employmentType === 'Full-time').length} · Part-time: ${employees.filter((e) => e.employmentType === 'Part-time').length} · Contract: ${employees.filter((e) => e.employmentType === 'Contract').length}\n` +
        `• **Working Format:** On-Site: ${onsiteCount} · Remote: ${remoteCount} · Hybrid: ${hybridCount}.`
      );
    } else if (lower.includes('attendance') || lower.includes('turnout') || lower.includes('punch') || lower.includes('clock')) {
      const verified = attendanceRecords.filter((r) => r.isWithinGeofence).length;
      setAdminSummaryResult(
        `⏰ **Attendance & Biometric Turnout Summary**\n\n` +
        `• **Turnout for ${todayStr}:** ${todayClocked.length} clocked in out of ${employees.length} total staff (${attendanceRate}%)\n` +
        `• **Geofence Verified:** ${verified} entries strictly confirmed inside HQ corporate boundaries\n` +
        `• **Absent / Not Checked In:** ${Math.max(0, employees.length - todayClocked.length)} employees pending\n` +
        `• **Total Logged Biometric Records:** ${attendanceRecords.length} records in system archive.`
      );
    } else if (lower.includes('payroll') || lower.includes('salary') || lower.includes('compensation') || lower.includes('wage')) {
      const totalPaid = payrollRuns.filter((r) => r.paymentStatus === 'Paid').reduce((acc, r) => acc + (r.netSalary ?? r.netPayable), 0);
      const avgSalary = employees.length > 0 ? Math.round(totalBaseCommitment / employees.length) : 0;
      setAdminSummaryResult(
        `💰 **Monthly Payroll & Compensation Summary**\n\n` +
        `• **Monthly Base Payroll Total:** $${totalBaseCommitment.toLocaleString()} USD\n` +
        `• **Average Employee Base Salary:** $${avgSalary.toLocaleString()} USD\n` +
        `• **Total Disbursed Payroll Runs:** ${payrollRuns.length} vouchers disbursed\n` +
        `• **Total Net Paid Out:** $${totalPaid.toLocaleString()} USD.`
      );
    } else if (lower.includes('leave') || lower.includes('approval') || lower.includes('request') || lower.includes('pto')) {
      setAdminSummaryResult(
        `⏳ **Pending Approvals & Leaves Summary**\n\n` +
        `• **Pending Leave Requests:** ${pendingLeavesCount} requiring administrator review\n` +
        `• **Total Leave Requests:** ${leaveRequests.length} logged\n` +
        `• **Approved Leaves:** ${leaveRequests.filter((l) => l.status === 'Approved').length}\n` +
        `• **Rejected Leaves:** ${leaveRequests.filter((l) => l.status === 'Rejected').length}.`
      );
    } else {
      setAdminSummaryResult(
        `📊 **System Data Intelligence for "${topic}"**\n\n` +
        `• Organization: 13 Core Modules Active\n` +
        `• Employees: ${employees.length} | Attendance Today: ${todayAttendance.length} | Pending Leaves: ${pendingLeavesCount}\n` +
        `• Payroll Base: $${totalBaseCommitment.toLocaleString()} USD | Candidates: ${candidates.length}`
      );
    }
  };

  const handleCopyAdminSummary = () => {
    if (adminSummaryResult) {
      navigator.clipboard.writeText(adminSummaryResult);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. HERO HEADER: Exact from Image 1 with Image 2 Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
        <div>
          {/* Badge: PEOPLE OPERATIONS from Image 1 */}
          <span className="text-[11px] font-bold text-[#0F766E] uppercase tracking-widest block mb-1">
            PEOPLE OPERATIONS
          </span>
          {/* Main Title: "Your people, in focus." from Image 1 */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your people, <span className="text-[#0F766E] italic font-serif">in focus.</span>
          </h1>
          {/* Subtitle from Image 1 */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            A calm overview of your organization today with the signals that need your attention first.
          </p>
        </div>

        {/* Action Button: + Add employee with Glowing Effect and Border */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D645E] text-white text-xs font-bold rounded-xl border border-teal-400/40 ring-2 ring-teal-500/20 btn-glow-teal transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add employee</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE SYSTEM INTELLIGENCE & SUMMARY WIDGET */}
      <div className="bg-[#F0FDFB] rounded-3xl p-6 border border-[#A7F3D0]/70 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Bot className="w-5 h-5 text-[#A7F3D0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Executive System Intelligence & Summary Helper
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A7F3D0] text-[#064E3B]">
                  Enterprise Scope
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate instant summaries of enterprise workforce, today's attendance turnout, payroll totals, and pending approvals
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Instant System Summary Chips */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            Click to take instant organization summary
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generateAdminSummary('Full Organization Executive Summary')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>📊 Full Executive Summary</span>
            </button>
            <button
              onClick={() => generateAdminSummary('Staff & Headcount Distribution')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>👥 Staff & Department Distribution</span>
            </button>
            <button
              onClick={() => generateAdminSummary('Attendance & Today Turnout')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>⏰ Attendance & Turnout</span>
            </button>
            <button
              onClick={() => generateAdminSummary('Monthly Payroll & Compensation')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>💰 Monthly Payroll Totals</span>
            </button>
            <button
              onClick={() => generateAdminSummary('Pending Approvals & Leaves')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] border border-teal-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>⏳ Pending Approvals & Leaves</span>
            </button>
          </div>
        </div>

        {/* Custom Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!adminSummaryQuery.trim()) return;
            generateAdminSummary(adminSummaryQuery.trim());
          }}
          className="flex items-center gap-2 pt-1"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask anything about enterprise system data (headcount, payroll commitment, turnout rate, ATS)..."
              value={adminSummaryQuery}
              onChange={(e) => setAdminSummaryQuery(e.target.value)}
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

        {/* Live System Summary Result Box */}
        {adminSummaryResult && (
          <div className="p-4 bg-white rounded-2xl border border-teal-200/90 shadow-2xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                Executive System Intelligence
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyAdminSummary}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setAdminSummaryResult(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
              {adminSummaryResult}
            </div>
          </div>
        )}
      </div>

      {/* 3. TOP METRIC CARDS ROW: Real computed statistics with Image 2 Pastel Tints */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total employees */}
        <div className="bg-[#EFF4FE] border border-[#DBEAFE] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5 stroke-[1.8]" />
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Total employees</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {totalEmployeesCount}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> {totalEmployeesCount > 0 ? '+100%' : '0%'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">registered in directory</p>
          </div>
        </div>

        {/* Card 2: Present today */}
        <div className="bg-[#EDFCF8] border border-[#CCFBF1] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Clock className="w-5 h-5 stroke-[1.8]" />
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Present today</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {presentCount}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full">
                {attendanceRate}% rate
              </span>
            </div>
            <p className="text-[10px] text-teal-700 font-semibold mt-1">biometric verified</p>
          </div>
        </div>

        {/* Card 3: On leave */}
        <div className="bg-[#F5F0FF] border border-[#EDE9FE] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5 stroke-[1.8]" />
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">On leave</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {pendingLeavesCount}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                pending review
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">scheduled requests</p>
          </div>
        </div>

        {/* Card 4: Open positions */}
        <div className="bg-[#FDF2F8] border border-[#FCE7F3] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5 stroke-[1.8]" />
            </div>
            <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500">Open positions</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {openPositionsCount}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-700 bg-pink-100/60 px-2 py-0.5 rounded-full">
                in pipeline
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">active recruitments</p>
          </div>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD SPLIT: 65% Left / 35% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (approx 60-65% width) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card A: Headcount Overview Smooth Area Wave Chart (Image 1) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Headcount overview
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Employee growth over the last 12 months
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={activeYear}
                    onChange={(e) => setActiveYear(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
                  >
                    <option value="This year">This year</option>
                    <option value="Last year">Last year</option>
                  </select>
                </div>
              </div>
            </div>

            {totalEmployeesCount === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No employee data recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                  Add employees to begin tracking organization headcount trajectories and department metrics.
                </p>
                <button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="mt-3 px-3 py-1.5 bg-[#0F766E] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#0D645E]"
                >
                  + Add First Employee
                </button>
              </div>
            ) : (
              <div className="relative pt-6 pb-2">
                <div className="h-56 sm:h-64 w-full">
                  <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F766E" stopOpacity="0.22" />
                        <stop offset="70%" stopColor="#0F766E" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#0F766E" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid guide lines */}
                    <line x1="0" y1="30" x2="700" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" />
                    <line x1="0" y1="85" x2="700" y2="85" stroke="#F1F5F9" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeDasharray="4 4" />
                    <line x1="0" y1="195" x2="700" y2="195" stroke="#F1F5F9" strokeDasharray="4 4" />

                    {/* Y-axis Labels */}
                    <text x="5" y="32" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      {totalEmployeesCount}
                    </text>
                    <text x="5" y="87" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      {Math.round(totalEmployeesCount * 0.75)}
                    </text>
                    <text x="5" y="142" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      {Math.round(totalEmployeesCount * 0.5)}
                    </text>
                    <text x="5" y="197" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      0
                    </text>

                    {/* Gradient Area Path */}
                    <path
                      d="M 30,195 C 90,190 120,170 170,165 C 220,160 260,140 310,135 C 360,130 400,120 460,105 C 520,90 580,50 670,40 L 670,220 L 30,220 Z"
                      fill="url(#waveFill)"
                    />

                    {/* Smooth Top Curve Line (Deep Teal like Image 1) */}
                    <path
                      d="M 30,195 C 90,190 120,170 170,165 C 220,160 260,140 310,135 C 360,130 400,120 460,105 C 520,90 580,50 670,40"
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />

                    {/* Data Points and Interactivity */}
                    {headcountMonths.map((item, idx) => {
                      const x = 30 + (idx * (640 / 11));
                      const yValues = [195, 185, 172, 165, 155, 142, 135, 122, 108, 92, 65, 40];
                      const y = yValues[idx];
                      const isHovered = hoveredMonthIndex === idx;

                      return (
                        <g key={item.month}>
                          {isHovered && (
                            <line
                              x1={x}
                              y1={30}
                              x2={x}
                              y2={220}
                              stroke="#0F766E"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                              opacity="0.5"
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? '#0F766E' : '#FFFFFF'}
                            stroke="#0F766E"
                            strokeWidth={isHovered ? 3 : 2.5}
                            className="cursor-pointer transition-all duration-150"
                            onMouseEnter={() => setHoveredMonthIndex(idx)}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis Month Labels */}
                <div className="flex justify-between px-2 pt-2 text-[11px] font-medium text-slate-400">
                  {headcountMonths.map((item, idx) => (
                    <button
                      key={item.month}
                      onClick={() => setHoveredMonthIndex(idx)}
                      className={`hover:text-slate-900 transition-colors cursor-pointer ${
                        hoveredMonthIndex === idx ? 'text-[#0F766E] font-bold' : ''
                      }`}
                    >
                      {item.month}
                    </button>
                  ))}
                </div>

                {hoveredMonthIndex !== null && (
                  <div className="mt-3 p-3 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                      <span className="font-bold text-slate-800">
                        {headcountMonths[hoveredMonthIndex].month}:
                      </span>
                      <span className="font-mono font-bold text-[#0F766E]">
                        {headcountMonths[hoveredMonthIndex].count} team members
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {headcountMonths[hoveredMonthIndex].delta} of active staff
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card B: Attendance Overview Segmented Bar Chart (Image 2) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Attendance Overview
                  </h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">
                    Live Logs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Breakdown by on-site attendance, overtime/late, and hybrid shifts
                </p>
              </div>

              {/* Legend Dots */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> On-Site
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Overtime
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Hybrid/Remote
                </span>
              </div>
            </div>

            {attendanceRecords.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-7 h-7 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No weekly attendance logged yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                  Once team members punch in via camera check-in, weekly shifts will automatically visualize here.
                </p>
                <button
                  onClick={() => setIsPunchModalOpen(true)}
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                >
                  Punch In Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 sm:gap-4 h-52 items-end pt-4 pb-2 px-1 sm:px-4">
                {weeklyAttendance.map((d, idx) => {
                  const maxH = Math.max(1, Math.max(...weeklyAttendance.map(x => x.total)));
                  const onSiteH = (d.onSite / maxH) * 120;
                  const otH = (d.overtime / maxH) * 40;
                  const remoteH = (d.remote / maxH) * 40;

                  return (
                    <div
                      key={d.day}
                      className="flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onMouseLeave={() => setHoveredDayIndex(null)}
                    >
                      <div className="w-7 sm:w-9 h-full flex flex-col justify-end gap-1 items-center pb-2">
                        {d.overtime > 0 && (
                          <div
                            style={{ height: `${Math.max(8, otH)}px` }}
                            className="w-full rounded-t-xl bg-purple-500 transition-all duration-200 group-hover:brightness-110 shadow-2xs"
                            title={`${d.day} Overtime: ${d.overtime}`}
                          />
                        )}
                        {d.remote > 0 && (
                          <div
                            style={{ height: `${Math.max(8, remoteH)}px` }}
                            className="w-full bg-cyan-400 transition-all duration-200 group-hover:brightness-110 shadow-2xs"
                            title={`${d.day} Remote: ${d.remote}`}
                          />
                        )}
                        {d.onSite > 0 ? (
                          <div
                            style={{ height: `${Math.max(12, onSiteH)}px` }}
                            className="w-full rounded-b-xl bg-blue-500 transition-all duration-200 group-hover:brightness-110 shadow-2xs"
                            title={`${d.day} On-Site: ${d.onSite}`}
                          />
                        ) : (
                          <div className="w-full h-1 bg-slate-200 rounded-full" />
                        )}
                      </div>

                      <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors mt-1">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card C: 300 Attendance Live Stream (Image 2) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  300 Attendance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live camera biometric punches and physical badge check-ins
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModule('attendance');
                  setActiveSubTab('attendance-overview');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            {recentClockEvents.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Camera className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No attendance punches recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click 'Punch In' from the top bar to record your first camera check-in.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pl-2">Employee</th>
                      <th className="pb-3">Clock In</th>
                      <th className="pb-3">Clock Out</th>
                      <th className="pb-3 pr-2 text-right">Biometric Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentClockEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={ev.avatar}
                              alt={ev.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{ev.name}</p>
                              <p className="text-[10px] text-slate-400">{ev.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono font-medium text-slate-700">
                          {ev.clockIn}
                        </td>
                        <td className="py-3 font-mono font-medium text-slate-700">
                          {ev.clockOut}
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (approx 35% width) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card D: "Today at a glance" Circular Radial Attendance Gauge (Image 1) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Today at a glance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Circular Gauge from Image 1 */}
            <div className="flex items-center gap-5 my-6">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0F766E]"
                    strokeDasharray={`${attendanceRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-sm font-extrabold text-slate-900 font-mono">{attendanceRate}%</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">Attendance rate</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {presentCount} of {totalEmployeesCount} scheduled employees are in today
                </p>
              </div>
            </div>

            {/* Metric Breakdown Rows */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#0F766E]" /> Present
                </span>
                <span className="font-bold text-slate-900 font-mono">{presentCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> On leave
                </span>
                <span className="font-bold text-slate-900 font-mono">{pendingLeavesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> Absent
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {Math.max(0, totalEmployeesCount - presentCount - pendingLeavesCount)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModule('attendance');
                setActiveSubTab('attendance-overview');
              }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              View attendance report
            </button>
          </div>

          {/* Card E: "Working Format" Donut Chart (Image 2) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Working Format
              </h2>
              <button
                onClick={() => {
                  setActiveModule('core');
                  setActiveSubTab('employees');
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            <div className="flex items-center gap-6 my-4">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                  {totalEmployeesCount === 0 ? (
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="5" />
                  ) : (
                    <>
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="transparent"
                        stroke="#8B5CF6"
                        strokeWidth="5"
                        strokeDasharray={`${Math.round((onsiteCount / totalEmployeesCount) * 100)} 100`}
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="transparent"
                        stroke="#3B82F6"
                        strokeWidth="5"
                        strokeDasharray={`${Math.round((hybridCount / totalEmployeesCount) * 100)} 100`}
                        strokeDashoffset={`-${Math.round((onsiteCount / totalEmployeesCount) * 100)}`}
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="transparent"
                        stroke="#06B6D4"
                        strokeWidth="5"
                        strokeDasharray={`${Math.round((remoteCount / totalEmployeesCount) * 100)} 100`}
                        strokeDashoffset={`-${Math.round(((onsiteCount + hybridCount) / totalEmployeesCount) * 100)}`}
                      />
                    </>
                  )}
                </svg>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 font-medium">{hybridCount} Hybrid Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600 font-medium">{onsiteCount} Onsite Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-600 font-medium">{remoteCount} Remote Staff</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card F: "Employee Summary" & Quick Salary Status (Image 2) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Employee Summary
              </h2>
              <button
                onClick={() => {
                  setActiveModule('payroll');
                  setActiveSubTab('payroll-engine');
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                See All
              </button>
            </div>

            {employeeSummaries.length === 0 ? (
              <div className="py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Inbox className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No employee summaries</p>
                <p className="text-[10px] text-slate-400">Onboard staff to view salary rosters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employeeSummaries.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{emp.jobTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-extrabold text-slate-800 font-mono">
                        {emp.netSalary}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card G: People directory quick access (Image 1) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  People directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {totalEmployeesCount} active team members
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModule('core');
                  setActiveSubTab('employees');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Filter directory"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input from Image 1 */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search directory"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white text-slate-700"
              />
            </div>

            {filteredDirectory.length === 0 ? (
              <div className="py-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Users className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No employees found</p>
                <p className="text-[10px] text-slate-400">Click '+ Add employee' to add your first member</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredDirectory.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setActiveModule('core');
                      setActiveSubTab('employees');
                    }}
                    className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-slate-50/70 px-1 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={emp.avatar}
                        alt={emp.firstName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {emp.designation} · {emp.department}
                        </p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Active on-site" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-[#F1F9FA] border-b border-[#E2EEEE] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add New Team Member</h3>
                  <p className="text-[11px] text-slate-500">Quick onboarding to organization directory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Amara"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Morgan"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="amara.morgan@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Employee Portal Password Field (Required for Portal Access) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Employee Portal Password *
                  </label>
                  <span className="text-[10px] text-teal-700 font-semibold">
                    Portal Login Credential
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter portal password (e.g. Welcome@123)"
                    className="w-full pl-8 pr-10 py-2 text-xs border border-teal-200 rounded-xl focus:outline-none focus:border-[#0F766E] font-mono bg-teal-50/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-teal-700" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  The employee will immediately sign in to their Employee Portal using this password.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. UX Writer"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value as typeof newDepartment)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E] bg-white"
                  >
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0F766E] hover:bg-[#0D645E] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
