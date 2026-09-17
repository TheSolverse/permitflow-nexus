import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertTriangle, Layers, Phone, FileText, Plus, Sparkles, X } from 'lucide-react';

export const InspectionPlannerPage: React.FC = () => {
  const { 
    projects, 
    inspections, 
    jointInspections, 
    parallelPermissions,
    applications,
    activeProject, 
    currentUser, 
    setActiveTab,
    officerScheduleInspection
  } = useApp();
  
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [requestedDate, setRequestedDate] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [selectedPermToSchedule, setSelectedPermToSchedule] = useState<string>('');
  const [newInspectionDateInput, setNewInspectionDateInput] = useState<string>(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0] + ' 11:00 AM'
  );
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState<string | null>(null);

  const userProjects = currentUser?.role === 'ENTREPRENEUR'
    ? projects.filter(p => !p.userId || p.userId === currentUser.id)
    : projects;

  const hasProject = Boolean(activeProject && activeProject.id && activeProject.id.trim().length > 0 && userProjects.length > 0);

  if (!hasProject) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 max-w-3xl mx-auto my-8 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            No Business Project Profile Created Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            To schedule departmental site audits and track joint multi-agency site inspections, please create your business project profile first.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new-project')}
          className="px-6 py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>+ Create New Business Project</span>
        </button>
      </div>
    );
  }

  // Active project permissions
  const currentProjectPermissions = parallelPermissions.filter(p => p.projectId === activeProject.id);

  // 1. Joint inspections for active project
  const projectJointInspections = jointInspections.filter(j => 
    j.projectId === activeProject.id || 
    (activeProject.businessName && j.businessName && j.businessName.toLowerCase() === activeProject.businessName.toLowerCase())
  );

  // 2. Direct inspections from inspections state list
  const rawProjectInspections = inspections.filter(i => 
    (i as any).projectId === activeProject.id || 
    (activeProject.businessName && i.businessName && i.businessName.toLowerCase() === activeProject.businessName.toLowerCase())
  );

  // 3. Synthesize any clearance permissions that have inspection scheduled / pending
  const permissionInspections = currentProjectPermissions
    .filter(p => p.status === 'Inspection Pending' || p.status === 'Inspection Scheduled' || p.status === 'Inspection Required' || Boolean(p.inspectionDate))
    .filter(p => !rawProjectInspections.some(i => i.applicationId === p.id || i.applicationId === p.approvalId))
    .map(p => {
      const inspectionType = (p.approvalName.toLowerCase().includes('fire') ? 'Fire Safety Compliance' 
        : p.approvalName.toLowerCase().includes('pollution') || p.approvalName.toLowerCase().includes('mpcb') ? 'Pollution Emission Audit'
        : p.approvalName.toLowerCase().includes('dish') || p.approvalName.toLowerCase().includes('factory') ? 'DISH Factory Safety Check'
        : p.approvalName.toLowerCase().includes('food') || p.approvalName.toLowerCase().includes('fssai') ? 'FSSAI Hygiene Inspection'
        : 'Pre-Setup Site Audit');

      return {
        id: `insp-${p.id}`,
        applicationId: p.id,
        approvalName: p.approvalName,
        businessName: activeProject.businessName,
        department: p.department,
        inspectionType: inspectionType as any,
        scheduledDate: p.inspectionDate || 'Inspection Pending Confirmation',
        location: activeProject.midcArea || 'Plot Premises / Industrial Zone',
        officerDetails: {
          name: p.assignedOfficer || 'Department Field Inspector',
          designation: 'Scrutiny Officer / Field Inspector',
          contact: '+91 22 2202 5555'
        },
        requiredDocs: [
          'Certified Site Master Plan Blueprint',
          'Building Safety & Egress Layout',
          'Environmental & Waste Discharge Plan',
          'Equipment & Machinery Schedule'
        ],
        status: 'SCHEDULED' as const,
        outcome: (p.remarks && p.remarks.includes('Completed') ? 'Satisfactory' : undefined) as any,
        isJointInspection: false,
        participatingDepts: [p.department]
      };
    });

  // Total project inspections combined
  const projectInspections = [...rawProjectInspections, ...permissionInspections];

  const toggleConfirm = (id: string) => {
    if (confirmedIds.includes(id)) {
      setConfirmedIds(confirmedIds.filter(i => i !== id));
    } else {
      setConfirmedIds([...confirmedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Department Inspection Planner</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E6F40] text-white text-xs font-bold shadow-xs">
              Single-Window Inspection Protocol
            </span>
          </div>
          <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
            Synchronized departmental site audits for <strong className="text-slate-900 dark:text-white font-extrabold">{activeProject.businessName}</strong> ({activeProject.midcArea || 'Maharashtra Industrial Zone'}).
          </p>
        </div>

        <button
          onClick={() => {
            if (currentProjectPermissions.length > 0) {
              setSelectedPermToSchedule(currentProjectPermissions[0].id);
            }
            setShowScheduleModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-xs shadow-md inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4 text-[#CFFFDC]" />
          <span>Request / Schedule Site Inspection</span>
        </button>
      </div>

      {scheduleSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{scheduleSuccessMsg}</span>
          </div>
          <button onClick={() => setScheduleSuccessMsg(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* JOINT INSPECTIONS CARDS SECTION */}
      {projectJointInspections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-purple-950 dark:text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-700" />
            Scheduled Multi-Agency Joint Site Inspections ({projectJointInspections.length})
          </h2>

          {projectJointInspections.map(j => (
            <div
              key={j.id}
              className="bg-purple-900 text-white p-6 rounded-2xl border border-purple-700 shadow-lg space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-700/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider">
                      ★ Joint Site Inspection
                    </span>
                    <h3 className="font-extrabold text-sm text-white">{j.businessName}</h3>
                  </div>
                  <p className="text-xs text-purple-200 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{j.inspectionLocation}</span>
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-purple-800/80 border border-purple-600 font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{j.scheduledDate} ({j.scheduledTime})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-800 space-y-2">
                  <span className="font-extrabold text-purple-200 text-[10px] uppercase tracking-wider">
                    Participating Departmental Inspectors:
                  </span>
                  <div className="space-y-1 text-[11px] text-purple-100">
                    {j.officerNames.map((off, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{off}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-800 space-y-2">
                  <span className="font-extrabold text-purple-200 text-[10px] uppercase tracking-wider">
                    Joint Inspection Statutory Rubric:
                  </span>
                  <div className="space-y-1.5 text-[11px]">
                    {j.rubricChecklist.map((rubric, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-2">
                        <span className="text-purple-100 font-medium">• {rubric.criterion}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${rubric.compliant ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-500/30 text-amber-300'}`}>
                          {rubric.compliant === true ? 'Verified' : 'Pending Visit'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standard Individual Inspections Cards List */}
      {projectInspections.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-[#253D2C] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2E6F40]" />
            Departmental Clearance Inspections ({projectInspections.length})
          </h2>
          {projectInspections.map((insp) => {
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
      ) : projectJointInspections.length === 0 ? (
        <div className="bg-white dark:bg-[#16261C] p-10 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              No Pending Site Audits for {activeProject.businessName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When a departmental officer (MPCB, Fire, DISH, MIDC) or multi-agency panel schedules a physical inspection, date, assigned officers, and statutory checklist rubrics will appear here automatically.
            </p>
          </div>
        </div>
      ) : null}

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
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setScheduleSuccessMsg('Reschedule request successfully submitted to inspecting officer.');
                  setRescheduleModalId(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Schedule / Request Inspection Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Schedule Department Site Inspection
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Book a physical site inspection or joint multi-department audit for your registered industrial unit at <strong className="text-slate-800 dark:text-slate-200">{activeProject.businessName}</strong>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const permId = selectedPermToSchedule || (currentProjectPermissions[0]?.id) || 'mpcb-consent-establish';
                const targetPerm = currentProjectPermissions.find(p => p.id === permId);
                const permName = targetPerm?.approvalName || 'Clearance Permission';
                
                officerScheduleInspection(permId, newInspectionDateInput, activeProject.midcArea || 'Plot Premises');
                setShowScheduleModal(false);
                setScheduleSuccessMsg(`✓ Site inspection for "${permName}" successfully scheduled for ${newInspectionDateInput}. Inspecting officers have been notified.`);
              }}
              className="space-y-4 pt-1"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Clearance Permission / Department
                </label>
                <select
                  value={selectedPermToSchedule}
                  onChange={(e) => setSelectedPermToSchedule(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-purple-600"
                >
                  {currentProjectPermissions.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.approvalName} ({p.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inspection Date & Time
                </label>
                <input
                  type="text"
                  value={newInspectionDateInput}
                  onChange={(e) => setNewInspectionDateInput(e.target.value)}
                  placeholder="e.g. 2026-09-24 11:00 AM"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Premises Location
                </label>
                <input
                  type="text"
                  defaultValue={activeProject.midcArea || 'Plot No. C-42, MIDC Chakan Phase 2, Pune Industrial Zone'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Statutory Protocol Pre-Requisites</span>
                </div>
                <p>
                  Ensure structural master drawings, electrical single-line diagrams, and safety egress plans are readily accessible on-site for the scrutiny panel.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-extrabold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>Confirm Site Inspection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
