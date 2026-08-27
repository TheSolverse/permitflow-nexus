import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Flame, 
  Droplets, 
  Zap, 
  Leaf, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Upload, 
  Building, 
  ArrowRight, 
  Clock, 
  CheckSquare, 
  FileCheck,
  Calendar,
  Layers,
  Search,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { NocType, NocApplication, NocDocument } from '../../types';

interface NocApplicationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNocType?: NocType;
}

export const NocApplicationWizardModal: React.FC<NocApplicationWizardModalProps> = ({
  isOpen,
  onClose,
  initialNocType = 'FIRE_SAFETY'
}) => {
  const { activeProject, submitNocApplication, documents: userDocs } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<number>(1);
  const [nocType, setNocType] = useState<NocType>(initialNocType);
  const [urgency, setUrgency] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('HIGH');

  // Technical Parameters State
  const [builtUpAreaSqM, setBuiltUpAreaSqM] = useState<number>(1250);
  const [plotAreaSqM, setPlotAreaSqM] = useState<number>(4500);
  const [sprinklersCount, setSprinklersCount] = useState<number>(48);
  const [hydrantsCount, setHydrantsCount] = useState<number>(6);
  const [smokeAlarmsCount, setSmokeAlarmsCount] = useState<number>(32);
  const [hasFirePumps, setHasFirePumps] = useState<boolean>(true);
  const [waterRequirementKlpd, setWaterRequirementKlpd] = useState<number>(35);
  const [effluentGenerationKlpd, setEffluentGenerationKlpd] = useState<number>(22);
  const [electricalLoadKw, setElectricalLoadKw] = useState<number>(250);
  const [voltageLevel, setVoltageLevel] = useState<string>('11kV HT Connection');
  const [hazardousSubstanceDetails, setHazardousSubstanceDetails] = useState<string>('Organic food processing effluent, non-toxic');

  // Document Attachment State - Default Empty State ([] to prevent data leakage)
  const [attachedDocs, setAttachedDocs] = useState<NocDocument[]>([]);
  const [aiAnalyzingDoc, setAiAnalyzingDoc] = useState<boolean>(false);
  const [submittedNoc, setSubmittedNoc] = useState<NocApplication | null>(null);

  if (!isOpen) return null;

  // Department Mapping
  const getNocDetails = (type: NocType) => {
    switch (type) {
      case 'FIRE_SAFETY':
        return {
          title: 'Fire Safety No-Objection Certificate (Provisional Fire NOC)',
          dept: 'Maharashtra Fire Services',
          desc: 'Statutory fire hazard assessment and emergency mitigation sanction.',
          icon: Flame,
          color: 'text-amber-600 bg-amber-50 border-amber-200'
        };
      case 'MPCB_CTE':
        return {
          title: 'MPCB Consent to Establish (CTE Environmental NOC)',
          dept: 'Maharashtra Pollution Control Board (MPCB)',
          desc: 'Environmental clearance for industrial effluent, air emissions & ETP setup.',
          icon: Leaf,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
        };
      case 'WATER_SUPPLY':
        return {
          title: 'MIDC Industrial Water Supply & Sewerage Connection NOC',
          dept: 'MIDC Infrastructure & Water Works',
          desc: 'Industrial water quota allocation and effluent discharge connection sanction.',
          icon: Droplets,
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'ELECTRICAL_SAFETY':
        return {
          title: 'High Voltage Electrical Grid Safety Inspectorate NOC',
          dept: 'Electrical Inspectorate / MSEDCL',
          desc: 'Substation, transformer earthing & HT load safety energization clearance.',
          icon: Zap,
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        };
    }
  };

  const details = getNocDetails(nocType);
  const IconComponent = details.icon;

  // Preset Statutory Documents mapping by NOC Type for easy user attachment
  const getPresetDocsForNoc = (type: NocType) => {
    switch (type) {
      case 'FIRE_SAFETY':
        return [
          { name: 'Approved Architectural CAD Layout Plan', cat: 'Building Sanction', notes: '6m perimeter fire tender access road & emergency exits confirmed.' },
          { name: 'MIDC Land Allotment Letter (Plot C-42)', cat: 'Land Ownership', notes: 'Verified plot allotment match with MIDC Chakan registry.' },
          { name: 'Fire Fighting System & Sprinkler Scheme Plan', cat: 'Fire Mitigation', notes: 'Dual electrical & diesel fire pumps detected.' }
        ];
      case 'MPCB_CTE':
        return [
          { name: 'Effluent Treatment Plant (ETP) Structural Flow Diagram', cat: 'Environmental Safety', notes: 'Zero Liquid Discharge (ZLD) parameters verified.' },
          { name: 'MIDC Land Allotment Letter (Plot C-42)', cat: 'Land Ownership', notes: 'Verified plot allotment match with MIDC Chakan registry.' },
          { name: 'Raw Material & Process Emission Breakdown Report', cat: 'Chemical Safety', notes: 'Hazardous substance limit within permissible MPCB norms.' }
        ];
      case 'WATER_SUPPLY':
        return [
          { name: 'MIDC Industrial Water Connection Blueprint', cat: 'Utility Layout', notes: 'Water demand matches 35 KLPD sanctioned quota.' },
          { name: 'MIDC Land Allotment Letter (Plot C-42)', cat: 'Land Ownership', notes: 'Property title verified.' }
        ];
      case 'ELECTRICAL_SAFETY':
        return [
          { name: 'High Tension (HT) Substation Earthing Layout', cat: 'Electrical Safety', notes: 'Earth resistance < 1 Ohm specification confirmed.' },
          { name: 'Electrical Single Line Diagram (SLD)', cat: 'Power Grid', notes: '11kV HT line circuit breaker ratings clear.' }
        ];
    }
  };

  // Trigger native browser file picker dialog
  const triggerNativeFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle actual file upload from native <input type="file">
  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const fileName = file.name;
    const fileSizeKb = (file.size / 1024).toFixed(1);
    
    // Auto-detect category based on extension or NOC type
    const category = fileName.toLowerCase().endsWith('.dwg') || fileName.toLowerCase().includes('cad') || fileName.toLowerCase().includes('plan')
      ? 'Architectural CAD'
      : fileName.toLowerCase().includes('land') || fileName.toLowerCase().includes('allotment')
      ? 'Land Ownership'
      : fileName.toLowerCase().includes('fire') || fileName.toLowerCase().includes('hydrant')
      ? 'Fire Mitigation'
      : fileName.toLowerCase().includes('etp') || fileName.toLowerCase().includes('pollution')
      ? 'Environmental Clearance'
      : 'Statutory Verification';

    const newDocId = `doc-${Date.now()}`;
    const newDoc: NocDocument = {
      docId: newDocId,
      docName: `${fileName} (${fileSizeKb} KB)`,
      category,
      uploadDate: new Date().toISOString().split('T')[0],
      aiValidationStatus: 'ANALYZING...',
      aiNotes: `Running AI OCR scan on binary file '${fileName}' (${fileSizeKb} KB)...`
    };

    setAttachedDocs(prev => [...prev, newDoc]);
    setAiAnalyzingDoc(true);

    // Reset file input value so user can re-upload same filename if needed
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Run simulated 1-second delayed AI validation check on user's real uploaded file
    setTimeout(() => {
      setAttachedDocs(prev =>
        prev.map(d => {
          if (d.docId === newDocId) {
            return {
              ...d,
              aiValidationStatus: 'VALIDATED',
              aiNotes: `AI OCR Check: Real file '${fileName}' (${fileSizeKb} KB) scanned. Stamp, surveyor signature & GIS plot boundary match confirmed.`
            };
          }
          return d;
        })
      );
      setAiAnalyzingDoc(false);
    }, 1000);
  };

  // Fallback preset document attachment option
  const handleSimulateAddDoc = (customName?: string, customCategory?: string) => {
    triggerNativeFilePicker();
  };

  const handleRemoveDoc = (docId: string) => {
    setAttachedDocs(prev => prev.filter(d => d.docId !== docId));
  };

  // Submit Handler
  const handleSubmitWizard = () => {
    const createdNoc = submitNocApplication({
      nocType,
      nocName: details.title,
      department: details.dept,
      urgency,
      technicalParameters: {
        builtUpAreaSqM,
        plotAreaSqM,
        fireMitigation: nocType === 'FIRE_SAFETY' ? {
          sprinklersCount,
          hydrantsCount,
          smokeAlarmsCount,
          hasFirePumps
        } : undefined,
        waterRequirementKlpd: nocType === 'WATER_SUPPLY' || nocType === 'MPCB_CTE' ? waterRequirementKlpd : undefined,
        effluentGenerationKlpd: nocType === 'MPCB_CTE' ? effluentGenerationKlpd : undefined,
        electricalLoadKw: nocType === 'ELECTRICAL_SAFETY' ? electricalLoadKw : undefined,
        voltageLevel: nocType === 'ELECTRICAL_SAFETY' ? voltageLevel : undefined,
        hazardousSubstanceDetails
      },
      documents: attachedDocs
    });

    setSubmittedNoc(createdNoc);
    setStep(4); // Move to real-time tracker
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="noc-wizard-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      {/* Hidden Native HTML File Input for Document Selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx"
        onChange={handleNativeFileUpload}
        className="hidden"
      />

      <div className="bg-white dark:bg-slate-800 max-w-3xl w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-900 via-mh-navy to-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h2 id="noc-wizard-title" className="text-lg font-extrabold text-white">
                Departmental No-Objection Certificate (NOC) Wizard
              </h2>
            </div>
            <p className="text-xs text-purple-200">
              Single-Window Direct Clearance • {activeProject.businessName} ({activeProject.district})
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-purple-200 hover:text-white p-1.5 rounded-lg hover:bg-purple-800/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Header */}
        <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          {[
            { s: 1, label: '1. NOC Selection' },
            { s: 2, label: '2. Technical Parameters' },
            { s: 3, label: '3. AI Document Validation' },
            { s: 4, label: '4. NOC Tracker' }
          ].map(st => (
            <div 
              key={st.s} 
              className={`flex items-center gap-1.5 font-bold ${
                step === st.s 
                  ? 'text-purple-900 dark:text-purple-300 font-extrabold' 
                  : step > st.s 
                  ? 'text-emerald-700 dark:text-emerald-400' 
                  : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === st.s 
                  ? 'bg-purple-900 text-white' 
                  : step > st.s 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step > st.s ? '✓' : st.s}
              </span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: NOC SELECTION & AUTO-FILL */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                Select NOC Category to File:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { type: 'FIRE_SAFETY' as NocType, title: 'Fire Safety NOC', dept: 'Maharashtra Fire Services', icon: Flame, badge: 'Prerequisite for Building & Factory License' },
                  { type: 'MPCB_CTE' as NocType, title: 'MPCB Consent to Establish (CTE)', dept: 'Maharashtra Pollution Control Board', icon: Leaf, badge: 'Prerequisite for Factory Construction' },
                  { type: 'WATER_SUPPLY' as NocType, title: 'Water Supply & Sewerage NOC', dept: 'MIDC Water Works', icon: Droplets, badge: 'Industrial Water Quota Allocation' },
                  { type: 'ELECTRICAL_SAFETY' as NocType, title: 'Electrical Safety Inspectorate NOC', dept: 'Electrical Inspectorate / MSEDCL', icon: Zap, badge: 'High Voltage HT Grid Energization' }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = nocType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setNocType(item.type)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-purple-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{item.dept}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[9px]">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auto-Filled Business Identity */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-purple-700" />
                  Auto-Filled Applicant Identity & Project Details
                </span>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Verified from MAITRI Master Profile
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Business Name</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{activeProject.businessName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Sector</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeProject.sector}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeProject.district} (MIDC {activeProject.midcArea})</span>
                </div>
              </div>
            </div>

            {/* Urgency Selection */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Processing Urgency Level:</span>
              <div className="flex gap-2">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      urgency === u
                        ? u === 'URGENT' ? 'bg-red-600 text-white' : u === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-purple-900 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {u} {u === 'URGENT' ? '(Fast-Track SLA)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
              >
                <span>Continue to Technical Parameters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TECHNICAL PARAMETERS */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${details.color}`}>
              <IconComponent className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white">{details.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{details.desc}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Plot Area ($m^2$) *
                  </label>
                  <input
                    type="number"
                    value={plotAreaSqM}
                    onChange={(e) => setPlotAreaSqM(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Factory Built-up Area ($m^2$) *
                  </label>
                  <input
                    type="number"
                    value={builtUpAreaSqM}
                    onChange={(e) => setBuiltUpAreaSqM(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Fire Safety Specific Inputs */}
              {nocType === 'FIRE_SAFETY' && (
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                  <div className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Fire Fighting System Equipment Breakdown</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Automatic Sprinklers</label>
                      <input
                        type="number"
                        value={sprinklersCount}
                        onChange={(e) => setSprinklersCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Fire Hydrants</label>
                      <input
                        type="number"
                        value={hydrantsCount}
                        onChange={(e) => setHydrantsCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Smoke Detectors</label>
                      <input
                        type="number"
                        value={smokeAlarmsCount}
                        onChange={(e) => setSmokeAlarmsCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFirePumps}
                      onChange={(e) => setHasFirePumps(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span>Dual Electrical & Diesel Standby Fire Pump House Installed</span>
                  </label>
                </div>
              )}

              {/* Water & MPCB Inputs */}
              {(nocType === 'WATER_SUPPLY' || nocType === 'MPCB_CTE') && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                  <div className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>Water Demand & Industrial Effluent Estimates</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Water Demand (KLPD - Kilo Litres/Day)</label>
                      <input
                        type="number"
                        value={waterRequirementKlpd}
                        onChange={(e) => setWaterRequirementKlpd(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Effluent Generation (KLPD)</label>
                      <input
                        type="number"
                        value={effluentGenerationKlpd}
                        onChange={(e) => setEffluentGenerationKlpd(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Electrical Safety Inputs */}
              {nocType === 'ELECTRICAL_SAFETY' && (
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>Electrical Grid Sanction & Voltage Level</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Sanctioned Electrical Load (kW)</label>
                      <input
                        type="number"
                        value={electricalLoadKw}
                        onChange={(e) => setElectricalLoadKw(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Voltage Tariff Category</label>
                      <select
                        value={voltageLevel}
                        onChange={(e) => setVoltageLevel(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                      >
                        <option value="11kV HT Connection">11kV High Tension (HT)</option>
                        <option value="22kV HT Connection">22kV High Tension (HT)</option>
                        <option value="33kV Substation">33kV Direct Substation</option>
                        <option value="415V LT Connection">415V Low Tension (LT Industrial)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
              >
                <span>Continue to AI Document Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DOCUMENT ATTACHMENT & AI VALIDATION */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-700" />
                  Mandatory Document Verification & AI OCR Check
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Documents are auto-checked by AI OCR for plot match, stamp validity, & architectural clearance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSimulateAddDoc()}
                disabled={aiAnalyzingDoc}
                className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer transition-all disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Attach New Document</span>
              </button>
            </div>

            {aiAnalyzingDoc && (
              <div className="p-4 rounded-xl bg-purple-900 text-white text-xs flex items-center gap-3 animate-pulse border border-purple-700 shadow-sm">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                <div>
                  <span className="font-extrabold text-white">PermitFlow AI OCR Scanner Active...</span>
                  <p className="text-[11px] text-purple-200">Scanning GIS plot boundaries, surveyor stamps, & title match.</p>
                </div>
              </div>
            )}

            {/* EMPTY STATE PROMPT when attachedDocs.length === 0 */}
            {attachedDocs.length === 0 ? (
              <div className="border-2 border-dashed border-purple-300 dark:border-purple-800/80 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mx-auto border border-purple-200">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">No Documents Attached Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Click <strong>"Attach New Document"</strong> to attach mandatory statutory files (e.g. Land Allotment Letter, Architectural CAD Layout, ETP Blueprint) and trigger real-time AI OCR verification.
                </p>
                
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateAddDoc()}
                    className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Attach Required Statutory Document</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Attached Docs List */
              <div className="space-y-3">
                {attachedDocs.map(doc => (
                  <div
                    key={doc.docId}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-purple-700 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100">{doc.docName}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-300 rounded font-semibold text-[10px]">
                            {doc.category}
                          </span>
                          <span>• Uploaded: {doc.uploadDate}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic leading-snug">
                          {doc.aiNotes}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border flex items-center gap-1 ${
                        doc.aiValidationStatus === 'VALIDATED' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : doc.aiValidationStatus === 'ANALYZING...'
                          ? 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {doc.aiValidationStatus === 'VALIDATED' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : doc.aiValidationStatus === 'ANALYZING...' ? (
                          <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{doc.aiValidationStatus}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.docId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
              <span>
                <strong>Verification Guarantee:</strong> Submitting verified documents unlocks automated <strong>Provisional NOC</strong> issuance upon joint inspection approval.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
              
              <div className="flex items-center gap-3">
                {attachedDocs.length === 0 && (
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-300">
                    ⚠️ Attach at least 1 document to enable submission
                  </span>
                )}

                <button
                  type="button"
                  disabled={attachedDocs.length === 0 || attachedDocs.some(d => d.aiValidationStatus === 'ANALYZING...')}
                  onClick={handleSubmitWizard}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-2 transition-all ${
                    attachedDocs.length === 0 || attachedDocs.some(d => d.aiValidationStatus === 'ANALYZING...')
                      ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit NOC Application</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REAL-TIME NOC TRACKER */}
        {step === 4 && submittedNoc && (
          <div className="p-6 space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">NOC Application Filed Successfully!</h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Application ID: <strong className="font-mono">{submittedNoc.id}</strong> • Assigned SLA Countdown: <strong>{submittedNoc.slaDaysLeft} Days</strong>
                </p>
              </div>
            </div>

            {/* Stepper Status Visualizer */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Real-Time NOC Lifecycle Tracker
              </h4>

              <div className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-900 space-y-6">
                {[
                  { title: 'Application Submitted', desc: 'Received by Departmental Nodal Officer', date: submittedNoc.appliedDate, done: true },
                  { title: 'AI Document Pre-Scrutiny', desc: 'All attached blueprints & certificates validated', date: submittedNoc.appliedDate, done: true },
                  { title: 'Joint Site Inspection Scheduling', desc: 'Multi-department joint survey date allocation', date: 'Pending Officer Action', done: false },
                  { title: 'Provisional NOC Issuance', desc: 'Instant provisional clearance for factory setup', date: 'Pending Inspection', done: false },
                  { title: 'Final NOC Grant', desc: 'Statutory certificate with digital signature & QR code', date: 'Final Approval Stage', done: false }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${item.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                      {item.done && <span className="block text-[10px] text-center font-bold">✓</span>}
                    </span>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                    <div className="text-[10px] font-mono text-purple-700 dark:text-purple-400 mt-0.5">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-mh-navy hover:bg-slate-800 text-white font-extrabold text-xs shadow-md"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
