import express from 'express';
import cors from 'cors';
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
} from '../src/data/mockData';
import { generateSmartChecklist } from '../src/utils/rulesEngine';
import { calculateRiskScore } from '../src/utils/riskCalculator';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory mock database state
let users = [...INITIAL_USERS];
let projects = [...INITIAL_PROJECTS];
let applications = [...INITIAL_APPLICATIONS];
let documents = [...INITIAL_DOCUMENTS];
let inspections = [...INITIAL_INSPECTIONS];
let complianceTasks = [...INITIAL_COMPLIANCE_TASKS];
let incentiveSchemes = [...INITIAL_INCENTIVE_SCHEMES];
let auditLogs = [...INITIAL_AUDIT_LOGS];
let notifications = [...INITIAL_NOTIFICATIONS];
let rules = [...INITIAL_RULES];
let nocApplications = [...INITIAL_NOC_APPLICATIONS];
let jointInspections = [...INITIAL_JOINT_INSPECTIONS];

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PermitFlow Nexus Express API', timestamp: new Date().toISOString() });
});

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email === email && u.role === role);
  if (user) {
    res.json({ success: true, user });
  } else {
    // Demo fallback matching role
    const demoUser = users.find(u => u.role === role);
    res.json({ success: true, user: demoUser || users[0] });
  }
});

// PROJECTS
app.get('/api/projects', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    return res.json(projects.filter(p => p.userId === userId));
  }
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProj = {
    id: `proj-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    ...req.body
  };
  projects.unshift(newProj);

  // Add audit log
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: req.body.businessName || 'Entrepreneur',
    role: 'ENTREPRENEUR',
    action: 'Created Business Project',
    ipAddress: '127.0.0.1',
    details: `Registered ${newProj.businessName} in ${newProj.sector} sector at ${newProj.district}.`
  });

  res.status(201).json(newProj);
});

// CHECKLIST GENERATION
app.post('/api/checklists/generate', (req, res) => {
  const project = req.body.project || projects[0];
  const checklist = generateSmartChecklist(project, applications);
  res.json({ checklist });
});

// APPLICATIONS
app.get('/api/applications', (req, res) => {
  const { projectId, status, department } = req.query;
  let filtered = [...applications];
  if (projectId) filtered = filtered.filter(a => a.projectId === projectId);
  if (status) filtered = filtered.filter(a => a.status === status);
  if (department) filtered = filtered.filter(a => a.department.toLowerCase().includes((department as string).toLowerCase()));
  res.json(filtered);
});

app.post('/api/applications', (req, res) => {
  const { projectId, approvalId, approvalName, department, businessName } = req.body;
  const newApp = {
    id: `app-${Date.now()}`,
    appId: `PFN-2026-${department.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    projectId: projectId || projects[0].id,
    businessName: businessName || projects[0].businessName,
    approvalId,
    approvalName,
    department,
    submissionDate: new Date().toISOString().split('T')[0],
    slaDeadlineDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    slaDaysRemaining: 15,
    status: 'Submitted' as const,
    riskScore: Math.floor(20 + Math.random() * 30),
    timeline: [
      {
        id: `t-${Date.now()}`,
        title: 'Application Submitted',
        description: 'Application submitted successfully to department portal.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: businessName || 'Entrepreneur',
        role: 'ENTREPRENEUR' as const
      }
    ],
    queries: [],
    documentIds: documents.slice(0, 3).map(d => d.id)
  };
  applications.unshift(newApp);

  // Audit log
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: businessName || 'Entrepreneur',
    role: 'ENTREPRENEUR',
    action: 'Submitted Application',
    applicationId: newApp.appId,
    previousStatus: 'Not Started',
    newStatus: 'Submitted',
    ipAddress: '127.0.0.1',
    details: `Submitted ${approvalName} to ${department}.`
  });

  res.status(201).json(newApp);
});

app.put('/api/applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, remarks, officerName } = req.body;
  const appIndex = applications.findIndex(a => a.id === id);
  if (appIndex !== -1) {
    const prevStatus = applications[appIndex].status;
    applications[appIndex].status = status;
    if (remarks) applications[appIndex].remarks = remarks;
    if (officerName) applications[appIndex].officerAssigned = officerName;

    applications[appIndex].timeline.push({
      id: `t-${Date.now()}`,
      title: `Status updated to ${status}`,
      description: remarks || `Officer updated status to ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: officerName || 'Government Officer',
      role: 'OFFICER'
    });

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: officerName || 'Officer',
      role: 'OFFICER',
      action: 'Updated Application Status',
      applicationId: applications[appIndex].appId,
      previousStatus: prevStatus,
      newStatus: status,
      ipAddress: '127.0.0.1',
      details: remarks || `Changed status from ${prevStatus} to ${status}.`
    });

    return res.json(applications[appIndex]);
  }
  res.status(404).json({ error: 'Application not found' });
});

// QUERIES
app.post('/api/applications/:id/query', (req, res) => {
  const { id } = req.params;
  const { officerName, department, queryCategory, queryText, dueDate } = req.body;
  const targetApp = applications.find(a => a.id === id);
  if (targetApp) {
    const newQuery = {
      id: `q-${Date.now()}`,
      applicationId: id,
      officerName: officerName || 'Department Officer',
      department: department || targetApp.department,
      queryCategory: queryCategory || 'Document Clarification',
      queryText,
      raisedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'OPEN' as const
    };
    targetApp.queries.push(newQuery);
    targetApp.status = 'Query Raised';

    res.status(201).json(newQuery);
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

app.post('/api/queries/:queryId/respond', (req, res) => {
  const { queryId } = req.params;
  const { responseText, responseDocName } = req.body;
  
  for (const appItem of applications) {
    const qIndex = appItem.queries.findIndex(q => q.id === queryId);
    if (qIndex !== -1) {
      appItem.queries[qIndex].status = 'RESPONDED';
      appItem.queries[qIndex].responseText = responseText;
      appItem.queries[qIndex].responseDocName = responseDocName;
      appItem.queries[qIndex].responseDate = new Date().toISOString().split('T')[0];

      appItem.status = 'Under Review';
      appItem.timeline.push({
        id: `t-${Date.now()}`,
        title: 'Query Response Submitted',
        description: `Entrepreneur responded to query: "${responseText.substring(0, 40)}..."`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actor: appItem.businessName,
        role: 'ENTREPRENEUR'
      });

      return res.json(appItem.queries[qIndex]);
    }
  }
  res.status(404).json({ error: 'Query not found' });
});

// DOCUMENTS
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

app.post('/api/documents', (req, res) => {
  const { projectId, docName, category, fileUrl, fileSize } = req.body;
  const newDoc: DocumentItem = {
    id: `doc-${Date.now()}`,
    projectId: projectId || projects[0].id,
    docName: docName || 'Uploaded Document',
    category: category || 'General Proof',
    fileUrl: fileUrl || '/mock_documents/uploaded_doc.pdf',
    fileSize: fileSize || '1.5 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'Valid',
    aiValidationResult: {
      confidence: 95,
      issues: [],
      recommendations: ['AI OCR verified text content and seal stamp correctly.']
    }
  };
  documents.unshift(newDoc);
  res.status(201).json(newDoc);
});

// INSPECTIONS
app.get('/api/inspections', (req, res) => {
  res.json(inspections);
});

app.post('/api/inspections', (req, res) => {
  const newInsp: InspectionItem = {
    id: `insp-${Date.now()}`,
    ...req.body
  };
  inspections.unshift(newInsp);
  res.status(201).json(newInsp);
});

// COMPLIANCE
app.get('/api/compliance', (req, res) => {
  res.json(complianceTasks);
});

// INCENTIVES
app.get('/api/incentives', (req, res) => {
  res.json(incentiveSchemes);
});

// RISK SCORE
app.get('/api/risk-score', (req, res) => {
  const project = projects[0];
  const score = calculateRiskScore(project, documents, complianceTasks);
  res.json(score);
});

// AUDIT LOGS
app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

// NOTIFICATIONS
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// RULES ENGINE
app.get('/api/rules', (req, res) => {
  res.json(rules);
});

/*
 * PostgreSQL / Supabase Database Schema Definitions:
 *
 * CREATE TABLE noc_applications (
 *   id VARCHAR(64) PRIMARY KEY,
 *   project_id VARCHAR(64) REFERENCES business_projects(id),
 *   business_name VARCHAR(255) NOT NULL,
 *   noc_type VARCHAR(64) NOT NULL,
 *   noc_name VARCHAR(255) NOT NULL,
 *   department VARCHAR(255) NOT NULL,
 *   applied_date DATE NOT NULL,
 *   status VARCHAR(64) NOT NULL,
 *   urgency VARCHAR(32) DEFAULT 'NORMAL',
 *   sla_days_left INT DEFAULT 15,
 *   technical_parameters JSONB NOT NULL,
 *   documents JSONB DEFAULT '[]'::jsonb,
 *   queries JSONB DEFAULT '[]'::jsonb,
 *   provisional_cert_url VARCHAR(512),
 *   final_cert_url VARCHAR(512),
 *   qr_code_data TEXT,
 *   issued_date DATE,
 *   certificate_id VARCHAR(128)
 * );
 *
 * CREATE TABLE joint_inspections (
 *   id VARCHAR(64) PRIMARY KEY,
 *   noc_application_id VARCHAR(64) REFERENCES noc_applications(id),
 *   project_id VARCHAR(64) REFERENCES business_projects(id),
 *   business_name VARCHAR(255) NOT NULL,
 *   scheduled_date DATE NOT NULL,
 *   scheduled_time VARCHAR(32) NOT NULL,
 *   attending_departments JSONB NOT NULL,
 *   officer_names JSONB NOT NULL,
 *   inspection_location VARCHAR(512) NOT NULL,
 *   rubric_checklist JSONB NOT NULL,
 *   status VARCHAR(32) DEFAULT 'SCHEDULED',
 *   outcome_summary TEXT
 * );
 */

// NOC APPLICATIONS
app.get('/api/noc-applications', (req, res) => {
  const { projectId, status, nocType } = req.query;
  let filtered = [...nocApplications];
  if (projectId) filtered = filtered.filter(n => n.projectId === projectId);
  if (status) filtered = filtered.filter(n => n.status === status);
  if (nocType) filtered = filtered.filter(n => n.nocType === nocType);
  res.json(filtered);
});

app.post('/api/noc-applications', (req, res) => {
  const newNoc = {
    id: `noc-app-${Date.now()}`,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'SUBMITTED',
    queries: [],
    ...req.body
  };
  nocApplications.unshift(newNoc);
  res.status(201).json(newNoc);
});

app.post('/api/noc-applications/:id/query', (req, res) => {
  const { id } = req.params;
  const { question, raisedBy } = req.body;
  const noc = nocApplications.find(n => n.id === id);
  if (!noc) return res.status(404).json({ error: 'NOC Application not found' });
  
  const queryItem = {
    id: `q-noc-${Date.now()}`,
    raisedBy: raisedBy || 'Government Officer',
    date: new Date().toISOString().split('T')[0],
    question,
    status: 'OPEN'
  };
  noc.queries = noc.queries || [];
  noc.queries.push(queryItem as any);
  noc.status = 'QUERY_RAISED';
  res.json(noc);
});

app.post('/api/noc-applications/:id/issue-certificate', (req, res) => {
  const { id } = req.params;
  const { certType } = req.body; // 'PROVISIONAL' | 'FINAL'
  const noc = nocApplications.find(n => n.id === id);
  if (!noc) return res.status(404).json({ error: 'NOC Application not found' });

  const certId = `PFN-NOC-${certType.substring(0, 4)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  noc.status = certType === 'PROVISIONAL' ? 'PROVISIONAL_ISSUED' : 'FINAL_GRANTED';
  noc.certificateId = certId;
  noc.issuedDate = new Date().toISOString().split('T')[0];
  noc.qrCodeData = `PFN-VERIFIED-NOC-${certType}-${noc.id}-${certId}`;
  noc.provisionalCertUrl = certType === 'PROVISIONAL' ? `https://permitflownexus.gov.in/certs/${certId}.pdf` : noc.provisionalCertUrl;
  noc.finalCertUrl = certType === 'FINAL' ? `https://permitflownexus.gov.in/certs/${certId}.pdf` : noc.finalCertUrl;

  res.json(noc);
});

// JOINT INSPECTIONS
app.get('/api/joint-inspections', (req, res) => {
  res.json(jointInspections);
});

app.post('/api/joint-inspections', (req, res) => {
  const newJoint = {
    id: `joint-insp-${Date.now()}`,
    status: 'SCHEDULED',
    ...req.body
  };
  jointInspections.unshift(newJoint);

  if (newJoint.nocApplicationId) {
    const noc = nocApplications.find(n => n.id === newJoint.nocApplicationId);
    if (noc) noc.status = 'INSPECTION_SCHEDULED';
  }

  res.status(201).json(newJoint);
});

app.listen(PORT, () => {
  console.log(`PermitFlow Nexus Express Backend running on http://localhost:${PORT}`);
});
