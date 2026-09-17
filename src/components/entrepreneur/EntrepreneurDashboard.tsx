import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  Bell
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateSmartChecklist } from '../../utils/rulesEngine';

import { ComplianceExpiryAlertModal } from './ComplianceExpiryAlertModal';

export const EntrepreneurDashboard: React.FC = () => {
  const { 
    currentUser, 
    projects,
    activeProject, 
    applications, 
    parallelPermissions,
    documents,
    complianceTasks, 
    jointInspections,
    incentiveSchemes,
    setActiveTab, 
    setSelectedAppDetail,
    language 
  } = useApp();

  const [isExpiryAlertOpen, setIsExpiryAlertOpen] = useState(false);

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

  const hasProjects = projects.length > 0 && !!activeProject?.id;
  const checklist = hasProjects ? generateSmartChecklist(activeProject, allUserApps) : [];
  const totalApprovals = checklist.length;

  const projectApps = allUserApps.filter(a => a.projectId === activeProject?.id);
  const approvedCount = checklist.filter(a => a.status === 'Approved').length;
  const underReviewCount = checklist.filter(a => a.status === 'Under Review' || a.status === 'Submitted' || a.status === 'Inspection Scheduled').length;
  
  // Real pending queries raised by officers from DB
  const realPendingQueries = projectApps.flatMap(app => 
    (app.queries || []).filter(q => q.status === 'OPEN').map(q => ({ app, query: q }))
  );
  
  // Real flagged / rejected documents by inspecting officers
  const flaggedDocs = (documents || []).filter(d => 
    d.projectId === activeProject?.id &&
    (d.status === 'Name Mismatch' || d.status === 'Expired' || d.status === 'Blurry / Unreadable')
  );

  const actionRequiredCount = realPendingQueries.length + flaggedDocs.length;
  const projectComplianceTasks = complianceTasks.filter(t => activeProject?.id && t.projectId === activeProject.id);
  const upcomingRenewalsCount = projectComplianceTasks.filter(t => t.status === 'DUE_SOON' || t.status === 'OVERDUE').length;

  // Trigger renewal alert popup on login ONLY IF the active project has tasks requiring attention
  useEffect(() => {
    if (!currentUser?.id || !activeProject?.id) return;
    const hasSeenRenewalModal = sessionStorage.getItem(`pfn_seen_renewal_${currentUser.id}_${activeProject.id}`);
    if (!hasSeenRenewalModal && upcomingRenewalsCount > 0) {
      setIsExpiryAlertOpen(true);
      sessionStorage.setItem(`pfn_seen_renewal_${currentUser.id}_${activeProject.id}`, 'true');
    }
  }, [currentUser?.id, activeProject?.id, upcomingRenewalsCount]);

  const completionPercentage = totalApprovals > 0 ? Math.round((approvedCount / totalApprovals) * 100) : 0;

  // Recharts dataset
  const chartData = totalApprovals > 0 ? [
    { name: 'Approved', value: approvedCount, color: '#2E6F40' },
    { name: 'Under Review', value: underReviewCount, color: '#68BA7F' },
    { name: 'Action Required', value: actionRequiredCount, color: '#D97706' },
    { name: 'Not Started', value: Math.max(0, totalApprovals - (approvedCount + underReviewCount + actionRequiredCount)), color: '#94A3B8' }
  ] : [
    { name: 'Not Started', value: 1, color: '#CBD5E1' }
  ];

  // Real deadlines & inspections from DB for active project
  const activeDeadlines = projectComplianceTasks.filter(t => t.status === 'DUE_SOON' || t.status === 'OVERDUE');
  const activeInspections = jointInspections.filter(i => i.status === 'SCHEDULED');

  // Real matching incentive scheme for the business sector
  const matchingScheme = (incentiveSchemes || []).find(s => 
    (s.tags && s.tags.includes(activeProject?.sector)) || s.eligibilityStatus === 'ELIGIBLE'
  );

  const hasProject = Boolean(activeProject && activeProject.id && activeProject.id.trim().length > 0);

  if (!hasProject) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 max-w-3xl mx-auto my-8 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-[#E8F7ED] dark:bg-[#1E3326] border border-[#68BA7F]/40 flex items-center justify-center mx-auto text-[#2E6F40] dark:text-[#68BA7F]">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome to PermitFlow Nexus!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
              To begin tracking government clearances, filing application permits, and viewing single-window analytics, please create your business project profile.
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Expiry Alert Pop-up Modal */}
      <ComplianceExpiryAlertModal 
        isOpen={isExpiryAlertOpen} 
        onClose={() => setIsExpiryAlertOpen(false)} 
      />
      
      {/* Rich Enterprise Welcome Banner - Plain Clean Box */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] rounded-2xl p-6 text-[#192A1E] dark:text-[#E8F7ED] border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs relative overflow-hidden transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CFFFDC]/60 dark:bg-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] text-xs font-extrabold mb-2 border border-[#68BA7F]/40 dark:border-[#68BA7F]">
              <Building2 className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#68BA7F]" />
              <span>Maharashtra Business Approval Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#253D2C] dark:text-white">
              {t('welcomeBack', language)}, {currentUser.name}!
            </h1>
            {hasProjects ? (
              <p className="text-xs sm:text-sm text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
                Active Project: <strong className="text-[#253D2C] dark:text-[#CFFFDC] font-extrabold">{activeProject.businessName}</strong> ({activeProject.sector}{activeProject.subSector ? ` • ${activeProject.subSector}` : ''} • {activeProject.midcArea})
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
                No active projects registered yet. Click <strong className="text-[#2E6F40] dark:text-[#CFFFDC] font-bold">"+ Add New Project"</strong> to set up your business profile.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {hasProjects && (
              <button
                onClick={() => setIsExpiryAlertOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Expiry Alerts</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('new-project')}
              className="px-3.5 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#CFFFDC]" />
              <span>{t('addProject', language)}</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E3326] hover:bg-[#F0FAF3] dark:hover:bg-[#253D2C] text-[#253D2C] dark:text-[#E8F7ED] border border-[#D4EEDC] dark:border-[#2A4736] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#68BA7F]" />
              <span>Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Approval Journey Progress Meter */}
        <div className="mt-6 pt-5 border-t border-[#D4EEDC] dark:border-[#2A4736]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#4A6B53] dark:text-[#A3D4B3]">{t('journeyCompletion', language)}</span>
            <span className="font-bold text-[#2E6F40] dark:text-[#68BA7F]">{completionPercentage}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-[#101A14] rounded-full overflow-hidden p-0.5 border border-[#D4EEDC] dark:border-[#2A4736] shadow-xs">
            <div
              className="h-full bg-[#2E6F40] rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flagged Document Alert for Entrepreneur */}
      {flaggedDocs.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm text-rose-950 dark:text-rose-100">
                  ⚠️ Action Required: {flaggedDocs.length} Proof Document{flaggedDocs.length > 1 ? 's' : ''} Flagged by Officer
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                  Immediate Attention
                </span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                The reviewing officer has identified discrepancies in: <strong className="text-rose-900 dark:text-white font-extrabold">{flaggedDocs.map(d => d.docName).join(', ')}</strong>. Please re-upload verified proofs in Document Centre.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setActiveTab('documents')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
          >
            <span>Resolve in Document Centre</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Onboarding Box if zero projects */}
      {!hasProjects && (
        <div className="p-6 rounded-2xl bg-[#F0FAF3] dark:bg-[#16261C] border-2 border-dashed border-[#68BA7F] dark:border-[#253D2C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#253D2C] dark:text-white">🚀 Set up your First Business Project</h3>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1">
              Register your business sector, investment scale, and district to generate your dynamic approval roadmap.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('new-project')}
            className="px-4 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#CFFFDC]" />
            <span>Create Business Project</span>
          </button>
        </div>
      )}

      {/* 5 Key Metric Cards - Plain Clean Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-[#D4EEDC] dark:border-[#2A4736] shadow-xs transition-colors">
          <div className="text-[11px] font-extrabold text-[#253D2C] dark:text-[#9CE0B2] uppercase tracking-wider">{t('totalApprovals', language)}</div>
          <div className="text-2xl font-extrabold text-[#192A1E] dark:text-white mt-1">{totalApprovals}</div>
          <div className="text-[10px] text-[#4A6B53] dark:text-[#68BA7F] mt-1 font-semibold">Required for setup</div>
        </div>

        <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-[#D4EEDC] dark:border-[#2E6F40] shadow-xs transition-colors">
          <div className="text-[11px] font-extrabold text-[#2E6F40] dark:text-[#CFFFDC] uppercase tracking-wider">{t('approved', language)}</div>
          <div className="text-2xl font-extrabold text-[#2E6F40] dark:text-[#CFFFDC] mt-1">{approvedCount}</div>
          <div className="text-[10px] text-[#4A6B53] dark:text-[#68BA7F] mt-1 font-semibold">{completionPercentage}% cleared</div>
        </div>

        <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-[#D4EEDC] dark:border-[#2A4736] shadow-xs transition-colors">
          <div className="text-[11px] font-extrabold text-[#4A6B53] dark:text-[#A3D4B3] uppercase tracking-wider">{t('underReview', language)}</div>
          <div className="text-2xl font-extrabold text-[#253D2C] dark:text-white mt-1">{underReviewCount}</div>
          <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-semibold">Processing with depts</div>
        </div>

        <div className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border border-rose-200/90 dark:border-rose-900 shadow-xs transition-colors">
          <div className="text-[11px] font-extrabold text-rose-900 dark:text-rose-300 uppercase tracking-wider">{t('actionRequired', language)}</div>
          <div className="text-2xl font-extrabold text-rose-900 dark:text-rose-200 mt-1">{actionRequiredCount}</div>
          <div className="text-[10px] text-rose-700 dark:text-rose-400 mt-1 font-semibold">Queries / missing docs</div>
        </div>

        <div 
          onClick={() => setIsExpiryAlertOpen(true)}
          className="bg-white dark:bg-[#16261C] p-4 rounded-2xl border-2 border-[#2E6F40]/40 dark:border-[#68BA7F]/40 hover:border-[#2E6F40] shadow-xs col-span-2 sm:col-span-1 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-extrabold text-[#2E6F40] dark:text-[#CFFFDC] uppercase tracking-wider">{t('upcomingRenewals', language)}</div>
            <span className="text-[10px] text-[#2E6F40] dark:text-[#CFFFDC] font-extrabold flex items-center gap-0.5 group-hover:underline">
              <span>View Alert</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#253D2C] dark:text-white mt-1">{upcomingRenewalsCount}</div>
          <div className="text-[10px] text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-semibold">
            {upcomingRenewalsCount > 0 ? `${upcomingRenewalsCount} items requiring action` : 'All clearances up to date'}
          </div>
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

            {realPendingQueries.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <p className="font-bold text-xs text-slate-700">No pending queries or actions required</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All applications in the database are currently clear with departments.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {realPendingQueries.map((item) => (
                  <div key={item.query.id} className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-amber-950">Department Query Raised - {item.app.approvalName}</span>
                      <p className="text-amber-900 mt-0.5">{item.query.queryText}</p>
                      {item.query.dueDate && (
                        <span className="text-[10px] font-semibold text-amber-700 block mt-1">Due Date: {item.query.dueDate}</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppDetail(item.app);
                        setActiveTab('applications');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold shrink-0 hover:bg-amber-800"
                    >
                      Respond
                    </button>
                  </div>
                ))}
              </div>
            )}
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

            {activeDeadlines.length === 0 && activeInspections.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 py-4">
                <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="font-bold text-xs text-slate-700">No upcoming statutory renewals</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Database contains no overdue tasks or pending site audits.</p>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {activeDeadlines.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{task.title || task.approvalName}</div>
                      <div className="text-[10px] text-slate-500">{task.department} • Due {task.dueDate}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                      {task.daysLeft} days left
                    </span>
                  </div>
                ))}
                {activeInspections.map((insp) => (
                  <div key={insp.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Joint Site Inspection</div>
                      <div className="text-[10px] text-slate-500">{insp.attendingDepartments?.join(' + ') || 'MPCB + DISH + Fire Dept'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                      {insp.scheduledDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eligible Incentives Highlight */}
          <div className="bg-white p-5 rounded-2xl text-slate-900 shadow-xs border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-700" />
                State Subsidy Alert
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                {matchingScheme ? matchingScheme.schemeName : 'Maharashtra State Policy'}
              </span>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {matchingScheme ? matchingScheme.schemeName : 'Industrial Subsidies & Incentives'}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {matchingScheme 
                  ? (matchingScheme.estimatedBenefit || matchingScheme.shortDesc)
                  : (hasProjects 
                      ? `Your ${activeProject.district || 'Maharashtra'} project qualifies for capital subsidies & SGST rebates under the state industrial policy.` 
                      : 'Create your enterprise profile to view verified state capital subsidies & tax rebates.')
                }
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

      {/* RENEWAL ALERT POPUP MODAL */}
      <ComplianceExpiryAlertModal
        isOpen={isExpiryAlertOpen}
        onClose={() => setIsExpiryAlertOpen(false)}
      />

    </div>
  );
};
