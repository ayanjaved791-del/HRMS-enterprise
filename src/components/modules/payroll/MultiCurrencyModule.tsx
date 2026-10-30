import React, { useState } from 'react';
import {
  Globe2,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const MultiCurrencyModule: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency, currencyRates, payrollRuns } = useHR();
  const [baseAmountUSD, setBaseAmountUSD] = useState(15000);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.77, flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 153.4, flag: '🇯🇵' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 84.1, flag: '🇮🇳' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67, flag: '🇦🇪' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Multi-Currency Payroll Module</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Global currency exchange conversions for cross-border payroll runs and international contractor rates
        </p>
      </div>

      {/* Currency Switcher Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {currencies.map((curr) => {
          const isSelected = selectedCurrency === curr.code;
          return (
            <button
              key={curr.code}
              onClick={() => setSelectedCurrency(curr.code)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-orange-50/70 border-orange-500 ring-1 ring-orange-400/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xl mb-1.5">{curr.flag}</div>
              <p className="font-bold text-sm text-slate-900">{curr.code}</p>
              <p className="text-[11px] text-slate-500 truncate">{curr.name}</p>
              <p className="text-[11px] font-mono text-orange-600 font-semibold mt-1">
                1 USD = {curr.rate} {curr.code}
              </p>
            </button>
          );
        })}
      </div>

      {/* Live Conversion Sandbox */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Simulate Global Salary Conversion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Base Remuneration (USD)
            </label>
            <input
              type="number"
              step="500"
              value={baseAmountUSD}
              onChange={(e) => setBaseAmountUSD(Number(e.target.value))}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Conversion Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600">Converted Gross Equivalent</p>
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {currencies.find((c) => c.code === selectedCurrency)?.symbol}{' '}
              {Math.round(baseAmountUSD * (currencyRates[selectedCurrency] || 1)).toLocaleString()}{' '}
              {selectedCurrency}
            </p>
          </div>
          <span className="text-xs font-semibold text-orange-700 font-mono">
            Direct Wire Clearing Rate
          </span>
        </div>
      </div>
    </div>
  );
};
