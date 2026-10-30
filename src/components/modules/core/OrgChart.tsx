import React, { useState } from 'react';
import {
  Network,
  Users,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Mail,
  MapPin
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const OrgChart: React.FC = () => {
  const { employees, setSelectedEmployeeDetail, setActiveModule, setActiveSubTab } = useHR();
  const [zoomLevel, setZoomLevel] = useState(1);

  // Group by leadership
  const leader = employees.find((e) => e.id === 'emp_01') || employees[0]; // Matt Murdock VP HR
  const directs = employees.filter((e) => e.managerId === leader.id);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Dynamic Organizational Chart</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-level corporate hierarchy with department grouping
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-700 px-2">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Org Canvas */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-8 overflow-x-auto min-h-[520px] flex flex-col items-center justify-start shadow-inner">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 flex flex-col items-center"
        >
          {/* Executive Node (Matt Murdock) */}
          <div
            onClick={() => {
              setSelectedEmployeeDetail(leader);
              setActiveModule('core');
              setActiveSubTab('employees');
            }}
            className="w-72 bg-white rounded-2xl p-4 border-2 border-orange-500 shadow-md hover:shadow-lg transition-all cursor-pointer relative group text-center"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
              Executive Leadership
            </span>
            <div className="flex flex-col items-center mt-1">
              <img
                src={leader.avatar}
                alt={leader.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 mb-2"
                referrerPolicy="no-referrer"
              />
              <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {leader.firstName} {leader.lastName}
              </h3>
              <p className="text-xs font-semibold text-orange-600">{leader.designation}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{leader.department}</p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{leader.location.split('(')[0]}</span>
              </div>
            </div>
          </div>

          {/* Vertical connector line */}
          <div className="w-0.5 h-10 bg-slate-300" />

          {/* Horizontal crossbar connector */}
          <div className="w-[850px] max-w-full h-0.5 bg-slate-300 relative">
            <span className="absolute left-0 top-0 w-0.5 h-6 bg-slate-300" />
            <span className="absolute left-1/4 top-0 w-0.5 h-6 bg-slate-300" />
            <span className="absolute left-1/2 top-0 w-0.5 h-6 bg-slate-300" />
            <span className="absolute left-3/4 top-0 w-0.5 h-6 bg-slate-300" />
            <span className="absolute right-0 top-0 w-0.5 h-6 bg-slate-300" />
          </div>

          {/* Direct Reports Tier */}
          <div className="grid grid-cols-5 gap-4 pt-6 max-w-5xl">
            {directs.map((emp) => {
              const subReports = employees.filter((e) => e.managerId === emp.id);
              return (
                <div key={emp.id} className="flex flex-col items-center">
                  {/* Card */}
                  <div
                    onClick={() => {
                      setSelectedEmployeeDetail(emp);
                      setActiveModule('core');
                      setActiveSubTab('employees');
                    }}
                    className="w-48 bg-white rounded-xl p-3.5 border border-slate-200 hover:border-orange-400 shadow-xs hover:shadow-md transition-all cursor-pointer text-center group"
                  >
                    <img
                      src={emp.avatar}
                      alt={emp.firstName}
                      className="w-10 h-10 rounded-full object-cover mx-auto mb-2 border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 truncate">
                      {emp.firstName} {emp.lastName}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{emp.designation}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {emp.department}
                    </span>

                    {subReports.length > 0 && (
                      <p className="text-[10px] text-orange-600 font-bold mt-2">
                        {subReports.length} Direct Report{subReports.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Sub-report vertical drop */}
                  {subReports.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-slate-300" />
                      <div className="space-y-2">
                        {subReports.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => {
                              setSelectedEmployeeDetail(sub);
                              setActiveModule('core');
                              setActiveSubTab('employees');
                            }}
                            className="w-44 bg-white rounded-lg p-2.5 border border-slate-200 hover:border-orange-400 shadow-2xs cursor-pointer text-center group"
                          >
                            <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600 truncate">
                              {sub.firstName} {sub.lastName}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{sub.designation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
