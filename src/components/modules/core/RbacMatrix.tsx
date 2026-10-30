import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Check,
  X,
  Lock,
  UserCheck,
  Info
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const RbacMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState([
    { module: 'Employee Directory', admin: true, manager: true, employee: false, readOnly: true },
    { module: 'Biometric Camera Check-in', admin: true, manager: true, employee: true, readOnly: false },
    { module: 'Payroll Disbursal & Slabs', admin: true, manager: false, employee: false, readOnly: false },
    { module: 'Leave & PTO Approvals', admin: true, manager: true, employee: false, readOnly: false },
    { module: 'Timesheet Approvals', admin: true, manager: true, employee: false, readOnly: false },
    { module: 'ATS Candidate Pipeline & Offer', admin: true, manager: true, employee: false, readOnly: false },
    { module: 'Document Vault Master Access', admin: true, manager: false, employee: false, readOnly: false },
    { module: 'Asset Ledger & Reallocation', admin: true, manager: false, employee: false, readOnly: false },
    { module: 'No-Code Workflow Engine', admin: true, manager: false, employee: false, readOnly: false },
    { module: 'Company API Keys & Webhooks', admin: true, manager: false, employee: false, readOnly: false },
  ]);

  const togglePerm = (idx: number, role: 'admin' | 'manager' | 'employee') => {
    setPermissions((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [role]: !p[role] } : p))
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Role-Based Access Control (RBAC)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fine-grained access matrix for Company Administrators, People Managers, and Employees
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Principle of Least Privilege Enforced
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-5">System Resource / Capability</th>
              <th className="py-3 px-5 text-center">Company Admin</th>
              <th className="py-3 px-5 text-center">People Manager</th>
              <th className="py-3 px-5 text-center">Standard Employee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {permissions.map((perm, idx) => (
              <tr key={perm.module} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-semibold text-slate-800">
                  {perm.module}
                </td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => togglePerm(idx, 'admin')}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                      perm.admin
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {perm.admin ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => togglePerm(idx, 'manager')}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                      perm.manager
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {perm.manager ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </td>
                <td className="py-3.5 px-5 text-center">
                  <button
                    onClick={() => togglePerm(idx, 'employee')}
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                      perm.employee
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {perm.employee ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
