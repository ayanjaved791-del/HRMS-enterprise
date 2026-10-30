import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode
} from 'lucide-react';
import { PayrollRun, Company } from '../../../types';
import { useHR } from '../../../context/HRContext';

interface PayslipModalProps {
  run: PayrollRun | null;
  company: Company;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ run, company, onClose }) => {
  const { payslipTemplate } = useHR();

  if (!run) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>Digital Payslip Voucher</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body adhering to Custom Design */}
        <div
          className={`p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-800 print:p-0 ${getFontFamilyClass(
            payslipTemplate.fontFamily
          )}`}
        >
          {/* Header */}
          {payslipTemplate.headerStyle === 'banner' ? (
            <div
              className="p-5 rounded-2xl text-white"
              style={{ backgroundColor: payslipTemplate.primaryColor }}
            >
              <div className="flex items-start justify-between">
                <div>
                  {payslipTemplate.showLogo && (
                    <span className="inline-block px-2.5 py-0.5 rounded bg-white/20 font-black text-xs tracking-wider mb-2">
                      {company.name}
                    </span>
                  )}
                  <h1 className="text-base font-black tracking-tight">{payslipTemplate.headerTitle}</h1>
                  <p className="text-[11px] text-white/80 mt-0.5">{payslipTemplate.headerSubtitle}</p>
                </div>
                <div className="text-right text-[11px] font-mono">
                  <p className="font-bold">{company.hqLocation.name}</p>
                  <p className="text-white/80 text-[10px] mt-0.5">Ref: {payslipTemplate.companyTaxNumber}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-base font-bold text-slate-900" style={{ color: payslipTemplate.primaryColor }}>
                  {payslipTemplate.headerTitle}
                </h1>
                <p className="font-semibold text-xs text-slate-800 mt-0.5">{company.name}</p>
                <p className="text-slate-500 text-[11px]">{payslipTemplate.headerSubtitle}</p>
              </div>

              <div className="text-right">
                <span
                  className="px-2.5 py-1 rounded text-white text-[10px] font-bold uppercase"
                  style={{ backgroundColor: payslipTemplate.primaryColor }}
                >
                  {run.paymentStatus} · Electronic Disbursal
                </span>
                <p className="text-slate-500 mt-2 font-mono text-[11px]">Pay Period: {run.period}</p>
                <p className="text-slate-400 font-mono text-[10px]">Reference: {run.id}</p>
              </div>
            </div>
          )}

          {/* Employee Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Employee Name</p>
              <p className="font-bold text-slate-900 mt-0.5">{run.employeeName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Department</p>
              <p className="font-semibold text-slate-800 mt-0.5">{run.department}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Designation</p>
              <p className="font-semibold text-slate-800 mt-0.5">{run.designation}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Bank Account</p>
              <p className="font-mono text-slate-800 mt-0.5">{run.bankAccount}</p>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="px-4 py-2 font-bold text-white text-xs"
                style={{ backgroundColor: payslipTemplate.primaryColor }}
              >
                {payslipTemplate.earningsHeading}
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Monthly Wage</span>
                  <span className="font-semibold text-slate-900 font-mono">${run.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900 font-mono">${run.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Special Executive Allowance</span>
                  <span className="font-semibold text-slate-900 font-mono">${run.allowances.toLocaleString()}</span>
                </div>
                {run.reimbursements > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Approved Expense Reimbursement</span>
                    <span className="font-semibold text-emerald-600 font-mono">+${run.reimbursements.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Total Earnings</span>
                  <span className="font-mono">${run.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 font-bold text-white text-xs">
                {payslipTemplate.deductionsHeading}
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Statutory Tax Withholding</span>
                  <span className="font-semibold text-red-600 font-mono">-${run.statutoryTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Provident Fund / 401(k) Match</span>
                  <span className="font-semibold text-blue-600 font-mono">-${run.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Health & Vision Plan Deductions</span>
                  <span className="font-semibold text-slate-700 font-mono">-${run.benefitsDeduction.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-red-600">
                  <span>Total Withholdings</span>
                  <span className="font-mono">
                    -${(run.statutoryTax + run.providentFund + run.benefitsDeduction).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Highlight Box */}
          <div
            className="p-4 rounded-xl border flex items-center justify-between text-white"
            style={{ backgroundColor: payslipTemplate.primaryColor }}
          >
            <div>
              <p className="text-[11px] uppercase font-bold text-white/80">{payslipTemplate.netPayHeading}</p>
              <p className="text-2xl font-black tabular-nums font-mono mt-0.5">
                ${run.netPayable.toLocaleString()} USD
              </p>
            </div>
            <div className="text-right text-[11px] text-white/90 font-medium">
              <p>Direct Deposit Initiated: {run.disbursedDate || 'Today'}</p>
              <p className="text-[10px] text-white/80">ACH Settlement Confirmed</p>
            </div>
          </div>

          {/* Signoff & Footnote */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>{payslipTemplate.footerNote}</span>
            {payslipTemplate.showQrCode && (
              <div className="flex items-center gap-1.5">
                <QrCode className="w-5 h-5 text-slate-600" />
                <span className="font-mono">VERIFIED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
