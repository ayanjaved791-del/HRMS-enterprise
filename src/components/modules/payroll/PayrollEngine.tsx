import React, { useState } from 'react';
import {
  Coins,
  DollarSign,
  Play,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  Eye,
  Building2
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { PayrollRun } from '../../../types';

interface PayrollEngineProps {
  onViewPayslip: (run: PayrollRun) => void;
}

export const PayrollEngine: React.FC<PayrollEngineProps> = ({ onViewPayslip }) => {
  const {
    payrollRuns,
    processPayrollRun,
    selectedCurrency,
    currencyRates,
  } = useHR();

  const availablePeriods = Array.from(new Set(payrollRuns.map((p) => p.period)));
  const defaultPeriod = availablePeriods[0] || 'November 2026';

  const [filterPeriod, setFilterPeriod] = useState(defaultPeriod);
  const [isProcessingRun, setIsProcessingRun] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const rate = currencyRates[selectedCurrency] || 1;

  const currentPeriodRuns = payrollRuns.filter((p) => p.period === filterPeriod);

  const totalGross = currentPeriodRuns.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalTax = currentPeriodRuns.reduce((sum, r) => sum + r.statutoryTax, 0);
  const totalPF = currentPeriodRuns.reduce((sum, r) => sum + r.providentFund, 0);
  const totalNet = currentPeriodRuns.reduce((sum, r) => sum + r.netPayable, 0);

  const handleRunPayrollCycle = () => {
    setIsProcessingRun(true);
    setTimeout(() => {
      processPayrollRun();
      setFilterPeriod('November 2026');
      setIsProcessingRun(false);
      setSuccessMsg('November 2026 Payroll Cycle processed and direct deposits queued!');
      setTimeout(() => setSuccessMsg(null), 2500);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Gross-to-Net Payroll Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated statutory tax withholding, retirement fund deductions, and bank disbursement
          </p>
        </div>

        <button
          onClick={handleRunPayrollCycle}
          disabled={isProcessingRun}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isProcessingRun ? 'Processing Cycle...' : 'Run Payroll Cycle'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 4 Financial Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Gross Salary</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {selectedCurrency} {Math.round(totalGross * rate).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Base + HRA + Allowances</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Statutory Tax Withheld</p>
          <p className="text-xl font-extrabold text-red-600 mt-1 tabular-nums">
            {selectedCurrency} {Math.round(totalTax * rate).toLocaleString()}
          </p>
          <p className="text-[11px] text-red-600/80 mt-0.5">Federal & State brackets</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Retirement / 401(k)</p>
          <p className="text-xl font-extrabold text-blue-600 mt-1 tabular-nums">
            {selectedCurrency} {Math.round(totalPF * rate).toLocaleString()}
          </p>
          <p className="text-[11px] text-blue-600/80 mt-0.5">Employee contribution match</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Net Disbursement</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            {selectedCurrency} {Math.round(totalNet * rate).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Direct deposit cleared</p>
        </div>
      </div>

      {/* Payroll Records Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Payroll Ledger ({filterPeriod})
          </h3>

          <div className="flex items-center gap-2">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              {availablePeriods.length === 0 ? (
                <option value="November 2026">November 2026</option>
              ) : (
                availablePeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {currentPeriodRuns.length === 0 ? (
          <div className="p-12 text-center border-dashed border-slate-200 space-y-3">
            <Coins className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Payroll Disbursed for {filterPeriod}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Run the payroll engine cycle to compute tax withholding, employee deductions, and bank payouts.
            </p>
            <button
              onClick={handleRunPayrollCycle}
              disabled={isProcessingRun}
              className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 shadow-2xs"
            >
              Execute {filterPeriod} Run
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Gross Pay</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4">HRA & Allowances</th>
                  <th className="py-3 px-4">Tax Deductions</th>
                  <th className="py-3 px-4">401k / Benefits</th>
                  <th className="py-3 px-4">Net Payable</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPeriodRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{run.employeeName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{run.designation}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      {selectedCurrency} {Math.round(run.grossSalary * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-700">
                      {selectedCurrency} {Math.round(run.basicSalary * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-700">
                      {selectedCurrency} {Math.round((run.hra + run.allowances) * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-red-600 font-medium">
                      -{selectedCurrency} {Math.round(run.statutoryTax * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-blue-600 font-medium">
                      -{selectedCurrency} {Math.round((run.providentFund + run.benefitsDeduction) * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600 tabular-nums bg-emerald-50/30">
                      {selectedCurrency} {Math.round(run.netPayable * rate).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          run.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {run.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewPayslip(run)}
                        className="px-2.5 py-1 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Payslip</span>
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
