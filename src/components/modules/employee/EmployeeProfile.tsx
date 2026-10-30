import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Calendar,
  CheckCircle2,
  Save,
  Shield,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  Briefcase
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const EmployeeProfile: React.FC = () => {
  const { currentUser, employees, updateEmployee, company } = useHR();

  const currentEmpId = currentUser?.employeeId || currentUser?.id;
  const currentEmp = employees.find((e) => e.id === currentEmpId || e.email.toLowerCase() === currentUser?.email.toLowerCase());

  const [firstName, setFirstName] = useState(
    currentEmp?.firstName || currentUser?.name.split(' ')[0] || ''
  );
  const [lastName, setLastName] = useState(
    currentEmp?.lastName || currentUser?.name.split(' ').slice(1).join(' ') || ''
  );
  const [email, setEmail] = useState(currentEmp?.email || currentUser?.email || '');
  const [password, setPassword] = useState(currentEmp?.password || currentUser?.password || 'Welcome@123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(currentEmp?.phone || '+1 (555) 019-2831');
  const [avatar, setAvatar] = useState(
    currentEmp?.avatar ||
      currentUser?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    if (currentEmp) {
      updateEmployee(currentEmp.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
            <User className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Profile & Portal Credentials</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your personal contact details, email address, and login password. Any changes automatically update in real-time in the administrator's employee directory.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in slide-in-from-top duration-200 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Profile & Credentials Successfully Updated!</p>
            <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
              Your name, email, and password have been synchronized directly into {company.name}'s administrator directory.
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
            <div className="relative group">
              <img
                src={avatar}
                alt={firstName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500/30 shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold text-slate-800">Profile Photo</p>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-2">
                Select an avatar preset or provide an image link
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                      avatar === preset ? 'border-orange-500 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Readonly Employment Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee Code</span>
              <span className="font-mono font-bold text-slate-800">{currentEmp?.employeeCode || 'EMP-1001'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
              <span className="font-semibold text-slate-800">{currentEmp?.department || 'Operations'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
              <span className="font-semibold text-slate-800">{currentEmp?.designation || 'Team Member'}</span>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Work Email Address * (Used for Portal Sign In)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-mono pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Portal Password * (Change your login password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-mono pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum 6 characters. You will use this new password on your next login.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-orange-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Administrator Records</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
