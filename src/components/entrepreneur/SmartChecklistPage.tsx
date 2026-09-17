import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSmartChecklist, getPhaseNumber } from '../../utils/rulesEngine';
import { 
  CheckSquare, 
  Clock, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  ChevronRight,
  GitMerge,
  ShieldCheck,
  Flame,
  Sparkles,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { MASTER_SECTOR_DATA } from '../../data/sectorData';
import { Sector, ApprovalStatus, NocType, SmartChecklistItem, Application } from '../../types';
import { NocApplicationWizardModal } from './NocApplicationWizardModal';
import { ApplyApprovalModal } from './ApplyApprovalModal';
import { ApplicationDetailModal } from './ApplicationDetailModal';

const PHASE_METADATA: Record<number, { title: string; desc: string; color: string; badge: string }> = {
  1: {
    title: 'Phase 1: Legal Entity & Identity Baseline',
    desc: 'Company Incorporation, GST, Udyam MSME, Professional Tax',
    color: 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
  },
  2: {
    title: 'Phase 2: MIDC Land & Building Infrastructure',
    desc: 'MIDC Building Plan Sanction & Architectural Layout Approval',
    color: 'border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
  },
  3: {
    title: 'Phase 3: Pre-Establishment Environment & Safety Clearances',
    desc: 'Provisional Fire NOC & MPCB Consent to Establish (CTE)',
    color: 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
  },
  4: {
    title: 'Phase 4: Factory Setup & Utilities Sanctions',
    desc: 'DISH Factory Licence, MSEDCL Power, MIDC Water, Electrical Safety',
    color: 'border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  },
  5: {
    title: 'Phase 5: Operating Licences & Sector Clearances',
    desc: 'FSSAI Food Licence, MPCB Consent to Operate (CTO), Labour EPFO/ESIC',
    color: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  }
};

export const SmartChecklistPage: React.FC = () => {
  const { 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    activeProject, 
    applications, 
    parallelPermissions, 
    documents, 
    applyForApproval, 
    setActiveTab, 
    selectedAppDetail, 
    setSelectedAppDetail,
    currentUser 
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'dependency'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL'); // Phase Dropdown filter state

  // Accordion state for phase collapse/expand (all open by default)
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  // Lock Warning Modal State
  const [lockWarningModal, setLockWarningModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const userProjects = currentUser?.role === 'ENTREPRENEUR'
    ? projects.filter(p => !p.userId || p.userId === currentUser.id)
    : projects;

  const hasProject = Boolean(activeProject && activeProject.id && activeProject.id.trim().length > 0 && userProjects.length > 0);

  if (!hasProject) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 max-w-3xl mx-auto my-8 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <Building2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            No Business Project Profile Created Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            You must create your business project profile first so PermitFlow Nexus can calculate your customized single-window clearance requirements across all 5 phases.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('new-project')}
          className="px-6 py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#CFFFDC]" />
          <span>+ Create New Business Project</span>
        </button>
      </div>
    );
  }

  // Sector & Sub-Sector Live Preview State
  const [selectedSector, setSelectedSector] = useState<Sector>(activeProject.sector || 'Manufacturing');
  const [selectedSubSector, setSelectedSubSector] = useState<string>(
    activeProject.subSector || 'Textiles (spinning, weaving, garment manufacturing)'
  );

  React.useEffect(() => {
    if (activeProject) {
      setSelectedSector(activeProject.sector || 'Manufacturing');
      setSelectedSubSector(activeProject.subSector || '');
    }
  }, [activeProject.id, activeProject.sector, activeProject.subSector]);

  // Application Modal State
  const [selectedApprovalForApply, setSelectedApprovalForApply] = useState<SmartChecklistItem | null>(null);

  // NOC Wizard Modal State
  const [isNocWizardOpen, setIsNocWizardOpen] = useState<boolean>(false);
  const [wizardNocType, setWizardNocType] = useState<NocType>('FIRE_SAFETY');

  // Dynamically generate smart checklist for selected sector & subsector (all 5 phases)
  const previewProject = {
    ...activeProject,
    sector: selectedSector,
    subSector: selectedSubSector
  };
  const allUserApps = [
    ...applications,
    ...parallelPermissions.map(p => ({
      id: p.id,
      approvalId: p.approvalId,
      approvalName: p.approvalName,
      status: p.status,
      projectId: p.projectId
    }))
  ];
  const checklist = generateSmartChecklist(previewProject, allUserApps);

  // Phase Lock Helper
  const isPhaseUnlocked = (phaseNum: number): boolean => {
    if (phaseNum <= 1) return true;
    if (phaseNum === 2) return checklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === 1).every(i => i.status === 'Approved');
    if (phaseNum === 3) return isPhaseUnlocked(2) && checklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === 2).every(i => i.status === 'Approved');
    if (phaseNum === 4) return isPhaseUnlocked(3) && checklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === 3).every(i => i.status === 'Approved');
    if (phaseNum === 5) return isPhaseUnlocked(4) && checklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === 4).every(i => i.status === 'Approved');
    return true;
  };

  const isPhase1Complete = isPhaseUnlocked(2);
  const isPhase2Complete = isPhaseUnlocked(3);
  const isPhase3Complete = isPhaseUnlocked(4);
  const isPhase4Complete = isPhaseUnlocked(5);

  // SLA Verification Timeline Calculations
  const totalSlaDays = checklist.reduce((acc, curr) => acc + (curr.estimatedTimelineDays || 15), 0);
  const maxCriticalPathDays = checklist.length > 0 ? Math.max(...checklist.map(c => c.estimatedTimelineDays || 15)) : 30;
  const avgDaysPerClearance = Math.round(totalSlaDays / (checklist.length || 1));

  const currentSectorConfig = MASTER_SECTOR_DATA.find(s => s.id === selectedSector);
  const subSectorOptions = currentSectorConfig ? currentSectorConfig.subSectors : [];

  const categories = ['ALL', 'Registration', 'Clearance', 'Safety', 'Environmental', 'Utility'];

  // Filter checklist by Category & Phase Dropdown Filter
  const filteredChecklist = checklist.filter(item => {
    const itemPhase = item.phaseNumber || getPhaseNumber(item.id);
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (selectedPhaseFilter !== 'ALL' && itemPhase !== Number(selectedPhaseFilter)) return false;
    return true;
  });

  const togglePhaseAccordion = (phaseNum: number) => {
    setExpandedPhases(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Under Review':
      case 'Submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Query Raised':
      case 'Documents Needed':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Inspection Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleApplyClick = (item: SmartChecklistItem) => {
    const phaseNum = item.phaseNumber || getPhaseNumber(item.id);
    const unlocked = isPhaseUnlocked(phaseNum);

    if (!unlocked || !item.canApply || item.phaseLockReason) {
      setLockWarningModal({
        isOpen: true,
        title: `🔒 Phase ${phaseNum} is Locked`,
        message: item.phaseLockReason || `Phase ${phaseNum} is locked. You must complete and obtain approval for all Phase ${phaseNum - 1} requirements before applying.`
      });
      return;
    }

    if (item.status === 'Rejected' || item.status === 'Not Started') {
      setSelectedApprovalForApply(item);
    } else {
      const parallelMatch = parallelPermissions.find(p => p.approvalId === item.id || p.approvalName.toLowerCase().trim() === item.name.toLowerCase().trim());
      const appMatch = applications.find(a => 
        (item.applicationId && a.id === item.applicationId) || 
        a.approvalId === item.id || 
        a.approvalName.toLowerCase().trim() === item.name.toLowerCase().trim()
      );

      const isApproved = item.status === 'Approved' || parallelMatch?.status === 'Approved' || appMatch?.status === 'Approved';
      const targetStatus: ApprovalStatus = isApproved ? 'Approved' : (item.status || appMatch?.status || parallelMatch?.status || 'Submitted');

      if (appMatch) {
        setSelectedAppDetail({
          ...appMatch,
          status: targetStatus
        });
      } else {
        const trackedApp: Application = {
          id: item.applicationId || `app-${Date.now()}`,
          appId: `PFN-2026-${item.department.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
          projectId: activeProject.id,
          businessName: activeProject.businessName,
          approvalId: item.id,
          approvalName: item.name,
          department: item.department,
          submissionDate: parallelMatch?.submittedDate || new Date().toISOString().split('T')[0],
          slaDeadlineDate: parallelMatch?.slaDeadlineDate || new Date(Date.now() + (item.estimatedTimelineDays || 15) * 86400000).toISOString().split('T')[0],
          slaDaysRemaining: parallelMatch?.slaDaysRemaining || item.estimatedTimelineDays || 15,
          status: targetStatus,
          officerAssigned: parallelMatch?.assignedOfficer || 'Department Desk Officer',
          timeline: parallelMatch?.activityHistory?.map(a => ({
            id: a.id,
            title: a.action,
            description: a.notes || `${a.department}: ${a.action}`,
            timestamp: a.timestamp,
            actor: a.actor,
            role: a.role as any
          })) || [
            {
              id: `t-1-${Date.now()}`,
              title: 'Application Submitted',
              description: 'Application submitted successfully to department portal.',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: currentUser.name,
              role: 'ENTREPRENEUR'
            },
            ...(isApproved ? [{
              id: `t-2-${Date.now()}`,
              title: 'Status Changed to Approved',
              description: 'All technical parameters and safety documentation verified and approved.',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: 'Department Officer',
              role: 'OFFICER' as const
            }] : [])
          ],
          queries: parallelMatch?.openQueries?.map(q => ({
            id: q.id,
            applicationId: item.applicationId || item.id,
            officerName: parallelMatch.assignedOfficer,
            department: item.department,
            queryCategory: q.queryCategory,
            queryText: q.queryText,
            raisedDate: q.raisedDate,
            dueDate: q.dueDate,
            status: 'OPEN' as const
          })) || [],
          documentIds: parallelMatch?.documentIds || documents.filter(d => d.projectId === activeProject.id).map(d => d.id),
          riskScore: item.riskImpact || 20,
          remarks: parallelMatch?.remarks
        };
        setSelectedAppDetail(trackedApp);
      }
    }
  };

  const getPhaseBadge = (id: string) => {
    const phaseNum = getPhaseNumber(id);
    const meta = PHASE_METADATA[phaseNum];
    return { 
      step: `Phase ${phaseNum}`, 
      name: meta ? meta.title.split(':')[1].trim() : `Phase ${phaseNum}`, 
      badge: meta ? meta.badge : 'bg-[#F0FAF3] text-[#2E6F40] border-[#D4EEDC]'
    };
  };

  return (
    <div className="space-y-6">
      
      {/* 1-Click Project Switcher: View Checklist Separately for Each Created Business Project */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📂</span>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Your Created Industry Projects ({userProjects.length})
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
              — Click any project to view its industry clearance checklist separately
            </span>
          </div>
          <button
            onClick={() => setActiveTab('new-project')}
            className="px-3.5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CFFFDC]" />
            <span>+ Add Another Industry Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          {userProjects.map((p) => {
            const isSelected = p.id === activeProject.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#F0FAF3] dark:bg-[#1E3326] border-[#2E6F40] dark:border-[#68BA7F] shadow-sm ring-2 ring-[#2E6F40]/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-black uppercase text-[#2E6F40] dark:text-[#68BA7F] truncate">
                      {p.sector || 'Industry'}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#2E6F40] dark:bg-[#68BA7F] shrink-0"></span>
                    )}
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {p.businessName}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>📍 {p.district || 'Maharashtra'}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {p.investmentRange || 'Standard Setup'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Header & Live Dynamic Sector Configuration Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        
        {/* Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E6F40] dark:text-[#68BA7F] mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>DYNAMIC INDUSTRY CLEARANCE ENGINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Smart Approval Checklist for <span className="text-[#2E6F40] dark:text-[#68BA7F]">{activeProject.businessName}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Phased 5-Stage Single Window approval roadmap tailored to {selectedSector} in {activeProject.district || 'Maharashtra'}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-extrabold">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-[#2E6F40] dark:text-[#68BA7F] shadow-xs' : 'text-slate-500'
                }`}
              >
                📋 Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-white dark:bg-slate-900 text-[#2E6F40] dark:text-[#68BA7F] shadow-xs' : 'text-slate-500'
                }`}
              >
                🎴 Cards View
              </button>
              <button
                onClick={() => setViewMode('dependency')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'dependency' ? 'bg-white dark:bg-slate-900 text-[#2E6F40] dark:text-[#68BA7F] shadow-xs' : 'text-slate-500'
                }`}
              >
                🔀 Phase Flow
              </button>
            </div>
          </div>
        </div>

        {/* Live Sector & Sub-Sector Dropdown Selector Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F8FCF9] dark:bg-[#16261C] p-4 sm:p-5 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C]">
          <div>
            <label className="block text-xs font-bold text-[#192A1E] dark:text-[#E8F7ED] mb-1.5">
              Select Industry Sector:
            </label>
            <select
              value={selectedSector}
              onChange={(e) => {
                const s = e.target.value as Sector;
                setSelectedSector(s);
                const cfg = MASTER_SECTOR_DATA.find(sec => sec.id === s);
                if (cfg && cfg.subSectors.length > 0) {
                  setSelectedSubSector(cfg.subSectors[0].name);
                }
              }}
              className="w-full bg-white dark:bg-slate-900 border border-[#D4EEDC] dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
            >
              {MASTER_SECTOR_DATA.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.subSectors.length} Sub-Sectors)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#192A1E] dark:text-[#E8F7ED] mb-1.5">
              Select Sub-Sector Activity:
            </label>
            <select
              value={selectedSubSector}
              onChange={(e) => setSelectedSubSector(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-[#D4EEDC] dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]"
            >
              {subSectorOptions.map(sub => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phase Navigation Bar & Phase Filter Dropdown Format */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-[#F0FAF3] dark:bg-[#16261C] p-4 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-black text-[#192A1E] dark:text-white shrink-0">
              <span className="text-base">📌</span>
              <span>Filter Phase View:</span>
            </div>

            {/* DROPDOWN SELECTOR FORMAT FOR PHASES */}
            <select
              value={selectedPhaseFilter}
              onChange={(e) => setSelectedPhaseFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-[#D4EEDC] dark:border-slate-700 text-[#192A1E] dark:text-white rounded-xl px-3 py-2 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-[#2E6F40] cursor-pointer"
            >
              <option value="ALL">🌐 All Phases (Show Full Stage 1 to 5 Roadmap)</option>
              <option value="1">Phase 1: Legal & Tax Setup (4 Approvals) - Unlocked 🔓</option>
              <option value="2">Phase 2: Building & Infrastructure (1 Approval) {isPhase1Complete ? '🔓 Unlocked' : '🔒 Locked'}</option>
              <option value="3">Phase 3: Pre-Establishment Clearances (2 Approvals) {isPhase2Complete ? '🔓 Unlocked' : '🔒 Locked'}</option>
              <option value="4">Phase 4: Factory Setup & Utilities (4 Approvals) {isPhase3Complete ? '🔓 Unlocked' : '🔒 Locked'}</option>
              <option value="5">Phase 5: Operating Licences & Sector Clearances (3 Approvals) {isPhase4Complete ? '🔓 Unlocked' : '🔒 Locked'}</option>
            </select>
          </div>

          <div className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] font-extrabold flex items-center gap-2">
            <span>Interlocking Rule:</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-black border border-amber-300">
              🔒 Phase [N] unlocks only when Phase [N-1] is 100% Approved
            </span>
          </div>
        </div>

      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0FAF3] to-white dark:from-[#1E3326] dark:to-slate-900 border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#2E6F40] text-white flex items-center justify-center text-xl shrink-0">
            📊
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-[#2E6F40] dark:text-[#68BA7F]">Total Required Permits</div>
            <div className="text-lg font-black text-[#192A1E] dark:text-white">{checklist.length} Clearances</div>
            <div className="text-[10px] text-slate-500 font-medium">Across all 5 Approval Phases</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xl shrink-0 border border-emerald-200/60 dark:border-emerald-800/40">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-[#2E6F40] dark:text-[#68BA7F]">Single Window Parallel SLA</div>
            <div className="text-lg font-black text-[#192A1E] dark:text-white">~{maxCriticalPathDays} Working Days</div>
            <div className="text-[10px] text-slate-500 font-medium">Fast-track multi-agency critical path</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xl shrink-0 border border-blue-200/60 dark:border-blue-800/40">
            ⏱️
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Average Clearance Time</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">~{avgDaysPerClearance} Days / Permit</div>
            <div className="text-[10px] text-slate-500 font-medium">Standard departmental turnaround</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center text-xl shrink-0 border border-amber-200/60 dark:border-amber-800/40">
            📅
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400">Cumulative SLA Days</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{totalSlaDays} Total Department Days</div>
            <div className="text-[10px] text-slate-500 font-medium">Across all {checklist.length} statutory permits</div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills with Emojis */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-extrabold uppercase text-[10px] mr-1 flex items-center gap-1">
          <span>🔍</span>
          <span>Category Filter:</span>
        </span>
        {categories.map(cat => {
          const isActive = categoryFilter === cat;
          const filterEmoji: Record<string, string> = {
            'ALL': '🌐 All Categories',
            'Registration': '📄 Legal Registrations',
            'Clearance': '🏗️ Building Clearances',
            'Safety': '🔥 Safety & DISH',
            'Environmental': '🌿 Pollution MPCB',
            'Utility': '⚡ Power & Water'
          };
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl border font-bold whitespace-nowrap transition-all duration-150 cursor-pointer text-xs flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#2E6F40] text-white border-[#2E6F40] shadow-xs scale-[1.02]'
                  : 'bg-[#F8FCF9] dark:bg-slate-900 text-[#192A1E] dark:text-[#E8F7ED] border-[#D4EEDC] dark:border-slate-700 hover:bg-[#E8F7ED]'
              }`}
            >
              {filterEmoji[cat] || cat}
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: DEPENDENCY GRAPH FLOW */}
      {viewMode === 'dependency' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-amber-600" />
              Interlocking 5-Phase Sequential Prerequisites Flow
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visualizes prerequisite approval chains across all 5 stages. Phase 2 unlocks only after Phase 1 is 100% approved.
            </p>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(phaseNum => {
              const meta = PHASE_METADATA[phaseNum];
              const phaseItems = checklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === phaseNum);
              const unlocked = isPhaseUnlocked(phaseNum);
              if (phaseItems.length === 0) return null;

              return (
                <div key={phaseNum} className={`p-4 rounded-2xl border space-y-3 ${meta ? meta.color : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{unlocked ? '🔓' : '🔒'}</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {meta ? meta.title : `Phase ${phaseNum}`}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      unlocked ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {unlocked ? 'Unlocked & Ready' : `🔒 Locked (Complete Phase ${phaseNum - 1} First)`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {phaseItems.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.department}</div>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW (GROUPED BY PHASE DROPDOWNS) */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(phaseNum => {
            const meta = PHASE_METADATA[phaseNum];
            const phaseItems = filteredChecklist.filter(i => (i.phaseNumber || getPhaseNumber(i.id)) === phaseNum);
            const isUnlocked = isPhaseUnlocked(phaseNum);
            const isExpanded = expandedPhases[phaseNum] ?? true;

            if (selectedPhaseFilter !== 'ALL' && Number(selectedPhaseFilter) !== phaseNum) {
              return null;
            }
            if (phaseItems.length === 0) return null;

            const approvedCount = phaseItems.filter(i => i.status === 'Approved').length;
            const isComplete = approvedCount === phaseItems.length && phaseItems.length > 0;

            return (
              <div key={phaseNum} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
                
                {/* PHASE DROPDOWN HEADER BAR */}
                <button
                  type="button"
                  onClick={() => togglePhaseAccordion(phaseNum)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors border-b ${
                    !isUnlocked 
                      ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50' 
                      : isComplete 
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                      : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 border ${
                      !isUnlocked 
                        ? 'bg-rose-100 text-rose-800 border-rose-300' 
                        : isComplete 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-[#2E6F40] text-white border-[#2E6F40]'
                    }`}>
                      {!isUnlocked ? <Lock className="w-4 h-4" /> : isComplete ? <CheckCircle2 className="w-4 h-4" /> : phaseNum}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {meta?.title || `Phase ${phaseNum}`}
                        </h3>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          ({approvedCount}/{phaseItems.length} Approved)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{meta?.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isUnlocked ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked (Complete Phase {phaseNum - 1} First)</span>
                      </span>
                    ) : isComplete ? (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Phase Completed</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F0FAF3] dark:bg-[#1E3326] text-[#2E6F40] dark:text-[#68BA7F] border border-[#D4EEDC] flex items-center gap-1">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Phase Unlocked & Active</span>
                      </span>
                    )}

                    <div className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* PHASE TABLE ITEMS (WHEN EXPANDED) */}
                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4 font-bold">Approval Name</th>
                          <th className="py-3 px-4 font-bold">Department</th>
                          <th className="py-3 px-4 font-bold">Category</th>
                          <th className="py-3 px-4 font-bold">SLA Timeline</th>
                          <th className="py-3 px-4 font-bold">Fee</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {phaseItems.map((item) => {
                          const phaseInfo = getPhaseBadge(item.id);
                          const itemUnlocked = isUnlocked && item.canApply && !item.phaseLockReason;

                          return (
                            <tr 
                              key={item.id} 
                              className={`transition-colors ${
                                !itemUnlocked 
                                  ? 'bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/50' 
                                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${phaseInfo.badge}`}>
                                    {phaseInfo.step} • {phaseInfo.name}
                                  </span>
                                  {item.prerequisiteBadge && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                      ⚡ {item.prerequisiteBadge}
                                    </span>
                                  )}
                                  {!itemUnlocked && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-rose-600" />
                                      <span>Locked</span>
                                    </span>
                                  )}
                                </div>
                                <div className="font-extrabold text-slate-900 dark:text-white text-xs">{item.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.whyRequired}</div>
                              </td>
                              <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium">
                                {item.department}
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-1 font-semibold">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{item.estimatedTimelineDays} Days</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                                {item.estimatedFee}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleApplyClick(item)}
                                  className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 justify-end ml-auto ${
                                    !itemUnlocked
                                      ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 hover:bg-slate-400 border border-slate-300 dark:border-slate-700'
                                      : item.status === 'Approved'
                                      ? 'bg-[#2E6F40] hover:bg-[#253D2C] text-white'
                                      : item.status === 'Rejected'
                                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-[#2E6F40] text-white'
                                  }`}
                                >
                                  {!itemUnlocked ? (
                                    <>
                                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                                      <span>Locked (Phase {phaseNum - 1})</span>
                                    </>
                                  ) : item.status === 'Approved' ? (
                                    'View License'
                                  ) : item.status === 'Rejected' ? (
                                    '🔄 Reapply Now'
                                  ) : item.status === 'Not Started' ? (
                                    'Apply Now'
                                  ) : (
                                    'Track App'
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 3: CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChecklist.map((item) => {
            const phaseNum = item.phaseNumber || getPhaseNumber(item.id);
            const isUnlocked = isPhaseUnlocked(phaseNum);

            return (
              <div key={item.id} className={`p-5 rounded-3xl border shadow-xs flex flex-col justify-between ${
                !isUnlocked ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      Phase {phaseNum} • {item.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.department}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {item.whyRequired}
                  </p>

                  <div className="mt-3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Required Documents:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.requiredDocs.map(d => (
                        <span key={d} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[10px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <span>Timeline: <strong className="text-slate-900 dark:text-white">{item.estimatedTimelineDays} days</strong></span> • 
                    <span className="ml-1">Fee: <strong className="text-slate-900 dark:text-white">{item.estimatedFee}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyClick(item)}
                    className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                      !isUnlocked
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                        : item.status === 'Approved'
                        ? 'bg-[#2E6F40] text-white'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-3.5 h-3.5 text-rose-500" /> : null}
                    <span>{!isUnlocked ? `Locked (Phase ${phaseNum - 1})` : item.status === 'Approved' ? 'View License' : 'Apply Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interlocking Phase Lock Warning Alert Modal */}
      {lockWarningModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/60 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl border border-rose-300">
              🔒
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {lockWarningModal.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900/50">
                {lockWarningModal.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLockWarningModal({ isOpen: false, title: '', message: '' })}
              className="w-full py-3 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Understood (Return to Phase 1)
            </button>
          </div>
        </div>
      )}

      {/* NOC Application Wizard Modal */}
      <NocApplicationWizardModal
        isOpen={isNocWizardOpen}
        onClose={() => setIsNocWizardOpen(false)}
        initialNocType={wizardNocType}
      />

      {/* Interactive Application & Document Upload Modal */}
      <ApplyApprovalModal
        isOpen={!!selectedApprovalForApply}
        onClose={() => setSelectedApprovalForApply(null)}
        approvalItem={selectedApprovalForApply}
        onSuccess={() => {
          setActiveTab('applications');
        }}
      />

      {/* Focused Officer Application Tracking Detail Modal */}
      {selectedAppDetail && (
        <ApplicationDetailModal
          app={selectedAppDetail}
          onClose={() => setSelectedAppDetail(null)}
        />
      )}

    </div>
  );
};
