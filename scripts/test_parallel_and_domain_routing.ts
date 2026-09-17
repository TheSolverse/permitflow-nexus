import { 
  INITIAL_PARALLEL_PERMISSIONS, 
  INITIAL_USERS, 
  INITIAL_PROJECTS 
} from '../server/data/mockData';
import { ParallelPermissionItem, Application } from '../server/types';

const API_BASE = 'http://localhost:5000/api';

async function testParallelAndDomainRouting() {
  console.log('================================================================');
  console.log('⚡ TESTING PARALLEL WORKFLOW & DOMAIN OFFICER ROUTING');
  console.log('   Enterprise: Sahyadri Bio-Chemicals & Clean Energy Ltd');
  console.log('   Location: Plot B-12, MIDC Tarapur, District Palghar');
  console.log('================================================================\n');

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

  // 1. Create Entrepreneur Project
  let projectId = '';
  await step('1. Register Entrepreneur Project', async () => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        sector: 'Chemical',
        scale: 'Large',
        investmentRange: '₹25Cr - ₹50Cr',
        estimatedInvestmentCr: 45,
        proposedEmployees: 180,
        landStatus: 'MIDC Allotted',
        midcArea: 'Tarapur MIDC',
        district: 'Palghar',
        powerRequirementKW: 800,
        waterRequirementLPD: 18000,
        hazardousMaterials: true
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const proj = await res.json();
    projectId = proj.id;
  });

  // 2. Submit Multi-Department Applications in Parallel
  let mpcbAppId = '';
  let fireAppId = '';
  let dishAppId = '';
  let midcAppId = '';
  let msedclAppId = '';

  await step('2. Submit Parallel Statutory Clearances across 5 Departments', async () => {
    // 2a. MPCB Consent Application
    const mpcbRes = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        approvalName: 'Consent to Establish (CTE - Red Category)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        category: 'Pollution & Environment',
        feesPaid: 120000
      })
    });
    const mpcbApp = await mpcbRes.json();
    mpcbAppId = mpcbApp.id;

    // 2b. Fire Safety NOC Application
    const fireRes = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        approvalName: 'Provisional Fire Safety NOC',
        department: 'Directorate of Maharashtra Fire Services',
        category: 'Fire & Safety',
        feesPaid: 45000
      })
    });
    const fireApp = await fireRes.json();
    fireAppId = fireApp.id;

    // 2c. DISH Factory Plan Approval
    const dishRes = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        approvalName: 'Factory Building Plan Approval & Licence (Form 1)',
        department: 'Directorate of Industrial Safety & Health (DISH)',
        category: 'Labour & Safety',
        feesPaid: 35000
      })
    });
    const dishApp = await dishRes.json();
    dishAppId = dishApp.id;

    // 2d. MIDC Building Sanction
    const midcRes = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        approvalName: 'MIDC Building Plan Sanction & Development Permission',
        department: 'MIDC Special Planning Authority (SPA)',
        category: 'Infrastructure & Planning',
        feesPaid: 65000
      })
    });
    const midcApp = await midcRes.json();
    midcAppId = midcApp.id;

    // 2e. MSEDCL Power Connection
    const msedclRes = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Sahyadri Bio-Chemicals Ltd',
        approvalName: 'HT Power Connectivity Sanction (800 kW)',
        department: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
        category: 'Power & Utilities',
        feesPaid: 85000
      })
    });
    const msedclApp = await msedclRes.json();
    msedclAppId = msedclApp.id;
  });

  // 3. Verify Domain Officer Routing Isolation
  await step('3. Domain Officer Scrutiny Isolation (MPCB Officer)', async () => {
    const res = await fetch(`${API_BASE}/applications?department=Maharashtra%20Pollution%20Control%20Board`);
    const apps = await res.json();
    const hasMpcb = apps.some((a: any) => a.id === mpcbAppId);
    const hasFire = apps.some((a: any) => a.id === fireAppId);
    if (!hasMpcb) throw new Error('MPCB application missing from MPCB Desk');
    if (hasFire) throw new Error('Fire application leaked into MPCB Desk');
  });

  await step('4. Domain Officer Scrutiny Isolation (Fire Officer)', async () => {
    const res = await fetch(`${API_BASE}/applications?department=Fire`);
    const apps = await res.json();
    const hasFire = apps.some((a: any) => a.id === fireAppId);
    const hasMpcb = apps.some((a: any) => a.id === mpcbAppId);
    if (!hasFire) throw new Error('Fire application missing from Fire Desk');
    if (hasMpcb) throw new Error('MPCB application leaked into Fire Desk');
  });

  await step('5. Domain Officer Scrutiny Isolation (DISH Officer)', async () => {
    const res = await fetch(`${API_BASE}/applications?department=Industrial%20Safety`);
    const apps = await res.json();
    const hasDish = apps.some((a: any) => a.id === dishAppId);
    if (!hasDish) throw new Error('DISH application missing from DISH Desk');
  });

  // 6. Parallel Officer Actions: Concurrently Process Clearances
  let fireQueryId = '';
  await step('6. Fire Officer Raises Technical Query on Fire Track', async () => {
    const res = await fetch(`${API_BASE}/applications/${fireAppId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: 'Chief Fire Officer K. Shinde',
        department: 'Directorate of Maharashtra Fire Services',
        queryCategory: 'Hydrant Flow Specifications',
        queryText: 'Please submit hydraulic calculation confirming 3.5 bar pressure at most remote hydrant point.'
      })
    });
    const q = await res.json();
    fireQueryId = q.id;
  });

  await step('7. MPCB Officer Approves MPCB Track Concurrently (Without waiting for Fire)', async () => {
    const res = await fetch(`${API_BASE}/applications/${mpcbAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'ETP effluent design and hazardous waste storage verified. CTE Approved.',
        officerName: 'S. Kulkarni (SRO MPCB)'
      })
    });
    const updated = await res.json();
    if (updated.status !== 'Approved') throw new Error('MPCB approval failed');
  });

  await step('8. Entrepreneur Responds to Fire Officer Query', async () => {
    const res = await fetch(`${API_BASE}/queries/${fireQueryId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseText: 'Attached hydraulic calculations by licensed fire engineer proving 3.8 bar pressure at highest hydrant point.',
        responseDocName: 'hydraulic_calculations_signed.pdf'
      })
    });
    const result = await res.json();
    if (!result.success) throw new Error('Query response failed');
  });

  await step('9. Fire Officer Approves Fire Track after Query Resolution', async () => {
    const res = await fetch(`${API_BASE}/applications/${fireAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'Hydraulic calculations verified. Provisional Fire NOC granted.',
        officerName: 'Chief Fire Officer K. Shinde'
      })
    });
    const updated = await res.json();
    if (updated.status !== 'Approved') throw new Error('Fire approval failed');
  });

  await step('10. DISH & MIDC Officers Approve Their Respective Tracks in Parallel', async () => {
    // DISH Approval
    await fetch(`${API_BASE}/applications/${dishAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'Factory structural drawings and emergency escape plan approved under Section 6.',
        officerName: 'DISH Inspector R. Deshmukh'
      })
    });

    // MIDC Approval
    await fetch(`${API_BASE}/applications/${midcAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'Building layout complies with MIDC DCR norms. Plan sanctioned.',
        officerName: 'MIDC SPA Officer S. More'
      })
    });
  });

  // 11. Verify Final Parallel State
  await step('11. Validate Parallel Processing Progress Metrics', async () => {
    const res = await fetch(`${API_BASE}/applications?projectId=${projectId}`);
    const projectApps: Application[] = await res.json();
    const approvedCount = projectApps.filter(a => a.status === 'Approved').length;
    const totalCount = projectApps.length;
    const progressPct = Math.round((approvedCount / totalCount) * 100);

    if (totalCount !== 5) throw new Error(`Expected 5 parallel applications, found ${totalCount}`);
    if (approvedCount !== 4) throw new Error(`Expected 4 approved applications, found ${approvedCount}`);
    console.log(`\n  • Parallel Clearances: ${approvedCount} of ${totalCount} Approved (${progressPct}% Overall Progress)`);
  });

  console.log('\n================================================================');
  console.log(`🎉 TEST COMPLETE: ${passed} Passed | ${failed} Failed`);
  console.log('   Parallel Workflow & Domain Officer Isolation Verified 100%');
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

testParallelAndDomainRouting().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
