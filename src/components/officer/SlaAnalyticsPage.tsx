import React from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp, AlertTriangle, CheckCircle2, Clock, FileWarning, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const SlaAnalyticsPage: React.FC = () => {
  const districtData = [
    { district: 'Pune', apps: 420, avgDays: 14, breachCount: 8 },
    { district: 'Thane', apps: 310, avgDays: 12, breachCount: 4 },
    { district: 'C. Sambhajinagar', apps: 240, avgDays: 16, breachCount: 7 },
    { district: 'Palghar', apps: 195, avgDays: 11, breachCount: 2 },
    { district: 'Nagpur', apps: 180, avgDays: 13, breachCount: 3 },
    { district: 'Nashik', apps: 155, avgDays: 10, breachCount: 1 }
  ];

  const docErrorData = [
    { error: 'Name Mismatch on Report', count: 42, percentage: '36%', fill: '#EF4444' },
    { error: 'Blurry / Low-Res Scan', count: 31, percentage: '26%', fill: '#F59E0B' },
    { error: 'Certificate Validity Expired', count: 27, percentage: '23%', fill: '#8B5CF6' },
    { error: 'Missing Signature or Seal', count: 18, percentage: '15%', fill: '#3B82F6' }
  ];

  const totalErrors = docErrorData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Department SLA & Processing Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 font-medium">
            Statewide approval performance, district distribution, document error trends, and SLA bottleneck metrics.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: District-wise Application Volume */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">District-wise Application Volume & Avg Clearance Days</h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200">
              Statewide Summary
            </span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="apps" name="Total Applications" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDays" name="Avg Clearance Days" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Document Rejection / Flag Reasons */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Top Document Rejection / Flag Reasons</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold text-[10px]">
              {totalErrors} Flagged Docs
            </span>
          </div>

          {/* Visual Breakdown Cards List + Interactive Progress Bars */}
          <div className="space-y-3 pt-2">
            {docErrorData.map((item) => (
              <div key={item.error} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                    {item.error}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-xs">{item.count} Cases</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px]">
                      {item.percentage}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700" 
                    style={{ width: item.percentage, backgroundColor: item.fill }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* District Data Table with Crisp High Contrast Text */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span>Maharashtra District Clearance Breakdown</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Updated Live from Department Portal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="py-3.5 px-5">District</th>
                <th className="py-3.5 px-5">Total Applications</th>
                <th className="py-3.5 px-5">Avg Clearance Time</th>
                <th className="py-3.5 px-5">SLA Breaches</th>
                <th className="py-3.5 px-5">SLA Compliance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 text-slate-900 dark:text-slate-100 font-bold">
              {districtData.map(d => (
                <tr key={d.district} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="py-3.5 px-5 font-black text-slate-900 dark:text-white text-sm">{d.district}</td>
                  <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-slate-100">{d.apps}</td>
                  <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-slate-100">{d.avgDays} Days</td>
                  <td className="py-3.5 px-5 font-black text-rose-500 dark:text-rose-400 text-sm">{d.breachCount}</td>
                  <td className="py-3.5 px-5 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {Math.round(((d.apps - d.breachCount) / d.apps) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

