import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, User, MapPin, CheckCircle2, UploadCloud, Layers } from 'lucide-react';

export const OfficerInspectionPage: React.FC = () => {
  const { inspections, currentUser } = useApp();

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Officer Inspection Management Desk</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Schedule site visits, coordinate joint audits with MPCB/DISH/Fire, and upload field inspection reports.
        </p>
      </div>

      <div className="space-y-4">
        {inspections.map((insp) => (
          <div key={insp.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{insp.approvalName}</h3>
                <p className="text-slate-500">{insp.businessName} • {insp.department}</p>
              </div>
              {insp.isJointInspection && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase">
                  Joint Inspection Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Scheduled Date & Time</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{insp.scheduledDate}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Venue Location</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{insp.location}</div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Inspectors</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{insp.officerDetails.name}</div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700/60">
              <span className="text-[11px] text-slate-500 font-medium">
                Upload signed field audit checklist, water quality reports, or site photographs.
              </span>

              <label className="px-4 py-2 rounded-xl bg-mh-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span>Upload Field Visit Report</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      alert(`Field report '${file.name}' (${(file.size / 1024).toFixed(1)} KB) successfully uploaded & logged to audit trial!`);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
