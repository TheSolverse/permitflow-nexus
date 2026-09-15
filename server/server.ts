import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { pool, checkDbConnection, isDbConnected } from './db/pool';
import { supabase } from './db/supabase';
import { initDatabase } from './db/init';
import {
  getUsers,
  findUserByEmailAndRole,
  deleteUser,
  getProjects,
  createProject,
  getApplications,
  createApplication,
  getDocuments,
  createDocument,
  deleteDocument,
  getNocApplications,
  getJointInspections,
  getAuditLogs,
  getComplianceTasks,
  getIncentives,
  getNotifications,
  getRules
} from './db/queries';
import { generateSmartChecklist } from './utils/rulesEngine';
import { calculateRiskScore } from './utils/riskCalculator';
import { analyzeDocumentOCR, preValidateApplicationBundle } from './ai/ocrEngine';
import { queryRegulatoryRAG, explainOfficerQuery } from './ai/regulatoryKnowledge';

// Load Environment Configuration
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ================= ROOT & HEALTHCHECK =================
app.get('/', (req, res) => {
  res.redirect('http://localhost:5173');
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PermitFlow Nexus Express API',
    database: isDbConnected() ? 'PostgreSQL Connected' : 'In-Memory DB Store (Schema Ready)',
    timestamp: new Date().toISOString()
  });
});

// Database Diagnostics / Status Endpoint
app.get('/api/db/status', async (req, res) => {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const tableCountRes = await pool.query(`
        SELECT count(*) FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      res.json({
        status: 'connected',
        engine: 'PostgreSQL',
        connectionString: process.env.DATABASE_URL ? '[Configured]' : 'localhost:5432/permitflow_nexus',
        tablesCount: parseInt(tableCountRes.rows[0].count, 10),
        message: 'PostgreSQL connection active with production DDL schema.'
      });
    } catch (e: any) {
      res.json({ status: 'connected', engine: 'PostgreSQL', error: e.message });
    }
  } else {
    res.json({
      status: 'fallback',
      engine: 'In-Memory (PostgreSQL Schema Compatible)',
      message: 'PostgreSQL host is offline or not configured. Full data API is running via simulated in-memory store.'
    });
  }
});

// ================= AUTH =================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role, department, designation, district, permissions } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    // 1. Call supabase.auth.signUp FIRST
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          name: name || 'New User',
          role: role || 'ENTREPRENEUR'
        }
      }
    });

    if (authErr || !authData?.user) {
      return res.status(400).json({ error: authErr?.message || 'Supabase Auth registration failed' });
    }

    const authUser = authData.user;

    // 2. Insert into public.users ONLY after successful Auth
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password_hash: null, // Do NOT manually store passwords
        role: role || 'ENTREPRENEUR',
        department: department || null,
        designation: designation || null,
        district: district || 'Pune',
        permissions: permissions || []
      }, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (dbError) {
      return res.status(500).json({ error: `User created in Auth, but DB profile failed: ${dbError.message}` });
    }

    res.status(201).json({ success: true, user: dbUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    // 1. Authenticate with Supabase Auth (signInWithPassword)
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });

    if (authErr || !authData?.user) {
      return res.status(401).json({ error: authErr?.message || 'Invalid login credentials' });
    }

    // 2. Load corresponding user profile from public.users table
    const { data: userProfile, error: profileErr } = await supabase
      .from('users')
      .select('*')
      .or(`id.eq.${authData.user.id},email.ilike.${cleanEmail}`)
      .maybeSingle();

    if (!userProfile) {
      return res.status(404).json({ error: 'User authenticated, but profile record not found in database.' });
    }

    if (role && userProfile.role !== role) {
      return res.status(403).json({ error: `Account is registered as ${userProfile.role}, not ${role}.` });
    }

    res.json({ success: true, user: userProfile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const usersList = await getUsers();
    res.json(usersList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ success: true, message: 'Account and associated data deleted from database successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PROJECTS =================
app.get('/api/projects', async (req, res) => {
  try {
    const { userId } = req.query;
    const projectList = await getProjects(userId as string);
    res.json(projectList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProject = await createProject(req.body);
    res.status(201).json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CHECKLIST GENERATION =================
app.post('/api/checklists/generate', async (req, res) => {
  try {
    const projectsList = await getProjects();
    const applicationsList = await getApplications();
    const project = req.body.project || projectsList[0];
    const checklist = generateSmartChecklist(project, applicationsList);
    res.json({ checklist });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= APPLICATIONS =================
app.get('/api/applications', async (req, res) => {
  try {
    const { userId, projectId, status, department } = req.query;
    const list = await getApplications({
      userId: userId as string,
      projectId: projectId as string,
      status: status as string,
      department: department as string
    });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const newApp = await createApplication(req.body);
    res.status(201).json(newApp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Application Status
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, officerName } = req.body;
    const apps = await getApplications();
    const targetApp = apps.find(a => a.id === id);
    if (!targetApp) {
      return res.status(404).json({ error: 'Application not found' });
    }

    targetApp.status = status;
    if (remarks) targetApp.remarks = remarks;
    if (officerName) targetApp.officerAssigned = officerName;

    targetApp.timeline.push({
      id: `t-${Date.now()}`,
      title: `Status updated to ${status}`,
      description: remarks || `Officer updated status to ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: officerName || 'Government Officer',
      role: 'OFFICER'
    });

    if (isDbConnected()) {
      await pool.query(
        'UPDATE applications SET status = $1, remarks = $2, officer_assigned = $3, timeline = $4, updated_at = NOW() WHERE id = $5',
        [status, targetApp.remarks || null, targetApp.officerAssigned || null, JSON.stringify(targetApp.timeline), id]
      );
    }

    res.json(targetApp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= QUERIES =================
app.post('/api/applications/:id/query', async (req, res) => {
  try {
    const { id } = req.params;
    const { officerName, department, queryCategory, queryText, dueDate } = req.body;
    const apps = await getApplications();
    const targetApp = apps.find(a => a.id === id);
    if (!targetApp) {
      return res.status(404).json({ error: 'Application not found' });
    }

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

    if (isDbConnected()) {
      await pool.query(
        'UPDATE applications SET status = $1, queries = $2, updated_at = NOW() WHERE id = $3',
        ['Query Raised', JSON.stringify(targetApp.queries), id]
      );
    }

    res.status(201).json(newQuery);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Respond to Application Query
app.post('/api/queries/:queryId/respond', async (req, res) => {
  try {
    const { queryId } = req.params;
    const { responseText, responseDocName } = req.body;
    const apps = await getApplications();
    let foundApp: Application | null = null;
    let foundQuery: any = null;

    for (const a of apps) {
      const q = (a.queries || []).find((query: any) => query.id === queryId);
      if (q) {
        foundApp = a;
        foundQuery = q;
        break;
      }
    }

    if (!foundApp || !foundQuery) {
      return res.status(404).json({ error: 'Query not found' });
    }

    foundQuery.status = 'RESPONDED';
    foundQuery.responseText = responseText;
    foundQuery.responseDocName = responseDocName;
    foundQuery.responseDate = new Date().toISOString().split('T')[0];

    foundApp.status = 'Under Review';
    foundApp.timeline.push({
      id: `t-${Date.now()}`,
      title: 'Query Response Submitted',
      description: `Applicant responded: "${(responseText || '').substring(0, 60)}..."`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actor: foundApp.businessName || 'Entrepreneur',
      role: 'ENTREPRENEUR'
    });

    if (isDbConnected()) {
      await pool.query(
        'UPDATE applications SET status = $1, queries = $2, timeline = $3, updated_at = NOW() WHERE id = $4',
        ['Under Review', JSON.stringify(foundApp.queries), JSON.stringify(foundApp.timeline), foundApp.id]
      );
    }

    res.json({ success: true, application: foundApp, query: foundQuery });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DOCUMENTS =================
app.get('/api/documents', async (req, res) => {
  try {
    const { projectId, userId } = req.query;
    const docs = await getDocuments(projectId as string, userId as string);
    res.json(docs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { id, projectId, docName, category, fileUrl, fileSize, status, aiValidationResult } = req.body;
    const newDoc = await createDocument({
      id,
      projectId,
      docName,
      category,
      fileUrl,
      fileSize,
      status,
      aiValidationResult
    });

    res.status(201).json(newDoc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= INSPECTIONS =================
app.get('/api/inspections', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbRes = await pool.query('SELECT * FROM inspections ORDER BY scheduled_date ASC');
      return res.json(dbRes.rows);
    }
    const projectsList = await getProjects();
    const defaultInsp: InspectionItem[] = [
      {
        id: 'insp-1',
        projectId: projectsList[0]?.id || 'proj-1',
        businessName: projectsList[0]?.businessName || 'Apex Agro Processing Hub',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        inspectionType: 'Pre-Commissioning Site Consent Audit',
        scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        scheduledTime: '11:00 AM',
        officerName: 'S. Patil (Sub-Regional Officer)',
        officerContact: '+91 98230 11223',
        status: 'SCHEDULED',
        rubricChecklist: [
          { item: 'Effluent Treatment Plant (ETP) capacity check', checked: true },
          { item: 'Stack height & emission monitoring port', checked: true },
          { item: 'Hazardous waste containment area flooring', checked: false }
        ]
      }
    ];
    res.json(defaultInsp);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= COMPLIANCE =================
app.get('/api/compliance', async (req, res) => {
  try {
    const { projectId, userId } = req.query;
    const tasks = await getComplianceTasks(projectId as string, userId as string);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= INCENTIVES =================
app.get('/api/incentives', async (req, res) => {
  try {
    const incentives = await getIncentives();
    res.json(incentives);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= RISK SCORE =================
app.get('/api/risk-score', async (req, res) => {
  try {
    const projectsList = await getProjects();
    const docs = await getDocuments();
    const compliance = await getComplianceTasks();
    const project = projectsList[0];
    const score = calculateRiskScore(project, docs, compliance);
    res.json(score);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AUDIT LOGS =================
app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await getAuditLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NOTIFICATIONS =================
app.get('/api/notifications', async (req, res) => {
  try {
    const notifs = await getNotifications();
    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= RULES ENGINE =================
app.get('/api/rules', async (req, res) => {
  try {
    const rulesList = await getRules();
    res.json(rulesList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NOC APPLICATIONS =================
app.get('/api/noc-applications', async (req, res) => {
  try {
    const { userId, projectId, status, nocType } = req.query;
    const nocs = await getNocApplications({
      userId: userId as string,
      projectId: projectId as string,
      status: status as string,
      nocType: nocType as string
    });
    res.json(nocs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/noc-applications', async (req, res) => {
  try {
    const projectsList = await getProjects();
    const newNoc = {
      id: `noc-app-${Date.now()}`,
      projectId: req.body.projectId || projectsList[0]?.id || 'proj-1',
      businessName: req.body.businessName || projectsList[0]?.businessName || 'Business Project',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      urgency: req.body.urgency || 'NORMAL',
      slaDaysLeft: 15,
      technicalParameters: req.body.technicalParameters || {},
      documents: req.body.documents || [],
      queries: [],
      ...req.body
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO noc_applications (
          id, project_id, business_name, noc_type, noc_name, department, 
          applied_date, status, urgency, sla_days_left, technical_parameters, documents, queries
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newNoc.id, newNoc.projectId, newNoc.businessName, newNoc.nocType, newNoc.nocName,
          newNoc.department, newNoc.appliedDate, newNoc.status, newNoc.urgency, newNoc.slaDaysLeft,
          JSON.stringify(newNoc.technicalParameters), JSON.stringify(newNoc.documents), JSON.stringify(newNoc.queries)
        ]
      );
    }

    res.status(201).json(newNoc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/noc-applications/:id/query', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, raisedBy } = req.body;
    const nocs = await getNocApplications();
    const noc = nocs.find(n => n.id === id);
    if (!noc) return res.status(404).json({ error: 'NOC Application not found' });

    const newQuery = {
      id: `q-noc-${Date.now()}`,
      raisedBy: raisedBy || 'Government Officer',
      date: new Date().toISOString().split('T')[0],
      question,
      status: 'OPEN'
    };
    noc.queries = noc.queries || [];
    noc.queries.push(newQuery as any);
    noc.status = 'QUERY_RAISED';

    if (isDbConnected()) {
      await pool.query(
        'UPDATE noc_applications SET status = $1, queries = $2 WHERE id = $3',
        ['QUERY_RAISED', JSON.stringify(noc.queries), id]
      );
    }

    res.json(noc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/noc-applications/:id/query-response', async (req, res) => {
  try {
    const { id } = req.params;
    const { queryId, responseText, responseDocName } = req.body;
    const nocs = await getNocApplications();
    const noc = nocs.find(n => n.id === id);
    if (!noc) return res.status(404).json({ error: 'NOC Application not found' });

    noc.queries = (noc.queries || []).map((q: any) => {
      if (q.id === queryId) {
        return { ...q, response: responseText, responseDocName, status: 'RESOLVED' };
      }
      return q;
    });
    noc.status = 'UNDER_REVIEW';

    if (isDbConnected()) {
      await pool.query(
        'UPDATE noc_applications SET status = $1, queries = $2 WHERE id = $3',
        ['UNDER_REVIEW', JSON.stringify(noc.queries), id]
      );
    }

    res.json(noc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/noc-applications/:id/issue-certificate', async (req, res) => {
  try {
    const { id } = req.params;
    const { certType } = req.body; // 'PROVISIONAL' | 'FINAL'
    const nocs = await getNocApplications();
    const noc = nocs.find(n => n.id === id);
    if (!noc) return res.status(404).json({ error: 'NOC Application not found' });

    const certId = `PFN-NOC-${certType.substring(0, 4)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStatus = certType === 'PROVISIONAL' ? 'PROVISIONAL_ISSUED' : 'FINAL_GRANTED';
    const issuedDate = new Date().toISOString().split('T')[0];
    const qrCode = `PFN-VERIFIED-NOC-${certType}-${noc.id}-${certId}`;
    const certUrl = `https://permitflownexus.gov.in/certs/${certId}.pdf`;

    noc.status = newStatus;
    noc.certificateId = certId;
    noc.issuedDate = issuedDate;
    noc.qrCodeData = qrCode;
    if (certType === 'PROVISIONAL') noc.provisionalCertUrl = certUrl;
    else noc.finalCertUrl = certUrl;

    if (isDbConnected()) {
      await pool.query(
        `UPDATE noc_applications 
         SET status = $1, certificate_id = $2, issued_date = $3, qr_code_data = $4,
             provisional_cert_url = COALESCE($5, provisional_cert_url),
             final_cert_url = COALESCE($6, final_cert_url)
         WHERE id = $7`,
        [newStatus, certId, issuedDate, qrCode, certType === 'PROVISIONAL' ? certUrl : null, certType === 'FINAL' ? certUrl : null, id]
      );
    }

    res.json(noc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Compliance Renewal
app.post('/api/compliance/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await getComplianceTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Compliance task not found' });

    task.status = 'VALID';
    task.daysLeft = 365;
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    task.dueDate = nextYear.toISOString().split('T')[0];

    if (isDbConnected()) {
      await pool.query(
        'UPDATE compliance_tasks SET status = $1, days_left = $2, due_date = $3 WHERE id = $4',
        ['VALID', 365, task.dueDate, id]
      );
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Notification Read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Log Post
app.post('/api/audit-logs', async (req, res) => {
  try {
    const newLog = {
      id: req.body.id || `log-${Date.now()}`,
      timestamp: req.body.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: req.body.user || 'System',
      role: req.body.role || 'ENTREPRENEUR',
      action: req.body.action || 'Activity',
      applicationId: req.body.applicationId || null,
      previousStatus: req.body.previousStatus || null,
      newStatus: req.body.newStatus || null,
      ipAddress: req.body.ipAddress || '127.0.0.1',
      details: req.body.details || null
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO audit_logs (id, timestamp, "user", role, action, application_id, previous_status, new_status, ip_address, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [newLog.id, newLog.timestamp, newLog.user, newLog.role, newLog.action, newLog.applicationId, newLog.previousStatus, newLog.newStatus, newLog.ipAddress, newLog.details]
      );
    }

    res.status(201).json(newLog);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Rule Post (Admin)
app.post('/api/rules', async (req, res) => {
  try {
    const newRule = {
      id: req.body.id || `rule-${Date.now()}`,
      sector: req.body.sector,
      scale: req.body.scale,
      locationZone: req.body.locationZone,
      requiredApprovals: req.body.requiredApprovals || [],
      conditionalApprovals: req.body.conditionalApprovals || []
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO approval_rules (id, sector, scale, location_zone, required_approvals, conditional_approvals)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newRule.id, newRule.sector, newRule.scale, newRule.locationZone, JSON.stringify(newRule.requiredApprovals), JSON.stringify(newRule.conditionalApprovals)]
      );
    }

    res.status(201).json(newRule);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= JOINT INSPECTIONS =================
app.get('/api/joint-inspections', async (req, res) => {
  try {
    const joints = await getJointInspections();
    res.json(joints);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/joint-inspections', async (req, res) => {
  try {
    const projectsList = await getProjects();
    const newJoint = {
      id: `joint-insp-${Date.now()}`,
      status: 'SCHEDULED',
      projectId: req.body.projectId || projectsList[0]?.id || 'proj-1',
      businessName: req.body.businessName || projectsList[0]?.businessName || 'Business Project',
      scheduledDate: req.body.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: req.body.scheduledTime || '10:30 AM',
      attendingDepartments: req.body.attendingDepartments || [],
      officerNames: req.body.officerNames || [],
      inspectionLocation: req.body.inspectionLocation || 'Plot No. 42, MIDC Chakan',
      rubricChecklist: req.body.rubricChecklist || [],
      ...req.body
    };

    if (isDbConnected()) {
      await pool.query(
        `INSERT INTO joint_inspections (
          id, noc_application_id, project_id, business_name, scheduled_date, 
          scheduled_time, attending_departments, officer_names, inspection_location, 
          rubric_checklist, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          newJoint.id, newJoint.nocApplicationId || null, newJoint.projectId, newJoint.businessName,
          newJoint.scheduledDate, newJoint.scheduledTime, JSON.stringify(newJoint.attendingDepartments),
          JSON.stringify(newJoint.officerNames), newJoint.inspectionLocation,
          JSON.stringify(newJoint.rubricChecklist), newJoint.status
        ]
      );
    }

    res.status(201).json(newJoint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AI OCR & RAG STATUTORY REGULATORY ENDPOINTS =================
app.post('/api/ai/ocr-analyze', async (req, res) => {
  try {
    const { docName, category, fileUrl, projectProfile, requiredChecklist } = req.body;
    if (!docName) {
      return res.status(400).json({ error: 'docName is required for OCR analysis' });
    }

    const result = analyzeDocumentOCR(docName, category || 'General', fileUrl, projectProfile, requiredChecklist);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/pre-validate-checklist', async (req, res) => {
  try {
    const { approvalName, requiredDocs, uploadedDocs, businessName } = req.body;
    if (!approvalName || !requiredDocs) {
      return res.status(400).json({ error: 'approvalName and requiredDocs are required' });
    }

    const validation = preValidateApplicationBundle(
      approvalName,
      requiredDocs || [],
      uploadedDocs || [],
      businessName || 'My Business'
    );
    res.json(validation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/rag-query', async (req, res) => {
  try {
    const { query, projectContext, language } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const ragResult = queryRegulatoryRAG(query, projectContext, language || 'en');
    res.json(ragResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/explain-query', async (req, res) => {
  try {
    const { queryText, approvalName } = req.body;
    if (!queryText) {
      return res.status(400).json({ error: 'queryText is required' });
    }

    const explanation = explainOfficerQuery(queryText, approvalName || 'Application');
    res.json(explanation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Boot and Server Initialization
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`[Express] PermitFlow Nexus Backend server running on http://localhost:${PORT}`);
    // Attempt PostgreSQL initialization on boot
    await initDatabase();
  });
}

export default app;
