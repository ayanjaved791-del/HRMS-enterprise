import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { ShiftRoster } from '../../../types';

export const ShiftScheduler: React.FC = () => {
  const { shiftRosters, updateShift, activeRole } = useHR();
  const [selectedWeek, setSelectedWeek] = useState('Oct 26 - Nov 01, 2026');

  const shiftOptions = [
    'Morning (09:00 - 17:00)',
    'Morning (08:00 - 16:30)',
    'Mid (11:00 - 19:30)',
    'Evening (14:00 - 22:00)',
    'On-Call (Tier 2)',
    'Off',
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Shift & Roster Scheduler</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate 24/7 on-call engineering, support tiers, and core office shift rotations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
            <CalendarClock className="w-4 h-4 text-orange-500" />
            <span>{selectedWeek}</span>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Weekly Department Roster
          </h3>
          <span className="text-[11px] text-slate-500">Click any shift slot to reassign</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-3">Mon 26</th>
                <th className="py-3 px-3">Tue 27</th>
                <th className="py-3 px-3">Wed 28</th>
                <th className="py-3 px-3">Thu 29</th>
                <th className="py-3 px-3">Fri 30</th>
                <th className="py-3 px-3">Sat 31</th>
                <th className="py-3 px-3">Sun 01</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shiftRosters.map((roster) => (
                <tr key={roster.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{roster.employeeName}</p>
                    <p className="text-[11px] text-slate-500">{roster.department}</p>
                  </td>

                  {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => {
                    const shiftVal = roster.shifts[day];
                    const isOff = shiftVal === 'Off';
                    const isOnCall = shiftVal.includes('On-Call');

                    return (
                      <td key={day} className="py-2.5 px-2">
                        {activeRole === 'admin' ? (
                          <select
                            value={shiftVal}
                            onChange={(e) => updateShift(roster.id, day, e.target.value)}
                            className={`w-full p-1.5 rounded-lg text-[11px] font-medium border focus:outline-none transition-colors ${
                              isOff
                                ? 'bg-slate-100 border-slate-200 text-slate-400'
                                : isOnCall
                                ? 'bg-purple-50 border-purple-200 text-purple-700 font-semibold'
                                : 'bg-orange-50 border-orange-200 text-orange-800 font-semibold'
                            }`}
                          >
                            {shiftOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-1 rounded text-[11px] font-medium ${
                              isOff
                                ? 'bg-slate-100 text-slate-400'
                                : isOnCall
                                ? 'bg-purple-100 text-purple-800 font-semibold'
                                : 'bg-orange-100 text-orange-800 font-semibold'
                            }`}
                          >
                            {shiftVal.split('(')[0]}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
