import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const TalentPipeline: React.FC = () => {
  const { candidates } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Candidate Talent Pipeline</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Curated pool of pre-screened talent, verified skills, and executive candidates
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate skills, roles, or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Engineering', 'Design', 'Operations', 'Human Resources'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700">
                  {cand.stage}
                </span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold ml-1">{cand.rating}.0</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{cand.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{cand.role}</p>
                </div>
              </div>

              <div className="my-3 space-y-1 text-xs text-slate-600">
                <p>Experience: {cand.experienceYears} Years</p>
                <p>Expected: {cand.expectedSalary}</p>
                <p>Source: {cand.source}</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {cand.skills.map((sk) => (
                  <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Applied {cand.appliedDate}</span>
              <span className="font-semibold text-orange-600 hover:underline cursor-pointer">
                Contact Candidate
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
