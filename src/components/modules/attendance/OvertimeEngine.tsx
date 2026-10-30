import React, { useState } from 'react';
import {
  Coins,
  Calculator,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Plus
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { OvertimeLog } from '../../../types';

export const OvertimeEngine: React.FC = () => {
  const { employees } = useHR();

  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [overtimeHours, setOvertimeHours] = useState(4);
  const [rateType, setRateType] = useState<1.5 | 2.0>(1.5);
  const [reason, setReason] = useState('Critical system deployment & migration');
  const [otClaims, setOtClaims] = useState<OvertimeLog[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const hourlyBase = emp ? Math.round((emp.salary.baseMonthly * 12) / (52 * 40)) : 50;
  const calculatedPayout = Math.round(hourlyBase * rateType * overtimeHours);

  const handleLogClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emp) return;
    const newClaim: OvertimeLog = {
      id: `ot_${Date.now()}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      date: '2026-10-29',
      hours: overtimeHours,
      multiplier: rateType,
      baseHourlyRate: hourlyBase,
      payoutAmount: calculatedPayout,
      reason,
      status: 'Pending',
    };
    setOtClaims((prev) => [newClaim, ...prev]);
    setNotice(`Overtime claim of $${calculatedPayout} logged for ${emp.firstName} ${emp.lastName}`);
    setTimeout(() => setNotice(null), 2500);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Overtime Calculation Engine</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Statutory overtime rules (FLSA 1.5x standard weekday, 2.0x weekend/holiday double-time)
        </p>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Interactive Simulator Card */}
      <form onSubmit={handleLogClaim} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-500" />
          Interactive Overtime & Wage Calculator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} (${e.salary.baseMonthly}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Overtime Hours</label>
            <input
              type="number"
              min="0.5"
              max="40"
              step="0.5"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Statutory Multiplier</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRateType(1.5)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  rateType === 1.5
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                1.5x (Weekday)
              </button>
              <button
                type="button"
                onClick={() => setRateType(2.0)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  rateType === 2.0
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                2.0x (Holiday)
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Calculated Payout</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">
              ${calculatedPayout.toLocaleString()} USD
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
              ${hourlyBase}/h × {rateType} × {overtimeHours}h
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <input
            type="text"
            placeholder="Reason for overtime authorization..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            Log Overtime Claim
          </button>
        </div>
      </form>

      {/* Overtime Claims History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Logged Overtime Claims
          </h3>
          <span className="text-xs text-slate-400 font-mono">Synced with payroll engine</span>
        </div>

        {otClaims.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400 italic">
            No overtime claims logged yet. Use the simulator above to log an authorized claim.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Logged Hours</th>
                  <th className="py-3 px-4">Multiplier</th>
                  <th className="py-3 px-4">Base Hourly</th>
                  <th className="py-3 px-4">Total Payout</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {otClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{claim.employeeName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{claim.date}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{claim.hours} hrs</td>
                    <td className="py-3 px-4 font-semibold text-orange-600">{claim.multiplier}x</td>
                    <td className="py-3 px-4 font-mono tabular-nums">${claim.baseHourlyRate}/h</td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">${claim.payoutAmount}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={claim.reason}>
                      {claim.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {claim.status}
                      </span>
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
