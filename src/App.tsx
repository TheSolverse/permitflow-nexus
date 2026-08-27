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
  const [showExpiryModal, setShowExpiryModal] = React.useState<boolean>(true);

  // Auto-show expiry pop-up whenever an Entrepreneur logs in or switches to entrepreneur portal
  React.useEffect(() => {
    if (currentUser.role === 'ENTREPRENEUR') {
      setShowExpiryModal(true);
    }
  }, [currentUser.role, currentUser.id]);

  if (activeTab === 'landing') return <LandingPage />;
  if (activeTab === 'login') return <LoginPage />;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Entrepreneur Statutory Certificate & Expiry Alert Modal */}
      {currentUser.role === 'ENTREPRENEUR' && (
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

export default MainContent;
