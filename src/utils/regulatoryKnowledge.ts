export interface RegulatoryKnowledgeItem {
  id: string;
  actName: string;
  department: string;
  topic: string;
  keywords: string[];
  whyRequired: string;
  requiredDocuments: string[];
  processSteps: string[];
  timelineDays: number;
  statutoryFee: string;
  detailedClauses: string[];
  applicableSectors: string[];
  marathi: {
    whyRequired: string;
    requiredDocuments: string[];
    processSteps: string[];
    timeline: string;
  };
  hindi: {
    whyRequired: string;
    requiredDocuments: string[];
    processSteps: string[];
    timeline: string;
  };
}

export const MAHARASHTRA_REGULATORY_KNOWLEDGE: RegulatoryKnowledgeItem[] = [
  {
    id: 'mpcb-cte-cto',
    actName: 'Water (Prevention and Control of Pollution) Act, 1974 & Air (Prevention and Control of Pollution) Act, 1981',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    topic: 'Pollution Categorization & Consent to Establish (CTE) / Operate (CTO)',
    keywords: ['pollution', 'mpcb', 'cte', 'consent to establish', 'cto', 'consent to operate', 'effluent', 'etp', 'emissions', 'red category', 'orange category', 'green category', 'white category'],
    whyRequired: 'Mandatory environmental clearance ensuring industrial discharge (liquid effluents & gaseous stack emissions) complies with Maharashtra pollution prevention standards before civil construction or commencement of production.',
    requiredDocuments: [
      'Site Layout Plan with Drainage & Effluent Treatment Plant (ETP) Schematics',
      'Manufacturing Process Flowchart with Material Balance & Water Balance',
      'Capital Investment Certificate from Chartered Accountant (CA)',
      'MIDC Allotment Letter / Land Possession Receipt / Revenue NA Order',
      'NOC from Local Municipal Council / Gram Panchayat',
      'Hazardous Waste Management Plan (for Red & Orange categories)'
    ],
    processSteps: [
      'Step 1: Determine Industry Category (Red / Orange / Green / White) based on Pollution Index Score.',
      'Step 2: Submit online application on Maharashtra Single Window Portal with CA Investment Certificate & ETP drawings.',
      'Step 3: Pay statutory scrutiny fee via GRAS payment gateway.',
      'Step 4: MPCB Sub-Regional Officer (SRO) desk scrutiny & site physical verification within 15-30 days.',
      'Step 5: Consent Committee review & grant of Consent to Establish (CTE) valid for 5 years.'
    ],
    timelineDays: 45,
    statutoryFee: '₹25,000 to ₹1,50,000 (tiered by Capital Investment)',
    detailedClauses: [
      'Section 25 of Water Act 1974: No person shall establish any industry likely to discharge sewage or trade effluent without prior consent of the State Board.',
      'Section 21 of Air Act 1981: Operating industrial plants in air pollution control areas requires explicit board consent and compliant stack heights.',
      'Red Category Threshold (Pollution Index > 60): High pollution potential. Requires Continuous Online Emission Monitoring System (OCEMS) with server integration.',
      'Orange Category Threshold (Pollution Index 41-59): Secondary biological effluent treatment required with standard BOD/COD parameters (< 30 mg/L BOD).'
    ],
    applicableSectors: ['Chemical', 'Pharmaceutical', 'Food Processing', 'Textile', 'Manufacturing', 'Packaging'],
    marathi: {
      whyRequired: 'कारखान्यातील सांडपाणी आणि धुराचे प्रदूषण रोखण्यासाठी आणि महाराष्ट्र प्रदूषण नियंत्रण मंडळाच्या मानकांचे पालन करण्यासाठी Consent to Establish (CTE) घेणे कायद्याने बंधनकारक आहे.',
      requiredDocuments: [
        'ईटीपी (ETP) सांडपाणी प्रक्रिया प्रकल्पाचा नकाशा व लेआउट',
        'उत्पादन प्रक्रिया प्रवाह तक्ता (Process Flowchart)',
        'सीए (CA) कडून भांडवली गुंतवणूक प्रमाणपत्र',
        'एमआयडीसी भूखंड वाटप पत्र / ७/१२ उतारा',
        'स्थानिक स्वराज्य संस्था किंवा ग्रामपंचायत ना-हरकत प्रमाणपत्र'
      ],
      processSteps: [
        '१. प्रदूषण निर्देशांकानुसार उद्योगाचे वर्गीकरण (Red/Orange/Green/White) निश्चित करणे.',
        '२. सिंगल विंडो पोर्टलवर ऑनलाइन अर्ज व आवश्यक कागदपत्रे अपलोड करणे.',
        '३. GRAS प्रणालीद्वारे शासकीय शुल्क भरणे.',
        '४. MPCB क्षेत्रीय अधिकाऱ्यांमार्फत जागेची प्रत्यक्ष पाहणी व तांत्रिक तपासणी.',
        '५. समितीच्या मंजुरीनंतर ५ वर्षांसाठी वैध CTE प्रमाणपत्र जारी करणे.'
      ],
      timeline: '४५ दिवस (SLA कालावधी)'
    },
    hindi: {
      whyRequired: 'उद्योग से निकलने वाले अपशिष्ट जल और उत्सर्जन को नियंत्रित करने के लिए निर्माण शुरू करने से पहले MPCB से स्थापना सहमति (CTE) लेना अनिवार्य है।',
      requiredDocuments: [
        'ETP अपशिष्ट जल उपचार संयंत्र का नक्शा',
        'उत्पादन प्रक्रिया फ्लोचार्ट और सामग्री संतुलन',
        'चार्टर्ड एकाउंटेंट (CA) निवेश प्रमाण पत्र',
        'MIDC भूमि आवंटन पत्र',
        'स्थानीय प्राधिकरण एनओसी'
      ],
      processSteps: [
        '१. प्रदूषण सूचकांक के आधार पर श्रेणी (Red/Orange/Green) चुनना।',
        '२. ऑनलाइन पोर्टल पर आवेदन और दस्तावेज जमा करना।',
        '३. सरकारी फीस का भुगतान करना।',
        '४. अधिकारी द्वारा स्थल निरीक्षण।',
        '५. 45 दिनों के भीतर CTE प्रमाण पत्र जारी करना।'
      ],
      timeline: '45 दिन (SLA अवधि)'
    }
  },
  {
    id: 'dish-factory-licence',
    actName: 'Factories Act, 1948 & Maharashtra Factories Rules, 1963',
    department: 'Directorate of Industrial Safety & Health (DISH), Maharashtra',
    topic: 'Factory Plan Approval & Factory Licence (Form 1)',
    keywords: ['factory licence', 'dish', 'factories act', 'form 1', 'worker safety', 'machinery', 'safety audit', 'workers', 'occupational health', 'threshold'],
    whyRequired: 'Statutory registration ensuring workplace safety, adequate ventilation, emergency exits, machine guarding, and employee welfare for industrial manufacturing premises employing 10+ workers with power.',
    requiredDocuments: [
      'Architectural Factory Building Plans (1:100 scale) with Machinery Layout & Fire Exits',
      'Structural Stability Certificate issued by Licensed Chartered Structural Engineer',
      'Form 1 Application with list of Partners / Directors & Form 2 Notice of Occupier',
      'Electricity Sanction Letter / Connected Load Agreement (MSEDCL/Tata Power)',
      'MPCB Consent to Establish (CTE) Copy',
      'Provisional Fire Safety NOC / Form A Certificate'
    ],
    processSteps: [
      'Step 1: Submit architectural factory shed drawings for Section 6 Plan Approval.',
      'Step 2: DISH Joint Director desk scrutiny for emergency egress, natural lighting, and machine clearances.',
      'Step 3: Pay licence fee calculated on installed horsepower (HP) and maximum workers count.',
      'Step 4: Conduct factory trial run with machinery guards and first-aid facilities installed.',
      'Step 5: Grant of Factory Licence Form 1 with registration number.'
    ],
    timelineDays: 30,
    statutoryFee: '₹4,000 to ₹40,000 (based on HP and worker count)',
    detailedClauses: [
      'Section 2(m): Applicable to any manufacturing unit employing 10 or more workers with electric power, or 20 or more without power.',
      'Section 38: Precautions in case of fire (free passage, emergency exits opening outward, audible alarms).',
      'Section 45: First-aid boxes maintained by certified personnel (1 box per 150 workers).',
      'Section 46: Dedicated factory canteen mandatory if worker strength exceeds 250.'
    ],
    applicableSectors: ['Manufacturing', 'Chemical', 'Pharmaceutical', 'Food Processing', 'Textile', 'Packaging'],
    marathi: {
      whyRequired: '१० किंवा त्याहून अधिक कामगार आणि वीज वापरणाऱ्या प्रत्येक कारखान्यामध्ये कामगारांची सुरक्षा, आरोग्य आणि सुरक्षित कार्यस्थळ सुनिश्चित करण्यासाठी कारखाना परवाना आवश्यक आहे.',
      requiredDocuments: [
        'मशिनरी लेआउट आणि आपत्कालीन मार्गांचा नकाशा',
        'स्ट्रक्चरल इंजिनिअरकडून इमारत स्थैर्य प्रमाणपत्र (Stability Certificate)',
        'फॉर्म १ (Form 1) अर्ज आणि संचालक यादी',
        'वीज जोडणी मंजुरी पत्र',
        'MPCB आणि फायर एनओसी प्रमाणपत्र'
      ],
      processSteps: [
        '१. कारखाना नकाशा मंजुरीसाठी (Plan Approval) ऑनलाइन अर्ज करणे.',
        '२. DISH अधिकाऱ्यांमार्फत सुरक्षितता व वायुवीजन तपासणी.',
        '३. कामगार संख्या आणि हॉर्सपॉवरनुसार शासकीय फी भरणे.',
        '४. कारखाना तपासणीनंतर फॉर्म १ परवाना जारी करणे.'
      ],
      timeline: '३० दिवस'
    },
    hindi: {
      whyRequired: '10 या अधिक कर्मचारियों वाले कारखानों में श्रमिक सुरक्षा और कल्याण सुनिश्चित करने के लिए DISH कारखाना लाइसेंस अनिवार्य है।',
      requiredDocuments: [
        'फैक्ट्री बिल्डिंग और मशीनरी लेआउट प्लान',
        'स्ट्रक्चरल स्टेबिलिटी सर्टिफिकेट',
        'फॉर्म 1 आवेदन पत्र',
        'बिजली कनेक्शन स्वीकृति पत्र'
      ],
      processSteps: [
        '१. नक्शा पास कराने हेतु आवेदन करना।',
        '२. सुरक्षा मानकों की जांच।',
        '३. लाइसेंस फीस जमा करना।',
        '४. फॉर्म 1 फैक्ट्री लाइसेंस प्राप्त करना।'
      ],
      timeline: '30 दिन'
    }
  },
  {
    id: 'fire-safety-noc',
    actName: 'Maharashtra Fire Prevention and Life Safety Measures Act, 2006',
    department: 'Maharashtra Fire Services & MIDC Fire Department',
    topic: 'Provisional and Final Fire NOC Compliance',
    keywords: ['fire noc', 'fire safety', 'sprinkler', 'hydrant', 'form a', 'form b', 'fire audit', 'midc fire', 'fire fighting', 'fire'],
    whyRequired: 'Ensures industrial and commercial buildings are equipped with adequate static water storage, automatic fire sprinklers, wet riser hydrants, and peripheral fire engine driveways to protect life and property.',
    requiredDocuments: [
      'Architectural Site Plan showing 6.0-meter clear peripheral motorable driveway',
      'Hydraulic Fire Fighting System Layout (pumps, ring mains, hydrants, hose reels, yard hydrants)',
      'Static Fire Water Storage Underground/Overhead Tank Details (min 50,000L to 1,00,000L)',
      'Hazardous Material & Chemical Storage Inventory with Material Safety Data Sheets (MSDS)',
      'Licensed Fire Consultant Form A Certificate'
    ],
    processSteps: [
      'Step 1: Submit architectural blueprints with fire fighting schematic for Provisional Fire NOC.',
      'Step 2: Obtain Provisional Fire NOC to proceed with MIDC Building Plan Sanction and construction.',
      'Step 3: Install all certified fire protection systems (pumps, riser pipelines, detectors, alarm panels).',
      'Step 4: Apply for Final Fire NOC and schedule Joint Multi-Agency Site Physical Testing.',
      'Step 5: Physical flow & pressure testing (min 3.5 bar at highest hydrant point) and grant of Final Fire NOC.'
    ],
    timelineDays: 30,
    statutoryFee: '₹10 per sq.m built-up area (Fire Premium / Scrutiny Fee)',
    detailedClauses: [
      'Section 3: Mandatory for all industrial buildings exceeding 500 sq.m or height exceeding 15 meters to obtain Fire NOC.',
      'Rule 4(1): Periodic maintenance and submission of Form B certificate by Licensed Fire Agency twice every year (January and July).',
      'IS 3844 / NBC 2016 Part 4: Installation of diesel standby pump ensuring uninterrupted fire water pressure during grid power failures.'
    ],
    applicableSectors: ['Manufacturing', 'Chemical', 'Pharmaceutical', 'Food Processing', 'Textile', 'Packaging', 'Retail'],
    marathi: {
      whyRequired: 'औद्योगिक इमारतीमध्ये आग प्रतिबंधक यंत्रणा, आपत्कालीन मार्ग आणि अग्निशामक वाहनांसाठी रस्ता सुरक्षित ठेवण्यासाठी फायर एनओसी अनिवार्य आहे.',
      requiredDocuments: [
        '६ मीटर फायर ड्राइव्हे दर्शवणारा साईट प्लान',
        'अग्निशामक यंत्रणा व हायड्रंट पाईपलाईन नकाशा',
        'अग्निशामक पाण्याच्या टाकीचा तपशील (किमान ५०,००० लिटर)',
        'परवानाधारक फायर एजन्सीचे फॉर्म ए प्रमाणपत्र'
      ],
      processSteps: [
        '१. बांधकामापूर्वी प्राथमिक (Provisional) फायर एनओसी घेणे.',
        '२. इमारतीचे बांधकाम आणि अग्निशामक यंत्रणा बसवणे.',
        '३. प्रत्यक्ष पाण्याचा दाब व पंपांची चाचणी करणे.',
        '४. अंतिम (Final) फायर एनओसी प्राप्त करणे.'
      ],
      timeline: '३० दिवस'
    },
    hindi: {
      whyRequired: 'आग से सुरक्षा और आपातकालीन निकासी सुनिश्चित करने के लिए 500 वर्ग मीटर से बड़े औद्योगिक शेड के लिए फायर एनओसी अनिवार्य है।',
      requiredDocuments: [
        '6 मीटर चौड़े फायर रोड का नक्शा',
        'फायर हाइड्रेंट और स्प्रिंकलर लेआउट',
        'पानी के टैंक का विवरण'
      ],
      processSteps: [
        '१. निर्माण से पहले प्रोविजनल फायर एनओसी लेना।',
        '२. अग्निशमन प्रणाली स्थापित करना।',
        '३. भौतिक परीक्षण के बाद फाइनल फायर एनओसी प्राप्त करना।'
      ],
      timeline: '30 दिन'
    }
  },
  {
    id: 'psi-2019-scheme',
    actName: 'Maharashtra Package Scheme of Incentives (PSI 2019)',
    department: 'Directorate of Industries, Maharashtra',
    topic: 'State Industrial Subsidies, SGST Rebate & Power Duty Exemption',
    keywords: ['subsidy', 'incentive', 'psi 2019', 'capital subsidy', 'sgst refund', 'electricity duty exemption', 'interest subsidy', 'zone c', 'zone d', 'cmegp', 'eligible'],
    whyRequired: 'Financial assistance policy by Maharashtra Government to promote industrialization in developing zones (Vidarbha, Marathwada, North Maharashtra, Konkan, and Zone C/D areas of Western Maharashtra).',
    requiredDocuments: [
      'Udyam Registration Certificate (for MSME) / Industrial IEM Acknowledgement',
      'Detailed Project Report (DPR) with Fixed Capital Investment (FCI) Breakup',
      'Bank Term Loan Sanction Letter & Disbursement Certificate',
      'Land Purchase Deed / MIDC Lease Deed',
      'MPCB Consent to Operate (CTO) & Factory Licence (to claim initial disbursement)'
    ],
    processSteps: [
      'Step 1: Obtain Eligibility Certificate (EC) from District Industries Centre (DIC) or Joint Director of Industries.',
      'Step 2: Commence commercial production within prescribed period (3 years for Micro/Small, 4 years for Medium).',
      'Step 3: Submit annual SGST refund claims through Single Window Portal.',
      'Step 4: Receive 50% to 80% FCI fiscal basket as direct bank account disbursement over 7-10 years.'
    ],
    timelineDays: 60,
    statutoryFee: 'Nil (Free Government Scheme)',
    detailedClauses: [
      'Zone C Benefits: 50% of Eligible Fixed Capital Investment (FCI) over 7 years; 100% Electricity Duty Exemption for 7 years.',
      'Zone D & D+ Benefits: 60% to 80% FCI over 10 years; Interest subvention @ 5% on term loan up to ₹10 Lakhs/year.',
      'Special Sector Thrust: Agro & Food Processing, Clean Energy, EV Components receive additional +20% subsidy ceiling.',
      'Stamp Duty: 100% stamp duty exemption on industrial land acquisition in notified MIDC and private industrial zones.'
    ],
    applicableSectors: ['Food Processing', 'Manufacturing', 'Textile', 'Chemical', 'Pharmaceutical', 'Packaging', 'IT / IT-enabled Services'],
    marathi: {
      whyRequired: 'महाराष्ट्र शासनाच्या PSI 2019 योजनेअंतर्गत उद्योजकांना भांडवली गुंतवणूक अनुदान, SGST परतावा आणि वीज शुल्क सवलत देऊन उद्योग उभारणीत आर्थिक सहकार्य करणे.',
      requiredDocuments: [
        'उद्यम नोंदणी (Udyam Registration)',
        'सविस्तर प्रकल्प अहवाल (DPR)',
        'बँक मुदत कर्ज मंजुरी पत्र',
        'जागेचा खरेदी खत / एमआयडीसी भाडेकरार',
        'MPCB व कारखाना परवाना'
      ],
      processSteps: [
        '१. जिल्हा उद्योग केंद्र (DIC) कडून पात्रता प्रमाणपत्र (Eligibility Certificate) मिळवणे.',
        '२. विहित मुदतीत व्यावसायिक उत्पादन सुरू करणे.',
        '३. दरवर्षी SGST परतावा व वीज शुल्क माफीचा दावा करणे.'
      ],
      timeline: '६० दिवस (पात्रता प्रमाणपत्र मंजुरी)'
    },
    hindi: {
      whyRequired: 'महाराष्ट्र में उद्योगों को बढ़ावा देने के लिए पूंजीगत सब्सिडी, SGST रिफंड और बिजली शुल्क में 100% छूट प्रदान करना।',
      requiredDocuments: [
        'उद्यम रजिस्ट्रेशन सर्टिफिकेट',
        'विस्तृत परियोजना रिपोर्ट (DPR)',
        'बैंक ऋण स्वीकृति पत्र'
      ],
      processSteps: [
        '१. जिला उद्योग केंद्र (DIC) से पात्रता प्रमाण पत्र प्राप्त करना।',
        '२. उत्पादन शुरू करना और वार्षिक सब्सिडी क्लेम करना।'
      ],
      timeline: '60 दिन'
    }
  },
  {
    id: 'fssai-licence',
    actName: 'Food Safety and Standards Act, 2006',
    department: 'Food Safety and Standards Authority of India (FSSAI) & FDA Maharashtra',
    topic: 'Food Manufacturing, Hygiene Audits & State Licence',
    keywords: ['fssai', 'food licence', 'food safety', 'fda', 'food processing', 'spices', 'edible oil', 'hygiene', 'fostac', 'food'],
    whyRequired: 'Mandatory statutory authorization for any food processing, packing, or manufacturing unit ensuring food hygiene, adulteration control, and consumer safety per FSSR regulations.',
    requiredDocuments: [
      'Layout Plan of the Food Processing Unit with Dimensions & Segregated Processing Areas',
      'List of Equipment and Machinery with Installed Capacities & HP',
      'Water Potability Test Report from NABL Accredited Laboratory',
      'Food Safety Management System (FSMS) Plan or ISO 22000 Certificate',
      'Medical Fitness Certificates & FoSTaC Training Certificates of Food Handlers'
    ],
    processSteps: [
      'Step 1: Check threshold - Annual Turnover up to ₹12 Lakhs (Registration), ₹12L to ₹20 Cr (State Licence), > ₹20 Cr (Central Licence).',
      'Step 2: Submit online application on FoSCoS portal with Water Test Report and Equipment List.',
      'Step 3: Food Safety Officer (FSO) physical hygiene audit of the processing facility.',
      'Step 4: Grant of 14-digit FSSAI Licence Number valid for 1 to 5 years.'
    ],
    timelineDays: 30,
    statutoryFee: '₹2,000 to ₹5,000 / year (State Manufacturing Licence)',
    detailedClauses: [
      'Schedule 4 Hygiene Standards: Strict segregation between raw material storage, processing, and finished packaging bays.',
      'Section 31: Commencing food manufacturing without FSSAI licence attracts imprisonment up to 6 months and penalty up to ₹5 Lakhs.',
      'Annual Returns: Form D-1 mandatory filing before 31st May of each fiscal year.'
    ],
    applicableSectors: ['Food Processing', 'Retail'],
    marathi: {
      whyRequired: 'अन्न प्रक्रिया आणि उत्पादन करणाऱ्या प्रत्येक युनिटसाठी अन्न सुरक्षा आणि मानके कायदा २००६ नुसार FSSAI परवाना घेणे कायद्याने बंधनकारक आहे.',
      requiredDocuments: [
        'अन्न प्रक्रिया प्रकल्पाचा लेआउट',
        'मशिनरी यादी आणि क्षमता',
        'पाण्याचा प्रयोगशाळा चाचणी अहवाल (Potability Report)',
        'कामगारांचे वैद्यकीय तपासणी प्रमाणपत्र'
      ],
      processSteps: [
        '१. FoSCoS पोर्टलवर ऑनलाइन अर्ज करणे.',
        '२. अन्न सुरक्षा अधिकाऱ्यांमार्फत स्वच्छता तपासणी.',
        '३. १४ अंकी FSSAI परवाना क्रमांक प्राप्त करणे.'
      ],
      timeline: '३० दिवस'
    },
    hindi: {
      whyRequired: 'खाद्य प्रसंस्करण और निर्माण इकाइयों के लिए खाद्य सुरक्षा और गुणवत्ता सुनिश्चित करने हेतु FSSAI लाइसेंस अनिवार्य है।',
      requiredDocuments: [
        'फूड प्रोसेसिंग यूनिट का लेआउट',
        'मशीनरी लिस्ट और क्षमता',
        'पानी की जांच रिपोर्ट'
      ],
      processSteps: [
        '१. FoSCoS पोर्टल पर ऑनलाइन आवेदन।',
        '२. खाद्य सुरक्षा अधिकारी द्वारा निरीक्षण।',
        '३. 14 अंकों का FSSAI लाइसेंस प्राप्त करना।'
      ],
      timeline: '30 दिन'
    }
  }
];

/**
 * Client & Server shared Regulatory RAG Engine
 */
export function queryRegulatoryRAG(
  query: string,
  projectContext?: {
    sector?: string;
    district?: string;
    investmentRange?: string;
    employeeCount?: number;
    businessName?: string;
  },
  language: 'en' | 'mr' | 'hi' = 'en'
): {
  matches: RegulatoryKnowledgeItem[];
  answer: string;
  statutoryCitations: string[];
  topic: string;
} {
  const qLower = query.toLowerCase();

  const isWhy = qLower.includes('why') || qLower.includes('reason') || qLower.includes('कशासाठी') || qLower.includes('का') || qLower.includes('क्यों');
  const isDocs = qLower.includes('document') || qLower.includes('papers') || qLower.includes('कागदपत्रे') || qLower.includes('दस्तावेज') || qLower.includes('checklist') || qLower.includes('which approvals') || qLower.includes('approvals do i need');
  const isProcess = qLower.includes('process') || qLower.includes('step') || qLower.includes('how to') || qLower.includes('कशी') || qLower.includes('प्रक्रिया') || qLower.includes('steps');
  const isFeeTimeline = qLower.includes('time') || qLower.includes('fee') || qLower.includes('cost') || qLower.includes('दिवस') || qLower.includes('शुल्क') || qLower.includes('फी') || qLower.includes('कितने') || qLower.includes('how long');
  const isIncentive = qLower.includes('incentive') || qLower.includes('subsidy') || qLower.includes('psi') || qLower.includes('अनुदान') || qLower.includes('योजना') || qLower.includes('छूट') || qLower.includes('eligible');

  const scored = MAHARASHTRA_REGULATORY_KNOWLEDGE.map(item => {
    let score = 0;
    for (const kw of item.keywords) {
      if (qLower.includes(kw)) score += 3;
    }
    if (projectContext?.sector && item.applicableSectors.includes(projectContext.sector)) {
      score += 2;
    }
    if (qLower.includes(item.department.toLowerCase()) || qLower.includes(item.topic.toLowerCase())) {
      score += 4;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const bestMatch = scored[0].score > 0 ? scored[0].item : MAHARASHTRA_REGULATORY_KNOWLEDGE[0];
  const citations = [bestMatch.actName, bestMatch.department];

  let answer = '';

  if (language === 'mr') {
    if (isWhy) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📌 **हा परवाना कशासाठी आवश्यक आहे?**\n${bestMatch.marathi.whyRequired}\n\n⚖️ **वैधानिक नियम:**\n${bestMatch.detailedClauses[0]}`;
    } else if (isDocs) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📄 **आवश्यक कागदपत्रांची यादी:**\n${bestMatch.marathi.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\n⏱️ **SLA मंजुरी कालावधी:** ${bestMatch.marathi.timeline}`;
    } else if (isProcess) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n🔄 **अर्ज करण्याची टप्प्याटप्प्याने प्रक्रिया (Step-by-Step SOP):**\n${bestMatch.marathi.processSteps.join('\n')}\n\n⏱️ **कालावधी:** ${bestMatch.marathi.timeline}`;
    } else if (isFeeTimeline) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n⏱️ **मंजुरी कालावधी (SLA Timeline):** ${bestMatch.timelineDays} दिवस\n💰 **शासकीय शुल्क (Statutory Fee):** ${bestMatch.statutoryFee}\n\n📌 **कागदपत्रे:**\n${bestMatch.marathi.requiredDocuments.slice(0, 3).map(d => `• ${d}`).join('\n')}`;
    } else {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n${bestMatch.marathi.whyRequired}\n\n📄 **प्रमुख कागदपत्रे:**\n${bestMatch.marathi.requiredDocuments.slice(0, 4).map(d => `• ${d}`).join('\n')}\n\n⏱️ **कालावधी व शुल्क:** ${bestMatch.timelineDays} दिवस • ${bestMatch.statutoryFee}`;
    }
  } else if (language === 'hi') {
    if (isWhy) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📌 **यह मंजूरी क्यों आवश्यक है?**\n${bestMatch.hindi.whyRequired}\n\n⚖️ **सांविधिक नियम:**\n${bestMatch.detailedClauses[0]}`;
    } else if (isDocs) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📄 **आवश्यक दस्तावेजों की सूची:**\n${bestMatch.hindi.requiredDocuments.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\n⏱️ **SLA समय सीमा:** ${bestMatch.hindi.timeline}`;
    } else {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n${bestMatch.hindi.whyRequired}\n\n📄 **आवश्यक दस्तावेज:**\n${bestMatch.hindi.requiredDocuments.map(d => `• ${d}`).join('\n')}\n\n⏱️ **समय सीमा और शुल्क:** ${bestMatch.timelineDays} दिन • ${bestMatch.statutoryFee}`;
    }
  } else {
    // English
    if (isWhy) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📌 **Why is this approval required?**\n${bestMatch.whyRequired}\n\n⚖️ **Statutory Clause Basis:**\n${bestMatch.detailedClauses.slice(0, 2).map(c => `• ${c}`).join('\n')}\n\n💡 **Application Tip for ${projectContext?.businessName || 'Your Business'}**: Ensure your submitted plant layout complies with these standards before starting construction.`;
    } else if (isDocs) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n📄 **Mandatory Document Checklist for Submission:**\n${bestMatch.requiredDocuments.map((d, i) => `${i + 1}. **${d}**`).join('\n')}\n\n⏱️ **Official SLA Approval Timeline:** ${bestMatch.timelineDays} Days\n💰 **Estimated Statutory Fee:** ${bestMatch.statutoryFee}`;
    } else if (isProcess) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n🔄 **Step-by-Step Approval Process (SOP):**\n${bestMatch.processSteps.join('\n')}\n\n⏱️ **SLA Commitment:** Guaranteed decision within **${bestMatch.timelineDays} Days** under the Maharashtra Right to Services Act.`;
    } else if (isFeeTimeline) {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n⏱️ **Statutory SLA Timeline:** **${bestMatch.timelineDays} Days**\n💰 **Government Fee Structure:** **${bestMatch.statutoryFee}**\n\n📌 **Key Prerequisite:**\n${bestMatch.detailedClauses[0]}`;
    } else if (isIncentive) {
      const psi = MAHARASHTRA_REGULATORY_KNOWLEDGE.find(k => k.id === 'psi-2019-scheme') || bestMatch;
      answer = `🏛️ **${psi.actName}** (${psi.department})\n\n💰 **State Incentive Eligibility for ${projectContext?.businessName || 'Your Business'} (${projectContext?.district || 'Maharashtra'}):**\n• **Capital Subsidy (IPS)**: 50% to 80% of eligible Fixed Capital Investment refunded over 7 to 10 years.\n• **Electricity Duty Exemption**: 100% exemption for 7 years.\n• **Interest Subvention**: 5% interest relief on MSME term loans up to ₹10 Lakhs/year.\n• **Stamp Duty Waiver**: 100% exemption on MIDC / private industrial land deeds.\n\n📄 **Required Documents**: Udyam Registration, DPR with Investment Breakup, and Bank Loan Sanction.`;
    } else {
      answer = `🏛️ **${bestMatch.actName}** (${bestMatch.department})\n\n${bestMatch.whyRequired}\n\n📄 **Key Documents Needed:**\n${bestMatch.requiredDocuments.slice(0, 4).map(d => `• ${d}`).join('\n')}\n\n⏱️ **Timeline & Fee:** ${bestMatch.timelineDays} Days • ${bestMatch.statutoryFee}\n\n⚖️ **Legal Provision:** ${bestMatch.detailedClauses[0]}`;
    }
  }

  return {
    matches: [bestMatch],
    answer,
    statutoryCitations: citations,
    topic: bestMatch.topic
  };
}
