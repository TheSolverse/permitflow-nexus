import { BusinessProject, DocumentItem, ComplianceTask, RiskScoreDetails } from '../types';

export function calculateRiskScore(
  project?: Partial<BusinessProject> | null,
  documents: DocumentItem[] = [],
  complianceTasks: ComplianceTask[] = []
): RiskScoreDetails {
  const safeProject = project || {};
  const safeDocs = Array.isArray(documents) ? documents : [];
  const safeTasks = Array.isArray(complianceTasks) ? complianceTasks : [];

  // 1. Sector Risk (30% weight, max 30)
  let sectorScore = 10;
  let sectorExplanation = 'Low risk service or light manufacturing sector.';
  
  const sectorStr = (safeProject.sector || 'Manufacturing') as string;
  if (sectorStr === 'Chemical') {
    sectorScore = 28;
    sectorExplanation = 'High chemical hazardous waste & environmental impact potential.';
  } else if (sectorStr === 'Pharmaceutical') {
    sectorScore = 24;
    sectorExplanation = 'Medium-High bio-chemical safety and bio-effluent monitoring requirement.';
  } else if (sectorStr === 'Food Processing' || sectorStr === 'Food Processing & Agro') {
    sectorScore = 18;
    sectorExplanation = 'Moderate food hygiene, water discharge & perishability factors.';
  } else if (sectorStr === 'Textile') {
    sectorScore = 20;
    sectorExplanation = 'Moderate dye effluent and water consumption risk.';
  }

  if (safeProject.hasHazardousMaterials) {
    sectorScore = Math.min(30, sectorScore + 5);
    sectorExplanation += ' (+5 for hazardous material handling)';
  }

  // 2. Location Risk (20% weight, max 20)
  let locationScore = 6;
  let locationExplanation = 'Standard industrial zone with established infrastructure.';

  const landStatus = (safeProject.landType || '') as string;
  const midcArea = safeProject.midcArea || '';

  if (landStatus === 'Agricultural Conversion') {
    locationScore = 18;
    locationExplanation = 'Non-industrial land conversion requires additional revenue & environmental NOCs.';
  } else if (midcArea.includes('Tarapur') || midcArea.includes('Waluj')) {
    locationScore = 12;
    locationExplanation = 'High-density industrial zone subject to strict MPCB environmental audits.';
  } else if (midcArea.includes('Chakan')) {
    locationScore = 8;
    locationExplanation = 'Developed MIDC industrial cluster with streamlined infrastructure.';
  }

  // 3. Compliance History Risk (25% weight, max 25)
  let complianceScore = 5;
  let complianceExplanation = 'Good compliance history with minimal delayed filings.';

  const projectTasks = safeProject.id 
    ? safeTasks.filter(t => t && t.projectId === safeProject.id)
    : safeTasks;
  const overdueCount = projectTasks.filter(t => t && t.status === 'OVERDUE').length;
  const dueSoonCount = projectTasks.filter(t => t && t.status === 'DUE_SOON').length;

  if (overdueCount > 0) {
    complianceScore += overdueCount * 8;
    complianceExplanation = `${overdueCount} compliance task(s) currently overdue. Requires immediate action.`;
  }
  if (dueSoonCount > 0) {
    complianceScore += dueSoonCount * 3;
    complianceExplanation += ` (${dueSoonCount} renewals due soon).`;
  }
  complianceScore = Math.min(25, complianceScore);

  // 4. Document Quality Risk (25% weight, max 25)
  let docScore = 4;
  let docExplanation = 'Most uploaded documents are valid and verified.';

  const projectDocs = safeProject.id
    ? safeDocs.filter(d => d && d.projectId === safeProject.id)
    : safeDocs;
  const missingDocs = projectDocs.filter(d => d && d.status === 'Missing').length;
  const invalidDocs = projectDocs.filter(d => d && (d.status === 'Expired' || d.status === 'Name Mismatch' || d.status === 'Blurry / Unreadable')).length;

  if (missingDocs > 0) {
    docScore += missingDocs * 6;
    docExplanation = `${missingDocs} required document(s) missing from Document Centre.`;
  }
  if (invalidDocs > 0) {
    docScore += invalidDocs * 5;
    docExplanation += ` ${invalidDocs} document(s) flagged with AI validation errors (expiry, name mismatch, or blur).`;
  }
  docScore = Math.min(25, docScore);

  const overallScore = Math.round(sectorScore + locationScore + complianceScore + docScore);

  let riskLabel: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Low Risk';
  if (overallScore > 60) {
    riskLabel = 'High Risk';
  } else if (overallScore > 30) {
    riskLabel = 'Medium Risk';
  }

  // Actionable improvements
  const improvements: string[] = [];
  if (missingDocs > 0) {
    improvements.push(`Upload missing documents (${missingDocs} pending) to reduce document quality risk.`);
  }
  if (invalidDocs > 0) {
    improvements.push('Fix flagged document issues (resolve name mismatch or re-scan low-res uploads).');
  }
  if (overdueCount > 0) {
    improvements.push('Complete overdue compliance tasks immediately (e.g. Annual Fire Safety Audit).');
  }
  if (safeProject.hasHazardousMaterials) {
    improvements.push('Obtain certified Hazardous Waste Management Authorization from MPCB to lower sector risk.');
  }
  if (improvements.length === 0) {
    improvements.push('Your project profile has optimal compliance health! Maintain timely renewals.');
  }

  return {
    overallScore,
    riskLabel,
    factors: {
      sectorRisk: { score: sectorScore, max: 30, explanation: sectorExplanation },
      locationRisk: { score: locationScore, max: 20, explanation: locationExplanation },
      complianceHistoryRisk: { score: Math.round(complianceScore), max: 25, explanation: complianceExplanation },
      documentQualityRisk: { score: Math.round(docScore), max: 25, explanation: docExplanation }
    },
    improvements
  };
}
