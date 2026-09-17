export type Role = 
  | 'ENTREPRENEUR' 
  | 'OFFICER' 
  | 'ADMIN' 
  | 'OFFICER_MPCB' 
  | 'OFFICER_FIRE' 
  | 'OFFICER_DISH' 
  | 'OFFICER_MIDC' 
  | 'OFFICER_MSEDCL' 
  | 'OFFICER_FSSAI'
  | 'OFFICER_MCA';

export type Language = 'en' | 'mr' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string; // For Officer
  organization?: string; // For Entrepreneur
  avatarUrl?: string;
  phone?: string;
  designation?: string;
  district?: string;
  permissions?: string[];
}

export type Sector = 
  | 'Manufacturing'
  | 'Chemical'
  | 'Pharmaceutical'
  | 'Textile'
  | 'Packaging'
  | 'Services'
  | 'Food Processing'
  | 'Retail'
  | 'IT / IT-enabled Services';

export type ProjectType = 'New Setup' | 'Expansion' | 'Renewal';
export type EntityType = 'Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited';
export type ProjectStage = 'Planning' | 'Site Acquisition' | 'Construction' | 'Machinery Setup' | 'Ready to Operate';
export type LandType = 'MIDC Allotted' | 'Private Industrial' | 'Agricultural Conversion';

export interface BusinessProject {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  projectType: ProjectType;
  entityType: EntityType;
  sector: Sector;
  subSector?: string;
  investmentRange: string; // e.g. "₹1 Cr - ₹5 Cr"
  employeeCount: number;
  businessActivity: string;
  projectStage: ProjectStage;
  hasConstruction: boolean;
  hasHazardousMaterials: boolean;
  district: string; // Maharashtra District e.g. Pune, Thane
  cityTaluka: string;
  pincode: string;
  midcArea: string; // Industrial Area / MIDC
  landType: LandType;
  address: string;
  createdAt: string;
}

export type ApprovalStatus = 
  | 'Not Started'
  | 'Documents Needed'
  | 'Ready to Apply'
  | 'Submitted'
  | 'Under Review'
  | 'More Information Needed'
  | 'Inspection Pending'
  | 'Query Raised'
  | 'Inspection Scheduled'
  | 'Inspection Required'
  | 'Approved'
  | 'Rejected'
  | 'Delayed'
  | 'Blocked by Dependency'
  | 'Renewal Due';

export interface ParallelPermissionItem {
  id: string;
  projectId: string;
  approvalId: string;
  approvalName: string;
  department: string;
  category: 'Registration' | 'Environmental' | 'Safety' | 'Utility' | 'Clearance';
  assignedOfficer: string;
  officerEmail?: string;
  status: ApprovalStatus;
  pendingWith: string; // e.g. "Fire Officer", "Entrepreneur", "MPCB Officer"
  pendingAction?: string; // e.g. "Upload NABL Water Test Report"
  delayReason?: string; // e.g. "Inspection not completed"
  dateReceived?: string; // Submission date
  lastUpdatedDateTime?: string; // e.g. "12 Sept 2026, 11:30 AM"
  pendingDocs: string[];
  documentIds?: string[];
  queriesCount: number;
  openQueries?: { id: string; queryCategory: string; queryText: string; raisedDate: string; dueDate: string }[];
  inspectionDate?: string;
  slaDeadlineDate: string;
  slaDaysRemaining: number;
  dependencies: string[]; // Array of Prerequisite Approval IDs e.g. ['mpcb-cte', 'fire-noc']
  blockedBy?: string[]; // Human-readable names of unapproved prerequisites
  submittedDate: string;
  lastUpdatedDate: string;
  remarks?: string;
  activityHistory?: { id: string; timestamp: string; actor: string; department: string; action: string; notes?: string }[];
  certificateId?: string;
  certificateIssuedDate?: string;
  certificateExpiryDate?: string;
  certificateValidityTenure?: string;
  certificateQrToken?: string;
  certificateType?: 'PROVISIONAL' | 'FINAL';
  certificateConditions?: string;
  certificateOfficerSignature?: string;
}

export interface ParallelWorkflowSummary {
  projectId: string;
  totalRequired: number;
  approvedCount: number;
  underReviewCount: number;
  queryRaisedCount: number;
  inspectionRequiredCount: number;
  delayedCount: number;
  blockedCount: number;
  progressPercentage: number;
}

export interface ApprovalType {
  id: string;
  name: string;
  department: string;
  whyRequired: string;
  category: 'Registration' | 'Environmental' | 'Safety' | 'Utility' | 'Clearance';
  requiredDocs: string[];
  estimatedTimelineDays: number;
  estimatedFee: string;
  dependencies: string[]; // Prerequisite Approval IDs
  riskImpact: number; // 0-100 weight
  isNoc?: boolean;
  nocType?: NocType;
  prerequisiteFor?: string;
}

export interface SmartChecklistItem extends ApprovalType {
  status: ApprovalStatus;
  applicationId?: string;
  canApply: boolean; // Computed based on dependencies
  prerequisiteBadge?: string;
  phaseNumber?: number;
  phaseLockReason?: string;
}

export type DocumentValidationStatus = 'Valid' | 'Expired' | 'Name Mismatch' | 'Blurry / Unreadable' | 'Pending Review' | 'Missing';
export type VerificationFinalStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'INVALID' | 'INCOMPLETE';
export type DocumentQualityGrade = 'GOOD' | 'FAIR' | 'POOR';
export type MatchResult = 'MATCH' | 'POSSIBLE_MATCH' | 'MISMATCH' | 'NOT_ENOUGH_DATA';
export type DetectedDocumentType = 
  | 'PAN'
  | 'AADHAAR'
  | 'IDENTITY_PROOF'
  | 'GST'
  | 'UTILITY_BILL'
  | 'LEASE_AGREEMENT'
  | 'OWNER_NOC'
  | 'DSC'
  | 'FIRE_NOC'
  | 'MPCB'
  | 'DISH'
  | 'OTHER'
  | 'UNKNOWN';

export interface FieldExtractionResult {
  value: string | null;
  confidence: number;
  displayValue?: string;
}

export interface RuleCheckResult {
  rule: string;
  status: 'PASS' | 'FAIL' | 'REVIEW';
  message: string;
}

export interface CrossDocumentCheckResult {
  field: string;
  sourceDoc: string;
  targetDoc: string;
  status: MatchResult;
  message: string;
}

export interface StructuredOcrAnalysis {
  documentType: DetectedDocumentType;
  expectedDocumentType: string;
  documentQuality: DocumentQualityGrade;
  ocrStatus: 'COMPLETED' | 'FAILED' | 'PARTIAL';
  confidence: {
    overall: number;       // Actual Tesseract OCR confidence
    ocr: number;
    documentType: number;  // Document classification confidence
  };
  fields: {
    name?: FieldExtractionResult;
    documentNumber?: FieldExtractionResult;
    dateOfBirth?: FieldExtractionResult;
    issueDate?: FieldExtractionResult;
    expiryDate?: FieldExtractionResult;
    address?: FieldExtractionResult;
    issuingAuthority?: FieldExtractionResult;
  };
  validationRules: RuleCheckResult[];
  crossDocumentChecks: CrossDocumentCheckResult[];
  risk: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    score: number; // PermitFlow Nexus Internal Risk Score
    reasons: string[];
  };
  status: VerificationFinalStatus;
  legacyStatus: DocumentValidationStatus;
  extractedRawText: string;
  issues: string[];
  recommendations: string[];
}

export interface DocumentItem {
  id: string;
  projectId: string;
  docName: string;
  category: string;
  fileUrl?: string;
  fileSize?: string;
  uploadDate?: string;
  expiryDate?: string;
  status: DocumentValidationStatus;
  structuredAnalysis?: StructuredOcrAnalysis;
  aiValidationResult?: {
    confidence: number;
    issues: string[];
    recommendations: string[];
    extractedName?: string;
    extractedRegNo?: string;
    extractedExpiry?: string;
    structuredAnalysis?: StructuredOcrAnalysis;
  };
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  role: Role;
}

export interface DepartmentQuery {
  id: string;
  applicationId: string;
  officerName: string;
  department: string;
  queryCategory: string;
  queryText: string;
  raisedDate: string;
  dueDate: string;
  status: 'OPEN' | 'RESPONDED' | 'RESOLVED';
  responseText?: string;
  responseDocName?: string;
  responseDocUrl?: string;
  responseDate?: string;
}

export interface Application {
  id: string;
  appId: string; // e.g. PFN-2026-MPCB-091
  projectId: string;
  businessName: string;
  approvalId: string;
  approvalName: string;
  department: string;
  submissionDate: string;
  slaDeadlineDate: string;
  slaDaysRemaining: number;
  status: ApprovalStatus;
  officerAssigned?: string;
  timeline: TimelineEvent[];
  queries: DepartmentQuery[];
  documentIds: string[];
  riskScore: number;
  remarks?: string;
  certificateId?: string;
  certificateIssuedDate?: string;
  certificateExpiryDate?: string;
  certificateValidityTenure?: string;
  certificateQrToken?: string;
  certificateType?: 'PROVISIONAL' | 'FINAL';
  certificateConditions?: string;
  certificateOfficerSignature?: string;
}

export interface InspectionItem {
  id: string;
  applicationId: string;
  approvalName: string;
  businessName: string;
  department: string;
  inspectionType: 'Pre-Setup Site Audit' | 'Fire Safety Compliance' | 'Pollution Emission Audit' | 'DISH Factory Safety Check' | 'FSSAI Hygiene Inspection';
  scheduledDate: string; // YYYY-MM-DD HH:MM
  location: string;
  officerDetails: {
    name: string;
    designation: string;
    contact: string;
  };
  requiredDocs: string[];
  status: 'SCHEDULED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';
  outcome?: 'Satisfactory' | 'Issues Found' | 'Follow-up Required';
  reportNotes?: string;
  isJointInspection: boolean;
  participatingDepts?: string[];
}

export interface ComplianceTask {
  id: string;
  projectId: string;
  businessName: string;
  title: string;
  department: string;
  approvalName: string;
  dueDate: string; // YYYY-MM-DD
  daysLeft: number;
  status: 'COMPLETED' | 'DUE_SOON' | 'UPCOMING' | 'OVERDUE';
  renewalPeriodMonths: number;
  renewalFee: string;
  reminderSentDates: string[];
  actionRequired: string;
}

export interface IncentiveScheme {
  id: string;
  schemeName: string;
  name?: string;
  department: string;
  shortDesc: string;
  description?: string;
  eligibilityStatus: 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'Eligible' | 'Possibly Eligible' | 'Not Eligible';
  estimatedBenefit: string;
  benefit?: string;
  eligibilityReason: string;
  nextAction: string;
  requiredNextStep?: string;
  tags: string[];
  officialUrl: string;
  officialApplyUrl?: string;
  officialInfoUrl?: string;
}

export interface RiskScoreDetails {
  overallScore: number; // 0 - 100
  riskLabel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  factors: {
    sectorRisk: { score: number; max: 30; explanation: string };
    locationRisk: { score: number; max: 20; explanation: string };
    complianceHistoryRisk: { score: number; max: 25; explanation: string };
    documentQualityRisk: { score: number; max: 25; explanation: string };
  };
  improvements: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  applicationId?: string;
  previousStatus?: string;
  newStatus?: string;
  ipAddress: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  projectId?: string;
  userId?: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  read: boolean;
  channels: ('IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP')[];
}

export interface ApprovalRule {
  id: string;
  sector: Sector | 'ALL';
  projectType: ProjectType | 'ALL';
  locationCategory: string; // e.g. MIDC, Non-MIDC
  hasHazardous: boolean | null;
  hasConstruction: boolean | null;
  minEmployees: number;
  approvalId: string;
  department: string;
  fee: string;
  expectedTimelineDays: number;
  dependencies: string[];
  riskCategory: 'High' | 'Medium' | 'Low';
}

// ----------------------------------------------------
// NO-OBJECTION CERTIFICATE (NOC) & JOINT INSPECTION TYPES
// ----------------------------------------------------

export type NocType = 
  | 'FIRE_SAFETY'
  | 'MPCB_CTE'
  | 'WATER_SUPPLY'
  | 'ELECTRICAL_SAFETY';

export type NocStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUERY_RAISED'
  | 'INSPECTION_SCHEDULED'
  | 'PROVISIONAL_ISSUED'
  | 'FINAL_GRANTED'
  | 'REJECTED';

export interface NocTechnicalParameters {
  builtUpAreaSqM: number;
  plotAreaSqM: number;
  fireMitigation?: {
    sprinklersCount: number;
    hydrantsCount: number;
    smokeAlarmsCount: number;
    hasFirePumps: boolean;
  };
  waterRequirementKlpd?: number;
  effluentGenerationKlpd?: number;
  electricalLoadKw?: number;
  voltageLevel?: string;
  hazardousSubstanceDetails?: string;
}

export interface NocDocument {
  docId: string;
  docName: string;
  category: string;
  fileUrl?: string;
  uploadDate: string;
  aiValidationStatus: 'VALIDATED' | 'WARNING' | 'PENDING' | 'ANALYZING...';
  aiNotes: string;
}

export interface NocQuery {
  id: string;
  raisedBy: string;
  date: string;
  question: string;
  response?: string;
  responseDocName?: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface NocApplication {
  id: string;
  projectId: string;
  businessName: string;
  nocType: NocType;
  nocName: string;
  department: string;
  appliedDate: string;
  status: NocStatus;
  urgency: 'NORMAL' | 'HIGH' | 'URGENT';
  slaDaysLeft: number;
  technicalParameters: NocTechnicalParameters;
  documents: NocDocument[];
  queries: NocQuery[];
  provisionalCertUrl?: string;
  finalCertUrl?: string;
  qrCodeData?: string;
  issuedDate?: string;
  certificateId?: string;
}

export interface JointInspectionRubricItem {
  criterion: string;
  compliant: boolean | null;
  notes: string;
}

export interface JointInspection {
  id: string;
  nocApplicationId: string;
  projectId: string;
  businessName: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // e.g. 10:30 AM
  attendingDepartments: string[];
  officerNames: string[];
  inspectionLocation: string;
  rubricChecklist: JointInspectionRubricItem[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RECTIFICATION_REQUIRED' | 'CANCELLED';
  outcomeSummary?: string;
  remarks?: string;
}

