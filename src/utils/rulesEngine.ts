import { BusinessProject, ApprovalType, SmartChecklistItem, ApprovalStatus } from '../types';
import { INITIAL_APPROVAL_TYPES } from '../data/mockData';
import { MASTER_SECTOR_DATA } from '../data/sectorData';

export function generateSmartChecklist(project: BusinessProject, currentApplications: { approvalId: string; status: ApprovalStatus; id: string }[] = []): SmartChecklistItem[] {
  const selectedApprovals: ApprovalType[] = [];

  const addAppr = (id: string) => {
    const appr = INITIAL_APPROVAL_TYPES.find(a => a.id === id);
    if (appr && !selectedApprovals.some(a => a.id === id)) {
      selectedApprovals.push(appr);
    }
  };

  // Universal base business setup approvals
  addAppr('appr-1'); // Company Registration (MCA)
  addAppr('appr-2'); // GST Registration
  addAppr('appr-3'); // Udyam MSME Registration
  addAppr('appr-11'); // Professional Tax Registration

  // 1. Ingest Focused Sector & Sub-Sector Specific Approvals
  const sectorConfig = MASTER_SECTOR_DATA.find(s => s.id === project.sector || s.name === project.sector);
  if (sectorConfig) {
    let subConfig = sectorConfig.subSectors.find(sub => sub.name === project.subSector || sub.id === project.subSector);
    // Fallback to first sub-sector if not specified
    if (!subConfig && sectorConfig.subSectors.length > 0) {
      subConfig = sectorConfig.subSectors[0];
    }
    if (subConfig) {
      subConfig.requiredApprovalIds.forEach(id => addAppr(id));
    }
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
      } else if (appr.id === 'appr-14') {
        status = 'Approved';
      } else if (appr.id === 'appr-15') {
        status = 'Inspection Scheduled';
      } else {
        status = 'Not Started';
      }
    }

    // Determine dependency readiness
    let canApply = true;
    if (appr.dependencies && appr.dependencies.length > 0) {
      for (const depId of appr.dependencies) {
        const depMatch = currentApplications.find(app => app.approvalId === depId);
        if (depId !== 'appr-1' && depId !== 'appr-2' && depId !== 'appr-5') {
          if (!depMatch || depMatch.status !== 'Approved') {
            canApply = false;
            break;
          }
        }
      }
    }

    // Compute prerequisite badge text
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
      canApply,
      prerequisiteBadge
    };
  });

  return checklist;
}

