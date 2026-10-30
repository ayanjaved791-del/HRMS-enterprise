import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Plus,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  Settings
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { WorkflowRule } from '../../../types';

export const WorkflowBuilder: React.FC = () => {
  const { workflows, toggleWorkflow } = useHR();
  const [activeTab, setActiveTab] = useState<'rules' | 'builder'>('rules');

  // Interactive no-code builder state
  const [ruleName, setRuleName] = useState('New Hire Slack Welcome & Buddy Assignment');
  const [selectedTrigger, setSelectedTrigger] = useState('Candidate Hired in ATS');
  const [selectedCondition, setSelectedCondition] = useState('Department == "Engineering"');
  const [selectedAction, setSelectedAction] = useState('Post Welcome to #engineering, Assign Senior Mentor');
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  const triggers = [
    'Leave Request Submitted',
    'Candidate Hired in ATS',
    'Expense Claim > $500',
    'Biometric Punch > 15m Late',
    'Employee Work Anniversary Reached',
  ];

  const conditions = [
    'Leave Days <= 2 AND Balance > Required',
    'Department == "Engineering"',
    'Claim Amount > $500',
    'Employee Location == Office HQ',
    'Always True',
  ];

  const actions = [
    'Auto-Approve, Deduct Balance, Notify Manager on Slack',
    'Post Welcome to #engineering, Assign Senior Mentor',
    'Route to VP Finance for Double Signature Audit',
    'Issue Warning Email & Log to Attendance Timesheet',
    'Disburse 100 Reward Points & Post Kudos to Wall',
  ];

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedNotice(`Workflow rule "${ruleName}" successfully compiled and registered!`);
    setTimeout(() => {
      setCreatedNotice(null);
      setActiveTab('rules');
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">No-Code Workflow Builder</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate approvals, notifications, provisioning pipelines, and policy rules
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'rules' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Workflows ({workflows.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'builder' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Visual Pipeline Studio
          </button>
        </div>
      </div>

      {createdNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{createdNotice}</span>
        </div>
      )}

      {activeTab === 'rules' ? (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{wf.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {wf.executionsCount} executions logged
                    </p>
                  </div>
                </div>

                {/* Pipeline visual steps */}
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                    When: {wf.triggerEvent}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                    If: {wf.condition}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    Then: {wf.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    wf.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {wf.isActive ? 'Status: Active' : 'Status: Paused'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Visual Pipeline Studio */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Define Automation Rule</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect events to conditions and multi-channel actions with zero coding
            </p>
          </div>

          <form onSubmit={handleCreateRule} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Workflow Title</label>
              <input
                type="text"
                required
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* Pipeline Stage 1: Trigger */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                Stage 1 · Event Trigger
              </span>
              <select
                value={selectedTrigger}
                onChange={(e) => setSelectedTrigger(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none font-medium text-slate-800"
              >
                {triggers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Pipeline Stage 2: Condition */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                Stage 2 · Boolean Logic Condition
              </span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-none font-medium text-slate-800"
              >
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Pipeline Stage 3: Action */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                Stage 3 · Automated Action Execution
              </span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-emerald-200 rounded-lg focus:outline-none font-medium text-slate-800"
              >
                {actions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                Publish Automated Workflow
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
