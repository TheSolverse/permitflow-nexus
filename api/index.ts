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
  INITIAL_RULES 
} from '../src/data/mockData';
import { generateSmartChecklist } from '../src/utils/rulesEngine';
import { calculateRiskScore } from '../src/utils/riskCalculator';

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PermitFlow Nexus Vercel Serverless API', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email === email && u.role === role);
  res.json({ success: true, user: user || users[0] });
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/checklists/generate', (req, res) => {
  const project = req.body.project || projects[0];
  const checklist = generateSmartChecklist(project, applications);
  res.json({ checklist });
});

app.get('/api/applications', (req, res) => {
  res.json(applications);
});

app.get('/api/documents', (req, res) => {
  res.json(documents);
});

app.get('/api/inspections', (req, res) => {
  res.json(inspections);
});

app.get('/api/compliance', (req, res) => {
  res.json(complianceTasks);
});

app.get('/api/incentives', (req, res) => {
  res.json(incentiveSchemes);
});

app.get('/api/risk-score', (req, res) => {
  const score = calculateRiskScore(projects[0], documents, complianceTasks);
  res.json(score);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogs);
});

app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

app.get('/api/rules', (req, res) => {
  res.json(rules);
});

export default app;
