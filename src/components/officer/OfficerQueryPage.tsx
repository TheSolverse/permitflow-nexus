import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquareText, Send, CheckCircle2, Clock, FileText, User } from 'lucide-react';

export const OfficerQueryPage: React.FC = () => {
  const { applications, currentUser } = useApp();
  const [selectedAppId, setSelectedAppId] = useState(applications[2]?.id || applications[0]?.id);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Officer Query Management Desk</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Raise technical queries, request revised blueprints, and audit incoming entrepreneur responses for {currentUser.department || 'Government Officers'}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Applications List */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider px-2">Applications Queue</h3>
          {applications.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                app.id === selectedAppId
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 font-semibold text-amber-950 dark:text-amber-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold">{app.appId}</div>
              <div className="truncate text-slate-500">{app.approvalName}</div>
              <div className="text-[10px] text-amber-600 mt-1 font-semibold">Queries: {app.queries.length}</div>
            </button>
          ))}
        </div>

        {/* Right: Selected Application Query History & Controls */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{selectedApp.approvalName}</h2>
            <p className="text-xs text-slate-500">Applicant: {selectedApp.businessName} • ID: {selectedApp.appId}</p>
          </div>

          {/* Active Query Section */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Query Communication Log:</h3>
            
            {selectedApp.queries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl">
                No active queries raised on this application yet.
              </div>
            ) : (
              selectedApp.queries.map(q => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400">{q.queryCategory}</span>
                    <span className="text-[10px] text-slate-400">Raised: {q.raisedDate} • Status: {q.status}</span>
                  </div>
                  
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">"{q.queryText}"</p>

                  {q.responseText && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-0.5">Entrepreneur Response:</div>
                      <p>"{q.responseText}"</p>
                      {q.responseDocName && <div className="text-[10px] text-emerald-600 mt-1 font-semibold">Attachment: {q.responseDocName}</div>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
