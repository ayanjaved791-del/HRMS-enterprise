import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  DollarSign,
  FileText,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { ExpenseClaim } from '../../../types';

export const ExpenseClaims: React.FC = () => {
  const {
    expenseClaims,
    addExpenseClaim,
    updateExpenseStatus,
    activeRole,
    currentUser,
  } = useHR();

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseClaim['category']>('Travel');
  const [amount, setAmount] = useState(250);
  const [expenseDate, setExpenseDate] = useState('2026-10-25');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addExpenseClaim({
      title,
      category,
      amount: Number(amount),
      currency: 'USD',
      expenseDate,
      receiptName: `${title.toLowerCase().replace(/\s+/g, '_')}_receipt.pdf`,
      notes,
    });

    setIsSubmitOpen(false);
    setTitle('');
    setNotes('');
  };

  const totalReimbursed = expenseClaims
    .filter((e) => e.status === 'Reimbursed' || e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Expense Claim Reimbursement</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit receipts for client dinners, travel, hardware equipment, and professional certifications
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit New Claim</span>
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Approved Claims</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            ${totalReimbursed.toLocaleString()} USD
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Disbursed with monthly payroll</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
            {expenseClaims.filter((c) => c.status === 'Pending').length}
          </p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Under audit review</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Corporate Card Limit</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">$5,000 / mo</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Pre-authorized spending</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Claims Ledger
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time status tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Claim Item</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Receipt Proof</th>
                <th className="py-3 px-4">Status</th>
                {activeRole === 'admin' && <th className="py-3 px-4 text-right">Review</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{claim.title}</td>
                  <td className="py-3 px-4 text-slate-700">{claim.employeeName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {claim.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{claim.expenseDate}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 tabular-nums">
                    ${claim.amount.toLocaleString()} {claim.currency}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-600">
                    <span className="flex items-center gap-1 cursor-pointer hover:underline">
                      <FileText className="w-3.5 h-3.5" />
                      {claim.receiptName || 'receipt.pdf'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        claim.status === 'Approved' || claim.status === 'Reimbursed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : claim.status === 'Rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>

                  {activeRole === 'admin' && (
                    <td className="py-3 px-4 text-right">
                      {claim.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateExpenseStatus(claim.id, 'Approved')}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateExpenseStatus(claim.id, 'Rejected')}
                            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-lg transition-colors"
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

      {/* Submit Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">File Expense Claim</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certification Exam Fee"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Travel">Travel & Flight</option>
                    <option value="Client Dinner">Client Dinner</option>
                    <option value="Equipment">Hardware & Office</option>
                    <option value="Certification">Training & Certs</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Date</label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Justification</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this expense was necessary..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Submit Reimbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
