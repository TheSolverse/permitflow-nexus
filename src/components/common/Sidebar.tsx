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
  GitMerge,
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
    { id: 'ai-assistant', label: t('approvalHelpdesk', language), icon: HelpCircle },
  ];

  const officerNav = [
    { id: 'officer-dashboard', label: t('officerDashboard', language), icon: LayoutDashboard },
    { id: 'officer-nocs', label: t('nocJointInspections', language), icon: ShieldCheck },
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
    currentUser.role === 'ADMIN' ? adminNav : officerNav;

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-[#16261C] text-[#253D2C] dark:text-[#E8F7ED] min-h-[calc(100vh-4rem)] flex-col border-r border-[#D4EEDC] dark:border-[#253D2C] shrink-0 shadow-xs rounded-2xl overflow-hidden my-1 transition-colors duration-200">
      
      {/* Active Workspace Header - Plain Clean Box */}
      <div className="p-4 border-b border-[#D4EEDC] dark:border-[#253D2C] bg-white dark:bg-[#16261C]">
        <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#2E6F40] dark:text-[#68BA7F] mb-0.5">
          {t('activeWorkspace', language)}
        </div>
        <div className="font-bold text-sm text-[#253D2C] dark:text-white truncate flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
          <span>
            {currentUser.role === 'ENTREPRENEUR' ? t('entrepreneurPortal', language) :
             currentUser.role === 'OFFICER' ? (currentUser.department || t('officerDesk', language)) :
             t('adminConsole', language)}
          </span>
        </div>
        <div className="text-xs text-[#60826A] dark:text-[#A3D4B3] truncate mt-0.5 font-medium">
          {currentUser.name}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider text-[#60826A] dark:text-[#68BA7F] uppercase">
          {t('mainMenu', language)}
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
                  ? 'bg-[#2E6F40] text-white shadow-xs'
                  : 'text-[#253D2C] dark:text-[#D1E8DA] hover:text-[#2E6F40] dark:hover:text-white hover:bg-[#F4FAF6] dark:hover:bg-[#1E3326]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'text-[#CFFFDC]' : 'text-[#68BA7F] dark:text-[#68BA7F] group-hover:text-[#2E6F40] dark:group-hover:text-[#CFFFDC]'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#CFFFDC]" />}
            </button>
          );
        })}
      </nav>

      {/* Official Department Tag */}
      <div className="p-4 m-3 rounded-xl bg-[#CFFFDC]/25 dark:bg-[#1E3326] border border-[#D4EEDC] dark:border-[#2A4736] text-xs text-[#253D2C] dark:text-[#D1E8DA] space-y-1">
        <div className="flex items-center gap-1.5 text-[#2E6F40] dark:text-[#CFFFDC] font-extrabold text-[11px]">
          <Layers className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#68BA7F]" />
          Single Window System
        </div>
        <p className="text-[11px] text-[#4A6B53] dark:text-[#A3D4B3] leading-tight font-medium">
          Government of Maharashtra Industry Department Integration.
        </p>
      </div>

    </aside>
  );
};
