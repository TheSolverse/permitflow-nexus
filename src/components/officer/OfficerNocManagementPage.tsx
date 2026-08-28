import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Flame, 
  Leaf, 
  Droplets, 
  Zap, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  FileText, 
  Users, 
  MapPin, 
  Filter, 
  Search, 
  ChevronRight, 
  Plus, 
  X,
  Building
} from 'lucide-react';
import { NocApplication, NocType, JointInspection } from '../../types';
import { NocCertificateModal } from './NocCertificateModal';
import { LiveJointInspectionModal } from './LiveJointInspectionModal';

export const OfficerNocManagementPage: React.FC = () => {
  const { 
    nocApplications, 
    jointInspections, 
    scheduleJointInspection, 
    raiseNocQuery, 
    issueNocCertificate 
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedNoc, setSelectedNoc] = useState<NocApplication | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState<boolean>(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [liveInspectionToExecute, setLiveInspectionToExecute] = useState<JointInspection | null>(null);
  const [certTypeToIssue, setCertTypeToIssue] = useState<'PROVISIONAL' | 'FINAL'>('PROVISIONAL');

  // Joint Inspection Scheduler Form state
  const [inspectionDate, setInspectionDate] = useState<string>('2026-09-05');
  const [inspectionTime, setInspectionTime] = useState<string>('10:30 AM');
  const [inspectionLocation, setInspectionLocation] = useState<string>('Plot No. C-42, MIDC Chakan Phase 2, Pune Industrial Zone');
  const [queryInput, setQueryInput] = useState<string>('');

  // Filters
  const filteredNocs = nocApplications.filter(noc => {
    if (filterType !== 'ALL' && noc.nocType !== filterType) return false;
    if (filterStatus !== 'ALL' && noc.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return noc.businessName.toLowerCase().includes(q) || noc.nocName.toLowerCase().includes(q) || noc.id.toLowerCase().includes(q);
    }
    return true;
  });

  const getNocBadge = (type: NocType) => {
    switch (type) {
      case 'FIRE_SAFETY':
        return { label: 'Fire Safety NOC', icon: Flame, color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'MPCB_CTE':
        return { label: 'MPCB CTE NOC', icon: Leaf, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'WATER_SUPPLY':
        return { label: 'Water Supply NOC', icon: Droplets, color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'ELECTRICAL_SAFETY':
        return { label: 'Electrical Safety NOC', icon: Zap, color: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
  };

  const getStatusBadge = (status: NocApplication['status']) => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'QUERY_RAISED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'INSPECTION_SCHEDULED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'PROVISIONAL_ISSUED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'FINAL_GRANTED':
        return 'bg-emerald-900 text-white font-extrabold';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Schedule Joint Inspection
  const handleScheduleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoc) return;

    scheduleJointInspection({
      nocApplicationId: selectedNoc.id,
      projectId: selectedNoc.projectId,
      businessName: selectedNoc.businessName,
      scheduledDate: inspectionDate,
      scheduledTime: inspectionTime,
      attendingDepartments: [
        'Maharashtra Fire Services',
        'Maharashtra Pollution Control Board (MPCB)',
        'MIDC Infrastructure & Water Works',
        'Electrical Inspectorate / MSEDCL'
      ],
      officerNames: [
        'Officer Sunita Rane (Fire)',
        'Dr. V. K. Patil (MPCB)',
        'Er. Suresh Shinde (MIDC)',
        'Inspector A. B. Kadam (DISH)'
      ],
      inspectionLocation,
      rubricChecklist: [
        { criterion: '6m Clear Perimeter Fire Tender Access Road', compliant: true, notes: 'Preliminary CAD drawing verified' },
        { criterion: 'Emergency Exit & Fire Hydrant Ring Main Pressure', compliant: true, notes: 'Piping layout clear' },
        { criterion: 'Effluent Treatment Plant (ETP) Flow Meter & Zero Liquid Discharge', compliant: null, notes: 'To be verified during joint inspection' },
        { criterion: 'Substation Transformer Earth Resistance (<1 Ohm)', compliant: null, notes: 'To be tested by MSEDCL Inspector' }
      ]
    });

    setIsInspectionModalOpen(false);
  };

  // Submit Query
  const handleRaiseQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoc || !queryInput.trim()) return;

    raiseNocQuery(selectedNoc.id, queryInput.trim());
    setIsQueryModalOpen(false);
    setQueryInput('');
  };

  // Handle Certificate Issue Trigger
  const handleIssueCertificate = (noc: NocApplication, certType: 'PROVISIONAL' | 'FINAL') => {
    issueNocCertificate(noc.id, certType);
    setSelectedNoc({
      ...noc,
      status: certType === 'PROVISIONAL' ? 'PROVISIONAL_ISSUED' : 'FINAL_GRANTED'
    });
    setCertTypeToIssue(certType);
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-mh-navy to-purple-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-200 text-xs font-bold mb-2 border border-purple-600/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>State Departmental NOC Review & Verification Toolkit</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">NOC Applications & Joint Inspection Hub</h1>
          <p className="text-xs text-purple-200 mt-1">
            Review departmental NOC applications, trigger multi-agency joint site visits, issue queries, and grant signed NOC certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-900/50 p-3 rounded-xl border border-purple-700/50 text-center">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Pending NOC Queue</div>
            <div className="text-lg font-extrabold text-amber-400">{nocApplications.filter(n => n.status !== 'FINAL_GRANTED').length} Active</div>
          </div>
          <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-700/50 text-center">
            <div className="text-[10px] text-emerald-200 font-semibold uppercase">Joint Inspections</div>
            <div className="text-lg font-extrabold text-emerald-300">{jointInspections.length} Scheduled</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search business name, NOC ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-64 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="ALL">All NOC Types ({nocApplications.length})</option>
            <option value="FIRE_SAFETY">Fire Safety NOC</option>
            <option value="MPCB_CTE">MPCB CTE NOC</option>
            <option value="WATER_SUPPLY">Water Supply NOC</option>
            <option value="ELECTRICAL_SAFETY">Electrical Safety NOC</option>
          </select>

          <span className="font-bold text-slate-500 ml-2">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review / Submitted</option>
            <option value="QUERY_RAISED">Query Raised</option>
            <option value="INSPECTION_SCHEDULED">Inspection Scheduled</option>
            <option value="PROVISIONAL_ISSUED">Provisional NOC Issued</option>
            <option value="FINAL_GRANTED">Final NOC Granted</option>
          </select>
        </div>
      </div>

      {/* JOINT INSPECTIONS CARDS SECTION */}
      {jointInspections.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1 border border-purple-300">
                <Users className="w-4 h-4 text-purple-700" />
                Joint Site Inspection
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Multi-Department Joint Inspection Calendar ({jointInspections.length})
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaultNoc = nocApplications[0];
                  if (defaultNoc) setSelectedNoc(defaultNoc);
                  setIsInspectionModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Schedule New Joint Inspection</span>
              </button>

              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 hidden md:inline">
                Single-Visit Multi-Agency Audit
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jointInspections.map(insp => (
              <div
                key={insp.id}
                className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800/60 space-y-3.5 text-xs shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{insp.businessName}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{insp.inspectionLocation}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-900 text-white font-extrabold text-[10px] shrink-0 shadow-xs">
                      {insp.scheduledDate} ({insp.scheduledTime})
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3">
                    <span className="text-[10px] font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                      Attending Departments ({insp.attendingDepartments.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {insp.attendingDepartments.map((dept, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-purple-200 shadow-xs">
                          ✓ {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-200 dark:border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Rubric Criteria: {insp.rubricChecklist.length} Points
                    </span>
                    <div className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">Status: Ready for Audit</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLiveInspectionToExecute(insp)}
                    className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-[1.02]"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Start Live Joint Inspection</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOC APPLICATIONS QUEUE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNocs.map(noc => {
          const badge = getNocBadge(noc.nocType);
          const BadgeIcon = badge.icon;
          const statusClass = getStatusBadge(noc.status);

          return (
            <div
              key={noc.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* NOC Badge & Urgency */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${noc.urgency === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'}`}>
                      {noc.urgency} URGENCY
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}>
                      {noc.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{noc.nocName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{noc.businessName} ({noc.department})</span>
                </p>

                {/* Technical Parameters Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Technical Parameters:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div>• Plot Area: <strong>{noc.technicalParameters.plotAreaSqM} $m^2$</strong></div>
                    <div>• Built-up Area: <strong>{noc.technicalParameters.builtUpAreaSqM} $m^2$</strong></div>
                    {noc.technicalParameters.fireMitigation && (
                      <div className="col-span-2 text-amber-800 dark:text-amber-300">
                        • Fire Equipment: {noc.technicalParameters.fireMitigation.sprinklersCount} Sprinklers, {noc.technicalParameters.fireMitigation.hydrantsCount} Hydrants, {noc.technicalParameters.fireMitigation.smokeAlarmsCount} Smoke Alarms
                      </div>
                    )}
                    {noc.technicalParameters.waterRequirementKlpd && (
                      <div>• Water Demand: <strong>{noc.technicalParameters.waterRequirementKlpd} KLPD</strong></div>
                    )}
                    {noc.technicalParameters.effluentGenerationKlpd && (
                      <div>• Effluent: <strong>{noc.technicalParameters.effluentGenerationKlpd} KLPD</strong></div>
                    )}
                    {noc.technicalParameters.electricalLoadKw && (
                      <div>• Power Grid Load: <strong>{noc.technicalParameters.electricalLoadKw} kW ({noc.technicalParameters.voltageLevel})</strong></div>
                    )}
                  </div>
                </div>

                {/* Open Queries List */}
                {noc.queries && noc.queries.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1">
                    <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      Active Technical Queries ({noc.queries.length}):
                    </span>
                    {noc.queries.map(q => (
                      <p key={q.id} className="text-[11px] text-amber-800 dark:text-amber-200 leading-snug">
                        "{q.question}" — <span className="font-bold">{q.status}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* SLA & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>SLA: {noc.slaDaysLeft} Days Remaining</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Schedule Joint Inspection Button */}
                    <button
                      onClick={() => {
                        setSelectedNoc(noc);
                        setIsInspectionModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joint Inspection</span>
                    </button>

                    {/* Raise Query Button */}
                    <button
                      onClick={() => {
                        setSelectedNoc(noc);
                        setIsQueryModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Query</span>
                    </button>

                    {/* Issue Certificate Button */}
                    <button
                      onClick={() => handleIssueCertificate(noc, 'PROVISIONAL')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Issue NOC</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: JOINT INSPECTION SCHEDULER */}
      {isInspectionModalOpen && selectedNoc && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="joint-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-purple-900 to-mh-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 id="joint-modal-title" className="font-extrabold text-sm text-white">
                  Trigger Multi-Agency Joint Site Inspection
                </h3>
              </div>
              <button 
                onClick={() => setIsInspectionModalOpen(false)} 
                className="text-purple-200 hover:text-white p-1 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInspectionSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Schedule a unified single-visit joint site inspection for{' '}
                <strong className="text-purple-900 dark:text-purple-300">{selectedNoc.businessName}</strong> involving Fire, MPCB, MIDC, and DISH officers.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inspection Date *</label>
                  <input
                    type="date"
                    required
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inspection Time *</label>
                  <input
                    type="text"
                    required
                    value={inspectionTime}
                    onChange={(e) => setInspectionTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Site Location Address *</label>
                <input
                  type="text"
                  required
                  value={inspectionLocation}
                  onChange={(e) => setInspectionLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                <span className="font-bold uppercase text-[10px] text-purple-800">Automated Attending Inspectorate Panel:</span>
                <div className="text-[11px] text-purple-700 leading-tight">
                  • Officer Sunita Rane (Maharashtra Fire Services)<br/>
                  • Dr. V. K. Patil (MPCB Environmental Officer)<br/>
                  • Er. Suresh Shinde (MIDC Infrastructure Engineer)<br/>
                  • Inspector A. B. Kadam (DISH Industrial Safety)
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInspectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Confirm Joint Inspection Date</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RAISE TECHNICAL QUERY */}
      {isQueryModalOpen && selectedNoc && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="query-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <h3 id="query-modal-title" className="font-extrabold text-sm text-white">
                  Raise Departmental Technical Query
                </h3>
              </div>
              <button 
                onClick={() => setIsQueryModalOpen(false)} 
                className="text-amber-100 hover:text-white p-1 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseQuerySubmit} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Issue a technical query to <strong className="text-amber-900 dark:text-amber-300">{selectedNoc.businessName}</strong> for NOC application review.
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Query Description / Document Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="e.g. Please upload peak monsoon discharge calculation for Effluent Treatment Plant (ETP)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Query to Entrepreneur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE CERTIFICATE VIEW */}
      <NocCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        noc={selectedNoc}
        certType={certTypeToIssue}
      />

      {/* MODAL 4: LIVE JOINT INSPECTION EXECUTION */}
      {liveInspectionToExecute && (
        <LiveJointInspectionModal
          inspection={liveInspectionToExecute}
          onClose={() => setLiveInspectionToExecute(null)}
        />
      )}

    </div>
  );
};
