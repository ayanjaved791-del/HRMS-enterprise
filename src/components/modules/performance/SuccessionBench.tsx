import React, { useState } from 'react';
import {
  LineChart,
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const SuccessionBench: React.FC = () => {
  const { successionPlans, addSuccessionPlan, employees } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [criticalRole, setCriticalRole] = useState('Chief Technology Officer');
  const [incumbentId, setIncumbentId] = useState(employees[0]?.id || '');
  const [readinessBenchmark, setReadinessBenchmark] = useState('6 - 12 Months');
  const [selectedSuccessorId, setSelectedSuccessorId] = useState(employees[0]?.id || '');
  const [readinessLevel, setReadinessLevel] = useState<'Ready Now' | '1-2 Years' | 'Long Term'>('Ready Now');
  const [flightRisk, setFlightRisk] = useState<'Low' | 'Medium' | 'High'>('Low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incumbent = employees.find((e) => e.id === incumbentId) || employees[0];
    const successor = employees.find((e) => e.id === selectedSuccessorId) || employees[0];
    if (!incumbent || !successor) return;

    addSuccessionPlan({
      criticalRole,
      incumbentName: `${incumbent.firstName} ${incumbent.lastName}`,
      readinessBenchmark,
      successors: [
        {
          employeeId: successor.id,
          name: `${successor.firstName} ${successor.lastName}`,
          avatar: successor.avatar,
          readiness: readinessLevel,
          flightRisk: flightRisk,
        },
      ],
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Succession Planning Bench</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive leadership talent continuity, flight risk mitigation, and role succession readiness
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Succession Role</span>
        </button>
      </div>

      {successionPlans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Succession Plans Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Designate key leadership positions and map high-potential successor candidates from your active team directory to safeguard operational continuity.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-2xs"
          >
            Create Succession Plan
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {successionPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                    Critical Enterprise Mandate
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{plan.criticalRole}</h3>
                  <p className="text-xs text-slate-500">Current Incumbent: {plan.incumbentName}</p>
                </div>

                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                  Horizon: {plan.readinessBenchmark}
                </span>
              </div>

              {/* Bench candidates */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Identified Successor Candidates
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.successors.map((succ) => (
                    <div
                      key={succ.employeeId}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={succ.avatar}
                          alt={succ.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{succ.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Readiness: <span className="font-semibold text-orange-600">{succ.readiness}</span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          succ.flightRisk === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {succ.flightRisk} Flight Risk
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Critical Succession Plan</h3>
                <p className="text-xs text-slate-500">Designate leadership role and identify bench candidate</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Critical Executive Role</label>
                <input
                  type="text"
                  required
                  value={criticalRole}
                  onChange={(e) => setCriticalRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  placeholder="e.g. Chief Technology Officer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Incumbent</label>
                <select
                  value={incumbentId}
                  onChange={(e) => setIncumbentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Succession Horizon</label>
                <select
                  value={readinessBenchmark}
                  onChange={(e) => setReadinessBenchmark(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="Immediate (< 3 Months)">Immediate (&lt; 3 Months)</option>
                  <option value="6 - 12 Months">6 - 12 Months</option>
                  <option value="1 - 2 Years">1 - 2 Years</option>
                  <option value="2 - 3 Years">2 - 3 Years</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Identified Successor Candidate</label>
                <select
                  value={selectedSuccessorId}
                  onChange={(e) => setSelectedSuccessorId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Readiness Level</label>
                  <select
                    value={readinessLevel}
                    onChange={(e) => setReadinessLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Ready Now">Ready Now</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="Long Term">Long Term (&gt; 2 Years)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessed Flight Risk</label>
                  <select
                    value={flightRisk}
                    onChange={(e) => setFlightRisk(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
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
                  Save Succession Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
