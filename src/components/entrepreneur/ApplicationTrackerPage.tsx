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
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'Under Review':
      case 'Submitted':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'Query Raised':
      case 'Documents Needed':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'Inspection Scheduled':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Unified Application Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status, officer assignments & SLA countdowns for <strong className="text-slate-800 dark:text-slate-200">{activeProject.businessName}</strong>.
          </p>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl border font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-mh-navy text-white border-mh-navy shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search App ID or approval..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
            No applications match the selected filter.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs">
                    {app.appId}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{app.approvalName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    SLA: {app.slaDaysRemaining}d remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Department:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{app.department}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Submission Date:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{app.submissionDate}</div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Officer Assigned:</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{app.officerAssigned || 'Desk Review Officer'}</div>
                </div>
              </div>

              {/* Action Banner */}
              {app.status === 'Query Raised' && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Officer raised technical query regarding ETP drawings. Response required.</span>
                  </div>
                  <button
                    onClick={() => setSelectedAppDetail(app)}
                    className="px-3 py-1 rounded-lg bg-amber-600 text-white font-bold shrink-0 hover:bg-amber-700"
                  >
                    Respond Now
                  </button>
                </div>
              )}

              {/* Card Footer */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 text-[11px]">
                  Last timeline update: {app.timeline[app.timeline.length - 1]?.timestamp}
                </span>

                <button
                  onClick={() => setSelectedAppDetail(app)}
                  className="px-4 py-1.5 rounded-xl bg-mh-navy text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-1"
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
