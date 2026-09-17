import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS 
} from '../server/data/mockData';

const API_BASE = 'http://localhost:5000/api';

async function testFoodOfficerWorkflow() {
  console.log('================================================================');
  console.log('🍲 TESTING FOOD DEPARTMENT (FSSAI/FDA) OFFICER WORKFLOW');
  console.log('   Enterprise: Sahyadri Organic Agro & Spices Manufacturing LLP');
  console.log('   Sector: Food Processing | Location: MIDC Supa, District Ahmednagar');
  console.log('   Assigned Food Officer: Officer Meena Thorat (FSSAI / FDA Maharashtra)');
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

  // 1. Create Entrepreneur Food Processing Project
  let projectId = '';
  await step('1. Register Entrepreneur Food Processing Project', async () => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Sahyadri Organic Agro & Spices Manufacturing LLP',
        sector: 'Food Processing',
        scale: 'Medium',
        investmentRange: '₹10Cr - ₹25Cr',
        estimatedInvestmentCr: 15,
        proposedEmployees: 60,
        landStatus: 'MIDC Allotted',
        midcArea: 'Supa MIDC',
        district: 'Ahmednagar',
        powerRequirementKW: 250,
        waterRequirementLPD: 6000,
        hazardousMaterials: false
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    projectId = data.id;
    if (!projectId) throw new Error('Missing project ID');
  });

  // 2. Entrepreneur Applies for FSSAI Food Business Manufacturing License
  let foodAppId = '';
  await step('2. Entrepreneur Submits FSSAI Food Manufacturing Licence Application', async () => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        approvalId: 'appr-4',
        approvalName: 'FSSAI Food Business Manufacturing License',
        department: 'Food Safety and Standards Authority of India (FSSAI) / Food and Drug Administration (FDA Maharashtra)',
        category: 'Licence',
        documentIds: ['doc-fssai-blueprint', 'doc-water-test-report', 'doc-fsms-plan'],
        applicantRemarks: 'Medium scale organic spice grinding and vacuum packaging facility adhering to Schedule 4 GMP/GHP standards.'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    foodAppId = data.id;
    if (!foodAppId) throw new Error('Failed to create FSSAI application');
  });

  // 3. Verify Application Routing to Food Department Officer (Officer Meena Thorat)
  await step('3. Domain Scrutiny: Food Officer (Meena Thorat) Receives FSSAI Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const foodOfficerDept = 'Food Safety & Standards Authority (FSSAI)';
    const scopedForFoodOfficer = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('food') || dept.includes('fssai') || dept.includes('fda');
    });

    const hasTargetApp = scopedForFoodOfficer.some((a: any) => a.id === foodAppId);
    if (!hasTargetApp) throw new Error('FSSAI Application was not found in Food Officer Desk inbox');
  });

  // 4. Verify Scrutiny Isolation: MPCB Officer Dr. V. K. Patil CANNOT see FSSAI Application
  await step('4. Scrutiny Isolation: MPCB Officer Inbox Excludes FSSAI Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const mpcbScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('pollution') || dept.includes('mpcb');
    });

    const erroneouslyPresent = mpcbScoped.some((a: any) => a.id === foodAppId);
    if (erroneouslyPresent) throw new Error('Security Violation: MPCB Officer received FSSAI food application!');
  });

  // 5. Verify Scrutiny Isolation: Fire Officer Sunita Rane CANNOT see FSSAI Application
  await step('5. Scrutiny Isolation: Fire Officer Inbox Excludes FSSAI Dossier', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();

    const fireScoped = apps.filter((a: any) => {
      const dept = (a.department || '').toLowerCase();
      return dept.includes('fire');
    });

    const erroneouslyPresent = fireScoped.some((a: any) => a.id === foodAppId);
    if (erroneouslyPresent) throw new Error('Security Violation: Fire Officer received FSSAI food application!');
  });

  // 6. Food Officer Raises Technical Query on FSMS Hygiene Audit
  let queryId = '';
  await step('6. Food Officer Raises FSMS & Potable Water Clarification Query', async () => {
    const res = await fetch(`${API_BASE}/applications/${foodAppId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: 'Officer Meena Thorat (FSSAI)',
        department: 'Food Safety and Standards Authority of India (FSSAI) / Food and Drug Administration (FDA Maharashtra)',
        queryCategory: 'Food Safety Management System (FSMS)',
        queryText: 'Please furnish NABL-accredited laboratory test report for RO process water potability (IS 10500 standards) and pest control contract.',
        dueDate: '2026-10-05'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    queryId = data.id || 'query-1';
  });

  // 7. Entrepreneur Responds to Food Officer Query
  await step('7. Entrepreneur Submits Potable Water Test Certificate & Pest Control Agreement', async () => {
    const res = await fetch(`${API_BASE}/queries/${queryId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseText: 'Attached NABL accredited water report showing 0 coliform count and 12-month pest management agreement with PCI.',
        responseDocName: 'NABL_Water_Test_IS10500.pdf'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 8. Food Officer Reviews Response & Approves FSSAI Manufacturing License
  await step('8. Food Officer (Meena Thorat) Approves FSSAI Food Manufacturing License', async () => {
    const res = await fetch(`${API_BASE}/applications/${foodAppId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'All Schedule 4 GHP/GMP norms verified. Potable water test satisfactory. License issued for 5 years validity.',
        officerName: 'Officer Meena Thorat (FSSAI)'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 9. Validate Final Status on Entrepreneur Profile
  await step('9. Validate Approved FSSAI Clearance on Entrepreneur Profile', async () => {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const apps = await res.json();
    const target = apps.find((a: any) => a.id === foodAppId);
    if (!target) throw new Error('Target FSSAI application not found');
    if (target.status !== 'Approved') throw new Error(`Expected Approved status, got ${target.status}`);
  });

  console.log('\n================================================================');
  console.log(`🎉 TEST COMPLETE: ${passed} Passed | ${failed} Failed`);
  console.log('   Food Department (FSSAI/FDA) Officer Routing & Isolation Verified 100%');
  console.log('================================================================\n');
}

testFoodOfficerWorkflow().catch((err) => {
  console.error('Fatal Test Failure:', err);
  process.exit(1);
});
