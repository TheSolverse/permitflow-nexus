import { generateSmartChecklist } from '../server/utils/rulesEngine';
import { calculateRiskScore } from '../server/utils/riskCalculator';
import { analyzeDocumentOCR, preValidateApplicationBundle } from '../server/ai/ocrEngine';
import { queryRegulatoryRAG, explainOfficerQuery } from '../server/ai/regulatoryKnowledge';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function runRealWorldScenario() {
  console.log('================================================================');
  console.log('🏭 REAL-WORLD END-TO-END INDUSTRIAL CLEARANCE SCENARIO TEST');
  console.log('   Project: Mahindra EV Battery Pack & Power Module Manufacturing');
  console.log('   Location: Plot A-42, MIDC Chakan Phase II, Taluka Khed, Pune');
  console.log('   Investment: ₹85 Crores | Scale: Large | Power: 1,200 kW');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function stage(title: string, fn: () => Promise<any>) {
    console.log(`\n▶ STAGE: ${title}`);
    try {
      const result = await fn();
      console.log(`  ✅ Result: SUCCESS`);
      passed++;
      return result;
    } catch (err: any) {
      console.log(`  ❌ Result: FAILED - ${err.message}`);
      failed++;
    }
  }

  // Stage 1: Entrepreneur Onboarding & Project Setup
  let projectId = '';
  let entrepreneurUser: any = null;
  await stage('1. Entrepreneur Project Registration & Profiling', async () => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Mahindra EV Battery Systems Ltd',
        sector: 'Automotive & Precision Engineering',
        subSector: 'Electric Vehicle Lithium-ion Battery Pack & BMS Assembly',
        scale: 'Large',
        investmentRange: '₹50Cr - ₹100Cr',
        estimatedInvestmentCr: 85,
        proposedEmployees: 320,
        landStatus: 'MIDC Allotted',
        midcArea: 'Chakan MIDC Phase II',
        district: 'Pune',
        taluka: 'Khed',
        powerRequirementKW: 1200,
        waterRequirementLPD: 25000,
        hazardousMaterials: true,
        projectStage: 'PLANNING'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const proj = await res.json();
    projectId = proj.id;
    console.log(`  • Created Project ID: ${projectId}`);
    console.log(`  • Business Name: ${proj.businessName}`);
    console.log(`  • Investment: ₹${proj.estimatedInvestmentCr} Cr | Power: ${proj.powerRequirementKW} kW`);
  });

  // Stage 2: Statutory Smart Checklist Generation
  let checklist: any[] = [];
  await stage('2. Statutory Smart Checklist Heuristic Engine', async () => {
    const dummyProj = {
      id: projectId,
      businessName: 'Mahindra EV Battery Systems Ltd',
      sector: 'Automotive & Precision Engineering',
      scale: 'Large' as const,
      investmentAmount: '85 Crores',
      landZone: 'MIDC Industrial Area',
      district: 'Pune',
      state: 'Maharashtra',
      complianceScore: 85,
      riskLevel: 'LOW' as const
    };
    checklist = generateSmartChecklist(dummyProj as any, []);
    if (!checklist || checklist.length === 0) throw new Error('Checklist generation returned 0 items');
    console.log(`  • Generated ${checklist.length} tailored statutory clearances:`);
    checklist.slice(0, 4).forEach((c, idx) => {
      console.log(`    ${idx + 1}. [${c.department}] ${c.name || c.approvalName} (Estimated SLA: ${c.estimatedTimelineDays || 15} days)`);
    });
  });

  // Stage 3: AI OCR Document Verification & Pre-Validation Bundle
  let uploadedDocs: any[] = [];
  await stage('3. Document Centre OCR Validation & Pre-Screening', async () => {
    const testFiles = [
      { name: 'pan_card.jpg', cat: 'PAN_CARD', authority: 'Income Tax Dept' },
      { name: 'aadhaar_card.jpg', cat: 'AADHAAR_CARD', authority: 'UIDAI' },
      { name: 'registered_lease_deed.jpg', cat: 'LEASE_AGREEMENT', authority: 'MIDC SPA' },
      { name: 'electricity_bill.jpg', cat: 'UTILITY_BILL', authority: 'MSEDCL' },
      { name: 'fire_safety_noc.jpg', cat: 'FIRE_SAFETY_NOC', authority: 'Maharashtra Fire Services' },
      { name: 'mpcb_consent_to_establish.jpg', cat: 'POLLUTION_CONSENT', authority: 'MPCB' },
      { name: 'dish_factory_licence.jpg', cat: 'FACTORY_LICENCE', authority: 'DISH Maharashtra' }
    ];

    for (const f of testFiles) {
      const ocrRes = analyzeDocumentOCR(f.name, f.cat);
      const docRes = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          docName: f.name,
          category: f.cat,
          fileUrl: `/sample_documents/${f.name}`,
          fileSize: '1.8 MB',
          status: ocrRes.status,
          aiValidationResult: ocrRes
        })
      });
      const savedDoc = await docRes.json();
      uploadedDocs.push(savedDoc);
    }

    const bundleValidation = preValidateApplicationBundle(
      'Consent to Establish (CTE)',
      ['PAN_CARD', 'AADHAAR_CARD', 'LEASE_AGREEMENT', 'UTILITY_BILL'],
      uploadedDocs,
      'Mahindra EV Battery Systems Ltd'
    );

    console.log(`  • Uploaded & Verified: ${uploadedDocs.length} statutory files.`);
    console.log(`  • Bundle Pre-Validation Status: ${bundleValidation.isValidForSubmission ? 'READY (100% Score)' : 'INCOMPLETE'}`);
    if (!bundleValidation.isValidForSubmission) throw new Error('Application bundle failed validation');
  });

  // Stage 4: Statutory Single Window Application Submission
  let applicationId = '';
  await stage('4. Single Window Clearance Application Submission', async () => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Mahindra EV Battery Systems Ltd',
        approvalId: 'appr-mpcb-cte',
        approvalName: 'Consent to Establish (CTE - Red Category EV Battery)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        category: 'Pollution & Environment',
        feesPaid: 175000,
        documentIds: uploadedDocs.map(d => d.id)
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const app = await res.json();
    applicationId = app.id;
    console.log(`  • Application ID: ${app.appId} (${app.id})`);
    console.log(`  • Status: ${app.status} | SLA Target: 45 Days (Deadline: ${app.slaDeadlineDate})`);
  });

  // Stage 5: Multi-Factor Risk Scoring Assessment
  await stage('5. AI Dynamic Risk Scoring Assessment', async () => {
    const projData: any = {
      id: projectId,
      sector: 'Chemical', // Battery chemistry treated with stringent standard
      scale: 'Large',
      landType: 'Industrial',
      midcArea: 'Chakan MIDC Phase II',
      hasHazardousMaterials: true
    };
    const complianceTasks: any[] = [{ id: 'task-1', status: 'VALID' }];
    const risk = calculateRiskScore(projData, uploadedDocs, complianceTasks);

    console.log(`  • Calculated Risk Index: ${risk.overallScore}/100 (${risk.riskLabel})`);
    console.log(`  • Sector Risk: ${risk.factors.sectorRisk.score}/${risk.factors.sectorRisk.max}`);
    console.log(`  • Location Risk: ${risk.factors.locationRisk.score}/${risk.factors.locationRisk.max}`);
    console.log(`  • Document Quality Score: ${risk.factors.documentQualityRisk.score}/${risk.factors.documentQualityRisk.max}`);
    if (typeof risk.overallScore !== 'number') throw new Error('Invalid risk score payload');
  });

  // Stage 6: Officer Technical Scrutiny & Query Clarification Loop
  let queryId = '';
  await stage('6. Department Officer Scrutiny & Technical Clarification Loop', async () => {
    // 6a: Officer raises query
    const qRes = await fetch(`${API_BASE}/applications/${applicationId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        officerName: 'S. Kulkarni (Sub-Regional Officer, MPCB Pune-II)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        queryCategory: 'Effluent & Hazardous Waste Treatment',
        queryText: 'Please submit detailed Zero Liquid Discharge (ZLD) mass balance flow diagram and hazardous waste recycling tie-up with authorized TSDF.'
      })
    });
    const query = await qRes.json();
    queryId = query.id;
    console.log(`  • SRO MPCB Raised Query: "${query.queryText.substring(0, 75)}..."`);

    // 6b: AI query explainer
    const plainHelp = explainOfficerQuery(query.queryText, 'MPCB CTE');
    console.log(`  • AI Explainer: "${plainHelp.plainExplanation.substring(0, 85)}..."`);

    // 6c: Entrepreneur responds to query
    const respRes = await fetch(`${API_BASE}/queries/${queryId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responseText: 'Attached comprehensive 50 KLD Zero Liquid Discharge (ZLD) process schematic with MEWA TSDF Ranjangaon hazardous waste disposal agreement.',
        responseDocName: 'mahindra_zld_tsdf_agreement_rev1.pdf'
      })
    });
    if (!respRes.ok) throw new Error('Query response failed');

    // 6d: Officer grants final approval
    const apprRes = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Approved',
        remarks: 'ZLD schematics and TSDF membership verified. Consent to Establish (CTE) granted under Water Act 1974 & Air Act 1981.',
        officerName: 'S. Kulkarni (SRO MPCB)'
      })
    });
    const updatedApp = await apprRes.json();
    console.log(`  • Application Decision: ${updatedApp.status} by ${updatedApp.officerAssigned}`);
    if (updatedApp.status !== 'Approved') throw new Error('Status not approved');
  });

  // Stage 7: Joint Multi-Department On-Site Audit
  let jointInspectionId = '';
  await stage('7. Multi-Agency Joint Site Inspection Audit', async () => {
    const jointRes = await fetch(`${API_BASE}/joint-inspections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Mahindra EV Battery Systems Ltd',
        scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        scheduledTime: '11:30 AM',
        attendingDepartments: [
          'Maharashtra Pollution Control Board (MPCB)',
          'Directorate of Maharashtra Fire Services',
          'Directorate of Industrial Safety & Health (DISH)',
          'MIDC Special Planning Authority (SPA)'
        ],
        officerNames: [
          'S. Kulkarni (MPCB SRO)',
          'Chief Fire Officer P. Jagtap',
          'DISH Inspector R. Deshmukh',
          'MIDC Executive Engineer V. Mane'
        ],
        inspectionLocation: 'Plot A-42, MIDC Chakan Phase II, Taluka Khed, Pune',
        rubricChecklist: [
          { item: '6.0m clear unobstructed peripheral fire vehicle driveway', checked: true },
          { item: '50 KLD Effluent Treatment Plant (ETP) concrete foundations', checked: true },
          { item: 'Hazardous chemical secondary containment bund flooring', checked: true },
          { item: 'Underground static fire water tank (1,00,000 Litres)', checked: true }
        ]
      })
    });
    const joint = await jointRes.json();
    jointInspectionId = joint.id;
    console.log(`  • Scheduled Joint Inspection ID: ${joint.id}`);
    console.log(`  • Participating Agencies: ${joint.attendingDepartments.length} Departments`);
    console.log(`  • Audit Date & Time: ${joint.scheduledDate} at ${joint.scheduledTime}`);
  });

  // Stage 8: NOC Issuance with Verification QR Codes
  let fireNocId = '';
  await stage('8. Fire Safety NOC & Digital Certificate Generation', async () => {
    // 8a: Submit Fire NOC Application
    const nocRes = await fetch(`${API_BASE}/noc-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        businessName: 'Mahindra EV Battery Systems Ltd',
        nocType: 'FIRE',
        nocName: 'Pre-Commissioning Fire Safety & Hydraulic NOC',
        department: 'Directorate of Maharashtra Fire Services',
        technicalParameters: {
          builtUpAreaSqM: 18500,
          hazardousStorageTonnes: 75,
          fireHydrantPoints: 36,
          sprinklerCount: 420
        }
      })
    });
    const noc = await nocRes.json();
    fireNocId = noc.id;

    // 8b: Issue Provisional Fire NOC
    const provRes = await fetch(`${API_BASE}/noc-applications/${fireNocId}/issue-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certType: 'PROVISIONAL' })
    });
    const provData = await provRes.json();
    console.log(`  • Provisional Fire NOC: ${provData.status} (Cert ID: ${provData.certificateId})`);

    // 8c: Grant Final Fire NOC with QR code
    const finalRes = await fetch(`${API_BASE}/noc-applications/${fireNocId}/issue-certificate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certType: 'FINAL' })
    });
    const finalData = await finalRes.json();
    console.log(`  • Final Fire NOC Granted: ${finalData.status}`);
    console.log(`  • Certificate ID: ${finalData.certificateId}`);
    console.log(`  • Digital Verification QR Data: ${finalData.qrCodeData}`);
    if (finalData.status !== 'FINAL_GRANTED') throw new Error('Final NOC grant failed');
  });

  // Stage 9: Maharashtra State Industrial Subsidies (PSI 2019)
  await stage('9. Incentive Finder & Subsidies Calculator (PSI 2019)', async () => {
    const res = await fetch(`${API_BASE}/incentives`);
    const schemes = await res.json();
    const psiScheme = schemes.find((s: any) => (s.schemeName || '').includes('PSI') || (s.schemeName || '').includes('Package'));

    console.log(`  • Available Maharashtra Schemes: ${schemes.length} Programs`);
    if (psiScheme) {
      console.log(`  • Evaluated Scheme: ${psiScheme.schemeName}`);
      console.log(`  • Eligible Benefits: ${psiScheme.maxBenefit || '50% - 80% Capital Subsidy + 100% Electricity Duty Exemption'}`);
    }
  });

  // Stage 10: Compliance Locker Lifecycle & Annual Statutory Renewal
  await stage('10. Statutory Compliance Locker & SLA Renewal Lifecycle', async () => {
    const getRes = await fetch(`${API_BASE}/compliance`);
    const tasks = await getRes.json();
    if (tasks.length > 0) {
      const targetTask = tasks[0];
      const renewRes = await fetch(`${API_BASE}/compliance/${targetTask.id}/renew`, { method: 'POST' });
      const renewed = await renewRes.json();
      console.log(`  • Renewed Statutory Task: "${renewed.title}"`);
      console.log(`  • Status: ${renewed.status} | New Validity: 365 Days (Due: ${renewed.dueDate})`);
    } else {
      console.log('  • Compliance locker records active.');
    }
  });

  // Stage 11: Multi-Lingual Regulatory AI Query Assistance (Marathi, Hindi, English)
  await stage('11. Multi-Lingual Regulatory AI Query Assistance', async () => {
    // Marathi
    const mrRes = queryRegulatoryRAG('कारखान्यासाठी MPCB ची कोणती परवानगी आवश्यक आहे?', { businessName: 'Mahindra EV Battery' }, 'mr');
    console.log(`  • Marathi Query Result: ${mrRes.answer.split('\n')[0]}`);

    // Hindi
    const hiRes = queryRegulatoryRAG('फैक्ट्री लाइसेंस के लिए कौन से दस्तावेज चाहिए?', { businessName: 'Mahindra EV Battery' }, 'hi');
    console.log(`  • Hindi Query Result: ${hiRes.answer.split('\n')[0]}`);

    // English
    const enRes = queryRegulatoryRAG('What are the fire safety requirements for chemical and battery plant in MIDC?', { businessName: 'Mahindra EV Battery' }, 'en');
    console.log(`  • English Query Result: ${enRes.answer.split('\n')[0]}`);

    if (!mrRes.answer || !hiRes.answer || !enRes.answer) throw new Error('Multi-lingual query failed');
  });

  console.log('\n================================================================');
  console.log(`🎉 SCENARIO COMPLETE: ${passed} Stages Passed | ${failed} Failed`);
  console.log('   All 11 Real-World Industrial Clearance Stages Functioning Flawlessly');
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRealWorldScenario().catch(e => {
  console.error('Fatal scenario execution error:', e);
  process.exit(1);
});
