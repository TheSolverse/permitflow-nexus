import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSmartChecklist } from '../../utils/rulesEngine';
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
  Sparkles
} from 'lucide-react';
import { MASTER_SECTOR_DATA } from '../../data/sectorData';
import { Sector, ApprovalStatus, NocType, SmartChecklistItem } from '../../types';
import { NocApplicationWizardModal } from './NocApplicationWizardModal';
import { ApplyApprovalModal } from './ApplyApprovalModal';

export const SmartChecklistPage: React.FC = () => {
  const { activeProject, applications, applyForApproval, setActiveTab, setSelectedAppDetail } = useApp();
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'dependency'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Sector & Sub-Sector Live Preview State
  const [selectedSector, setSelectedSector] = useState<Sector>(activeProject.sector || 'Manufacturing');
  const [selectedSubSector, setSelectedSubSector] = useState<string>(
    activeProject.subSector || 'Textiles (spinning, weaving, garment manufacturing)'
  );

  // Application Modal State
  const [selectedApprovalForApply, setSelectedApprovalForApply] = useState<SmartChecklistItem | null>(null);

  // NOC Wizard Modal State
  const [isNocWizardOpen, setIsNocWizardOpen] = useState<boolean>(false);
  const [wizardNocType, setWizardNocType] = useState<NocType>('FIRE_SAFETY');

  // Dynamically generate smart checklist for selected sector & subsector
  const previewProject = {
    ...activeProject,
    sector: selectedSector,
    subSector: selectedSubSector
  };
  const checklist = generateSmartChecklist(previewProject, applications);

  // SLA Verification Timeline Calculations
  const totalSlaDays = checklist.reduce((acc, curr) => acc + (curr.estimatedTimelineDays || 15), 0);
  const maxCriticalPathDays = checklist.length > 0 ? Math.max(...checklist.map(c => c.estimatedTimelineDays || 15)) : 30;
  const avgDaysPerClearance = Math.round(totalSlaDays / (checklist.length || 1));

  const currentSectorConfig = MASTER_SECTOR_DATA.find(s => s.id === selectedSector);
  const subSectorOptions = currentSectorConfig ? currentSectorConfig.subSectors : [];

  const categories = ['ALL', 'Registration', 'Clearance', 'Safety', 'Environmental', 'Utility'];

  const filteredChecklist = categoryFilter === 'ALL'
    ? checklist
    : checklist.filter(item => item.category === categoryFilter);

  const openNocWizardForType = (type?: NocType) => {
    if (type) setWizardNocType(type);
    setIsNocWizardOpen(true);
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
    if (item.status === 'Rejected') {
      // Reapply from scratch
      setSelectedApprovalForApply(item);
    } else if (item.applicationId) {
      const match = applications.find(a => a.id === item.applicationId);
      if (match) {
        setSelectedAppDetail(match);
        setActiveTab('applications');
      }
    } else {
      // Open interactive application & document upload modal
      setSelectedApprovalForApply(item);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Plain Clean Box */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-5 sm:p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#253D2C] dark:text-white leading-tight">
              Smart Approval Checklist
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-[#2E6F40] text-white text-[11px] font-extrabold shadow-xs shrink-0">
              Rules Engine Generated
            </span>
          </div>
          <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] font-medium leading-normal">
            Personalized for <strong className="text-[#253D2C] dark:text-[#CFFFDC] font-extrabold">{activeProject.businessName}</strong> ({activeProject.sector}{activeProject.subSector ? ` • ${activeProject.subSector}` : ''} • {activeProject.investmentRange})
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => openNocWizardForType('FIRE_SAFETY')}
            className="px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-[#CFFFDC]" />
            <span>Apply for Departmental NOC</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Grid Cards
            </button>
            <button
              onClick={() => setViewMode('dependency')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'dependency' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Dependency Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Sector & Sub-Sector Switcher Card */}
      <div className="bg-gradient-to-r from-[#F8FCF9] to-[#EDF8F1] dark:from-[#16261C] dark:to-[#122017] p-5 sm:p-6 rounded-3xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-sm space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4EEDC]/60 dark:border-[#253D2C] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#2E6F40] text-white font-extrabold text-[10px] tracking-wide uppercase shadow-xs flex items-center gap-1">
                <span>⚡</span>
                <span>Smart Rules Engine</span>
              </span>
              <h2 className="font-extrabold text-sm sm:text-base text-[#192A1E] dark:text-[#E8F7ED] flex items-center gap-1.5">
                <span>🏭</span>
                <span>Select Industry Sector</span>
              </h2>
            </div>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] font-medium">
              Pick your sector to generate exact statutory permits & licences.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] font-extrabold text-xs shrink-0 shadow-xs">
            <span>📋</span>
            <span>{checklist.length} Clearances Required</span>
          </div>
        </div>

        {/* 6 Attractive Sector Cards with Emojis */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {MASTER_SECTOR_DATA.map((sec) => {
            const isSelected = selectedSector === sec.id;
            const metaMap: Record<string, { emoji: string; label: string }> = {
              'Manufacturing': { emoji: '🏭', label: 'Manufacturing' },
              'Packaging': { emoji: '📦', label: 'Packaging' },
              'Services': { emoji: '💼', label: 'Services' },
              'Food Processing': { emoji: '🥗', label: 'Food & Agro' },
              'Retail': { emoji: '🛒', label: 'Retail' },
              'IT / IT-enabled Services': { emoji: '💻', label: 'IT & Tech' }
            };
            const meta = metaMap[sec.id] || { emoji: '🏢', label: sec.name };

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setSelectedSector(sec.id);
                  if (sec.subSectors.length > 0) {
                    setSelectedSubSector(sec.subSectors[0].name);
                  }
                }}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-[#2E6F40] text-white border-[#2E6F40] shadow-md scale-[1.03] ring-2 ring-[#68BA7F]/40'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:bg-[#F0FAF3] hover:border-[#68BA7F] hover:scale-[1.01] shadow-xs'
                }`}
              >
                <div className="text-xl sm:text-2xl">{meta.emoji}</div>
                <div className="text-xs font-extrabold leading-tight">{meta.label}</div>
                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-[#CFFFDC]' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {sec.subSectors.length} Types
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Sector Dropdown Selector */}
        {subSectorOptions.length > 0 && (
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-[#192A1E] dark:text-[#E8F7ED] shrink-0 font-extrabold">
              <span className="text-sm">🎯</span>
              <span className="uppercase text-[11px] text-[#2E6F40] dark:text-[#CFFFDC]">Sub-Sector:</span>
            </div>
            
            <select
              value={selectedSubSector}
              onChange={(e) => setSelectedSubSector(e.target.value)}
              className="w-full sm:w-auto flex-1 bg-[#F8FCF9] dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#2E6F40] outline-none text-xs shadow-xs cursor-pointer"
            >
              {subSectorOptions.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ================= ESTIMATED VERIFICATION TIMELINE SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-[#F8FCF9] dark:from-slate-900 dark:to-slate-950 border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#2E6F40] dark:text-[#CFFFDC] flex items-center justify-center text-xl shrink-0 border border-emerald-200/60 dark:border-emerald-800/40">
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
          <span>Filter:</span>
        </span>
        {categories.map(cat => {
          const isActive = categoryFilter === cat;
          const filterEmoji: Record<string, string> = {
            'ALL': '🌐 All',
            'Pre-Establishment': '🏗️ Pre-Setup',
            'Pre-Operation': '⚙️ Operations',
            'Incentives': '💰 Subsidies',
            'Post-Operation': '🛡️ Compliance'
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

      {/* VIEW MODE 1: DEPENDENCY GRAPH (Light Theme) */}
      {viewMode === 'dependency' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-amber-600" />
              Sequential Approval Prerequisites Flow
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visualizes prerequisite approval chains. Building plans & Fire NOCs must be cleared before Factory & Pollution operating licences.
            </p>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-6">
            
            {/* Stage 1 */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 1: Legal Entity & Identity Baseline</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {checklist.filter(i => i.id === 'appr-1' || i.id === 'appr-2' || i.id === 'appr-3').map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.department}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300">Cleared</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 2 */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 2: Construction & Fire Safety Prerequisites</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklist.filter(i => i.id === 'appr-5' || i.id === 'appr-6').map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-amber-300 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.department}</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 3 */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 3: Operational Safety & Environmental Clearances</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {checklist.filter(i => i.id === 'appr-7' || i.id === 'appr-8' || i.id === 'appr-12').map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.department}</div>
                      <div className="text-[9px] text-amber-700 font-semibold mt-1">Requires Building & Fire NOC</div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Approval Name</th>
                  <th className="py-3.5 px-4 font-bold">Department</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">SLA Timeline</th>
                  <th className="py-3.5 px-4 font-bold">Fee</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChecklist.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.whyRequired}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {item.department}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      <div className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.estimatedTimelineDays} Days</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {item.estimatedFee}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleApplyClick(item)}
                        className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer ${
                          item.status === 'Approved'
                            ? 'bg-[#2E6F40] hover:bg-[#253D2C] text-white'
                            : item.status === 'Rejected'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : item.status === 'Not Started'
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {item.status === 'Approved' ? 'View License' : item.status === 'Rejected' ? '🔄 Reapply Now' : item.status === 'Not Started' ? 'Apply Now' : 'Track App'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChecklist.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.department}</p>
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {item.whyRequired}
                </p>

                <div className="mt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Required Documents:</div>
                  <div className="flex flex-wrap gap-1">
                    {item.requiredDocs.map(d => (
                      <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  <span>Timeline: <strong className="text-slate-900">{item.estimatedTimelineDays} days</strong></span> • 
                  <span className="ml-1">Fee: <strong className="text-slate-900">{item.estimatedFee}</strong></span>
                </div>
                <button
                  onClick={() => handleApplyClick(item)}
                  className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    item.status === 'Approved'
                      ? 'bg-[#2E6F40] hover:bg-[#253D2C] text-white'
                      : item.status === 'Rejected'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {item.status === 'Approved' ? 'View License' : item.status === 'Rejected' ? '🔄 Reapply Now' : 'Manage'}
                </button>
              </div>
            </div>
          ))}
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

    </div>
  );
};
