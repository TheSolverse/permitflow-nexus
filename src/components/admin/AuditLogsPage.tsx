import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, ShieldCheck, Search, Filter } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredLogs = roleFilter === 'ALL'
    ? auditLogs
    : auditLogs.filter(l => l.role === roleFilter);

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">System Audit Log Trail</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tamper-proof audit logs for all application submissions, officer queries, approvals & status changes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold"
          >
            <option value="ALL">ALL Roles</option>
            <option value="ENTREPRENEUR">Entrepreneur</option>
            <option value="OFFICER">Officer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Action Performed</th>
                <th className="py-3 px-4 font-bold">App ID</th>
                <th className="py-3 px-4 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{log.user}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.role === 'OFFICER' ? 'bg-blue-100 text-blue-800' :
                      log.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{log.applicationId || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
