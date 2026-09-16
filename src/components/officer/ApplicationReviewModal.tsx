import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApprovalStatus, DocumentItem } from '../../types';
import { INITIAL_DOCUMENTS } from '../../data/mockData';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  ShieldAlert, 
  Send, 
  Sparkles, 
  Clock, 
  User, 
  Building2,
  Lock,
  Eye,
  Upload,
  Plus
} from 'lucide-react';
import { OfficerDocumentViewerModal } from './OfficerDocumentViewerModal';

interface Props {
  app: Application;
  onClose: () => void;
}

export const ApplicationReviewModal: React.FC<Props> = ({ app, onClose }) => {
  const { updateApplicationStatus, raiseOfficerQuery, scheduleInspection, currentUser, documents, uploadDocument, updateDocumentStatus } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'details' | 'docs' | 'query' | 'inspect'>('details');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentItem | null>(null);

  // Form states
  const [remarks, setRemarks] = useState('');
  const [queryCategory, setQueryCategory] = useState('ETP Washwater & Discharge Capacity');
  const [queryText, setQueryText] = useState('Please submit revised ETP engineering design calculations proving zero liquid discharge capability during peak monsoon harvest season.');
  const [queryDueDate, setQueryDueDate] = useState('2026-09-05');

  // Inspection state
  const [inspectionType, setInspectionType] = useState<'Pre-Setup Site Audit' | 'Fire Safety Compliance' | 'Pollution Emission Audit' | 'DISH Factory Safety Check' | 'FSSAI Hygiene Inspection'>('Pre-Setup Site Audit');
  const [scheduledDate, setScheduledDate] = useState('2026-09-08 11:00 AM');
  const [isJoint, setIsJoint] = useState(true);

  const handleApproveApp = () => {
    updateApplicationStatus(app.id, 'Approved', remarks || 'All technical parameters and safety documentation verified and approved.');
    onClose();
  };

  const handleRejectApp = () => {
    updateApplicationStatus(app.id, 'Rejected', remarks || 'Application rejected due to non-compliance with statutory safety distances.');
    onClose();
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    raiseOfficerQuery(app.id, queryCategory, queryText, queryDueDate);
    onClose();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInspection({
      applicationId: app.id,
      approvalName: app.approvalName,
      businessName: app.businessName,
      department: currentUser.department || app.department,
      inspectionType,
      scheduledDate,
      location: 'Chakan MIDC Phase II Site 42',
      officerDetails: {
        name: currentUser.name,
        designation: 'Senior Inspecting Officer',
        contact: currentUser.phone || '+91 98220 11988'
      },
      requiredDocs: ['Approved Drawings', 'Stability Cert', 'ETP Plan'],
      status: 'SCHEDULED',
      isJointInspection: isJoint,
      participatingDepts: isJoint ? ['MPCB', 'DISH', 'Fire Services'] : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Officer Review Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/40">
                {app.appId}
              </span>
              <h2 className="text-base font-extrabold text-white">{app.approvalName} Review Desk</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Applicant: <strong className="text-amber-400">{app.businessName}</strong> • Department: {app.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('details')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'details' ? 'bg-mh-navy text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            1. Applicant & Risk Profile
          </button>
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'docs' ? 'bg-mh-navy text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            2. Documents & AI OCR Flags
          </button>
          <button
            onClick={() => setActiveSubTab('query')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'query' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            3. Raise Query
          </button>
          <button
            onClick={() => setActiveSubTab('inspect')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'inspect' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            4. Schedule Inspection
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: DETAILS & RISK */}
          {activeSubTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Application Status</div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{app.status}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">SLA Target</div>
                  <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400 mt-1">{app.slaDaysRemaining} Days Left</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Risk Score</div>
                  <div className="font-extrabold text-sm text-blue-600 dark:text-blue-400 mt-1">{app.riskScore} / 100 (Medium)</div>
                </div>
              </div>

              {/* Applicant & Entity Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Applicant Enterprise Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">Legal Business Name: </span>
                    <strong className="text-slate-900 dark:text-slate-100">{app.businessName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Clearance Requested: </span>
                    <strong className="text-slate-900 dark:text-slate-100">{app.approvalName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Issuing Department: </span>
                    <strong className="text-slate-900 dark:text-slate-100">{app.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Submission Date: </span>
                    <strong className="text-slate-900 dark:text-slate-100">{app.submissionDate}</strong>
                  </div>
                </div>
              </div>

              {/* Next Step Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-emerald-900 dark:text-emerald-200 text-xs">Verification Step 1 of 2 Complete</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Please check and verify applicant proofs in the Documents & AI OCR Flags tab before granting approval.</div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('docs')}
                  className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <span>Proceed to Document Verification</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS & AI OCR */}
          {activeSubTab === 'docs' && (() => {
            const localSaved: DocumentItem[] = (() => {
              try {
                const s = localStorage.getItem('pfn_documents');
                return s ? JSON.parse(s) : [];
              } catch { return []; }
            })();
            
            // Strictly scope documents pool to live documents and project ID
            const pool = documents.length > 0 ? documents : localSaved;
            const projectScopedPool = pool.filter(d => !app.projectId || !d.projectId || d.projectId === app.projectId);

            // 1. Direct matched documents strictly linked to this specific application
            let displayDocs = projectScopedPool.filter(d => 
              app.documentIds && app.documentIds.length > 0 && app.documentIds.includes(d.id)
            );

            // 2. If no explicit documentIds are matched, show documents uploaded for THIS project only
            if (displayDocs.length === 0) {
              const matchedProjDocs = projectScopedPool.filter(d => d.projectId === app.projectId);
              displayDocs = matchedProjDocs;
            }

            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Submitted Documents & AI Pre-Screening Findings</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Official certificates & proofs submitted for <strong className="text-slate-700 dark:text-slate-200">{app.businessName}</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-slate-300 dark:border-slate-600 shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Upload Proof Attachment</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => {
                              const dataUrl = re.target?.result as string;
                              uploadDocument(file.name.replace(/\.[^/.]+$/, ''), 'Supporting Proof', file, undefined, dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>

                    <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#2E6F40] dark:text-[#CFFFDC] border border-[#D4EEDC] dark:border-[#253D2C]">
                      {displayDocs.length} Documents Attached
                    </span>
                  </div>
                </div>
                
                {/* Documents List */}
                <div className="space-y-3">
                  {displayDocs.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No documents uploaded for this application yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Applicant will attach mandatory certificates upon submission.</p>
                    </div>
                  ) : (
                    displayDocs.map((d) => {
                      const isApproved = d.status === 'Valid';
                      const isFlagged = d.status === 'Expired' || d.status === 'Name Mismatch' || d.status === 'Blurry / Unreadable';

                      return (
                        <div key={d.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                          <div className="flex items-start gap-3">
                            {d.fileUrl && (d.fileUrl.startsWith('data:image') || d.fileUrl.startsWith('blob:')) ? (
                              <img 
                                src={d.fileUrl} 
                                alt={d.docName} 
                                className="w-12 h-12 object-cover rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs shrink-0 cursor-pointer hover:opacity-90"
                                onClick={() => setSelectedPreviewDoc(d)}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#2E6F40] dark:text-[#CFFFDC] flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
                                <FileText className="w-6 h-6" />
                              </div>
                            )}

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{d.docName}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
                                  isFlagged ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' :
                                  'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  {isApproved ? '✓ Verified & Approved' : isFlagged ? '✗ Flagged / Rejected' : d.status}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  AI Confidence: {d.aiValidationResult?.confidence || 96}%
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500 font-semibold">
                                {d.category} • Uploaded: {d.uploadDate || '2026-08-27'} • Size: {d.fileSize || '1.2 MB'}
                              </div>
                              
                              {d.aiValidationResult?.issues && d.aiValidationResult.issues.length > 0 ? (
                                <div className="mt-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-semibold border border-rose-200">
                                  <strong>AI Flag:</strong> {d.aiValidationResult.issues[0]}
                                </div>
                              ) : (
                                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Verified by AI OCR Pre-Screening</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto justify-end">
                            <button 
                              type="button"
                              onClick={() => setSelectedPreviewDoc(d)}
                              className="px-3.5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <Eye className="w-4 h-4 text-[#CFFFDC]" />
                              <span>View Document</span>
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                updateDocumentStatus(d.id, 'Valid');
                              }}
                              className={`px-3 py-2 rounded-xl font-extrabold text-xs shadow-xs cursor-pointer transition-all ${
                                isApproved 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isApproved ? '✓ Approved' : 'Approve Doc'}
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => {
                                updateDocumentStatus(d.id, isFlagged ? 'Valid' : 'Name Mismatch');
                              }}
                              className={`px-3 py-2 rounded-xl font-extrabold text-xs shadow-xs cursor-pointer transition-all ${
                                isFlagged
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-rose-600 text-white hover:bg-rose-700'
                              }`}
                            >
                              {isFlagged ? '✗ Flagged' : 'Reject Doc'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Final Determination & Remarks Decision Box (Moved after checking all documents) */}
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Officer Final Determination & Action Decision</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Final Step</span>
                  </div>

                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter official officer approval notes, sanction conditions, or rejection reasons..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white text-xs"
                  />
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleRejectApp}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApproveApp}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Application</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* Officer Document Inspection & Preview Modal Popup */}
          {selectedPreviewDoc && (() => {
            const localSaved: DocumentItem[] = (() => {
              try {
                const s = localStorage.getItem('pfn_documents');
                return s ? JSON.parse(s) : [];
              } catch { return []; }
            })();
            const combinedPool = Array.from(
              new Map([...INITIAL_DOCUMENTS, ...localSaved, ...documents].map(d => [d.id, d])).values()
            );
            const displayDocs = combinedPool.filter(d => 
              app.documentIds && app.documentIds.length > 0 && app.documentIds.includes(d.id)
            );
            const activeList = displayDocs.length > 0 ? displayDocs : combinedPool.filter(d => d.projectId === app.projectId).slice(0, 3);
            const currentIdx = activeList.findIndex(d => d.id === selectedPreviewDoc.id);

            return (
              <OfficerDocumentViewerModal 
                document={selectedPreviewDoc}
                onClose={() => setSelectedPreviewDoc(null)}
                onApprove={(docId) => {
                  updateDocumentStatus(docId, 'Valid');
                }}
                onReject={(docId) => {
                  updateDocumentStatus(docId, 'Name Mismatch');
                }}
                currentIndex={currentIdx !== -1 ? currentIdx : 0}
                totalDocs={activeList.length}
                hasNext={currentIdx !== -1 && currentIdx < activeList.length - 1}
                onNext={() => {
                  if (currentIdx !== -1 && currentIdx < activeList.length - 1) {
                    setSelectedPreviewDoc(activeList[currentIdx + 1]);
                  } else {
                    setSelectedPreviewDoc(null);
                  }
                }}
              />
            );
          })()}

          {/* TAB 3: RAISE QUERY & VIEW RESPONSES */}
          {activeSubTab === 'query' && (
            <div className="space-y-6">
              
              {/* Existing Queries and Responses History */}
              {app.queries && app.queries.length > 0 && (
                <div className="space-y-3">
                  <div className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Department Queries & Applicant Responses ({app.queries.length})</span>
                  </div>

                  {app.queries.map((q) => {
                    const respDoc = q.responseDocName 
                      ? documents.find(d => d.docName.toLowerCase().includes(q.responseDocName!.toLowerCase()) || d.id === q.responseDocName)
                      : null;

                    return (
                      <div key={q.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-amber-800 dark:text-amber-300">{q.queryCategory || 'Technical Clarification'}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${q.status === 'RESPONDED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {q.status === 'RESPONDED' ? '✓ Responded by Applicant' : '⏳ Pending Response'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-800 dark:text-slate-200 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase mb-1">Officer Query ({q.dueDate ? `Due: ${q.dueDate}` : ''})</div>
                          <p>{q.queryText}</p>
                        </div>

                        {q.status === 'RESPONDED' && (
                          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                              <span>Applicant Official Clarification:</span>
                              <span>{q.responseDate || 'Received'}</span>
                            </div>
                            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                              "{q.responseText}"
                            </p>

                            {q.responseDocName && (
                              <div className="pt-2 flex items-center justify-between border-t border-emerald-200/80 dark:border-emerald-800/80 gap-2">
                                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                                  📎 Attached Clarification File: <strong>{q.responseDocName}</strong>
                                </span>
                                {respDoc && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPreviewDoc(respDoc)}
                                    className="px-3 py-1.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#CFFFDC]" />
                                    <span>View Response File</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form to Raise New Query */}
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-300 dark:border-amber-800 space-y-3">
                  <div className="font-bold text-sm text-amber-900 dark:text-amber-200">Raise Formal Department Query</div>
                  
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Query Template Category</label>
                    <select
                      value={queryCategory}
                      onChange={(e) => setQueryCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="ETP Washwater & Discharge Capacity">ETP Washwater & Discharge Capacity</option>
                      <option value="Fire Hydrant Pressure Drawing Revision">Fire Hydrant Pressure Drawing Revision</option>
                      <option value="Structural Engineer Certificate Clarification">Structural Engineer Certificate Clarification</option>
                      <option value="NABL Water Quality Test Addendum">NABL Water Quality Test Addendum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Query Instructions & Specific Message</label>
                    <textarea
                      rows={3}
                      required
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="Specify the exact documentation, revised layout drawing, or technical parameters required from the entrepreneur..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Response Due Date</label>
                    <input
                      type="date"
                      required
                      value={queryDueDate}
                      onChange={(e) => setQueryDueDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>Issue Official Department Query</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SCHEDULE INSPECTION */}
          {activeSubTab === 'inspect' && (
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-300 dark:border-purple-800 space-y-3">
                <div className="font-bold text-sm text-purple-900 dark:text-purple-200">Schedule Physical Site Inspection</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Inspection Type</label>
                    <select
                      value={inspectionType}
                      onChange={(e) => setInspectionType(e.target.value as any)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                    >
                      <option value="Pre-Setup Site Audit">Pre-Setup Site Audit</option>
                      <option value="Fire Safety Compliance">Fire Safety Compliance Audit</option>
                      <option value="Pollution Emission Audit">Pollution Emission Audit</option>
                      <option value="DISH Factory Safety Check">DISH Factory Safety Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Scheduled Date & Time</label>
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      placeholder="2026-09-08 11:00 AM"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isJoint}
                    onChange={(e) => setIsJoint(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Schedule as Joint Department Inspection</div>
                    <div className="text-[10px] text-slate-400">Invites MPCB, DISH, and Fire Officers to inspect on the same date</div>
                  </div>
                </label>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Dispatch Inspection Schedule</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
