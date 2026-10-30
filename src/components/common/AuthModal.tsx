import React, { useState } from 'react';
import {
  X,
  Building2,
  UserCheck,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  LogOut,
  User
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    allSessions,
    switchUser,
    loginUser,
    logoutUser,
    company,
  } = useHR();

  const [mode, setMode] = useState<'switch' | 'login'>('switch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickSwitch = (sessionId: string) => {
    switchUser(sessionId);
    setSuccessMsg('Switched active profile successfully.');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email) return;

    const res = loginUser(email, password, role);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm">
              {company.logo || 'HR'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{company.name}</h3>
              <p className="text-[11px] text-slate-500">Active Workspace Credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{currentUser?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-orange-600 text-white">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-100 p-2 bg-slate-50">
          <button
            onClick={() => {
              setMode('switch');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'switch' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registered Profiles ({allSessions.length})
          </button>
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Switch Sign-In
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'switch' && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Available Workspace Accounts
              </p>
              {allSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleQuickSwitch(session.id)}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    currentUser?.id === session.id
                      ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-200'
                      : 'border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={session.avatar}
                      alt={session.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 leading-tight truncate">
                        {session.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{session.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      session.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {session.role}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole('employee')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      role === 'employee' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      role === 'admin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs font-mono pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
