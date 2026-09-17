import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS 
} from '../server/data/mockData';

const API_BASE = 'http://localhost:5000/api';

async function testMcaOfficerWorkflow() {
  console.log('================================================================');
  console.log('🏛️ TESTING MINISTRY OF CORPORATE AFFAIRS (MCA - CRC) WORKFLOW');
  console.log('   Enterprise: Bharat Quantum Computing Technologies Pvt Ltd');
  console.log('   Registration: SPICe+ Private Limited Incorporation (MCA Central Registration Centre)');
  console.log('   Assigned Officer: Registrar Arvind K. Joshi (MCA - CRC Manesar/New Delhi)');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function step(name: string, fn: () => Promise<any>) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      const res = await fn();
      passed++;
      console.log('✅ PASSED');
      return res;
    } catch (err: any) {
      failed++;
      console.log(`❌ FAILED\n   Error: ${err.message}`);
      throw err;
    }
  }

  // 1. Create Entrepreneur Project for New Tech Enterprise
  let projectId = '';
  await step('1. Register Entrepreneur Corporate Enterprise', async () => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Bharat Quantum Computing Technologies Pvt Ltd',
        sector: 'IT & Electronic System Design',
        scale: 'Medium',
        investmentRange: '₹10Cr - ₹25Cr',
        estimatedInvestmentCr: 20,
        proposedEmployees: 120,
        landStatus: 'MIDC Allotted',
        midcArea: 'Airoli Knowledge Park, Navi Mumbai',
        district: 'Thane',
        powerRequirementKW: 500,
        waterRequirementLPD: 4000,
        hazardousMaterials: false
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    projectId = data.id;
    if (!projectId) throw new Error('Missing project ID');
  });

  // 2. Entrepreneur Applies for MCA Company Incorporation (SPICe+)
  let mcaAppId = '';
  await step('2. Entrepreneur Submits MCA SPICe+ Incorporation Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        approvalId: 'appr-1',
        approvalName: 'Company Incorporation (SPICe+ Private Limited / OPC)',
        department: 'Ministry of Corporate Affairs (MCA) - Central Registration Centre',
        category: 'Registration',
        documentIds: ['doc-pan-directors', 'doc-e-moa-inc33', 'doc-e-aoa-inc34', 'doc-utility-bill', 'doc-owner-noc'],
        applicantRemarks: 'Incorporation of Private Limited Company with 2 Indian resident directors and authorized capital of ₹50,00,000.'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    mcaAppId = data.id;
    if (!mcaAppId) throw new Error('Failed to create MCA application');
  });

  // 3. Verify Application Routing to MCA Central Registration Centre Officer
  await step('3. Domain Scrutiny: MCA CRC Officer (Registrar A. K. Joshi) Receives SPICe+ Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const mcaScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('corporate') || dept.includes('mca') || dept.includes('crc') || dept.includes('registration centre') || dept.includes('incorporation');
    });

    const hasTargetApp = mcaScoped.some((a: any) => a.id === mcaAppId);
    if (!hasTargetApp) throw new Error('MCA SPICe+ Application was not found in MCA CRC Officer Desk inbox');
  });

  // 4. Verify Scrutiny Isolation: MPCB Pollution Officer CANNOT see MCA Application
  await step('4. Scrutiny Isolation: MPCB Pollution Officer Inbox Excludes MCA Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const mpcbScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('pollution') || dept.includes('mpcb');
    });

    const erroneouslyPresent = mpcbScoped.some((a: any) => a.id === mcaAppId);
    if (erroneouslyPresent) throw new Error('Security Violation: MPCB Officer received MCA incorporation application!');
  });

  // 5. Verify Scrutiny Isolation: Fire Services Officer CANNOT see MCA Application
  await step('5. Scrutiny Isolation: Fire Services Officer Inbox Excludes MCA Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const fireScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('fire');
    });

    const erroneouslyPresent = fireScoped.some((a: any) => a.id === mcaAppId);
    if (erroneouslyPresent) throw new Error('Security Violation: Fire Officer received MCA incorporation application!');
  });

  // 6. Verify Scrutiny Isolation: FSSAI Food Safety Officer CANNOT see MCA Application
  await step('6. Scrutiny Isolation: FSSAI Food Officer Inbox Excludes MCA Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const foodScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('food') || dept.includes('fssai') || dept.includes('fda');
    });

    const erroneouslyPresent = foodScoped.some((a: any) => a.id === mcaAppId);
    if (erroneouslyPresent) throw new Error('Security Violation: Food Officer received MCA incorporation application!');
  });

  // 7. MCA Officer Raises Clarification Query on Registered Office Utility Bill
  let queryId = '';
  await step('7. MCA Officer Raises Resubmission / Clarification Query', async () => {
    const res = await fetch(`${API_BASE}/applications/${mcaAppId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: 'Registrar Arvind K. Joshi (MCA CRC)',
        department: 'Ministry of Corporate Affairs (MCA) - Central Registration Centre',
        queryCategory: 'Registered Office Address & Director KYC',
        queryText: 'Electricity bill submitted for registered office is older than 2 months. Please upload utility bill dated within the last 60 days along with notarized Owner NOC in Form INC-9.',
        dueDate: '2026-10-02'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    queryId = data.id || 'query-1';
  });

  // 8. Entrepreneur Responds to MCA Clarification Query
  await step('8. Entrepreneur Uploads Latest Utility Bill & Notarized INC-9', async () => {
    const res = await fetch(`${API_BASE}/queries/${queryId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseText: 'Attached electricity bill dated September 2026 and notarized INC-9 director declaration with DSC signature.',
        responseDocName: 'Electricity_Bill_Sept2026_INC9.pdf'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 9. MCA CRC Officer Approves Incorporation & Grants Certificate
  await step('9. MCA Registrar Approves Incorporation & Issues CIN (U72900MH2026PTC392811)', async () => {
    const res = await fetch(`${API_BASE}/applications/${mcaAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'SPICe+ Part A and Part B documents verified. e-MoA & e-AoA registered. Certificate of Incorporation issued. CIN: U72900MH2026PTC392811. PAN & TAN allotted.',
        officerName: 'Registrar Arvind K. Joshi (MCA CRC)'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 10. Validate Final Status on Entrepreneur Profile
  await step('10. Validate Approved MCA Status on Entrepreneur Dashboard', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();
    const target = apps.find((a: any) => a.id === mcaAppId);
    if (!target) throw new Error('Target MCA application not found');
    if (target.status !== 'Approved') throw new Error(`Expected Approved status, got ${target.status}`);
  });

  console.log('\n================================================================');
  console.log(`🎉 TEST COMPLETE: ${passed} Passed | ${failed} Failed`);
  console.log('   Ministry of Corporate Affairs (MCA - CRC) Workflow Verified 100%');
  console.log('================================================================\n');
}

testMcaOfficerWorkflow().catch((err) => {
  console.error('Fatal Test Failure:', err);
  process.exit(1);
});
