import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertTriangle, Layers, Phone, FileText } from 'lucide-react';

export const InspectionPlannerPage: React.FC = () => {
  const { inspections, activeProject } = useApp();
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [requestedDate, setRequestedDate] = useState('');

  const toggleConfirm = (id: string) => {
    if (confirmedIds.includes(id)) {
      setConfirmedIds(confirmedIds.filter(i => i !== id));
    } else {
      setConfirmedIds([...confirmedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Department Inspection Planner</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-300">
              Joint Audits Scheduled
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Site inspections for <strong className="text-slate-800 dark:text-slate-200">{activeProject.businessName}</strong> ({activeProject.midcArea}).
          </p>
        </div>
      </div>

      {/* Inspections Cards List */}
      <div className="space-y-4">
        {inspections.map((insp) => {
          const isConfirmed = confirmedIds.includes(insp.id);

          return (
            <div
              key={insp.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{insp.approvalName}</h3>
                    {insp.isJointInspection && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
                        Joint Inspection
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{insp.department}</div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{insp.scheduledDate}</span>
                  </span>
                </div>
              </div>

              {/* Joint Inspection Dept List */}
              {insp.isJointInspection && insp.participatingDepts && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Participating Joint Audit Authorities:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {insp.participatingDepts.map(dept => (
                      <span key={dept} className="px-2 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 rounded font-semibold text-[10px]">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inspection Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div className="space-y-1">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">Venue Location</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-mh-saffron shrink-0 mt-0.5" />
                    <span>{insp.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Inspecting Officer</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1">
                    <User className="w-3.5 h-3.5 text-mh-blue shrink-0 mt-0.5" />
                    <div>
                      <div>{insp.officerDetails.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{insp.officerDetails.contact}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">Inspection Outcome</div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{insp.outcome || 'Audit Scheduled - Pending Site Visit'}</span>
                  </div>
                </div>

              </div>

              {/* Documents to Keep Ready */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Required Physical Documents for Inspecting Officer:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {insp.requiredDocs.map(doc => (
                    <div key={doc} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-mh-saffron" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {isConfirmed ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Site Visit Attendance Confirmed by Entrepreneur
                    </span>
                  ) : (
                    <span>Please confirm your availability for the scheduled site visit.</span>
                  )}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setRescheduleModalId(insp.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100"
                  >
                    Request Reschedule
                  </button>

                  <button
                    onClick={() => toggleConfirm(insp.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all shadow-xs ${
                      isConfirmed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-mh-navy text-white hover:bg-slate-800'
                    }`}
                  >
                    {isConfirmed ? 'Confirmed' : 'Confirm Attendance'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Request Inspection Reschedule</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Select an alternate preferred date for the department officer's site visit.
            </p>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Preferred Alternate Date & Time</label>
              <input
                type="datetime-local"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Reschedule request sent to inspecting officer.');
                  setRescheduleModalId(null);
                }}
                className="px-4 py-2 rounded-xl bg-mh-navy text-white font-bold"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
