import { 
  User, 
  BusinessProject, 
  ApprovalType, 
  Application, 
  DocumentItem, 
  InspectionItem, 
  ComplianceTask, 
  IncentiveScheme, 
  AuditLogItem, 
  NotificationItem,
  ApprovalRule
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@apexfoods.in',
    role: 'ENTREPRENEUR',
    organization: 'Apex Foods & Spices Pvt Ltd',
    phone: '+91 98230 11223',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Priya Deshmukh',
    email: 'priya@sahyadritextiles.com',
    role: 'ENTREPRENEUR',
    organization: 'Sahyadri Eco Textiles LLP',
    phone: '+91 94221 88390',
  },
  {
    id: 'usr-3',
    name: 'Amit Patel',
    email: 'amit@deccanpharma.com',
    role: 'ENTREPRENEUR',
    organization: 'Deccan Bio-Pharma Tech',
    phone: '+91 98902 44110',
  },
  {
    id: 'usr-4',
    name: 'Dr. V. K. Patil',
    email: 'vk.patil@mpcb.gov.in',
    role: 'OFFICER',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    phone: '+91 020 2553 4000',
  },
  {
    id: 'usr-5',
    name: 'Er. Suresh Shinde',
    email: 'suresh.shinde@midcindia.org',
    role: 'OFFICER',
    department: 'MIDC Infrastructure & Planning',
    phone: '+91 022 2687 0055',
  },
  {
    id: 'usr-6',
    name: 'Inspector A. B. Kadam',
    email: 'ab.kadam@dish.maharashtra.gov.in',
    role: 'OFFICER',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    phone: '+91 020 2612 9011',
  },
  {
    id: 'usr-7',
    name: 'Officer Sunita Rane',
    email: 'sunita.rane@fireservices.maharashtra.gov.in',
    role: 'OFFICER',
    department: 'Maharashtra Fire Services',
    phone: '+91 022 2307 6111',
  },
  {
    id: 'usr-8',
    name: 'Inspector R. S. Joshi',
    email: 'rs.joshi@fssai.gov.in',
    role: 'OFFICER',
    department: 'FSSAI Food Safety Maharashtra',
    phone: '+91 022 2659 0812',
  },
  {
    id: 'usr-9',
    name: 'MAITRI Admin Portal',
    email: 'admin@permitflownexus.gov.in',
    role: 'ADMIN',
    department: 'State Single Window System (MAITRI Core)',
    phone: '+91 022 2202 5500',
  }
];

export const INITIAL_APPROVAL_TYPES: ApprovalType[] = [
  {
    id: 'appr-1',
    name: 'Company Incorporation / LLP Registration',
    department: 'Ministry of Corporate Affairs (MCA)',
    whyRequired: 'Legal entity establishment for business operating in India.',
    category: 'Registration',
    requiredDocs: ['PAN Card of Directors', 'Aadhaar Card', 'Registered Address Proof', 'Digital Signature Certificate'],
    estimatedTimelineDays: 5,
    estimatedFee: '₹1,500',
    dependencies: [],
    riskImpact: 10
  },
  {
    id: 'appr-2',
    name: 'GST Registration',
    department: 'State Tax Department',
    whyRequired: 'Mandatory tax registration for turnover above threshold or inter-state trade.',
    category: 'Registration',
    requiredDocs: ['PAN Card', 'Incorporation Certificate', 'Bank Account Details', 'Lease/Ownership Deed'],
    estimatedTimelineDays: 3,
    estimatedFee: '₹0',
    dependencies: ['appr-1'],
    riskImpact: 10
  },
  {
    id: 'appr-3',
    name: 'Udyam MSME Registration',
    department: 'Ministry of MSME',
    whyRequired: 'To avail Government MSME subsidies, priority lending, and state incentives.',
    category: 'Registration',
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'GST Certificate'],
    estimatedTimelineDays: 2,
    estimatedFee: '₹0',
    dependencies: ['appr-2'],
    riskImpact: 5
  },
  {
    id: 'appr-4',
    name: 'Shops and Establishment Registration (Gumasta)',
    department: 'Labour Department Maharashtra',
    whyRequired: 'Local municipal registration regulating working hours and employee rights.',
    category: 'Registration',
    requiredDocs: ['PAN Card', 'Address Proof', 'Employee List', 'Partner/Director ID'],
    estimatedTimelineDays: 4,
    estimatedFee: '₹500',
    dependencies: ['appr-1'],
    riskImpact: 10
  },
  {
    id: 'appr-5',
    name: 'MIDC Building Plan Sanction',
    department: 'MIDC Infrastructure & Planning',
    whyRequired: 'Approval for architectural, structural, and civil layout before starting factory construction.',
    category: 'Clearance',
    requiredDocs: ['MIDC Land Allotment Letter', 'Architectural Blueprints', 'Structural Stability Certificate', 'Topographical Survey'],
    estimatedTimelineDays: 21,
    estimatedFee: '₹12,500',
    dependencies: ['appr-1'],
    riskImpact: 30
  },
  {
    id: 'appr-6',
    name: 'Fire No-Objection Certificate (Provisional NOC)',
    department: 'Maharashtra Fire Services',
    whyRequired: 'Fire safety hazard audit and layout verification for industrial buildings.',
    category: 'Safety',
    requiredDocs: ['Building Plan Sanction Copy', 'Fire Fighting System Drawing', 'Site Plan', 'Hazard Material Sheet'],
    estimatedTimelineDays: 14,
    estimatedFee: '₹5,000',
    dependencies: ['appr-5'],
    riskImpact: 35
  },
  {
    id: 'appr-7',
    name: 'Factory Licence (Form 1)',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    whyRequired: 'Mandatory licence for manufacturing units employing 10+ workers with power.',
    category: 'Safety',
    requiredDocs: ['Approved Building Plan', 'Fire NOC', 'Stability Certificate', 'Machinery Layout Plan'],
    estimatedTimelineDays: 15,
    estimatedFee: '₹8,000',
    dependencies: ['appr-5', 'appr-6'],
    riskImpact: 35
  },
  {
    id: 'appr-8',
    name: 'Pollution Consent to Establish (CTE)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Environmental clearance before constructing factory & installing machinery.',
    category: 'Environmental',
    requiredDocs: ['Process Flow Diagram', 'Effluent Treatment Plant (ETP) Proposal', 'Water/Air Consumption Details', 'Land Allotment'],
    estimatedTimelineDays: 30,
    estimatedFee: '₹15,000',
    dependencies: ['appr-1', 'appr-5'],
    riskImpact: 40
  },
  {
    id: 'appr-9',
    name: 'Pollution Consent to Operate (CTO)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Final clearance to commence industrial production after CTE compliance check.',
    category: 'Environmental',
    requiredDocs: ['CTE Approval Copy', 'ETP Trial Run Report', 'Analysis Report of Effluents', 'Hazardous Waste Authorization'],
    estimatedTimelineDays: 25,
    estimatedFee: '₹18,000',
    dependencies: ['appr-8', 'appr-7'],
    riskImpact: 40
  },
  {
    id: 'appr-10',
    name: 'HT / LT Industrial Power Connection',
    department: 'MSEDCL (Mahavitaran)',
    whyRequired: 'High tension/low tension power grid load sanction and transformer setup.',
    category: 'Utility',
    requiredDocs: ['MIDC Land Allotment', 'Building Approval', 'Load Estimation Sanction', 'Electrical Safety Certificate'],
    estimatedTimelineDays: 14,
    estimatedFee: '₹25,000',
    dependencies: ['appr-5'],
    riskImpact: 20
  },
  {
    id: 'appr-11',
    name: 'Professional Tax Registration (P-Tax Enrolment)',
    department: 'State Tax Department',
    whyRequired: 'Mandatory state enrolment for employer and employee professional tax deduction.',
    category: 'Registration',
    requiredDocs: ['PAN Card', 'GST Certificate', 'Director Address Proof'],
    estimatedTimelineDays: 3,
    estimatedFee: '₹1,000',
    dependencies: ['appr-2'],
    riskImpact: 10
  },
  {
    id: 'appr-12',
    name: 'FSSAI State Manufacturing Licence',
    department: 'FSSAI Food Safety Maharashtra',
    whyRequired: 'Food safety and standards license for food processing, packing, or cold storage.',
    category: 'Clearance',
    requiredDocs: ['Food Safety Management Plan', 'Water Analysis Test Report', 'List of Food Categories', 'Equipment List'],
    estimatedTimelineDays: 18,
    estimatedFee: '₹7,500',
    dependencies: ['appr-2', 'appr-8'],
    riskImpact: 35
  },
  {
    id: 'appr-13',
    name: 'State Environmental Clearance (EC)',
    department: 'SEIAA Maharashtra (Env Dept)',
    whyRequired: 'Mandatory environmental impact clearance for large scale chemical/pharma or >20,000 sq.m setups.',
    category: 'Environmental',
    requiredDocs: ['EIA Report', 'Public Hearing Report', 'Baseline Environment Study', 'Risk Management Plan'],
    estimatedTimelineDays: 60,
    estimatedFee: '₹50,000',
    dependencies: ['appr-8'],
    riskImpact: 50
  }
];

export const INITIAL_PROJECTS: BusinessProject[] = [
  {
    id: 'proj-1',
    userId: 'usr-1',
    businessName: 'Apex Agro Processing Hub',
    businessType: 'Food Processing & Spice Extraction Unit',
    projectType: 'New Setup',
    entityType: 'Private Limited',
    sector: 'Food Processing',
    investmentRange: '₹5 Cr - ₹15 Cr',
    employeeCount: 48,
    businessActivity: 'Automated spice processing, freezing, and export packaging',
    projectStage: 'Construction',
    hasConstruction: true,
    hasHazardousMaterials: false,
    district: 'Pune',
    cityTaluka: 'Khed / Chakan',
    pincode: '410501',
    midcArea: 'Chakan Phase II Industrial Area',
    landType: 'MIDC Allotted',
    address: 'Plot No. C-42, Chakan Industrial Area, Phase II, Pune',
    createdAt: '2026-06-12'
  },
  {
    id: 'proj-2',
    userId: 'usr-2',
    businessName: 'Sahyadri Eco Textiles',
    businessType: 'Sustainable Yarn Dyeing & Weaving Unit',
    projectType: 'Expansion',
    entityType: 'LLP',
    sector: 'Textile',
    investmentRange: '₹15 Cr - ₹30 Cr',
    employeeCount: 110,
    businessActivity: 'Zero Liquid Discharge organic cotton weaving & textile processing',
    projectStage: 'Machinery Setup',
    hasConstruction: true,
    hasHazardousMaterials: false,
    district: 'Palghar',
    cityTaluka: 'Palghar / Tarapur',
    pincode: '401506',
    midcArea: 'Tarapur MIDC Zone E',
    landType: 'MIDC Allotted',
    address: 'Plot E-18, Tarapur Industrial Area, Palghar',
    createdAt: '2026-05-10'
  },
  {
    id: 'proj-3',
    userId: 'usr-3',
    businessName: 'Deccan Bio-Pharma Formulation Lab',
    businessType: 'Active Pharmaceutical Ingredients & Formulation',
    projectType: 'New Setup',
    entityType: 'Private Limited',
    sector: 'Pharmaceutical',
    investmentRange: '₹25 Cr - ₹50 Cr',
    employeeCount: 95,
    businessActivity: 'Synthesis of generic API compounds & cleanroom formulation',
    projectStage: 'Planning',
    hasConstruction: true,
    hasHazardousMaterials: true,
    district: 'Chhatrapati Sambhajinagar',
    cityTaluka: 'Gangapur / Waluj',
    pincode: '431136',
    midcArea: 'Waluj MIDC Sector F',
    landType: 'MIDC Allotted',
    address: 'Plot F-90, Waluj Industrial Complex, Chhatrapati Sambhajinagar',
    createdAt: '2026-07-01'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    appId: 'PFN-2026-MIDC-0102',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-5',
    approvalName: 'MIDC Building Plan Sanction',
    department: 'MIDC Infrastructure & Planning',
    submissionDate: '2026-06-15',
    slaDeadlineDate: '2026-07-06',
    slaDaysRemaining: 0,
    status: 'Approved',
    officerAssigned: 'Er. Suresh Shinde',
    riskScore: 22,
    remarks: 'Building drawings verified & approved as per MIDC Development Control Rules.',
    timeline: [
      { id: 't1', title: 'Application Created', description: 'Application filed online by Rahul Sharma', timestamp: '2026-06-15 10:30', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' },
      { id: 't2', title: 'Documents Validated', description: 'AI verified land title deed & architect certificates', timestamp: '2026-06-15 10:32', actor: 'PermitFlow AI Engine', role: 'ADMIN' },
      { id: 't3', title: 'Officer Assigned', description: 'Assigned to Er. Suresh Shinde for structural review', timestamp: '2026-06-16 11:00', actor: 'MIDC Auto Dispatcher', role: 'ADMIN' },
      { id: 't4', title: 'Plan Sanction Granted', description: 'Final building sanction certificate issued', timestamp: '2026-07-01 15:45', actor: 'Er. Suresh Shinde', role: 'OFFICER' }
    ],
    queries: [],
    documentIds: ['doc-1', 'doc-2', 'doc-3']
  },
  {
    id: 'app-2',
    appId: 'PFN-2026-FIRE-0189',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-6',
    approvalName: 'Fire No-Objection Certificate (Provisional NOC)',
    department: 'Maharashtra Fire Services',
    submissionDate: '2026-07-05',
    slaDeadlineDate: '2026-07-19',
    slaDaysRemaining: 5,
    status: 'Under Review',
    officerAssigned: 'Officer Sunita Rane',
    riskScore: 48,
    remarks: 'Fire hydrant pipeline drawings undergoing safety margin check.',
    timeline: [
      { id: 't1', title: 'Application Submitted', description: 'Submitted along with MIDC building plan sanction', timestamp: '2026-07-05 14:10', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' },
      { id: 't2', title: 'Initial Desk Review', description: 'Officer initiated technical drawing audit', timestamp: '2026-07-08 09:30', actor: 'Officer Sunita Rane', role: 'OFFICER' }
    ],
    queries: [],
    documentIds: ['doc-1', 'doc-3', 'doc-5']
  },
  {
    id: 'app-3',
    appId: 'PFN-2026-MPCB-0341',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-8',
    approvalName: 'Pollution Consent to Establish (CTE)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    submissionDate: '2026-07-10',
    slaDeadlineDate: '2026-08-09',
    slaDaysRemaining: 6,
    status: 'Query Raised',
    officerAssigned: 'Dr. V. K. Patil',
    riskScore: 55,
    remarks: 'Officer requested clarification on effluent treatment capacity for spice washing washwater.',
    timeline: [
      { id: 't1', title: 'Application Submitted', description: 'Consent to Establish application submitted to MPCB Pune', timestamp: '2026-07-10 11:20', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' },
      { id: 't2', title: 'Query Issued', description: 'Official query raised regarding ETP capacity calculation & waste water recycling plan', timestamp: '2026-07-22 16:00', actor: 'Dr. V. K. Patil', role: 'OFFICER' }
    ],
    queries: [
      {
        id: 'q-1',
        applicationId: 'app-3',
        officerName: 'Dr. V. K. Patil',
        department: 'Maharashtra Pollution Control Board (MPCB)',
        queryCategory: 'Effluent Treatment & Mass Balance',
        queryText: 'Please submit the revised engineering flow diagram of the Effluent Treatment Plant (ETP) proving zero liquid discharge capability during peak monsoon harvest season (approx. 50 KLD water discharge).',
        raisedDate: '2026-07-22',
        dueDate: '2026-09-01',
        status: 'OPEN'
      }
    ],
    documentIds: ['doc-1', 'doc-2', 'doc-6']
  },
  {
    id: 'app-4',
    appId: 'PFN-2026-DISH-0412',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-7',
    approvalName: 'Factory Licence (Form 1)',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    submissionDate: '2026-07-18',
    slaDeadlineDate: '2026-08-12',
    slaDaysRemaining: 8,
    status: 'Inspection Scheduled',
    officerAssigned: 'Inspector A. B. Kadam',
    riskScore: 35,
    remarks: 'Physical site safety inspection scheduled for Chakan unit.',
    timeline: [
      { id: 't1', title: 'Application Submitted', description: 'DISH factory license application logged', timestamp: '2026-07-18 16:45', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' },
      { id: 't2', title: 'Inspection Fixed', description: 'Inspector scheduled site inspection for 2026-09-02', timestamp: '2026-07-28 10:15', actor: 'Inspector A. B. Kadam', role: 'OFFICER' }
    ],
    queries: [],
    documentIds: ['doc-1', 'doc-3', 'doc-7']
  },
  {
    id: 'app-5',
    appId: 'PFN-2026-FSSAI-0520',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-12',
    approvalName: 'FSSAI State Manufacturing Licence',
    department: 'FSSAI Food Safety Maharashtra',
    submissionDate: '2026-07-20',
    slaDeadlineDate: '2026-08-17',
    slaDaysRemaining: 12,
    status: 'Documents Needed',
    officerAssigned: 'Inspector R. S. Joshi',
    riskScore: 42,
    remarks: 'Awaiting updated NABL accredited water testing certificate.',
    timeline: [
      { id: 't1', title: 'Draft Saved', description: 'Form C details uploaded', timestamp: '2026-07-20 18:00', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' }
    ],
    queries: [],
    documentIds: ['doc-1', 'doc-4']
  },
  {
    id: 'app-6',
    appId: 'PFN-2026-MSEDCL-0633',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    approvalId: 'appr-10',
    approvalName: 'HT / LT Industrial Power Connection',
    department: 'MSEDCL (Mahavitaran)',
    submissionDate: '2026-07-25',
    slaDeadlineDate: '2026-08-08',
    slaDaysRemaining: 10,
    status: 'Submitted',
    officerAssigned: 'Sub-Engineer MSEDCL Chakan',
    riskScore: 18,
    remarks: 'Load sanction of 250 kVA requested for spice grinding line.',
    timeline: [
      { id: 't1', title: 'Application Submitted', description: 'Connection request logged with MSEDCL Chakan division', timestamp: '2026-07-25 12:00', actor: 'Rahul Sharma', role: 'ENTREPRENEUR' }
    ],
    queries: [],
    documentIds: ['doc-1', 'doc-2']
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    docName: 'Company PAN Card',
    category: 'PAN Card',
    fileUrl: '/mock_documents/pan_apex_foods.pdf',
    fileSize: '420 KB',
    uploadDate: '2026-06-12',
    status: 'Valid',
    aiValidationResult: {
      confidence: 98,
      issues: [],
      recommendations: ['Document is clear and verified with Income Tax portal database.'],
      extractedName: 'APEX FOODS & SPICES PRIVATE LIMITED',
      extractedRegNo: 'AAACA9821F'
    }
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    docName: 'GST Registration Certificate (Form REG-06)',
    category: 'GST Certificate',
    fileUrl: '/mock_documents/gst_cert.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-06-14',
    status: 'Valid',
    aiValidationResult: {
      confidence: 96,
      issues: [],
      recommendations: ['Legal business name matches profile perfectly.'],
      extractedName: 'APEX FOODS & SPICES PRIVATE LIMITED',
      extractedRegNo: '27AAACA9821F1ZH'
    }
  },
  {
    id: 'doc-3',
    projectId: 'proj-1',
    docName: 'MIDC Land Possession Deed',
    category: 'Land Ownership / Lease Document',
    fileUrl: '/mock_documents/midc_lease.pdf',
    fileSize: '3.4 MB',
    uploadDate: '2026-06-14',
    status: 'Valid',
    aiValidationResult: {
      confidence: 94,
      issues: [],
      recommendations: ['Plot number C-42 Chakan verified with MIDC GIS portal. Lease valid for 95 years.']
    }
  },
  {
    id: 'doc-4',
    projectId: 'proj-1',
    docName: 'Water Quality Analysis Report (NABL Lab)',
    category: 'Pollution Certificate',
    fileUrl: '/mock_documents/water_test.pdf',
    fileSize: '850 KB',
    uploadDate: '2026-07-02',
    status: 'Name Mismatch',
    aiValidationResult: {
      confidence: 65,
      issues: [
        'Business name on lab report reads "Apex Agro Unit 1" whereas project profile is registered as "Apex Foods & Spices Pvt Ltd".'
      ],
      recommendations: [
        'Request NABL lab to issue an addendum/corrected test report reflecting exact registered corporate entity name.'
      ],
      extractedName: 'Apex Agro Unit 1'
    }
  },
  {
    id: 'doc-5',
    projectId: 'proj-1',
    docName: 'Factory Fire System Hydraulic Calculation Layout',
    category: 'Fire Safety Certificate',
    fileUrl: '/mock_documents/fire_layout.png',
    fileSize: '4.1 MB',
    uploadDate: '2026-07-05',
    status: 'Blurry / Unreadable',
    aiValidationResult: {
      confidence: 45,
      issues: [
        'Image resolution is 120 DPI (below recommended 300 DPI threshold).',
        'Official stamp of Licensed Fire Consultant is pixelated and unreadable.'
      ],
      recommendations: [
        'Re-scan the original blueprint at 300 DPI high resolution or upload native PDF vector format.'
      ]
    }
  },
  {
    id: 'doc-6',
    projectId: 'proj-1',
    docName: 'Effluent Treatment Plant (ETP) Structural Design',
    category: 'Building Plan',
    fileUrl: '/mock_documents/etp_plan.pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-07-10',
    status: 'Valid',
    aiValidationResult: {
      confidence: 91,
      issues: [],
      recommendations: ['ETP layout signed by Chartered Environmental Engineer. Safe capacity certified.']
    }
  },
  {
    id: 'doc-7',
    projectId: 'proj-1',
    docName: 'Structural Stability Certificate by Chartered Engineer',
    category: 'Building Plan',
    fileUrl: '/mock_documents/stability_cert.pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-07-18',
    status: 'Expired',
    aiValidationResult: {
      confidence: 50,
      issues: [
        'Certificate date is 2023-04-10 with 3-year audit validity. Current status: Expired 4 months ago.'
      ],
      recommendations: [
        'Obtain a fresh Structural Audit & Stability Certificate from an empanelled structural engineer.'
      ],
      extractedExpiry: '2026-04-10'
    }
  },
  {
    id: 'doc-8',
    projectId: 'proj-1',
    docName: 'Annual Environmental Audit Report (Form V)',
    category: 'Pollution Certificate',
    status: 'Missing',
    aiValidationResult: {
      confidence: 0,
      issues: ['Document has not been uploaded yet.'],
      recommendations: ['Upload Form V Environmental Audit Report to proceed with Pollution CTO renewal.']
    }
  }
];

export const INITIAL_INSPECTIONS: InspectionItem[] = [
  {
    id: 'insp-1',
    applicationId: 'app-4',
    approvalName: 'Factory Licence & Environmental Safety Audit',
    businessName: 'Apex Agro Processing Hub',
    department: 'Joint Department Inspection (MPCB + DISH + Fire Services)',
    inspectionType: 'Pre-Setup Site Audit',
    scheduledDate: '2026-09-02 11:00 AM',
    location: 'Plot C-42, Chakan MIDC Phase II, Pune',
    officerDetails: {
      name: 'Inspector A. B. Kadam & Dr. V. K. Patil',
      designation: 'Senior Industrial Safety Inspector & MPCB Regional Officer',
      contact: '+91 98220 99441'
    },
    requiredDocs: [
      'Approved Building Drawings',
      'Structural Stability Certificate',
      'ETP Erection Audit Report',
      'Fire Sprinkler Test Certificates'
    ],
    status: 'SCHEDULED',
    isJointInspection: true,
    participatingDepts: ['Directorate of Industrial Safety & Health', 'Maharashtra Pollution Control Board', 'Maharashtra Fire Services']
  },
  {
    id: 'insp-2',
    applicationId: 'app-5',
    approvalName: 'FSSAI Hygiene & Processing Area Inspection',
    businessName: 'Apex Agro Processing Hub',
    department: 'FSSAI Food Safety Maharashtra',
    inspectionType: 'FSSAI Hygiene Inspection',
    scheduledDate: '2026-09-10 02:30 PM',
    location: 'Plot C-42, Chakan MIDC Phase II, Pune',
    officerDetails: {
      name: 'Inspector R. S. Joshi',
      designation: 'Food Safety Officer - Pune Division',
      contact: '+91 94220 11988'
    },
    requiredDocs: [
      'Food Handler Health Records',
      'NABL Water Test Report',
      'Pest Control AMC Contract'
    ],
    status: 'SCHEDULED',
    isJointInspection: false
  }
];

export const INITIAL_COMPLIANCE_TASKS: ComplianceTask[] = [
  {
    id: 'comp-1',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'Pollution Consent to Operate (CTO) Renewal',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    approvalName: 'Consent to Operate (CTO)',
    dueDate: '2026-09-25',
    daysLeft: 30,
    status: 'DUE_SOON',
    renewalPeriodMonths: 36,
    renewalFee: '₹18,000',
    reminderSentDates: ['2026-06-25 (90 Days)', '2026-07-25 (60 Days)', '2026-08-25 (30 Days)'],
    actionRequired: 'Submit Form V environmental return and pay 3-year renewal fee.'
  },
  {
    id: 'comp-2',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'Annual Fire Equipment Maintenance & Safety Audit',
    department: 'Maharashtra Fire Services',
    approvalName: 'Fire NOC Compliance',
    dueDate: '2026-08-20',
    daysLeft: -6,
    status: 'OVERDUE',
    renewalPeriodMonths: 12,
    renewalFee: '₹3,500',
    reminderSentDates: ['2026-05-20', '2026-06-20', '2026-07-20', '2026-08-13'],
    actionRequired: 'Upload certified Third-Party Licensed Fire Auditor Inspection Certificate (Form B).'
  },
  {
    id: 'comp-3',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'Factory Licence Annual Fees Deposit',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    approvalName: 'Factory Licence',
    dueDate: '2026-10-31',
    daysLeft: 66,
    status: 'UPCOMING',
    renewalPeriodMonths: 12,
    renewalFee: '₹8,000',
    reminderSentDates: [],
    actionRequired: 'Verify worker count roster (48 workers) and file DISH online return.'
  },
  {
    id: 'comp-4',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'Quarterly GST GSTR-3B Return Filing',
    department: 'State Tax Department',
    approvalName: 'GST Compliance',
    dueDate: '2026-08-20',
    daysLeft: -6,
    status: 'COMPLETED',
    renewalPeriodMonths: 3,
    renewalFee: '₹0',
    reminderSentDates: ['2026-08-10'],
    actionRequired: 'Filed successfully on 2026-08-18 (ARN #AA27082601928).'
  }
];

export const INITIAL_INCENTIVE_SCHEMES: IncentiveScheme[] = [
  {
    id: 'inc-1',
    schemeName: 'Maharashtra Package Scheme of Incentives (PSI 2019 / 2024)',
    department: 'Directorate of Industries, Maharashtra',
    shortDesc: 'Up to 60-80% Capital Subsidy & SGST Reimbursement for MSME setup in Zone C/D MIDC areas like Chakan & Tarapur.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: '₹45,00,000 Capital Subsidy + 100% SGST Refund',
    eligibilityReason: 'Your project "Apex Agro Processing Hub" is an MSME in Food Processing located in MIDC Chakan (Zone C classification).',
    nextAction: 'File Eligibility Certificate Application under PSI 2019 within 180 days of commercial production.',
    tags: ['MSME Support Scheme', 'Capital Subsidy', 'Food Processing Special']
  },
  {
    id: 'inc-2',
    schemeName: '100% Electricity Duty Exemption Scheme',
    department: 'Energy Department, Govt of Maharashtra',
    shortDesc: 'Complete 100% exemption from paying Electricity Duty on HT/LT power consumption for 7 years.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: 'Est. Savings ₹3,20,000 / year (₹22.4 Lakhs over 7 yrs)',
    eligibilityReason: 'New industrial manufacturing unit established in MIDC industrial park.',
    nextAction: 'Submit Form ED-Exemption along with MSEDCL Load Sanction copy.',
    tags: ['Electricity Duty Exemption', 'Operational Savings']
  },
  {
    id: 'inc-3',
    schemeName: 'Chief Minister Employment Generation Programme (CMEGP)',
    department: 'KVIB & Directorate of Industries',
    shortDesc: 'Margin money subsidy up to 25-35% for food processing & agro-manufacturing projects.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: '₹25,00,000 Direct Bank Margin Subsidy',
    eligibilityReason: 'Agro processing unit employing over 25 local Maharashtrian workers.',
    nextAction: 'Upload Project Appraisal Report from Bank for CMEGP portal validation.',
    tags: ['CMEGP', 'Employment Subsidy', 'Agro-Business']
  },
  {
    id: 'inc-4',
    schemeName: 'Special Capital Subsidy for Women Entrepreneurs',
    department: 'Mahila Arthik Vikas Mahamandal (MAVIM) & DIC',
    shortDesc: 'Additional 10% Capital Subsidy + 5% Interest Subvention for units owned >=51% by women entrepreneurs.',
    eligibilityStatus: 'POSSIBLY_ELIGIBLE',
    estimatedBenefit: '₹15,00,000 Additional Capital Top-up',
    eligibilityReason: 'Applicable if women partners/directors hold majority equity shareholding.',
    nextAction: 'Submit Shareholding Pattern Certificate signed by CA to unlock.',
    tags: ['Women Entrepreneur Support', 'Capital Subsidy']
  },
  {
    id: 'inc-5',
    schemeName: 'Green & Renewable Energy Unit Capital Subsidy',
    department: 'MEDA (Maharashtra Energy Development Agency)',
    shortDesc: '50% subsidy on setup of rooftop solar power plants & Effluent Zero Liquid Discharge (ZLD) plants.',
    eligibilityStatus: 'POSSIBLY_ELIGIBLE',
    estimatedBenefit: '₹12,00,000 Solar & ZLD Reimbursement',
    eligibilityReason: 'If Apex Agro installs a minimum 50 kW solar rooftop array on factory shed.',
    nextAction: 'Upload MEDA Technical Feasibility Approval Letter.',
    tags: ['Green Unit Support', 'Solar Subsidy', 'ZLD Incentive']
  },
  {
    id: 'inc-6',
    schemeName: 'Export Promotion & Quality Certification Subsidy',
    department: 'Maharashtra Small Scale Industries Development Corp (MSSIDC)',
    shortDesc: '100% reimbursement of ISO, HACCP, FSSAI, and international food safety certification expenses.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: 'Up to ₹5,00,000 Reimbursement',
    eligibilityReason: 'Export oriented food processing unit seeking international food safety certification.',
    nextAction: 'Submit receipts of ISO 22000 / HACCP audit fee invoices.',
    tags: ['Export Support', 'Quality Certification']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-25 11:20:14',
    user: 'Dr. V. K. Patil',
    role: 'OFFICER',
    action: 'Query Raised on Application',
    applicationId: 'PFN-2026-MPCB-0341',
    previousStatus: 'Under Review',
    newStatus: 'Query Raised',
    ipAddress: '10.240.12.91',
    details: 'Raised ETP flow diagram query regarding peak monsoon discharge calculations.'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-24 16:45:00',
    user: 'Inspector A. B. Kadam',
    role: 'OFFICER',
    action: 'Scheduled Joint Inspection',
    applicationId: 'PFN-2026-DISH-0412',
    previousStatus: 'Under Review',
    newStatus: 'Inspection Scheduled',
    ipAddress: '10.240.14.33',
    details: 'Fixed Joint Inspection with MPCB and Fire Dept for 2026-09-02 at Chakan MIDC site.'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-20 14:10:02',
    user: 'Rahul Sharma',
    role: 'ENTREPRENEUR',
    action: 'Uploaded Document',
    applicationId: 'PFN-2026-FSSAI-0520',
    previousStatus: 'Draft',
    newStatus: 'Documents Needed',
    ipAddress: '49.36.182.14',
    details: 'Uploaded Water Quality Analysis Report (doc-4). AI validation flagged name mismatch.'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-15 10:00:00',
    user: 'MAITRI Admin Portal',
    role: 'ADMIN',
    action: 'Updated Approval Rule Engine',
    previousStatus: 'N/A',
    newStatus: 'Active',
    ipAddress: '127.0.0.1',
    details: 'Updated Food Processing sector rules: FSSAI State Licence auto-triggered for investment > ₹5 Cr.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    timestamp: '2026-08-25 11:22:00',
    title: 'Department Query Raised on Pollution CTE',
    message: 'Dr. V. K. Patil (MPCB) has requested ETP revised design calculations for Application #PFN-2026-MPCB-0341. Response due by 2026-09-01.',
    type: 'WARNING',
    read: false,
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'notif-2',
    timestamp: '2026-08-24 16:50:00',
    title: 'Joint Inspection Scheduled',
    message: 'Joint Department Site Inspection scheduled for Chakan MIDC factory on 2026-09-02 at 11:00 AM.',
    type: 'INFO',
    read: false,
    channels: ['IN_APP', 'SMS']
  },
  {
    id: 'notif-3',
    timestamp: '2026-08-20 09:00:00',
    title: 'Fire Safety Audit Overdue Alert',
    message: 'Your Fire Safety Annual Audit is overdue by 6 days. Upload Form B to avoid compliance notice.',
    type: 'ALERT',
    read: true,
    channels: ['IN_APP', 'EMAIL']
  },
  {
    id: 'notif-4',
    timestamp: '2026-08-18 15:30:00',
    title: 'Incentive Scheme Match Identified!',
    message: 'Your business profile is eligible for ₹45,00,000 Capital Subsidy under Maharashtra PSI 2019 scheme.',
    type: 'SUCCESS',
    read: true,
    channels: ['IN_APP']
  }
];

export const INITIAL_RULES: ApprovalRule[] = [
  {
    id: 'rule-1',
    sector: 'Food Processing',
    projectType: 'ALL',
    locationCategory: 'MIDC',
    hasHazardous: null,
    hasConstruction: true,
    minEmployees: 10,
    approvalId: 'appr-12',
    department: 'FSSAI Food Safety Maharashtra',
    fee: '₹7,500',
    expectedTimelineDays: 18,
    dependencies: ['appr-2', 'appr-8'],
    riskCategory: 'Medium'
  },
  {
    id: 'rule-2',
    sector: 'ALL',
    projectType: 'ALL',
    locationCategory: 'MIDC',
    hasHazardous: null,
    hasConstruction: true,
    minEmployees: 1,
    approvalId: 'appr-5',
    department: 'MIDC Infrastructure & Planning',
    fee: '₹12,500',
    expectedTimelineDays: 21,
    dependencies: ['appr-1'],
    riskCategory: 'High'
  },
  {
    id: 'rule-3',
    sector: 'ALL',
    projectType: 'ALL',
    locationCategory: 'ALL',
    hasHazardous: null,
    hasConstruction: true,
    minEmployees: 1,
    approvalId: 'appr-6',
    department: 'Maharashtra Fire Services',
    fee: '₹5,000',
    expectedTimelineDays: 14,
    dependencies: ['appr-5'],
    riskCategory: 'High'
  },
  {
    id: 'rule-4',
    sector: 'ALL',
    projectType: 'ALL',
    locationCategory: 'ALL',
    hasHazardous: null,
    hasConstruction: null,
    minEmployees: 10,
    approvalId: 'appr-7',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    fee: '₹8,000',
    expectedTimelineDays: 15,
    dependencies: ['appr-5', 'appr-6'],
    riskCategory: 'High'
  },
  {
    id: 'rule-5',
    sector: 'Chemical',
    projectType: 'ALL',
    locationCategory: 'ALL',
    hasHazardous: true,
    hasConstruction: null,
    minEmployees: 1,
    approvalId: 'appr-13',
    department: 'SEIAA Maharashtra (Env Dept)',
    fee: '₹50,000',
    expectedTimelineDays: 60,
    dependencies: ['appr-8'],
    riskCategory: 'High'
  }
];
