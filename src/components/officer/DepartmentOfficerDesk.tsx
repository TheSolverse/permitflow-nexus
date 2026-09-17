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
  Eye,
  Award,
  FileCheck2
} from 'lucide-react';
import { ApprovalStatus, ParallelPermissionItem, Application } from '../../types';
import { ApplicationReviewModal } from './ApplicationReviewModal';
import { getPhaseNumber } from '../../utils/rulesEngine';
import { DigitalCertificateModal, CertificateData } from '../common/DigitalCertificateModal';

export const DepartmentOfficerDesk: React.FC = () => {
  const { 
    currentUser, 
    parallelPermissions, 
    applications,
    documents,
    projects,
    officerApprovePermission, 
    officerRejectPermission, 
    officerRequestDocument, 
    officerScheduleInspection, 
    officerMarkDelayed,
    raiseParallelPermissionQuery,
    issueDigitalCertificate
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<ParallelPermissionItem | null>(null);
  const [reviewingApp, setReviewingApp] = useState<Application | null>(null);
  const [viewingCert, setViewingCert] = useState<CertificateData | null>(null);

  // Active modal
  const [activeModal, setActiveModal] = useState<'APPROVE' | 'REJECT' | 'DOC_REQ' | 'QUERY' | 'INSPECTION' | 'DELAY' | 'CERT_ISSUE' | null>(null);

  // Form inputs
  const [remarksInput, setRemarksInput] = useState('');
  const [docNameInput, setDocNameInput] = useState('');
  const [queryCategoryInput, setQueryCategoryInput] = useState('Document Clarification');
  const [queryTextInput, setQueryTextInput] = useState('');
  const [inspectionDateInput, setInspectionDateInput] = useState('');
  const [delayReasonInput, setDelayReasonInput] = useState('Inspection not completed');
  const [certTypeInput, setCertTypeInput] = useState<'PROVISIONAL' | 'FINAL'>('FINAL');
  const [certTenureInput, setCertTenureInput] = useState<number>(3);
  const [certConditionsInput, setCertConditionsInput] = useState<string>('Standard compliance with Maharashtra Statutory industrial safety & environmental norms.');

  // Determine officer's department scoping
  const userDept = currentUser.department || '';
  const isMpcb = currentUser.role === 'OFFICER_MPCB' || userDept.includes('Pollution') || userDept.includes('MPCB');
  const isFire = currentUser.role === 'OFFICER_FIRE' || userDept.includes('Fire');
  const isDish = currentUser.role === 'OFFICER_DISH' || userDept.includes('Safety') || userDept.includes('DISH');
  const isMidc = currentUser.role === 'OFFICER_MIDC' || userDept.includes('MIDC') || userDept.includes('Infrastructure');
  const isMsedcl = currentUser.role === 'OFFICER_MSEDCL' || userDept.includes('Electricity') || userDept.includes('MSEDCL');
  const isFssai = currentUser.role === 'OFFICER_FSSAI' || userDept.includes('Food') || userDept.includes('FSSAI') || userDept.includes('FDA');
  const isMca = currentUser.role === 'OFFICER_MCA' || userDept.includes('Corporate Affairs') || userDept.includes('MCA') || userDept.includes('Registration Centre');

  // Filter permissions strictly assigned to THIS officer's department!
  const scopedPermissions = parallelPermissions.filter(item => {
    const dept = item.department.toLowerCase();
    if (currentUser.role === 'ADMIN') return true;
    if (isMpcb && (dept.includes('pollution') || dept.includes('mpcb'))) return true;
    if (isFire && dept.includes('fire')) return true;
    if (isDish && (dept.includes('safety') || dept.includes('dish') || dept.includes('labour'))) return true;
    if (isMidc && dept.includes('midc')) return true;
    if (isMsedcl && (dept.includes('electricity') || dept.includes('msedcl'))) return true;
    if (isFssai && (dept.includes('food') || dept.includes('fssai') || dept.includes('fda'))) return true;
    if (isMca && (dept.includes('corporate') || dept.includes('mca') || dept.includes('crc') || dept.includes('incorporation') || dept.includes('registration centre'))) return true;
    
    // Fallback match on department string
    if (currentUser.department && dept.includes(currentUser.department.toLowerCase())) return true;
    return false;
  });

  // Also include any submitted applications for this department
  const appsForDept = applications.filter(app => {
    const dept = (app.department || '').toLowerCase();
    if (currentUser.role === 'ADMIN') return true;
    if (isMpcb && (dept.includes('pollution') || dept.includes('mpcb'))) return true;
    if (isFire && dept.includes('fire')) return true;
    if (isDish && (dept.includes('safety') || dept.includes('dish') || dept.includes('labour'))) return true;
    if (isMidc && dept.includes('midc')) return true;
    if (isMsedcl && (dept.includes('electricity') || dept.includes('msedcl'))) return true;
    if (isFssai && (dept.includes('food') || dept.includes('fssai') || dept.includes('fda'))) return true;
    if (isMca && (dept.includes('corporate') || dept.includes('mca') || dept.includes('crc') || dept.includes('incorporation') || dept.includes('registration centre'))) return true;
    if (currentUser.department && dept.includes(currentUser.department.toLowerCase())) return true;
    return false;
  });

  const appDerivedPermissions: ParallelPermissionItem[] = appsForDept.map(app => ({
    id: app.id,
    projectId: app.projectId,
    approvalId: app.approvalId,
    approvalName: app.approvalName,
    department: app.department,
    category: 'Registration',
    assignedOfficer: app.officerAssigned || currentUser.name,
    officerEmail: currentUser.email,
    status: app.status,
    pendingWith: app.status === 'Approved' ? 'Completed' : 'Department Officer',
    pendingAction: app.status === 'Approved' ? 'Approval Granted' : 'Dossier Scrutiny & Verification',
    dateReceived: app.submissionDate || new Date().toISOString().split('T')[0],
    lastUpdatedDateTime: new Date().toLocaleString(),
    pendingDocs: [],
    queriesCount: app.queries?.length || 0,
    slaDeadlineDate: app.slaDeadlineDate,
    slaDaysRemaining: app.slaDaysRemaining || 15,
    dependencies: [],
    submittedDate: app.submissionDate,
    lastUpdatedDate: app.submissionDate,
    documentIds: app.documentIds,
    remarks: app.remarks
  }));

  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Deduplicate and filter permissions to ONLY those for existing projects
  const realSubmittedPermissions = [...scopedPermissions, ...appDerivedPermissions].filter(item => {
    const targetProj = projects.find(p => p.id === item.projectId);
    if (!targetProj) return false;
    return item.status !== 'Not Started';
  });

  const uniqueScopedPermissions = Array.from(
    new Map(realSubmittedPermissions.map(item => [`${item.projectId}_${(item.approvalId || item.approvalName).toLowerCase().trim()}`, item])).values()
  );

  const filteredPermissions = uniqueScopedPermissions.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesProject = projectFilter === 'ALL' || item.projectId === projectFilter;
    const targetProj = projects.find(p => p.id === item.projectId);
    const businessName = targetProj?.businessName || '';
    const matchesSearch = searchQuery === '' || 
      item.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesProject && matchesSearch;
  });

  const getStatusBadgeStyle = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700';
      case 'Delayed':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700';
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700';
      case 'More Information Needed':
      case 'Query Raised':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700';
      case 'Inspection Pending':
      case 'Inspection Scheduled':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700';
      case 'Under Review':
        return 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700';
      default:
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
    }
  };

  const handleViewDocs = (item: ParallelPermissionItem) => {
    const targetProj = projects.find(p => p.id === item.projectId);
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
        businessName: targetProj?.businessName || 'Applicant Enterprise',
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

  const handleOpenAction = (item: ParallelPermissionItem, modalType: 'APPROVE' | 'REJECT' | 'DOC_REQ' | 'QUERY' | 'INSPECTION' | 'DELAY' | 'CERT_ISSUE') => {
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

    const itemName = selectedItem.approvalName;
    const targetProj = projects.find(p => p.id === selectedItem.projectId);
    const enterpriseName = targetProj?.businessName || 'Enterprise';

    if (activeModal === 'APPROVE') {
      officerApprovePermission(selectedItem.id, remarksInput || 'Permission granted after technical scrutiny.');
      setActionSuccessMsg(`✓ Successfully Approved "${itemName}" for ${enterpriseName}. Status updated to Approved.`);
    } else if (activeModal === 'CERT_ISSUE') {
      const { certificateId } = issueDigitalCertificate(selectedItem.id, certTypeInput, certTenureInput, certConditionsInput);
      setActionSuccessMsg(`📜 Successfully issued ${certTypeInput} Digital Certificate (${certificateId}) for "${itemName}".`);
    } else if (activeModal === 'REJECT') {
      officerRejectPermission(selectedItem.id, remarksInput || 'Application rejected due to statutory non-compliance.');
      setActionSuccessMsg(`✕ Application "${itemName}" for ${enterpriseName} has been Rejected.`);
    } else if (activeModal === 'DOC_REQ') {
      officerRequestDocument(selectedItem.id, docNameInput || 'Document Clarification', remarksInput);
      setActionSuccessMsg(`📄 Document request dispatched for "${docNameInput || 'Document'}" to ${enterpriseName}.`);
    } else if (activeModal === 'QUERY') {
      raiseParallelPermissionQuery(selectedItem.id, queryCategoryInput, queryTextInput, new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
      setActionSuccessMsg(`❓ Technical query raised for "${itemName}".`);
    } else if (activeModal === 'INSPECTION') {
      officerScheduleInspection(selectedItem.id, inspectionDateInput, 'Industrial Plot Site');
      setActionSuccessMsg(`📅 Site inspection scheduled on ${inspectionDateInput} for "${itemName}".`);
    } else if (activeModal === 'DELAY') {
      officerMarkDelayed(selectedItem.id, delayReasonInput, remarksInput);
      setActionSuccessMsg(`⚠️ Delay flagged on "${itemName}" (${delayReasonInput}). Notified entrepreneur.`);
    }

    setActiveModal(null);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Feedback Banner */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-700 dark:text-emerald-300 font-extrabold hover:text-emerald-900">✕</button>
        </div>
      )}

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
            <span>Approved: <strong className="text-emerald-300">{scopedPermissions.filter(p => p.status === 'Approved').length}</strong></span>
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

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {projects.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                aria-label="Filter by project"
                className="bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-xs font-bold text-[#253D2C] dark:text-white cursor-pointer"
              >
                <option value="ALL">All Enterprises / Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.businessName}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 text-xs font-bold text-[#253D2C] dark:text-white cursor-pointer"
            >
              <option value="ALL">All Statuses ({uniqueScopedPermissions.length})</option>
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
            filteredPermissions.map(item => {
              const targetProj = projects.find(p => p.id === item.projectId);
              const businessName = targetProj?.businessName || 'Applicant Enterprise';
              const isApproved = item.status === 'Approved';
              const isDelayed = item.status === 'Delayed';
              const isRejected = item.status === 'Rejected';

              return (
                <div key={item.id} className="p-5 hover:bg-[#F4FAF6] dark:hover:bg-[#1A2E22] transition-colors space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-[#253D2C] dark:text-white">{item.approvalName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#2E6F40] text-white">
                          Phase {getPhaseNumber(item.approvalId)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${getStatusBadgeStyle(item.status)}`}>
                          {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                          {isDelayed && <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                          {isRejected && <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />}
                          <span>{item.status}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{businessName}</span>
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-3 font-medium">
                        <span>Assigned Officer: <strong className="text-gray-800 dark:text-gray-200">{item.assignedOfficer}</strong></span>
                        <span>•</span>
                        <span>SLA Deadline: <strong className="text-gray-800 dark:text-gray-200">{item.slaDeadlineDate}</strong></span>
                        <span>•</span>
                        <span>Pending With: <strong className={isApproved ? 'text-emerald-700 dark:text-emerald-400' : isDelayed ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}>{item.pendingWith || 'Department'}</strong></span>
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
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all ${
                        isApproved
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 shadow-md'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Approved ✓' : 'Approve'}</span>
                    </button>

                    {/* Certificate Actions for Approved Clearances */}
                    {isApproved && (
                      <>
                        <button
                          onClick={() => {
                            const certId = item.certificateId || `MH-2026-${(currentUser.department || 'STAT').substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
                            setViewingCert({
                              certificateId: certId,
                              approvalName: item.approvalName,
                              businessName: businessName,
                              department: item.department,
                              issuedDate: item.certificateIssuedDate || item.submittedDate || new Date().toISOString().split('T')[0],
                              expiryDate: item.certificateExpiryDate,
                              validityTenure: item.certificateValidityTenure || '3 Years',
                              certificateType: item.certificateType || 'FINAL',
                              officerName: item.assignedOfficer || currentUser.name,
                              officerDesignation: 'Competent Authority',
                              conditions: item.certificateConditions || 'Statutory compliance with Maharashtra single window norms.',
                              qrCodeData: item.certificateQrToken || `PFN-CERT:${certId}:${businessName}`
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                          title="View and print official digital certificate with scannable QR verification"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-300" />
                          <span>View Certificate</span>
                        </button>

                        <button
                          onClick={() => handleOpenAction(item, 'CERT_ISSUE')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                          title="Issue or renew official digital certificate"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Issue Certificate</span>
                        </button>
                      </>
                    )}

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
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all ${
                        isDelayed
                          ? 'bg-rose-700 text-white ring-2 ring-rose-400 shadow-md'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{isDelayed ? 'Delayed ⚠️' : 'Flag Delay'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'REJECT')}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                        isRejected
                          ? 'bg-red-700 text-white ring-2 ring-red-400'
                          : 'bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {isRejected ? 'Rejected ✕' : 'Reject'}
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
            );
          })
        )}
      </div>
    </div>

      {/* Digital Certificate Viewer Modal */}
      {viewingCert && (
        <DigitalCertificateModal
          isOpen={!!viewingCert}
          onClose={() => setViewingCert(null)}
          cert={viewingCert}
        />
      )}

      {/* OFFICER ACTION MODAL */}
      {activeModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
              <h3 className="text-base font-extrabold text-[#253D2C] dark:text-white">
                Officer Action: {activeModal === 'CERT_ISSUE' ? 'Issue Digital Certificate' : activeModal} — {selectedItem.approvalName}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
              
              {activeModal === 'CERT_ISSUE' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                        Certificate Category
                      </label>
                      <select
                        value={certTypeInput}
                        onChange={(e) => setCertTypeInput(e.target.value as 'PROVISIONAL' | 'FINAL')}
                        className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl font-bold"
                      >
                        <option value="FINAL">Final Statutory Certificate</option>
                        <option value="PROVISIONAL">Provisional NOC / Clearance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                        Validity Tenure
                      </label>
                      <select
                        value={certTenureInput}
                        onChange={(e) => setCertTenureInput(Number(e.target.value))}
                        className="w-full p-2.5 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl font-bold"
                      >
                        <option value={1}>1 Year</option>
                        <option value={3}>3 Years (Standard)</option>
                        <option value={5}>5 Years</option>
                        <option value={0}>Permanent / Indefinite</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#253D2C] dark:text-[#E8F7ED] mb-1">
                      Statutory Conditions & Covenants
                    </label>
                    <textarea
                      rows={2}
                      value={certConditionsInput}
                      onChange={(e) => setCertConditionsInput(e.target.value)}
                      className="w-full p-2 bg-[#F4FAF6] dark:bg-[#1A2E22] border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

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
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#255933] cursor-pointer shadow-xs"
                >
                  {activeModal === 'CERT_ISSUE' ? 'Sign & Issue Certificate' : 'Confirm & Save Audit Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
