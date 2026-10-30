import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  UserCheck
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const BackgroundVerifier: React.FC = () => {
  const { backgroundChecks } = useHR();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Employee Background Verifier</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Multi-jurisdiction identity authentication, criminal registry search, and prior employment credential validation
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Candidate / Employee</th>
              <th className="py-3 px-4">Screening Partner</th>
              <th className="py-3 px-4 text-center">Government ID</th>
              <th className="py-3 px-4 text-center">Degree / Education</th>
              <th className="py-3 px-4 text-center">Criminal History</th>
              <th className="py-3 px-4 text-center">Prior Employment</th>
              <th className="py-3 px-4">Overall Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {backgroundChecks.map((bg) => (
              <tr key={bg.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{bg.employeeName}</td>
                <td className="py-3.5 px-4 text-slate-600">{bg.agency}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {bg.identityCheck}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {bg.educationCheck}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {bg.criminalCheck}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {bg.priorEmploymentCheck === 'Verified' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" /> In Progress
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                      bg.overallStatus === 'Passed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {bg.overallStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
