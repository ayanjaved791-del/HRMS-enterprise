import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const ManagerMssDashboard: React.FC = () => {
  const {
    currentUser,
    employees,
    leaveRequests,
    updateLeaveStatus,
    timesheets,
    updateTimesheetStatus,
    attendanceRecords,
    setActiveModule,
    setActiveSubTab,
  } = useHR();

  const currentEmpId = currentUser?.employeeId || employees[0]?.id || '';
  const myDirectReports = employees.filter(
    (e) => e.managerId === currentEmpId || (currentUser?.role === 'admin' && e.id !== currentEmpId)
  );

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const pendingTimesheets = timesheets.filter((t) => t.status === 'Submitted');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Manager Self-Service Dashboard (MSS)</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Orchestrate your direct reports, pending time-off approvals, timesheet hours, and team coverage
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Direct Reports</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {myDirectReports.length} Team Members
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Under your leadership line</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Pending PTO Requests</p>
          <p className="text-2xl font-extrabold text-orange-600 mt-1 tabular-nums">
            {pendingLeaves.length}
          </p>
          <p className="text-[11px] text-orange-600/80 mt-0.5">Awaiting manager decision</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Timesheets for Review</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums">
            {pendingTimesheets.length}
          </p>
          <p className="text-[11px] text-blue-600/80 mt-0.5">Weekly sprint submissions</p>
        </div>
      </div>

      {/* Approval Queues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              Leave Requests Needing Approval
            </h3>
            <span className="text-xs text-orange-600 font-semibold">{pendingLeaves.length} items</span>
          </div>

          <div className="space-y-3">
            {pendingLeaves.map((l) => (
              <div
                key={l.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{l.employeeName}</p>
                  <p className="text-slate-500">
                    {l.days} days {l.type} ({l.startDate} → {l.endDate})
                  </p>
                  <p className="text-[11px] text-slate-400 italic mt-0.5">"{l.reason}"</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateLeaveStatus(l.id, 'Approved')}
                    className="px-2.5 py-1 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateLeaveStatus(l.id, 'Rejected')}
                    className="px-2 py-1 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {pendingLeaves.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center italic">No pending leave requests.</p>
            )}
          </div>
        </div>

        {/* Pending Timesheets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
              Timesheet Hours Verification
            </h3>
            <span className="text-xs text-blue-600 font-semibold">{pendingTimesheets.length} items</span>
          </div>

          <div className="space-y-3">
            {pendingTimesheets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{t.projectName}</p>
                  <p className="text-slate-500">{t.clientName} · {t.totalHours} hrs logged</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.taskDescription}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateTimesheetStatus(t.id, 'Approved')}
                    className="px-2.5 py-1 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateTimesheetStatus(t.id, 'Rejected')}
                    className="px-2 py-1 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {pendingTimesheets.length === 0 && (
              <p className="text-xs text-slate-400 py-6 text-center italic">All timesheets reviewed.</p>
            )}
          </div>
        </div>
      </div>

      {/* Team Roster List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Direct Reports Directory
        </h3>
        {myDirectReports.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic">
            No direct reports currently assigned under this leadership profile.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myDirectReports.map((emp) => (
              <div
                key={emp.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs"
              >
                <img
                  src={emp.avatar}
                  alt={emp.firstName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{emp.designation}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
