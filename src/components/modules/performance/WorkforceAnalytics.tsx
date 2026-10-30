import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Building,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { useHR } from '../../../context/HRContext';

export const WorkforceAnalytics: React.FC = () => {
  const { employees, payrollRuns, company, offboardingRecords, pulseSurvey } = useHR();

  const deptCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalHeadcount = employees.length;
  const retentionRate =
    totalHeadcount + offboardingRecords.length > 0
      ? ((totalHeadcount / (totalHeadcount + offboardingRecords.length)) * 100).toFixed(1)
      : '100.0';

  // Compute avg tenure in years
  const avgTenureYears =
    totalHeadcount > 0
      ? (
          employees.reduce((acc, e) => {
            const joinMs = new Date(e.joiningDate).getTime();
            const diffYears = (Date.now() - joinMs) / (1000 * 60 * 60 * 24 * 365.25);
            return acc + Math.max(0.1, diffYears);
          }, 0) / totalHeadcount
        ).toFixed(1)
      : '0.0';

  // Compute monthly payroll run
  const monthlyPayrollTotal = employees.reduce((sum, e) => {
    const gross = (e.salary?.baseMonthly || 0) + (e.salary?.hra || 0) + (e.salary?.specialAllowance || 0);
    return sum + gross;
  }, 0);

  // Group join dates into quarterly trajectory
  const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
  const quarterlyGrowth = quarters.map((q, idx) => {
    // Distribute employees across quarters by joining date or current progress
    const count = employees.filter((e) => {
      const year = e.joiningDate.slice(0, 4);
      const month = parseInt(e.joiningDate.slice(5, 7), 10);
      const qNum = Math.ceil(month / 3);
      return year <= '2026' && qNum <= idx + 1;
    }).length;
    return { q, count: count || Math.min(totalHeadcount, idx + 1) };
  });

  const maxQuarterCount = Math.max(...quarterlyGrowth.map((g) => g.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Strategic Workforce Analytics</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enterprise headcount expansion metrics, retention trajectories, and department capital allocations
        </p>
      </div>

      {/* Top 4 Macro Trends Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Workforce Retention</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{retentionRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Calculated from separation records</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Avg Tenure</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {avgTenureYears} {Number(avgTenureYears) === 1 ? 'Year' : 'Years'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Based on employee start dates</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Monthly Payroll Run</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              ${monthlyPayrollTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Gross monthly salary commitments</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Pulse Satisfaction</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-orange-600 tabular-nums">
              {pulseSurvey.averageRating.toFixed(1)} / 5.0
            </span>
          </div>
          <p className="text-[11px] text-orange-600/80 mt-0.5">
            {pulseSurvey.totalVotes} response{pulseSurvey.totalVotes === 1 ? '' : 's'} recorded
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Headcount Growth Trajectory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quarterly Headcount Expansion
            </h3>
            <span className="text-xs font-mono font-semibold text-emerald-600">
              {totalHeadcount} Active Personnel
            </span>
          </div>

          {totalHeadcount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No employee headcount recorded in workspace yet.
            </div>
          ) : (
            <div className="h-44 flex items-end justify-between gap-3 pt-4">
              {quarterlyGrowth.map((item) => (
                <div key={item.q} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: `${Math.max(15, (item.count / maxQuarterCount) * 100)}%` }}
                    className="w-full max-w-[36px] bg-orange-500 hover:bg-orange-600 rounded-t-lg transition-all"
                    title={`${item.count} staff`}
                  />
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    {item.q}
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 tabular-nums">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Capital & Headcount Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Department Workforce Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {Object.keys(deptCounts).length} Functional {Object.keys(deptCounts).length === 1 ? 'Domain' : 'Domains'}
            </span>
          </div>

          {totalHeadcount === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No department assignments found.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const pct = Math.round((count / totalHeadcount) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{dept}</span>
                      <span className="font-mono text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-slate-800 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
