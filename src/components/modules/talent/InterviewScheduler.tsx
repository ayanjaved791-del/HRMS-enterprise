import React, { useState } from 'react';
import {
  CalendarClock,
  Video,
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { InterviewSession } from '../../../types';

export const InterviewScheduler: React.FC = () => {
  const { interviews, scheduleInterview, candidates } = useHR();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [selectedCandId, setSelectedCandId] = useState(candidates[0].id);
  const [roundName, setRoundName] = useState('System Design & Cryptography Deep-Dive');
  const [date, setDate] = useState('2026-11-02');
  const [time, setTime] = useState('02:00 PM - 03:00 PM');
  const [interviewer, setInterviewer] = useState('Lucas Vance (Staff Backend Architect)');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/acm-sys-arch');
  const [scorecardNotes, setScorecardNotes] = useState('Evaluate distributed consensus and sharded Redis storage.');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === selectedCandId) || candidates[0];

    scheduleInterview({
      candidateId: cand.id,
      candidateName: cand.name,
      role: cand.role,
      roundName,
      date,
      time,
      interviewer,
      meetLink,
      scorecardNotes,
    });

    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interview Scheduling Assistant</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronize technical rounds, Google Meet virtual interview rooms, and scorecard rubric evaluations
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Grid of Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((intv) => (
          <div
            key={intv.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                  {intv.roundName}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {intv.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{intv.candidateName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{intv.role}</p>

              <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold">{intv.date}</span> · <span>{intv.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lead Evaluator: {intv.interviewer}</span>
                </div>
              </div>

              {intv.scorecardNotes && (
                <p className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                  "{intv.scorecardNotes}"
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Automated calendar invites sent</span>
              <a
                href={intv.meetLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Google Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Book Interview Round</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Candidate</label>
                <select
                  value={selectedCandId}
                  onChange={(e) => setSelectedCandId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Round Designation</label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Interviewer</label>
                <input
                  type="text"
                  required
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scorecard Assessment Focus</label>
                <textarea
                  rows={2}
                  value={scorecardNotes}
                  onChange={(e) => setScorecardNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
