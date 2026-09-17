import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  NocQuery,
  ParallelPermissionItem
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_INSPECTIONS, 
  INITIAL_COMPLIANCE_TASKS, 
  INITIAL_INCENTIVE_SCHEMES, 
  INITIAL_RULES,
  INITIAL_NOC_APPLICATIONS,
  INITIAL_JOINT_INSPECTIONS,
  INITIAL_PARALLEL_PERMISSIONS
} from '../data/mockData';
import { supabase } from '../utils/supabaseClient';
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
  parallelPermissions: ParallelPermissionItem[];

  // Dynamic state helpers
  addProject: (projData: Omit<BusinessProject, 'id' | 'createdAt' | 'userId'>) => BusinessProject;
  applyForApproval: (approvalId: string, approvalName: string, department: string, documentIds?: string[], remarks?: string) => Application;
  uploadDocument: (docName: string, category: string, file: File | null, ocrResult?: any, customFileUrl?: string, targetProjectId?: string) => DocumentItem;
  deleteDocument: (docId: string) => Promise<boolean>;
  updateDocumentStatus: (docId: string, status: DocumentItem['status']) => void;
  respondToQuery: (queryId: string, responseText: string, responseDocName?: string) => void;
  updateApplicationStatus: (appId: string, status: ApprovalStatus, remarks?: string) => void;
  raiseOfficerQuery: (appId: string, queryCategory: string, queryText: string, dueDate: string) => void;
  scheduleInspection: (inspData: Omit<InspectionItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  addRule: (ruleData: Omit<ApprovalRule, 'id'>) => void;
  updateIncentiveUrl: (id: string, officialUrl: string, officialApplyUrl?: string, officialInfoUrl?: string) => void;

  // Parallel Workflow Coordination & Department Officer Action Helpers
  triggerParallelAutoRouting: (targetProjectId?: string) => void;
  updateParallelPermissionStatus: (permId: string, newStatus: ApprovalStatus, remarks?: string, inspectionDate?: string) => void;
  raiseParallelPermissionQuery: (permId: string, queryCategory: string, queryText: string, dueDate: string) => void;
  respondToParallelPermissionQuery: (permId: string, queryId: string, responseText: string) => void;
  calculateParallelProgress: (targetProjectId?: string) => { approvedCount: number; totalRequired: number; progressPercentage: number };
  officerApprovePermission: (permId: string, remarks?: string) => void;
  officerRejectPermission: (permId: string, remarks?: string) => void;
  officerRequestDocument: (permId: string, documentName: string, instructions?: string) => void;
  officerScheduleInspection: (permId: string, inspectionDate: string, location?: string) => void;
  officerMarkDelayed: (permId: string, delayReason: string, remarks?: string) => void;
  issueDigitalCertificate: (itemId: string, certType?: 'PROVISIONAL' | 'FINAL', tenureYears?: number, conditions?: string) => { certificateId: string; qrToken: string };
  
  // NOC helpers
  submitNocApplication: (data: Partial<NocApplication> & { nocType: NocApplication['nocType']; nocName: string; department: string }) => NocApplication;
  scheduleJointInspection: (data: Omit<JointInspection, 'id' | 'status'>) => JointInspection;
  completeJointInspection: (inspectionId: string, outcome: 'SATISFACTORY' | 'RECTIFICATION_REQUIRED' | 'NON_COMPLIANT', remarks: string) => void;
  raiseNocQuery: (nocId: string, question: string) => void;
  respondToNocQuery: (nocId: string, queryId: string, responseText: string, responseDocName?: string) => void;
  issueNocCertificate: (nocId: string, certType: 'PROVISIONAL' | 'FINAL') => void;
  deleteAccount: (userId?: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;

  // View state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAppDetail: Application | null;
  setSelectedAppDetail: (app: Application | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeSetStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (err) {
    console.warn(`[LocalStorage] Skipped cache save for key "${key}" (Quota/Storage Limit):`, err);
  }
};

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`[LocalStorage] Skipped cache read for key "${key}":`, err);
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved state from LocalStorage or Initial Seed
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return safeGetStorage('pfn_user', INITIAL_USERS[0]);
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = safeGetStorage<string>('pfn_language', 'en') as Language;
    return (saved === 'en' || saved === 'mr' || saved === 'hi') ? saved : 'en';
  });

  useEffect(() => {
    safeSetStorage('pfn_language', language);
  }, [language]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeGetStorage<boolean | null>('pfn_dark_mode', null);
    if (saved !== null) {
      return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeSetStorage('pfn_dark_mode', darkMode);
  }, [darkMode]);

  const [projects, setProjects] = useState<BusinessProject[]>(() => {
    return safeGetStorage('pfn_projects', INITIAL_PROJECTS);
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || 'proj-1');

  const [applications, setApplications] = useState<Application[]>(() => {
    return safeGetStorage('pfn_applications', INITIAL_APPLICATIONS);
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    return safeGetStorage('pfn_documents', INITIAL_DOCUMENTS);
  });

  const [inspections, setInspections] = useState<InspectionItem[]>(() => {
    return safeGetStorage('pfn_inspections', INITIAL_INSPECTIONS);
  });

  const [complianceTasks, setComplianceTasks] = useState<ComplianceTask[]>(() => {
    return safeGetStorage('pfn_compliance', INITIAL_COMPLIANCE_TASKS);
  });

  const [incentiveSchemes, setIncentiveSchemes] = useState<IncentiveScheme[]>(() => {
    return safeGetStorage('pfn_incentive_schemes', INITIAL_INCENTIVE_SCHEMES);
  });

  const [nocApplications, setNocApplications] = useState<NocApplication[]>(() => {
    return safeGetStorage('pfn_noc_applications', INITIAL_NOC_APPLICATIONS);
  });

  const [jointInspections, setJointInspections] = useState<JointInspection[]>(() => {
    return safeGetStorage('pfn_joint_inspections', INITIAL_JOINT_INSPECTIONS);
  });

  const [parallelPermissions, setParallelPermissions] = useState<ParallelPermissionItem[]>(() => {
    return safeGetStorage('pfn_parallel_permissions', INITIAL_PARALLEL_PERMISSIONS);
  });

  useEffect(() => {
    safeSetStorage('pfn_parallel_permissions', parallelPermissions);
  }, [parallelPermissions]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [rules, setRules] = useState<ApprovalRule[]>(INITIAL_RULES);

  const [activeTab, setActiveTab] = useState<string>('login');
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  const syncProfileFromAuth = useCallback(async (authUser: any) => {
    try {
      const email = authUser.email?.toLowerCase();
      if (!email) return;

      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${authUser.id},email.ilike.${email}`)
        .maybeSingle();

      if (dbUser) {
        const userObj: User = {
          id: dbUser.id,
          name: dbUser.name || authUser.user_metadata?.name || email.split('@')[0],
          email: dbUser.email || email,
          role: dbUser.role || (authUser.user_metadata?.role as Role) || 'ENTREPRENEUR',
          department: dbUser.department || undefined,
          designation: dbUser.designation || undefined,
          district: dbUser.district || 'Pune',
          organization: dbUser.role === 'ENTREPRENEUR' ? 'Maharashtra Enterprise' : (dbUser.department || 'Government of Maharashtra'),
          permissions: dbUser.permissions || []
        };
        setCurrentUser(userObj);
        localStorage.setItem('pfn_user', JSON.stringify(userObj));
      } else {
        // Auto-provision matching public.users row if not yet inserted
        const role = (authUser.user_metadata?.role as Role) || 'ENTREPRENEUR';
        const name = authUser.user_metadata?.name || email.split('@')[0];
        const newRecord = {
          id: authUser.id,
          name,
          email,
          role,
          district: 'Pune',
          permissions: []
        };
        await supabase.from('users').upsert(newRecord);
        const userObj: User = {
          ...newRecord,
          department: undefined,
          designation: undefined,
          organization: role === 'ENTREPRENEUR' ? 'Maharashtra Enterprise' : 'Government of Maharashtra'
        };
        setCurrentUser(userObj);
        localStorage.setItem('pfn_user', JSON.stringify(userObj));
      }
    } catch (err) {
      console.warn('[AppContext] syncProfileFromAuth error:', err);
    }
  }, []);

  // Synchronize user state with Supabase Auth session
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncProfileFromAuth(session.user);
      }
    });

    // 2. Listen for Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        syncProfileFromAuth(session.user);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('pfn_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncProfileFromAuth]);

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
      if (data) setDocuments(data);
    });

    // 5. Compliance Tasks (isolated to user's projects)
    fetchComplianceTasks(undefined, userId).then(data => {
      if (data) setComplianceTasks(data);
    });

    // 6. Common Catalogues & Logs
    fetchIncentiveSchemes().then(data => {
      if (data) setIncentiveSchemes(data);
    });

    fetchJointInspections().then(data => {
      if (data) setJointInspections(data);
    });

    fetchAuditLogs().then(data => {
      if (data) setAuditLogs(data);
    });

    fetchNotifications(userId).then(data => {
      if (data) setNotifications(data);
    });

    fetchRules().then(data => {
      if (data) setRules(data);
    });
  }, [currentUser?.id, currentUser?.role, currentUser?.department]);

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

  // Sync to LocalStorage as fallback cache (safely guarded against quota limits)
  useEffect(() => {
    safeSetStorage('pfn_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    safeSetStorage('pfn_projects', projects);
  }, [projects]);

  useEffect(() => {
    safeSetStorage('pfn_applications', applications);
  }, [applications]);

  useEffect(() => {
    safeSetStorage('pfn_documents', documents);
  }, [documents]);

  useEffect(() => {
    safeSetStorage('pfn_incentive_schemes', incentiveSchemes);
  }, [incentiveSchemes]);

  useEffect(() => {
    safeSetStorage('pfn_noc_applications', nocApplications);
  }, [nocApplications]);

  useEffect(() => {
    safeSetStorage('pfn_joint_inspections', jointInspections);
  }, [jointInspections]);

  const userProjects = currentUser?.role === 'ENTREPRENEUR'
    ? projects.filter(p => !p.userId || p.userId === currentUser.id)
    : projects;

  const activeProject: BusinessProject = 
    projects.find(p => p.id === activeProjectId && (currentUser?.role === 'OFFICER' || p.userId === currentUser?.id)) ||
    (userProjects.length > 0 ? userProjects[0] : {
      id: '',
      userId: currentUser?.id || '',
      businessName: '',
      businessType: 'Industrial Manufacturing',
      projectType: 'New Setup',
      entityType: 'Private Limited',
      sector: 'Manufacturing',
      subSector: '',
      investmentRange: '',
      employeeCount: 0,
      businessActivity: '',
      projectStage: 'Planning',
      hasConstruction: false,
      hasHazardousMaterials: false,
      district: '',
      cityTaluka: '',
      pincode: '',
      midcArea: '',
      landType: 'MIDC Allotted',
      address: '',
      createdAt: ''
    });

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

    // Automatically trigger Parallel Workflow Routing for newly created project
    setTimeout(() => {
      triggerParallelAutoRouting(newProj.id);
    }, 100);

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
      documentIds: documentIds && documentIds.length > 0 ? documentIds : documents.filter(d => d.projectId === activeProject.id).map(d => d.id)
    };

    setApplications(prev => [newApp, ...prev.filter(a => !(a.projectId === activeProject.id && a.approvalId === approvalId))]);

    // Also sync parallelPermissions so department officers see the uploaded documents & real application
    const attachedDocNames = documents.filter(d => d.projectId === activeProject.id && newApp.documentIds.includes(d.id)).map(d => d.docName);
    
    setParallelPermissions(prev => {
      const existingIdx = prev.findIndex(p => p.projectId === activeProject.id && (p.approvalId === approvalId || p.approvalName.toLowerCase().trim() === approvalName.toLowerCase().trim()));
      
      const updatedItem: ParallelPermissionItem = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `perm-${Date.now()}`,
        projectId: activeProject.id,
        approvalId: approvalId,
        approvalName: approvalName,
        department: department,
        category: 'Clearance',
        assignedOfficer: existingIdx >= 0 ? prev[existingIdx].assignedOfficer : 'Department Officer',
        officerEmail: existingIdx >= 0 ? prev[existingIdx].officerEmail : 'officer@maharashtra.gov.in',
        status: 'Submitted' as ApprovalStatus,
        pendingWith: department.split(' ')[0] + ' Officer',
        pendingAction: 'Desk scrutiny & document review',
        dateReceived: new Date().toISOString().split('T')[0],
        lastUpdatedDateTime: new Date().toLocaleString(),
        pendingDocs: attachedDocNames.length > 0 ? attachedDocNames : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 15,
        dependencies: [],
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        remarks: remarks || `Application submitted by ${currentUser.name} for project ${activeProject.businessName}`,
        documentIds: newApp.documentIds,
        activityHistory: [
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            actor: currentUser.name,
            department: 'Entrepreneur',
            action: 'Application Submitted',
            notes: `Application for ${approvalName} submitted to ${department}.`
          }
        ]
      };

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = updatedItem;
        return next;
      }
      return [updatedItem, ...prev];
    });

    // Persist to Supabase Database
    createApplicationApi(newApp).catch(err => console.warn('Could not save application to backend:', err));

    // Audit log
    const log: AuditLogItem = {
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
    };
    setAuditLogs([log, ...auditLogs]);

    // Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: `Application ${newApp.appId} Submitted`,
        message: `Your application for ${approvalName} has been received by ${department}. Track progress in Application Tracker.`,
        type: 'SUCCESS',
        read: false,
        channels: ['IN_APP', 'EMAIL']
      },
      ...prev
    ]);

    return newApp;
  };

  const uploadDocument = (
    docName: string, 
    category: string, 
    file: File | null, 
    ocrResult?: any, 
    customFileUrl?: string,
    targetProjectId?: string
  ): DocumentItem => {
    const projId = targetProjectId || activeProject.id;
    const currentBusinessName = projects.find(p => p.id === projId)?.businessName || activeProject.businessName;

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
        issues.push(`Name on document does not match project "${currentBusinessName}".`);
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

    const structuredAnalysis = ocrResult?.structuredAnalysis;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId: projId,
      docName,
      category,
      fileUrl: resolvedFileUrl,
      fileSize: file ? `${Math.round(file.size / 1024)} KB` : '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: ocrResult?.extractedExpiry,
      status,
      structuredAnalysis,
      aiValidationResult: {
        confidence: ocrResult?.confidence ?? (status === 'Valid' ? 96 : 48),
        issues,
        recommendations,
        extractedName: ocrResult?.extractedName,
        extractedRegNo: ocrResult?.extractedRegNo,
        extractedExpiry: ocrResult?.extractedExpiry,
        structuredAnalysis
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
        userId: currentUser.id,
        projectId: activeProject?.id,
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
        userId: currentUser.id,
        projectId: activeProject?.id,
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

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject?.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: 'Query Response Submitted',
        message: 'Your query response has been sent to the Department Officer for re-audit.',
        type: 'INFO',
        read: false,
        channels: ['IN_APP']
      },
      ...prev
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

    // Synchronize parallelPermissions state for entrepreneur dashboard
    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      setParallelPermissions(prev => prev.map(item => {
        if (
          item.id === appId || 
          item.approvalId === appId || 
          item.approvalId === targetApp.approvalId || 
          item.approvalName.toLowerCase().trim() === targetApp.approvalName.toLowerCase().trim()
        ) {
          return {
            ...item,
            status,
            remarks: remarks || item.remarks,
            lastUpdatedDate: new Date().toISOString().split('T')[0],
            lastUpdatedDateTime: new Date().toLocaleString()
          };
        }
        return item;
      }));

      // Send live notification to Entrepreneur
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: targetApp.userId || currentUser.id,
          projectId: targetApp.projectId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          title: `Clearance Status Updated: ${status}`,
          message: `Officer ${currentUser.name} (${currentUser.department || 'Statutory Department'}) updated your "${targetApp.approvalName}" status to ${status}.`,
          type: status === 'Approved' ? 'SUCCESS' : status === 'Rejected' ? 'WARNING' : 'INFO',
          read: false,
          channels: ['IN_APP']
        },
        ...prev
      ]);

      // Automatically issue & add statutory certificate to Entrepreneur Document Vault upon Approval
      if (status === 'Approved') {
        const appNameLower = targetApp.approvalName.toLowerCase();
        let certFileUrl = '/sample_documents/incorporation_certificate.jpg';
        if (appNameLower.includes('gst')) certFileUrl = '/sample_documents/gst_certificate.jpg';
        else if (appNameLower.includes('lease') || appNameLower.includes('midc') || appNameLower.includes('building')) certFileUrl = '/sample_documents/lease_ownership_deed.jpg';
        else if (appNameLower.includes('pan')) certFileUrl = '/sample_documents/pan_card.jpg';
        else if (appNameLower.includes('bank')) certFileUrl = '/sample_documents/bank_account_details.jpg';

        const regNo = `MH-2026-STAT-${Math.floor(10000 + Math.random() * 90000)}`;
        const certDocName = `Official Statutory Certificate - ${targetApp.approvalName}`;

        const newVaultCert: DocumentItem = {
          id: `doc-cert-${Date.now()}`,
          projectId: targetApp.projectId || activeProjectId,
          docName: certDocName,
          category: `${targetApp.department || 'Statutory License'}`,
          fileUrl: certFileUrl,
          fileSize: '1.4 MB',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Valid',
          aiValidationResult: {
            confidence: 99,
            issues: [],
            recommendations: ['Official Statutory License Issued & Cryptographically Signed by Government Officer.'],
            extractedName: activeProject?.businessName || targetApp.businessName,
            extractedRegNo: regNo
          }
        };

        setDocuments(prevDocs => {
          if (prevDocs.some(d => d.docName === certDocName && d.projectId === newVaultCert.projectId)) {
            return prevDocs;
          }
          return [newVaultCert, ...prevDocs];
        });
      }
    }

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
        userId: currentUser.id,
        projectId: activeProject?.id,
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

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Supabase Auth] signOut notice:', err);
    }
    localStorage.removeItem('pfn_user');
    setCurrentUser(INITIAL_USERS[0]);
    setActiveTab('login');
  };

  // ----------------------------------------------------
  // PARALLEL WORKFLOW COORDINATION LOGIC
  // ----------------------------------------------------

  const calculateParallelProgress = (targetProjectId?: string) => {
    const projId = targetProjectId || activeProjectId || (projects[0] ? projects[0].id : 'proj-1');
    const items = parallelPermissions.filter(p => p.projectId === projId);
    if (items.length === 0) {
      return { approvedCount: 0, totalRequired: 0, progressPercentage: 0 };
    }
    const approvedCount = items.filter(p => p.status === 'Approved').length;
    const totalRequired = items.length;
    const progressPercentage = Math.round((approvedCount / totalRequired) * 100);
    return { approvedCount, totalRequired, progressPercentage };
  };

  const triggerParallelAutoRouting = (targetProjectId?: string) => {
    const projId = targetProjectId || activeProjectId;
    const targetProj = projects.find(p => p.id === projId) || activeProject;

    const nowStr = new Date().toLocaleString();
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if entrepreneur has uploaded any documents for this project
    const projDocs = documents.filter(d => d.projectId === targetProj.id);
    const hasDocs = projDocs.length > 0;
    const attachedDocIds = projDocs.map(d => d.id);

    const isFoodSector = targetProj.sector === 'Food Processing' || targetProj.businessType?.toLowerCase().includes('food') || targetProj.businessName?.toLowerCase().includes('kadai') || targetProj.businessName?.toLowerCase().includes('food');

    const newPermissions: ParallelPermissionItem[] = [
      {
        id: `perm-${Date.now()}-1`,
        projectId: targetProj.id,
        approvalId: 'appr-8',
        approvalName: 'Pollution Consent (MPCB CTE)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        category: 'Environmental',
        assignedOfficer: 'Dr. V. K. Patil',
        officerEmail: 'vk.patil@mpcb.gov.in',
        status: hasDocs ? 'Submitted' : 'Documents Needed',
        pendingWith: hasDocs ? 'MPCB Officer' : 'Entrepreneur',
        pendingAction: hasDocs ? 'Technical scrutiny of stack height & emission controls' : 'Upload Pollution Abatement & Topo Layout documents',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: hasDocs ? [] : ['Pollution Abatement & Effluent Treatment Scheme', 'Site Plan / Topo Layout', 'Manufacturing Process Flow Diagram'],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 15,
        dependencies: [],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: hasDocs ? 'Automatically routed to MPCB with attached documents.' : 'Auto-routed to MPCB: Pending mandatory project document uploads from entrepreneur.',
        activityHistory: [{ 
          id: `a-1-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: hasDocs ? 'Auto-Routed to MPCB' : 'Auto-Registered (Documents Needed)', 
          notes: hasDocs ? 'Consent to Establish assigned to Dr. V. K. Patil' : 'Awaiting pollution control & site layout document uploads' 
        }]
      },
      {
        id: `perm-${Date.now()}-2`,
        projectId: targetProj.id,
        approvalId: 'appr-5',
        approvalName: 'Industrial Permission (MIDC Building Plan)',
        department: 'MIDC Infrastructure & Planning',
        category: 'Clearance',
        assignedOfficer: 'Er. Suresh Shinde',
        officerEmail: 'suresh.shinde@midcindia.org',
        status: hasDocs ? 'Submitted' : 'Documents Needed',
        pendingWith: hasDocs ? 'MIDC Officer' : 'Entrepreneur',
        pendingAction: hasDocs ? 'Architectural blueprint review' : 'Upload Architectural Blueprint & Structural Stability Certificate',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: hasDocs ? [] : ['Architectural Blueprint Drawings', 'Structural Stability Certificate', 'MIDC Land Allotment Letter'],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 14,
        dependencies: [],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: hasDocs ? 'Architectural blueprint drawings routed to MIDC Civil Planning team.' : 'Auto-routed to MIDC: Awaiting architectural drawing uploads.',
        activityHistory: [{ 
          id: `a-2-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: hasDocs ? 'Auto-Routed to MIDC' : 'Auto-Registered (Documents Needed)', 
          notes: hasDocs ? 'Building plan assigned to Er. Suresh Shinde' : 'Awaiting architectural blueprint & structural stability cert' 
        }]
      },
      {
        id: `perm-${Date.now()}-3`,
        projectId: targetProj.id,
        approvalId: 'appr-6',
        approvalName: 'Fire NOC (Provisional Safety Clearance)',
        department: 'Maharashtra Fire Services',
        category: 'Safety',
        assignedOfficer: 'Officer Sunita Rane',
        officerEmail: 'sunita.rane@mahfire.gov.in',
        status: hasDocs ? 'Submitted' : 'Documents Needed',
        pendingWith: hasDocs ? 'Fire Officer' : 'Entrepreneur',
        pendingAction: hasDocs ? 'Fire fighting equipment layout review' : 'Upload Fire Fighting Equipment Layout & Water Tank Plan',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: hasDocs ? [] : ['Fire Fighting Equipment Layout', 'Building Section Elevations', 'Water Storage Tank Plan'],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 10,
        dependencies: [],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: hasDocs ? 'Fire Fighting Equipment layout under review by Fire Inspectorate.' : 'Auto-routed to Fire Services: Pending fire layout drawings.',
        activityHistory: [{ 
          id: `a-3-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: hasDocs ? 'Auto-Routed to Fire Dept' : 'Auto-Registered (Documents Needed)', 
          notes: hasDocs ? 'Provisional Fire NOC assigned to Officer Sunita Rane' : 'Awaiting fire safety layout drawings' 
        }]
      },
      {
        id: `perm-${Date.now()}-4`,
        projectId: targetProj.id,
        approvalId: 'appr-7',
        approvalName: 'Factory / Labour Licence (DISH Safety Clearance)',
        department: 'Directorate of Industrial Safety & Health (DISH)',
        category: 'Safety',
        assignedOfficer: 'Inspector A. B. Kadam',
        officerEmail: 'ab.kadam@dish.maharashtra.gov.in',
        status: 'Blocked by Dependency',
        pendingWith: 'MPCB & Fire Departments',
        pendingAction: 'Waiting for prerequisite MPCB Pollution Consent & Fire NOC approvals',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: ['Factory Form 1 Application', 'Machine Layout Plan', 'Prerequisite MPCB CTE & Fire NOC'],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 25,
        dependencies: ['appr-8', 'appr-6', 'mpcb-cte', 'fire-noc'],
        blockedBy: ['MPCB Consent to Establish (CTE)', 'Provisional Fire Safety NOC'],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: 'Auto-blocked: Awaiting prerequisite MPCB CTE & Fire NOC approvals.',
        activityHistory: [{ 
          id: `a-4-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: 'Auto-Routed (Gated)', 
          notes: 'DISH Factory Licence waiting for MPCB CTE and Fire NOC approvals' 
        }]
      },
      {
        id: `perm-${Date.now()}-5`,
        projectId: targetProj.id,
        approvalId: 'appr-10',
        approvalName: 'Electricity Connection (MSEDCL 11kV Load)',
        department: 'Maharashtra State Electricity Distribution Co Ltd (MSEDCL)',
        category: 'Utility',
        assignedOfficer: 'Er. R. N. Deshpande',
        officerEmail: 'rn.deshpande@mahadiscom.in',
        status: hasDocs ? 'Submitted' : 'Documents Needed',
        pendingWith: hasDocs ? 'MSEDCL Officer' : 'Entrepreneur',
        pendingAction: hasDocs ? 'Transformer load sanction review' : 'Upload Single Line Diagram (SLD) & Connected Load Test Report',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: hasDocs ? [] : ['Transformer Single Line Diagram (SLD)', 'Connected Electrical Load Sanction Test Report'],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 12,
        dependencies: [],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: hasDocs ? 'Load sanction application routed to MSEDCL Substation Engineer.' : 'Auto-routed to MSEDCL: Awaiting electrical SLD & load sanction docs.',
        activityHistory: [{ 
          id: `a-5-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: hasDocs ? 'Auto-Routed to MSEDCL' : 'Auto-Registered (Documents Needed)', 
          notes: hasDocs ? 'Grid Load connection assigned to Er. R. N. Deshpande' : 'Awaiting electrical Single Line Diagram' 
        }]
      },
      {
        id: `perm-${Date.now()}-6`,
        projectId: targetProj.id,
        approvalId: 'appr-12',
        approvalName: 'Food Licence (Central FSSAI Processing Licence)',
        department: 'Food Safety & Standards Authority (FSSAI)',
        category: 'Registration',
        assignedOfficer: 'Officer Meena Thorat',
        officerEmail: 'm.thorat@fssai.gov.in',
        status: isFoodSector ? (hasDocs ? 'Submitted' : 'Documents Needed') : 'Not Started',
        pendingWith: isFoodSector ? (hasDocs ? 'FSSAI Officer' : 'Entrepreneur') : 'Not Started',
        pendingAction: isFoodSector ? (hasDocs ? 'Hygiene & food safety scrutiny' : 'Upload FSMS Plan & NABL Water Test Lab Report') : 'Sector clearance',
        dateReceived: todayStr,
        lastUpdatedDateTime: nowStr,
        pendingDocs: isFoodSector ? (hasDocs ? [] : ['Food Safety Management System (FSMS) Plan', 'NABL Water Quality Lab Report']) : [],
        documentIds: hasDocs ? attachedDocIds : [],
        queriesCount: 0,
        slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        slaDaysRemaining: 15,
        dependencies: [],
        submittedDate: todayStr,
        lastUpdatedDate: todayStr,
        remarks: hasDocs ? 'Food hygiene compliance protocol submitted.' : 'Auto-routed to FSSAI: Awaiting FSMS plan & NABL water test report.',
        activityHistory: [{ 
          id: `a-6-${Date.now()}`, 
          timestamp: nowStr, 
          actor: currentUser.name, 
          department: 'System', 
          action: isFoodSector ? (hasDocs ? 'Auto-Routed to FSSAI' : 'Auto-Registered (Documents Needed)') : 'Not Required', 
          notes: isFoodSector ? (hasDocs ? 'Food licence assigned to Officer Meena Thorat' : 'Awaiting FSMS & water report') : 'Non-food sector' 
        }]
      }
    ];

    setParallelPermissions(prev => [
      ...newPermissions,
      ...prev.filter(p => p.projectId !== targetProj.id)
    ]);

    // SYNC WITH APPLICATIONS STATE (Powers the Smart Approval Checklist)
    const newApplications: Application[] = newPermissions.map((perm, idx) => {
      const deptCode = perm.department.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
      return {
        id: `app-${Date.now()}-${idx}`,
        appId: `PFN-2026-${deptCode}-${Math.floor(100 + Math.random() * 900)}`,
        projectId: targetProj.id,
        businessName: targetProj.businessName,
        approvalId: perm.approvalId,
        approvalName: perm.approvalName,
        department: perm.department,
        submissionDate: todayStr,
        slaDeadlineDate: perm.slaDeadlineDate,
        slaDaysRemaining: perm.slaDaysRemaining,
        status: perm.status,
        riskScore: Math.floor(15 + Math.random() * 20),
        remarks: perm.remarks,
        officerAssigned: perm.assignedOfficer,
        timeline: [
          {
            id: `t-${Date.now()}-${idx}`,
            title: perm.status === 'Documents Needed' ? 'Auto-Routed (Awaiting Mandatory Documents)' : 'Auto-Routed to Department Officer',
            description: perm.status === 'Documents Needed' 
              ? `Application registered for ${perm.approvalName}. Please upload the required documents.` 
              : `Application for ${perm.approvalName} automatically assigned to ${perm.assignedOfficer}.`,
            timestamp: nowStr,
            actor: currentUser.name,
            role: currentUser.role
          }
        ],
        queries: [],
        documentIds: perm.documentIds || []
      };
    });

    setApplications(prev => [
      ...newApplications,
      ...prev.filter(a => a.projectId !== targetProj.id || !newPermissions.some(np => np.approvalId === a.approvalId))
    ]);

    // Persist new applications in background
    newApplications.forEach(app => {
      createApplicationApi(app).catch(err => console.warn('Could not persist auto-routed app to database:', err));
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: targetProj.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: hasDocs ? '⚡ Parallel Workflow Auto-Routed' : '⚡ Clearance Applications Initiated',
        message: hasDocs 
          ? `Project "${targetProj.businessName}" permissions submitted with documents to MPCB, Fire, DISH, MIDC, MSEDCL & FSSAI.` 
          : `Project "${targetProj.businessName}" clearances initiated. Please upload mandatory documents to complete departmental submission.`,
        type: hasDocs ? 'SUCCESS' : 'WARNING',
        read: false,
        channels: ['IN_APP', 'EMAIL']
      },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'Triggered Parallel Workflow Auto-Routing',
        ipAddress: '192.168.1.45',
        details: `Auto-routed 6 department approvals in parallel for project ${targetProj.businessName}.`
      },
      ...prev
    ]);
  };

  const updateParallelPermissionStatus = (
    permId: string, 
    newStatus: ApprovalStatus, 
    remarks?: string, 
    inspectionDate?: string,
    delayReason?: string
  ) => {
    // 1. Synchronously find matching item first
    const matchedPerm = parallelPermissions.find(p => p.id === permId || p.approvalId === permId || (p.approvalName && p.approvalName.toLowerCase().trim() === permId.toLowerCase().trim()));
    const matchedApp = applications.find(a => a.id === permId || a.approvalId === permId || (a.approvalName && a.approvalName.toLowerCase().trim() === permId.toLowerCase().trim()));

    const targetProjectId = matchedPerm?.projectId || matchedApp?.projectId || activeProject?.id;
    const targetApprovalName = matchedPerm?.approvalName || matchedApp?.approvalName || '';
    const targetApprovalId = matchedPerm?.approvalId || matchedApp?.approvalId || permId;

    let updatedTarget: ParallelPermissionItem | undefined = matchedPerm;

    // 2. Synchronize applications state
    setApplications(prev => prev.map(app => {
      const isMatch = app.id === permId || 
        app.approvalId === permId || 
        (targetApprovalId && app.approvalId === targetApprovalId) ||
        (targetApprovalName && app.approvalName.toLowerCase().trim() === targetApprovalName.toLowerCase().trim() && (!targetProjectId || app.projectId === targetProjectId));
      
      if (isMatch) {
        return {
          ...app,
          status: newStatus,
          remarks: remarks || app.remarks,
          inspectionDate: inspectionDate || (app as any).inspectionDate,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: newStatus === 'Inspection Pending' ? 'Site Inspection Scheduled' : `Status set to ${newStatus}`,
              description: remarks || `Officer ${currentUser.name} updated status to ${newStatus}.`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: currentUser.name,
              role: currentUser.role
            }
          ]
        };
      }
      return app;
    }));

    // 3. Synchronize parallelPermissions state
    setParallelPermissions(prevPermissions => {
      const exists = prevPermissions.some(p => 
        p.id === permId || 
        p.approvalId === permId || 
        (targetApprovalId && p.approvalId === targetApprovalId) ||
        (targetApprovalName && p.approvalName.toLowerCase().trim() === targetApprovalName.toLowerCase().trim() && (!targetProjectId || p.projectId === targetProjectId))
      );

      if (!exists && matchedApp) {
        const newP: ParallelPermissionItem = {
          id: permId,
          projectId: matchedApp.projectId,
          approvalId: matchedApp.approvalId,
          approvalName: matchedApp.approvalName,
          department: matchedApp.department,
          category: 'Registration',
          assignedOfficer: currentUser.name,
          officerEmail: currentUser.email,
          status: newStatus,
          delayReason: delayReason,
          pendingWith: newStatus === 'Approved' ? 'Completed' : (newStatus === 'Inspection Pending' ? 'Field Inspector & Entrepreneur' : 'Department Officer'),
          pendingAction: newStatus === 'Approved' ? 'Permission Issued' : (newStatus === 'Inspection Pending' ? `Prepare site for audit on ${inspectionDate || 'scheduled date'}` : 'Officer Processing'),
          dateReceived: matchedApp.submissionDate || new Date().toISOString().split('T')[0],
          lastUpdatedDateTime: new Date().toLocaleString(),
          pendingDocs: [],
          queriesCount: 0,
          slaDeadlineDate: matchedApp.slaDeadlineDate,
          slaDaysRemaining: matchedApp.slaDaysRemaining || 15,
          dependencies: [],
          submittedDate: matchedApp.submissionDate,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          documentIds: matchedApp.documentIds,
          inspectionDate: inspectionDate,
          remarks: remarks || `Permission status set to ${newStatus}`
        };
        updatedTarget = newP;
        return [newP, ...prevPermissions];
      }

      const updatedList = prevPermissions.map(p => {
        const isMatch = p.id === permId || 
          p.approvalId === permId || 
          (targetApprovalId && p.approvalId === targetApprovalId) ||
          (targetApprovalName && p.approvalName.toLowerCase().trim() === targetApprovalName.toLowerCase().trim() && (!targetProjectId || p.projectId === targetProjectId));
        
        if (isMatch) {
          const updated: ParallelPermissionItem = {
            ...p,
            status: newStatus,
            delayReason: delayReason !== undefined ? delayReason : p.delayReason,
            remarks: remarks || p.remarks,
            inspectionDate: inspectionDate || p.inspectionDate,
            pendingWith: newStatus === 'Approved' ? 'Completed' : (newStatus === 'Inspection Pending' ? 'Field Inspector & Entrepreneur' : (newStatus === 'Delayed' ? currentUser.department || 'Department Officer' : p.pendingWith)),
            pendingAction: newStatus === 'Approved' ? 'Permission Issued' : (newStatus === 'Inspection Pending' ? `Prepare site for audit on ${inspectionDate || p.inspectionDate || 'scheduled date'}` : (newStatus === 'Delayed' ? 'Expedite technical scrutiny' : p.pendingAction)),
            lastUpdatedDate: new Date().toISOString().split('T')[0],
            lastUpdatedDateTime: new Date().toLocaleString()
          };
          updatedTarget = updated;
          return updated;
        }
        return p;
      });

      if (newStatus === 'Approved') {
        const approvedApprovalIds = new Set(
          updatedList
            .filter(p => p.projectId === targetProjectId && p.status === 'Approved')
            .map(p => p.approvalId)
        );

        return updatedList.map(p => {
          if (p.projectId === targetProjectId && p.status === 'Blocked by Dependency' && p.dependencies.length > 0) {
            const allSatisfied = p.dependencies.every(depId => approvedApprovalIds.has(depId));
            if (allSatisfied) {
              return {
                ...p,
                status: 'Submitted' as ApprovalStatus,
                blockedBy: [],
                remarks: `Auto-unblocked: Prerequisites (${p.dependencies.join(', ')}) have been granted approval.`
              };
            }
          }
          return p;
        });
      }

      return updatedList;
    });

    // 3. Persist to Backend Database
    updateApplicationStatusApi(permId, newStatus, remarks, currentUser.name).catch(err =>
      console.warn('Could not persist status to backend API:', err)
    );

    if (updatedTarget) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          projectId: updatedTarget?.projectId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          title: `Status Updated: ${updatedTarget?.approvalName}`,
          message: `${updatedTarget?.department} updated permission status to "${newStatus}".`,
          type: newStatus === 'Approved' ? 'SUCCESS' : newStatus === 'Rejected' ? 'ALERT' : 'INFO',
          read: false,
          channels: ['IN_APP', 'EMAIL']
        },
        ...prev
      ]);

      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          user: currentUser.name,
          role: currentUser.role,
          action: 'Updated Parallel Permission Status',
          previousStatus: updatedTarget?.status,
          newStatus,
          ipAddress: '10.240.12.91',
          details: remarks || `Permission "${updatedTarget?.approvalName}" status set to ${newStatus} by ${currentUser.name}.`
        },
        ...prev
      ]);
    }
  };

  const raiseParallelPermissionQuery = (permId: string, queryCategory: string, queryText: string, dueDate: string) => {
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === permId || p.approvalId === permId) {
        const newQuery = {
          id: `q-perm-${Date.now()}`,
          queryCategory,
          queryText,
          raisedDate: new Date().toISOString().split('T')[0],
          dueDate
        };
        const existingQueries = p.openQueries || [];
        return {
          ...p,
          status: 'Query Raised' as ApprovalStatus,
          queriesCount: existingQueries.length + 1,
          openQueries: [...existingQueries, newQuery],
          lastUpdatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject?.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: '⚠️ Query Raised on Department Clearance',
        message: `Officer ${currentUser.name} raised query: "${queryCategory}". Action required before deadline.`,
        type: 'WARNING',
        read: false,
        channels: ['IN_APP', 'EMAIL', 'SMS']
      },
      ...prev
    ]);
  };

  const respondToParallelPermissionQuery = (permId: string, queryId: string, responseText: string) => {
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === permId || p.approvalId === permId) {
        const remainingQueries = (p.openQueries || []).filter(q => q.id !== queryId);
        const newStatus = remainingQueries.length === 0 ? 'Under Review' as ApprovalStatus : 'More Information Needed' as ApprovalStatus;
        const nowStr = new Date().toLocaleString();
        const newActivity = {
          id: `act-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser.name,
          department: 'Entrepreneur',
          action: 'Query Response Submitted',
          notes: responseText
        };
        return {
          ...p,
          status: newStatus,
          pendingWith: currentUser.department || 'Department Officer',
          pendingAction: 'Scrutinize entrepreneur query response',
          queriesCount: remainingQueries.length,
          openQueries: remainingQueries,
          remarks: `Applicant responded: "${responseText.substring(0, 40)}..."`,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          lastUpdatedDateTime: nowStr,
          activityHistory: [newActivity, ...(p.activityHistory || [])]
        };
      }
      return p;
    }));
  };

  const officerApprovePermission = (permId: string, remarks?: string) => {
    updateParallelPermissionStatus(permId, 'Approved', remarks);
  };

  const officerRejectPermission = (permId: string, remarks?: string) => {
    updateParallelPermissionStatus(permId, 'Rejected', remarks);
  };

  const officerRequestDocument = (permId: string, documentName: string, instructions?: string) => {
    const nowStr = new Date().toLocaleString();
    updateParallelPermissionStatus(permId, 'More Information Needed', instructions || `Requested document: ${documentName}`);
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === permId || p.approvalId === permId) {
        const updatedDocs = Array.from(new Set([...p.pendingDocs, documentName]));
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser.name,
          department: currentUser.department || 'Department Officer',
          action: `Requested Document: ${documentName}`,
          notes: instructions
        };
        return {
          ...p,
          status: 'More Information Needed' as ApprovalStatus,
          pendingWith: 'Entrepreneur',
          pendingAction: `Upload document: ${documentName}`,
          pendingDocs: updatedDocs,
          remarks: instructions || `Requested document: ${documentName}`,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          lastUpdatedDateTime: nowStr,
          activityHistory: [newAct, ...(p.activityHistory || [])]
        };
      }
      return p;
    }));

    // Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject?.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: '⚠️ Action Required: Document Requested',
        message: `Officer ${currentUser.name} requested "${documentName}". Please upload in Document Centre.`,
        type: 'WARNING',
        read: false,
        channels: ['IN_APP', 'EMAIL', 'SMS']
      },
      ...prev
    ]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'Requested Additional Document',
        newStatus: 'More Information Needed',
        ipAddress: '10.240.12.91',
        details: `Requested document "${documentName}" for permission ${permId}.`
      },
      ...prev
    ]);
  };

  const officerScheduleInspection = (permId: string, inspectionDate: string, location?: string) => {
    const nowStr = new Date().toLocaleString();
    
    // Find target permission and project
    const targetItem = parallelPermissions.find(p => p.id === permId || p.approvalId === permId) || 
      applications.find(a => a.id === permId || a.approvalId === permId);
    
    const targetProjectId = targetItem?.projectId || activeProject?.id || 'proj-1';
    const targetProj = projects.find(p => p.id === targetProjectId) || activeProject;
    const approvalName = targetItem?.approvalName || 'Department Clearance';
    const departmentName = targetItem?.department || currentUser.department || 'Statutory Department';

    updateParallelPermissionStatus(permId, 'Inspection Pending', `Inspection scheduled on ${inspectionDate}`, inspectionDate);
    
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === permId || p.approvalId === permId || (p.approvalName && p.approvalName.toLowerCase() === approvalName.toLowerCase() && p.projectId === targetProjectId)) {
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser.name,
          department: currentUser.department || 'Department Officer',
          action: 'Scheduled Site Inspection',
          notes: `Inspection scheduled for ${inspectionDate} at ${location || targetProj?.midcArea || 'Factory site'}`
        };
        return {
          ...p,
          status: 'Inspection Pending' as ApprovalStatus,
          pendingWith: 'Field Inspector & Entrepreneur',
          pendingAction: `Prepare site for audit on ${inspectionDate}`,
          inspectionDate,
          remarks: `Inspection scheduled for ${inspectionDate}`,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          lastUpdatedDateTime: nowStr,
          activityHistory: [newAct, ...(p.activityHistory || [])]
        };
      }
      return p;
    }));

    // Synchronize into individual inspections state list
    const inspectionType = (approvalName.toLowerCase().includes('fire') ? 'Fire Safety Compliance' 
      : approvalName.toLowerCase().includes('pollution') || approvalName.toLowerCase().includes('mpcb') ? 'Pollution Emission Audit'
      : approvalName.toLowerCase().includes('dish') || approvalName.toLowerCase().includes('factory') ? 'DISH Factory Safety Check'
      : approvalName.toLowerCase().includes('food') || approvalName.toLowerCase().includes('fssai') ? 'FSSAI Hygiene Inspection'
      : 'Pre-Setup Site Audit');

    const newInspItem: InspectionItem = {
      id: `insp-${Date.now()}`,
      applicationId: permId,
      approvalName: approvalName,
      businessName: targetProj?.businessName || 'Industrial Enterprise',
      department: departmentName,
      inspectionType: inspectionType as any,
      scheduledDate: inspectionDate,
      location: location || targetProj?.midcArea || 'Plot Premises / Industrial Zone',
      officerDetails: {
        name: currentUser.name,
        designation: 'Scrutiny Officer / Field Inspector',
        contact: '+91 22 2202 5555'
      },
      requiredDocs: [
        'Certified Site Master Plan Blueprint',
        'Building Safety & Egress Layout',
        'Environmental & Waste Discharge Plan',
        'Equipment & Machinery Schedule'
      ],
      status: 'SCHEDULED',
      isJointInspection: false,
      participatingDepts: [departmentName]
    };
    (newInspItem as any).projectId = targetProjectId;

    setInspections(prev => [newInspItem, ...prev.filter(i => i.applicationId !== permId && i.id !== permId)]);

    // Also synchronize into jointInspections state list
    const newJointInsp: JointInspection = {
      id: `joint-insp-${Date.now()}`,
      nocApplicationId: permId,
      projectId: targetProjectId,
      businessName: targetProj?.businessName || 'Industrial Enterprise',
      scheduledDate: inspectionDate.split(' ')[0] || new Date().toISOString().split('T')[0],
      scheduledTime: inspectionDate.split(' ')[1] ? inspectionDate.split(' ').slice(1).join(' ') : '11:00 AM',
      attendingDepartments: [departmentName, 'MIDC Field Cell', 'Industrial Safety Inspectorate'],
      officerNames: [currentUser.name, 'Zonal Field Inspector'],
      inspectionLocation: location || targetProj?.midcArea || 'Industrial Plot Site',
      rubricChecklist: [
        { criterion: 'Boundary setbacks, access roads, and plot demarcation verified as per master plan', compliant: null, notes: 'Scheduled for physical audit' },
        { criterion: 'Emergency fire exits, hydrant pressure ring, and unobstructed egress points', compliant: null, notes: 'Pressure & flow testing pending' },
        { criterion: 'Effluent treatment plant / environmental discharge manifold and air filters', compliant: null, notes: 'Inspection scheduled' },
        { criterion: 'Occupational safety guardrails, ventilation, and statutory electrical earthing', compliant: null, notes: 'Field checklist ready' }
      ],
      status: 'SCHEDULED',
      remarks: `Inspection scheduled by Officer ${currentUser.name} on ${nowStr}`
    };

    setJointInspections(prev => [newJointInsp, ...prev.filter(j => j.nocApplicationId !== permId)]);

    // Dispatch notifications to BOTH Entrepreneur and Officer
    const notifPayload = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      title: '📅 Site Inspection Scheduled',
      message: `Officer ${currentUser.name} (${departmentName}) scheduled a site inspection for "${approvalName}" on ${inspectionDate}. Please keep physical site and drawings ready.`,
      type: 'INFO' as const,
      read: false,
      channels: ['IN_APP' as const, 'EMAIL' as const, 'SMS' as const]
    };

    setNotifications(prev => [
      {
        ...notifPayload,
        id: `notif-ent-${Date.now()}`,
        userId: targetProj?.userId || 'user_1',
        projectId: targetProjectId
      },
      {
        ...notifPayload,
        id: `notif-off-${Date.now() + 1}`,
        userId: currentUser.id,
        projectId: targetProjectId
      },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: 'Scheduled Site Inspection',
        newStatus: 'Inspection Pending',
        ipAddress: '10.240.12.91',
        details: `Scheduled inspection on ${inspectionDate} for "${approvalName}" (${permId}).`
      },
      ...prev
    ]);
  };

  const officerMarkDelayed = (permId: string, delayReason: string, remarks?: string) => {
    const nowStr = new Date().toLocaleString();
    updateParallelPermissionStatus(permId, 'Delayed', remarks, undefined, delayReason);
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === permId || p.approvalId === permId) {
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser.name,
          department: currentUser.department || 'Department Officer',
          action: 'Flagged Application Delay',
          notes: `Reason: ${delayReason}`
        };
        return {
          ...p,
          status: 'Delayed' as ApprovalStatus,
          pendingWith: currentUser.department || 'Department Officer',
          delayReason,
          pendingAction: 'Expedite technical scrutiny',
          remarks: remarks || `Delayed: ${delayReason}`,
          lastUpdatedDate: new Date().toISOString().split('T')[0],
          lastUpdatedDateTime: nowStr,
          activityHistory: [newAct, ...(p.activityHistory || [])]
        };
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject?.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: '🚨 Delay Flagged on Permission',
        message: `Permission delayed with ${currentUser.department || 'Department'}. Reason: ${delayReason}.`,
        type: 'ALERT',
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
        action: 'Flagged Permission Delay',
        previousStatus: 'Under Review',
        newStatus: 'Delayed',
        ipAddress: '10.240.12.91',
        details: `Flagged delay: "${delayReason}". Remarks: ${remarks || 'None'}`
      },
      ...prev
    ]);
  };

  const issueDigitalCertificate = (
    itemId: string, 
    certType: 'PROVISIONAL' | 'FINAL' = 'FINAL', 
    tenureYears: number = 3, 
    conditions?: string
  ) => {
    const certId = `MH-2026-${(currentUser.department || 'STAT').substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const issuedDate = new Date().toISOString().split('T')[0];
    const expiryDate = tenureYears > 0 
      ? new Date(Date.now() + tenureYears * 365 * 86400000).toISOString().split('T')[0]
      : undefined;
    const validityTenure = tenureYears === 0 ? 'Permanent' : `${tenureYears} Year${tenureYears > 1 ? 's' : ''}`;
    const qrToken = `PFN-CERT:${certId}:${certType}:${issuedDate}`;
    const sig = `Digitally Signed by ${currentUser.name}, ${currentUser.department || 'Competent Authority'}`;

    // 1. Update applications
    setApplications(prev => prev.map(app => {
      if (app.id === itemId || app.approvalId === itemId || (app.approvalName && app.approvalName.toLowerCase().includes(itemId.toLowerCase()))) {
        return {
          ...app,
          status: 'Approved' as ApprovalStatus,
          certificateId: certId,
          certificateIssuedDate: issuedDate,
          certificateExpiryDate: expiryDate,
          certificateValidityTenure: validityTenure,
          certificateQrToken: qrToken,
          certificateType: certType,
          certificateConditions: conditions,
          certificateOfficerSignature: sig,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: `Digital Certificate Issued (${certType})`,
              description: `Officer ${currentUser.name} issued ${certType} Certificate ${certId} with ${validityTenure} validity.`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              actor: currentUser.name,
              role: currentUser.role
            }
          ]
        };
      }
      return app;
    }));

    // 2. Update parallelPermissions
    setParallelPermissions(prev => prev.map(p => {
      if (p.id === itemId || p.approvalId === itemId || (p.approvalName && p.approvalName.toLowerCase().includes(itemId.toLowerCase()))) {
        const nowStr = new Date().toLocaleString();
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser.name,
          department: currentUser.department || 'Department Officer',
          action: `Issued Digital ${certType} Certificate`,
          notes: `Certificate ID: ${certId} (${validityTenure})`
        };
        return {
          ...p,
          status: 'Approved' as ApprovalStatus,
          certificateId: certId,
          certificateIssuedDate: issuedDate,
          certificateExpiryDate: expiryDate,
          certificateValidityTenure: validityTenure,
          certificateQrToken: qrToken,
          certificateType: certType,
          certificateConditions: conditions,
          certificateOfficerSignature: sig,
          pendingWith: 'Completed',
          pendingAction: 'Certificate Issued',
          lastUpdatedDateTime: nowStr,
          activityHistory: [newAct, ...(p.activityHistory || [])]
        };
      }
      return p;
    }));

    // Audit log & notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        projectId: activeProject?.id,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        title: `📜 Official ${certType} Certificate Issued`,
        message: `Officer ${currentUser.name} issued certificate ${certId} for your clearance. Download in Document Centre.`,
        type: 'SUCCESS',
        read: false,
        channels: ['IN_APP', 'EMAIL']
      },
      ...prev
    ]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.name,
        role: currentUser.role,
        action: `Issued Digital Certificate (${certType})`,
        newStatus: 'Approved',
        ipAddress: '10.240.12.91',
        details: `Issued ${certType} Certificate ${certId} with ${validityTenure} validity for item ${itemId}.`
      },
      ...prev
    ]);

    return { certificateId: certId, qrToken };
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
        parallelPermissions,
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
        triggerParallelAutoRouting,
        updateParallelPermissionStatus,
        raiseParallelPermissionQuery,
        respondToParallelPermissionQuery,
        calculateParallelProgress,
        officerApprovePermission,
        officerRejectPermission,
        officerRequestDocument,
        officerScheduleInspection,
        officerMarkDelayed,
        issueDigitalCertificate,
        submitNocApplication,
        scheduleJointInspection,
        completeJointInspection,
        raiseNocQuery,
        respondToNocQuery,
        issueNocCertificate,
        deleteAccount,
        signOutUser,
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
