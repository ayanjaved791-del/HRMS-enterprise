import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const DedicatedLoginPage: React.FC = () => {
  const { company, loginUser, registerUser, resetEntireSystem } = useHR();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [portalMode, setPortalMode] = useState<'admin' | 'employee'>('admin');

  // Sign In fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpCompany, setSignUpCompany] = useState(company.name || 'Enterprise HRMS');
  const [signUpRole, setSignUpRole] = useState<'admin' | 'employee'>('admin');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = loginUser(email, password, portalMode);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setErrorMessage('Please complete all required registration fields.');
      return;
    }

    registerUser({
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      password: signUpPassword.trim(),
      role: signUpRole,
      companyName: signUpCompany.trim() || company.name,
      designation: signUpRole === 'admin' ? 'HR Administrator' : 'Team Member',
      department: signUpRole === 'admin' ? 'Executive Management' : 'People & Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    setSuccessMessage(`Account registered successfully! Welcome to ${signUpCompany || company.name}.`);
  };

  const handleQuickDemoFill = (role: 'admin' | 'employee') => {
    setAuthMode('signin');
    setPortalMode(role);
    setErrorMessage(null);
    if (role === 'admin') {
      setEmail('admin@company.com');
      setPassword('admin');
    } else {
      setEmail('employee@company.com');
      setPassword('Welcome@123');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#F0FDFB] text-slate-800 relative overflow-hidden flex flex-col justify-between p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-100 selection:text-teal-900">
      {/* Ambient background glows according to theme */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-teal-100/80 relative z-10">
        <div className="flex items-center gap-3">
          {/* Teal circular badge with white "A" matching Image 1 Sidebar logo */}
          <div className="w-10 h-10 rounded-2xl bg-[#0F766E] flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-teal-700/20 border border-teal-400/40">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">{company.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-[#0F766E] border border-teal-200">
                Enterprise HRMS
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">People Operations & Biometric Attendance Platform</p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white/80 shadow-2xs transition-all cursor-pointer"
          title="Reset and start fresh"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Workspace</span>
        </button>
      </div>

      {/* Main Authentication Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        {/* Card with Beautiful Border Effects and Glassmorphic Surface */}
        <div className="relative bg-white/95 backdrop-blur-xl border border-teal-200/70 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-teal-950/5 ring-1 ring-teal-500/10">
          {/* Top subtle glowing accent bar */}
          <div className="absolute inset-x-8 top-0 h-1 bg-gradient-to-r from-transparent via-[#0F766E] to-transparent rounded-t-full opacity-80" />

          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="flex p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Portal Switcher Tabs (Admin vs Employee) */}
          <div className="flex p-1 bg-[#F1F9FA] rounded-xl mb-6 border border-[#E2EEEE]">
            <button
              type="button"
              onClick={() => {
                if (authMode === 'signin') setPortalMode('admin');
                else setSignUpRole('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                (authMode === 'signin' ? portalMode === 'admin' : signUpRole === 'admin')
                  ? 'bg-[#A7F3D0] text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-800" />
              <span>Administrator</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (authMode === 'signin') setPortalMode('employee');
                else setSignUpRole('employee');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                (authMode === 'signin' ? portalMode === 'employee' : signUpRole === 'employee')
                  ? 'bg-[#A7F3D0] text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-slate-800" />
              <span>Staff / Employee</span>
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {authMode === 'signin'
                ? portalMode === 'admin'
                  ? 'Administrator Access'
                  : 'Employee Portal Sign In'
                : 'Create Workspace Profile'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {authMode === 'signin'
                ? portalMode === 'admin'
                  ? 'Manage your workforce, biometric punches, payroll, and OKRs.'
                  : 'Log in to record attendance, submit leave, and review payslips.'
                : 'Register a new authorized member or administrator profile.'}
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form: SIGN IN MODE */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {portalMode === 'employee' ? 'Employee Work Email' : 'Administrator Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder={portalMode === 'employee' ? 'employee@company.com' : 'admin@company.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoFill(portalMode)}
                    className="text-[11px] font-bold text-[#0F766E] hover:underline"
                  >
                    Auto-Fill Demo
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Glowing Button */}
              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-[0_0_22px_rgba(15,118,110,0.4)] hover:shadow-[0_0_32px_rgba(15,118,110,0.6)] border border-teal-400/40 ring-2 ring-teal-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>{portalMode === 'employee' ? 'Access Employee ESS' : 'Open Admin Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Form: SIGN UP MODE */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Hussy"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="david@company.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enterprise HRMS"
                    value={signUpCompany}
                    onChange={(e) => setSignUpCompany(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-4 focus:ring-teal-500/15 focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Glowing Button */}
              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#0F766E] hover:bg-[#0D645E] text-white shadow-[0_0_22px_rgba(15,118,110,0.4)] hover:shadow-[0_0_32px_rgba(15,118,110,0.6)] border border-teal-400/40 ring-2 ring-teal-500/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>Register & Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fast test credentials:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0F766E] font-bold text-[11px] border border-teal-200 transition-colors"
              >
                Admin (Amara)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('employee')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
              >
                Staff (Employee)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Reset System */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Reset & Reconfigure System?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will wipe the current workspace data, company registration, and employee roster, allowing you to register a brand new company and master administrator account.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetEntireSystem();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Yes, Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 pt-6 border-t border-teal-100/60 relative z-10">
        {company.name} · Enterprise People & Attendance Suite
      </div>
    </div>
  );
};
