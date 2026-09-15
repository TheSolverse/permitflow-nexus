import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Sliders, 
  Activity, 
  RefreshCw, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

export const AdminAssignmentConsole: React.FC = () => {
  const { 
    parallelPermissions, 
    updateParallelPermissionStatus, 
    triggerParallelAutoRouting,
    projects,
    auditLogs
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const officers = INITIAL_USERS.filter(u => u.role.startsWith('OFFICER') || u.role === 'OFFICER');

  const filteredPermissions = parallelPermissions.filter(p => {
    const matchesDept = selectedDept === 'ALL' || p.department === selectedDept;
    const matchesSearch = searchQuery === '' || 
      p.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Admin Assignment Console</span>
          </div>
          <h1 className="text-2xl font-extrabold">Department & Officer Permission Manager</h1>
          <p className="text-xs text-emerald-100/90 mt-1 font-medium">
            Manage government departments, authorized officer assignments, permissions, and routing rules.
          </p>
        </div>

        <button
          onClick={() => triggerParallelAutoRouting(projects[0]?.id)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-Trigger Auto-Routing</span>
        </button>
      </div>

      {/* Officers Registry Grid */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-5 border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <div className="font-extrabold text-sm text-[#253D2C] dark:text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
            <span>Authorized Department Officer Registry ({officers.length})</span>
          </div>
          <span className="text-xs text-emerald-700 font-bold">Active 8 Department Roles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {officers.map(off => (
            <div key={off.id} className="p-3 rounded-xl bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#2A4736] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0">
                {off.name.charAt(0)}
              </div>
              <div className="space-y-0.5 truncate">
                <div className="font-bold text-[#253D2C] dark:text-white truncate">{off.name}</div>
                <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3] truncate">{off.department}</div>
                <div className="text-[10px] font-mono text-gray-500 truncate">{off.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Application Permissions Management Table */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F4FAF6] dark:bg-[#1A2E22] border-b border-[#D4EEDC] dark:border-[#253D2C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="font-extrabold text-[#253D2C] dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#2E6F40]" />
            <span>Global Permissions & Officer Assignment Matrix</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Select department"
              className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-lg px-2.5 py-1.5 text-xs font-bold"
            >
              <option value="ALL">All Departments</option>
              <option value="Maharashtra Pollution Control Board (MPCB)">MPCB</option>
              <option value="Maharashtra Fire Services">Fire Department</option>
              <option value="Directorate of Industrial Safety & Health (DISH)">DISH Labour</option>
              <option value="MIDC Infrastructure & Planning">MIDC</option>
              <option value="Maharashtra State Electricity Distribution Co Ltd (MSEDCL)">MSEDCL Power</option>
              <option value="Food Safety & Standards Authority (FSSAI)">FSSAI Food</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#D4EEDC] dark:divide-[#253D2C] text-xs">
          {filteredPermissions.map(item => (
            <div key={item.id} className="p-4 hover:bg-[#F4FAF6] dark:hover:bg-[#1A2E22] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 max-w-md">
                <div className="font-bold text-[#253D2C] dark:text-white">{item.approvalName}</div>
                <div className="text-[11px] text-gray-500 font-medium">{item.department}</div>
                <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3]">
                  Assigned Officer: <strong className="text-gray-800 dark:text-gray-200">{item.assignedOfficer}</strong> • Pending: <strong className="text-amber-700 dark:text-amber-400">{item.pendingWith || 'Department'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {item.status}
                </span>

                <button
                  onClick={() => updateParallelPermissionStatus(item.id, 'Approved', 'Admin force approved.')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Admin Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
