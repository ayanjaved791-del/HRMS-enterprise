import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  Building,
  Info,
  Calendar
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const GratuityCalculator: React.FC = () => {
  const { employees } = useHR();
  const [selectedEmpId, setSelectedEmpId] = useState(employees[1].id);
  const [yearsOfService, setYearsOfService] = useState(4.5);
  const [contractType, setContractType] = useState<'Unlimited' | 'Limited'>('Unlimited');
  const [separationReason, setSeparationReason] = useState<'Resignation' | 'Termination'>('Resignation');

  const emp = employees.find((e) => e.id === selectedEmpId) || employees[1];
  const lastDrawnBase = emp.salary.baseMonthly;

  // Statutory formula:
  // First 5 years: 21 days basic salary per year
  // Beyond 5 years: 30 days basic salary per year
  // Daily wage = monthly basic / 30
  const dailyWage = lastDrawnBase / 30;
  let gratuityAmount = 0;

  if (yearsOfService <= 5) {
    gratuityAmount = yearsOfService * 21 * dailyWage;
  } else {
    const first5 = 5 * 21 * dailyWage;
    const additionalYears = yearsOfService - 5;
    gratuityAmount = first5 + additionalYears * 30 * dailyWage;
  }

  // Resignation reduction if under 3 years in unlimited contract
  if (separationReason === 'Resignation' && yearsOfService < 1) {
    gratuityAmount = 0;
  } else if (separationReason === 'Resignation' && yearsOfService < 3) {
    gratuityAmount = gratuityAmount * (1 / 3);
  } else if (separationReason === 'Resignation' && yearsOfService < 5) {
    gratuityAmount = gratuityAmount * (2 / 3);
  }

  const finalGratuity = Math.round(gratuityAmount);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">End-of-Service Gratuity Calculator</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Statutory severance and end-of-service benefits calculation based on tenure duration and basic wages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Employee & Service Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.firstName} {e.lastName} (Joined: {e.joiningDate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completed Years of Service
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="35"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Separation Category</label>
              <select
                value={separationReason}
                onChange={(e) => setSeparationReason(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="Resignation">Voluntary Resignation</option>
                <option value="Termination">Company Separation / Redundancy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Classification</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="Unlimited">Unlimited Duration Agreement</option>
                <option value="Limited">Fixed-Term Duration Agreement</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Calculation Logic Applied:</p>
            <p>• Daily Basic Wage: ${Math.round(dailyWage)}/day (based on ${lastDrawnBase}/mo base salary)</p>
            <p>• Tenure Tier: {yearsOfService <= 5 ? 'Tier 1 (21 days per year)' : 'Tier 2 (21 days first 5y + 30 days thereafter)'}</p>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              End-of-Service Benefit
            </h3>

            <div className="mt-4 p-4 bg-orange-50/70 border border-orange-200 rounded-xl">
              <span className="text-xs text-orange-900 font-medium">Estimated Gratuity Settlement</span>
              <p className="text-3xl font-extrabold text-orange-600 mt-1 tabular-nums">
                ${finalGratuity.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-orange-800/80 mt-1 font-mono">
                Payable to {emp.firstName} {emp.lastName}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 p-3 bg-slate-50 rounded-xl">
            Calculated under standard international labor standards and regional severance formulas.
          </div>
        </div>
      </div>
    </div>
  );
};
