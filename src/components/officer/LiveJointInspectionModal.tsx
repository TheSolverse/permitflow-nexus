import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JointInspection } from '../../types';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Camera, 
  MapPin, 
  Users, 
  Clock, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Upload, 
  Sparkles,
  Send,
  Calendar
} from 'lucide-react';

interface Props {
  inspection: JointInspection;
  onClose: () => void;
}

export const LiveJointInspectionModal: React.FC<Props> = ({ inspection, onClose }) => {
  const { currentUser, completeJointInspection } = useApp();

  // Multi-department attendance check-in
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    inspection.attendingDepartments.forEach(dept => {
      initial[dept] = true;
    });
    return initial;
  });

  // Rubric checklist evaluation state
  const [rubricScores, setRubricScores] = useState<Array<{ criterion: string; status: 'PASS' | 'RECTIFY' | 'FAIL'; notes: string }>>(() => {
    return (inspection.rubricChecklist || []).map(r => ({
      criterion: r.criterion,
      status: r.compliant === true ? 'PASS' : r.compliant === false ? 'FAIL' : 'PASS',
      notes: r.notes || 'Field inspection parameters verified on site.'
    }));
  });

  // Photo evidence
  const [photos, setPhotos] = useState<Array<{ id: string; name: string; url: string; timestamp: string }>>([
    {
      id: 'p1',
      name: 'ETP_Primary_Clarifier_ZeroDischarge.jpg',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60',
      timestamp: 'Today, 11:15 AM (Geo-tagged)'
    },
    {
      id: 'p2',
      name: 'Fire_Hydrant_Ring_Main_Pressure_Gauge.jpg',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60',
      timestamp: 'Today, 11:22 AM (Geo-tagged)'
    }
  ]);

  const [finalOutcome, setFinalOutcome] = useState<'SATISFACTORY' | 'RECTIFICATION_REQUIRED' | 'NON_COMPLIANT'>('SATISFACTORY');
  const [jointSummaryNotes, setJointSummaryNotes] = useState(
    'All statutory fire safety setbacks, industrial effluent zero liquid discharge systems, and transformer earthing parameters meet Maharashtra Industrial Development Corporation (MIDC) standards.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleAttendance = (dept: string) => {
    setAttendance(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  const updateRubricStatus = (index: number, status: 'PASS' | 'RECTIFY' | 'FAIL') => {
    setRubricScores(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status };
      return copy;
    });
  };

  const updateRubricNotes = (index: number, notes: string) => {
    setRubricScores(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], notes };
      return copy;
    });
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        const dataUrl = re.target?.result as string;
        setPhotos(prev => [
          ...prev,
          {
            id: `photo-${Date.now()}`,
            name: file.name,
            url: dataUrl,
            timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Geo-tagged 18.7523° N, 73.8567° E)`
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitJointReport = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);

      completeJointInspection(inspection.id, finalOutcome, jointSummaryNotes);

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-purple-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/40 animate-pulse">
                  ● Live Site Audit Active
                </span>
                <span className="text-purple-300 font-mono text-[11px]">Audit ID: JI-{inspection.id.toUpperCase().slice(-6)}</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                Live Joint Site Inspection Desk: {inspection.businessName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* Key Metadata Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Site Location & District</span>
              <div className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{inspection.inspectionLocation}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Scheduled Window</span>
              <div className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{inspection.scheduledDate} ({inspection.scheduledTime})</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Geo-Coordinate Accuracy</span>
              <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>18.7523° N, 73.8567° E (GPS Locked)</span>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Department Quorum & Attendance */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>1. Attending Department Officers Quorum</span>
              </h3>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                {Object.values(attendance).filter(Boolean).length} of {inspection.attendingDepartments.length} Checked In
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inspection.attendingDepartments.map((dept, idx) => {
                const isChecked = !!attendance[dept];
                const officerName = inspection.officerNames?.[idx] || `${dept} Field Inspector`;

                return (
                  <div
                    key={dept}
                    onClick={() => toggleAttendance(dept)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-100 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">{dept}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{officerName}</div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
                      isChecked
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {isChecked ? '✓ Present on Site' : 'Absent / Excused'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Interactive Site Audit Rubric Checklist */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Multi-Agency Site Evaluation Rubric</span>
            </h3>

            <div className="space-y-3">
              {rubricScores.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item.criterion}</span>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateRubricStatus(idx, 'PASS')}
                        className={`px-3 py-1 rounded-lg font-extrabold text-[10px] transition-all cursor-pointer ${
                          item.status === 'PASS'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100'
                        }`}
                      >
                        ✓ Compliant / Pass
                      </button>

                      <button
                        type="button"
                        onClick={() => updateRubricStatus(idx, 'RECTIFY')}
                        className={`px-3 py-1 rounded-lg font-extrabold text-[10px] transition-all cursor-pointer ${
                          item.status === 'RECTIFY'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100'
                        }`}
                      >
                        ⚠️ Rectify in 15d
                      </button>

                      <button
                        type="button"
                        onClick={() => updateRubricStatus(idx, 'FAIL')}
                        className={`px-3 py-1 rounded-lg font-extrabold text-[10px] transition-all cursor-pointer ${
                          item.status === 'FAIL'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-100'
                        }`}
                      >
                        ✗ Non-Compliant
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateRubricNotes(idx, e.target.value)}
                    placeholder="Enter inspector field observation notes, meter readings, or measured values..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Geo-Tagged Camera & Field Photo Evidence */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>3. Geo-Camera Field Evidence & Site Photographs ({photos.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">Live geo-tagged photos stamped with GPS coordinates and timestamp.</p>
              </div>

              <label className="px-3.5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all">
                <Camera className="w-4 h-4 text-[#CFFFDC]" />
                <span>Snap / Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddPhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 shadow-xs flex flex-col justify-between"
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2.5 text-[10px] space-y-0.5">
                    <div className="font-extrabold text-slate-900 dark:text-white truncate">{p.name}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{p.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Final Joint Determination & Sanction */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-900/60 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>4. Final Joint Determination & Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setFinalOutcome('SATISFACTORY')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center ${
                  finalOutcome === 'SATISFACTORY'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs">Satisfactory Audit</div>
                <div className="text-[10px] opacity-80 mt-0.5">Recommend Grant of Clearance</div>
              </div>

              <div
                onClick={() => setFinalOutcome('RECTIFICATION_REQUIRED')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center ${
                  finalOutcome === 'RECTIFICATION_REQUIRED'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs">Conditional Rectification</div>
                <div className="text-[10px] opacity-80 mt-0.5">15-Day Remediation Notice</div>
              </div>

              <div
                onClick={() => setFinalOutcome('NON_COMPLIANT')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-center ${
                  finalOutcome === 'NON_COMPLIANT'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs">Non-Compliant / Rejected</div>
                <div className="text-[10px] opacity-80 mt-0.5">Major Statutory Violation</div>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-xs text-slate-900 dark:text-white block mb-1">
                Official Joint Multi-Agency Inspection Observations & Sanction Notes:
              </label>
              <textarea
                rows={3}
                value={jointSummaryNotes}
                onChange={(e) => setJointSummaryNotes(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-slate-500 text-[11px]">
            Executing Lead Officer: <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{currentUser.name}</strong> ({currentUser.department})
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer"
            >
              Cancel / Close
            </button>

            <button
              type="button"
              onClick={handleSubmitJointReport}
              disabled={isSubmitting || isCompleted}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer text-white ${
                isCompleted 
                  ? 'bg-emerald-600'
                  : 'bg-purple-900 hover:bg-purple-800'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Report Issued Successfully!</span>
                </>
              ) : isSubmitting ? (
                <span>Generating Digital Report...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Submit & Issue Joint Inspection Report</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
