import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Globe,
  Sparkles,
  Compass,
  Eye,
  EyeOff
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const FirstTimeSetup: React.FC = () => {
  const { completeInitialSetup } = useHR();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Company Details
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Technology & Cloud Solutions');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [hqName, setHqName] = useState('Corporate Headquarters');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [radiusMeters, setRadiusMeters] = useState(200);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Step 2: Master Admin Account
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('Master Administrator');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(6)));
        setLongitude(Number(pos.coords.longitude.toFixed(6)));
        setIsDetectingLocation(false);
      },
      () => {
        setIsDetectingLocation(false);
      },
      { timeout: 6000 }
    );
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMsg('Please enter your company name to continue.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Please complete all required admin credentials.');
      return;
    }
    if (adminPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    completeInitialSetup(
      {
        name: companyName.trim(),
        industry,
        currency,
        timezone,
        logo: companyName.trim().slice(0, 2).toUpperCase(),
        hqLocation: {
          name: hqName.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          radiusMeters: Number(radiusMeters),
        },
      },
      {
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: adminPassword,
        designation: adminDesignation.trim(),
      }
    );
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-500/20">
            HR
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">HRMate Enterprise Suite</h1>
            <p className="text-xs text-slate-400">First-Time Workspace Onboarding & System Setup</p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              step === 1 ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            <span className="hidden sm:inline">Company Registration</span>
          </div>

          <div className="w-4 h-px bg-slate-800" />

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              step === 2 ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span className="hidden sm:inline">Master Admin Setup</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-xl w-full mx-auto my-auto py-8">
        {errorMsg && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-3 border border-orange-500/20">
                <Building2 className="w-3.5 h-3.5" />
                <span>Step 1 of 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Register Your Organization</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure your official company profile, currency, and office location for biometric check-ins.
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company / Organization Name <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Global Innovations Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industry Domain</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Technology & Cloud Solutions">Technology & Cloud Solutions</option>
                    <option value="Financial Services & Fintech">Financial Services & Fintech</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Consulting & Professional Services">Consulting & Professional</option>
                    <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
                    <option value="Education & EdTech">Education & EdTech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Operating Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                  >
                    <option value="USD">USD ($) · US Dollar</option>
                    <option value="EUR">EUR (€) · Euro</option>
                    <option value="GBP">GBP (£) · British Pound</option>
                    <option value="AED">AED (د.إ) · UAE Dirham</option>
                    <option value="CAD">CAD ($) · Canadian Dollar</option>
                    <option value="INR">INR (₹) · Indian Rupee</option>
                    <option value="SGD">SGD ($) · Singapore Dollar</option>
                    <option value="JPY">JPY (¥) · Japanese Yen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate Headquarters Label</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Silicon Vista Way, Floor 8"
                  value={hqName}
                  onChange={(e) => setHqName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Geofence & Location */}
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>Office Biometric Geofence Coordinates</span>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                    <span>{isDetectingLocation ? 'Locating...' : 'Use My Current GPS'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Radius (Meters)</label>
                    <input
                      type="number"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters(Number(e.target.value))}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <span>Continue to Admin Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Step 2 of 2 · Master Account</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create Master Admin Account</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                This administrator profile will manage employees, payroll, applications, and announcements for {companyName}.
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Administrator Full Name <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Sterling"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full text-sm pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Admin Work Email <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@yourcompany.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full text-sm pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Master Password <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter secure password (min 6 characters)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-sm pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Designation / Executive Title</label>
                <input
                  type="text"
                  placeholder="e.g. Founder & Managing Director"
                  value={adminDesignation}
                  onChange={(e) => setAdminDesignation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Enterprise Workspace</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-6 border-t border-slate-800">
        HRMate Enterprise HRMS · Biometric Bi-directional Attendance, Payroll & Employee Governance
      </div>
    </div>
  );
};
