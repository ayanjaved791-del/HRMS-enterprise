import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { LeaveRequest } from '../../../types';

export const LeaveTracker: React.FC = () => {
  const {
    leaveRequests,
    updateLeaveStatus,
    applyLeave,
    activeRole,
    currentUser,
    employees,
  } = useHR();

  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Form State
  const [type, setType] = useState<LeaveRequest['type']>('Annual');
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-12');
  const [days, setDays] = useState(3);
  const [reason, setReason] = useState('');

  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) ||
    employees[0];

  const filtered = leaveRequests.filter((l) => {
    const matchesType = filterType === 'All' || l.type === filterType;
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    applyLeave({
      type,
      startDate,
      endDate,
      days: Number(days),
      reason,
    });
    setIsApplyOpen(false);
    setReason('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Automated Leave & PTO Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time balance deduction, statutory holiday calendar integration, and manager sign-offs
          </p>
        </div>

        <button
          onClick={() => setIsApplyOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balances Grid for Active Employee */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Annual PTO</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {currentEmp.leaveBalances.annual} days
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Accrued 1.66d / month</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Sick Leave</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {currentEmp.leaveBalances.sick} days
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Medical cert upon &gt; 2d</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Casual Leave</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {currentEmp.leaveBalances.casual} days
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ad-hoc urgent needs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Parental Leave</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {currentEmp.leaveBalances.parental} days
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Fully paid family benefit</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {['All', 'Annual', 'Sick', 'Casual'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === t
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration & Dates</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Status</th>
                {activeRole === 'admin' && <th className="py-3 px-4 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{req.employeeName}</p>
                        <p className="text-[11px] text-slate-500">{req.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{req.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{req.days} Day{req.days > 1 ? 's' : ''}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {req.startDate} → {req.endDate}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {req.appliedOn}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                    {req.approvedBy && (
                      <p className="text-[10px] text-slate-400 mt-0.5">By {req.approvedBy}</p>
                    )}
                  </td>

                  {activeRole === 'admin' && (
                    <td className="py-3 px-4 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateLeaveStatus(req.id, 'Approved')}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(req.id, 'Rejected', 'Exceeded department roster cap')}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Apply for Paid Leave (PTO)</h3>
              <button onClick={() => setIsApplyOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Annual">Annual Vacation ({currentEmp.leaveBalances.annual} days left)</option>
                  <option value="Sick">Sick Leave ({currentEmp.leaveBalances.sick} days left)</option>
                  <option value="Casual">Casual Leave ({currentEmp.leaveBalances.casual} days left)</option>
                  <option value="Parental">Parental Leave ({currentEmp.leaveBalances.parental} days left)</option>
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
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Days</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the purpose of your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
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
