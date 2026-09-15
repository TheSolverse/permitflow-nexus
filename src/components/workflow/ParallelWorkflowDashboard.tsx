import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitMerge, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Calendar, 
  Building2, 
  UserCheck, 
  Search, 
  Filter, 
  ChevronRight, 
  Sliders, 
  TrendingUp,
  AlertCircle,
  Building,
  Zap,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { t } from '../../utils/translations';
import { ApprovalStatus, ParallelPermissionItem } from '../../types';

export const ParallelWorkflowDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeProject, 
    projects, 
    setActiveProjectId, 
    parallelPermissions, 
    updateParallelPermissionStatus, 
    raiseParallelPermissionQuery,
    respondToParallelPermissionQuery,
    triggerParallelAutoRouting,
    calculateParallelProgress,
    language,
    auditLogs
  } = useApp();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ParallelPermissionItem | null>(null);
  
  // Modals state
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showQueryModal, setShowQueryModal] = useState<boolean>(false);
  const [showRespondModal, setShowRespondModal] = useState<boolean>(false);
  const [selectedQueryId, setSelectedQueryId] = useState<string>('');

  // Form inputs
  const [newStatusInput, setNewStatusInput] = useState<ApprovalStatus>('Under Review');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [inspectionDateInput, setInspectionDateInput] = useState<string>('');
  const [queryCategoryInput, setQueryCategoryInput] = useState<string>('Document Clarification');
  const [queryTextInput, setQueryTextInput] = useState<string>('');
  const [queryDueDateInput, setQueryDueDateInput] = useState<string>(new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
  const [responseTextInput, setResponseTextInput] = useState<string>('');

  // Calculate progress formula: Progress = (Approved permissions / Total required permissions) * 100
  const progressMetrics = calculateParallelProgress(activeProject.id);
  const currentProjectPermissions = parallelPermissions.filter(p => p.projectId === activeProject.id);

  // Departments present in this project
  const departmentsList = Array.from(new Set(currentProjectPermissions.map(p => p.department)));

  // Role auto-filter default for Officers
  React.useEffect(() => {
    if (currentUser.role === 'OFFICER' && currentUser.department) {
      // Find exact or matching department key
      const match = departmentsList.find(d => d.toLowerCase().includes(currentUser.department!.toLowerCase()) || currentUser.department!.toLowerCase().includes(d.toLowerCase()));
      if (match) {
        setSelectedDeptFilter(match);
      }
    }
  }, [currentUser]);

  // Filtered permissions
  const filteredPermissions = currentProjectPermissions.filter(item => {
    const matchesDept = selectedDeptFilter === 'ALL' || item.department === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || item.status === selectedStatusFilter;
    const matchesSearch = searchQuery === '' || 
      item.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  // Department counts breakdown
  const statusCounts = {
    approved: currentProjectPermissions.filter(p => p.status === 'Approved').length,
    underReview: currentProjectPermissions.filter(p => p.status === 'Under Review' || p.status === 'Submitted').length,
    queryRaised: currentProjectPermissions.filter(p => p.status === 'Query Raised').length,
    inspectionRequired: currentProjectPermissions.filter(p => p.status === 'Inspection Required' || p.status === 'Inspection Scheduled').length,
    delayed: currentProjectPermissions.filter(p => p.status === 'Delayed').length,
    blocked: currentProjectPermissions.filter(p => p.status === 'Blocked by Dependency').length,
    total: currentProjectPermissions.length
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Approved
          </span>
        );
      case 'Under Review':
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            Under Review (Parallel)
          </span>
        );
      case 'Query Raised':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Query Raised
          </span>
        );
      case 'Inspection Required':
      case 'Inspection Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Inspection Required
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Delayed (SLA Alert)
          </span>
        );
      case 'Blocked by Dependency':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            Blocked by Dependency
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-800">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const handleOpenStatusModal = (item: ParallelPermissionItem) => {
    setSelectedItem(item);
    setNewStatusInput(item.status);
    setRemarksInput(item.remarks || '');
    setInspectionDateInput(item.inspectionDate || '');
    setShowStatusModal(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      updateParallelPermissionStatus(selectedItem.id, newStatusInput, remarksInput, inspectionDateInput);
      setShowStatusModal(false);
    }
  };

  const handleOpenQueryModal = (item: ParallelPermissionItem) => {
    setSelectedItem(item);
    setQueryCategoryInput('Document Clarification');
    setQueryTextInput('');
    setShowQueryModal(true);
  };

  const handleSaveQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && queryTextInput.trim()) {
      raiseParallelPermissionQuery(selectedItem.id, queryCategoryInput, queryTextInput, queryDueDateInput);
      setShowQueryModal(false);
    }
  };

  const handleOpenRespondModal = (item: ParallelPermissionItem, queryId: string) => {
    setSelectedItem(item);
    setSelectedQueryId(queryId);
    setResponseTextInput('');
    setShowRespondModal(true);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem && selectedQueryId && responseTextInput.trim()) {
      respondToParallelPermissionQuery(selectedItem.id, selectedQueryId, responseTextInput);
      setShowRespondModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
              <span>State Single Window Parallel Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('parallelCoordinationTitle', language)}
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90 font-medium">
              {t('parallelCoordinationSubtitle', language)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Switcher */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-300 ml-2" />
              <select
                value={activeProject.id}
                onChange={(e) => setActiveProjectId(e.target.value)}
                aria-label="Select active business project"
                className="bg-transparent text-xs font-bold text-white focus:outline-none pr-3 cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.businessName} ({p.sector})
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-Route Trigger Button */}
            <button
              onClick={() => triggerParallelAutoRouting(activeProject.id)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{t('triggerAutoRouting', language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Formula & Stat Metrics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Formula Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#16261C] rounded-2xl p-6 border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#60826A] dark:text-[#68BA7F]">
                {t('overallProgress', language)}
              </div>
              <div className="text-2xl font-black text-[#253D2C] dark:text-white mt-0.5 flex items-baseline gap-2">
                <span>{progressMetrics.progressPercentage}% Completed</span>
                <span className="text-xs text-[#60826A] dark:text-[#A3D4B3] font-semibold">
                  ({progressMetrics.approvedCount} of {progressMetrics.totalRequired} Permissions Approved)
                </span>
              </div>
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-[#EAF7ED] dark:bg-[#1E3326] border border-[#2E6F40]/30 text-[#2E6F40] dark:text-[#68BA7F] flex items-center justify-center font-black text-xl shadow-inner">
              {progressMetrics.progressPercentage}%
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#EAF7ED] dark:bg-[#1E3326] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#D4EEDC] dark:border-[#253D2C]">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-[#2E6F40] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${progressMetrics.progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#60826A] dark:text-[#A3D4B3] font-medium">
              <span>0% (Submitted)</span>
              <span>50% (Parallel Processing)</span>
              <span>100% (Fully Approved)</span>
            </div>
          </div>

          {/* Mathematical Formula Box */}
          <div className="p-3.5 rounded-xl bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#2A4736] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#253D2C] dark:text-emerald-200 font-bold">
              <TrendingUp className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
              <span>{t('formulaLabel', language)}</span>
            </div>
            <div className="font-mono text-xs bg-white dark:bg-[#101D14] px-3 py-1.5 rounded-lg border border-[#D4EEDC] dark:border-[#253D2C] text-[#2E6F40] dark:text-[#68BA7F] font-bold shadow-xs">
              Progress = ( {progressMetrics.approvedCount} Approved / {progressMetrics.totalRequired} Total ) × 100 = {progressMetrics.progressPercentage}%
            </div>
          </div>
        </div>

        {/* Status Count Breakdown Grid */}
        <div className="bg-white dark:bg-[#16261C] rounded-2xl p-5 border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm flex flex-col justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-[#60826A] dark:text-[#68BA7F] mb-3">
            Parallel Status Breakdown
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200">
              <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Approved</div>
              <div className="text-lg font-black">{statusCounts.approved}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Under Review</div>
              <div className="text-lg font-black">{statusCounts.underReview}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
              <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Queries Open</div>
              <div className="text-lg font-black">{statusCounts.queryRaised}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200">
              <div className="text-xs font-medium text-purple-700 dark:text-purple-400">Inspections</div>
              <div className="text-lg font-black">{statusCounts.inspectionRequired}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Blocked Prereq</div>
              <div className="text-lg font-black">{statusCounts.blocked}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
              <div className="text-xs font-medium text-rose-700 dark:text-rose-400">Delayed (SLA)</div>
              <div className="text-lg font-black">{statusCounts.delayed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-4 border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#60826A] dark:text-[#68BA7F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by approval name, department, officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs text-[#253D2C] dark:text-[#E8F7ED] focus:outline-none focus:border-[#2E6F40]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#60826A]" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              aria-label="Filter by department"
              className="bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-xs font-semibold text-[#253D2C] dark:text-[#E8F7ED] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments ({departmentsList.length})</option>
              {departmentsList.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              aria-label="Filter by approval status"
              className="bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-xs font-semibold text-[#253D2C] dark:text-[#E8F7ED] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review / Parallel</option>
              <option value="Query Raised">Query Raised</option>
              <option value="Inspection Required">Inspection Required</option>
              <option value="Blocked by Dependency">Blocked by Dependency</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Department Matrix Table */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-[#D4EEDC] dark:border-[#253D2C] bg-[#F4FAF6] dark:bg-[#1A2E22] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#2E6F40] dark:text-[#68BA7F]">
            <Layers className="w-4 h-4 text-[#2E6F40]" />
            <span>Active Parallel Department Clearance Matrix</span>
          </div>
          <div className="text-xs text-[#60826A] dark:text-[#A3D4B3] font-bold">
            Showing {filteredPermissions.length} of {currentProjectPermissions.length} Permissions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#132219] text-[#60826A] dark:text-[#68BA7F] uppercase tracking-wider font-extrabold border-b border-[#D4EEDC] dark:border-[#253D2C]">
                <th className="py-3 px-4">Permission / Licence</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Inspection / Queries</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4EEDC] dark:divide-[#253D2C]">
              {filteredPermissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No permissions found for selected filter criteria. Try clearing filters or click "Trigger Parallel Auto-Routing".
                  </td>
                </tr>
              ) : (
                filteredPermissions.map((item) => {
                  const isBlocked = item.status === 'Blocked by Dependency';

                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-[#F4FAF6] dark:hover:bg-[#1A2E22] transition-colors ${
                        isBlocked ? 'bg-slate-50/50 dark:bg-slate-900/20' : ''
                      }`}
                    >
                      {/* Name & Category */}
                      <td className="py-4 px-4 font-semibold text-[#253D2C] dark:text-white max-w-xs">
                        <div className="font-bold text-xs">{item.approvalName}</div>
                        <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3] mt-0.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                            {item.category}
                          </span>
                          {item.submittedDate && (
                            <span>Submitted: {item.submittedDate}</span>
                          )}
                        </div>

                        {/* If Blocked, show list of Blocking Prerequisite approvals */}
                        {isBlocked && item.blockedBy && item.blockedBy.length > 0 && (
                          <div className="mt-1.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[10px] text-amber-900 dark:text-amber-300">
                            <span className="font-bold">⚠️ Blocked by Prerequisite:</span>
                            <ul className="list-disc list-inside mt-0.5">
                              {item.blockedBy.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4 font-medium text-[#253D2C] dark:text-[#D1E8DA]">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#68BA7F] shrink-0" />
                          <span className="font-bold">{item.department}</span>
                        </div>
                      </td>

                      {/* Officer */}
                      <td className="py-4 px-4 text-[#253D2C] dark:text-[#D1E8DA]">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <div>
                            <div className="font-bold">{item.assignedOfficer}</div>
                            {item.officerEmail && (
                              <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3]">{item.officerEmail}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status)}
                        {item.remarks && (
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs line-clamp-1 italic">
                            "{item.remarks}"
                          </div>
                        )}
                      </td>

                      {/* Inspection / Queries */}
                      <td className="py-4 px-4 text-[11px] text-[#253D2C] dark:text-[#D1E8DA]">
                        {item.inspectionDate ? (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold">
                            <Calendar className="w-3 h-3 text-purple-600" />
                            <span>{item.inspectionDate}</span>
                          </div>
                        ) : item.openQueries && item.openQueries.length > 0 ? (
                          <div className="space-y-1">
                            {item.openQueries.map(q => (
                              <div key={q.id} className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                                <div className="font-bold text-amber-900 dark:text-amber-300 text-[10px]">
                                  Q: {q.queryCategory}
                                </div>
                                <div className="text-[10px] text-amber-800 dark:text-amber-400 truncate">
                                  {q.queryText}
                                </div>
                                {currentUser.role === 'ENTREPRENEUR' && (
                                  <button
                                    onClick={() => handleOpenRespondModal(item, q.id)}
                                    className="mt-1 px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold hover:bg-amber-500 cursor-pointer"
                                  >
                                    Respond to Query
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">None Pending</span>
                        )}
                      </td>

                      {/* SLA Deadline */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-xs">{item.slaDeadlineDate}</div>
                        <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3]">
                          {item.slaDaysRemaining > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {item.slaDaysRemaining} days left
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">SLA Expired</span>
                          )}
                        </div>
                      </td>

                      {/* Actions Menu */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Officer/Admin Update Status Action */}
                          {(currentUser.role === 'OFFICER' || currentUser.role === 'ADMIN') && (
                            <button
                              onClick={() => handleOpenStatusModal(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#2E6F40] hover:bg-[#255933] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>Update</span>
                            </button>
                          )}

                          {/* Raise Query Action */}
                          {(currentUser.role === 'OFFICER' || currentUser.role === 'ADMIN') && (
                            <button
                              onClick={() => handleOpenQueryModal(item)}
                              className="px-2 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              Query
                            </button>
                          )}

                          {/* Entrepreneur View Detail */}
                          {currentUser.role === 'ENTREPRENEUR' && (
                            <button
                              onClick={() => handleOpenStatusModal(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#F4FAF6] dark:bg-[#1A2E22] hover:bg-[#EAF7ED] dark:hover:bg-[#253D2C] border border-[#D4EEDC] dark:border-[#253D2C] text-[#2E6F40] dark:text-[#68BA7F] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Dependency Graph Visualizer */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-6 border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-[#253D2C] dark:text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
              Parallel Execution Tracks & Prerequisite Dependency Map
            </h2>
            <p className="text-xs text-[#60826A] dark:text-[#A3D4B3]">
              Visual breakdown of simultaneous independent clearances vs legally gated prerequisite approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Parallel Independent Track Box */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                Track A: Simultaneous Parallel Clearances
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                No Legal Prerequisite
              </span>
            </div>
            
            <div className="space-y-2">
              {currentProjectPermissions.filter(p => p.dependencies.length === 0).map(p => (
                <div key={p.id} className="p-2.5 rounded-lg bg-white dark:bg-[#101D14] border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#253D2C] dark:text-white">{p.approvalName}</span>
                    <div className="text-[10px] text-[#60826A] dark:text-[#A3D4B3]">{p.department}</div>
                  </div>
                  {getStatusBadge(p.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Dependent Prerequisite Track Box */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Track B: Gated Prerequisite Clearances
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                Unblocks Upon Prerequisite Grant
              </span>
            </div>

            <div className="space-y-2">
              {currentProjectPermissions.filter(p => p.dependencies.length > 0).map(p => (
                <div key={p.id} className="p-2.5 rounded-lg bg-white dark:bg-[#101D14] border border-amber-100 dark:border-amber-900/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#253D2C] dark:text-white">{p.approvalName}</span>
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1">
                    <span>Prerequisites required:</span>
                    <span className="font-bold underline">{p.dependencies.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Trail for Parallel Workflow */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-6 border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <h2 className="text-sm font-extrabold text-[#253D2C] dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
            Workflow Execution Audit Log Trail
          </h2>
          <span className="text-xs text-[#60826A] dark:text-[#A3D4B3] font-bold">Tamper-Proof Audit Trail</span>
        </div>

        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {auditLogs.slice(0, 6).map(log => (
            <div key={log.id} className="p-3 rounded-xl bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-[#253D2C] dark:text-white flex items-center gap-2">
                  <span>{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#2E6F40]/10 text-[#2E6F40] dark:text-[#68BA7F] font-bold">
                    {log.user} ({log.role})
                  </span>
                </div>
                <div className="text-[11px] text-[#60826A] dark:text-[#A3D4B3]">{log.details}</div>
              </div>
              <div className="text-[10px] text-gray-400 font-mono shrink-0 ml-4">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: UPDATE STATUS & INSPECTION MODAL */}
      {/* ---------------------------------------------------- */}
      {showStatusModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Update Permission Status: {selectedItem.approvalName}
              </h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Department Officer Action Status
                </label>
                <select
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value as ApprovalStatus)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl font-bold text-[#253D2C] dark:text-white"
                >
                  <option value="Under Review">Under Review / Parallel Processing</option>
                  <option value="Approved">Approved (Grant Clearance)</option>
                  <option value="Inspection Required">Inspection Required / Scheduled</option>
                  <option value="Query Raised">Query Raised</option>
                  <option value="Delayed">Delayed (SLA Alert)</option>
                  <option value="Blocked by Dependency">Blocked by Dependency</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {(newStatusInput === 'Inspection Required' || newStatusInput === 'Inspection Scheduled') && (
                <div>
                  <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                    Inspection Schedule Date & Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-09-22 11:00 AM"
                    value={inspectionDateInput}
                    onChange={(e) => setInspectionDateInput(e.target.value)}
                    className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Officer Scrutiny Remarks & Audit Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed technical evaluation or certificate approval remarks..."
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#255933]"
                >
                  Save Status & Unblock Dependents
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: RAISE OFFICER QUERY MODAL */}
      {/* ---------------------------------------------------- */}
      {showQueryModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Raise Department Query: {selectedItem.approvalName}
              </h3>
              <button 
                onClick={() => setShowQueryModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Query Category
                </label>
                <select
                  value={queryCategoryInput}
                  onChange={(e) => setQueryCategoryInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl font-bold"
                >
                  <option value="Document Clarification">Document Clarification</option>
                  <option value="Technical Specification">Technical Specification</option>
                  <option value="Water / Emission Test Report">Water / Emission Test Report</option>
                  <option value="Site Layout Plan Discrepancy">Site Layout Plan Discrepancy</option>
                  <option value="Fee Payment Clarification">Fee Payment Clarification</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Detailed Query Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify the exact missing document or technical discrepancy for the entrepreneur..."
                  value={queryTextInput}
                  onChange={(e) => setQueryTextInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Response Due Date
                </label>
                <input
                  type="date"
                  value={queryDueDateInput}
                  onChange={(e) => setQueryDueDateInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQueryModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500"
                >
                  Issue Department Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: RESPOND TO QUERY MODAL */}
      {/* ---------------------------------------------------- */}
      {showRespondModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Submit Response to Query: {selectedItem.approvalName}
              </h3>
              <button 
                onClick={() => setShowRespondModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Entrepreneur Clarification & Response Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide clarification or reference the uploaded document in Document Centre..."
                  value={responseTextInput}
                  onChange={(e) => setResponseTextInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRespondModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#255933]"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
