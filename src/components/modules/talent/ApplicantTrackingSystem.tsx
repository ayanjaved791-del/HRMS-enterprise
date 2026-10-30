import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Star,
  Search,
  Filter,
  UserCheck,
  Calendar,
  X,
  ArrowRight,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Candidate } from '../../../types';

export const ApplicantTrackingSystem: React.FC = () => {
  const {
    candidates,
    updateCandidateStage,
    addCandidate,
    activeRole,
    currentUser,
  } = useHR();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // New Candidate form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Senior Cloud Infrastructure Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [experienceYears, setExperienceYears] = useState(6);
  const [expectedSalary, setExpectedSalary] = useState('$165,000/yr');
  const [source, setSource] = useState<Candidate['source']>('LinkedIn');
  const [skillsStr, setSkillsStr] = useState('Kubernetes, Go, AWS, Docker');

  const stages: Candidate['stage'][] = [
    'Sourced',
    'Screening',
    'Interview',
    'Technical Round',
    'Offer',
    'Hired',
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addCandidate({
      name,
      email,
      phone: phone || '+1 (415) 555-0199',
      role,
      department,
      experienceYears: Number(experienceYears),
      stage: 'Screening',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      source,
      expectedSalary,
      notes: 'Initial profile screened via talent pipeline.',
    });

    setIsAddOpen(false);
    setName('');
    setEmail('');
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Applicant Tracking System (ATS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-cycle recruitment pipeline with scorecard evaluations and offer generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, role, skill tag (e.g. PyTorch, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold px-2">
          {filteredCandidates.length} Active Candidates
        </span>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[210px]"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-800 tracking-tight">{stage}</span>
                <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-[10px] font-bold flex items-center justify-center shadow-2xs">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-2.5 flex-1">
                {stageCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                        {cand.name}
                      </h4>
                      <div className="flex items-center text-amber-500 text-[10px]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold ml-0.5">{cand.rating}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">{cand.role}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Exp: {cand.experienceYears}y · {cand.expectedSalary}</p>

                    <div className="flex flex-wrap gap-1 my-2">
                      {cand.skills.slice(0, 2).map((sk) => (
                        <span key={sk} className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-600">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Quick Move Stage dropdown */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{cand.source}</span>
                      <select
                        value={cand.stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateCandidateStage(cand.id, e.target.value as any)}
                        className="text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        {stages.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageCandidates.length === 0 && (
                  <div className="py-6 text-center text-[11px] text-slate-400 italic">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCandidate.role} · {selectedCandidate.department}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Current Stage</p>
                  <p className="font-bold text-orange-600 text-xs mt-0.5">{selectedCandidate.stage}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Expected Package</p>
                  <p className="font-mono text-slate-900 text-xs mt-0.5">{selectedCandidate.expectedSalary}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Email & Phone</p>
                  <p className="text-slate-700 text-xs mt-0.5">{selectedCandidate.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Talent Source</p>
                  <p className="text-slate-700 text-xs mt-0.5">{selectedCandidate.source}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-1.5">Assessed Competencies & Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-1">Interviewer Notes & Feedback</p>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                  {selectedCandidate.notes}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Advance Stage:</span>
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => {
                    updateCandidateStage(selectedCandidate.id, e.target.value as any);
                    setSelectedCandidate((prev) => (prev ? { ...prev, stage: e.target.value as any } : null));
                  }}
                  className="text-xs font-semibold px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800"
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Candidate to Pipeline</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Belfort"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 000-0000"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Salary</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sourcing Channel</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Direct Career Page">Direct Career Page</option>
                    <option value="Headhunter">Headhunter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Add to ATS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
