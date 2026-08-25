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
  GitMerge
} from 'lucide-react';
import { ApprovalStatus } from '../../types';

export const SmartChecklistPage: React.FC = () => {
  const { activeProject, applications, applyForApproval, setActiveTab, setSelectedAppDetail } = useApp();
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'dependency'>('table');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const checklist = generateSmartChecklist(activeProject, applications);

  const categories = ['ALL', 'Registration', 'Clearance', 'Safety', 'Environmental', 'Utility'];

  const filteredChecklist = categoryFilter === 'ALL'
    ? checklist
    : checklist.filter(item => item.category === categoryFilter);

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

  const handleApplyClick = (item: typeof checklist[0]) => {
    if (item.applicationId) {
      const match = applications.find(a => a.id === item.applicationId);
      if (match) {
        setSelectedAppDetail(match);
        setActiveTab('applications');
      }
    } else {
      applyForApproval(item.id, item.name, item.department);
      setActiveTab('applications');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">Smart Approval Checklist</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              Rules Engine Generated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized for <strong className="text-slate-800">{activeProject.businessName}</strong> ({activeProject.sector} • {activeProject.investmentRange})
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}
          >
            Grid Cards
          </button>
          <button
            onClick={() => setViewMode('dependency')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${viewMode === 'dependency' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Dependency Flow</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">Category Filter:</span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
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

    </div>
  );
};
