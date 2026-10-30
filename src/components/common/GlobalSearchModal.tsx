import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  FileText,
  Briefcase,
  Target,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    employees,
    candidates,
    documents,
    goalsOKR,
    setActiveModule,
    setActiveSubTab,
    setSelectedEmployeeDetail,
  } = useHR();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEmployees = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(query.toLowerCase()) ||
      e.lastName.toLowerCase().includes(query.toLowerCase()) ||
      e.department.toLowerCase().includes(query.toLowerCase()) ||
      e.designation.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.role.toLowerCase().includes(query.toLowerCase()) ||
      c.department.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGoals = goalsOKR.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type employee name, candidate, policy, or OKR..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Employees */}
          {filteredEmployees.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5">
                Employees ({filteredEmployees.length})
              </p>
              <div className="space-y-1">
                {filteredEmployees.slice(0, 4).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployeeDetail(emp);
                      setActiveModule('core');
                      setActiveSubTab('employees');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.firstName}
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {emp.designation} · {emp.department}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-orange-600 font-medium">View Profile</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Candidates */}
          {filteredCandidates.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5">
                Talent & ATS ({filteredCandidates.length})
              </p>
              <div className="space-y-1">
                {filteredCandidates.slice(0, 3).map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      setActiveModule('talent');
                      setActiveSubTab('ats-kanban');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {cand.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{cand.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {cand.role} · Stage: {cand.stage}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-medium">ATS Stage</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {filteredDocs.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5">
                Document Vault ({filteredDocs.length})
              </p>
              <div className="space-y-1">
                {filteredDocs.slice(0, 3).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveModule('core');
                      setActiveSubTab('document-vault');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{doc.title}</p>
                        <p className="text-[11px] text-slate-500">{doc.category} · {doc.fileSize}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Open Vault</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* OKRs */}
          {filteredGoals.length > 0 && (
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1.5">
                Strategic OKRs ({filteredGoals.length})
              </p>
              <div className="space-y-1">
                {filteredGoals.slice(0, 2).map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setActiveModule('performance');
                      setActiveSubTab('okr-goals');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Target className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{goal.title}</p>
                        <p className="text-[11px] text-slate-500">Progress: {goal.progress}% · {goal.quarter}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-orange-600 font-medium">View OKR</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEmployees.length === 0 &&
            filteredCandidates.length === 0 &&
            filteredDocs.length === 0 &&
            filteredGoals.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching results found for "{query}".
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
