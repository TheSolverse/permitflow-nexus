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
    if (item.applicationId) {
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
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#2E6F40] text-white font-extrabold text-[10px] uppercase shadow-xs">
                Industry Selector & Rules Engine
              </span>
              <h2 className="font-extrabold text-sm text-[#192A1E] dark:text-[#E8F7ED]">Select Sector & Sub-Sector to Generate Approval Checklist</h2>
            </div>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
              Select any Maharashtra industry sector below (e.g., <strong className="text-[#2E6F40] font-extrabold">Manufacturing → Textiles</strong> or <strong className="text-[#2E6F40] font-extrabold">Food Processing → Edible Oil & Spices</strong>) to view exact statutory permissions & required licences.
            </p>
          </div>

          <div className="px-3.5 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] font-extrabold text-xs shrink-0 shadow-xs">
            {checklist.length} Required Clearances
          </div>
        </div>

        {/* 6 Sector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {MASTER_SECTOR_DATA.map((sec) => {
            const isSelected = selectedSector === sec.id;
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
                className={`p-3 rounded-xl border text-center transition-all text-xs font-extrabold cursor-pointer ${
                  isSelected
                    ? 'bg-[#2E6F40] text-white border-[#2E6F40] shadow-md scale-[1.02] ring-2 ring-[#68BA7F]/40'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-[#F8FCF9] hover:border-[#68BA7F] shadow-xs'
                }`}
              >
                <div>{sec.name}</div>
                <div className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-[#CFFFDC]' : 'text-slate-500'}`}>
                  {sec.subSectors.length} Sub-Sectors
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Sector Dropdown Selector */}
        {subSectorOptions.length > 0 && (
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-[#192A1E] dark:text-[#E8F7ED] shrink-0">
              <span className="font-extrabold uppercase text-[10px] text-[#2E6F40] dark:text-[#CFFFDC]">Sub-Sector ({selectedSector}):</span>
            </div>
            
            <select
              value={selectedSubSector}
              onChange={(e) => setSelectedSubSector(e.target.value)}
              className="w-full sm:w-auto flex-1 bg-[#F8FCF9] dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold border border-[#D4EEDC] dark:border-[#253D2C] rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#2E6F40] outline-none text-xs shadow-xs"
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

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold uppercase text-[10px] mr-1">Category Filter:</span>
        {categories.map(cat => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl border font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2E6F40] text-white border-[#2E6F40] shadow-xs'
                  : 'bg-[#F8FCF9] dark:bg-slate-900 text-[#192A1E] dark:text-[#E8F7ED] border-[#D4EEDC] dark:border-slate-700 hover:bg-[#E8F7ED]'
              }`}
            >
              {cat}
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
                        className="px-4 py-1.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
                      >
                        {item.status === 'Approved' ? 'View License' : item.status === 'Not Started' ? 'Apply Now' : 'Track App'}
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
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  {item.status === 'Approved' ? 'View' : 'Manage'}
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
