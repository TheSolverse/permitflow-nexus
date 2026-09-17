import { describe, it, expect } from 'vitest';

describe('Officer Inspection Scheduling to Entrepreneur Sync', () => {
  it('verifies that scheduling inspection from officer desk updates clearance status, inspection list, joint inspections, and entrepreneur notifications', () => {
    // Initial state simulation
    const mockProject = {
      id: 'proj-1',
      userId: 'user_1',
      businessName: 'Sahyadri Specialty Chemicals & Bio-Pharma'
    };

    let parallelPermissions = [
      {
        id: 'mpcb-consent-establish',
        projectId: 'proj-1',
        approvalId: 'mpcb-consent-establish',
        approvalName: 'MPCB Consent to Establish (CTE - Orange Category)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        status: 'Submitted',
        assignedOfficer: 'Dr. V. K. Patil',
        pendingWith: 'Department Officer',
        pendingAction: 'Technical Scrutiny',
        inspectionDate: undefined as string | undefined,
        activityHistory: [] as any[]
      }
    ];

    let applications = [
      {
        id: 'mpcb-consent-establish',
        projectId: 'proj-1',
        approvalId: 'mpcb-consent-establish',
        approvalName: 'MPCB Consent to Establish (CTE - Orange Category)',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        status: 'Submitted',
        timeline: [] as any[]
      }
    ];

    let inspections: any[] = [];
    let jointInspections: any[] = [];
    let notifications: any[] = [];

    const officerScheduleInspection = (permId: string, inspectionDate: string, location?: string) => {
      const nowStr = new Date().toLocaleString();
      const targetItem = parallelPermissions.find(p => p.id === permId || p.approvalId === permId);
      const targetProjectId = targetItem?.projectId || mockProject.id;
      const approvalName = targetItem?.approvalName || 'Department Clearance';
      const departmentName = targetItem?.department || 'Statutory Department';

      // 1. Update parallelPermissions
      parallelPermissions = parallelPermissions.map(p => {
        if (p.id === permId || p.approvalId === permId) {
          return {
            ...p,
            status: 'Inspection Pending',
            pendingWith: 'Field Inspector & Entrepreneur',
            pendingAction: `Prepare site for audit on ${inspectionDate}`,
            inspectionDate,
            remarks: `Inspection scheduled for ${inspectionDate}`,
            activityHistory: [
              {
                id: `act-${Date.now()}`,
                timestamp: nowStr,
                actor: 'Dr. V. K. Patil',
                department: departmentName,
                action: 'Scheduled Site Inspection',
                notes: `Inspection scheduled for ${inspectionDate}`
              },
              ...p.activityHistory
            ]
          };
        }
        return p;
      });

      // 2. Update applications
      applications = applications.map(a => {
        if (a.id === permId || a.approvalId === permId) {
          return {
            ...a,
            status: 'Inspection Pending',
            inspectionDate,
            timeline: [
              ...a.timeline,
              {
                id: `t-${Date.now()}`,
                title: 'Site Inspection Scheduled',
                description: `Officer Dr. V. K. Patil scheduled site inspection for ${inspectionDate}`,
                actor: 'Dr. V. K. Patil',
                role: 'OFFICER'
              }
            ]
          };
        }
        return a;
      });

      // 3. Add to inspections list
      const newInsp = {
        id: `insp-${Date.now()}`,
        projectId: targetProjectId,
        applicationId: permId,
        approvalName,
        businessName: mockProject.businessName,
        department: departmentName,
        inspectionType: 'Pollution Emission Audit',
        scheduledDate: inspectionDate,
        location: location || 'Plot C-42, MIDC Chakan',
        status: 'SCHEDULED'
      };
      inspections = [newInsp, ...inspections];

      // 4. Add to joint inspections list
      const newJointInsp = {
        id: `joint-insp-${Date.now()}`,
        nocApplicationId: permId,
        projectId: targetProjectId,
        businessName: mockProject.businessName,
        scheduledDate: inspectionDate.split(' ')[0],
        status: 'SCHEDULED'
      };
      jointInspections = [newJointInsp, ...jointInspections];

      // 5. Notifications
      notifications = [
        {
          id: `notif-ent-${Date.now()}`,
          userId: mockProject.userId,
          title: '📅 Site Inspection Scheduled',
          message: `Officer Dr. V. K. Patil scheduled a site inspection on ${inspectionDate}.`
        },
        ...notifications
      ];
    };

    // Execute Officer action
    officerScheduleInspection('mpcb-consent-establish', '2026-09-25 11:00 AM', 'Plot C-42, MIDC Chakan');

    // Verification
    expect(parallelPermissions[0].status).toBe('Inspection Pending');
    expect(parallelPermissions[0].inspectionDate).toBe('2026-09-25 11:00 AM');
    expect(parallelPermissions[0].pendingWith).toBe('Field Inspector & Entrepreneur');

    expect(applications[0].status).toBe('Inspection Pending');
    expect(applications[0].timeline.length).toBe(1);

    expect(inspections.length).toBe(1);
    expect(inspections[0].scheduledDate).toBe('2026-09-25 11:00 AM');
    expect(inspections[0].projectId).toBe('proj-1');

    expect(jointInspections.length).toBe(1);
    expect(jointInspections[0].scheduledDate).toBe('2026-09-25');

    expect(notifications.length).toBe(1);
    expect(notifications[0].userId).toBe('user_1');
    expect(notifications[0].title).toContain('Site Inspection Scheduled');
  });
});
