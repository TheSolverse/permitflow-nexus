import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckSquare, 
  FileText, 
  Search, 
  Calendar, 
  CalendarClock, 
  Gift, 
  ShieldAlert, 
  HelpCircle, 
  ClipboardCheck, 
  MessageSquareText, 
  Sliders, 
  Bell, 
  Activity, 
  BarChart3, 
  Layers,
  ChevronRight,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { t } from '../../utils/translations';

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, language } = useApp();

  const entrepreneurNav = [
    { id: 'dashboard', label: t('dashboard', language), icon: LayoutDashboard },
    { id: 'new-project', label: t('newProject', language), icon: PlusCircle },
    { id: 'checklist', label: t('checklist', language), icon: CheckSquare },
    { id: 'documents', label: t('documents', language), icon: FileText },
    { id: 'applications', label: t('applications', language), icon: Search },
    { id: 'inspections', label: t('inspections', language), icon: Calendar },
    { id: 'compliance', label: t('compliance', language), icon: CalendarClock },
    { id: 'incentives', label: t('incentives', language), icon: Gift },
    { id: 'risk-score', label: t('riskScore', language), icon: ShieldAlert },
    { id: 'ai-assistant', label: 'Approval Helpdesk', icon: HelpCircle },
  ];

  const officerNav = [
    { id: 'officer-dashboard', label: t('officerDashboard', language), icon: LayoutDashboard },
    { id: 'officer-nocs', label: 'NOC & Joint Inspections', icon: ShieldCheck },
    { id: 'officer-app-review', label: t('appReview', language), icon: ClipboardCheck },
    { id: 'officer-queries', label: t('queryMgmt', language), icon: MessageSquareText },
    { id: 'officer-inspections', label: t('inspectionMgmt', language), icon: Calendar },
    { id: 'officer-analytics', label: t('analytics', language), icon: BarChart3 },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: t('adminDashboard', language), icon: LayoutDashboard },
    { id: 'admin-rules', label: t('rulesEngine', language), icon: Sliders },
    { id: 'admin-notifications', label: t('notifications', language), icon: Bell },
    { id: 'admin-audit', label: t('auditLogs', language), icon: Activity },
  ];

  const navItems = 
    currentUser.role === 'ENTREPRENEUR' ? entrepreneurNav :
    currentUser.role === 'OFFICER' ? officerNav : adminNav;

  return (
    <aside className="w-64 bg-white text-slate-700 min-h-[calc(100vh-4rem)] flex flex-col border-r border-sky-200/80 shrink-0 shadow-xs rounded-2xl overflow-hidden my-1">
      
      {/* Active Workspace Header - Light Blue Tint */}
      <div className="p-4 border-b border-sky-200/80 bg-gradient-to-r from-sky-50 via-blue-50/60 to-white">
        <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-800 mb-0.5">
          Active Portal Workspace
        </div>
        <div className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>
            {currentUser.role === 'ENTREPRENEUR' ? 'Entrepreneur Portal' :
             currentUser.role === 'OFFICER' ? (currentUser.department || 'Officer Desk') :
             'PFN Admin Console'}
          </span>
        </div>
        <div className="text-xs text-slate-600 truncate mt-0.5 font-medium">
          {currentUser.name}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-sky-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-600'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-200" />}
            </button>
          );
        })}
      </nav>

      {/* Official Department Tag */}
      <div className="p-4 m-3 rounded-xl bg-sky-50/80 border border-sky-200 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 text-blue-950 font-extrabold text-[11px]">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Single Window System
        </div>
        <p className="text-[11px] text-slate-600 leading-tight font-medium">
          Government of Maharashtra Industry Department Integration.
        </p>
      </div>

    </aside>
  );
};
