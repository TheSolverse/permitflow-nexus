import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
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
  ChevronRight
} from 'lucide-react';

interface Props {
  app: Application;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<Props> = ({ app, onClose }) => {
  const { respondToQuery, documents } = useApp();
  const [responseText, setResponseText] = useState('');
  const [responseDocName, setResponseDocName] = useState('');

  const openQuery = app.queries.find(q => q.status === 'OPEN');

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
          
          {/* SLA & Status Meter Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Status</div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{app.status}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Officer: {app.officerAssigned || 'Auto Dispatcher'}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">SLA Clock Countdown</div>
              <div className="font-extrabold text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{app.slaDaysRemaining} Days Remaining</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Target SLA: {app.slaDeadlineDate}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Application Risk Assessment</div>
              <div className="font-extrabold text-sm text-blue-600 dark:text-blue-400 mt-1">
                Risk Score: {app.riskScore} / 100
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Low-Medium Risk Profile</div>
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
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Upload Clarification Document Name</label>
                    <input
                      type="text"
                      value={responseDocName}
                      onChange={(e) => setResponseDocName(e.target.value)}
                      placeholder="e.g. Revised_ETP_Calculation_Report.pdf"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
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
        <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 text-xs"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
