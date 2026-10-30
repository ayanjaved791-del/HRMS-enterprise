import React, { useState } from 'react';
import {
  Boxes,
  Laptop,
  Monitor,
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  X,
  UserCheck,
  ArrowRightLeft
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';
import { CompanyAsset } from '../../../types';

export const AssetLedger: React.FC = () => {
  const { companyAssets, addAsset, employees, assignAsset, returnAsset } = useHR();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetAssetId, setTargetAssetId] = useState<string | null>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');

  // Add Asset modal state
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<'Laptop' | 'Monitor' | 'Security Token' | 'Other'>('Laptop');
  const [assetTag, setAssetTag] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseValueUSD, setPurchaseValueUSD] = useState(1500);
  const [warrantyExpiry, setWarrantyExpiry] = useState('2028-12-31');

  const categories = ['All', 'Laptop', 'Monitor', 'Security Token', 'Other'];

  const filtered = companyAssets.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ast.assignedToName && ast.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || ast.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAssetId || !selectedEmpId) return;
    assignAsset(targetAssetId, selectedEmpId);
    setIsAssignModalOpen(false);
    setTargetAssetId(null);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    addAsset({
      name: assetName.trim(),
      category: assetCategory as any,
      assetTag: assetTag.trim() || `AST-${Date.now().toString().slice(-4)}`,
      serialNumber: serialNumber.trim() || `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: 'In Stock',
      purchaseDate: '2026-10-29',
      purchaseValueUSD: Number(purchaseValueUSD) || 1200,
      warrantyExpiry: warrantyExpiry || '2028-12-31',
    });

    setIsAddAssetOpen(false);
    setAssetName('');
    setAssetTag('');
    setSerialNumber('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Company Asset Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware inventory, warranty cycles, and employee device provisioning status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            Total Asset Value: ${companyAssets.reduce((sum, a) => sum + a.purchaseValueUSD, 0).toLocaleString()} USD
          </span>

          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hardware Asset</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by tag, serial, employee, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center border-dashed border-slate-200 space-y-3">
            <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Hardware Assets Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Track devices, laptops, monitors, and tokens issued to employees.
            </p>
            <button
              onClick={() => setIsAddAssetOpen(true)}
              className="px-3.5 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700"
            >
              Register First Asset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Asset Details</th>
                  <th className="py-3 px-4">Tag / Serial</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Warranty Expiry</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                          {ast.category === 'Laptop' ? (
                            <Laptop className="w-4 h-4" />
                          ) : ast.category === 'Monitor' ? (
                            <Monitor className="w-4 h-4" />
                          ) : (
                            <Boxes className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{ast.name}</p>
                          <p className="text-[11px] text-slate-500">{ast.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      <p className="font-semibold">{ast.assetTag}</p>
                      <p className="text-slate-400">SN: {ast.serialNumber}</p>
                    </td>
                    <td className="py-3 px-4">
                      {ast.assignedToName ? (
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ast.assignedToName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned (In IT Cage)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {ast.warrantyExpiry}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 tabular-nums">
                      ${ast.purchaseValueUSD.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          ast.status === 'Allocated'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {ast.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ast.status === 'Allocated' ? (
                        <button
                          onClick={() => returnAsset(ast.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Check-In
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setTargetAssetId(ast.id);
                            setIsAssignModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Provision & Assign Asset</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Employee Assignee
                </label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.department} - {e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Register Hardware Asset</h3>
                <p className="text-xs text-slate-500">Record asset in company IT ledger</p>
              </div>
              <button
                onClick={() => setIsAddAssetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Name / Model</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. MacBook Pro 16-inch M3 Max"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Security Token">Security Token</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase Value (USD)</label>
                  <input
                    type="number"
                    value={purchaseValueUSD}
                    onChange={(e) => setPurchaseValueUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Tag</label>
                  <input
                    type="text"
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    placeholder="AST-1042"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="C02G..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warranty Expiry Date</label>
                <input
                  type="date"
                  value={warrantyExpiry}
                  onChange={(e) => setWarrantyExpiry(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssetOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
