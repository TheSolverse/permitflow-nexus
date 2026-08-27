import { pool, isDbConnected } from './pool';
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
} from '../../src/data/mockData';
import { 
  BusinessProject, 
  Application, 
  DocumentItem, 
  InspectionItem, 
  ComplianceTask, 
  IncentiveScheme, 
  AuditLogItem, 
  NotificationItem, 
  ApprovalRule, 
  NocApplication, 
  JointInspection 
} from '../../src/types';

// In-memory cache / fallback store
let memoryUsers = [...INITIAL_USERS];
let memoryProjects = [...INITIAL_PROJECTS];
let memoryApplications = [...INITIAL_APPLICATIONS];
let memoryDocuments = [...INITIAL_DOCUMENTS];
let memoryInspections = [...INITIAL_INSPECTIONS];
let memoryCompliance = [...INITIAL_COMPLIANCE_TASKS];
let memoryIncentives = [...INITIAL_INCENTIVE_SCHEMES];
let memoryAuditLogs = [...INITIAL_AUDIT_LOGS];
let memoryNotifications = [...INITIAL_NOTIFICATIONS];
let memoryRules = [...INITIAL_RULES];
let memoryNoc = [...INITIAL_NOC_APPLICATIONS];
let memoryJointInsp = [...INITIAL_JOINT_INSPECTIONS];

// ================= USERS =================
export async function getUsers() {
  if (isDbConnected()) {
    try {
      const res = await pool.query('SELECT * FROM users ORDER BY name ASC');
      return res.rows;
    } catch (e) {
      console.error('Error fetching users from DB:', e);
    }
  }
  return memoryUsers;
}

export async function findUserByEmailAndRole(email: string, role?: string) {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
      const params = [email];
      if (role) {
        query += ' AND role = $2';
        params.push(role);
      }
      const res = await pool.query(query, params);
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {
      console.error('Error finding user in DB:', e);
    }
  }
  return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)) || null;
}

export async function deleteUser(userId: string) {
  if (isDbConnected()) {
    try {
      // 1. Delete user's business projects (cascades to applications, documents, compliance tasks)
      await pool.query('DELETE FROM business_projects WHERE user_id = $1', [userId]);
      // 2. Delete user row
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      return { success: true };
    } catch (e) {
      console.error('Error deleting user from DB:', e);
      throw e;
    }
  }
  memoryUsers = memoryUsers.filter(u => u.id !== userId);
  memoryProjects = memoryProjects.filter(p => p.userId !== userId);
  return { success: true };
}

// ================= PROJECTS =================
export async function getProjects(userId?: string): Promise<BusinessProject[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM business_projects';
      const params: any[] = [];
      if (userId) {
        query += ' WHERE user_id = $1';
        params.push(userId);
      }
      query += ' ORDER BY created_at DESC';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        businessName: r.business_name,
        sector: r.sector,
        subSector: r.sub_sector,
        investmentRange: r.investment_range,
        estimatedInvestmentCr: parseFloat(r.estimated_investment_cr) || undefined,
        proposedEmployees: r.proposed_employees || undefined,
        landStatus: r.land_status,
        midcArea: r.midc_area,
        district: r.district,
        taluka: r.taluka,
        powerRequirementKW: parseFloat(r.power_requirement_kw) || undefined,
        waterRequirementLPD: parseFloat(r.water_requirement_lpd) || undefined,
        hazardousMaterials: r.hazardous_materials,
        projectStage: r.project_stage,
        createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));
    } catch (e) {
      console.error('Error fetching projects from DB:', e);
    }
  }
  if (userId) return memoryProjects.filter(p => p.userId === userId);
  return memoryProjects;
}

export async function createProject(projectData: Partial<BusinessProject>): Promise<BusinessProject> {
  const newProject: BusinessProject = {
    id: projectData.id || `proj-${Date.now()}`,
    userId: projectData.userId || 'usr-ent-1',
    businessName: projectData.businessName || 'New Venture',
    sector: projectData.sector || 'Manufacturing',
    subSector: projectData.subSector,
    investmentRange: projectData.investmentRange || '₹5Cr - ₹10Cr',
    estimatedInvestmentCr: projectData.estimatedInvestmentCr,
    proposedEmployees: projectData.proposedEmployees || 25,
    landStatus: projectData.landStatus || 'MIDC Allotted',
    midcArea: projectData.midcArea || 'Chakan MIDC',
    district: projectData.district || 'Pune',
    taluka: projectData.taluka || 'Khed',
    powerRequirementKW: projectData.powerRequirementKW,
    waterRequirementLPD: projectData.waterRequirementLPD,
    hazardousMaterials: projectData.hazardousMaterials || false,
    projectStage: projectData.projectStage || 'PLANNING',
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (isDbConnected()) {
    try {
      await pool.query(
        `INSERT INTO business_projects (
          id, user_id, business_name, sector, sub_sector, investment_range, 
          estimated_investment_cr, proposed_employees, land_status, midc_area, 
          district, taluka, power_requirement_kw, water_requirement_lpd, 
          hazardous_materials, project_stage, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          newProject.id,
          newProject.userId,
          newProject.businessName,
          newProject.sector,
          newProject.subSector || null,
          newProject.investmentRange,
          newProject.estimatedInvestmentCr || null,
          newProject.proposedEmployees || null,
          newProject.landStatus || null,
          newProject.midcArea || null,
          newProject.district || null,
          newProject.taluka || null,
          newProject.powerRequirementKW || null,
          newProject.waterRequirementLPD || null,
          newProject.hazardousMaterials,
          newProject.projectStage,
          newProject.createdAt
        ]
      );
    } catch (e) {
      console.error('Error inserting project into DB:', e);
    }
  }

  memoryProjects.unshift(newProject);
  return newProject;
}

// ================= APPLICATIONS =================
export async function getApplications(filters?: { userId?: string; projectId?: string; status?: string; department?: string }): Promise<Application[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM applications WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (filters?.userId) {
        query += ` AND project_id IN (SELECT id FROM business_projects WHERE user_id = $${paramCount++})`;
        params.push(filters.userId);
      }
      if (filters?.projectId) {
        query += ` AND project_id = $${paramCount++}`;
        params.push(filters.projectId);
      }
      if (filters?.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filters.status);
      }
      if (filters?.department) {
        query += ` AND department ILIKE $${paramCount++}`;
        params.push(`%${filters.department}%`);
      }

      query += ' ORDER BY created_at DESC';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        appId: r.app_id,
        projectId: r.project_id,
        businessName: r.business_name,
        approvalId: r.approval_id,
        approvalName: r.approval_name,
        department: r.department,
        submissionDate: r.submission_date,
        slaDeadlineDate: r.sla_deadline_date,
        slaDaysRemaining: r.sla_days_remaining,
        status: r.status,
        officerAssigned: r.officer_assigned,
        riskScore: r.risk_score,
        remarks: r.remarks,
        timeline: r.timeline || [],
        queries: r.queries || [],
        documentIds: r.document_ids || []
      }));
    } catch (e) {
      console.error('Error fetching applications from DB:', e);
    }
  }

  let list = [...memoryApplications];
  if (filters?.projectId) list = list.filter(a => a.projectId === filters.projectId);
  if (filters?.status) list = list.filter(a => a.status === filters.status);
  if (filters?.department) list = list.filter(a => a.department.toLowerCase().includes(filters.department!.toLowerCase()));
  return list;
}

export async function createApplication(data: Partial<Application>): Promise<Application> {
  const newApp: Application = {
    id: data.id || `app-${Date.now()}`,
    appId: data.appId || `PFN-2026-${(data.department || 'DEPT').substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    projectId: data.projectId || memoryProjects[0]?.id || 'proj-1',
    businessName: data.businessName || memoryProjects[0]?.businessName || 'Business Unit',
    approvalId: data.approvalId || 'appr-1',
    approvalName: data.approvalName || 'Standard Approval',
    department: data.department || 'Department of Industries',
    submissionDate: new Date().toISOString().split('T')[0],
    slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    slaDaysRemaining: 15,
    status: 'Submitted',
    riskScore: Math.floor(20 + Math.random() * 30),
    timeline: [
      {
        id: `t-${Date.now()}`,
        title: 'Application Submitted',
        description: 'Application submitted successfully to department portal.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: data.businessName || 'Entrepreneur',
        role: 'ENTREPRENEUR'
      }
    ],
    queries: [],
    documentIds: data.documentIds && data.documentIds.length > 0 ? data.documentIds : []
  };

  if (isDbConnected()) {
    try {
      await pool.query(
        `INSERT INTO applications (
          id, app_id, project_id, business_name, approval_id, approval_name,
          department, submission_date, sla_deadline_date, sla_days_remaining,
          status, risk_score, timeline, queries, document_ids
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          newApp.id,
          newApp.appId,
          newApp.projectId,
          newApp.businessName,
          newApp.approvalId,
          newApp.approvalName,
          newApp.department,
          newApp.submissionDate,
          newApp.slaDeadlineDate,
          newApp.slaDaysRemaining,
          newApp.status,
          newApp.riskScore,
          JSON.stringify(newApp.timeline),
          JSON.stringify(newApp.queries),
          JSON.stringify(newApp.documentIds)
        ]
      );
    } catch (e) {
      console.error('Error inserting application into DB:', e);
    }
  }

  memoryApplications.unshift(newApp);
  return newApp;
}

// ================= DOCUMENTS =================
export async function getDocuments(projectId?: string, userId?: string): Promise<DocumentItem[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM documents WHERE 1=1';
      const params: any[] = [];
      let pCount = 1;

      if (userId) {
        query += ` AND project_id IN (SELECT id FROM business_projects WHERE user_id = $${pCount++})`;
        params.push(userId);
      }
      if (projectId) {
        query += ` AND project_id = $${pCount++}`;
        params.push(projectId);
      }
      query += ' ORDER BY created_at DESC';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        projectId: r.project_id,
        docName: r.doc_name,
        category: r.category,
        fileUrl: r.file_url,
        fileSize: r.file_size,
        uploadDate: r.upload_date,
        status: r.status,
        expiryDate: r.expiry_date,
        aiValidationResult: r.ai_validation_result
      }));
    } catch (e) {
      console.error('Error fetching documents from DB:', e);
    }
  }

  if (projectId) return memoryDocuments.filter(d => d.projectId === projectId);
  return memoryDocuments;
}

export async function createDocument(data: Partial<DocumentItem>): Promise<DocumentItem> {
  const newDoc: DocumentItem = {
    id: data.id || `doc-${Date.now()}`,
    projectId: data.projectId || memoryProjects[0]?.id || 'proj-1',
    docName: data.docName || 'Document',
    category: data.category || 'General',
    fileUrl: data.fileUrl || '/mock_documents/sample.pdf',
    fileSize: data.fileSize || '1.2 MB',
    uploadDate: data.uploadDate || new Date().toISOString().split('T')[0],
    status: data.status || 'Valid',
    expiryDate: data.expiryDate,
    aiValidationResult: data.aiValidationResult || {
      confidence: 96,
      issues: [],
      recommendations: ['Document text verified cleanly.']
    }
  };

  if (isDbConnected()) {
    try {
      await pool.query(
        `INSERT INTO documents (
          id, project_id, doc_name, category, file_url, file_size, upload_date, status, expiry_date, ai_validation_result
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          doc_name = EXCLUDED.doc_name,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          ai_validation_result = EXCLUDED.ai_validation_result`,
        [
          newDoc.id, newDoc.projectId, newDoc.docName, newDoc.category,
          newDoc.fileUrl, newDoc.fileSize, newDoc.uploadDate, newDoc.status,
          newDoc.expiryDate || null, JSON.stringify(newDoc.aiValidationResult)
        ]
      );
    } catch (e) {
      console.error('Error inserting document into DB:', e);
    }
  }

  const existingIdx = memoryDocuments.findIndex(d => d.id === newDoc.id);
  if (existingIdx !== -1) {
    memoryDocuments[existingIdx] = newDoc;
  } else {
    memoryDocuments.unshift(newDoc);
  }
  return newDoc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (isDbConnected()) {
    try {
      await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    } catch (e) {
      console.error('Error deleting document from DB:', e);
    }
  }
  const idx = memoryDocuments.findIndex(d => d.id === id);
  if (idx !== -1) {
    memoryDocuments.splice(idx, 1);
  }
  return true;
}
export async function getNocApplications(filters?: { userId?: string; projectId?: string; status?: string; nocType?: string }): Promise<NocApplication[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM noc_applications WHERE 1=1';
      const params: any[] = [];
      let pCount = 1;

      if (filters?.userId) {
        query += ` AND project_id IN (SELECT id FROM business_projects WHERE user_id = $${pCount++})`;
        params.push(filters.userId);
      }
      if (filters?.projectId) {
        query += ` AND project_id = $${pCount++}`;
        params.push(filters.projectId);
      }
      if (filters?.status) {
        query += ` AND status = $${pCount++}`;
        params.push(filters.status);
      }
      if (filters?.nocType) {
        query += ` AND noc_type = $${pCount++}`;
        params.push(filters.nocType);
      }
      query += ' ORDER BY created_at DESC';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        projectId: r.project_id,
        businessName: r.business_name,
        nocType: r.noc_type,
        nocName: r.noc_name,
        department: r.department,
        appliedDate: r.applied_date,
        status: r.status,
        urgency: r.urgency,
        slaDaysLeft: r.sla_days_left,
        technicalParameters: r.technical_parameters || {},
        documents: r.documents || [],
        queries: r.queries || [],
        provisionalCertUrl: r.provisional_cert_url,
        finalCertUrl: r.final_cert_url,
        qrCodeData: r.qr_code_data,
        issuedDate: r.issued_date,
        certificateId: r.certificate_id
      }));
    } catch (e) {
      console.error('Error fetching NOC applications from DB:', e);
    }
  }

  let list = [...memoryNoc];
  if (filters?.projectId) list = list.filter(n => n.projectId === filters.projectId);
  if (filters?.status) list = list.filter(n => n.status === filters.status);
  if (filters?.nocType) list = list.filter(n => n.nocType === filters.nocType);
  return list;
}

// ================= JOINT INSPECTIONS =================
export async function getJointInspections(): Promise<JointInspection[]> {
  if (isDbConnected()) {
    try {
      const res = await pool.query('SELECT * FROM joint_inspections ORDER BY created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        nocApplicationId: r.noc_application_id,
        projectId: r.project_id,
        businessName: r.business_name,
        scheduledDate: r.scheduled_date,
        scheduledTime: r.scheduled_time,
        attendingDepartments: r.attending_departments || [],
        officerNames: r.officer_names || [],
        inspectionLocation: r.inspection_location,
        rubricChecklist: r.rubric_checklist || [],
        status: r.status,
        outcomeSummary: r.outcome_summary
      }));
    } catch (e) {
      console.error('Error fetching joint inspections from DB:', e);
    }
  }
  return memoryJointInsp;
}

// ================= AUDIT LOGS =================
export async function getAuditLogs(): Promise<AuditLogItem[]> {
  if (isDbConnected()) {
    try {
      const res = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
      return res.rows.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        user: r.user,
        role: r.role,
        action: r.action,
        applicationId: r.application_id,
        previousStatus: r.previous_status,
        newStatus: r.new_status,
        ipAddress: r.ip_address,
        details: r.details
      }));
    } catch (e) {
      console.error('Error fetching audit logs from DB:', e);
    }
  }
  return memoryAuditLogs;
}

// ================= COMPLIANCE TASKS =================
export async function getComplianceTasks(projectId?: string, userId?: string): Promise<ComplianceTask[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM compliance_tasks WHERE 1=1';
      const params: any[] = [];
      let pCount = 1;

      if (userId) {
        query += ` AND project_id IN (SELECT id FROM business_projects WHERE user_id = $${pCount++})`;
        params.push(userId);
      }
      if (projectId) {
        query += ` AND project_id = $${pCount++}`;
        params.push(projectId);
      }
      query += ' ORDER BY due_date ASC';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        projectId: r.project_id,
        title: r.title,
        department: r.department,
        statutoryAct: r.statutory_act,
        dueDate: r.due_date,
        daysLeft: r.days_left,
        status: r.status,
        renewalFee: r.renewal_fee,
        renewalPeriodMonths: r.renewal_period_months,
        actionRequired: r.action_required
      }));
    } catch (e) {
      console.error('Error fetching compliance tasks from DB:', e);
    }
  }
  if (projectId) return memoryCompliance.filter(c => c.projectId === projectId);
  return memoryCompliance;
}

// ================= INCENTIVES =================
export async function getIncentives(): Promise<IncentiveScheme[]> {
  if (isDbConnected()) {
    try {
      const res = await pool.query('SELECT * FROM incentive_schemes ORDER BY id ASC');
      return res.rows.map(r => ({
        id: r.id,
        schemeName: r.scheme_name,
        category: r.category,
        department: r.department,
        eligibleSectors: r.eligible_sectors || [],
        eligibleTalukaCategories: r.eligible_taluka_categories || [],
        minInvestmentCr: parseFloat(r.min_investment_cr) || 0,
        maxBenefit: r.max_benefit,
        description: r.description,
        applicationStatus: r.application_status,
        deadline: r.deadline,
        officialUrl: r.official_url,
        officialApplyUrl: r.official_apply_url,
        officialInfoUrl: r.official_info_url
      }));
    } catch (e) {
      console.error('Error fetching incentives from DB:', e);
    }
  }
  return memoryIncentives;
}

// ================= NOTIFICATIONS =================
export async function getNotifications(userId?: string): Promise<NotificationItem[]> {
  if (isDbConnected()) {
    try {
      let query = 'SELECT * FROM notifications';
      const params: any[] = [];
      if (userId) {
        query += ' WHERE user_id = $1';
        params.push(userId);
      }
      query += ' ORDER BY created_at DESC LIMIT 50';
      const res = await pool.query(query, params);
      return res.rows.map(r => ({
        id: r.id,
        title: r.title,
        message: r.message,
        timestamp: r.timestamp,
        type: r.type,
        read: r.is_read,
        link: r.link
      }));
    } catch (e) {
      console.error('Error fetching notifications from DB:', e);
    }
  }
  return memoryNotifications;
}

// ================= RULES =================
export async function getRules(): Promise<ApprovalRule[]> {
  if (isDbConnected()) {
    try {
      const res = await pool.query('SELECT * FROM approval_rules ORDER BY id ASC');
      return res.rows.map(r => ({
        id: r.id,
        sector: r.sector,
        scale: r.scale,
        locationZone: r.location_zone,
        requiredApprovals: r.required_approvals || [],
        conditionalApprovals: r.conditional_approvals || []
      }));
    } catch (e) {
      console.error('Error fetching rules from DB:', e);
    }
  }
  return memoryRules;
}
