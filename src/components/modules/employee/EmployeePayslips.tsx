import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Building2,
  QrCode,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { PayrollRun } from '../../../types';

export const EmployeePayslips: React.FC = () => {
  const {
    currentUser,
    employees,
    payrollRuns,
    payslipTemplate,
    company,
    selectedCurrency
  } = useHR();

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const currentEmp = employees.find((e) => e.id === currentEmpId || e.email.toLowerCase() === currentUser?.email.toLowerCase());

  // Find all payslip runs for this employee
  const myRuns = payrollRuns.filter((r) => r.employeeId === currentEmpId || (currentEmp && r.employeeId === currentEmp.id));

  const [selectedRunId, setSelectedRunId] = useState<string | null>(myRuns[0]?.id || null);
  const selectedRun: PayrollRun | null = myRuns.find((r) => r.id === selectedRunId) || myRuns[0] || null;

  const handlePrint = () => {
    window.print();
  };

  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case 'JetBrains Mono':
        return 'font-mono';
      case 'Georgia':
        return 'font-serif';
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-[#0F766E]">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Payslips & Compensation Vouchers</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            View and download your official company-certified salary statements and compensation breakdown
          </p>
        </div>

        {selectedRun && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / Save as PDF</span>
          </button>
        )}
      </div>

      {!selectedRun ? (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xs text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F0FDFB] border border-[#A7F3D0] text-[#0F766E] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Payslip Vouchers Disbursed Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Your certified monthly salary statements will appear here once processed by your administrator through the corporate payroll engine.
            </p>
          </div>
          {currentEmp?.salary && (
            <div className="pt-4 mt-2 border-t border-slate-100 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Your Contracted Compensation Structure
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400">Base Monthly</p>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    ${currentEmp.salary.baseMonthly.toLocaleString()} {currentEmp.salary.currency || selectedCurrency}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400">House Rent Allowance</p>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    ${currentEmp.salary.hra.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400">Special Allowances</p>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    ${currentEmp.salary.specialAllowance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Voucher Canvas adhering to Admin's Custom Design */
        <div
          className={`max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none ${getFontFamilyClass(
            payslipTemplate.fontFamily
          )}`}
        >
        {/* Header Strip according to payslipTemplate.headerStyle */}
        {payslipTemplate.headerStyle === 'banner' ? (
          <div
            className="p-6 sm:p-8 text-white"
            style={{ backgroundColor: payslipTemplate.primaryColor }}
          >
            <div className="flex items-start justify-between">
              <div>
                {payslipTemplate.showLogo && (
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/20 font-black text-xs tracking-wider mb-2">
                    {company.name}
                  </div>
                )}
                <h1 className="text-xl font-black tracking-tight">{payslipTemplate.headerTitle}</h1>
                <p className="text-xs text-white/80 mt-1">{payslipTemplate.headerSubtitle}</p>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="font-bold">{company.hqLocation.name}</p>
                <p className="text-white/80 text-[11px] mt-0.5">Tax Ref: {payslipTemplate.companyTaxNumber}</p>
              </div>
            </div>
          </div>
        ) : payslipTemplate.headerStyle === 'two-tone' ? (
          <div className="border-b-4" style={{ borderColor: payslipTemplate.primaryColor }}>
            <div className="p-6 bg-slate-50 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold" style={{ color: payslipTemplate.primaryColor }}>
                  {payslipTemplate.headerTitle}
                </h1>
                <p className="text-xs text-slate-500 mt-1">{company.name} · {company.hqLocation.name}</p>
              </div>
              <div className="text-right font-mono text-xs text-slate-600">
                <span
                  className="px-2.5 py-1 rounded font-bold text-[10px] uppercase text-white"
                  style={{ backgroundColor: payslipTemplate.primaryColor }}
                >
                  Electronic Disbursal
                </span>
                <p className="mt-1.5 font-semibold">Ref: {payslipTemplate.companyTaxNumber}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 border-b border-slate-200 flex items-start justify-between bg-white">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{payslipTemplate.headerTitle}</h1>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">{company.name}</p>
              <p className="text-[11px] text-slate-400">{payslipTemplate.headerSubtitle}</p>
            </div>
            <div className="text-right">
              <span
                className="inline-block w-3.5 h-3.5 rounded-full mb-1"
                style={{ backgroundColor: payslipTemplate.primaryColor }}
              />
              <p className="text-xs font-mono font-bold text-slate-700">{payslipTemplate.companyTaxNumber}</p>
            </div>
          </div>
        )}

        {/* Voucher Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800">
          {/* Employee & Bank Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Employee Name</p>
              <p className="font-bold text-slate-900 mt-0.5 text-xs">{selectedRun.employeeName}</p>
              <p className="text-[10px] text-slate-500 font-mono">{currentEmp?.employeeCode || 'EMP-1001'}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Designation & Team</p>
              <p className="font-semibold text-slate-800 mt-0.5 text-xs">{selectedRun.designation}</p>
              <p className="text-[10px] text-slate-500">{selectedRun.department}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Pay Period</p>
              <p className="font-bold text-slate-900 mt-0.5 text-xs">{selectedRun.period}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Payment Status: {selectedRun.paymentStatus}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Disbursal Date</p>
              <p className="font-semibold text-slate-800 mt-0.5 text-xs">{selectedRun.disbursedDate || 'Oct 28, 2026'}</p>
              <p className="text-[10px] text-slate-400 font-mono">{selectedRun.id}</p>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="px-4 py-2 text-white font-bold text-xs"
                style={{ backgroundColor: payslipTemplate.primaryColor }}
              >
                {payslipTemplate.earningsHeading}
              </div>
              <div className="p-4 space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Base Wage</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${selectedRun.basicSalary.toLocaleString()} {selectedCurrency}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${selectedRun.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-600">Special Executive Allowance</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${selectedRun.allowances.toLocaleString()}
                  </span>
                </div>
                {selectedRun.reimbursements > 0 && (
                  <div className="flex justify-between pt-1.5">
                    <span className="text-slate-600">Approved Expense Reimbursement</span>
                    <span className="font-mono font-bold text-emerald-600">
                      +${selectedRun.reimbursements.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Gross Remuneration</span>
                  <span className="font-mono">${selectedRun.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 text-white font-bold text-xs">
                {payslipTemplate.deductionsHeading}
              </div>
              <div className="p-4 space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Statutory Tax Withholding</span>
                  <span className="font-mono font-bold text-red-600">
                    -${selectedRun.statutoryTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-600">Provident Fund / Retirement 401(k)</span>
                  <span className="font-mono font-bold text-blue-600">
                    -${selectedRun.providentFund.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-slate-600">Health & Vision Plan Deductions</span>
                  <span className="font-mono font-bold text-slate-700">
                    -${selectedRun.benefitsDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-red-600">
                  <span>Total Deductions</span>
                  <span className="font-mono">
                    -${(selectedRun.statutoryTax + selectedRun.providentFund + selectedRun.benefitsDeduction).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Banner */}
          <div
            className="p-5 rounded-xl border flex items-center justify-between text-white"
            style={{ backgroundColor: payslipTemplate.primaryColor }}
          >
            <div>
              <p className="text-[10px] uppercase font-bold text-white/80">{payslipTemplate.netPayHeading}</p>
              <p className="text-2xl sm:text-3xl font-black font-mono tracking-tight mt-0.5">
                ${selectedRun.netPayable.toLocaleString()} {selectedCurrency}
              </p>
            </div>

            <div className="text-right text-[11px] text-white/90">
              <p className="font-semibold">Electronic Direct Deposit Verified</p>
              <p className="text-white/70 text-[10px]">Settlement Date: {selectedRun.disbursedDate || 'Today'}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-800">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>{payslipTemplate.accountDetailsHeading}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Bank Partner</span>
                <span className="font-semibold text-slate-800">
                  {currentEmp?.bankDetails?.bankName || 'Standard Chartered Bank'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account Credential</span>
                <span className="font-mono font-bold text-slate-900">{selectedRun.bankAccount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">IFSC / Routing Code</span>
                <span className="font-mono font-medium text-slate-700">
                  {currentEmp?.bankDetails?.ifscOrRouting || 'SCBL0001290'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Branch Office</span>
                <span className="font-medium text-slate-700">
                  {currentEmp?.bankDetails?.branch || 'Headquarters City'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
            <div className="max-w-md">
              <p>{payslipTemplate.footerNote}</p>
            </div>

            {payslipTemplate.showQrCode && (
              <div className="flex items-center gap-2 shrink-0 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <QrCode className="w-7 h-7 text-slate-700" />
                <div>
                  <p className="font-bold text-[9px] uppercase text-slate-800">Digital Authenticity</p>
                  <p className="text-[8px] text-slate-400 font-mono">HRMate Certified</p>
                </div>
              </div>
            )}

            {payslipTemplate.showEmployerSignature && (
              <div className="text-right shrink-0">
                <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-serif italic text-slate-800 text-xs">
                  {payslipTemplate.signatoryName || 'Authorized Officer'}
                </div>
                <p className="text-[9px] font-semibold text-slate-600">
                  {payslipTemplate.signatoryTitle || 'Director of People & Finance'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
};
