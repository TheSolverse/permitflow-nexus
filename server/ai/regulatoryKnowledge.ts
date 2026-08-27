export interface RegulatoryKnowledgeItem {
  id: string;
  actName: string;
  department: string;
  topic: string;
  keywords: string[];
  summary: string;
  detailedClauses: string[];
  applicableSectors: string[];
  marathiSummary?: string;
  hindiSummary?: string;
}

export const MAHARASHTRA_REGULATORY_KNOWLEDGE: RegulatoryKnowledgeItem[] = [
  {
    id: 'psi-2019',
    actName: 'Package Scheme of Incentives (PSI 2019)',
    department: 'Directorate of Industries, Maharashtra',
    topic: 'Industrial Subsidies & Capital Incentives',
    keywords: ['subsidy', 'incentive', 'psi', 'capital subsidy', 'electricity duty', 'interest subvention', 'zone c', 'zone d', 'zone a', 'cpmegp'],
    summary: 'Provides fiscal incentives to MSMEs and Large Enterprises categorized by development zones (A, B, C, D, D+). Eligible units in Zone C & D receive up to 50%-80% of eligible fixed capital investment (FCI) as basket of incentives over 7 to 10 years.',
    marathiSummary: 'महाराष्ट्र शासन औद्योगिक प्रोत्साहन योजना (PSI 2019) अंतर्गत विदर्भ, मराठवाडा आणि विकास झोन C/D मध्ये गुंतवणूक करणाऱ्या उद्योगांना ५०% ते ८०% भांडवली अनुदान, वीज शुल्क माफी आणि व्याज सवलत मिळते.',
    hindiSummary: 'महाराष्ट्र पैकेज स्कीम ऑफ इंसेंटिव्स (PSI 2019) के तहत जोन C और D में निवेश करने वाली इकाइयों को 50% से 80% तक पूंजीगत सब्सिडी और बिजली शुल्क छूट मिलती है।',
    detailedClauses: [
      'Industrial Promotion Subsidy (IPS): 50% to 100% of gross SGST paid on sales for 7-10 years.',
      'Electricity Duty Exemption: 100% exemption from payment of Electricity Duty for 7 years in Zone C, D, D+ areas.',
      'Interest Subvention: 5% per annum on term loan for Micro, Small and Medium Enterprises up to max ₹10 Lakhs/year for 5 years.',
      'Power Tariff Subsidy: ₹1.00 per unit for 3 years in Vidarbha, Marathwada and North Maharashtra.',
      'Stamp Duty Exemption: 100% exemption on lease deed or acquisition of industrial land in notified MIDC zones.'
    ],
    applicableSectors: ['Manufacturing', 'Food Processing', 'Textile', 'Chemical', 'Pharmaceutical', 'Packaging', 'IT / IT-enabled Services']
  },
  {
    id: 'mpcb-cte-cto',
    actName: 'Water (Prevention and Control of Pollution) Act, 1974 & Air Act, 1981',
    department: 'Maharashtra Pollution Control Board (MPCB)',
    topic: 'Pollution Categorization & Consent to Establish / Operate',
    keywords: ['mpcb', 'pollution', 'consent to establish', 'cte', 'consent to operate', 'cto', 'red category', 'orange category', 'green category', 'white category', 'etp', 'stp', 'hazardous waste'],
    summary: 'All industrial enterprises must obtain Consent to Establish (CTE) before commencing civil construction or erecting machinery. Categorized based on Pollution Index (Red > 60, Orange 41-59, Green 21-40, White < 20).',
    marathiSummary: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB) कडून कारखान्याचे बांधकाम सुरू करण्यापूर्वी Consent to Establish (CTE) आणि उत्पादन सुरू करण्यापूर्वी Consent to Operate (CTO) घेणे अनिवार्य आहे.',
    hindiSummary: 'महाराष्ट्र प्रदूषण नियंत्रण बोर्ड (MPCB) से निर्माण से पहले स्थापना सहमति (CTE) और संचालन शुरू करने से पहले संचालन सहमति (CTO) प्राप्त करना अनिवार्य है।',
    detailedClauses: [
      'Red Category (Pollution Index > 60): High pollution potential (Chemical, Pharma, Distilleries). Mandatory Environmental Clearance (EC) & Comprehensive Effluent Treatment Plant (ETP) with zero liquid discharge (ZLD).',
      'Orange Category (Pollution Index 41-59): Moderate pollution (Food Processing, Textiles, Engineering). Requires secondary biological treatment ETP with STP and stack emissions audit.',
      'Green Category (Pollution Index 21-40): Low pollution (Garment stitching, Electronics assembly). Simplified online CTE with self-declaration within 15 days.',
      'White Category (Pollution Index <= 20): Non-polluting units (Solar assembly, Software). No CTE required; simple intimation suffice.'
    ],
    applicableSectors: ['Chemical', 'Pharmaceutical', 'Food Processing', 'Textile', 'Manufacturing']
  },
  {
    id: 'fire-safety-act',
    actName: 'Maharashtra Fire Prevention and Life Safety Measures Act, 2006',
    department: 'Maharashtra Fire Services & MIDC Fire Department',
    topic: 'Provisional and Final Fire NOC Compliance',
    keywords: ['fire noc', 'provisional fire', 'final fire', 'hydrant', 'sprinkler', 'form a', 'form b', 'fire audit', 'fire safety', 'midc fire'],
    summary: 'Mandates Provisional Fire NOC prior to building plan approval and Final Fire NOC before occupancy for industrial factory sheds exceeding 500 sq.m built-up area or storing hazardous combustibles.',
    marathiSummary: 'महाराष्ट्र अग्निशामक कायदा २००६ नुसार ५०० चौरस मीटरपेक्षा मोठ्या औद्योगिक इमारतींसाठी प्राथमिक (Provisional) आणि अंतिम (Final) फायर एनओसी घेणे बंधनकारक आहे.',
    hindiSummary: 'महाराष्ट्र अग्नि निवारण अधिनियम 2006 के तहत 500 वर्ग मीटर से अधिक के औद्योगिक शेड के लिए अनंतिम और अंतिम फायर एनओसी अनिवार्य है।',
    detailedClauses: [
      'Provisional Fire NOC: Must be applied alongside architectural drawings showing 6-meter peripheral fire driveway and static water storage tank (min 50,000 to 1,00,000 Litres).',
      'Fire Fighting System Standards: Installation of internal wet riser hydrants, auto-sprinklers in storage bays, and heat/smoke detectors per IS:2189.',
      'Final Fire NOC: Issued after physical site joint testing of pumps, pressure headers (min 3.5 kg/cm2 at terrace), and fire exits.',
      'Form B Annual Renewal: Licensed agency bi-annual audit certificate must be submitted in January and July every year.'
    ],
    applicableSectors: ['Manufacturing', 'Chemical', 'Pharmaceutical', 'Packaging', 'Food Processing', 'Textile', 'Retail']
  },
  {
    id: 'dish-factories-act',
    actName: 'Factories Act, 1948 & Maharashtra Factories Rules, 1963',
    department: 'Directorate of Industrial Safety and Health (DISH)',
    topic: 'Factory License, Form 1 & Worker Safety Compliance',
    keywords: ['dish', 'factory licence', 'factories act', 'form 1', 'worker safety', 'safety officer', 'hazardous process', 'first aid', 'welfare'],
    summary: 'Requires factory plan approval and Factory Licence (Form 1) for premises employing 10 or more workers with power, or 20 or more workers without power.',
    marathiSummary: 'कारखाने कायदा १९४८ अंतर्गत १० पेक्षा जास्त कामगार आणि वीज वापरणाऱ्या प्रत्येक उद्योगाला DISH कडून कारखाना परवाना (Factory Licence) घेणे बंधनकारक आहे.',
    hindiSummary: 'फैक्ट्री अधिनियम 1948 के तहत बिजली के साथ 10 या अधिक कर्मचारियों वाले कारखानों के लिए DISH लाइसेंस अनिवार्य है।',
    detailedClauses: [
      'Section 6 (Plan Approval): Building structural stability certificate from chartered structural engineer prior to machine installation.',
      'Section 41-A (Site Appraisal Committee): Mandatory for hazardous processes (Chemical/Pharma/Explosives) to submit on-site emergency disaster management plan.',
      'Welfare Provisions: Canteen required if workers > 250, Ambulance room if workers > 500, Safety Officer required if workers > 1000 or in hazardous units > 100.',
      'Annual Renewal & Returns: Form 27 annual return to be filed by 1st February every calendar year.'
    ],
    applicableSectors: ['Manufacturing', 'Chemical', 'Pharmaceutical', 'Textile', 'Food Processing', 'Packaging']
  },
  {
    id: 'midc-building-regulations',
    actName: 'MIDC Development Control Regulations (DCR 2024)',
    department: 'Maharashtra Industrial Development Corporation (MIDC)',
    topic: 'Industrial Plot Allotment, Building Plan Approval & BCC',
    keywords: ['midc', 'building plan', 'dcr', 'fsi', 'setback', 'bcc', 'possession', 'lease deed', 'plot', 'na sanction'],
    summary: 'Governs industrial plot development within notified MIDC estates across Maharashtra. Controls Floor Space Index (FSI max 1.0 to 1.5), mandatory front setback (9m to 12m), and Building Completion Certificate (BCC).',
    marathiSummary: 'एमआयडीसी (MIDC) विकास नियंत्रण नियमावलीनुसार औद्योगिक भूखंडावर इमारत बांधकाम नकाशा मंजुरी आणि उद्योग सुरू करण्यापूर्वी Building Completion Certificate (BCC) घेणे आवश्यक आहे.',
    hindiSummary: 'MIDC विकास नियंत्रण विनियमों के अनुसार निर्माण कार्य से पहले नक्शा पास कराना और निर्माण पूर्णता प्रमाण पत्र (BCC) लेना अनिवार्य है।',
    detailedClauses: [
      'Building Plan Sanction: Requires architectural CAD drawings, structural calculation vetting, water supply connection blueprint, and tree plantation plan (min 1 tree per 100 sq.m).',
      'Construction Time Limit: Factory construction must be completed and BCC obtained within 3 years (for Phase 1) from possession date to avoid extension penal charges.',
      'FSI Utilization: Standard FSI 1.0; additional premium FSI up to 0.5 available on payment of premium to MIDC.',
      'Sub-letting / Transfer of Plot: Prohibited without prior formal sanction and payment of differential transfer charges.'
    ],
    applicableSectors: ['Manufacturing', 'Chemical', 'Pharmaceutical', 'Textile', 'Packaging', 'Food Processing', 'IT / IT-enabled Services', 'Services', 'Retail']
  }
];

/**
 * Retrieve relevant regulatory knowledge snippets based on user prompt query and project context
 */
export function queryRegulatoryRAG(query: string, projectContext?: { sector?: string; district?: string; investmentRange?: string }, language: 'en' | 'mr' | 'hi' = 'en'): {
  matches: RegulatoryKnowledgeItem[];
  answer: string;
  statutoryCitations: string[];
} {
  const qLower = query.toLowerCase();
  
  // Score knowledge items based on keyword and semantic matches
  const scoredItems = MAHARASHTRA_REGULATORY_KNOWLEDGE.map(item => {
    let score = 0;
    
    // Keyword scoring
    for (const kw of item.keywords) {
      if (qLower.includes(kw)) score += 3;
    }
    
    // Sector bonus
    if (projectContext?.sector && item.applicableSectors.includes(projectContext.sector)) {
      score += 2;
    }
    
    // Topic & Act match
    if (qLower.includes(item.topic.toLowerCase()) || qLower.includes(item.department.toLowerCase())) {
      score += 4;
    }

    return { item, score };
  });

  scoredItems.sort((a, b) => b.score - a.score);
  const bestMatches = scoredItems.filter(s => s.score > 0).map(s => s.item);
  const topMatches = bestMatches.length > 0 ? bestMatches.slice(0, 2) : [MAHARASHTRA_REGULATORY_KNOWLEDGE[0]];

  // Generate statutory grounded response
  const citations = topMatches.map(m => `${m.actName} (${m.department})`);
  
  let answer = '';
  const prime = topMatches[0];

  if (language === 'mr') {
    answer = `${prime.marathiSummary || prime.summary}\n\n📌 **वैधानिक तरतुदी व मार्गदर्शक नियम:**\n${prime.detailedClauses.map(c => `• ${c}`).join('\n')}\n\n🏛️ **सक्षम प्राधिकरण:** ${prime.department}`;
  } else if (language === 'hi') {
    answer = `${prime.hindiSummary || prime.summary}\n\n📌 **सांविधिक प्रावधान और नियम:**\n${prime.detailedClauses.map(c => `• ${c}`).join('\n')}\n\n🏛️ **सक्षम प्राधिकरण:** ${prime.department}`;
  } else {
    answer = `Based on the **${prime.actName}** governed by the **${prime.department}**:\n\n${prime.summary}\n\n📌 **Key Statutory Clauses & Compliance Requirements:**\n${prime.detailedClauses.map(c => `• ${c}`).join('\n')}\n\n💡 **Application Tip for ${projectContext?.sector || 'Industrial'} setup**: Ensure your submitted CAD drawings, ETP schemes, and statutory fee receipts are aligned with these thresholds to avoid desk queries.`;
  }

  return {
    matches: topMatches,
    answer,
    statutoryCitations: citations
  };
}
