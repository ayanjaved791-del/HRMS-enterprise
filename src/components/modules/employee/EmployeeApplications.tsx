import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  FileCheck2
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { LeaveRequest } from '../../../types';

export const EmployeeApplications: React.FC = () => {
  const {
    currentUser,
    employees,
    leaveRequests,
    applyLeave,
    expenseClaims,
    addExpenseClaim,
    selectedCurrency
  } = useHR();

  const [activeTab, setActiveTab] = useState<'leaves' | 'expenses'>('leaves');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Leave Form
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('Annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');

  // Expense Form
  const [expenseCategory, setExpenseCategory] = useState<'Travel' | 'Hardware' | 'Client Meal' | 'Software' | 'Wellness'>('Travel');
  const [expenseAmount, setExpenseAmount] = useState(120);
  const [expenseDesc, setExpenseDesc] = useState('');

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const currentEmp = employees.find((e) => e.id === currentEmpId || e.email.toLowerCase() === currentUser?.email.toLowerCase());

  const myLeaves = leaveRequests.filter((l) => l.employeeId === currentEmpId || (currentEmp && l.employeeId === currentEmp.id));
  const myExpenses = expenseClaims.filter((e) => e.employeeId === currentEmpId || (currentEmp && e.employeeId === currentEmp.id));

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    applyLeave({
      type: leaveType,
      startDate,
      endDate,
      days: Number(days),
      reason: leaveReason.trim(),
    });

    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setDays(1);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim()) return;

    addExpenseClaim({
      category: expenseCategory,
      amount: Number(expenseAmount),
      currency: selectedCurrency,
      description: expenseDesc.trim(),
      claimDate: new Date().toISOString().split('T')[0],
      receiptUrl: 'https://images.unsplash.com/photo-1554415707-9e4c01d29388?w=300&auto=format&fit=crop&q=80',
    });

    setIsExpenseModalOpen(false);
    setExpenseDesc('');
    setExpenseAmount(120);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-[#0F766E]">
              <FileCheck2 className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Applications & Status Tracker</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit leave requests and expense reimbursement claims directly to company administration
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'leaves' ? (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D645E] rounded-xl shadow-xs transition-colors cursor-pointer btn-glow-teal"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          ) : (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>File Expense Claim</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'leaves'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Leave Applications ({myLeaves.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'expenses'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>My Expense Claims ({myExpenses.length})</span>
        </button>
      </div>

      {/* Leave Balances Header Cards */}
      {activeTab === 'leaves' && currentEmp && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[11px] font-semibold text-slate-500">Annual Leave Bank</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{currentEmp.leaveBalances.annual} days</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[11px] font-semibold text-slate-500">Sick Leave</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{currentEmp.leaveBalances.sick} days</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[11px] font-semibold text-slate-500">Casual Leave</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{currentEmp.leaveBalances.casual} days</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[11px] font-semibold text-slate-500">Parental Leave</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{currentEmp.leaveBalances.parental} days</p>
          </div>
        </div>
      )}

      {/* Leave Applications List */}
      {activeTab === 'leaves' && (
        <div className="space-y-3">
          {myLeaves.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Leave Applications Filed</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Need time off? Click "Apply for Leave" above. Your request will go immediately to the administrator panel for review.
              </p>
            </div>
          ) : (
            myLeaves.map((l) => (
              <div
                key={l.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-200">
                      {l.type} Leave
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        l.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : l.status === 'Rejected'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-semibold mt-1">"{l.reason}"</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">
                      Duration: {l.startDate} to {l.endDate} ({l.days} days)
                    </span>
                    <span>·</span>
                    <span>Applied on: {l.appliedOn}</span>
                    {l.approvedBy && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 font-semibold">Approved by {l.approvedBy}</span>
                      </>
                    )}
                    {l.rejectionReason && (
                      <>
                        <span>·</span>
                        <span className="text-red-600 font-medium">Rejection Note: {l.rejectionReason}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      l.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : l.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {l.status === 'Approved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : l.status === 'Rejected' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{l.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Expense Claims List */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {myExpenses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Expense Claims Filed</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                File a claim for business travel, client meals, or home office hardware to get reimbursed.
              </p>
            </div>
          ) : (
            myExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
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

                  <p className="text-xs text-slate-800 font-semibold">{exp.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Claim Date: {exp.claimDate}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black font-mono text-slate-900">
                    ${exp.amount.toLocaleString()} {exp.currency}
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize">{exp.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Apply for Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                >
                  <option value="Annual">Annual Paid Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Casual">Casual Personal Leave</option>
                  <option value="Parental">Parental Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
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
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Days</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Taking annual leave for family travel..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Expense Claim Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">File Expense Claim</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="Travel">Flight & Transport</option>
                  <option value="Hardware">Hardware & Monitors</option>
                  <option value="Client Meal">Client Hospitality / Meal</option>
                  <option value="Software">Software & Cloud Licenses</option>
                  <option value="Wellness">Wellness & Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount ({selectedCurrency}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Business Justification *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Ergonomic keyboard purchase for remote office..."
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
