import React from 'react';
import {
  HeartHandshake,
  Smile,
  CheckCircle2,
  Users,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const SentimentPulseSurvey: React.FC = () => {
  const { pulseSurvey, votePulseSurvey } = useHR();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Employee Sentiment Pulse Surveys</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time organizational temperature, work-life health, and anonymous team feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Weekly Survey Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Active Weekly Pulse Survey
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {pulseSurvey.totalVotes} Verified Votes
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            "{pulseSurvey.question}"
          </h3>

          {/* Interactive Voting Options */}
          <div className="space-y-3">
            {pulseSurvey.options.map((opt) => {
              const isSelected = pulseSurvey.userVotedOption === opt.label;
              return (
                <div
                  key={opt.label}
                  onClick={() => votePulseSurvey(opt.label)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-400/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Fill progress background */}
                  <div
                    style={{ width: `${opt.percentage}%` }}
                    className="absolute inset-y-0 left-0 bg-orange-200/25 pointer-events-none transition-all duration-300"
                  />

                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{opt.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 tabular-nums">{opt.count} votes</span>
                      <span className="font-bold text-orange-600 font-mono tabular-nums">{opt.percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span>Anonymous ballot encrypted with zero telemetry profiling</span>
            <span className="text-orange-600 font-semibold">Your vote is registered</span>
          </div>
        </div>

        {/* Right: Happiness Gauge & Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Organizational Happiness Arc
            </h3>

            {/* Arc visual */}
            <div className="relative w-36 h-20 mx-auto my-4 flex items-end justify-center overflow-hidden">
              <svg className="w-36 h-36 -rotate-180" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#FF6B4A"
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center pb-1">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">4.6</span>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">out of 5</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Psychological Safety:</span>
                <span className="font-bold text-slate-900">92%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Management Clarity:</span>
                <span className="font-bold text-slate-900">88%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Work-Life Balance:</span>
                <span className="font-bold text-slate-900">84%</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-center font-medium mt-4">
            +0.4 Index improvement over previous quarter
          </div>
        </div>
      </div>
    </div>
  );
};
