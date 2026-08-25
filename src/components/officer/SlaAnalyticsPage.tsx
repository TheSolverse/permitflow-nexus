import React from 'react';
import { BarChart3, PieChart, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell } from 'recharts';

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
    { error: 'Name Mismatch', count: 42, fill: '#EF4444' },
    { error: 'Blurry / Low-Res Scan', count: 31, fill: '#F59E0B' },
    { error: 'Certificate Expired', count: 27, fill: '#8B5CF6' },
    { error: 'Missing Signature/Seal', count: 18, fill: '#3B82F6' }
  ];

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Department SLA & Processing Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Statewide approval performance, district distribution, document error trends, and SLA bottleneck metrics.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: District-wise Application Volume */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">District-wise Application Volume & Avg Days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="apps" name="Total Applications" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDays" name="Avg Clearance Days" fill="#FF9933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Document OCR Error Frequency */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top Document Rejection / Flag Reasons</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docErrorData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={(entry: any) => `${entry.error} (${((entry.percent || 0) * 100).toFixed(0)}%)`}
                >
                  {docErrorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* District Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-900 dark:text-white">
          Maharashtra District Clearance Breakdown
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Total Applications</th>
              <th className="py-3 px-4">Avg Clearance Time</th>
              <th className="py-3 px-4">SLA Breaches</th>
              <th className="py-3 px-4">SLA Compliance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {districtData.map(d => (
              <tr key={d.district} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{d.district}</td>
                <td className="py-3 px-4">{d.apps}</td>
                <td className="py-3 px-4 font-semibold">{d.avgDays} Days</td>
                <td className="py-3 px-4 text-red-600 font-bold">{d.breachCount}</td>
                <td className="py-3 px-4 font-bold text-emerald-600">
                  {Math.round(((d.apps - d.breachCount) / d.apps) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
