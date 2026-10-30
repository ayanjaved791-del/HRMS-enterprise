import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Calendar,
  MapPin,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Holiday } from '../../../types';

export const HolidayCalendar: React.FC = () => {
  const { holidays, addHoliday, activeRole } = useHR();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('2026-11-27');
  const [day, setDay] = useState('Friday');
  const [type, setType] = useState<Holiday['type']>('Company');

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHoliday({
      name,
      date,
      day,
      type,
      isMandatory: type === 'Public',
    });
    setIsAddOpen(false);
    setName('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Holiday Calendar Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official statutory and company-specific holidays across US, UK, and global remote branches
          </p>
        </div>

        {activeRole === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Holiday</span>
          </button>
        )}
      </div>

      {/* Grid of Holidays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {holidays.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-300 shadow-2xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    h.type === 'Public'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}
                >
                  {h.type} Holiday
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">{h.day}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{h.name}</h3>
              <p className="text-xs text-orange-600 font-semibold font-mono mt-1">{h.date}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{h.isMandatory ? 'Mandatory Paid Off' : 'Optional Float'}</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Holiday Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add Corporate Holiday</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Founder's Celebration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                  <input
                    type="text"
                    required
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classification</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Company">Company Floating Holiday</option>
                  <option value="Public">Statutory Public Holiday</option>
                  <option value="Regional">Regional Hub Holiday</option>
                </select>
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
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
