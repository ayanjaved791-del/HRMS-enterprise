import React, { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { GoalOKR } from '../../../types';

export const OkrGoalTracker: React.FC = () => {
  const { goalsOKR, addGoalOKR, updateGoalProgress, employees, currentUser } = useHR();
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Company' | 'Department' | 'Individual'>('Company');
  const [quarter, setQuarter] = useState('Q4 2026');
  const [ownerId, setOwnerId] = useState(employees[0]?.id || '');
  const [kr1Text, setKr1Text] = useState('');
  const [kr1Target, setKr1Target] = useState(100);
  const [kr1Unit, setKr1Unit] = useState('%');

  const filtered = goalsOKR.filter((g) => filterLevel === 'All' || g.level === filterLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const owner = employees.find((e) => e.id === ownerId) || employees[0];
    const newOKR: Omit<GoalOKR, 'id'> = {
      title,
      level,
      quarter,
      ownerId: owner?.id,
      ownerName: owner ? `${owner.firstName} ${owner.lastName}` : (currentUser?.name || 'Administrator'),
      progress: 0,
      keyResults: [
        {
          id: `kr_${Date.now()}_1`,
          text: kr1Text.trim() || 'Achieve target milestone execution',
          current: 0,
          target: Number(kr1Target) || 100,
          unit: kr1Unit || '%',
        },
      ],
    };

    addGoalOKR(newOKR);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setKr1Text('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">OKR & Strategic Goal Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarterly strategic objectives, quantitative key results, and real-time execution progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
            {['All', 'Company', 'Department', 'Individual'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterLevel === lvl ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Objective</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Objectives Defined Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Align company strategy and individual focus by publishing measurable quarterly OKRs with quantifiable key results.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-2xs"
          >
            Create First Goal OKR
          </button>
        </div>
      ) : (
        /* OKR Cards */
        <div className="space-y-4">
          {filtered.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5"
            >
              {/* Goal Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        goal.level === 'Company'
                          ? 'bg-purple-100 text-purple-800'
                          : goal.level === 'Department'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {goal.level} OKR
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{goal.quarter}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{goal.title}</h3>
                  <p className="text-xs text-slate-500">Lead Owner: {goal.ownerName}</p>
                </div>

                {/* Progress Dial / Bar */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {goal.progress}%
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Completion</p>
                  </div>
                </div>
              </div>

              {/* Interactive Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Overall Objective Delivery</span>
                  <span>Adjust Progress:</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Key Results Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Measurable Key Results
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {goal.keyResults.map((kr) => {
                    const percent = Math.min(100, Math.round((kr.current / (kr.target || 1)) * 100));
                    return (
                      <div
                        key={kr.id}
                        className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2 flex flex-col justify-between"
                      >
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{kr.text}</p>
                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
                            <span>
                              {kr.current} / {kr.target} {kr.unit}
                            </span>
                            <span className="font-bold text-slate-700">{percent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              style={{ width: `${percent}%` }}
                              className="h-full bg-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Define Strategic Objective</h3>
                <p className="text-xs text-slate-500">Configure alignment tier and key result targets</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Objective Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  placeholder="e.g. Expand Cloud Infrastructure Reliability & Zero-Downtime SLAs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Context & Strategic Rationale</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  placeholder="Provide scope details..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scope Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Company">Company</option>
                    <option value="Department">Department</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cycle</label>
                  <input
                    type="text"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Owner</label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Primary Key Result
                </label>
                <div>
                  <input
                    type="text"
                    value={kr1Text}
                    onChange={(e) => setKr1Text(e.target.value)}
                    placeholder="e.g. Achieve 99.99% uptime on core microservices"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Target Value</span>
                    <input
                      type="number"
                      value={kr1Target}
                      onChange={(e) => setKr1Target(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Unit</span>
                    <input
                      type="text"
                      value={kr1Unit}
                      onChange={(e) => setKr1Unit(e.target.value)}
                      placeholder="e.g. % or users"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Create OKR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
