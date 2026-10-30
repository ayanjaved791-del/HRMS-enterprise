import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Users
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const DigitalOnboarding: React.FC = () => {
  const { onboardingTasks, toggleOnboardingTask, employees } = useHR();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');

  const newHire = employees.find((e) => e.id === selectedEmpId) || employees[0];

  if (!newHire) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
        <Users className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Employees in Directory</h3>
        <p className="text-xs text-slate-500">Add staff members to track their digital onboarding progress.</p>
      </div>
    );
  }

  const completedCount = onboardingTasks.filter((t) => t.completed).length;
  const progressPercent =
    onboardingTasks.length > 0
      ? Math.round((completedCount / onboardingTasks.length) * 100)
      : 0;

  const joinTime = new Date(newHire.joiningDate).getTime();
  const daysIn = Math.max(1, Math.floor((Date.now() - joinTime) / (1000 * 60 * 60 * 24)));

  const categories = ['Documentation', 'IT Setup', 'Compliance', 'Culture & Meet'] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Digital Onboarding Workflows</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive new-hire provisioning roadmap, security clearance, and culture immersion
          </p>
        </div>

        {/* Employee Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Viewing Candidate:</label>
          <select
            value={newHire.id}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.designation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={newHire.avatar}
            alt={newHire.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {newHire.firstName} {newHire.lastName}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                {daysIn > 90 ? 'Post-Probation' : `Day ${daysIn} with Team`}
              </span>
            </div>
            <p className="text-xs text-slate-500">{newHire.designation} · {newHire.department}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Joined on {newHire.joiningDate}</p>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Onboarding Completion</span>
            <span className="text-orange-600 font-bold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-orange-500 transition-all duration-300 rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-right">
            {completedCount} of {onboardingTasks.length} milestones finished
          </p>
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const catTasks = onboardingTasks.filter((t) => t.category === cat);
          if (catTasks.length === 0) return null;

          return (
            <div key={cat} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {cat}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {catTasks.filter((t) => t.completed).length}/{catTasks.length} Done
                </span>
              </div>

              <div className="space-y-2">
                {catTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleOnboardingTask(task.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      task.completed
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : 'bg-slate-50/70 border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <button className="pt-0.5 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 hover:text-orange-500" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Due {task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
