import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Role, 
  Language, 
  BusinessProject, 
  Application, 
  DocumentItem, 
  InspectionItem, 
  ComplianceTask, 
  IncentiveScheme, 
  AuditLogItem, 
  NotificationItem, 
  ApprovalRule,
  SmartChecklistItem,
  ApprovalStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_INSPECTIONS, 
  INITIAL_COMPLIANCE_TASKS, 
  INITIAL_INCENTIVE_SCHEMES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_RULES 
} from '../data/mockData';
import { generateSmartChecklist } from '../utils/rulesEngine';
import { calculateRiskScore } from '../utils/riskCalculator';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  
  // Data lists
  projects: BusinessProject[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  activeProject: BusinessProject;
  
  applications: Application[];
  documents: DocumentItem[];
  inspections: InspectionItem[];
  complianceTasks: ComplianceTask[];
  incentiveSchemes: IncentiveScheme[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  rules: ApprovalRule[];

  // Dynamic state helpers
  addProject: (projData: Omit<BusinessProject, 'id' | 'createdAt' | 'userId'>) => BusinessProject;
  applyForApproval: (approvalId: string, approvalName: string, department: string) => void;
  uploadDocument: (docName: string, category: string, file: File | null) => void;
  respondToQuery: (queryId: string, responseText: string, responseDocName?: string) => void;
  updateApplicationStatus: (appId: string, status: ApprovalStatus, remarks?: string) => void;
  raiseOfficerQuery: (appId: string, queryCategory: string, queryText: string, dueDate: string) => void;
  scheduleInspection: (inspData: Omit<InspectionItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  addRule: (ruleData: Omit<ApprovalRule, 'id'>) => void;

  // View state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAppDetail: Application | null;
  setSelectedAppDetail: (app: Application | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved state from LocalStorage or Initial Seed
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('pfn_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [projects, setProjects] = useState<BusinessProject[]>(() => {
    const saved = localStorage.getItem('pfn_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'proj-1');

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('pfn_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('pfn_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [inspections, setInspections] = useState<InspectionItem[]>(() => {
    const saved = localStorage.getItem('pfn_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>(() => {
    const saved = localStorage.getItem('pfn_compliance');
    return saved ? JSON.parse(saved) : INITIAL_COMPLIANCE_TASKS;
  });

  const [incentiveSchemes, setIncentiveSchemes] = useState<IncentiveScheme[]>(INITIAL_INCENTIVE_SCHEMES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [rules, setRules] = useState<ApprovalRule[]>(INITIAL_RULES);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pfn_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pfn_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pfn_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('pfn_documents', JSON.stringify(documents));
  }, [documents]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const addProject = (projData: Omit<BusinessProject, 'id' | 'createdAt' | 'userId'>): BusinessProject => {
    const newProj: BusinessProject = {
      ...projData,
      id: `proj-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newProj, ...projects];
    setProjects(updated);
    setActiveProjectId(newProj.id);

    // Audit log
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.role,
      action: 'Created New Business Project',
      ipAddress: '192.168.1.45',
      details: `Project "${newProj.businessName}" created in ${newProj.sector} sector (${newProj.district}).`
    };
    setAuditLogs([log, ...auditLogs]);

    return newProj;
  };

  const applyForApproval = (approvalId: string, approvalName: string, department: string) => {
    const deptPrefix = department.split(' ')[0].replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
    const newApp: Application = {
      id: `app-${Date.now()}`,
      appId: `PFN-2026-${deptPrefix}-${Math.floor(100 + Math.random() * 900)}`,
      projectId: activeProject.id,
      businessName: activeProject.businessName,
      approvalId,
      approvalName,
      department,
      submissionDate: new Date().toISOString().split('T')[0],
      slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      slaDaysRemaining: 15,
      status: 'Submitted',
      riskScore: Math.floor(20 + Math.random() * 25),
      timeline: [
        {
          id: `t-${Date.now()}`,
          title: 'Application Created & Submitted',
          description: `Application for ${approvalName} submitted to ${department}.`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actor: currentUser.name,
          role: currentUser.role
        }
      ],
      queries: [],
      documentIds: documents.map(d => d.id)
    };

    setApplications([newApp, ...applications]);

    // Audit log
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'Submitted Approval Application',
        applicationId: newApp.appId,
        previousStatus: 'Not Started',
        newStatus: 'Submitted',
        ipAddress: '192.168.1.45',
        details: `Submitted ${approvalName} to ${department}.`
      },
      ...auditLogs
    ]);

    // Notification
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: `Application ${newApp.appId} Submitted`,
        message: `Your application for ${approvalName} has been received by ${department}. Track progress in Application Tracker.`,
        type: 'SUCCESS',
        read: false,
        channels: ['IN_APP', 'EMAIL']
      },
      ...notifications
    ]);
  };

  const uploadDocument = (docName: string, category: string, file: File | null) => {
    const fileNameLower = file ? file.name.toLowerCase() : '';
    let status: DocumentItem['status'] = 'Valid';
    let issues: string[] = [];
    let recommendations: string[] = [];

    if (fileNameLower.includes('old') || fileNameLower.includes('2022') || fileNameLower.includes('expired')) {
      status = 'Expired';
      issues.push('Certificate validity period expired.');
      recommendations.push('Upload a renewed version from issuing authority.');
    } else if (fileNameLower.includes('mismatch') || fileNameLower.includes('unit1')) {
      status = 'Name Mismatch';
      issues.push(`Name on document does not match project "${activeProject.businessName}".`);
      recommendations.push('Upload a corrected document or name change affidavit.');
    } else if (fileNameLower.includes('blurry') || fileNameLower.includes('low_res')) {
      status = 'Blurry / Unreadable';
      issues.push('Resolution is under 200 DPI. Seal unreadable.');
      recommendations.push('Re-scan document at 300 DPI or higher.');
    } else {
      recommendations.push('Document text and seal verified cleanly by PermitFlow AI.');
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      projectId: activeProject.id,
      docName,
      category,
      fileUrl: file ? URL.createObjectURL(file) : '/mock_documents/sample.pdf',
      fileSize: file ? `${Math.round(file.size / 1024)} KB` : '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status,
      aiValidationResult: {
        confidence: status === 'Valid' ? 96 : 48,
        issues,
        recommendations,
        extractedName: status === 'Name Mismatch' ? 'Alternate Unit' : activeProject.businessName
      }
    };

    setDocuments([newDoc, ...documents]);
  };

  const respondToQuery = (queryId: string, responseText: string, responseDocName?: string) => {
    const updatedApps = applications.map(app => {
      const qIndex = app.queries.findIndex(q => q.id === queryId);
      if (qIndex !== -1) {
        const updatedQueries = [...app.queries];
        updatedQueries[qIndex] = {
          ...updatedQueries[qIndex],
          status: 'RESPONDED',
          responseText,
          responseDocName,
          responseDate: new Date().toISOString().split('T')[0]
        };
        const updatedTimeline = [
          ...app.timeline,
          {
            id: `t-${Date.now()}`,
            title: 'Query Response Submitted',
            description: `Entrepreneur submitted response: "${responseText.substring(0, 50)}..."`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            actor: currentUser.name,
            role: currentUser.role
          }
        ];
        return {
          ...app,
          status: 'Under Review' as ApprovalStatus,
          queries: updatedQueries,
          timeline: updatedTimeline
        };
      }
      return app;
    });

    setApplications(updatedApps);

    setNotifications([
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Query Response Submitted',
        message: 'Your query response has been sent to the Department Officer for re-audit.',
        type: 'INFO',
        read: false,
        channels: ['IN_APP']
      },
      ...notifications
    ]);
  };

  const updateApplicationStatus = (appId: string, status: ApprovalStatus, remarks?: string) => {
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        const prevStatus = app.status;
        const newTimeline = [
          ...app.timeline,
          {
            id: `t-${Date.now()}`,
            title: `Status Changed to ${status}`,
            description: remarks || `Officer ${currentUser.name} updated application status to ${status}.`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            actor: currentUser.name,
            role: currentUser.role
          }
        ];

        setAuditLogs([
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            user: currentUser.name,
            role: currentUser.role,
            action: 'Updated Application Status',
            applicationId: app.appId,
            previousStatus: prevStatus,
            newStatus: status,
            ipAddress: '10.240.12.91',
            details: remarks || `Status changed from ${prevStatus} to ${status}.`
          },
          ...auditLogs
        ]);

        return {
          ...app,
          status,
          remarks: remarks || app.remarks,
          timeline: newTimeline,
          officerAssigned: currentUser.name
        };
      }
      return app;
    });

    setApplications(updatedApps);
  };

  const raiseOfficerQuery = (appId: string, queryCategory: string, queryText: string, dueDate: string) => {
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        const newQuery = {
          id: `q-${Date.now()}`,
          applicationId: appId,
          officerName: currentUser.name,
          department: currentUser.department || app.department,
          queryCategory,
          queryText,
          raisedDate: new Date().toISOString().split('T')[0],
          dueDate,
          status: 'OPEN' as const
        };
        const newTimeline = [
          ...app.timeline,
          {
            id: `t-${Date.now()}`,
            title: 'Department Query Raised',
            description: `${currentUser.name} raised query: ${queryCategory}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            actor: currentUser.name,
            role: currentUser.role
          }
        ];
        return {
          ...app,
          status: 'Query Raised' as ApprovalStatus,
          queries: [...app.queries, newQuery],
          timeline: newTimeline
        };
      }
      return app;
    });

    setApplications(updatedApps);
  };

  const scheduleInspection = (inspData: Omit<InspectionItem, 'id'>) => {
    const newInsp: InspectionItem = {
      ...inspData,
      id: `insp-${Date.now()}`
    };
    setInspections([newInsp, ...inspections]);

    // Update application status to Inspection Scheduled
    const updatedApps = applications.map(app => {
      if (app.id === inspData.applicationId) {
        return {
          ...app,
          status: 'Inspection Scheduled' as ApprovalStatus,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: 'Site Inspection Scheduled',
              description: `${inspData.inspectionType} scheduled for ${inspData.scheduledDate}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: currentUser.name,
              role: currentUser.role
            }
          ]
        };
      }
      return app;
    });
    setApplications(updatedApps);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addRule = (ruleData: Omit<ApprovalRule, 'id'>) => {
    const newRule: ApprovalRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setRules([newRule, ...rules]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        projects,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        applications,
        documents,
        inspections,
        complianceTasks,
        incentiveSchemes,
        auditLogs,
        notifications,
        rules,
        addProject,
        applyForApproval,
        uploadDocument,
        respondToQuery,
        updateApplicationStatus,
        raiseOfficerQuery,
        scheduleInspection,
        markNotificationRead,
        addRule,
        activeTab,
        setActiveTab,
        selectedAppDetail,
        setSelectedAppDetail
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
