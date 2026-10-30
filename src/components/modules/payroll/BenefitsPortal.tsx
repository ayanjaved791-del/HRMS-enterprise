import React from 'react';
import {
  Gift,
  ShieldCheck,
  Heart,
  Check,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const BenefitsPortal: React.FC = () => {
  const { benefitPlans, toggleBenefitEnrollment, currentUser } = useHR();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Benefits Administration Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise health coverage, 401(k) matching, wellness allowances, and open enrollment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 2026 Open Enrollment Active
          </span>
        </div>
      </div>

      {/* Benefits Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {benefitPlans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              plan.isEnrolled
                ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                  {plan.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    plan.isEnrolled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {plan.isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Provided by {plan.provider}</p>

              <div className="my-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                {plan.coverage}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 bg-slate-50/70 rounded-lg">
                  <p className="text-[10px] text-slate-400">Employer Pays</p>
                  <p className="font-bold text-slate-900 tabular-nums">${plan.employerContribution} / mo</p>
                </div>
                <div className="p-2.5 bg-slate-50/70 rounded-lg">
                  <p className="text-[10px] text-slate-400">Your Deduction</p>
                  <p className="font-bold text-orange-600 tabular-nums">${plan.employeeContribution} / mo</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {plan.enrolledCount} coworkers enrolled
              </span>

              <button
                onClick={() => toggleBenefitEnrollment(plan.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  plan.isEnrolled
                    ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                }`}
              >
                {plan.isEnrolled ? 'Opt Out' : 'Enroll Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
