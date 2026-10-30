import React, { useState } from 'react';
import {
  Palette,
  Type,
  FileText,
  Printer,
  Download,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  Building2,
  QrCode,
  ShieldCheck,
  CreditCard,
  Sliders,
  Eye,
  Copy
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { PayslipTemplate, Employee } from '../../../types';

export const PayslipDesigner: React.FC = () => {
  const {
    company,
    employees,
    payslipTemplate,
    updatePayslipTemplate,
    resetPayslipTemplate,
    importPayslipTemplate,
    selectedCurrency
  } = useHR();

  // Local editing state
  const [template, setTemplate] = useState<PayslipTemplate>(payslipTemplate);
  const [selectedPreviewEmployeeId, setSelectedPreviewEmployeeId] = useState<string>(
    employees[0]?.id || 'demo_emp'
  );
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Pick preview employee
  const previewEmp: Employee =
    employees.find((e) => e.id === selectedPreviewEmployeeId) ||
    employees[0] || {
      id: 'demo_emp',
      employeeCode: 'EMP-1001',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 's.chen@example.com',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Engineering',
      designation: 'Principal Systems Architect',
      joiningDate: '2024-03-01',
      employmentType: 'Full-time',
      status: 'Active',
      salary: {
        baseMonthly: 9500,
        hra: 2375,
        specialAllowance: 1425,
        currency: selectedCurrency,
      },
      bankDetails: {
        bankName: 'JPMorgan Chase & Co.',
        accountNumber: '•••• •••• 8841',
        ifscOrRouting: '021000021',
        branch: 'San Francisco Financial Center',
      },
      leaveBalances: { annual: 18, sick: 9, casual: 4, parental: 12 },
      location: 'Corporate HQ Floor 6',
      emergencyContact: { name: 'David Chen', relation: 'Spouse', phone: '+1 555-0199' },
    };

  const calculatedBase = previewEmp.salary.baseMonthly;
  const calculatedHra = previewEmp.salary.hra;
  const calculatedAllowances = previewEmp.salary.specialAllowance;
  const calculatedGross = calculatedBase + calculatedHra + calculatedAllowances;
  const calculatedTax = Math.round(calculatedBase * 0.12);
  const calculatedPf = Math.round(calculatedBase * 0.05);
  const calculatedInsurance = 120;
  const calculatedTotalDeductions = calculatedTax + calculatedPf + calculatedInsurance;
  const calculatedNet = calculatedGross - calculatedTotalDeductions;

  const fontOptions: PayslipTemplate['fontFamily'][] = [
    'Plus Jakarta Sans',
    'Inter',
    'Roboto',
    'JetBrains Mono',
    'Georgia',
  ];

  const colorPresets = [
    { name: 'Corporate Orange', hex: '#ea580c' },
    { name: 'Executive Navy', hex: '#1e3a8a' },
    { name: 'Emerald Enterprise', hex: '#059669' },
    { name: 'Royal Indigo', hex: '#4f46e5' },
    { name: 'Crimson Slate', hex: '#be123c' },
    { name: 'Deep Charcoal', hex: '#334155' },
  ];

  const presets = [
    {
      name: 'Modern Executive',
      template: {
        ...template,
        fontFamily: 'Plus Jakarta Sans' as const,
        primaryColor: '#ea580c',
        headerStyle: 'banner' as const,
        headerTitle: 'CONFIDENTIAL SALARY DISBURSEMENT STATEMENT',
        showLogo: true,
        showQrCode: true,
        showEmployerSignature: true,
      },
    },
    {
      name: 'Tech Minimalist',
      template: {
        ...template,
        fontFamily: 'Inter' as const,
        primaryColor: '#1e3a8a',
        headerStyle: 'clean' as const,
        headerTitle: 'OFFICIAL REMUNERATION ADVICE',
        showLogo: true,
        showQrCode: true,
        showEmployerSignature: false,
      },
    },
    {
      name: 'Classic Two-Tone',
      template: {
        ...template,
        fontFamily: 'Georgia' as const,
        primaryColor: '#059669',
        headerStyle: 'two-tone' as const,
        headerTitle: 'CERTIFICATE OF MONTHLY EARNINGS',
        showLogo: true,
        showQrCode: false,
        showEmployerSignature: true,
      },
    },
    {
      name: 'Monospace Audit',
      template: {
        ...template,
        fontFamily: 'JetBrains Mono' as const,
        primaryColor: '#334155',
        headerStyle: 'corporate' as const,
        headerTitle: 'AUTHENTICATED WAGE AUDIT VOUCHER',
        showLogo: false,
        showQrCode: true,
        showEmployerSignature: true,
      },
    },
  ];

  const handleSaveToWorkspace = () => {
    updatePayslipTemplate(template);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setTemplate(p.template);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = importPayslipTemplate(importJsonText);
    if (ok) {
      setTemplate(JSON.parse(importJsonText));
      setIsImportModalOpen(false);
      setImportJsonText('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } else {
      alert('Invalid JSON template format. Please ensure valid keys are present.');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(template, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  // Font style map
  const getFontFamilyClass = (font: PayslipTemplate['fontFamily']) => {
    switch (font) {
      case 'JetBrains Mono':
        return 'font-mono';
      case 'Georgia':
        return 'font-serif';
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Palette className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Interactive Payslip Designer Studio</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize typography, header banners, colors, section headings, and bank account fields. All employee payslips automatically adapt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Voucher</span>
          </button>

          <button
            onClick={handleSaveToWorkspace}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200'
            }`}
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved Default!' : 'Save Template'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Styles */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>One-Click Design Presets</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-3 py-2 text-left rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all text-xs group cursor-pointer"
                >
                  <p className="font-semibold text-slate-800 group-hover:text-orange-600">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.template.fontFamily}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Typography & Accent Color */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-orange-600" />
              <span>Typography & Branding Color</span>
            </h3>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
              <select
                value={template.fontFamily}
                onChange={(e) => setTemplate({ ...template, fontFamily: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              >
                {fontOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Accent Color</label>
              <div className="flex items-center gap-2 mb-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTemplate({ ...template, primaryColor: c.hex })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      template.primaryColor === c.hex ? 'scale-110 border-slate-900 shadow-xs' : 'border-white'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={template.primaryColor}
                  onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={template.primaryColor}
                  onChange={(e) => setTemplate({ ...template, primaryColor: e.target.value })}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  placeholder="#ea580c"
                />
              </div>
            </div>

            {/* Header Layout */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Header Style</label>
              <select
                value={template.headerStyle}
                onChange={(e) => setTemplate({ ...template, headerStyle: e.target.value as any })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              >
                <option value="banner">Solid Banner Header</option>
                <option value="clean">Minimal Clean Header</option>
                <option value="two-tone">Two-Tone Executive</option>
                <option value="corporate">Bordered Corporate</option>
              </select>
            </div>
          </div>

          {/* Custom Headings & Labels */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-orange-600" />
              <span>Headings & Section Titles</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Header Title</label>
              <input
                type="text"
                value={template.headerTitle}
                onChange={(e) => setTemplate({ ...template, headerTitle: e.target.value })}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Header Subtitle</label>
              <input
                type="text"
                value={template.headerSubtitle}
                onChange={(e) => setTemplate({ ...template, headerSubtitle: e.target.value })}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tax / Registration ID</label>
              <input
                type="text"
                value={template.companyTaxNumber}
                onChange={(e) => setTemplate({ ...template, companyTaxNumber: e.target.value })}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Earnings Heading</label>
                <input
                  type="text"
                  value={template.earningsHeading}
                  onChange={(e) => setTemplate({ ...template, earningsHeading: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Deductions Heading</label>
                <input
                  type="text"
                  value={template.deductionsHeading}
                  onChange={(e) => setTemplate({ ...template, deductionsHeading: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bank Section Heading</label>
              <input
                type="text"
                value={template.accountDetailsHeading}
                onChange={(e) => setTemplate({ ...template, accountDetailsHeading: e.target.value })}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Footer Note / Disclaimer</label>
              <textarea
                rows={2}
                value={template.footerNote}
                onChange={(e) => setTemplate({ ...template, footerNote: e.target.value })}
                className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.showLogo}
                  onChange={(e) => setTemplate({ ...template, showLogo: e.target.checked })}
                  className="rounded text-orange-600"
                />
                <span className="text-slate-700 font-medium">Show Company Brand Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.showQrCode}
                  onChange={(e) => setTemplate({ ...template, showQrCode: e.target.checked })}
                  className="rounded text-orange-600"
                />
                <span className="text-slate-700 font-medium">Include Verification QR Code</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.showEmployerSignature}
                  onChange={(e) => setTemplate({ ...template, showEmployerSignature: e.target.checked })}
                  className="rounded text-orange-600"
                />
                <span className="text-slate-700 font-medium">Include Authorized Signature Sign-off</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Employee Data Switcher */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-slate-800">Live Previewing Employee:</span>
            </div>

            <select
              value={selectedPreviewEmployeeId}
              onChange={(e) => setSelectedPreviewEmployeeId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
            >
              {employees.length === 0 ? (
                <option value="demo_emp">Sarah Chen (Demo Staff Data)</option>
              ) : (
                employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode} · {emp.department})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* THE LIVE PAYSLIP VOUCHER CANVAS */}
          <div
            id="printable-payslip"
            className={`bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none transition-all ${getFontFamilyClass(
              template.fontFamily
            )}`}
          >
            {/* Header Area based on headerStyle */}
            {template.headerStyle === 'banner' ? (
              <div
                className="p-6 text-white"
                style={{ backgroundColor: template.primaryColor }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {template.showLogo && (
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/20 font-black text-xs tracking-wider mb-2">
                        {company.name}
                      </div>
                    )}
                    <h1 className="text-lg font-black tracking-tight">{template.headerTitle}</h1>
                    <p className="text-xs text-white/80 mt-0.5">{template.headerSubtitle}</p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p className="font-bold">{company.hqLocation.name}</p>
                    <p className="text-white/80 text-[11px] mt-0.5">Tax Ref: {template.companyTaxNumber}</p>
                  </div>
                </div>
              </div>
            ) : template.headerStyle === 'two-tone' ? (
              <div className="border-b-4" style={{ borderColor: template.primaryColor }}>
                <div className="p-6 bg-slate-50 flex items-start justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-slate-900" style={{ color: template.primaryColor }}>
                      {template.headerTitle}
                    </h1>
                    <p className="text-xs text-slate-500">{company.name} · {company.hqLocation.name}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase text-white" style={{ backgroundColor: template.primaryColor }}>
                      Electronic Disbursal
                    </span>
                    <p className="mt-1 font-semibold">Ref: {template.companyTaxNumber}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-white">
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{template.headerTitle}</h1>
                  <p className="text-xs text-slate-500 font-semibold">{company.name}</p>
                  <p className="text-[11px] text-slate-400">{template.headerSubtitle}</p>
                </div>
                <div className="text-right">
                  <span
                    className="inline-block w-3 h-3 rounded-full mb-1"
                    style={{ backgroundColor: template.primaryColor }}
                  />
                  <p className="text-xs font-mono font-bold text-slate-700">{template.companyTaxNumber}</p>
                </div>
              </div>
            )}

            {/* Voucher Body Content */}
            <div className="p-6 space-y-6 text-xs text-slate-800">
              {/* Employee & Bank Info Header Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Employee Name</p>
                  <p className="font-bold text-slate-900 mt-0.5 text-xs">
                    {previewEmp.firstName} {previewEmp.lastName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">{previewEmp.employeeCode}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Designation & Team</p>
                  <p className="font-semibold text-slate-800 mt-0.5 text-xs">{previewEmp.designation}</p>
                  <p className="text-[10px] text-slate-500">{previewEmp.department}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Disbursed Period</p>
                  <p className="font-bold text-slate-900 mt-0.5 text-xs">October 2026</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Status: Fully Paid</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location Center</p>
                  <p className="font-semibold text-slate-800 mt-0.5 text-xs">{previewEmp.location}</p>
                  <p className="text-[10px] text-slate-500">Joined {previewEmp.joiningDate}</p>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div
                    className="px-4 py-2 text-white font-bold text-xs"
                    style={{ backgroundColor: template.primaryColor }}
                  >
                    {template.earningsHeading}
                  </div>
                  <div className="p-4 space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-600">Base Salary</span>
                      <span className="font-mono font-bold text-slate-900">
                        ${calculatedBase.toLocaleString()} {previewEmp.salary.currency}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-bold text-slate-900">
                        ${calculatedHra.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-600">Special Executive Allowance</span>
                      <span className="font-mono font-bold text-slate-900">
                        ${calculatedAllowances.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                      <span>Total Gross Compensation</span>
                      <span className="font-mono">${calculatedGross.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-slate-800 text-white font-bold text-xs">
                    {template.deductionsHeading}
                  </div>
                  <div className="p-4 space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-600">Statutory Tax Withholding</span>
                      <span className="font-mono font-bold text-red-600">
                        -${calculatedTax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-600">Provident Fund / Retirement 401(k)</span>
                      <span className="font-mono font-bold text-blue-600">
                        -${calculatedPf.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span className="text-slate-600">Health & Life Benefits</span>
                      <span className="font-mono font-bold text-slate-700">
                        -${calculatedInsurance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-red-600">
                      <span>Total Withholdings</span>
                      <span className="font-mono">-${calculatedTotalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Take-Home Highlight Banner */}
              <div
                className="p-4 rounded-xl border flex items-center justify-between text-white"
                style={{ backgroundColor: template.primaryColor }}
              >
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/80">{template.netPayHeading}</p>
                  <p className="text-2xl font-black font-mono tracking-tight mt-0.5">
                    ${calculatedNet.toLocaleString()} {previewEmp.salary.currency}
                  </p>
                </div>

                <div className="text-right text-[11px] text-white/90">
                  <p className="font-semibold">Electronic ACH Transfer Verified</p>
                  <p className="text-white/70 text-[10px]">Settled: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Bank Account Details Auto-Populated */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-slate-800">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>{template.accountDetailsHeading}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Financial Institution</span>
                    <span className="font-semibold text-slate-800">
                      {previewEmp.bankDetails?.bankName || 'Corporate Bank Partner'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Account Credential</span>
                    <span className="font-mono font-bold text-slate-900">
                      {previewEmp.bankDetails?.accountNumber || '•••• •••• 9921'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Routing / Branch Code</span>
                    <span className="font-mono font-medium text-slate-700">
                      {previewEmp.bankDetails?.ifscOrRouting || 'SCBL001928'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Branch Jurisdiction</span>
                    <span className="font-medium text-slate-700">
                      {previewEmp.bankDetails?.branch || 'Headquarters City'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer and Signatures */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
                <div className="max-w-md">
                  <p>{template.footerNote}</p>
                </div>

                {template.showQrCode && (
                  <div className="flex items-center gap-2 shrink-0 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <QrCode className="w-7 h-7 text-slate-700" />
                    <div>
                      <p className="font-bold text-[9px] uppercase text-slate-800">Authenticated QR</p>
                      <p className="text-[8px] text-slate-400">HRMate Blockchain Hash</p>
                    </div>
                  </div>
                )}

                {template.showEmployerSignature && (
                  <div className="text-right shrink-0">
                    <div className="w-32 border-b border-slate-300 pb-1 mb-1 font-serif italic text-slate-800 text-xs">
                      {template.signatoryName || 'Authorized Officer'}
                    </div>
                    <p className="text-[9px] font-semibold text-slate-600">
                      {template.signatoryTitle || 'Director of Finance & HR'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export JSON Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Export Custom Payslip Design JSON</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Copy this configuration JSON to import into other environments or share your design.
            </p>
            <textarea
              readOnly
              rows={8}
              value={JSON.stringify(template, null, 2)}
              className="w-full text-[11px] font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccess ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Import Custom Payslip Design JSON</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste a custom template JSON below to immediately load its fonts, colors, and layout configurations.
            </p>
            <form onSubmit={handleImportSubmit} className="space-y-3">
              <textarea
                rows={8}
                required
                placeholder='Paste {"fontFamily": "Plus Jakarta Sans", "primaryColor": "#ea580c", ...}'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full text-[11px] font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
                >
                  Load Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
