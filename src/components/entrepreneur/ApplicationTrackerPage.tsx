import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApprovalStatus } from '../../types';
import { 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  Filter, 
  Building2,
  Calendar
} from 'lucide-react';
import { ApplicationDetailModal } from './ApplicationDetailModal';

export const ApplicationTrackerPage: React.FC = () => {
  const { applications, activeProject, selectedAppDetail, setSelectedAppDetail } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = [
    'ALL',
    'Submitted',
    'Under Review',
    'Query Raised',
    'Inspection Scheduled',
    'Approved',
    'Rejected',
    'Renewal Due'
  ];

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = app.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Under Review':
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Query Raised':
      case 'Documents Needed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Inspection Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Unified Application Tracker</h1>
          <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
            Real-time status, officer assignments & SLA countdowns for <strong className="text-slate-900 dark:text-white font-extrabold">{activeProject.businessName}</strong>.
          </p>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {statuses.map(st => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2E6F40] text-white border-[#2E6F40] shadow-xs'
                    : 'bg-[#F8FCF9] dark:bg-slate-900 text-[#192A1E] dark:text-[#E8F7ED] border-[#D4EEDC] dark:border-slate-700 hover:bg-[#E8F7ED]'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search App ID or approval..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E6F40] font-semibold"
          />
        </div>
      </div>

      {/* Applications Cards Grid - White Background Boxes */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs shadow-xs">
            No applications match the selected filter.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-extrabold text-xs border border-slate-200">
                    {app.appId}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">{app.approvalName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    SLA: {app.slaDaysRemaining}d remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Department:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{app.department}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Submission Date:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{app.submissionDate}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Officer Assigned:</span>
                  <div className="font-extrabold text-slate-900 mt-0.5">{app.officerAssigned || 'Desk Review Officer'}</div>
                </div>
              </div>

              {/* Action Banner for Query Raised */}
              {app.status === 'Query Raised' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Officer raised technical query regarding ETP drawings. Response required.</span>
                  </div>
                  <button
                    onClick={() => setSelectedAppDetail(app)}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold shrink-0 shadow-xs cursor-pointer"
                  >
                    Respond Now
                  </button>
                </div>
              )}

              {/* Action Banner for Inspection Scheduled / Pending */}
              {(app.status === 'Inspection Scheduled' || app.status === 'Inspection Pending' || Boolean((app as any).inspectionDate)) && app.status !== 'Approved' && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-medium">
                    <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>
                      Site Inspection Scheduled: <strong>{(app as any).inspectionDate || 'Inspection Pending'}</strong> by {app.officerAssigned || app.department}.
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAppDetail(app)}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-extrabold shrink-0 shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>View Inspection Details</span>
                  </button>
                </div>
              )}

              {/* Card Footer */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">
                  Last timeline update: {app.timeline[app.timeline.length - 1]?.timestamp}
                </span>

                <button
                  onClick={() => setSelectedAppDetail(app)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer text-xs"
                >
                  <span>View Details & Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedAppDetail && (
        <ApplicationDetailModal
          app={selectedAppDetail}
          onClose={() => setSelectedAppDetail(null)}
        />
      )}

    </div>
  );
};
