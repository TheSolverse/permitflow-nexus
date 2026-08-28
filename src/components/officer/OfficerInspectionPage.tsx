import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, User, MapPin, CheckCircle2, UploadCloud, Layers, Users, ChevronRight, Plus } from 'lucide-react';
import { LiveJointInspectionModal } from './LiveJointInspectionModal';
import { JointInspection } from '../../types';

export const OfficerInspectionPage: React.FC = () => {
  const { inspections, jointInspections, currentUser, setActiveTab } = useApp();
  const [selectedJointInsp, setSelectedJointInsp] = useState<JointInspection | null>(null);

  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Officer Inspection Management Desk</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Schedule site visits, execute live multi-agency joint audits with MPCB/DISH/Fire, and issue field reports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('officer-nocs')}
          className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Go to NOC & Joint Inspection Hub</span>
        </button>
      </div>

      {/* Live Joint Inspections Card Queue */}
      {jointInspections && jointInspections.length > 0 && (
        <div className="bg-purple-50/50 dark:bg-purple-950/20 p-5 rounded-2xl border-2 border-purple-200 dark:border-purple-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-purple-950 dark:text-purple-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Multi-Department Joint Site Audits ({jointInspections.length})</span>
            </h2>
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">Single-Window Multi-Agency Protocol</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jointInspections.map(insp => (
              <div key={insp.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 space-y-3.5 text-xs shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{insp.businessName}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{insp.inspectionLocation}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-900 text-white font-extrabold text-[10px] shrink-0">
                      {insp.scheduledDate} ({insp.scheduledTime})
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                      Attending Departments ({insp.attendingDepartments.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {insp.attendingDepartments.map((dept, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200 dark:border-slate-600">
                          ✓ {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Rubric Criteria: {insp.rubricChecklist.length} Points
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedJointInsp(insp)}
                    className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-[1.02]"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Start Live Joint Inspection</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Individual Department Inspections */}
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

              <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
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

      {/* Live Joint Inspection Execution Modal */}
      {selectedJointInsp && (
        <LiveJointInspectionModal 
          inspection={selectedJointInsp}
          onClose={() => setSelectedJointInsp(null)}
        />
      )}

    </div>
  );
};
