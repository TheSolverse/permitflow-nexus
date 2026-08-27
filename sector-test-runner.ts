import { generateSmartChecklist } from './src/utils/rulesEngine';
import { MASTER_SECTOR_DATA } from './src/data/sectorData';
import { BusinessProject } from './src/types';

console.log('====================================================');
console.log('VERIFYING MAHARASHTRA SECTOR & SUB-SECTOR CHECKLIST ENGINE');
console.log('====================================================\n');

let passCount = 0;
let totalTests = 0;

function assertTest(condition: boolean, testName: string, detail: string) {
  totalTests++;
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${totalTests}. ${testName}: ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${totalTests}. ${testName}: ${detail}`);
  }
}

// Mock base project
const baseProject: BusinessProject = {
  id: 'test-proj',
  userId: 'usr-1',
  businessName: 'Test Unit',
  businessType: 'Industrial Unit',
  projectType: 'New Setup',
  entityType: 'Private Limited',
  sector: 'Manufacturing',
  subSector: 'Metal products (steel fabrication, structures, utensils)',
  investmentRange: '₹5 Cr - ₹15 Cr',
  employeeCount: 25,
  businessActivity: 'Steel fabrication',
  projectStage: 'Construction',
  hasConstruction: true,
  hasHazardousMaterials: false,
  district: 'Pune',
  cityTaluka: 'Chakan',
  pincode: '410501',
  midcArea: 'Chakan Phase II',
  landType: 'MIDC Allotted',
  address: 'Plot C-42',
  createdAt: '2026-08-27'
};

// Test 1: Manufacturing -> Textiles
const textileProj = {
  ...baseProject,
  sector: 'Manufacturing' as const,
  subSector: 'Textiles (spinning, weaving, garment manufacturing)'
};
const textileChecklist = generateSmartChecklist(textileProj);
const hasEpfoEsic = textileChecklist.some(item => item.id === 'appr-labour-epfo-esic');
const hasDish = textileChecklist.some(item => item.id === 'appr-7');
assertTest(hasEpfoEsic && hasDish, 'Manufacturing -> Textiles', `Generates Labour EPFO/ESIC (${hasEpfoEsic}) and DISH Factory License (${hasDish})`);

// Test 2: Manufacturing -> Chemicals
const chemProj = {
  ...baseProject,
  sector: 'Manufacturing' as const,
  subSector: 'Chemicals (basic chemicals, formulations, paints, adhesives)',
  hasHazardousMaterials: true
};
const chemChecklist = generateSmartChecklist(chemProj);
const hasPeso = chemChecklist.some(item => item.id === 'appr-peso');
const hasHazWaste = chemChecklist.some(item => item.id === 'appr-hazardous-waste');
assertTest(hasPeso && hasHazWaste, 'Manufacturing -> Chemicals', `Generates PESO Explosives Approval (${hasPeso}) and Hazardous Waste Auth (${hasHazWaste})`);

// Test 3: Manufacturing -> Electronics
const elecProj = {
  ...baseProject,
  sector: 'Manufacturing' as const,
  subSector: 'Electronics (assembly, PCB manufacturing, devices)'
};
const elecChecklist = generateSmartChecklist(elecProj);
const hasEWaste = elecChecklist.some(item => item.id === 'appr-ewaste');
assertTest(hasEWaste, 'Manufacturing -> Electronics', `Generates E-Waste Handling Authorization (${hasEWaste})`);

// Test 4: Packaging -> Food packaging
const foodPkgProj = {
  ...baseProject,
  sector: 'Packaging' as const,
  subSector: 'Food packaging (printing, pouches, bottles, containers for food)'
};
const foodPkgChecklist = generateSmartChecklist(foodPkgProj);
const hasFssaiPkg = foodPkgChecklist.some(item => item.id === 'appr-fssai-packaging');
const hasMetrology = foodPkgChecklist.some(item => item.id === 'appr-legal-metrology');
assertTest(hasFssaiPkg && hasMetrology, 'Packaging -> Food packaging', `Generates FSSAI Food Contact Packaging License (${hasFssaiPkg}) and Legal Metrology (${hasMetrology})`);

// Test 5: Food Processing -> Milk and dairy processing
const dairyProj = {
  ...baseProject,
  sector: 'Food Processing' as const,
  subSector: 'Milk and dairy processing'
};
const dairyChecklist = generateSmartChecklist(dairyProj);
const hasDairyDept = dairyChecklist.some(item => item.id === 'appr-dairy-dept');
const hasFssai = dairyChecklist.some(item => item.id === 'appr-12');
assertTest(hasDairyDept && hasFssai, 'Food Processing -> Milk & Dairy', `Generates Animal Husbandry Dairy Registration (${hasDairyDept}) and FSSAI (${hasFssai})`);

// Test 6: Food Processing -> Edible oil & spices
const oilSpicesProj = {
  ...baseProject,
  sector: 'Food Processing' as const,
  subSector: 'Edible oil and spices (processing, refining, packaging)'
};
const oilChecklist = generateSmartChecklist(oilSpicesProj);
const hasAgmark = oilChecklist.some(item => item.id === 'appr-agmark');
assertTest(hasAgmark, 'Food Processing -> Edible Oil & Spices', `Generates AGMARK Quality Grading Registration (${hasAgmark})`);

// Test 7: Retail -> Food retail
const foodRetailProj = {
  ...baseProject,
  sector: 'Retail' as const,
  subSector: 'Food retail (restaurants, cafes, cloud kitchens, food stalls)'
};
const retailChecklist = generateSmartChecklist(foodRetailProj);
const hasHealthLic = retailChecklist.some(item => item.id === 'appr-health-license');
const hasVentilation = retailChecklist.some(item => item.id === 'appr-kitchen-ventilation');
assertTest(hasHealthLic && hasVentilation, 'Retail -> Food retail', `Generates Municipal Health License (${hasHealthLic}) and Kitchen Ventilation Clearance (${hasVentilation})`);

// Test 8: IT -> Software development
const softProj = {
  ...baseProject,
  sector: 'IT / IT-enabled Services' as const,
  subSector: 'Software development (product companies, IT services, startups)'
};
const softChecklist = generateSmartChecklist(softProj);
const hasStpi = softChecklist.some(item => item.id === 'appr-stpi');
assertTest(hasStpi, 'IT / ITES -> Software development', `Generates STPI Export Registration (${hasStpi})`);

// Test 9: Master sector dataset completeness
assertTest(MASTER_SECTOR_DATA.length === 6, 'Master Data Sector Count', `Contains exactly 6 major sectors (${MASTER_SECTOR_DATA.length})`);

// Test 10: Total subsectors count
const totalSubSectors = MASTER_SECTOR_DATA.reduce((acc, sec) => acc + sec.subSectors.length, 0);
assertTest(totalSubSectors === 16, 'Master Data Sub-Sector Count', `Contains all 16 sub-sectors (${totalSubSectors}) across 6 major sectors`);

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount}/${totalTests} TESTS PASSED CLEANLY.`);
console.log('====================================================');
