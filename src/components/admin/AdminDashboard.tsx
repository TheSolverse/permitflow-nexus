import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Sliders, Bell, Activity, ShieldCheck, Building2, Gift, BarChart3 } from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab, rules } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Admin Header (Clean Light Theme) */}
      <div className="bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
            <span>State Single Window Admin Console (MAITRI Core)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Administration</h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Rules engine governance, user role access control & system analytics.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Registered Users</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">3,420</div>
          <div className="text-emerald-700 font-bold text-[10px] mt-1">+12% this month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Active Projects</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">1,850</div>
          <div className="text-blue-700 font-semibold text-[10px] mt-1">Across 36 districts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Active Officers</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">142</div>
          <div className="text-amber-700 font-semibold text-[10px] mt-1">5 Departments</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-400 font-bold uppercase text-[10px]">Active Approval Rules</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">{rules.length}</div>
          <div className="text-purple-700 font-semibold text-[10px] mt-1">MAITRI Engine</div>
        </div>
      </div>

      {/* Admin Quick Control Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <button
          onClick={() => setActiveTab('admin-rules')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold border border-purple-200">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-purple-800">Rules Engine Management</h3>
          <p className="text-xs text-slate-500">Configure sector rules, fee structures, prerequisite dependencies & statutory SLAs.</p>
        </button>

        <button
          onClick={() => setActiveTab('admin-notifications')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold border border-blue-200">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-800">Notification Centre</h3>
          <p className="text-xs text-slate-500">Manage alert templates & dispatch settings for Email, SMS & WhatsApp.</p>
        </button>

        <button
          onClick={() => setActiveTab('admin-audit')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-800">Audit Log Trail</h3>
          <p className="text-xs text-slate-500">Inspect tamper-proof user activity, application status transitions & IP logs.</p>
        </button>

      </div>

      {/* Users & Roles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-900">
          Platform User Roles Registry
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Organization / Department</th>
              <th className="py-3 px-4">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {INITIAL_USERS.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                <td className="py-3 px-4 text-slate-600">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'OFFICER' ? 'bg-blue-100 text-blue-800' :
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-700">{u.organization || u.department || 'N/A'}</td>
                <td className="py-3 px-4 text-slate-500">{u.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
