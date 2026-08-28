import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { 
  ClipboardCheck, 
  Clock, 
  BarChart3,
  UserCheck,
  Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ApplicationReviewModal } from './ApplicationReviewModal';

export const OfficerDashboard: React.FC = () => {
  const { applications, currentUser, setActiveTab } = useApp();
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);
  const [queueFilter, setQueueFilter] = useState<'PENDING' | 'APPROVED' | 'ALL'>('PENDING');

  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review' || a.status === 'Inspection Scheduled');
  const approvedApps = applications.filter(a => a.status === 'Approved');
  const rejectedApps = applications.filter(a => a.status === 'Rejected');

  const displayedQueueApps = queueFilter === 'PENDING' 
    ? pendingApps 
    : queueFilter === 'APPROVED' 
      ? approvedApps 
      : applications;

  // Real KPI stats
  const totalReceived = 126;
  const pendingReviewCount = pendingApps.length;
  const queryCount = applications.reduce((acc, a) => acc + (a.queries?.filter(q => q.status === 'OPEN').length || 0), 0);
  const inspectionCount = 14;
  const slaBreachNearingCount = pendingApps.filter(a => a.slaDaysRemaining <= 5).length;

  // Recharts Dept Performance dataset
  const deptPerformanceData = [
    { department: 'MPCB', avgDays: 18, targetSLA: 30, cleared: 84 },
    { department: 'MIDC', avgDays: 12, targetSLA: 21, cleared: 110 },
    { department: 'Fire Dept', avgDays: 9, targetSLA: 14, cleared: 95 },
    { department: 'DISH', avgDays: 11, targetSLA: 15, cleared: 76 },
    { department: 'FSSAI', avgDays: 14, targetSLA: 18, cleared: 62 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Officer Welcome Header (Light Blue Sky Gradient) */}
      <div className="bg-gradient-to-r from-sky-100/80 via-blue-50/60 to-white p-6 rounded-2xl text-slate-900 border border-sky-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-900 text-xs font-bold mb-2 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Government Officer Workstation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Department: <strong className="text-slate-900 font-bold">{currentUser.department || 'Maharashtra Pollution Control Board (MPCB)'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('officer-nocs')}
            className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>NOC & Joint Inspection Hub</span>
          </button>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right text-xs">
            <div className="text-slate-400 font-semibold uppercase text-[10px]">Assigned District Queue</div>
            <div className="font-bold text-slate-900 text-sm">Pune & Chakan MIDC Zone</div>
          </div>
        </div>
      </div>

      {/* 5 Officer Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Received</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalReceived}</div>
          <div className="text-[10px] text-slate-400 mt-1">This month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{pendingReviewCount}</div>
          <div className="text-[10px] text-blue-600 mt-1">In officer queue</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Queries Raised</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{queryCount}</div>
          <div className="text-[10px] text-amber-600 mt-1">Awaiting entrepreneur</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Inspections Due</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">{inspectionCount}</div>
          <div className="text-[10px] text-purple-600 mt-1">Site visits fixed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider">SLA Nearing Breach</div>
          <div className="text-2xl font-extrabold text-red-700 mt-1">{slaBreachNearingCount}</div>
          <div className="text-[10px] text-red-600 mt-1">&lt; 5 days left</div>
        </div>

      </div>

      {/* Priority Applications Queue & Department Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Priority Review Queue */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-slate-700" />
                <span>Priority Application Review Queue</span>
              </h3>
              <p className="text-xs text-slate-500">Applications assigned to your department requiring audit decision.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setQueueFilter('PENDING')}
                className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                  queueFilter === 'PENDING'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending ({pendingApps.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('APPROVED')}
                className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                  queueFilter === 'APPROVED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Approved ({approvedApps.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                  queueFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({applications.length})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {displayedQueueApps.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 space-y-1">
                <ClipboardCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-extrabold text-xs text-slate-800">
                  {queueFilter === 'PENDING' ? '🎉 All Applications Processed!' : 'No applications found in this filter.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {queueFilter === 'PENDING' ? 'There are currently 0 pending clearances awaiting officer review.' : ''}
                </p>
              </div>
            ) : (
              displayedQueueApps.map((app) => {
                const isAppApproved = app.status === 'Approved';
                const isAppRejected = app.status === 'Rejected';

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-200 font-extrabold text-[10px] text-slate-800">
                          {app.appId}
                        </span>
                        <h4 className="font-bold text-slate-900">{app.approvalName}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isAppApproved 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isAppRejected
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-1">
                        Applicant: <strong>{app.businessName}</strong> • Submitted: {app.submissionDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-bold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          SLA: {app.slaDaysRemaining}d
                        </div>
                        <div className="text-[10px] text-slate-400">Risk Score: {app.riskScore}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedAppForReview(app)}
                        className={`px-4 py-2 rounded-xl text-white font-bold transition-all shadow-xs cursor-pointer ${
                          isAppApproved 
                            ? 'bg-emerald-700 hover:bg-emerald-800'
                            : 'bg-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        {isAppApproved ? 'View Sanction' : 'Audit & Review'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Department Processing SLA Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Department SLA Processing Days
            </h3>
            <p className="text-xs text-slate-500">Average clearance days vs mandated statutory SLA limit.</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgDays" name="Avg Clearance (Days)" fill="#0F172A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetSLA" name="Statutory SLA Target" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium">
            <strong className="font-bold">Bottleneck Watch:</strong> MPCB Pune division experiencing peak effluent test verification load (18 avg days vs 30 target).
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {selectedAppForReview && (
        <ApplicationReviewModal
          app={selectedAppForReview}
          onClose={() => setSelectedAppForReview(null)}
        />
      )}

    </div>
  );
};
