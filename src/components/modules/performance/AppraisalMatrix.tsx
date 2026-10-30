import React, { useState } from 'react';
import {
  Award,
  Star,
  CheckCircle2,
  Users,
  Compass,
  MessageSquare,
  Plus,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const AppraisalMatrix: React.FC = () => {
  const { appraisals, addAppraisal, employees } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [reviewPeriod, setReviewPeriod] = useState('Q4 2026');
  const [overallRating, setOverallRating] = useState(4.5);
  const [managerFeedback, setManagerFeedback] = useState('Consistently delivers high-impact output and exhibits exemplary team collaboration.');
  const [peerFeedback, setPeerFeedback] = useState('Dependable partner who clarifies ambiguities quickly and supports junior teammates.');
  const [selfFeedback, setSelfFeedback] = useState('Met operational milestones ahead of schedule and expanded technical domain knowledge.');
  const [leadershipScore, setLeadershipScore] = useState(4.5);
  const [executionScore, setExecutionScore] = useState(4.8);
  const [innovationScore, setInnovationScore] = useState(4.2);
  const [collaborationScore, setCollaborationScore] = useState(4.7);
  const [technicalScore, setTechnicalScore] = useState(4.6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === selectedEmpId) || employees[0];
    if (!emp) return;

    addAppraisal({
      revieweeId: emp.id,
      revieweeName: `${emp.firstName} ${emp.lastName}`,
      reviewPeriod,
      overallRating: Number(overallRating),
      competencyScores: {
        leadership: Number(leadershipScore),
        execution: Number(executionScore),
        innovation: Number(innovationScore),
        collaboration: Number(collaborationScore),
        technical: Number(technicalScore),
      },
      managerFeedback,
      peerFeedback,
      selfFeedback,
      status: 'Submitted',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">360-Degree Appraisal Matrix</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer feedback, manager assessments, self-reflections, and competency radar metrics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate 360° Review</span>
        </button>
      </div>

      {appraisals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Performance Appraisals Recorded</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Begin the annual or quarterly evaluation cycle by initiating a 360-degree review with manager, peer, and self-evaluation rubrics.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-2xs"
          >
            Start First Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {appraisals.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                    {rev.reviewPeriod}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{rev.revieweeName}</h3>
                  <p className="text-xs text-slate-500">Comprehensive Performance Assessment</p>
                </div>

                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200/80">
                  <Star className="w-5 h-5 text-orange-500 fill-current" />
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                      {rev.overallRating}
                    </span>
                    <span className="text-xs text-slate-500 font-bold"> / 5.0</span>
                    <p className="text-[10px] font-bold text-orange-700 uppercase">
                      {rev.overallRating >= 4.5 ? 'Exceeds Benchmark' : 'Meets Benchmark'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Competency Score Distribution */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Core Competencies Rating
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {Object.entries(rev.competencyScores).map(([skill, score]) => (
                    <div key={skill} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-lg font-extrabold text-slate-900 tabular-nums font-mono">{score}</p>
                      <p className="text-xs font-semibold text-slate-600 capitalize mt-0.5">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualitative Feedback Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> Manager Evaluation
                  </p>
                  <p className="text-slate-600 leading-relaxed italic">"{rev.managerFeedback}"</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> Peer Reviews (Synthesis)
                  </p>
                  <p className="text-slate-600 leading-relaxed italic">"{rev.peerFeedback}"</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" /> Self Reflection
                  </p>
                  <p className="text-slate-600 leading-relaxed italic">"{rev.selfFeedback}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initiation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Initiate 360° Performance Appraisal</h3>
                <p className="text-xs text-slate-500">Record multidimensional feedback and evaluation scoring</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Employee to Evaluate</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Review Period</label>
                  <input
                    type="text"
                    value={reviewPeriod}
                    onChange={(e) => setReviewPeriod(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="e.g. Q4 2026"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Rating (1 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Core Competencies Scoring (1.0 - 5.0)</label>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Leadership</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={leadershipScore}
                      onChange={(e) => setLeadershipScore(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Execution</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={executionScore}
                      onChange={(e) => setExecutionScore(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Innovation</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={innovationScore}
                      onChange={(e) => setInnovationScore(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Collab</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={collaborationScore}
                      onChange={(e) => setCollaborationScore(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 mb-0.5">Technical</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={technicalScore}
                      onChange={(e) => setTechnicalScore(Number(e.target.value))}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Manager Appraisal Synthesis</label>
                <textarea
                  rows={2}
                  value={managerFeedback}
                  onChange={(e) => setManagerFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peer Feedback Summary</label>
                <textarea
                  rows={2}
                  value={peerFeedback}
                  onChange={(e) => setPeerFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Self-Reflection</label>
                <textarea
                  rows={2}
                  value={selfFeedback}
                  onChange={(e) => setSelfFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
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
                  Publish Appraisal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
