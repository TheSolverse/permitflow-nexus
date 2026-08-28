import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, SmartChecklistItem } from '../../types';
import { INITIAL_APPROVAL_TYPES } from '../../data/mockData';
import { ApplyApprovalModal } from './ApplyApprovalModal';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  MessageSquareText, 
  Send, 
  FileText, 
  Building2, 
  ShieldCheck, 
  User as UserIcon,
  ChevronRight,
  Printer,
  Download,
  Award,
  RotateCcw
} from 'lucide-react';

interface Props {
  app: Application;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<Props> = ({ app, onClose }) => {
  const { respondToQuery, documents, setActiveTab } = useApp();
  const [responseText, setResponseText] = useState('');
  const [responseDocName, setResponseDocName] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isReapplyOpen, setIsReapplyOpen] = useState(false);

  const matchedApproval = INITIAL_APPROVAL_TYPES.find(a => a.id === app.approvalId || a.name === app.approvalName) || {
    id: app.approvalId || 'appr-custom',
    name: app.approvalName,
    department: app.department,
    whyRequired: `Statutory clearance application for ${app.approvalName}`,
    category: 'Clearance' as const,
    requiredDocs: ['Identity Proof / PAN Card', 'Premises Lease Deed / Layout', 'Technical Plan'],
    estimatedTimelineDays: 15,
    estimatedFee: '₹10,000',
    dependencies: [],
    riskImpact: 20
  };

  const reapplyItem: SmartChecklistItem = {
    ...matchedApproval,
    status: 'Not Started',
    canApply: true
  };

  const openQuery = app.queries.find(q => q.status === 'OPEN');

  const handlePrintCertificate = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!openQuery || !responseText) return;
    respondToQuery(openQuery.id, responseText, responseDocName || 'ETP_Flow_Diagram_Rev2.pdf');
    setResponseText('');
    setResponseDocName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                {app.appId}
              </span>
              <h2 className="text-base font-extrabold text-white">{app.approvalName}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Department: {app.department} • Applied for {app.businessName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* APPROVED SANCTION CERTIFICATE (Rendered ONLY when status === 'Approved') */}
          {app.status === 'Approved' && (
            <div className="bg-gradient-to-br from-emerald-50 via-[#F0FAF3] to-white dark:from-[#16261C] dark:to-[#1E3326] p-6 rounded-2xl border-2 border-[#2E6F40] shadow-lg space-y-5 text-slate-900 dark:text-white relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4EEDC] dark:border-[#2A4736]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#2E6F40] text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
                    <Award className="w-7 h-7 text-[#CFFFDC]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#2E6F40] dark:text-[#CFFFDC] font-extrabold text-[10px] uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3 h-3 text-[#2E6F40]" />
                      <span>Statutory Clearance Granted</span>
                    </div>
                    <h3 className="text-lg font-black text-[#253D2C] dark:text-white">
                      Official Digital License & Sanction Order
                    </h3>
                    <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3]">
                      Issued by <strong className="text-[#253D2C] dark:text-[#E8F7ED]">{app.department}</strong> • Govt. of Maharashtra
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrintCertificate}
                    className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Printer className="w-4 h-4 text-[#CFFFDC]" />
                    <span>Print Certificate (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white/80 dark:bg-[#122016] p-4 rounded-xl border border-[#D4EEDC] dark:border-[#2A4736]">
                <div>
                  <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] font-semibold uppercase">License / Certificate No.</div>
                  <div className="font-mono font-extrabold text-xs text-[#253D2C] dark:text-white mt-0.5">MH-LIC-2026-{app.appId.replace(/[^0-9]/g, '') || '8841'}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] font-semibold uppercase">Sanctioned Entity</div>
                  <div className="font-extrabold text-xs text-[#253D2C] dark:text-white mt-0.5">{app.businessName}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] font-semibold uppercase">Approval Granted By</div>
                  <div className="font-extrabold text-xs text-[#253D2C] dark:text-white mt-0.5">{app.officerAssigned || 'Dr. V. K. Patil'}</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] font-semibold uppercase">Sanction Date</div>
                  <div className="font-extrabold text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">{new Date().toISOString().split('T')[0]} (Active)</div>
                </div>
              </div>

              {/* Officer Endorsement Notes */}
              {app.remarks && (
                <div className="p-3 bg-white/60 dark:bg-[#16261C] rounded-xl border border-dashed border-[#68BA7F]/60 text-xs">
                  <span className="font-extrabold text-[#253D2C] dark:text-[#CFFFDC]">Officer Approval Endorsement: </span>
                  <span className="text-[#4A6B53] dark:text-[#A3D4B3]">{app.remarks}</span>
                </div>
              )}
            </div>
          )}

          {/* REJECTED BANNER (Rendered ONLY when status === 'Rejected') */}
          {app.status === 'Rejected' && (
            <div className="bg-rose-50 dark:bg-rose-950/40 p-6 rounded-2xl border-2 border-rose-500 shadow-md space-y-4 text-slate-900 dark:text-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200 dark:border-rose-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <X className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-rose-950 dark:text-rose-200">
                      Application Rejected by Reviewing Officer
                    </h3>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      Reviewed by {app.officerAssigned || 'Desk Review Officer'} ({app.department})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReapplyOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reapply from First</span>
                </button>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800 text-xs">
                <div className="font-bold text-rose-900 dark:text-rose-300 mb-1">Reason for Rejection / Statutory Grounds:</div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {app.remarks || 'Application rejected due to statutory discrepancies or non-compliance with departmental safety distance norms.'}
                </p>
              </div>
            </div>
          )}

          {/* SLA & Status Meter Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Status</div>
              <div className={`font-extrabold text-sm mt-1 ${app.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{app.status}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Officer: {app.officerAssigned || 'Auto Dispatcher'}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">SLA Clock Countdown</div>
              <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{app.status === 'Approved' ? 'Completed & Cleared' : `${app.slaDaysRemaining} Days Remaining`}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Target SLA: {app.slaDeadlineDate}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Application Risk Assessment</div>
              <div className="font-extrabold text-sm text-blue-600 dark:text-blue-400 mt-1">
                Risk Score: {app.riskScore} / 100
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{app.status === 'Approved' ? 'Zero Non-Compliance Risk' : 'Low-Medium Risk Profile'}</div>
            </div>

          </div>

          {/* Department Query Section & Response Form (If Open Query Exists) */}
          {openQuery ? (
            <div className="bg-amber-50 dark:bg-amber-950/50 p-5 rounded-2xl border-2 border-amber-400 dark:border-amber-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                    Official Department Query Raised
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-bold text-[10px]">
                  Response Due: {openQuery.dueDate}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200">
                <div className="font-semibold text-xs text-amber-900 dark:text-amber-300 mb-1">
                  Query from {openQuery.officerName} ({openQuery.department}):
                </div>
                <p className="leading-relaxed text-xs">{openQuery.queryText}</p>
              </div>

              {/* Response Form */}
              <form onSubmit={handleQuerySubmit} className="space-y-3 pt-2">
                <div className="font-bold text-xs text-slate-900 dark:text-white">Submit Entrepreneur Response:</div>
                <textarea
                  rows={3}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Explain calculations, compliance provisions, or technical clarify notes for the inspecting officer..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Attach Clarification File</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setResponseDocName(file.name);
                        }
                      }}
                      className="w-full text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1.5 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white cursor-pointer"
                    />
                    {responseDocName && (
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block mt-1">
                        ✓ Selected: {responseDocName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Query Response to Officer</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            app.queries.length > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  All Previous Queries Resolved
                </div>
                {app.queries.map(q => (
                  <div key={q.id} className="text-[11px] text-emerald-800 dark:text-emerald-200">
                    • Responded on {q.responseDate}: "{q.responseText}"
                  </div>
                ))}
              </div>
            )
          )}

          {/* Interactive Timeline */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Application Event Timeline</h3>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-4 pl-4">
              {app.timeline.map((evt) => (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-mh-saffron border-2 border-white dark:border-slate-800" />
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{evt.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{evt.description}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {evt.timestamp} • By {evt.actor} ({evt.role})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Documents Attachment List */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Attached Application Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.slice(0, 3).map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-mh-blue dark:text-blue-400" />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{d.docName}</div>
                      <div className="text-[10px] text-slate-400">{d.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          {app.status === 'Rejected' ? (
            <button
              onClick={() => setIsReapplyOpen(true)}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reapply for this License from First</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 text-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>

      {/* Embedded Apply Approval Modal for Reapplying */}
      <ApplyApprovalModal
        isOpen={isReapplyOpen}
        onClose={() => setIsReapplyOpen(false)}
        approvalItem={reapplyItem}
        onSuccess={() => {
          setIsReapplyOpen(false);
          onClose();
        }}
      />

    </div>
  );
};
