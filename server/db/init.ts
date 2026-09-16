import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkDbConnection } from './pool';
import { 
  INITIAL_USERS, 
  INITIAL_PROJECTS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS, 
  INITIAL_COMPLIANCE_TASKS, 
  INITIAL_INCENTIVE_SCHEMES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_RULES,
  INITIAL_NOC_APPLICATIONS,
  INITIAL_JOINT_INSPECTIONS
} from '../data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  console.log('[PostgreSQL] Initializing Database...');
  
  const connected = await checkDbConnection();
  if (!connected) {
    console.log('[Database] Operating on Supabase Cloud Database (all project/application data served live).');
    return false;
  }

  try {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[PostgreSQL] Executing schema.sql DDL...');
    await pool.query(schemaSql);

    // Ensure documents table has nullable file_url/file_size, TEXT type for base64, and users has password_hash
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
      ALTER TABLE documents ALTER COLUMN file_url TYPE TEXT;
      ALTER TABLE documents ALTER COLUMN file_url DROP NOT NULL;
      ALTER TABLE documents ALTER COLUMN file_size DROP NOT NULL;
      ALTER TABLE documents ALTER COLUMN upload_date DROP NOT NULL;
    `).catch(() => {});

    console.log('[PostgreSQL] Tables verified and created.');

    // Check if users exist; if not, seed data
    const userCheck = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      console.log('[PostgreSQL] Seeding initial dataset...');

      // 1. Seed Users
      for (const u of INITIAL_USERS) {
        await pool.query(
          'INSERT INTO users (id, name, email, role, department, designation, district, permissions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
          [u.id, u.name, u.email, u.role, u.department || null, u.designation || null, u.district || null, JSON.stringify(u.permissions || [])]
        );
      }

      // 2. Seed Projects
      for (const p of INITIAL_PROJECTS) {
        await pool.query(
          `INSERT INTO business_projects (
            id, user_id, business_name, sector, sub_sector, investment_range, 
            estimated_investment_cr, proposed_employees, land_status, midc_area, 
            district, taluka, power_requirement_kw, water_requirement_lpd, 
            hazardous_materials, project_stage, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) ON CONFLICT (id) DO NOTHING`,
          [
            p.id, p.userId, p.businessName, p.sector, p.subSector || null, p.investmentRange,
            p.estimatedInvestmentCr || null, p.proposedEmployees || null, p.landStatus || null,
            p.midcArea || null, p.district || null, p.taluka || null, p.powerRequirementKW || null,
            p.waterRequirementLPD || null, p.hazardousMaterials || false, p.projectStage, p.createdAt
          ]
        );
      }

      // 3. Seed Applications
      for (const a of INITIAL_APPLICATIONS) {
        await pool.query(
          `INSERT INTO applications (
            id, app_id, project_id, business_name, approval_id, approval_name,
            department, submission_date, sla_deadline_date, sla_days_remaining,
            status, officer_assigned, risk_score, remarks, timeline, queries, document_ids
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) ON CONFLICT (id) DO NOTHING`,
          [
            a.id, a.appId, a.projectId, a.businessName, a.approvalId, a.approvalName,
            a.department, a.submissionDate, a.slaDeadlineDate, a.slaDaysRemaining,
            a.status, a.officerAssigned || null, a.riskScore || 20, a.remarks || null,
            JSON.stringify(a.timeline || []), JSON.stringify(a.queries || []), JSON.stringify(a.documentIds || [])
          ]
        );
      }

      // 4. Seed Documents
      for (const d of INITIAL_DOCUMENTS) {
        await pool.query(
          `INSERT INTO documents (
            id, project_id, doc_name, category, file_url, file_size, upload_date, status, expiry_date, ai_validation_result
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
          [
            d.id, d.projectId, d.docName, d.category, d.fileUrl || null, d.fileSize || null,
            d.uploadDate || null, d.status, d.expiryDate || null, JSON.stringify(d.aiValidationResult || {})
          ]
        );
      }

      // 5. Seed Compliance Tasks
      for (const c of INITIAL_COMPLIANCE_TASKS) {
        await pool.query(
          `INSERT INTO compliance_tasks (
            id, project_id, title, department, statutory_act, due_date, days_left, status, renewal_fee, renewal_period_months, action_required
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
          [
            c.id, c.projectId, c.title, c.department, c.statutoryAct || null,
            c.dueDate, c.daysLeft, c.status, c.renewalFee || null, c.renewalPeriodMonths || 12, c.actionRequired || null
          ]
        );
      }

      // 6. Seed NOC Applications
      for (const n of INITIAL_NOC_APPLICATIONS) {
        await pool.query(
          `INSERT INTO noc_applications (
            id, project_id, business_name, noc_type, noc_name, department, applied_date, status, urgency, sla_days_left, technical_parameters, documents, queries, provisional_cert_url, final_cert_url, qr_code_data, issued_date, certificate_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) ON CONFLICT (id) DO NOTHING`,
          [
            n.id, n.projectId, n.businessName, n.nocType, n.nocName, n.department,
            n.appliedDate, n.status, n.urgency, n.slaDaysLeft,
            JSON.stringify(n.technicalParameters || {}), JSON.stringify(n.documents || []),
            JSON.stringify(n.queries || []), n.provisionalCertUrl || null, n.finalCertUrl || null,
            n.qrCodeData || null, n.issuedDate || null, n.certificateId || null
          ]
        );
      }

      // 7. Seed Joint Inspections
      for (const j of INITIAL_JOINT_INSPECTIONS) {
        await pool.query(
          `INSERT INTO joint_inspections (
            id, noc_application_id, project_id, business_name, scheduled_date, scheduled_time, attending_departments, officer_names, inspection_location, rubric_checklist, status, outcome_summary
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
          [
            j.id, j.nocApplicationId, j.projectId, j.businessName, j.scheduledDate,
            j.scheduledTime, JSON.stringify(j.attendingDepartments || []),
            JSON.stringify(j.officerNames || []), j.inspectionLocation,
            JSON.stringify(j.rubricChecklist || []), j.status, j.outcomeSummary || null
          ]
        );
      }

      // 8. Seed Incentive Schemes
      for (const s of INITIAL_INCENTIVE_SCHEMES) {
        await pool.query(
          `INSERT INTO incentive_schemes (
            id, scheme_name, category, department, eligible_sectors, eligible_taluka_categories, min_investment_cr, max_benefit, description, application_status, deadline, official_url, official_apply_url, official_info_url
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT (id) DO NOTHING`,
          [
            s.id, s.schemeName, s.category, s.department,
            JSON.stringify(s.eligibleSectors || []), JSON.stringify(s.eligibleTalukaCategories || []),
            s.minInvestmentCr || 0, s.maxBenefit, s.description || null,
            s.applicationStatus || 'Eligible', s.deadline || null,
            s.officialUrl || null, s.officialApplyUrl || null, s.officialInfoUrl || null
          ]
        );
      }

      // 9. Seed Audit Logs
      for (const al of INITIAL_AUDIT_LOGS) {
        await pool.query(
          `INSERT INTO audit_logs (
            id, timestamp, "user", role, action, application_id, previous_status, new_status, ip_address, details
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
          [
            al.id, al.timestamp, al.user, al.role, al.action,
            al.applicationId || null, al.previousStatus || null, al.newStatus || null,
            al.ipAddress, al.details || null
          ]
        );
      }

      // 10. Seed Notifications
      for (const notif of INITIAL_NOTIFICATIONS) {
        await pool.query(
          `INSERT INTO notifications (
            id, user_id, title, message, timestamp, type, is_read, link
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
          [
            notif.id, 'usr-ent-1', notif.title, notif.message, notif.timestamp,
            notif.type, notif.read || false, notif.link || null
          ]
        );
      }

      // 11. Seed Approval Rules
      for (const r of INITIAL_RULES) {
        await pool.query(
          `INSERT INTO approval_rules (
            id, sector, scale, location_zone, required_approvals, conditional_approvals
          ) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [
            r.id, r.sector, r.scale, r.locationZone,
            JSON.stringify(r.requiredApprovals || []), JSON.stringify(r.conditionalApprovals || [])
          ]
        );
      }

      console.log('[PostgreSQL] Seed data populated successfully.');
    } else {
      console.log('[PostgreSQL] Existing data found in database. Skipping seed.');
    }
    return true;
  } catch (err: any) {
    console.error('[PostgreSQL] Error during database initialization:', err);
    return false;
  }
}

// Allow standalone execution: npx tsx server/db/init.ts
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/db/init.ts')) {
  initDatabase().then(() => {
    process.exit(0);
  });
}
