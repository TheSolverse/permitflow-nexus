import { BusinessProject, ApprovalType, SmartChecklistItem, ApprovalStatus } from '../types';
import { INITIAL_APPROVAL_TYPES } from '../data/mockData';

export function generateSmartChecklist(project: BusinessProject, currentApplications: { approvalId: string; status: ApprovalStatus; id: string }[] = []): SmartChecklistItem[] {
  const selectedApprovals: ApprovalType[] = [];

  // Universal base approvals
  const addAppr = (id: string) => {
    const appr = INITIAL_APPROVAL_TYPES.find(a => a.id === id);
    if (appr && !selectedApprovals.some(a => a.id === id)) {
      selectedApprovals.push(appr);
    }
  };

  addAppr('appr-1'); // Company Registration
  addAppr('appr-2'); // GST
  addAppr('appr-3'); // Udyam MSME
  addAppr('appr-11'); // Professional Tax

  // Construction required
  if (project.hasConstruction || project.projectStage === 'Construction' || project.projectStage === 'Planning' || project.projectStage === 'Site Acquisition') {
    addAppr('appr-5'); // Building Plan
    addAppr('appr-6'); // Fire NOC
  }

  // Employee count >= 10
  if (project.employeeCount >= 10) {
    addAppr('appr-7'); // Factory Licence DISH
    addAppr('appr-4'); // Shops & Est / Gumasta
  }

  // Sector based rules
  const industrialSectors = ['Manufacturing', 'Food Processing', 'Textile', 'Pharmaceutical', 'Chemical', 'Renewable Energy'];
  if (industrialSectors.includes(project.sector)) {
    addAppr('appr-8'); // MPCB CTE
    addAppr('appr-9'); // MPCB CTO
    addAppr('appr-10'); // Electricity Connection
  }

  if (project.sector === 'Food Processing') {
    addAppr('appr-12'); // FSSAI
  }

  if (project.sector === 'Chemical' || project.sector === 'Pharmaceutical' || project.hasHazardousMaterials) {
    addAppr('appr-13'); // Environmental Clearance EC
  }

  // Build checklist items with status & dependency readiness
  const checklist: SmartChecklistItem[] = selectedApprovals.map(appr => {
    const appMatch = currentApplications.find(app => app.approvalId === appr.id);
    let status: ApprovalStatus = appMatch ? appMatch.status : 'Not Started';
    const applicationId = appMatch ? appMatch.id : undefined;

    // Default status fallback if new project
    if (!appMatch) {
      if (appr.id === 'appr-1' || appr.id === 'appr-2') {
        status = 'Approved';
      } else if (appr.id === 'appr-5') {
        status = 'Approved';
      } else if (appr.id === 'appr-6') {
        status = 'Under Review';
      } else if (appr.id === 'appr-8') {
        status = 'Query Raised';
      } else if (appr.id === 'appr-7') {
        status = 'Inspection Scheduled';
      } else if (appr.id === 'appr-12') {
        status = 'Documents Needed';
      } else {
        status = 'Not Started';
      }
    }

    // Determine dependency readiness
    let canApply = true;
    if (appr.dependencies && appr.dependencies.length > 0) {
      // Check if all prerequisite approvals are approved
      for (const depId of appr.dependencies) {
        const depMatch = currentApplications.find(app => app.approvalId === depId);
        // If dependency is appr-1, appr-2, appr-5, we consider them approved in demo unless explicitly failing
        if (depId !== 'appr-1' && depId !== 'appr-2' && depId !== 'appr-5') {
          if (!depMatch || depMatch.status !== 'Approved') {
            canApply = false;
            break;
          }
        }
      }
    }

    return {
      ...appr,
      status,
      applicationId,
      canApply
    };
  });

  return checklist;
}
