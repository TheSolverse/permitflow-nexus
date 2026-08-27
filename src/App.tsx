import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';

// Entrepreneur Components
import { EntrepreneurDashboard } from './components/entrepreneur/EntrepreneurDashboard';
import { NewProjectForm } from './components/entrepreneur/NewProjectForm';
import { SmartChecklistPage } from './components/entrepreneur/SmartChecklistPage';
import { DocumentCentrePage } from './components/entrepreneur/DocumentCentrePage';
import { ApplicationTrackerPage } from './components/entrepreneur/ApplicationTrackerPage';
import { InspectionPlannerPage } from './components/entrepreneur/InspectionPlannerPage';
import { ComplianceCalendarPage } from './components/entrepreneur/ComplianceCalendarPage';
import { IncentiveFinderPage } from './components/entrepreneur/IncentiveFinderPage';
import { RiskScorePage } from './components/entrepreneur/RiskScorePage';
import { AiAssistantPage } from './components/entrepreneur/AiAssistantPage';

// Officer Components
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { OfficerQueryPage } from './components/officer/OfficerQueryPage';
import { OfficerInspectionPage } from './components/officer/OfficerInspectionPage';
import { SlaAnalyticsPage } from './components/officer/SlaAnalyticsPage';
import { OfficerNocManagementPage } from './components/officer/OfficerNocManagementPage';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RulesEngineManager } from './components/admin/RulesEngineManager';
import { NotificationCentrePage } from './components/admin/NotificationCentrePage';
import { AuditLogsPage } from './components/admin/AuditLogsPage';

import { ComplianceExpiryAlertModal } from './components/entrepreneur/ComplianceExpiryAlertModal';

export const MainContent: React.FC = () => {
  const { activeTab, currentUser } = useApp();
  const [showExpiryModal, setShowExpiryModal] = React.useState<boolean>(false);

  if (activeTab === 'landing') return <LandingPage />;
  if (activeTab === 'login') return <LoginPage />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1B13] text-[#192A1E] dark:text-[#E8F7ED] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      {/* Entrepreneur Statutory Certificate & Expiry Alert Modal (Only if opened explicitly) */}
      {currentUser.role === 'ENTREPRENEUR' && showExpiryModal && (
        <ComplianceExpiryAlertModal 
          isOpen={showExpiryModal}
          onClose={() => setShowExpiryModal(false)}
        />
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0 overflow-x-hidden">
          {/* Entrepreneur View Tabs */}
          {activeTab === 'dashboard' && <EntrepreneurDashboard />}
          {activeTab === 'new-project' && <NewProjectForm />}
          {activeTab === 'checklist' && <SmartChecklistPage />}
          {activeTab === 'documents' && <DocumentCentrePage />}
          {activeTab === 'applications' && <ApplicationTrackerPage />}
          {activeTab === 'inspections' && <InspectionPlannerPage />}
          {activeTab === 'compliance' && <ComplianceCalendarPage />}
          {activeTab === 'incentives' && <IncentiveFinderPage />}
          {activeTab === 'risk-score' && <RiskScorePage />}
          {activeTab === 'ai-assistant' && <AiAssistantPage />}

          {/* Officer View Tabs */}
          {activeTab === 'officer-dashboard' && <OfficerDashboard />}
          {activeTab === 'officer-app-review' && <OfficerDashboard />}
          {activeTab === 'officer-queries' && <OfficerQueryPage />}
          {activeTab === 'officer-inspections' && <OfficerInspectionPage />}
          {activeTab === 'officer-analytics' && <SlaAnalyticsPage />}
          {activeTab === 'officer-nocs' && <OfficerNocManagementPage />}

          {/* Admin View Tabs */}
          {activeTab === 'admin-dashboard' && <AdminDashboard />}
          {activeTab === 'admin-rules' && <RulesEngineManager />}
          {activeTab === 'admin-notifications' && <NotificationCentrePage />}
          {activeTab === 'admin-audit' && <AuditLogsPage />}
        </main>
      </div>

      <Footer />
    </div>
  );
};

// Robust React Error Boundary to catch subcomponent errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('[React ErrorBoundary caught error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'A render issue occurred while loading this view.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
};

export default App;
