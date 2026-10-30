import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  AlertCircle,
  User,
  Building,
  Check,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const AdminApplications: React.FC = () => {
  const {
    leaveRequests,
    updateLeaveStatus,
    expenseClaims,
    updateExpenseStatus,
    employees,
    selectedCurrency
  } = useHR();

  const [activeTab, setActiveTab] = useState<'leaves' | 'expenses'>('leaves');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const pendingExpensesCount = expenseClaims.filter((e) => e.status === 'Pending').length;

  const filteredLeaves = leaveRequests.filter((leave) => {
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    const matchesSearch =
      leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredExpenses = expenseClaims.filter((claim) => {
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    const matchesSearch =
      claim.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmReject = (id: string, type: 'leave' | 'expense') => {
    if (type === 'leave') {
      updateLeaveStatus(id, 'Rejected', rejectionNote || 'Does not align with team scheduling constraints');
    } else {
      updateExpenseStatus(id, 'Rejected');
    }
    setRejectingId(null);
    setRejectionNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Employee Applications & Approvals</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and adjudicate incoming time-off requests, expense claims, and workplace petitions
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('leaves')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leaves'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leave Requests</span>
            {pendingLeavesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px] font-bold">
                {pendingLeavesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'expenses'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Expense Claims</span>
            {pendingExpensesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {pendingExpensesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by employee, category, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Tab */}
      {activeTab === 'leaves' && (
        <div className="space-y-3">
          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Leave Applications Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                When employees submit leave applications from their ESS portal, they will appear here for your review.
              </p>
            </div>
          ) : (
            filteredLeaves.map((leave) => {
              const emp = employees.find((e) => e.id === leave.employeeId);
              const remainingBal = emp?.leaveBalances[leave.type.toLowerCase() as keyof typeof emp.leaveBalances];

              return (
                <div
                  key={leave.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <img
                      src={leave.employeeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={leave.employeeName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900">{leave.employeeName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({leave.department})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-200">
                          {leave.type} Leave
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : leave.status === 'Rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700 animate-pulse'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">"{leave.reason}"</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-600">
                          Dates: {leave.startDate} to {leave.endDate} ({leave.days} day{leave.days > 1 ? 's' : ''})
                        </span>
                        <span>·</span>
                        <span>Applied on: {leave.appliedOn}</span>
                        {remainingBal !== undefined && (
                          <>
                            <span>·</span>
                            <span>Remaining Bank: {remainingBal} days</span>
                          </>
                        )}
                        {leave.rejectionReason && (
                          <>
                            <span>·</span>
                            <span className="text-red-500 font-medium">Note: {leave.rejectionReason}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {leave.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectingId(leave.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        {leave.status === 'Approved' ? '✓ Approved' : '✕ Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Expense Claims Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Expense Claims Filed</h4>
              <p className="text-xs text-slate-400 mt-1">
                Employee expense reimbursement claims for travel, hardware, and client dinners will appear here.
              </p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                    {exp.category[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">{exp.employeeName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          exp.status === 'Approved' || exp.status === 'Reimbursed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : exp.status === 'Rejected'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {exp.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{exp.description}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Filed: {exp.claimDate}</span>
                      <span>·</span>
                      <span className="font-bold text-slate-900 font-mono text-xs">
                        Amount: ${exp.amount.toLocaleString()} {exp.currency || selectedCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {exp.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updateExpenseStatus(exp.id, 'Approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => updateExpenseStatus(exp.id, 'Rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      {exp.status === 'Approved' || exp.status === 'Reimbursed' ? '✓ Approved' : '✕ Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Rejection Note Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Provide Rejection Reason</h3>
            <textarea
              rows={3}
              placeholder="e.g. Inadequate team coverage for scheduled sprint cycle..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReject(rejectingId, activeTab === 'leaves' ? 'leave' : 'expense')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
