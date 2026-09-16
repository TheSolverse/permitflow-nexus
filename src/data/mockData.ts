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
  ApprovalRule,
  NocApplication,
  JointInspection,
  ParallelPermissionItem
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
    id: 'usr-4',
    name: 'Dr. V. K. Patil',
    email: 'vk.patil@mpcb.gov.in',
    role: 'OFFICER_MPCB',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    phone: '+91 020 2553 4000',
  },
  {
    id: 'usr-7',
    name: 'Officer Sunita Rane',
    email: 'sunita.rane@fireservices.maharashtra.gov.in',
    role: 'OFFICER_FIRE',
    department: 'Maharashtra Fire Services',
    phone: '+91 022 2307 6111',
  },
  {
    id: 'usr-6',
    name: 'Inspector A. B. Kadam',
    email: 'ab.kadam@dish.maharashtra.gov.in',
    role: 'OFFICER_DISH',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    phone: '+91 020 2612 9011',
  },
  {
    id: 'usr-5',
    name: 'Er. Suresh Shinde',
    email: 'suresh.shinde@midcindia.org',
    role: 'OFFICER_MIDC',
    department: 'MIDC Infrastructure & Planning',
    phone: '+91 022 2687 0055',
  },
  {
    id: 'usr-10',
    name: 'Er. R. N. Deshpande',
    email: 'rn.deshpande@mahadiscom.in',
    role: 'OFFICER_MSEDCL',
    department: 'Maharashtra State Electricity Distribution Co Ltd (MSEDCL)',
    phone: '+91 022 2647 4211',
  },
  {
    id: 'usr-8',
    name: 'Officer Meena Thorat',
    email: 'm.thorat@fssai.gov.in',
    role: 'OFFICER_FSSAI',
    department: 'Food Safety & Standards Authority (FSSAI)',
    phone: '+91 022 2659 0812',
  },
  {
    id: 'usr-9',
    name: 'MAITRI Admin',
    email: 'admin@permitflownexus.gov.in',
    role: 'ADMIN',
    department: 'State Single Window Portal Admin Console',
    phone: '+91 022 2202 5555',
  }
];

export const INITIAL_APPROVAL_TYPES: ApprovalType[] = [
  {
    id: 'appr-1',
    name: 'Company Incorporation (SPICe+ Private Limited / OPC)',
    department: 'Ministry of Corporate Affairs (MCA) - Central Registration Centre',
    whyRequired: 'Statutory incorporation of Private Limited, OPC or Public entity via MCA SPICe+ (INC-32), e-MoA (INC-33), e-AoA (INC-34) & AGILE-PRO-S (INC-35) workflow.',
    category: 'Registration',
    requiredDocs: [
      'PAN of Directors / Subscribers',
      'Identity & Address Proof of Directors (Voter ID/Passport/Driving License/Aadhaar)',
      'Digital Signature Certificate (DSC) of Signatory',
      'Registered Office Proof (Lease Deed / Rent Agreement / Title Deed)',
      'Owner No-Objection Certificate (NOC)',
      'Utility Bill (< 2 Months Old - Electricity/Gas/Phone)',
      'Draft e-MoA (INC-33) & e-AoA (INC-34)'
    ],
    estimatedTimelineDays: 3,
    estimatedFee: '₹0 MCA Fee (Capital ≤ ₹15L) + State Stamp Duty (~₹1,000)',
    dependencies: [],
    riskImpact: 10
  },
  {
    id: 'appr-1-llp',
    name: 'LLP Incorporation (Limited Liability Partnership - FiLLiP)',
    department: 'Ministry of Corporate Affairs (MCA) - Central Registration Centre',
    whyRequired: 'Statutory incorporation of Limited Liability Partnership under LLP Act, 2008 via Form FiLLiP and Form 3 (LLP Agreement).',
    category: 'Registration',
    requiredDocs: [
      'PAN of Designated Partners',
      'Identity & Address Proof of Designated Partners (Voter ID/Passport/DL/Aadhaar)',
      'Digital Signature Certificate (DSC) of Designated Partner',
      'Registered Office Proof (Lease Deed / Rent Agreement / Title Deed)',
      'Owner No-Objection Certificate (NOC)',
      'Utility Bill (< 2 Months Old - Electricity/Water/Phone)',
      'Draft LLP Agreement / Form 9 Consent'
    ],
    estimatedTimelineDays: 4,
    estimatedFee: '₹500 Govt Fee + State Stamp Duty (~₹1,000)',
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
    riskImpact: 35,
    isNoc: true,
    nocType: 'FIRE_SAFETY',
    prerequisiteFor: 'Building Plan Approval & Factory Construction'
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
    riskImpact: 40,
    isNoc: true,
    nocType: 'MPCB_CTE',
    prerequisiteFor: 'Factory Construction & CTO Clearance'
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
  },
  {
    id: 'appr-14',
    name: 'MIDC Water Supply & Sewerage Connection NOC',
    department: 'MIDC Infrastructure & Water Works',
    whyRequired: 'NOC for industrial water quota allocation and effluent discharge connection into MIDC sewerage.',
    category: 'Utility',
    requiredDocs: ['MIDC Allotment Letter', 'Water Consumption Estimation Sheet', 'ETP Flow Scheme', 'Plumbing Layout'],
    estimatedTimelineDays: 10,
    estimatedFee: '₹3,500',
    dependencies: ['appr-5'],
    riskImpact: 25,
    isNoc: true,
    nocType: 'WATER_SUPPLY',
    prerequisiteFor: 'Factory Water Supply Energization'
  },
  {
    id: 'appr-15',
    name: 'Electrical Safety Inspectorate NOC',
    department: 'Electrical Inspectorate / MSEDCL',
    whyRequired: 'Safety inspection & NOC for high voltage industrial transformer & substation installation.',
    category: 'Safety',
    requiredDocs: ['Single Line Diagram (SLD)', 'Transformer Test Certificate', 'Earthing Pit Resistance Test', 'Electrical Contractor License'],
    estimatedTimelineDays: 12,
    estimatedFee: '₹6,000',
    dependencies: ['appr-10'],
    riskImpact: 30,
    isNoc: true,
    nocType: 'ELECTRICAL_SAFETY',
    prerequisiteFor: 'HT Grid Load Energization'
  },
  {
    id: 'appr-trade',
    name: 'Municipal Trade Licence',
    department: 'Local Municipal Corporation / Council',
    whyRequired: 'Mandatory municipal licence for operating commercial and industrial establishments in Maharashtra.',
    category: 'Registration',
    requiredDocs: ['Property Tax Receipt / Lease Deed', 'Gumasta Licence', 'Fire NOC', 'ID Proof'],
    estimatedTimelineDays: 7,
    estimatedFee: '₹2,000',
    dependencies: ['appr-4'],
    riskImpact: 15
  },
  {
    id: 'appr-legal-metrology',
    name: 'Legal Metrology (Packaged Commodities) Registration',
    department: 'Legal Metrology Department Maharashtra',
    whyRequired: 'Mandatory for manufacturing, packing, or importing pre-packaged goods to ensure accurate weight & label declarations.',
    category: 'Registration',
    requiredDocs: ['Label Sample Declaration', 'GST Certificate', 'Premises Lease', 'Partner/Director IDs'],
    estimatedTimelineDays: 10,
    estimatedFee: '₹1,500',
    dependencies: ['appr-2'],
    riskImpact: 20
  },
  {
    id: 'appr-labour-epfo-esic',
    name: 'Labour Statutory Registrations (EPFO, ESIC & Contract Labour)',
    department: 'Labour Commissionerate / EPFO / ESIC Maharashtra',
    whyRequired: 'Statutory social security and welfare registrations for textile & manufacturing workers.',
    category: 'Registration',
    requiredDocs: ['Factory License Copy', 'Employee Muster Roll', 'Bank Account Proof', 'PAN & Aadhaar of Directors'],
    estimatedTimelineDays: 7,
    estimatedFee: '₹0',
    dependencies: ['appr-7'],
    riskImpact: 25
  },
  {
    id: 'appr-hazardous-waste',
    name: 'Hazardous Waste Authorization (Rule 6)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Mandatory authorization for units handling, generating, or storing chemical & industrial toxic waste.',
    category: 'Environmental',
    requiredDocs: ['CTE/CTO Copy', 'Hazardous Waste Disposal Agreement with CHWTSDF', 'ETP Flow Sheet'],
    estimatedTimelineDays: 30,
    estimatedFee: '₹10,000',
    dependencies: ['appr-8'],
    riskImpact: 45
  },
  {
    id: 'appr-peso',
    name: 'Petroleum & Explosives Safety Approval (PESO)',
    department: 'Petroleum and Explosives Safety Organisation (PESO)',
    whyRequired: 'Safety sanction for storing flammable solvents, compressed gas cylinders, or chemical tanks.',
    category: 'Safety',
    requiredDocs: ['Site Plan CAD Approved by District Magistrate', 'Storage Tank Technical Specs', 'Pressure Vessel Test Certificate'],
    estimatedTimelineDays: 45,
    estimatedFee: '₹20,000',
    dependencies: ['appr-6', 'appr-8'],
    riskImpact: 50
  },
  {
    id: 'appr-ewaste',
    name: 'E-Waste Handling & Management Authorization',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Authorization for electronics assemblers, PCB manufacturers, and refurbishers under E-Waste Rules.',
    category: 'Environmental',
    requiredDocs: ['Extended Producer Responsibility (EPR) Plan', 'Recycler Agreement', 'CTO Copy'],
    estimatedTimelineDays: 20,
    estimatedFee: '₹5,000',
    dependencies: ['appr-8'],
    riskImpact: 30
  },
  {
    id: 'appr-fssai-packaging',
    name: 'FSSAI Food-Contact Packaging Authorization',
    department: 'FSSAI Food Safety Maharashtra',
    whyRequired: 'Specialized food safety license for food contact containers, pouches, and bottle manufacturers.',
    category: 'Clearance',
    requiredDocs: ['Overall Migration Test Report for Packaging Materials', 'Factory Hygiene Audit', 'Water Analysis'],
    estimatedTimelineDays: 15,
    estimatedFee: '₹5,000',
    dependencies: ['appr-8'],
    riskImpact: 35
  },
  {
    id: 'appr-solvents-auth',
    name: 'Printing Inks & Solvents Emission Authorization',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Pollution control sanction for VOC emissions from flexographic & rotogravure printing inks.',
    category: 'Environmental',
    requiredDocs: ['Solvent Recovery System Layout', 'Air Emission Stack Height Certificate', 'Safety Data Sheets (MSDS)'],
    estimatedTimelineDays: 21,
    estimatedFee: '₹8,000',
    dependencies: ['appr-8'],
    riskImpact: 30
  },
  {
    id: 'appr-lab-mpcb-auth',
    name: 'MPCB Testing Lab & Calibration Authorization',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Clearance for industrial testing labs handling chemical reagents & calibration effluents.',
    category: 'Environmental',
    requiredDocs: ['NABL Accreditation Copy', 'Chemical Reagent Disposal Plan', 'Lab Premises Layout'],
    estimatedTimelineDays: 14,
    estimatedFee: '₹4,000',
    dependencies: ['appr-1'],
    riskImpact: 20
  },
  {
    id: 'appr-warehouse-hazardous',
    name: 'Hazardous Cargo Warehousing Storage Approval',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    whyRequired: 'Specialized clearance for storing chemical drums, battery hazardous cargo, or flammable goods.',
    category: 'Safety',
    requiredDocs: ['Spill Containment Layout Plan', 'Fire Tender Perimeter Plan', 'Insurance Policy'],
    estimatedTimelineDays: 25,
    estimatedFee: '₹12,000',
    dependencies: ['appr-6'],
    riskImpact: 35
  },
  {
    id: 'appr-agmark',
    name: 'AGMARK Quality Grading Registration',
    department: 'Directorate of Marketing & Inspection (DMI)',
    whyRequired: 'Quality grading certification for edible oils, ghee, ground spices, and agricultural produce.',
    category: 'Clearance',
    requiredDocs: ['Testing Chemist Authorization', 'Lab Equipment List', 'FSSAI License Copy'],
    estimatedTimelineDays: 30,
    estimatedFee: '₹6,000',
    dependencies: ['appr-12'],
    riskImpact: 25
  },
  {
    id: 'appr-dairy-dept',
    name: 'Dairy Processing & Animal Husbandry Department Registration',
    whyRequired: 'Statutory registration for milk processing, chilling centers, and pasteurization plants.',
    department: 'Department of Animal Husbandry & Dairy Maharashtra',
    category: 'Registration',
    requiredDocs: ['Milk Procurement Sourcing Plan', 'Pasteurization Plant Specs', 'FSSAI License'],
    estimatedTimelineDays: 14,
    estimatedFee: '₹3,000',
    dependencies: ['appr-12'],
    riskImpact: 30
  },
  {
    id: 'appr-signage-permit',
    name: 'Commercial Signage & Hoarding Permission',
    department: 'Local Municipal Corporation / Council',
    whyRequired: 'Municipal sanction for displaying commercial brand signage & shop hoardings.',
    category: 'Registration',
    requiredDocs: ['Signage Dimensions & Design Blueprint', 'Property Ownership Proof', 'Structural Safety Certificate'],
    estimatedTimelineDays: 5,
    estimatedFee: '₹1,000',
    dependencies: ['appr-4'],
    riskImpact: 10
  },
  {
    id: 'appr-health-license',
    name: 'Municipal Commercial Health Department License',
    department: 'Local Municipal Health Department',
    whyRequired: 'Mandatory health & hygiene license for running restaurants, cafes, cloud kitchens & food stalls.',
    category: 'Safety',
    requiredDocs: ['Kitchen Hygiene Audit', 'Water Quality Test', 'Pest Control AMC', 'Employee Medical Fitness'],
    estimatedTimelineDays: 10,
    estimatedFee: '₹2,500',
    dependencies: ['appr-12'],
    riskImpact: 30
  },
  {
    id: 'appr-kitchen-ventilation',
    name: 'Commercial Kitchen Exhaust & Ventilation Clearance',
    department: 'Maharashtra Fire Services / Municipal Health',
    whyRequired: 'Fire safety & air quality sanction for commercial kitchen chimneys, ducting & grease traps.',
    category: 'Safety',
    requiredDocs: ['Kitchen Exhaust Ducting CAD Drawing', 'Fire Suppression System Specs', 'Grease Trap Scheme'],
    estimatedTimelineDays: 7,
    estimatedFee: '₹3,000',
    dependencies: ['appr-6'],
    riskImpact: 25
  },
  {
    id: 'appr-liquor-license',
    name: 'Maharashtra State Excise Liquor License (FL-III)',
    department: 'State Excise Department Maharashtra',
    whyRequired: 'Conditional statutory permit for serving alcoholic beverages in high-end restaurants & hotels.',
    category: 'Clearance',
    requiredDocs: ['Police Character Verification', 'Municipal Health License', 'Fire NOC', 'Premises Title Deed'],
    estimatedTimelineDays: 45,
    estimatedFee: '₹1,50,000',
    dependencies: ['appr-health-license', 'appr-6'],
    riskImpact: 40
  },
  {
    id: 'appr-stpi',
    name: 'Software Technology Parks of India (STPI) Export Registration',
    department: 'Software Technology Parks of India (STPI)',
    whyRequired: 'Optional registration for IT startups & software exporters to claim duty exemptions & IT park benefits.',
    category: 'Registration',
    requiredDocs: ['Project Report for IT Export', 'Incorporation Certificate', 'IEC Code'],
    estimatedTimelineDays: 14,
    estimatedFee: '₹5,000',
    dependencies: ['appr-1'],
    riskImpact: 15
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
    subSector: 'Edible oil and spices (processing, refining, packaging)',
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
    sector: 'Manufacturing',
    subSector: 'Textiles (spinning, weaving, garment manufacturing)',
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
    status: 'Submitted',
    officerAssigned: 'Er. Suresh Shinde',
    riskScore: 22,
    remarks: 'Building drawings submitted for structural review under MIDC Development Control Rules.',
    timeline: [
      { id: 't1', title: 'Application Created', description: 'Application filed online by applicant', timestamp: '2026-06-15 10:30', actor: 'Applicant', role: 'ENTREPRENEUR' },
      { id: 't2', title: 'Documents Validated', description: 'AI verified land title deed & architect certificates', timestamp: '2026-06-15 10:32', actor: 'PermitFlow AI Engine', role: 'ADMIN' },
      { id: 't3', title: 'Officer Assigned', description: 'Assigned to Er. Suresh Shinde for structural review', timestamp: '2026-06-16 11:00', actor: 'MIDC Auto Dispatcher', role: 'ADMIN' }
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
  },
  {
    id: 'comp-5',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'FSSAI Food Business Manufacturing License Audit & Renewal',
    department: 'FSSAI Food Safety Maharashtra',
    approvalName: 'FSSAI State Manufacturing Licence',
    dueDate: '2026-09-14',
    daysLeft: 18,
    status: 'DUE_SOON',
    renewalPeriodMonths: 12,
    renewalFee: '₹7,500',
    reminderSentDates: ['2026-08-01 (45 Days)', '2026-08-15 (30 Days)'],
    actionRequired: 'Submit annual production return Form D1 and schedule hygiene audit inspection.'
  },
  {
    id: 'comp-6',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    title: 'Legal Metrology Pre-Packaged Commodities Certificate Renewal',
    department: 'Department of Legal Metrology Maharashtra',
    approvalName: 'Legal Metrology Registration',
    dueDate: '2026-09-20',
    daysLeft: 24,
    status: 'DUE_SOON',
    renewalPeriodMonths: 24,
    renewalFee: '₹4,000',
    reminderSentDates: ['2026-08-10 (40 Days)'],
    actionRequired: 'Upload calibrated weight & measure verification certificate issued by Inspector of Weights.'
  }
];

export const INITIAL_INCENTIVE_SCHEMES: IncentiveScheme[] = [
  {
    id: 'inc-1',
    schemeName: 'Maharashtra Package Scheme of Incentives (PSI 2019 / 2024)',
    name: 'Maharashtra Package Scheme of Incentives (PSI 2019 / 2024)',
    department: 'Directorate of Industries, Maharashtra',
    shortDesc: 'Up to 60-80% Capital Subsidy & SGST Reimbursement for MSME setup in Zone C/D MIDC areas like Chakan & Tarapur.',
    description: 'Up to 60-80% Capital Subsidy & SGST Reimbursement for MSME setup in Zone C/D MIDC areas like Chakan & Tarapur.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: '₹45,00,000 Capital Subsidy + 100% SGST Refund',
    benefit: '₹45,00,000 Capital Subsidy + 100% SGST Refund',
    eligibilityReason: 'Your project "Apex Agro Processing Hub" is an MSME in Food Processing located in MIDC Chakan (Zone C classification).',
    nextAction: 'File Eligibility Certificate Application under PSI 2019 within 180 days of commercial production.',
    requiredNextStep: 'File Eligibility Certificate Application under PSI 2019 within 180 days of commercial production.',
    tags: ['MSME Support Scheme', 'Capital Subsidy', 'Food Processing Special'],
    officialUrl: 'https://maitri.mahaonline.gov.in/',
    officialApplyUrl: 'https://maitri.mahaonline.gov.in/',
    officialInfoUrl: 'https://di.maharashtra.gov.in'
  },
  {
    id: 'inc-2',
    schemeName: '100% Electricity Duty Exemption Scheme',
    name: '100% Electricity Duty Exemption Scheme',
    department: 'Energy Department, Govt of Maharashtra',
    shortDesc: 'Complete 100% exemption from paying Electricity Duty on HT/LT power consumption for 7 years.',
    description: 'Complete 100% exemption from paying Electricity Duty on HT/LT power consumption for 7 years.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: 'Est. Savings ₹3,20,000 / year (₹22.4 Lakhs over 7 yrs)',
    benefit: 'Est. Savings ₹3,20,000 / year (₹22.4 Lakhs over 7 yrs)',
    eligibilityReason: 'New industrial manufacturing unit established in MIDC industrial park.',
    nextAction: 'Submit Form ED-Exemption along with MSEDCL Load Sanction copy.',
    requiredNextStep: 'Submit Form ED-Exemption along with MSEDCL Load Sanction copy.',
    tags: ['Electricity Duty Exemption', 'Operational Savings'],
    officialUrl: 'https://maitri.mahaonline.gov.in/',
    officialApplyUrl: 'https://maitri.mahaonline.gov.in/',
    officialInfoUrl: 'https://ene.maharashtra.gov.in'
  },
  {
    id: 'inc-3',
    schemeName: 'Chief Minister Employment Generation Programme (CMEGP)',
    name: 'Chief Minister Employment Generation Programme (CMEGP)',
    department: 'KVIB & Directorate of Industries',
    shortDesc: 'Margin money subsidy up to 25-35% for food processing & agro-manufacturing projects.',
    description: 'Margin money subsidy up to 25-35% for food processing & agro-manufacturing projects.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: '₹25,00,000 Direct Bank Margin Subsidy',
    benefit: '₹25,00,000 Direct Bank Margin Subsidy',
    eligibilityReason: 'Agro processing unit employing over 25 local Maharashtrian workers.',
    nextAction: 'Upload Project Appraisal Report from Bank for CMEGP portal validation.',
    requiredNextStep: 'Upload Project Appraisal Report from Bank for CMEGP portal validation.',
    tags: ['CMEGP', 'Employment Subsidy', 'Agro-Business'],
    officialUrl: 'https://maha-cmegp.gov.in',
    officialApplyUrl: 'https://maha-cmegp.gov.in',
    officialInfoUrl: 'https://di.maharashtra.gov.in'
  },
  {
    id: 'inc-4',
    schemeName: 'Special Capital Subsidy for Women Entrepreneurs',
    name: 'Special Capital Subsidy for Women Entrepreneurs',
    department: 'Mahila Arthik Vikas Mahamandal (MAVIM) & DIC',
    shortDesc: 'Additional 10% Capital Subsidy + 5% Interest Subvention for units owned >=51% by women entrepreneurs.',
    description: 'Additional 10% Capital Subsidy + 5% Interest Subvention for units owned >=51% by women entrepreneurs.',
    eligibilityStatus: 'POSSIBLY_ELIGIBLE',
    estimatedBenefit: '₹15,00,000 Additional Capital Top-up',
    benefit: '₹15,00,000 Additional Capital Top-up',
    eligibilityReason: 'Applicable if women partners/directors hold majority equity shareholding.',
    nextAction: 'Submit Shareholding Pattern Certificate signed by CA to unlock.',
    requiredNextStep: 'Submit Shareholding Pattern Certificate signed by CA to unlock.',
    tags: ['Women Entrepreneur Support', 'Capital Subsidy'],
    officialUrl: 'https://di.maharashtra.gov.in',
    officialApplyUrl: 'https://di.maharashtra.gov.in',
    officialInfoUrl: 'https://mavim.maharashtra.gov.in'
  },
  {
    id: 'inc-5',
    schemeName: 'Green & Renewable Energy Unit Capital Subsidy',
    name: 'Green & Renewable Energy Unit Capital Subsidy',
    department: 'MEDA (Maharashtra Energy Development Agency)',
    shortDesc: '50% subsidy on setup of rooftop solar power plants & Effluent Zero Liquid Discharge (ZLD) plants.',
    description: '50% subsidy on setup of rooftop solar power plants & Effluent Zero Liquid Discharge (ZLD) plants.',
    eligibilityStatus: 'POSSIBLY_ELIGIBLE',
    estimatedBenefit: '₹12,00,000 Solar & ZLD Reimbursement',
    benefit: '₹12,00,000 Solar & ZLD Reimbursement',
    eligibilityReason: 'If Apex Agro installs a minimum 50 kW solar rooftop array on factory shed.',
    nextAction: 'Upload MEDA Technical Feasibility Approval Letter.',
    requiredNextStep: 'Upload MEDA Technical Feasibility Approval Letter.',
    tags: ['Green Unit Support', 'Solar Subsidy', 'ZLD Incentive'],
    officialUrl: 'https://www.mahaurja.maharashtra.gov.in',
    officialApplyUrl: 'https://www.mahaurja.maharashtra.gov.in',
    officialInfoUrl: 'https://www.mahaurja.maharashtra.gov.in'
  },
  {
    id: 'inc-6',
    schemeName: 'Export Promotion & Quality Certification Subsidy',
    name: 'Export Promotion & Quality Certification Subsidy',
    department: 'Maharashtra Small Scale Industries Development Corp (MSSIDC)',
    shortDesc: '100% reimbursement of ISO, HACCP, FSSAI, and international food safety certification expenses.',
    description: '100% reimbursement of ISO, HACCP, FSSAI, and international food safety certification expenses.',
    eligibilityStatus: 'ELIGIBLE',
    estimatedBenefit: 'Up to ₹5,00,000 Reimbursement',
    benefit: 'Up to ₹5,00,000 Reimbursement',
    eligibilityReason: 'Export oriented food processing unit seeking international food safety certification.',
    nextAction: 'Submit receipts of ISO 22000 / HACCP audit fee invoices.',
    requiredNextStep: 'Submit receipts of ISO 22000 / HACCP audit fee invoices.',
    tags: ['Export Support', 'Quality Certification'],
    officialUrl: 'https://mssidc.maharashtra.gov.in',
    officialApplyUrl: 'https://mssidc.maharashtra.gov.in',
    officialInfoUrl: 'https://mssidc.maharashtra.gov.in'
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
    user: 'PFN Admin Portal',
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
    userId: 'usr-1',
    projectId: 'proj-1',
    timestamp: '2026-08-25 11:22:00',
    title: 'Department Query Raised on Pollution CTE',
    message: 'Dr. V. K. Patil (MPCB) has requested ETP revised design calculations for Application #PFN-2026-MPCB-0341. Response due by 2026-09-01.',
    type: 'WARNING',
    read: false,
    channels: ['IN_APP', 'EMAIL', 'SMS']
  },
  {
    id: 'notif-2',
    userId: 'usr-1',
    projectId: 'proj-1',
    timestamp: '2026-08-24 16:50:00',
    title: 'Joint Inspection Scheduled',
    message: 'Joint Department Site Inspection scheduled for Chakan MIDC factory on 2026-09-02 at 11:00 AM.',
    type: 'INFO',
    read: false,
    channels: ['IN_APP', 'SMS']
  },
  {
    id: 'notif-3',
    userId: 'usr-1',
    projectId: 'proj-1',
    timestamp: '2026-08-20 09:00:00',
    title: 'Fire Safety Audit Overdue Alert',
    message: 'Your Fire Safety Annual Audit is overdue by 6 days. Upload Form B to avoid compliance notice.',
    type: 'ALERT',
    read: true,
    channels: ['IN_APP', 'EMAIL']
  },
  {
    id: 'notif-4',
    userId: 'usr-1',
    projectId: 'proj-1',
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

export const INITIAL_NOC_APPLICATIONS: NocApplication[] = [
  {
    id: 'noc-app-1',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    nocType: 'FIRE_SAFETY',
    nocName: 'Fire Safety Provisional NOC',
    department: 'Maharashtra Fire Services',
    appliedDate: '2026-08-15',
    status: 'UNDER_REVIEW',
    urgency: 'HIGH',
    slaDaysLeft: 6,
    technicalParameters: {
      builtUpAreaSqM: 1250,
      plotAreaSqM: 4500,
      fireMitigation: {
        sprinklersCount: 48,
        hydrantsCount: 6,
        smokeAlarmsCount: 32,
        hasFirePumps: true
      }
    },
    documents: [
      {
        docId: 'doc-1',
        docName: 'MIDC Land Allotment Letter',
        category: 'Land Ownership',
        uploadDate: '2026-08-12',
        aiValidationStatus: 'VALIDATED',
        aiNotes: 'Verified plot allotment match with MIDC Chakan Phase 2 registry.'
      },
      {
        docId: 'doc-2',
        docName: 'Architectural Building Layout Plan',
        category: 'Building Sanction',
        uploadDate: '2026-08-14',
        aiValidationStatus: 'VALIDATED',
        aiNotes: '6m perimeter fire tender access road clear in drawing.'
      }
    ],
    queries: []
  },
  {
    id: 'noc-app-2',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    nocType: 'MPCB_CTE',
    nocName: 'MPCB Consent to Establish (CTE NOC)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    appliedDate: '2026-08-10',
    status: 'QUERY_RAISED',
    urgency: 'HIGH',
    slaDaysLeft: 4,
    technicalParameters: {
      builtUpAreaSqM: 1250,
      plotAreaSqM: 4500,
      waterRequirementKlpd: 35,
      effluentGenerationKlpd: 22,
      hazardousSubstanceDetails: 'Organic food effluent, zero toxic chemicals'
    },
    documents: [
      {
        docId: 'doc-3',
        docName: 'Effluent Treatment Plant (ETP) Proposal',
        category: 'Environmental',
        uploadDate: '2026-08-10',
        aiValidationStatus: 'WARNING',
        aiNotes: 'Peak monsoon flow rate missing in calculation annexure.'
      }
    ],
    queries: [
      {
        id: 'q-noc-1',
        raisedBy: 'Dr. V. K. Patil (MPCB Officer)',
        date: '2026-08-20',
        question: 'Please submit peak monsoon discharge calculation for Effluent Treatment Plant (ETP) along with flow meter specifications.',
        status: 'OPEN'
      }
    ]
  },
  {
    id: 'noc-app-3',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    nocType: 'WATER_SUPPLY',
    nocName: 'MIDC Industrial Water Supply & Sewerage NOC',
    department: 'MIDC Infrastructure & Water Works',
    appliedDate: '2026-08-01',
    status: 'PROVISIONAL_ISSUED',
    urgency: 'NORMAL',
    slaDaysLeft: 0,
    technicalParameters: {
      builtUpAreaSqM: 1250,
      plotAreaSqM: 4500,
      waterRequirementKlpd: 35,
      effluentGenerationKlpd: 22
    },
    documents: [
      {
        docId: 'doc-4',
        docName: 'Water Requirement Estimation Sheet',
        category: 'Utility',
        uploadDate: '2026-08-01',
        aiValidationStatus: 'VALIDATED',
        aiNotes: 'Water balance calculation verified by MIDC engineer.'
      }
    ],
    queries: [],
    provisionalCertUrl: 'https://permitflownexus.gov.in/certs/NOC-WATER-2026-0941.pdf',
    issuedDate: '2026-08-18',
    certificateId: 'PFN-NOC-WTR-2026-0891',
    qrCodeData: 'PFN-VERIFIED-NOC-WATER-APEXAGRO-2026-0891'
  },
  {
    id: 'noc-app-4',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    nocType: 'ELECTRICAL_SAFETY',
    nocName: 'High Voltage Electrical Grid Safety NOC',
    department: 'Electrical Inspectorate / MSEDCL',
    appliedDate: '2026-08-22',
    status: 'INSPECTION_SCHEDULED',
    urgency: 'URGENT',
    slaDaysLeft: 8,
    technicalParameters: {
      builtUpAreaSqM: 1250,
      plotAreaSqM: 4500,
      electricalLoadKw: 250,
      voltageLevel: '11kV HT Connection'
    },
    documents: [
      {
        docId: 'doc-5',
        docName: 'Single Line Diagram (SLD) Substation Drawing',
        category: 'Utility',
        uploadDate: '2026-08-22',
        aiValidationStatus: 'VALIDATED',
        aiNotes: '11kV HT line clearance meets statutory 3.7m safety distance.'
      }
    ],
    queries: []
  }
];

export const INITIAL_JOINT_INSPECTIONS: JointInspection[] = [
  {
    id: 'joint-insp-1',
    nocApplicationId: 'noc-app-4',
    projectId: 'proj-1',
    businessName: 'Apex Agro Processing Hub',
    scheduledDate: '2026-09-02',
    scheduledTime: '11:00 AM',
    attendingDepartments: [
      'Maharashtra Fire Services',
      'Maharashtra Pollution Control Board (MPCB)',
      'MIDC Infrastructure',
      'Electrical Inspectorate / MSEDCL'
    ],
    officerNames: [
      'Officer Sunita Rane (Fire)',
      'Dr. V. K. Patil (MPCB)',
      'Er. Suresh Shinde (MIDC)',
      'Inspector A. B. Kadam (DISH)'
    ],
    inspectionLocation: 'Plot No. C-42, MIDC Chakan Phase 2, Pune Industrial Zone',
    status: 'SCHEDULED',
    rubricChecklist: [
      { criterion: '6m Clear Perimeter Fire Tender Access Road', compliant: true, notes: 'Roadway clear during preliminary civil survey' },
      { criterion: 'Emergency Exit & Ring Main Fire Hydrant Network', compliant: true, notes: 'Dual ring main pressure gauges installed' },
      { criterion: 'Effluent Treatment Plant (ETP) Flow Meter & Zero Liquid Discharge', compliant: null, notes: 'To be verified during joint site visit' },
      { criterion: '11kV Substation Transformer Earth Pit Resistance (<1 Ohm)', compliant: null, notes: 'To be measured by MSEDCL Inspector' }
    ]
  }
];

export const INITIAL_PARALLEL_PERMISSIONS: ParallelPermissionItem[] = [
  {
    id: 'perm-101',
    projectId: 'proj-1',
    approvalId: 'mpcb-cte',
    approvalName: 'Pollution Consent (MPCB CTE)',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    category: 'Environmental',
    assignedOfficer: 'Dr. V. K. Patil',
    officerEmail: 'vk.patil@mpcb.gov.in',
    status: 'Under Review',
    pendingWith: 'MPCB Officer',
    pendingAction: 'Technical scrutiny of stack height & emission controls',
    dateReceived: '2026-08-15',
    lastUpdatedDateTime: '12 Sept 2026, 10:15 AM',
    pendingDocs: [],
    queriesCount: 0,
    slaDeadlineDate: '2026-09-25',
    slaDaysRemaining: 13,
    dependencies: [],
    submittedDate: '2026-08-15',
    lastUpdatedDate: '2026-09-01',
    remarks: 'Air emission stack height calculation under review by Regional Environmental Engineer.',
    activityHistory: [
      { id: 'act-1', timestamp: '2026-08-15 10:00 AM', actor: 'Rahul Sharma', department: 'Entrepreneur', action: 'Application Submitted', notes: 'Consent to Establish application submitted.' },
      { id: 'act-2', timestamp: '2026-08-16 11:30 AM', actor: 'Dr. V. K. Patil', department: 'MPCB', action: 'Assigned to Officer', notes: 'Assigned to Regional Officer Dr. V. K. Patil.' }
    ]
  },
  {
    id: 'perm-102',
    projectId: 'proj-1',
    approvalId: 'midc-bldg',
    approvalName: 'Industrial Permission (MIDC Building Plan)',
    department: 'MIDC Infrastructure & Planning',
    category: 'Clearance',
    assignedOfficer: 'Er. Suresh Shinde',
    officerEmail: 'suresh.shinde@midcindia.org',
    status: 'Approved',
    pendingWith: 'Completed',
    pendingAction: 'Sanction certificate issued',
    dateReceived: '2026-08-01',
    lastUpdatedDateTime: '28 Aug 2026, 04:00 PM',
    pendingDocs: [],
    queriesCount: 0,
    slaDeadlineDate: '2026-08-30',
    slaDaysRemaining: 0,
    dependencies: [],
    submittedDate: '2026-08-01',
    lastUpdatedDate: '2026-08-28',
    remarks: 'Sanctioned blueprint issued with approval stamp MIDC/BPA/2026/0942.',
    activityHistory: [
      { id: 'act-3', timestamp: '2026-08-01 09:15 AM', actor: 'Rahul Sharma', department: 'Entrepreneur', action: 'Submitted Building Plan', notes: 'Architectural drawings uploaded.' },
      { id: 'act-4', timestamp: '2026-08-28 04:00 PM', actor: 'Er. Suresh Shinde', department: 'MIDC', action: 'Approved', notes: 'Building plan approved.' }
    ]
  },
  {
    id: 'perm-103',
    projectId: 'proj-1',
    approvalId: 'fire-noc',
    approvalName: 'Fire NOC (Provisional Safety Clearance)',
    department: 'Maharashtra Fire Services',
    category: 'Safety',
    assignedOfficer: 'Officer Sunita Rane',
    officerEmail: 'sunita.rane@mahfire.gov.in',
    status: 'Approved',
    pendingWith: 'Completed',
    pendingAction: 'Provisional NOC granted',
    dateReceived: '2026-08-02',
    lastUpdatedDateTime: '18 Aug 2026, 02:30 PM',
    pendingDocs: [],
    queriesCount: 0,
    slaDeadlineDate: '2026-08-20',
    slaDaysRemaining: 0,
    dependencies: [],
    submittedDate: '2026-08-02',
    lastUpdatedDate: '2026-08-18',
    remarks: 'Provisional NOC granted based on architect fire safety layout plan.',
    activityHistory: [
      { id: 'act-5', timestamp: '2026-08-02 11:00 AM', actor: 'Rahul Sharma', department: 'Entrepreneur', action: 'Submitted Fire NOC Request', notes: 'Layout plans uploaded.' },
      { id: 'act-6', timestamp: '2026-08-18 02:30 PM', actor: 'Officer Sunita Rane', department: 'Maharashtra Fire Services', action: 'Approved', notes: 'Provisional Fire NOC issued.' }
    ]
  },
  {
    id: 'perm-104',
    projectId: 'proj-1',
    approvalId: 'fire-final',
    approvalName: 'Fire NOC (Final Certificate)',
    department: 'Maharashtra Fire Services',
    category: 'Safety',
    assignedOfficer: 'Officer Sunita Rane',
    officerEmail: 'sunita.rane@mahfire.gov.in',
    status: 'Delayed',
    pendingWith: 'Fire Department',
    pendingAction: 'Site inspection & hydrant testing',
    delayReason: 'Inspection not completed due to rain schedule reschedule',
    dateReceived: '2026-08-25',
    lastUpdatedDateTime: '12 Sept 2026, 09:00 AM',
    pendingDocs: ['Fire Hydrant Pressure Test Certificate'],
    queriesCount: 0,
    inspectionDate: '2026-09-18 11:00 AM',
    slaDeadlineDate: '2026-09-18',
    slaDaysRemaining: 0,
    dependencies: ['fire-noc'],
    submittedDate: '2026-08-25',
    lastUpdatedDate: '2026-09-02',
    remarks: 'Physical inspection delayed: Site audit postponed by Fire Inspectorate.',
    activityHistory: [
      { id: 'act-7', timestamp: '2026-08-25 03:00 PM', actor: 'Rahul Sharma', department: 'Entrepreneur', action: 'Applied for Final Fire Clearance', notes: 'Final certificate requested.' },
      { id: 'act-8', timestamp: '2026-09-10 09:00 AM', actor: 'Officer Sunita Rane', department: 'Maharashtra Fire Services', action: 'Marked Delayed', notes: 'Inspection not completed.' }
    ]
  },
  {
    id: 'perm-105',
    projectId: 'proj-1',
    approvalId: 'dish-factory',
    approvalName: 'Factory / Labour Licence (DISH Safety Clearance)',
    department: 'Directorate of Industrial Safety & Health (DISH)',
    category: 'Safety',
    assignedOfficer: 'Inspector A. B. Kadam',
    officerEmail: 'ab.kadam@dish.maharashtra.gov.in',
    status: 'Blocked by Dependency',
    pendingWith: 'MPCB Department',
    pendingAction: 'Waiting for prerequisite MPCB Pollution Consent approval',
    dateReceived: '2026-08-15',
    lastUpdatedDateTime: '15 Aug 2026, 05:00 PM',
    pendingDocs: [],
    queriesCount: 0,
    slaDeadlineDate: '2026-10-10',
    slaDaysRemaining: 28,
    dependencies: ['mpcb-cte', 'fire-noc'],
    blockedBy: ['MPCB Consent to Establish (CTE)'],
    submittedDate: '2026-08-15',
    lastUpdatedDate: '2026-08-15',
    remarks: 'Auto-blocked: Awaiting final approval of MPCB Consent to Establish (CTE).'
  },
  {
    id: 'perm-106',
    projectId: 'proj-1',
    approvalId: 'msedcl-power',
    approvalName: 'Electricity Connection (MSEDCL 11kV Grid Load)',
    department: 'Maharashtra State Electricity Distribution Co Ltd (MSEDCL)',
    category: 'Utility',
    assignedOfficer: 'Er. R. N. Deshpande',
    officerEmail: 'rn.deshpande@mahadiscom.in',
    status: 'Approved',
    pendingWith: 'Completed',
    pendingAction: 'Transformer energization complete',
    dateReceived: '2026-08-05',
    lastUpdatedDateTime: '22 Aug 2026, 01:00 PM',
    pendingDocs: [],
    queriesCount: 0,
    slaDeadlineDate: '2026-08-25',
    slaDaysRemaining: 0,
    dependencies: [],
    submittedDate: '2026-08-05',
    lastUpdatedDate: '2026-08-22',
    remarks: '500 kVA Transformer load sanctioned. Substation energization complete.'
  },
  {
    id: 'perm-107',
    projectId: 'proj-1',
    approvalId: 'fssai-licence',
    approvalName: 'Food Licence (Central FSSAI Processing Licence)',
    department: 'Food Safety & Standards Authority (FSSAI)',
    category: 'Registration',
    assignedOfficer: 'Officer Meena Thorat',
    officerEmail: 'm.thorat@fssai.gov.in',
    status: 'More Information Needed',
    pendingWith: 'Entrepreneur',
    pendingAction: 'Upload NABL Accredited Lab Water Test Report',
    dateReceived: '2026-08-20',
    lastUpdatedDateTime: '08 Sept 2026, 03:20 PM',
    pendingDocs: ['Water Test Report from NABL Accredited Lab'],
    queriesCount: 1,
    openQueries: [
      {
        id: 'q-fssai-1',
        queryCategory: 'Water Quality Analysis',
        queryText: 'Please submit recent NABL lab test report for heavy metals and coliform count in processing water supply.',
        raisedDate: '2026-09-08',
        dueDate: '2026-09-22'
      }
    ],
    slaDeadlineDate: '2026-09-28',
    slaDaysRemaining: 16,
    dependencies: [],
    submittedDate: '2026-08-20',
    lastUpdatedDate: '2026-09-08',
    remarks: 'Query issued regarding water potability test parameters.'
  }
];


