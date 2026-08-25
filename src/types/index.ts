export type Role = 'ENTREPRENEUR' | 'OFFICER' | 'ADMIN';

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
}

export type Sector = 
  | 'Manufacturing'
  | 'Food Processing'
  | 'Textile'
  | 'IT Services'
  | 'Pharmaceutical'
  | 'Chemical'
  | 'Warehouse / Logistics'
  | 'Renewable Energy';

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
  | 'Query Raised'
  | 'Inspection Scheduled'
  | 'Approved'
  | 'Rejected'
  | 'Renewal Due';

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
}

export interface SmartChecklistItem extends ApprovalType {
  status: ApprovalStatus;
  applicationId?: string;
  canApply: boolean; // Computed based on dependencies
}

export type DocumentValidationStatus = 
  | 'Valid'
  | 'Missing'
  | 'Expired'
  | 'Name Mismatch'
  | 'Blurry / Unreadable'
  | 'Pending Review';

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
  aiValidationResult?: {
    confidence: number;
    issues: string[];
    recommendations: string[];
    extractedName?: string;
    extractedRegNo?: string;
    extractedExpiry?: string;
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
  department: string;
  shortDesc: string;
  eligibilityStatus: 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  estimatedBenefit: string;
  eligibilityReason: string;
  nextAction: string;
  tags: string[];
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
