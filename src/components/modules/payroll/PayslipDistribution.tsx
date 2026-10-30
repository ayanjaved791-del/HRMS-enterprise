import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  DollarSign,
  Play
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { PayrollRun } from '../../../types';

interface PayslipDistributionProps {
  onViewPayslip: (run: PayrollRun) => void;
}

export const PayslipDistribution: React.FC<PayslipDistributionProps> = ({ onViewPayslip }) => {
  const { payrollRuns, currentUser, activeRole, processPayrollRun, setActiveSubTab } = useHR();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = payrollRuns.filter((r) => {
    const matchesUser =
      activeRole === 'admin' ||
      (currentUser?.employeeId && r.employeeId === currentUser.employeeId) ||
      (currentUser?.name && r.employeeName.toLowerCase().includes(currentUser.name.toLowerCase()));
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.period.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Payslip Distribution System</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted PDF payslip vouchers, electronic delivery receipts, and tax year-to-date summaries
          </p>
        </div>

        {activeRole === 'admin' && (
          <button
            onClick={() => {
              if (payrollRuns.length === 0) {
                processPayrollRun();
              } else {
                setActiveSubTab('payroll-engine');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{payrollRuns.length === 0 ? 'Run & Distribute Payroll' : 'Open Payroll Engine'}</span>
          </button>
        )}
      </div>

      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payslips by employee name or period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold px-2">
          {filtered.length} Distributed Payslips
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center border-dashed border-slate-200 space-y-3">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Payslip Vouchers Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Execute a payroll run in the Gross-to-Net engine to generate and disburse digital payslips for all team members.
            </p>
            {activeRole === 'admin' && (
              <button
                onClick={() => processPayrollRun()}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 shadow-2xs"
              >
                Execute First Payroll Run
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Pay Period</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Gross Earnings</th>
                  <th className="py-3 px-4">Net Take-Home</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View / PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">{run.period}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{run.employeeName}</td>
                    <td className="py-3 px-4 text-slate-500">{run.department}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 tabular-nums">
                      ${run.grossSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 tabular-nums">
                      ${run.netPayable.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {run.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewPayslip(run)}
                        className="px-3 py-1 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Printable Slip</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
