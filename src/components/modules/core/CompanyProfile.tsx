import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Save,
  CheckCircle2,
  Globe2,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const CompanyProfile: React.FC = () => {
  const { company, updateCompany } = useHR();

  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry);
  const [hqName, setHqName] = useState(company.hqLocation.name);
  const [latitude, setLatitude] = useState(company.hqLocation.latitude);
  const [longitude, setLongitude] = useState(company.hqLocation.longitude);
  const [radiusMeters, setRadiusMeters] = useState(company.hqLocation.radiusMeters);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      name,
      industry,
      hqLocation: {
        name: hqName,
        latitude: Number(latitude),
        longitude: Number(longitude),
        radiusMeters: Number(radiusMeters),
      },
    });
    setSaveNotice('Company profile & geofence perimeter updated successfully!');
    setTimeout(() => setSaveNotice(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Company Profile & Geofence Perimeter</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Corporate headquarters coordinates, timezone policies, and mobile/web camera check-in geofence radius
        </p>
      </div>

      {saveNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Enterprise Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Classification</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Geofence Perimeter Configuration */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600" />
            Office HQ GPS Geofence Configuration
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Employees must be within this perimeter to clock in with status "Office HQ (Verified)"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus / Building Title</label>
              <input
                type="text"
                required
                value={hqName}
                onChange={(e) => setHqName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude Coordinate</label>
              <input
                type="number"
                step="0.0001"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude Coordinate</label>
              <input
                type="number"
                step="0.0001"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Geofence Detection Radius:</span>
              <span className="text-orange-600 font-bold font-mono">{radiusMeters} Meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Recommended: 150m for multi-story urban corporate campuses.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all company and employee data? This will return the application to first-time setup.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
          >
            Reset Workspace & Re-register
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
