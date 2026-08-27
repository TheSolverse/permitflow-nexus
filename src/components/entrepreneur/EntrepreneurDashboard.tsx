import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlusCircle, 
  CheckSquare, 
  Gift, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Building2,
  FileText,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateSmartChecklist } from '../../utils/rulesEngine';

import { ComplianceExpiryAlertModal } from './ComplianceExpiryAlertModal';

export const EntrepreneurDashboard: React.FC = () => {
  const { 
    currentUser, 
    activeProject, 
    applications, 
    complianceTasks, 
    setActiveTab, 
    language 
  } = useApp();

  const [isExpiryAlertOpen, setIsExpiryAlertOpen] = useState(false);

  const checklist = generateSmartChecklist(activeProject, applications);
  const totalApprovals = checklist.length;

  const approvedCount = checklist.filter(c => c.status === 'Approved').length;
  const underReviewCount = checklist.filter(c => c.status === 'Under Review' || c.status === 'Submitted' || c.status === 'Inspection Scheduled').length;
  const actionRequiredCount = checklist.filter(c => c.status === 'Query Raised' || c.status === 'Documents Needed').length;
  const upcomingRenewalsCount = complianceTasks.filter(t => t.status === 'DUE_SOON' || t.status === 'OVERDUE').length;

  const completionPercentage = Math.round((approvedCount / Math.max(totalApprovals, 1)) * 100);

  // Recharts dataset
  const chartData = [
    { name: 'Approved', value: approvedCount, color: '#10B981' },
    { name: 'Under Review', value: underReviewCount, color: '#2563EB' },
    { name: 'Action Required', value: actionRequiredCount, color: '#D97706' },
    { name: 'Not Started', value: totalApprovals - (approvedCount + underReviewCount + actionRequiredCount), color: '#94A3B8' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Expiry Alert Pop-up Modal */}
      <ComplianceExpiryAlertModal 
        isOpen={isExpiryAlertOpen} 
        onClose={() => setIsExpiryAlertOpen(false)} 
      />
      
      {/* Rich Enterprise Welcome Banner - Amber & Indigo Gradient */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-50/50 to-white rounded-2xl p-6 text-slate-900 border border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-extrabold mb-2 border border-amber-300/80">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Maharashtra Business Approval Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {t('welcomeBack', language)}, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Active Project: <strong className="text-slate-900 font-extrabold">{activeProject.businessName}</strong> ({activeProject.sector}{activeProject.subSector ? ` • ${activeProject.subSector}` : ''} • {activeProject.midcArea})
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsExpiryAlertOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
              <span>Expiry Alert Pop-up</span>
            </button>
            <button
              onClick={() => setActiveTab('new-project')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('addProject', language)}</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
              <span>Approval Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Approval Journey Progress Meter */}
        <div className="mt-6 pt-5 border-t border-amber-200/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700">{t('journeyCompletion', language)}</span>
            <span className="font-extrabold text-amber-700">{completionPercentage}% Complete</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden p-0.5 border border-amber-300/80 shadow-xs">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards - Distinct Professional Light Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-gradient-to-br from-indigo-50/80 to-white p-4 rounded-2xl border border-indigo-200/90 shadow-xs">
          <div className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider">{t('totalApprovals', language)}</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalApprovals}</div>
          <div className="text-[10px] text-indigo-700 mt-1 font-semibold">Required for setup</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50/80 to-white p-4 rounded-2xl border border-blue-200/90 shadow-xs">
          <div className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider">{t('approved', language)}</div>
          <div className="text-2xl font-extrabold text-blue-900 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-blue-700 mt-1 font-semibold">{Math.round((approvedCount/totalApprovals)*100)}% cleared</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50/80 to-white p-4 rounded-2xl border border-amber-200/90 shadow-xs">
          <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider">{t('underReview', language)}</div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{underReviewCount}</div>
          <div className="text-[10px] text-amber-700 mt-1 font-semibold">Processing with depts</div>
        </div>

        <div className="bg-gradient-to-br from-rose-50/80 to-white p-4 rounded-2xl border border-rose-200/90 shadow-xs">
          <div className="text-[11px] font-extrabold text-rose-900 uppercase tracking-wider">{t('actionRequired', language)}</div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">{actionRequiredCount}</div>
          <div className="text-[10px] text-rose-700 mt-1 font-semibold">Queries / missing docs</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50/80 to-white p-4 rounded-2xl border border-purple-200/90 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-extrabold text-purple-900 uppercase tracking-wider">{t('upcomingRenewals', language)}</div>
          <div className="text-2xl font-extrabold text-purple-900 mt-1">{upcomingRenewalsCount}</div>
          <div className="text-[10px] text-purple-700 mt-1 font-semibold">Factory Licence in 30d</div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Approvals Status Chart & Pending Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Breakdown & Recharts Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Approval Status Breakdown</h3>
                <p className="text-xs text-slate-500">Live distribution of required licenses for {activeProject.businessName}</p>
              </div>
              <button
                onClick={() => setActiveTab('checklist')}
                className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
              >
                <span>View Full Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Actions Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pending Actions ({actionRequiredCount})
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-amber-950">Department Query Raised - MPCB Pollution CTE</span>
                  <p className="text-amber-900 mt-0.5">
                    Dr. V. K. Patil requested revised ETP capacity engineering drawings for spice washwater. Response due by 2026-09-01.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold shrink-0 hover:bg-amber-800"
                >
                  Respond
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-blue-950">Missing Document - Fire Safety Audit</span>
                  <p className="text-blue-900 mt-0.5">
                    Upload Form B Fire Safety Certificate to clear Fire NOC review.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 text-white font-bold shrink-0 hover:bg-blue-800"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Deadlines, Incentives & Shortcuts */}
        <div className="space-y-6">
          
          {/* Quick Action Buttons */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">{t('quickActions', language)}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('new-project')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center gap-2 text-slate-800"
              >
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center gap-2 text-slate-800"
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>View Checklist</span>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center gap-2 text-slate-800"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Upload Doc</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center gap-2 text-slate-800"
              >
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Helpdesk</span>
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Deadlines</h3>
              <button onClick={() => setActiveTab('compliance')} className="text-xs text-slate-900 font-bold hover:underline">
                Calendar
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Factory Licence Renewal</div>
                  <div className="text-[10px] text-slate-500">DISH Maharashtra • Form 1</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                  In 30 days
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Joint Site Inspection</div>
                  <div className="text-[10px] text-slate-500">MPCB + DISH + Fire Dept</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                  2026-09-02
                </span>
              </div>
            </div>
          </div>

          {/* Eligible Incentives Highlight */}
          <div className="bg-white p-5 rounded-2xl text-slate-900 shadow-xs border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-700" />
                State Subsidy Alert
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                PSI 2019 Scheme
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">₹45,00,000 Capital Subsidy Eligible</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Your Chakan MIDC Food Processing unit qualifies for 80% SGST refund + capital grant.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('incentives')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Schemes & Apply</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
