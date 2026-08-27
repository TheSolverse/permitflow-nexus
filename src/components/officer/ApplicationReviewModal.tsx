import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApprovalStatus, DocumentItem } from '../../types';
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
  Eye
} from 'lucide-react';
import { OfficerDocumentViewerModal } from './OfficerDocumentViewerModal';

interface Props {
  app: Application;
  onClose: () => void;
}

export const ApplicationReviewModal: React.FC<Props> = ({ app, onClose }) => {
  const { updateApplicationStatus, raiseOfficerQuery, scheduleInspection, currentUser, documents } = useApp();

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
            <div className="space-y-4">
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

              {/* Action Decision Form */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white text-xs">Officer Final Determination & Remarks:</div>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter official officer approval notes, sanction conditions, or rejection reasons..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                />
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleRejectApp}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    onClick={handleApproveApp}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Application</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS & AI OCR */}
          {activeSubTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Submitted Documents & AI Pre-Screening Findings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Official documents uploaded by applicant <strong className="text-slate-700 dark:text-slate-200">{app.businessName}</strong>
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {documents.filter(d => (app.documentIds && app.documentIds.includes(d.id)) || (d.projectId === app.projectId)).length} Documents Attached
                </span>
              </div>
              
              <div className="space-y-3">
                {documents.filter(d => (app.documentIds && app.documentIds.includes(d.id)) || (d.projectId === app.projectId)).length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No documents uploaded for this application yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Applicant will attach mandatory certificates upon submission.</p>
                  </div>
                ) : (
                  documents
                    .filter(d => (app.documentIds && app.documentIds.includes(d.id)) || (d.projectId === app.projectId))
                    .map((d) => (
                      <div key={d.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{d.docName}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{d.category} • Uploaded {d.uploadDate} • Size: {d.fileSize || '1.5 MB'}</div>
                          
                          {d.aiValidationResult?.issues && d.aiValidationResult.issues.length > 0 && (
                            <div className="mt-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] font-semibold border border-rose-200">
                              <strong>AI Flag:</strong> {d.aiValidationResult.issues[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
                              setSelectedPreviewDoc(d);
                            }}
                            className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 shadow-xs cursor-pointer"
                          >
                            Approve Doc
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedPreviewDoc(d);
                            }}
                            className="px-3 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 shadow-xs cursor-pointer"
                          >
                            Reject Doc
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Officer Document Inspection & Preview Modal Popup */}
          {selectedPreviewDoc && (
            <OfficerDocumentViewerModal 
              document={selectedPreviewDoc}
              onClose={() => setSelectedPreviewDoc(null)}
              onApprove={(docId) => {
                setSelectedPreviewDoc(null);
              }}
              onReject={(docId) => {
                setSelectedPreviewDoc(null);
              }}
            />
          )}

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
                          <span className="font-bold text-xs text-amber-800 dark:text-amber-300">{q.category}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${q.status === 'RESPONDED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                            {q.status === 'RESPONDED' ? '✓ Responded by Applicant' : '⏳ Pending Response'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-800 dark:text-slate-200 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40">
                          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase mb-1">Officer Query ({q.dueDate ? `Due: ${q.dueDate}` : ''})</div>
                          <p>{q.question}</p>
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
