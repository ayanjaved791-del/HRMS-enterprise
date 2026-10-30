import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  DollarSign,
  Send,
  X
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { TimesheetEntry } from '../../../types';

export const ProjectTimesheets: React.FC = () => {
  const { timesheets, addTimesheet, updateTimesheetStatus, currentUser, activeRole } = useHR();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [projectName, setProjectName] = useState('HRMate NextGen Portal');
  const [clientName, setClientName] = useState('Acme Enterprise Internal');
  const [taskDescription, setTaskDescription] = useState('Camera clocking flow & geofence coordinate calculator');
  const [dailyHours, setDailyHours] = useState({
    mon: 8,
    tue: 8,
    wed: 8,
    thu: 8,
    fri: 7.5,
    sat: 0,
    sun: 0,
  });
  const [isBillable, setIsBillable] = useState(true);

  const handleCreateTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    addTimesheet({
      employeeId: currentUser?.employeeId || 'emp_01',
      weekStarting: '2026-10-26',
      projectName,
      clientName,
      taskDescription,
      dailyHours,
      isBillable,
    });
    setIsLogModalOpen(false);
  };

  const totalLoggedHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Digital Project Timesheets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log billable hours, project milestones, and weekly client billing allocations
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Project Hours</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Logged Hours (Current Week)</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {totalLoggedHours} hrs
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across active sprint tasks</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Billable Ratio</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">94.8%</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Client revenue generating</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Timesheet Status</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums">
            {timesheets.filter((t) => t.status === 'Submitted').length} Pending
          </p>
          <p className="text-[11px] text-blue-600/80 mt-0.5">Awaiting manager approval</p>
        </div>
      </div>

      {/* Timesheet Entries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Weekly Hours Matrix (Week of Oct 26 - Nov 01, 2026)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Standard 40h target</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Project & Client</th>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-2 text-center">Mon</th>
                <th className="py-3 px-2 text-center">Tue</th>
                <th className="py-3 px-2 text-center">Wed</th>
                <th className="py-3 px-2 text-center">Thu</th>
                <th className="py-3 px-2 text-center">Fri</th>
                <th className="py-3 px-2 text-center">Sat</th>
                <th className="py-3 px-2 text-center">Sun</th>
                <th className="py-3 px-3 text-center">Total</th>
                <th className="py-3 px-4">Status</th>
                {activeRole === 'admin' && <th className="py-3 px-4 text-right">Approval</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timesheets.map((ts) => (
                <tr key={ts.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{ts.projectName}</p>
                    <p className="text-[11px] text-slate-500">{ts.clientName}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={ts.taskDescription}>
                    {ts.taskDescription}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-800 tabular-nums">
                    {ts.dailyHours.mon}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-800 tabular-nums">
                    {ts.dailyHours.tue}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-800 tabular-nums">
                    {ts.dailyHours.wed}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-800 tabular-nums">
                    {ts.dailyHours.thu}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-800 tabular-nums">
                    {ts.dailyHours.fri}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-400 tabular-nums">
                    {ts.dailyHours.sat}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-medium text-slate-400 tabular-nums">
                    {ts.dailyHours.sun}
                  </td>
                  <td className="py-3 px-3 text-center font-bold font-mono text-slate-900 tabular-nums bg-slate-50/60">
                    {ts.totalHours} hrs
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        ts.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {ts.status}
                    </span>
                  </td>
                  {activeRole === 'admin' && (
                    <td className="py-3 px-4 text-right">
                      {ts.status === 'Submitted' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateTimesheetStatus(ts.id, 'Approved')}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateTimesheetStatus(ts.id, 'Rejected')}
                            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Locked</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Timesheet Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Log Weekly Project Timesheet</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTimesheet} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Deliverables</label>
                <input
                  type="text"
                  required
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Daily Hours (Mon - Sun)</label>
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                    <div key={day}>
                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{day}</span>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={dailyHours[day]}
                        onChange={(e) =>
                          setDailyHours((prev) => ({ ...prev, [day]: parseFloat(e.target.value) || 0 }))
                        }
                        className="w-full text-center text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="billable"
                  checked={isBillable}
                  onChange={(e) => setIsBillable(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="billable" className="text-xs font-medium text-slate-700">
                  Mark as Client Billable Work
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
