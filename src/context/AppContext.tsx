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
  ApprovalStatus,
  NocApplication,
  JointInspection,
  NocQuery
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
  INITIAL_RULES,
  INITIAL_NOC_APPLICATIONS,
  INITIAL_JOINT_INSPECTIONS
} from '../data/mockData';
import { generateSmartChecklist } from '../utils/rulesEngine';
import { calculateRiskScore } from '../utils/riskCalculator';
import {
  fetchProjects,
  createProjectApi,
  fetchApplications,
  createApplicationApi,
  updateApplicationStatusApi,
  raiseApplicationQueryApi,
  respondToApplicationQueryApi,
  fetchNocApplications,
  createNocApplicationApi,
  raiseNocQueryApi,
  respondToNocQueryApi,
  issueNocCertificateApi,
  fetchDocuments,
  uploadDocumentApi,
  deleteDocumentApi,
  fetchComplianceTasks,
  fetchJointInspections,
  createJointInspectionApi,
  fetchIncentiveSchemes,
  fetchAuditLogs,
  fetchNotifications,
  markNotificationReadApi,
  fetchRules,
  createRuleApi,
  deleteUserAccount
} from '../services/api';

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
  nocApplications: NocApplication[];
  jointInspections: JointInspection[];

  // Dynamic state helpers
  addProject: (projData: Omit<BusinessProject, 'id' | 'createdAt' | 'userId'>) => BusinessProject;
  applyForApproval: (approvalId: string, approvalName: string, department: string, documentIds?: string[], remarks?: string) => Application;
  uploadDocument: (docName: string, category: string, file: File | null, ocrResult?: any, customFileUrl?: string) => DocumentItem;
  deleteDocument: (docId: string) => Promise<boolean>;
  updateDocumentStatus: (docId: string, status: DocumentItem['status']) => void;
  respondToQuery: (queryId: string, responseText: string, responseDocName?: string) => void;
  updateApplicationStatus: (appId: string, status: ApprovalStatus, remarks?: string) => void;
  raiseOfficerQuery: (appId: string, queryCategory: string, queryText: string, dueDate: string) => void;
  scheduleInspection: (inspData: Omit<InspectionItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  addRule: (ruleData: Omit<ApprovalRule, 'id'>) => void;
  updateIncentiveUrl: (id: string, officialUrl: string, officialApplyUrl?: string, officialInfoUrl?: string) => void;
  
  // NOC helpers
  submitNocApplication: (data: Partial<NocApplication> & { nocType: NocApplication['nocType']; nocName: string; department: string }) => NocApplication;
  scheduleJointInspection: (data: Omit<JointInspection, 'id' | 'status'>) => JointInspection;
  completeJointInspection: (inspectionId: string, outcome: 'SATISFACTORY' | 'RECTIFICATION_REQUIRED' | 'NON_COMPLIANT', remarks: string) => void;
  raiseNocQuery: (nocId: string, question: string) => void;
  respondToNocQuery: (nocId: string, queryId: string, responseText: string, responseDocName?: string) => void;
  issueNocCertificate: (nocId: string, certType: 'PROVISIONAL' | 'FINAL') => void;
  deleteAccount: (userId?: string) => Promise<boolean>;

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

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('pfn_language') as Language;
    return (saved === 'en' || saved === 'mr' || saved === 'hi') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('pfn_language', language);
  }, [language]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pfn_dark_mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pfn_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

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

  const [incentiveSchemes, setIncentiveSchemes] = useState<IncentiveScheme[]>(() => {
    const saved = localStorage.getItem('pfn_incentive_schemes');
    return saved ? JSON.parse(saved) : INITIAL_INCENTIVE_SCHEMES;
  });

  const [nocApplications, setNocApplications] = useState<NocApplication[]>(() => {
    const saved = localStorage.getItem('pfn_noc_applications');
    return saved ? JSON.parse(saved) : INITIAL_NOC_APPLICATIONS;
  });

  const [jointInspections, setJointInspections] = useState<JointInspection[]>(() => {
    const saved = localStorage.getItem('pfn_joint_inspections');
    return saved ? JSON.parse(saved) : INITIAL_JOINT_INSPECTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [rules, setRules] = useState<ApprovalRule[]>(INITIAL_RULES);

  const [activeTab, setActiveTab] = useState<string>('login');
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  // Live Backend Hydration from Supabase with Strict User Isolation
  useEffect(() => {
    if (!currentUser) return;

    const isEntrepreneur = currentUser.role === 'ENTREPRENEUR';
    const isOfficer = currentUser.role === 'OFFICER';
    const userId = isEntrepreneur ? currentUser.id : undefined;

    // 1. Projects (isolated by userId for entrepreneurs)
    fetchProjects(userId).then(data => {
      if (data) {
        setProjects(data);
        if (data.length > 0) {
          setActiveProjectId(data[0].id);
        } else {
          setActiveProjectId('');
        }
      }
    });

    // 2. Applications (isolated to user's projects or officer's department)
    fetchApplications(isOfficer ? { department: currentUser.department } : { userId }).then(data => {
      if (data) setApplications(data);
    });

    // 3. NOC Applications
    fetchNocApplications({ userId }).then(data => {
      if (data) setNocApplications(data);
    });

    // 4. Documents (isolated to user's projects for entrepreneur, all for officer)
    fetchDocuments(undefined, isEntrepreneur ? userId : undefined).then(data => {
      if (data && data.length > 0) {
        setDocuments(prev => {
          const fetchedIds = new Set(data.map(d => d.id));
          const localOnly = prev.filter(p => !fetchedIds.has(p.id));
          return [...data, ...localOnly];
        });
      }
    });

    // 5. Compliance Tasks (isolated to user's projects)
    fetchComplianceTasks(undefined, userId).then(data => {
      if (data) setComplianceTasks(data);
    });

    // 6. Common Catalogues & Logs
    fetchIncentiveSchemes().then(data => {
      if (data && data.length > 0) setIncentiveSchemes(data);
    });

    fetchJointInspections().then(data => {
      if (data && data.length > 0) setJointInspections(data);
    });

    fetchAuditLogs().then(data => {
      if (data && data.length > 0) setAuditLogs(data);
    });

    fetchNotifications().then(data => {
      if (data && data.length > 0) setNotifications(data);
    });

    fetchRules().then(data => {
      if (data && data.length > 0) setRules(data);
    });
  }, [currentUser?.id, currentUser?.role]);

  // Sync Project-Specific Records on Active Project Change
  useEffect(() => {
    if (!activeProjectId || !currentUser) return;
    const userId = currentUser.role === 'ENTREPRENEUR' ? currentUser.id : undefined;

    fetchDocuments(activeProjectId, userId).then(data => {
      if (data) setDocuments(data);
    });

    fetchComplianceTasks(activeProjectId, userId).then(data => {
      if (data) setComplianceTasks(data);
    });
  }, [activeProjectId, currentUser?.id]);

  // Sync to LocalStorage as fallback cache
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

  useEffect(() => {
    localStorage.setItem('pfn_incentive_schemes', JSON.stringify(incentiveSchemes));
  }, [incentiveSchemes]);

  useEffect(() => {
    localStorage.setItem('pfn_noc_applications', JSON.stringify(nocApplications));
  }, [nocApplications]);

  useEffect(() => {
    localStorage.setItem('pfn_joint_inspections', JSON.stringify(jointInspections));
  }, [jointInspections]);

  const activeProject: BusinessProject = projects.find(p => p.id === activeProjectId) || projects[0] || {
    id: `proj-${currentUser?.id || 'default'}`,
    userId: currentUser?.id || 'usr-1',
    businessName: `${currentUser?.name || 'My'} Enterprise`,
    businessType: 'Industrial Manufacturing',
    projectType: 'New Setup',
    entityType: 'Private Limited',
    sector: 'Manufacturing',
    subSector: 'Textiles (spinning, weaving, garment manufacturing)',
    investmentRange: '₹5 Cr - ₹15 Cr',
    employeeCount: 35,
    businessActivity: 'Manufacturing and commercial production operations',
    projectStage: 'Planning',
    hasConstruction: true,
    hasHazardousMaterials: false,
    district: 'Pune',
    cityTaluka: 'Chakan / Khed',
    pincode: '410501',
    midcArea: 'Chakan MIDC Phase II',
    landType: 'MIDC Allotted',
    address: 'Plot No. C-45, Phase II, Chakan MIDC Industrial Area, Pune - 410501',
    createdAt: new Date().toISOString().split('T')[0]
  };

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

    // Persist to Supabase Database
    createProjectApi(newProj).catch(err => console.warn('Could not save project to backend:', err));

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

  const applyForApproval = (
    approvalId: string, 
    approvalName: string, 
    department: string, 
    documentIds?: string[], 
    remarks?: string
  ): Application => {
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
      remarks: remarks || undefined,
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
      documentIds: documentIds && documentIds.length > 0 ? documentIds : documents.map(d => d.id)
    };

    setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);

    // Persist to Supabase Database
    createApplicationApi(newApp).catch(err => console.warn('Could not save application to backend:', err));

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

    return newApp;
  };

  const uploadDocument = (
    docName: string, 
    category: string, 
    file: File | null, 
    ocrResult?: any, 
    customFileUrl?: string
  ): DocumentItem => {
    let status: DocumentItem['status'] = ocrResult?.status || 'Valid';
    let issues: string[] = ocrResult?.issues || [];
    let recommendations: string[] = ocrResult?.recommendations || [];

    if (!ocrResult) {
      const fileNameLower = file ? file.name.toLowerCase() : '';
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
    }

    const resolvedFileUrl = customFileUrl || (file ? URL.createObjectURL(file) : '/mock_documents/sample.pdf');

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: activeProject.id,
      docName,
      category,
      fileUrl: resolvedFileUrl,
      fileSize: file ? `${Math.round(file.size / 1024)} KB` : '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      status,
      aiValidationResult: {
        confidence: ocrResult?.confidence ?? (status === 'Valid' ? 96 : 48),
        issues,
        recommendations,
        extractedName: ocrResult?.extractedName || (status === 'Name Mismatch' ? 'Alternate Unit' : activeProject.businessName),
        extractedRegNo: ocrResult?.extractedRegNo,
        extractedExpiry: ocrResult?.extractedExpiry
      }
    };

    setDocuments(prev => [newDoc, ...prev.filter(d => d.id !== newDoc.id)]);

    // Persist document to Supabase / Backend Express Database
    uploadDocumentApi(newDoc).catch(err => console.warn('Could not save document to backend:', err));

    return newDoc;
  };

  const deleteDocument = async (docId: string): Promise<boolean> => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    try {
      await deleteDocumentApi(docId);
    } catch (e) {
      console.warn('Could not delete document from backend:', e);
    }
    return true;
  };

  const updateDocumentStatus = (docId: string, status: DocumentItem['status']) => {
    let targetDocName = 'Document';
    setDocuments(prev => {
      const exists = prev.some(d => d.id === docId);
      if (exists) {
        const found = prev.find(d => d.id === docId);
        if (found) targetDocName = found.docName;
        return prev.map(d => d.id === docId ? { ...d, status } : d);
      }
      const fallbackDoc = INITIAL_DOCUMENTS.find(d => d.id === docId);
      if (fallbackDoc) {
        targetDocName = fallbackDoc.docName;
        return [{ ...fallbackDoc, status }, ...prev];
      }
      return prev;
    });

    if (status === 'Expired' || status === 'Name Mismatch' || status === 'Blurry / Unreadable') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: `⚠️ Action Required: Document Flagged`,
        message: `Department Officer ${currentUser.name} flagged "${targetDocName}" (${status}). Please review and re-upload in Document Centre.`,
        type: 'WARNING',
        read: false,
        channels: ['IN_APP', 'EMAIL', 'SMS']
      };
      setNotifications(prev => [newNotif, ...prev]);

      setAuditLogs(prevLogs => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          user: currentUser.name,
          role: currentUser.role,
          action: 'Document Flagged / Discrepancy Raised',
          previousStatus: 'Valid',
          newStatus: status,
          ipAddress: '10.240.12.91',
          details: `Officer ${currentUser.name} flagged certificate "${targetDocName}" for ${status}. Notification dispatched to entrepreneur dashboard.`
        },
        ...prevLogs
      ]);
    } else if (status === 'Valid') {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: `✓ Document Verified & Approved`,
        message: `Your proof document "${targetDocName}" has been successfully verified and accepted by ${currentUser.name}.`,
        type: 'SUCCESS',
        read: false,
        channels: ['IN_APP']
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
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

    // Persist query response to Supabase
    respondToApplicationQueryApi(queryId, responseText, responseDocName).catch(err => console.warn('Could not save query response to backend:', err));

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
    setApplications(prev => prev.map(app => {
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

        setAuditLogs(prevLogs => [
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
          ...prevLogs
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
    }));

    // Persist status update to Supabase / Backend
    updateApplicationStatusApi(appId, status, remarks, currentUser.name).catch(err => console.warn('Could not save status update to backend:', err));
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

    // Persist officer query to Supabase
    raiseApplicationQueryApi(appId, {
      officerName: currentUser.name,
      department: currentUser.department,
      queryCategory,
      queryText,
      dueDate
    }).catch(err => console.warn('Could not save query to backend:', err));
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
    markNotificationReadApi(id).catch(err => console.warn('Could not update notification in backend:', err));
  };

  const addRule = (ruleData: Omit<ApprovalRule, 'id'>) => {
    const newRule: ApprovalRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setRules([newRule, ...rules]);
    createRuleApi(newRule).catch(err => console.warn('Could not save rule in backend:', err));
  };

  const updateIncentiveUrl = (id: string, officialUrl: string, officialApplyUrl?: string, officialInfoUrl?: string) => {
    setIncentiveSchemes(prev =>
      prev.map(scheme => {
        if (scheme.id === id) {
          return {
            ...scheme,
            officialUrl,
            officialApplyUrl: officialApplyUrl || officialUrl,
            officialInfoUrl: officialInfoUrl || scheme.officialInfoUrl || officialUrl
          };
        }
        return scheme;
      })
    );
  };

  const submitNocApplication = (data: Partial<NocApplication> & { nocType: NocApplication['nocType']; nocName: string; department: string }): NocApplication => {
    const newNoc: NocApplication = {
      id: `noc-app-${Date.now()}`,
      projectId: activeProject.id,
      businessName: activeProject.businessName,
      nocType: data.nocType,
      nocName: data.nocName,
      department: data.department,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      urgency: data.urgency || 'HIGH',
      slaDaysLeft: data.nocType === 'FIRE_SAFETY' ? 14 : data.nocType === 'MPCB_CTE' ? 30 : 15,
      technicalParameters: data.technicalParameters || { builtUpAreaSqM: 1250, plotAreaSqM: 4500 },
      documents: data.documents || [],
      queries: []
    };

    setNocApplications(prev => [newNoc, ...prev]);

    // Persist to Supabase
    createNocApplicationApi(newNoc).catch(err => console.warn('Could not save NOC to backend:', err));

    // Also push audit log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.role,
      action: 'Submitted NOC Application',
      applicationId: newNoc.id,
      ipAddress: '127.0.0.1',
      details: `Filed NOC Application for ${newNoc.nocName} under ${newNoc.department}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return newNoc;
  };

  const scheduleJointInspection = (data: Omit<JointInspection, 'id' | 'status'>): JointInspection => {
    const newInsp: JointInspection = {
      ...data,
      id: `joint-insp-${Date.now()}`,
      status: 'SCHEDULED'
    };

    setJointInspections(prev => [newInsp, ...prev]);

    // Persist to Supabase
    createJointInspectionApi(newInsp).catch(err => console.warn('Could not save Joint Inspection to backend:', err));

    // Update NOC application status
    if (data.nocApplicationId) {
      setNocApplications(prev =>
        prev.map(app => app.id === data.nocApplicationId ? { ...app, status: 'INSPECTION_SCHEDULED' } : app)
      );
    }

    return newInsp;
  };

  const completeJointInspection = (
    inspectionId: string, 
    outcome: 'SATISFACTORY' | 'RECTIFICATION_REQUIRED' | 'NON_COMPLIANT', 
    remarks: string
  ) => {
    let targetBusiness = 'Enterprise';
    setJointInspections(prev =>
      prev.map(insp => {
        if (insp.id === inspectionId) {
          targetBusiness = insp.businessName;
          return {
            ...insp,
            status: outcome === 'SATISFACTORY' ? 'COMPLETED' : 'RECTIFICATION_REQUIRED',
            remarks
          };
        }
        return insp;
      })
    );

    // Update notification for entrepreneur
    const notifTitle = outcome === 'SATISFACTORY' 
      ? `✅ Joint Inspection Completed: Clearance Recommended`
      : `⚠️ Joint Inspection Report: Action Required`;
    
    const notifMsg = outcome === 'SATISFACTORY'
      ? `Multi-agency joint site visit at "${targetBusiness}" completed successfully with all attending departments (MPCB, Fire, MIDC, MSEDCL) issuing satisfactory audit findings.`
      : `Joint inspection completed with field rectification observations. Check inspection desk for compliance timeline.`;

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: notifTitle,
        message: notifMsg,
        type: outcome === 'SATISFACTORY' ? 'SUCCESS' : 'WARNING',
        read: false,
        channels: ['IN_APP', 'EMAIL', 'SMS']
      },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'Joint Site Inspection Completed',
        previousStatus: 'SCHEDULED',
        newStatus: 'COMPLETED',
        ipAddress: '10.240.12.91',
        details: `Multi-department joint site audit executed for "${targetBusiness}". Outcome: ${outcome}. Geo-tagged evidence captured.`
      },
      ...prev
    ]);
  };

  const raiseNocQuery = (nocId: string, question: string) => {
    setNocApplications(prev =>
      prev.map(app => {
        if (app.id === nocId) {
          const newQuery: NocQuery = {
            id: `q-noc-${Date.now()}`,
            raisedBy: currentUser.name,
            date: new Date().toISOString().split('T')[0],
            question,
            status: 'OPEN'
          };
          return {
            ...app,
            status: 'QUERY_RAISED',
            queries: [...(app.queries || []), newQuery]
          };
        }
        return app;
      })
    );
  };

  const respondToNocQuery = (nocId: string, queryId: string, responseText: string, responseDocName?: string) => {
    setNocApplications(prev =>
      prev.map(app => {
        if (app.id === nocId) {
          const updatedQueries = (app.queries || []).map(q => {
            if (q.id === queryId) {
              return {
                ...q,
                response: responseText,
                responseDocName,
                status: 'RESOLVED' as const
              };
            }
            return q;
          });
          return {
            ...app,
            status: 'UNDER_REVIEW',
            queries: updatedQueries
          };
        }
        return app;
      })
    );
  };

  const issueNocCertificate = (nocId: string, certType: 'PROVISIONAL' | 'FINAL') => {
    const certId = `PFN-NOC-${certType.substring(0, 4)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    const qrData = `PFN-VERIFIED-NOC-${certType}-${nocId}-${certId}`;

    setNocApplications(prev =>
      prev.map(app => {
        if (app.id === nocId) {
          return {
            ...app,
            status: certType === 'PROVISIONAL' ? 'PROVISIONAL_ISSUED' : 'FINAL_GRANTED',
            issuedDate: today,
            certificateId: certId,
            qrCodeData: qrData,
            provisionalCertUrl: certType === 'PROVISIONAL' ? `https://permitflownexus.gov.in/certs/${certId}.pdf` : app.provisionalCertUrl,
            finalCertUrl: certType === 'FINAL' ? `https://permitflownexus.gov.in/certs/${certId}.pdf` : app.finalCertUrl
          };
        }
        return app;
      })
    );

    // Persist certificate issuance to Supabase
    issueNocCertificateApi(nocId, certType).catch(err => console.warn('Could not save certificate to backend:', err));
  };

  const deleteAccount = async (targetUserId?: string): Promise<boolean> => {
    const uid = targetUserId || currentUser.id;
    try {
      await deleteUserAccount(uid);
    } catch (e) {
      console.warn('Backend delete error, cleaning client state:', e);
    }

    // Clean localStorage cache
    localStorage.removeItem('pfn_user');
    localStorage.removeItem('pfn_projects');
    localStorage.removeItem('pfn_applications');
    localStorage.removeItem('pfn_documents');
    localStorage.removeItem('pfn_noc_applications');
    localStorage.removeItem('pfn_compliance_tasks');

    // Reset current user to initial demo entrepreneur or redirect to login
    setProjects([]);
    setApplications([]);
    setDocuments([]);
    setNocApplications([]);
    setComplianceTasks([]);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTab('login');
    return true;
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
        nocApplications,
        jointInspections,
        addProject,
        applyForApproval,
        uploadDocument,
        deleteDocument,
        updateDocumentStatus,
        respondToQuery,
        updateApplicationStatus,
        raiseOfficerQuery,
        scheduleInspection,
        markNotificationRead,
        addRule,
        updateIncentiveUrl,
        submitNocApplication,
        scheduleJointInspection,
        completeJointInspection,
        raiseNocQuery,
        respondToNocQuery,
        issueNocCertificate,
        deleteAccount,
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
