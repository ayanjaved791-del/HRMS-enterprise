import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  MoreVertical,
  Building,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  Lock,
  CreditCard,
  Eye,
  EyeOff,
  Shield,
  Briefcase
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { Employee } from '../../../types';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    selectedEmployeeDetail,
    setSelectedEmployeeDetail,
    selectedCurrency
  } = useHR();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state for Add/Edit
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Welcome@123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('Engineering');
  const [designation, setDesignation] = useState('');
  const [baseSalary, setBaseSalary] = useState(8500);
  const [employmentType, setEmploymentType] = useState<Employee['employmentType']>('Full-time');
  const [status, setStatus] = useState<Employee['status']>('Active');
  const [bankName, setBankName] = useState('Standard Chartered Bank');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 4092');
  const [ifscOrRouting, setIfscOrRouting] = useState('SCBL0001290');
  const [branch, setBranch] = useState('Central Corporate Hub');

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Human Resources', 'Finance', 'Operations'];

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('Welcome@123');
    setPhone('');
    setDepartment('Engineering');
    setDesignation('');
    setBaseSalary(8500);
    setEmploymentType('Full-time');
    setStatus('Active');
    setBankName('Standard Chartered Bank');
    setAccountNumber('•••• •••• 4092');
    setIfscOrRouting('SCBL0001290');
    setBranch('Central Corporate Hub');
    setCurrentEditId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setCurrentEditId(emp.id);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPassword(emp.password || 'Welcome@123');
    setPhone(emp.phone);
    setDepartment(emp.department);
    setDesignation(emp.designation);
    setBaseSalary(emp.salary.baseMonthly);
    setEmploymentType(emp.employmentType);
    setStatus(emp.status);
    setBankName(emp.bankDetails?.bankName || 'Standard Chartered Bank');
    setAccountNumber(emp.bankDetails?.accountNumber || '•••• •••• 4092');
    setIfscOrRouting(emp.bankDetails?.ifscOrRouting || 'SCBL0001290');
    setBranch(emp.bankDetails?.branch || 'Central Corporate Hub');
    setIsEditModalOpen(true);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    addEmployee({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || 'Welcome@123',
      phone: phone.trim() || '+1 (555) 019-4821',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + employees.length}?w=150&auto=format&fit=crop&q=80`,
      department,
      designation: designation.trim() || 'Team Member',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType,
      status,
      salary: {
        baseMonthly: Number(baseSalary),
        hra: Math.round(Number(baseSalary) * 0.25),
        specialAllowance: Math.round(Number(baseSalary) * 0.15),
        currency: selectedCurrency,
      },
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscOrRouting: ifscOrRouting.trim(),
        branch: branch.trim(),
      },
      leaveBalances: {
        annual: 20,
        sick: 10,
        casual: 5,
        parental: 15,
      },
      location: 'Corporate HQ Floor 4',
      emergencyContact: {
        name: 'Family Contact',
        relation: 'Kin',
        phone: '+1 (555) 019-0000',
      },
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditId || !firstName.trim() || !lastName.trim() || !email.trim()) return;

    updateEmployee(currentEditId, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone.trim(),
      department,
      designation: designation.trim(),
      employmentType,
      status,
      salary: {
        baseMonthly: Number(baseSalary),
        hra: Math.round(Number(baseSalary) * 0.25),
        specialAllowance: Math.round(Number(baseSalary) * 0.15),
        currency: selectedCurrency,
      },
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscOrRouting: ifscOrRouting.trim(),
        branch: branch.trim(),
      },
    });

    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = (id: string) => {
    deleteEmployee(id);
    setDeletingId(null);
  };

  const exportCSV = () => {
    const headers = ['Employee Code', 'Full Name', 'Email', 'Department', 'Designation', 'Status', 'Joining Date', 'Base Monthly'];
    const rows = filtered.map((e) => [
      e.employeeCode,
      `"${e.firstName} ${e.lastName}"`,
      e.email,
      e.department,
      `"${e.designation}"`,
      e.status,
      e.joiningDate,
      `"${e.salary.baseMonthly} ${e.salary.currency}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Staff Management & Employee Directory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Onboard new employees, provision their login credentials, manage compensation, bank details, and edit or remove records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs shadow-orange-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, employee code, designation, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            {(['All', 'Active', 'On Leave', 'Terminated'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Department Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1.5 shrink-0">Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Employees Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {employees.length === 0
                ? 'Your roster is currently empty. Click "Add New Employee" to onboard team members and assign their login credentials.'
                : 'No employees match the current filter criteria.'}
            </p>
            {employees.length === 0 && (
              <button
                onClick={handleOpenAddModal}
                className="mt-4 px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
              >
                Onboard First Employee
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Employee Member</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Status & Type</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Disbursement Bank</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployeeDetail(emp)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {emp.employeeCode} · {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{emp.designation}</p>
                      <p className="text-[11px] text-slate-500">{emp.department}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {emp.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{emp.employmentType}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 font-mono">
                        ${emp.salary.baseMonthly.toLocaleString()} {emp.salary.currency}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        +${(emp.salary.hra + emp.salary.specialAllowance).toLocaleString()} Allowances
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 text-[11px]">
                        {emp.bankDetails?.bankName || 'Corporate Bank'}
                      </p>
                      <p className="font-mono text-slate-500 text-[10px]">
                        {emp.bankDetails?.accountNumber || '•••• •••• 0000'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedEmployeeDetail(emp)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(emp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Details Drawer */}
      {selectedEmployeeDetail && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <img
                src={selectedEmployeeDetail.avatar}
                alt={selectedEmployeeDetail.firstName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedEmployeeDetail.firstName} {selectedEmployeeDetail.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedEmployeeDetail.employeeCode} · {selectedEmployeeDetail.designation}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmployeeDetail(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs">
            {/* Quick Action Bar inside drawer */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleOpenEditModal(selectedEmployeeDetail);
                  setSelectedEmployeeDetail(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details & Password</span>
              </button>
              <button
                onClick={() => {
                  setDeletingId(selectedEmployeeDetail.id);
                  setSelectedEmployeeDetail(null);
                }}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                title="Delete Employee"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Login Credentials & Contact */}
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-2.5 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Login & Communication</p>
              <div className="flex items-center gap-2 text-slate-800">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-semibold">{selectedEmployeeDetail.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedEmployeeDetail.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Portal Password:{' '}
                  <strong className="font-mono text-slate-900">
                    {selectedEmployeeDetail.password || 'Welcome@123'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Compensation */}
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Compensation Breakdown
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px]">Base Monthly</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums font-mono">
                    ${selectedEmployeeDetail.salary.baseMonthly.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-500 text-[10px]">HRA + Special</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums font-mono">
                    ${(selectedEmployeeDetail.salary.hra + selectedEmployeeDetail.salary.specialAllowance).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Credentials */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Disbursement Bank Account
              </p>
              <p className="font-bold text-slate-800 text-xs">
                {selectedEmployeeDetail.bankDetails?.bankName || 'Standard Chartered Bank'}
              </p>
              <p className="font-mono text-slate-600 text-xs">
                Account: {selectedEmployeeDetail.bankDetails?.accountNumber || '•••• •••• 4092'}
              </p>
              <p className="text-[11px] text-slate-400">
                IFSC/Routing: {selectedEmployeeDetail.bankDetails?.ifscOrRouting || 'SCBL0001290'} · Branch:{' '}
                {selectedEmployeeDetail.bankDetails?.branch || 'Headquarters'}
              </p>
            </div>

            {/* Leave Bank */}
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Leave Balance Bank
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Annual:</span>{' '}
                  <span className="font-bold text-slate-900">{selectedEmployeeDetail.leaveBalances.annual} days</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Sick:</span>{' '}
                  <span className="font-bold text-slate-900">{selectedEmployeeDetail.leaveBalances.sick} days</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Casual:</span>{' '}
                  <span className="font-bold text-slate-900">{selectedEmployeeDetail.leaveBalances.casual} days</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Parental:</span>{' '}
                  <span className="font-bold text-slate-900">{selectedEmployeeDetail.leaveBalances.parental} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isEditModalOpen ? 'Edit Employee Details & Credentials' : 'Onboard New Employee'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleUpdateEmployee : handleCreateEmployee} className="space-y-4">
              {/* Section 1: Personal & Login Credentials */}
              <div className="space-y-3">
                <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  1. Personal & Login Credentials
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="john.smith@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F766E] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Employee Portal Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Welcome@123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs pl-8 pr-8 py-2 bg-teal-50/20 border border-teal-200 rounded-xl focus:outline-none focus:border-[#0F766E] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-teal-700" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-teal-700 mt-1 font-medium">
                      Required: The employee will use this password to sign in to their Employee Portal.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 019-2831"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Section 2: Department & Role */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  2. Department & Employment Architecture
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Job Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Probation">Probation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Roster Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Salary & Bank Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                  3. Compensation & Bank Account (For Payslip Generation)
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Monthly Salary ({selectedCurrency})
                  </label>
                  <input
                    type="number"
                    min="500"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-orange-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    HRA (25% = ${(baseSalary * 0.25).toFixed(0)}) & Special Allowance (15% = ${(baseSalary * 0.15).toFixed(0)}) calculated automatically.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. JPMorgan Chase"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="•••• •••• 4092"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Routing / IFSC Code</label>
                    <input
                      type="text"
                      placeholder="SCBL0001290"
                      value={ifscOrRouting}
                      onChange={(e) => setIfscOrRouting(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
                    <input
                      type="text"
                      placeholder="Downtown Hub"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors"
                >
                  {isEditModalOpen ? 'Save Employee Changes' : 'Confirm Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Remove Employee from Workspace?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will permanently remove the employee record, revoke their login access, and archive their attendance and payroll history.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
