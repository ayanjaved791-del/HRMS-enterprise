import React from 'react';
import {
  Compass,
  TrendingUp,
  BarChart,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const CompetencyFramework: React.FC = () => {
  const { competencies } = useHR();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Competency Mapping Framework</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Benchmark departmental skill matrices, required seniority levels, and capability gap analysis
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Core Competency Domain</th>
              <th className="py-3 px-4 text-center">Required Target (1-5)</th>
              <th className="py-3 px-4 text-center">Current Team Level</th>
              <th className="py-3 px-4 text-center">Competency Delta</th>
              <th className="py-3 px-4">Action Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {competencies.map((comp) => (
              <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">{comp.department}</td>
                <td className="py-3.5 px-4 text-slate-700 font-semibold">{comp.skillName}</td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                  {comp.requiredLevel} / 5.0
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-orange-600">
                  {comp.currentAverageLevel} / 5.0
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold">
                  <span
                    className={`inline-block px-2 py-0.5 rounded ${
                      comp.gap < -0.2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {comp.gap > 0 ? `+${comp.gap}` : comp.gap}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {comp.gap < -0.2 ? (
                    <span className="text-amber-700 font-medium">LMS Upskilling Track Assigned</span>
                  ) : (
                    <span className="text-emerald-700 font-medium">Benchmark Satisfied</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
