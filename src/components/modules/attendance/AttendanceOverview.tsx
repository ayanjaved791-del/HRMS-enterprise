import React, { useState } from 'react';
import {
  Clock,
  Camera,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Download,
  Users,
  Eye
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const AttendanceOverview: React.FC = () => {
  const {
    attendanceRecords,
    employees,
    isPunchedIn,
    currentAttendanceRecord,
    setIsPunchModalOpen,
    company,
  } = useHR();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  const filtered = attendanceRecords.filter((rec) => {
    return filterStatus === 'All' || rec.status === filterStatus;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const presentCount = attendanceRecords.filter((r) => r.date === todayStr).length || attendanceRecords.length;
  const onTimeCount = attendanceRecords.filter((r) => r.status === 'On Time').length;
  const lateCount = attendanceRecords.filter((r) => r.status === 'Late').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Time & Attendance Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Biometric camera punch-in logs, real-time geofence enforcement, and shift compliance
          </p>
        </div>

        <button
          onClick={() => setIsPunchModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Camera className="w-4 h-4" />
          <span>{isPunchedIn ? 'Punch-Out with Camera' : 'Camera Punch-In'}</span>
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Staff Today</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{employees.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Assigned to scheduled shifts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Present / Punched</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">{presentCount}</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Active checked in</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">On-Time Arrival</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{onTimeCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Within 15-min grace window</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Late Check-ins</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">{lateCount}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Grace period exceeded</p>
        </div>
      </div>

      {/* Geofence Perimeter Alert Bar */}
      <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-blue-900">
              Active Geofence: {company.hqLocation.name}
            </p>
            <p className="text-[11px] text-blue-700">
              Lat {company.hqLocation.latitude.toFixed(4)}, Long {company.hqLocation.longitude.toFixed(4)} · Radius: {company.hqLocation.radiusMeters}m perimeter
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white text-blue-800 font-semibold rounded-lg border border-blue-200 self-start md:self-auto text-[11px]">
          Live Precision GPS Tracking
        </span>
      </div>

      {/* Punch Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daily Biometric & Punch Log (October 29, 2026)
          </h3>

          <div className="flex items-center gap-1">
            {['All', 'On Time', 'Late'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Biometric Snap</th>
                <th className="py-3 px-4">Clock-In Time</th>
                <th className="py-3 px-4">Clock-Out Time</th>
                <th className="py-3 px-4">Geofence Status</th>
                <th className="py-3 px-4">Work Duration</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{rec.employeeName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{rec.date}</p>
                  </td>
                  <td className="py-3 px-4">
                    {rec.punchInPhoto ? (
                      <button
                        onClick={() => setSelectedPhotoPreview(rec.punchInPhoto!)}
                        className="group relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:border-orange-500 transition-colors"
                        title="Click to preview facial snap"
                      >
                        <img
                          src={rec.punchInPhoto}
                          alt="Face snap"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Card Badge</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {rec.punchInTime}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {rec.punchOutTime || '— In Shift —'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          rec.isWithinGeofence ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <span className="font-medium text-slate-700">{rec.locationLabel}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {rec.workHours ? `${rec.workHours} hrs` : 'In progress'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        rec.status === 'On Time'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Preview Lightbox */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase">Camera Punch Biometric Verification</h3>
              <button
                onClick={() => setSelectedPhotoPreview(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedPhotoPreview}
              alt="Biometric facial capture"
              className="w-full aspect-4/3 rounded-xl object-cover border border-slate-200 shadow-inner"
            />
            <p className="text-[11px] text-slate-500 text-center font-mono">
              Captured at clock-in timestamp with ISO metadata
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
