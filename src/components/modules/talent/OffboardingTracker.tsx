import React from 'react';
import {
  UserMinus,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Lock
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const OffboardingTracker: React.FC = () => {
  const { offboardingRecords, updateOffboardingStatus } = useHR();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Offboarding & De-provisioning Tracker</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage graceful exits, IT single-sign-on revocation, company asset return, and exit interviews
        </p>
      </div>

      <div className="space-y-4">
        {offboardingRecords.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{rec.employeeName}</h3>
                <p className="text-xs text-slate-500">
                  Resignation: {rec.resignationDate} · Last Working Day: {rec.lastWorkingDay}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 self-start sm:self-auto">
                Status: {rec.status}
              </span>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => updateOffboardingStatus(rec.id, { exitInterviewCompleted: !rec.exitInterviewCompleted })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  rec.exitInterviewCompleted
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Exit Interview</span>
                </div>
                <p className="text-[11px] opacity-80">
                  {rec.exitInterviewCompleted ? 'Completed & Logged' : 'Pending Scheduling'}
                </p>
              </button>

              <button
                onClick={() => updateOffboardingStatus(rec.id, { assetsReturned: !rec.assetsReturned })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  rec.assetsReturned
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hardware Assets</span>
                </div>
                <p className="text-[11px] opacity-80">
                  {rec.assetsReturned ? 'Checked into IT Cage' : 'Awaiting Laptop Return'}
                </p>
              </button>

              <button
                onClick={() => updateOffboardingStatus(rec.id, { accessRevoked: !rec.accessRevoked })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  rec.accessRevoked
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>IT Access Revocation</span>
                </div>
                <p className="text-[11px] opacity-80">
                  {rec.accessRevoked ? 'Okta & GitHub Revoked' : 'Scheduled at 05:00 PM'}
                </p>
              </button>

              <button
                onClick={() => updateOffboardingStatus(rec.id, { financialClearance: !rec.financialClearance })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  rec.financialClearance
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Financial Clearance</span>
                </div>
                <p className="text-[11px] opacity-80">
                  {rec.financialClearance ? 'Gratuity & PTO Settled' : 'Final Payroll Hold'}
                </p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
