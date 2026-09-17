import { generateSmartChecklist } from '../server/utils/rulesEngine';
import { calculateRiskScore } from '../server/utils/riskCalculator';
import { analyzeDocumentOCR, preValidateApplicationBundle } from '../server/ai/ocrEngine';
import { queryRegulatoryRAG, explainOfficerQuery } from '../server/ai/regulatoryKnowledge';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function testAllFunctions() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE PERMITFLOW NEXUS TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function step(name: string, fn: () => Promise<any>) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      const res = await fn();
      console.log('✅ PASSED');
      passed++;
      return res;
    } catch (err: any) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Health & DB Status
  await step('Backend API Health Check', async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Expected status ok');
  });

  await step('Database Diagnostics Endpoint', async () => {
    const res = await fetch(`${API_BASE}/db/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.engine) throw new Error('Engine info missing');
  });

  // 2. Rules Engine & Smart Checklist
  let generatedChecklist: any = null;
  await step('Rules Engine - Smart Checklist Generation', async () => {
    const dummyProject: any = {
      id: 'proj-test-1',
      businessName: 'Apex Precision Engineering',
      sector: 'Automotive & Precision Engineering',
      scale: 'Medium',
      investmentAmount: '25 Crores',
      landZone: 'MIDC Industrial Area',
      district: 'Pune',
      state: 'Maharashtra',
      complianceScore: 85,
      riskLevel: 'LOW'
    };
    const checklist = generateSmartChecklist(dummyProject, []);
    if (!checklist || checklist.length === 0) throw new Error('Checklist empty');
    generatedChecklist = checklist;
  });

  // 3. Risk Calculator
  await step('Risk Score Calculator Engine', async () => {
    const dummyProject: any = {
      id: 'proj-test-1',
      sector: 'Chemical',
      scale: 'Large',
      landZone: 'Non-MIDC Zone',
      district: 'Raigad',
      midcArea: 'Tarapur MIDC'
    };
    const dummyDocs: any[] = [{ id: 'doc-1', status: 'Valid' }];
    const dummyTasks: any[] = [{ id: 'task-1', status: 'OVERDUE' }];
    const risk = calculateRiskScore(dummyProject, dummyDocs, dummyTasks);
    if (typeof risk.overallScore !== 'number' || !risk.riskLabel) throw new Error('Invalid risk score payload');
  });

  // 4. Project Creation & Retrieval
  let createdProjectId = '';
  await step('Projects API - Create Project', async () => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Apex Green Hydrogen Facility',
        sector: 'Renewable Energy & Cleantech',
        scale: 'Large',
        investmentAmount: '120 Crores',
        landZone: 'MIDC Industrial Area',
        district: 'Pune'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const proj = await res.json();
    createdProjectId = proj.id;
  });

  await step('Projects API - Get Projects', async () => {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) throw new Error('Empty projects list');
  });

  // 5. Applications Workflow
  let testAppId = '';
  let queryId = '';
  await step('Applications API - Submit New Application', async () => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: createdProjectId,
        businessName: 'Apex Green Hydrogen Facility',
        approvalName: 'Consent to Establish (CTE - Red Category)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        category: 'Pollution & Environment',
        feesPaid: 150000,
        documents: ['mpcb_cte_proposal.pdf', 'eia_report.pdf']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const app = await res.json();
    testAppId = app.id;
  });

  await step('Applications API - List Applications', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list) || !list.some((a: any) => a.id === testAppId)) throw new Error('Submitted application not found');
  });

  await step('Officer Workflow - Raise Query on Application', async () => {
    const res = await fetch(`${API_BASE}/applications/${testAppId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: 'S. Patil (MPCB)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        queryCategory: 'Effluent Treatment Specification',
        queryText: 'Please submit detailed Zero Liquid Discharge (ZLD) mass balance diagram.'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const q = await res.json();
    queryId = q.id;
  });

  await step('Entrepreneur Workflow - Respond to Query', async () => {
    const res = await fetch(`${API_BASE}/queries/${queryId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseText: 'Attached updated ZLD flow schematic and RO reject treatment plan.',
        responseDocName: 'zld_flow_schematic_rev2.pdf'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Response submission failed');
  });

  await step('Officer Workflow - Update Application Status (Approve)', async () => {
    const res = await fetch(`${API_BASE}/applications/${testAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'All environmental criteria, EIA and ZLD designs verified. Approved under Water & Air Acts.',
        officerName: 'S. Patil (SRO MPCB)'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    if (updated.status !== 'Approved') throw new Error('Status update mismatch');
  });

  // 6. NOC Workflow
  let testNocId = '';
  await step('NOC Applications - Submit NOC Application', async () => {
    const res = await fetch(`${API_BASE}/noc-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: createdProjectId,
        businessName: 'Apex Green Hydrogen Facility',
        nocType: 'FIRE',
        nocName: 'Fire Safety Clearance & Pre-Operational NOC',
        department: 'Maharashtra Fire & Rescue Services',
        technicalParameters: { builtUpAreaSqM: 12000, hazardousStorageTonnes: 50, fireHydrantPoints: 24 }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const noc = await res.json();
    testNocId = noc.id;
  });

  await step('Officer NOC - Issue Provisional NOC Certificate', async () => {
    const res = await fetch(`${API_BASE}/noc-applications/${testNocId}/issue-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certType: 'PROVISIONAL' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'PROVISIONAL_ISSUED') throw new Error('Provisional NOC status mismatch');
  });

  await step('Officer NOC - Issue Final NOC Certificate', async () => {
    const res = await fetch(`${API_BASE}/noc-applications/${testNocId}/issue-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certType: 'FINAL' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'FINAL_GRANTED') throw new Error('Final NOC status mismatch');
  });

  // 7. AI OCR & Document Engine
  await step('AI OCR Analyzer - Analyze Sample PAN & Aadhaar Files', async () => {
    const ocrRes = analyzeDocumentOCR('pan_card.jpg', 'PAN_CARD');
    if (!ocrRes || ocrRes.confidence < 50) throw new Error('OCR confidence too low or invalid');
  });

  await step('AI Document Bundle Pre-Validation', async () => {
    const sampleDocs: any[] = [
      { docName: 'pan_card.jpg', category: 'PAN_CARD', status: 'Valid' },
      { docName: 'aadhaar_card.jpg', category: 'AADHAAR_CARD', status: 'Valid' },
      { docName: 'electricity_bill.jpg', category: 'UTILITY_BILL', status: 'Valid' }
    ];
    const validation = preValidateApplicationBundle(sampleDocs, 'Consent to Establish');
    if (typeof validation.readyForSubmission !== 'boolean') throw new Error('Bundle validation invalid');
  });

  // 8. Joint Inspection Desk
  let testJointId = '';
  await step('Joint Inspections - Schedule Multi-Department Inspection', async () => {
    const res = await fetch(`${API_BASE}/joint-inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: createdProjectId,
        businessName: 'Apex Green Hydrogen Facility',
        scheduledDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        scheduledTime: '11:00 AM',
        attendingDepartments: ['MPCB', 'Fire Dept', 'DISH (Factory Inspectorate)'],
        officerNames: ['S. Patil (MPCB)', 'Chief Fire Officer K. Shinde', 'DISH Inspector V. Kadam'],
        inspectionLocation: 'Plot 88, Chakan MIDC Phase 2, Pune'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const joint = await res.json();
    testJointId = joint.id;
  });

  await step('Joint Inspections - List Inspections', async () => {
    const res = await fetch(`${API_BASE}/joint-inspections`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error('Invalid inspections response');
  });

  // 9. Compliance Locker
  await step('Compliance Locker - List Tasks & Renew Task', async () => {
    const res = await fetch(`${API_BASE}/compliance`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tasks = await res.json();
    if (tasks.length > 0) {
      const renewRes = await fetch(`${API_BASE}/compliance/${tasks[0].id}/renew`, { method: 'POST' });
      if (!renewRes.ok) throw new Error(`Renew failed: ${renewRes.status}`);
    }
  });

  // 10. Incentive Finder
  await step('Incentives Engine - List Subsidies & Schemes', async () => {
    const res = await fetch(`${API_BASE}/incentives`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const incentives = await res.json();
    if (!Array.isArray(incentives) || incentives.length === 0) throw new Error('No incentives returned');
  });

  // 11. AI Regulatory RAG & Query Helper
  await step('AI Regulatory RAG - Query Engine', async () => {
    const ragAnswer = queryRegulatoryRAG('What are the statutory requirements for MPCB Consent to Establish in MIDC area?');
    if (!ragAnswer || ragAnswer.length < 20) throw new Error('RAG query returned insufficient response');
  });

  await step('AI Regulatory Helper - Explain Officer Query', async () => {
    const explanation = explainOfficerQuery('Please submit effluent treatment plant ZLD mass balance diagram.', 'MPCB Consent');
    if (!explanation || !explanation.plainExplanation) throw new Error('Officer query explanation failed');
  });

  // 12. Audit Logs & System Activity
  await step('Audit Logs - Record & Fetch System Activity', async () => {
    const postRes = await fetch(`${API_BASE}/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'System Full-Spectrum Diagnostic Run',
        user: 'Automated Test Runner',
        role: 'ADMIN',
        details: 'Verified all 14 application modules successfully'
      })
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const getRes = await fetch(`${API_BASE}/audit-logs`);
    const logs = await getRes.json();
    if (!Array.isArray(logs) || logs.length === 0) throw new Error('Audit logs empty');
  });

  // 13. Notifications
  await step('Notifications - Read & Update Status', async () => {
    const getRes = await fetch(`${API_BASE}/notifications`);
    if (!getRes.ok) throw new Error(`HTTP ${getRes.status}`);
    const notifs = await getRes.json();
    if (notifs.length > 0) {
      const readRes = await fetch(`${API_BASE}/notifications/${notifs[0].id}/read`, { method: 'PUT' });
      if (!readRes.ok) throw new Error(`Mark read failed: ${readRes.status}`);
    }
  });

  // 14. Admin Rules Engine
  await step('Admin Portal - Create & Retrieve Approval Rules', async () => {
    const postRes = await fetch(`${API_BASE}/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sector: 'Biotechnology & Pharma',
        scale: 'Large',
        locationZone: 'MIDC Bio-Pharma Zone',
        requiredApprovals: ['FDA Manufacturing License', 'MPCB Red Consent', 'Fire NOC'],
        conditionalApprovals: ['Hazardous Waste Authorisation']
      })
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const getRes = await fetch(`${API_BASE}/rules`);
    const rules = await getRes.json();
    if (!Array.isArray(rules) || rules.length === 0) throw new Error('Rules list empty');
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testAllFunctions().catch(e => {
  console.error('Fatal error during test run:', e);
  process.exit(1);
});
