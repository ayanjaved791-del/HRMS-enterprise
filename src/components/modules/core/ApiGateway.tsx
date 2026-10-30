import React, { useState } from 'react';
import {
  Webhook,
  Key,
  Copy,
  Check,
  Shield,
  Activity,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const ApiGateway: React.FC = () => {
  const { apiKeys } = useHR();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const copyToClipboard = (keyText: string, id: string) => {
    navigator.clipboard?.writeText(keyText);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleRunTestWebhook = () => {
    setTestResult('Triggering test webhook payload to Slack & Workday bridge...');
    setTimeout(() => {
      setTestResult('HTTP 200 OK — Payload delivered with signature sha256=9f1a23e9 in 42ms');
    }, 600);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Third-Party API Gateway & Webhooks</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enterprise API keys, external HRIS sync pipelines, and event webhooks
          </p>
        </div>

        <button
          onClick={handleRunTestWebhook}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-orange-600" />
          <span>Test Webhook Ping</span>
        </button>
      </div>

      {testResult && (
        <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl shadow-xs">
          {testResult}
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Integration Keys
          </h3>
          <span className="text-xs text-slate-400">OAuth2 Bearer & HMAC Verified</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {apiKeys.map((k) => (
            <div key={k.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-slate-900">{k.name}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      k.environment === 'Production'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {k.environment}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-500 text-[11px]">
                  <span>{k.keyPrefix}****************</span>
                  <button
                    onClick={() => copyToClipboard(`${k.keyPrefix}_sec_9918231`, k.id)}
                    className="text-slate-400 hover:text-slate-700 p-1"
                    title="Copy Key"
                  >
                    {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {k.scopes.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-right text-[11px] text-slate-400 font-mono">
                Last activity: {k.lastUsedDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Endpoints Reference */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Standard Webhook Endpoints
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <span className="text-orange-600 font-bold">POST</span>
            <span className="text-slate-700">/api/v1/attendance/punch</span>
            <span className="text-slate-400 text-[11px]">Fires on camera/geofence clock events</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <span className="text-orange-600 font-bold">POST</span>
            <span className="text-slate-700">/api/v1/leave/approved</span>
            <span className="text-slate-400 text-[11px]">Fires on PTO approval & balance update</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <span className="text-orange-600 font-bold">POST</span>
            <span className="text-slate-700">/api/v1/payroll/disbursed</span>
            <span className="text-slate-400 text-[11px]">Fires on monthly gross-to-net payout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
