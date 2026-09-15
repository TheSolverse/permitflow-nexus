import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  HelpCircle, 
  Calendar, 
  AlertCircle, 
  UserCheck, 
  Building, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  Search,
  Filter,
  Check,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { ApprovalStatus, ParallelPermissionItem, Application } from '../../types';
import { ApplicationReviewModal } from './ApplicationReviewModal';

export const DepartmentOfficerDesk: React.FC = () => {
  const { 
    currentUser, 
    parallelPermissions, 
    applications,
    documents,
    officerApprovePermission, 
    officerRejectPermission, 
    officerRequestDocument, 
    officerScheduleInspection, 
    officerMarkDelayed,
    raiseParallelPermissionQuery
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<ParallelPermissionItem | null>(null);
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);

  // Active modal
  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | 'DOC_REQ' | 'QUERY' | 'INSPECTION' | 'DELAY' | null>(null);

  // Form inputs
  const [remarksInput, setRemarksInput] = useState('');
  const [docNameInput, setDocNameInput] = useState('');
  const [queryCategoryInput, setQueryCategoryInput] = useState('Document Clarification');
  const [queryTextInput, setQueryTextInput] = useState('');
  const [inspectionDateInput, setInspectionDateInput] = useState('');
  const [delayReasonInput, setDelayReasonInput] = useState('Inspection not completed');

  // Determine officer's department scoping
  const userDept = currentUser.department || '';
  const isMpcb = currentUser.role === 'OFFICER_MPCB' || userDept.includes('Pollution') || userDept.includes('MPCB');
  const isFire = currentUser.role === 'OFFICER_FIRE' || userDept.includes('Fire');
  const isDish = currentUser.role === 'OFFICER_DISH' || userDept.includes('Safety') || userDept.includes('DISH');
  const isMidc = currentUser.role === 'OFFICER_MIDC' || userDept.includes('MIDC') || userDept.includes('Infrastructure');
  const isMsedcl = currentUser.role === 'OFFICER_MSEDCL' || userDept.includes('Electricity') || userDept.includes('MSEDCL');
  const isFssai = currentUser.role === 'OFFICER_FSSAI' || userDept.includes('Food') || userDept.includes('FSSAI');

  // Filter permissions strictly assigned to THIS officer's department!
  const scopedPermissions = parallelPermissions.filter(item => {
    const dept = item.department.toLowerCase();
    if (currentUser.role === 'ADMIN') return true;
    if (isMpcb && (dept.includes('pollution') || dept.includes('mpcb'))) return true;
    if (isFire && dept.includes('fire')) return true;
    if (isDish && (dept.includes('safety') || dept.includes('dish') || dept.includes('labour'))) return true;
    if (isMidc && dept.includes('midc')) return true;
    if (isMsedcl && (dept.includes('electricity') || dept.includes('msedcl'))) return true;
    if (isFssai && (dept.includes('food') || dept.includes('fssai'))) return true;
    
    // Fallback match on department string
    if (currentUser.department && dept.includes(currentUser.department.toLowerCase())) return true;
    return false;
  });

  const filteredPermissions = scopedPermissions.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      item.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDocs = (item: ParallelPermissionItem) => {
    const existingApp = applications.find(a => 
      a.projectId === item.projectId && 
      (a.approvalId === item.approvalId || a.approvalName.toLowerCase().includes(item.approvalName.toLowerCase()))
    );

    if (existingApp) {
      setReviewingApp(existingApp);
    } else {
      const projDocIds = documents.filter(d => d.projectId === item.projectId).map(d => d.id);
      const docIdsToUse = item.documentIds && item.documentIds.length > 0 ? item.documentIds : projDocIds;

      const virtualApp: Application = {
        id: item.id,
        appId: `PFN-2026-${item.department.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        projectId: item.projectId,
        businessName: 'Applicant Enterprise',
        approvalId: item.approvalId,
        approvalName: item.approvalName,
        department: item.department,
        submissionDate: item.submittedDate || new Date().toISOString().split('T')[0],
        slaDeadlineDate: item.slaDeadlineDate,
        slaDaysRemaining: item.slaDaysRemaining,
        status: item.status,
        officerAssigned: item.assignedOfficer,
        timeline: [],
        queries: [],
        documentIds: docIdsToUse,
        riskScore: 25,
        remarks: item.remarks
      };
      setReviewingApp(virtualApp);
    }
  };

  const handleOpenAction = (item: ParallelPermissionItem, modalType: 'APPROVE' | 'REJECT' | 'DOC_REQ' | 'QUERY' | 'INSPECTION' | 'DELAY') => {
    setSelectedItem(item);
    setActiveModal(modalType);
    setRemarksInput('');
    setDocNameInput('');
    setQueryTextInput('');
    setInspectionDateInput(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0] + ' 11:00 AM');
    setDelayReasonInput('Inspection not completed');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !activeModal) return;

    if (activeModal === 'APPROVE') {
      officerApprovePermission(selectedItem.id, remarksInput || 'Permission granted after technical scrutiny.');
    } else if (activeModal === 'REJECT') {
      officerRejectPermission(selectedItem.id, remarksInput || 'Application rejected due to statutory non-compliance.');
    } else if (activeModal === 'DOC_REQ') {
      officerRequestDocument(selectedItem.id, docNameInput || 'Document Clarification', remarksInput);
    } else if (activeModal === 'QUERY') {
      raiseParallelPermissionQuery(selectedItem.id, queryCategoryInput, queryTextInput, new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
    } else if (activeModal === 'INSPECTION') {
      officerScheduleInspection(selectedItem.id, inspectionDateInput, 'Industrial Plot Site');
    } else if (activeModal === 'DELAY') {
      officerMarkDelayed(selectedItem.id, delayReasonInput, remarksInput);
    }

    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer Review Modal */}
      {reviewingApp && (
        <ApplicationReviewModal
          app={reviewingApp}
          onClose={() => setReviewingApp(null)}
        />
      )}

      {/* Officer Desk Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Officer Processing Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold">{currentUser.department || 'Department Officer Review Desk'}</h1>
          <p className="text-xs text-emerald-100/90 mt-1 font-medium">
            Assigned Officer: <strong>{currentUser.name}</strong> • Processing approvals strictly scoped to your department.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-xs space-y-1">
          <div className="font-extrabold text-emerald-300">Department Queue Stats</div>
          <div className="flex items-center gap-3">
            <span>Pending Review: <strong>{scopedPermissions.filter(p => p.status === 'Under Review' || p.status === 'Submitted').length}</strong></span>
            <span>Delayed: <strong className="text-rose-300">{scopedPermissions.filter(p => p.status === 'Delayed').length}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl p-4 border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned permissions by name or applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs text-[#253D2C] dark:text-[#E8F7ED] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-xs font-bold text-[#253D2C] dark:text-white cursor-pointer"
          >
            <option value="ALL">All Statuses ({scopedPermissions.length})</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="More Information Needed">More Info Needed</option>
            <option value="Inspection Pending">Inspection Pending</option>
            <option value="Approved">Approved</option>
            <option value="Delayed">Delayed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Scoped Permissions Table */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F4FAF6] dark:bg-[#1A2E22] border-b border-[#D4EEDC] dark:border-[#253D2C] flex items-center justify-between text-xs font-extrabold text-[#2E6F40] dark:text-[#68BA7F]">
          <span>Assigned Department Permissions Queue ({filteredPermissions.length})</span>
          <span className="text-gray-500 font-normal">Department Scope Active</span>
        </div>

        <div className="divide-y divide-[#D4EEDC] dark:divide-[#253D2C]">
          {filteredPermissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              No permissions found in your department queue matching selected filters.
            </div>
          ) : (
            filteredPermissions.map(item => (
              <div key={item.id} className="p-5 hover:bg-[#F4FAF6] dark:hover:bg-[#1A2E22] transition-colors space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#253D2C] dark:text-white">{item.approvalName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-3 font-medium">
                      <span>Assigned Officer: <strong className="text-gray-800 dark:text-gray-200">{item.assignedOfficer}</strong></span>
                      <span>•</span>
                      <span>SLA Deadline: <strong className="text-gray-800 dark:text-gray-200">{item.slaDeadlineDate}</strong></span>
                      <span>•</span>
                      <span>Pending With: <strong className="text-amber-700 dark:text-amber-400">{item.pendingWith || 'Department'}</strong></span>
                    </div>
                  </div>

                  {/* Officer Action Menu Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleViewDocs(item)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      title="View entrepreneur uploaded files & audit findings"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Docs</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'APPROVE')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'DOC_REQ')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Request Doc</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'INSPECTION')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Inspection</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'DELAY')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Flag Delay</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'REJECT')}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {item.delayReason && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span><strong>Delay Reason:</strong> {item.delayReason}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* OFFICER ACTION MODAL */}
      {activeModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Officer Action: {activeModal} — {selectedItem.approvalName}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
              
              {activeModal === 'DOC_REQ' && (
                <div>
                  <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                    Requested Document Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NABL Water Quality Lab Report"
                    value={docNameInput}
                    onChange={(e) => setDocNameInput(e.target.value)}
                    className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs font-bold"
                  />
                </div>
              )}

              {activeModal === 'INSPECTION' && (
                <div>
                  <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                    Inspection Schedule Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={inspectionDateInput}
                    onChange={(e) => setInspectionDateInput(e.target.value)}
                    className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs font-bold"
                  />
                </div>
              )}

              {activeModal === 'DELAY' && (
                <div>
                  <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                    Specify Delay Reason (Shown to Entrepreneur)
                  </label>
                  <select
                    value={delayReasonInput}
                    onChange={(e) => setDelayReasonInput(e.target.value)}
                    className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl font-bold"
                  >
                    <option value="Inspection not completed">Inspection not completed</option>
                    <option value="Technical committee review pending">Technical committee review pending</option>
                    <option value="Third-party lab test verification delayed">Third-party lab test verification delayed</option>
                    <option value="Site access weather delay">Site access weather delay</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                  Officer Remarks & Audit Log Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter scrutiny notes to log into audit trail..."
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#255933]"
                >
                  Confirm & Save Audit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
