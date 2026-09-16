import { BusinessProject, ApprovalType, SmartChecklistItem, ApprovalStatus } from '../types';
import { INITIAL_APPROVAL_TYPES } from '../data/mockData';
import { MASTER_SECTOR_DATA } from '../data/sectorData';
import companyAndLlpRulesDataset from '../../data/rules/company_and_llp_rules.json';

export interface RegulatoryRuleDatasetItem {
  rule_id: string;
  service: string;
  entity_type: string;
  jurisdiction: { country: string; state: string };
  conditions: Array<{ field: string; operator: string; value: any }>;
  requirement_type: string;
  requirement_name: string;
  description: string;
  mandatory: boolean;
  accepted_alternatives: string[];
  forms: string[];
  authority: string;
  source_id: string;
  source_url: string;
  source_section: string;
  effective_from: string | null;
  effective_to: string | null;
  last_verified: string;
  status: string;
  notes: string;
}

// -----------------------------------------------------------------------------
// DYNAMIC RULES EVALUATION ENGINE CONNECTED TO JSON DATASET
// -----------------------------------------------------------------------------

export function evaluateCondition(
  cond: { field: string; operator: string; value: any }, 
  project: BusinessProject
): boolean {
  let fieldValue: any = undefined;

  switch (cond.field) {
    case 'entity_type':
      fieldValue = (project.entityType as string) === 'LLP' ? 'llp' : (project.entityType as string) === 'OPC' ? 'opc' : 'private_limited_company';
      break;
    case 'incorporation_channel':
      fieldValue = (project.entityType as string) === 'LLP' ? 'fillip' : 'spice_plus';
      break;
    case 'state':
      fieldValue = (project as any).state || 'Maharashtra';
      break;
    case 'premises_occupancy_type':
      fieldValue = project.landType?.toLowerCase().includes('owned') ? 'owned' : 'rented';
      break;
    case 'subscriber_citizenship':
      fieldValue = 'indian_resident'; // Default; modified dynamically in modal
      break;
    case 'employee_count':
      fieldValue = project.employeeCount || 10;
      break;
    case 'apply_gst_during_incorporation':
      fieldValue = true;
      break;
    case 'is_startup_applicant':
      fieldValue = (project as any).isDpiitRecognized ?? true;
      break;
    case 'annual_turnover_inr_cr':
      fieldValue = 2; // Default turnover
      break;
    case 'years_since_incorporation':
      fieldValue = 1;
      break;
    default:
      fieldValue = (project as any)[cond.field];
  }

  switch (cond.operator) {
    case 'equals':
      return fieldValue === cond.value;
    case 'not_equals':
      return fieldValue !== cond.value;
    case 'greater_than':
      return Number(fieldValue) > Number(cond.value);
    case 'less_than':
      return Number(fieldValue) < Number(cond.value);
    case 'in':
      return Array.isArray(cond.value) && cond.value.includes(fieldValue);
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null;
    default:
      return false;
  }
}

/**
 * Returns all regulatory rules from data/rules/company_and_llp_rules.json
 * that apply to the current business project.
 */
export function getApplicableRulesForProject(project: BusinessProject): RegulatoryRuleDatasetItem[] {
  return (companyAndLlpRulesDataset as RegulatoryRuleDatasetItem[]).filter(rule => {
    // Check jurisdiction match
    const projState = (project as any).state || 'Maharashtra';
    if (rule.jurisdiction.state !== 'all' && rule.jurisdiction.state !== projState) {
      return false;
    }

    // Evaluate all rule trigger conditions
    if (rule.conditions && rule.conditions.length > 0) {
      return rule.conditions.every(cond => evaluateCondition(cond, project));
    }

    return true;
  });
}

// Order weights for logical phase sequence
const APPROVAL_ORDER: Record<string, number> = {
  // Phase 1: Base Legal & Tax Registrations
  'appr-1': 10,     // Company Incorporation / MCA (SPICe+)
  'appr-1-llp': 10, // LLP Incorporation / MCA (FiLLiP)
  'appr-2': 20,     // GST Registration
  'appr-3': 30,     // Udyam MSME Registration
  'appr-11': 40,    // Professional Tax Registration (P-Tax)
  'appr-4': 50,     // Shops and Establishment / Gumasta

  // Phase 2: MIDC Land & Building Infrastructure
  'appr-5': 70,  // MIDC Building Plan Sanction

  // Phase 3: Pre-Establishment Environment & Safety Clearances
  'appr-6': 80,  // Fire NOC (Provisional Safety Clearance)
  'appr-8': 90,  // Pollution Consent to Establish (MPCB CTE)

  // Phase 4: Factory & Utilities Clearances
  'appr-7': 100, // Factory Licence (Form 1 - DISH)
  'appr-10': 110, // HT / LT Industrial Power Connection
  'appr-14': 120, // Industrial Water Connection
  'appr-15': 130, // Electrical Safety Inspectorate NOC

  // Phase 5: Operating Licences & Sector Clearances
  'appr-12': 140, // Food Licence (FSSAI)
  'appr-agmark': 150, // AGMARK Quality Grading
  'appr-hazardous-waste': 160, // Hazardous Waste Authorization
  'appr-peso': 170, // PESO Petroleum Safety
  'appr-ewaste': 180, // E-Waste Management Authorization
  'appr-trade': 190, // Municipal Trade Licence
  'appr-labour-epfo-esic': 200, // Labour EPFO / ESIC
  'appr-fssai-packaging': 210, // FSSAI Food Contact Packaging
  'appr-solvents-auth': 220, // Solvents Emission Auth
  'appr-lab-mpcb-auth': 230, // MPCB Lab Auth
  'appr-warehouse-hazardous': 240, // Hazardous Cargo Warehouse
  'appr-dairy-dept': 250, // Dairy Department Registration
  'appr-signage-permit': 260, // Commercial Signage Permit
  'appr-health-license': 270, // Municipal Health License
  'appr-kitchen-ventilation': 280, // Kitchen Exhaust Clearance
  'appr-liquor-license': 290, // Excise Liquor License
  'appr-stpi': 300 // STPI Export Registration
};

export function getPhaseNumber(id: string): number {
  if (id === 'appr-1' || id === 'appr-1-llp' || id === 'appr-2' || id === 'appr-3' || id === 'appr-11' || id === 'appr-4') {
    return 1;
  }
  if (id === 'appr-5') {
    return 2;
  }
  if (id === 'appr-6' || id === 'appr-8' || id === 'appr-13') {
    return 3;
  }
  if (id === 'appr-7' || id === 'appr-10' || id === 'appr-14' || id === 'appr-15' || id === 'appr-labour-epfo-esic') {
    return 4;
  }
  return 5;
}

export function generateSmartChecklist(
  project: BusinessProject, 
  currentApplications: { approvalId: string; status: ApprovalStatus; id: string; projectId?: string; approvalName?: string }[] = []
): SmartChecklistItem[] {
  const selectedApprovals: ApprovalType[] = [];

  const addAppr = (id: string) => {
    const appr = INITIAL_APPROVAL_TYPES.find(a => a.id === id);
    if (appr && !selectedApprovals.some(a => a.id === id)) {
      selectedApprovals.push(appr);
    }
  };

  // 1. Phase 1: Universal Base Legal & Tax Registrations
  if (project.entityType === 'LLP') {
    addAppr('appr-1-llp'); // LLP Incorporation (FiLLiP)
  } else {
    addAppr('appr-1');     // Company Incorporation (SPICe+)
  }
  addAppr('appr-2');  // GST Registration
  addAppr('appr-3');  // Udyam MSME Registration
  addAppr('appr-11'); // Professional Tax Registration

  // 2. Phase 2: Building & Infrastructure
  addAppr('appr-5');  // MIDC Building Plan Sanction

  // 3. Phase 3: Pre-Establishment Clearances
  addAppr('appr-6');  // Fire NOC (Provisional Safety Clearance)
  addAppr('appr-8');  // Pollution Consent to Establish (MPCB CTE)

  // 4. Phase 4: Factory Setup & Utilities
  addAppr('appr-7');   // Factory Licence (DISH Form 1)
  addAppr('appr-10');  // Industrial Power Connection (MSEDCL)
  addAppr('appr-14');  // Industrial Water Connection (MIDC Water)
  addAppr('appr-15');  // Electrical Inspectorate Safety NOC

  // 5. Phase 5: Ingest Sector & Sub-Sector Specific Operating Clearances
  const sectorConfig = MASTER_SECTOR_DATA.find(s => s.id === project.sector || s.name === project.sector);
  if (sectorConfig) {
    let subConfig = sectorConfig.subSectors.find(sub => sub.name === project.subSector || sub.id === project.subSector);
    if (!subConfig && sectorConfig.subSectors.length > 0) {
      subConfig = sectorConfig.subSectors[0];
    }
    if (subConfig) {
      subConfig.requiredApprovalIds.forEach(id => addAppr(id));
    }
  } else {
    addAppr('appr-12'); // Default to FSSAI
  }

  // Filter current applications TO THIS SPECIFIC PROJECT ONLY!
  const projectApps = currentApplications.filter(app => app.projectId === project.id);

  // Map initial items
  let rawChecklist: SmartChecklistItem[] = selectedApprovals.map(appr => {
    const appMatch = projectApps.find(app => 
      app.approvalId === appr.id ||
      (appr.id === 'appr-8' && app.approvalId === 'mpcb-cte') ||
      (appr.id === 'appr-5' && app.approvalId === 'midc-bldg') ||
      (appr.id === 'appr-6' && app.approvalId === 'fire-noc') ||
      (appr.id === 'appr-7' && app.approvalId === 'dish-factory') ||
      (appr.id === 'appr-10' && app.approvalId === 'msedcl-power') ||
      (appr.id === 'appr-12' && app.approvalId === 'fssai-licence') ||
      (app.approvalName && appr.name && app.approvalName.toLowerCase().trim() === appr.name.toLowerCase().trim())
    );
    const status: ApprovalStatus = appMatch ? appMatch.status : 'Not Started';
    const applicationId = appMatch ? appMatch.id : undefined;
    const phaseNumber = getPhaseNumber(appr.id);

    let prerequisiteBadge: string | undefined = undefined;
    if (appr.id === 'appr-6') {
      prerequisiteBadge = 'Prerequisite for Building Plan & Factory Licence';
    } else if (appr.id === 'appr-8') {
      prerequisiteBadge = 'Prerequisite for Factory Construction';
    } else if (appr.id === 'appr-14') {
      prerequisiteBadge = 'MIDC Water Quota Integration';
    } else if (appr.id === 'appr-15') {
      prerequisiteBadge = 'High Voltage Grid Safety Sanction';
    }

    return {
      ...appr,
      status,
      applicationId,
      canApply: true,
      phaseNumber,
      prerequisiteBadge
    };
  });

  // Calculate Phase Completion Flags for Interlocking Lock Rules
  const isPhase1Complete = rawChecklist.filter(i => i.phaseNumber === 1).every(i => i.status === 'Approved');
  const isPhase2Complete = isPhase1Complete && rawChecklist.filter(i => i.phaseNumber === 2).every(i => i.status === 'Approved');
  const isPhase3Complete = isPhase2Complete && rawChecklist.filter(i => i.phaseNumber === 3).every(i => i.status === 'Approved');
  const isPhase4Complete = isPhase3Complete && rawChecklist.filter(i => i.phaseNumber === 4).every(i => i.status === 'Approved');

  // Enforce Interlocking Phase Readiness Lock Rules
  const checklist = rawChecklist.map(item => {
    let canApply = true;
    let phaseLockReason: string | undefined = undefined;

    if (item.phaseNumber === 2 && !isPhase1Complete) {
      canApply = false;
      phaseLockReason = 'Phase 2 Locked: Complete and get approval for all Phase 1 Legal & Tax Registrations first.';
    } else if (item.phaseNumber === 3 && !isPhase2Complete) {
      canApply = false;
      phaseLockReason = 'Phase 3 Locked: Complete and get approval for Phase 2 Building & Infrastructure Plan first.';
    } else if (item.phaseNumber === 4 && !isPhase3Complete) {
      canApply = false;
      phaseLockReason = 'Phase 4 Locked: Complete and get approval for all Phase 3 Pre-Establishment Clearances first.';
    } else if (item.phaseNumber === 5 && !isPhase4Complete) {
      canApply = false;
      phaseLockReason = 'Phase 5 Locked: Complete and get approval for all Phase 4 Factory & Utilities Clearances first.';
    }

    return {
      ...item,
      canApply,
      phaseLockReason
    };
  });

  // Sort checklist items strictly in logical prerequisite sequence!
  checklist.sort((a, b) => {
    const orderA = APPROVAL_ORDER[a.id] ?? 500;
    const orderB = APPROVAL_ORDER[b.id] ?? 500;
    return orderA - orderB;
  });

  return checklist;
}

