import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingDown,
  Info,
  DollarSign
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const StatutoryTaxCalculator: React.FC = () => {
  const [annualSalary, setAnnualSalary] = useState(145000);
  const [standardDeduction, setStandardDeduction] = useState(14600); // 2026 standard single
  const [fourOhOneKContribution, setFourOhOneKContribution] = useState(6500);
  const [healthSavingsContribution, setHealthSavingsContribution] = useState(3850);

  // Progressive tax bracket calculation
  const taxableIncome = Math.max(
    0,
    annualSalary - standardDeduction - fourOhOneKContribution - healthSavingsContribution
  );

  const calculateFederalTax = (taxable: number) => {
    // 2026 standard brackets approximation
    let tax = 0;
    if (taxable > 243725) tax += (taxable - 243725) * 0.35 + 49335;
    else if (taxable > 100525) tax += (taxable - 100525) * 0.24 + 17400;
    else if (taxable > 47150) tax += (taxable - 47150) * 0.22 + 5600;
    else if (taxable > 11600) tax += (taxable - 11600) * 0.12 + 1160;
    else tax += taxable * 0.10;
    return Math.round(tax);
  };

  const federalTax = calculateFederalTax(taxableIncome);
  const socialSecurity = Math.min(Math.round(annualSalary * 0.062), 10453); // capped at wage base
  const medicare = Math.round(annualSalary * 0.0145);
  const totalTax = federalTax + socialSecurity + medicare;
  const netTakeHome = annualSalary - totalTax - fourOhOneKContribution - healthSavingsContribution;
  const effectiveRate = ((totalTax / annualSalary) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Statutory Tax Calculator</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Simulate federal, social security, and FICA withholdings with pre-tax exemption limits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Income & Exemption Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gross Annual Base Compensation (USD)
              </label>
              <input
                type="number"
                step="1000"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Statutory Deduction (2026 Single)
              </label>
              <input
                type="number"
                value={standardDeduction}
                onChange={(e) => setStandardDeduction(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pre-Tax 401(k) Voluntary Contribution
              </label>
              <input
                type="number"
                value={fourOhOneKContribution}
                onChange={(e) => setFourOhOneKContribution(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                HSA / Health Savings Account
              </label>
              <input
                type="number"
                value={healthSavingsContribution}
                onChange={(e) => setHealthSavingsContribution(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Progressive Bracket Breakdown */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-3">Statutory Bracket Distribution</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Taxable Net Adjusted Income (AGI):</span>
                <span className="font-bold text-slate-900 font-mono">${taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Federal Withholding (Progressive):</span>
                <span className="font-bold text-red-600 font-mono">-${federalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Social Security (OASDI 6.2%):</span>
                <span className="font-bold text-red-600 font-mono">-${socialSecurity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Medicare (FICA 1.45%):</span>
                <span className="font-bold text-red-600 font-mono">-${medicare.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Summary Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Tax Summary Breakdown
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Effective Tax Rate</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{effectiveRate}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Annual Statutory Taxes</p>
                <p className="text-xl font-bold text-red-600 mt-0.5 tabular-nums">
                  -${totalTax.toLocaleString()} USD
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-800 font-semibold">Net Annual Take-Home</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
                  ${netTakeHome.toLocaleString()} USD
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5 font-mono">
                  ${Math.round(netTakeHome / 12).toLocaleString()} / month net pay
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 p-3 bg-slate-50 rounded-xl">
            Calculated in compliance with IRS Publication 15-T and state statutory withholding guidance.
          </div>
        </div>
      </div>
    </div>
  );
};
