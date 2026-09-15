import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  UserCheck, 
  Building, 
  Calendar, 
  Filter, 
  FileText, 
  HelpCircle, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Sparkles
} from 'lucide-react';
import { ApprovalStatus, ParallelPermissionItem } from '../../types';

export const SimplePermissionCardView: React.FC = () => {
  const { 
    activeProject, 
    projects, 
    setActiveProjectId, 
    parallelPermissions, 
    respondToParallelPermissionQuery,
    triggerParallelAutoRouting,
    currentUser,
    setActiveTab
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IN_PROGRESS' | 'APPROVED' | 'DELAYED' | 'ACTION_REQUIRED'>('ALL');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ParallelPermissionItem | null>(null);
  const [responseNotes, setResponseNotes] = useState<string>('');

  const userProjects = currentUser?.role === 'ENTREPRENEUR'
    ? projects.filter(p => !p.userId || p.userId === currentUser.id)
    : projects;

  const hasProject = Boolean(activeProject && activeProject.id && activeProject.id.trim().length > 0 && userProjects.length > 0);

  if (!hasProject) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 max-w-3xl mx-auto my-8 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            No Business Project Profile Created Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            To view individual clearance status cards and departmental progress trackers, please create your business project profile first.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new-project')}
          className="px-6 py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#CFFFDC]" />
          <span>+ Create New Business Project</span>
        </button>
      </div>
    );
  }

  const currentProjectPermissions = parallelPermissions.filter(p => p.projectId === activeProject.id);

  // Filter logic
  const filteredList = currentProjectPermissions.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'APPROVED') return item.status === 'Approved';
    if (activeFilter === 'DELAYED') return item.status === 'Delayed';
    if (activeFilter === 'ACTION_REQUIRED') return item.status === 'More Information Needed' || item.status === 'Query Raised' || item.pendingDocs.length > 0;
    if (activeFilter === 'IN_PROGRESS') return item.status === 'Submitted' || item.status === 'Under Review' || item.status === 'Inspection Pending' || item.status === 'Inspection Required' || item.status === 'Blocked by Dependency';
    return true;
  });

  // Color badge styling
  const getColorIndicator = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
          label: 'Approved (Green)',
          icon: CheckCircle2
        };
      case 'Submitted':
      case 'Under Review':
        return {
          bg: 'bg-blue-500',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
          label: 'Under Review (Blue)',
          icon: Clock
        };
      case 'More Information Needed':
      case 'Query Raised':
      case 'Inspection Pending':
      case 'Inspection Required':
      case 'Inspection Scheduled':
        return {
          bg: 'bg-amber-500',
          badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
          label: 'Action Required (Yellow)',
          icon: AlertTriangle
        };
      case 'Delayed':
      case 'Rejected':
        return {
          bg: 'bg-red-500',
          badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300',
          label: 'Delayed / Rejected (Red)',
          icon: AlertCircle
        };
      default:
        return {
          bg: 'bg-slate-400',
          badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
          label: status,
          icon: Lock
        };
    }
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleOpenResponse = (item: ParallelPermissionItem) => {
    setSelectedItem(item);
    setResponseNotes('');
    setShowResponseModal(true);
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && responseNotes.trim()) {
      const qId = selectedItem.openQueries && selectedItem.openQueries.length > 0 ? selectedItem.openQueries[0].id : 'q-1';
      respondToParallelPermissionQuery(selectedItem.id, qId, responseNotes);
      setShowResponseModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Entrepreneur Clearances Tracker</span>
          </div>
          <h1 className="text-2xl font-black">My Business Approvals & Licences</h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            Track real-time permission status, assigned officers, pending actions, and SLA deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 text-xs flex items-center gap-2">
            <span className="font-bold text-emerald-300">Project:</span>
            <select
              value={activeProject.id}
              onChange={(e) => setActiveProjectId(e.target.value)}
              aria-label="Select business project"
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.businessName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => triggerParallelAutoRouting(activeProject.id)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Route All</span>
          </button>
        </div>
      </div>

      {/* Colour Code Legend & Simple Filter Tabs */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-4 border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs space-y-4">
        
        {/* Simple Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <div className="font-extrabold text-[#253D2C] dark:text-white flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
            <span>Status Colour Key:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              Blue: Under Review
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Yellow: Action Required / Pending
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Green: Approved
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Red: Delayed or Rejected
            </span>
          </div>
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#2E6F40] text-white shadow-xs'
                : 'bg-[#F4FAF6] dark:bg-[#1A2E22] text-[#253D2C] dark:text-[#E8F7ED] hover:bg-[#EAF7ED]'
            }`}
          >
            All Clearances ({currentProjectPermissions.length})
          </button>

          <button
            onClick={() => setActiveFilter('IN_PROGRESS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'IN_PROGRESS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-[#F4FAF6] dark:bg-[#1A2E22] text-[#253D2C] dark:text-[#E8F7ED] hover:bg-[#EAF7ED]'
            }`}
          >
            In Progress ({currentProjectPermissions.filter(p => p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Inspection Pending' || p.status === 'Blocked by Dependency').length})
          </button>

          <button
            onClick={() => setActiveFilter('ACTION_REQUIRED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ACTION_REQUIRED'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-[#F4FAF6] dark:bg-[#1A2E22] text-[#253D2C] dark:text-[#E8F7ED] hover:bg-[#EAF7ED]'
            }`}
          >
            Action Required ({currentProjectPermissions.filter(p => p.status === 'More Information Needed' || p.status === 'Query Raised' || p.pendingDocs.length > 0).length})
          </button>

          <button
            onClick={() => setActiveFilter('APPROVED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#F4FAF6] dark:bg-[#1A2E22] text-[#253D2C] dark:text-[#E8F7ED] hover:bg-[#EAF7ED]'
            }`}
          >
            Approved ({currentProjectPermissions.filter(p => p.status === 'Approved').length})
          </button>

          <button
            onClick={() => setActiveFilter('DELAYED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'DELAYED'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-[#F4FAF6] dark:bg-[#1A2E22] text-[#253D2C] dark:text-[#E8F7ED] hover:bg-[#EAF7ED]'
            }`}
          >
            Delayed ({currentProjectPermissions.filter(p => p.status === 'Delayed').length})
          </button>
        </div>
      </div>

      {/* Permission Cards Grid */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-[#16261C] rounded-2xl p-8 text-center text-gray-500 border border-[#D4EEDC] dark:border-[#253D2C]">
            No permission applications match the selected filter tab.
          </div>
        ) : (
          filteredList.map((item) => {
            const colorMeta = getColorIndicator(item.status);
            const StatusIcon = colorMeta.icon;
            const isDelayed = item.status === 'Delayed';
            const isExpanded = expandedCardId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-[#16261C] rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs overflow-hidden transition-all hover:shadow-md"
              >
                
                {/* DELAYED ALERT BANNER */}
                {isDelayed && (
                  <div className="bg-rose-600 text-white px-5 py-2 text-xs font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        <strong>Delayed</strong> — Pending with {item.department} — Reason: {item.delayReason || 'Departmental inspection not completed'}
                      </span>
                    </div>
                    <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded font-mono">SLA Alert</span>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  
                  {/* REQUESTED FORMAT HEADER: Permission Name | Department | Officer | Status | Pending With | Deadline */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4EEDC] dark:border-[#253D2C] pb-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${colorMeta.bg} shrink-0`} />
                        <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                          {item.approvalName}
                        </h3>
                      </div>

                      {/* FORMAT SUMMARY BAR */}
                      <div className="text-xs font-bold text-[#60826A] dark:text-[#A3D4B3] flex flex-wrap items-center gap-2 mt-1">
                        <span>{item.department}</span>
                        <span>•</span>
                        <span>Officer: <strong className="text-[#253D2C] dark:text-white">{item.assignedOfficer}</strong></span>
                        <span>•</span>
                        <span>Deadline: <strong className="text-[#253D2C] dark:text-white">{item.slaDeadlineDate}</strong></span>
                      </div>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${colorMeta.badgeClass}`}>
                        <StatusIcon className="w-4 h-4" />
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* 6-POINT ENTREPRENEUR SUMMARY GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-[#F4FAF6] dark:bg-[#1A2E22] p-3.5 rounded-xl border border-[#D4EEDC] dark:border-[#2A4736]">
                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">1. Permission</div>
                      <div className="font-bold text-[#253D2C] dark:text-white truncate">{item.approvalName}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">2. Department</div>
                      <div className="font-bold text-[#253D2C] dark:text-white truncate">{item.department.split(' ')[0]}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">3. Officer</div>
                      <div className="font-bold text-[#253D2C] dark:text-white truncate">{item.assignedOfficer}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">4. Status</div>
                      <div className="font-bold text-[#253D2C] dark:text-white truncate">{item.status}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">5. Pending With</div>
                      <div className="font-bold text-amber-700 dark:text-amber-400 truncate">{item.pendingWith || 'Department'}</div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-[#60826A] dark:text-[#68BA7F]">6. Deadline</div>
                      <div className="font-bold text-[#253D2C] dark:text-white">{item.slaDeadlineDate}</div>
                    </div>
                  </div>

                  {/* ACTION REQUIRED BOX IF ANY */}
                  {(item.status === 'More Information Needed' || item.status === 'Query Raised' || item.pendingDocs.length > 0) && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-extrabold text-xs">Action Needed from Entrepreneur</div>
                          <div className="text-[11px] font-medium mt-0.5">
                            {item.pendingAction || 'Please respond to officer query or upload missing document.'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenResponse(item)}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                      >
                        Respond Now
                      </button>
                    </div>
                  )}

                  {/* BOTTOM EXPAND HISTORY TOGGLE */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="text-[11px] text-[#60826A] dark:text-[#A3D4B3]">
                      Submitted: {item.submittedDate} • Last Updated: {item.lastUpdatedDateTime || item.lastUpdatedDate}
                    </div>

                    <button
                      onClick={() => toggleExpandCard(item.id)}
                      className="text-[#2E6F40] dark:text-[#68BA7F] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide History' : 'View History & Details'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* EXPANDED ACTIVITY HISTORY LOG */}
                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-[#101D14] border border-[#D4EEDC] dark:border-[#253D2C] space-y-3 text-xs">
                      <div className="font-extrabold text-[#253D2C] dark:text-white flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#2E6F40]" />
                        <span>Complete Permission Activity Log</span>
                      </div>

                      <div className="space-y-2">
                        {item.activityHistory && item.activityHistory.length > 0 ? (
                          item.activityHistory.map(act => (
                            <div key={act.id} className="p-2.5 rounded-lg bg-white dark:bg-[#16261C] border border-gray-200 dark:border-gray-800 flex justify-between items-start">
                              <div>
                                <div className="font-bold text-[#253D2C] dark:text-white">
                                  {act.action} <span className="text-gray-500 font-normal">by {act.actor} ({act.department})</span>
                                </div>
                                {act.notes && <div className="text-[11px] text-gray-600 dark:text-gray-400 italic mt-0.5">"{act.notes}"</div>}
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono">{act.timestamp}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-[11px]">No activity history logged yet.</div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RESPONSE MODAL */}
      {showResponseModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Respond to Action: {selectedItem.approvalName}
              </h3>
              <button onClick={() => setShowResponseModal(false)} className="text-gray-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Clarification Response & Document Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter clarification response or document details for the department officer..."
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#255933]"
                >
                  Submit Response to Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
