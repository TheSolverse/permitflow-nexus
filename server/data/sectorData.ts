import { Sector } from '../types';

export interface SubSectorConfig {
  id: string;
  name: string;
  description: string;
  requiredApprovalIds: string[];
}

export interface SectorConfig {
  id: Sector;
  name: string;
  description: string;
  subSectors: SubSectorConfig[];
}

export const MASTER_SECTOR_DATA: SectorConfig[] = [
  {
    id: 'Manufacturing',
    name: 'Manufacturing',
    description: 'Industrial production, metal fabrication, chemicals, electronics, textiles, and commodities.',
    subSectors: [
      {
        id: 'mfg-metal',
        name: 'Metal products (steel fabrication, structures, utensils)',
        description: 'Steel fabrication, structural engineering, metal utensils, and machinery components.',
        requiredApprovalIds: [
          'appr-7',        // Factory Licence (DISH Maharashtra)
          'appr-8',        // MPCB Consent to Establish (CTE NOC)
          'appr-9',        // MPCB Consent to Operate (CTO)
          'appr-6',        // Fire Safety NOC
          'appr-5',        // MIDC Building Plan Sanction
          'appr-10',       // MSEDCL HT Power Load Sanction
          'appr-14',       // MIDC Water Supply & Sewerage Connection NOC
          'appr-15',       // Electrical Safety Inspectorate HT Grid NOC
          'appr-trade'     // Municipal Trade Licence
        ]
      },
      {
        id: 'mfg-packaged',
        name: 'Packaged commodities (detergents, plastics, household goods)',
        description: 'General non-food consumer packaged goods, plastic containers, detergents, and household products.',
        requiredApprovalIds: [
          'appr-legal-metrology', // Legal Metrology (Packaged Commodities) Registration
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-10',              // MSEDCL Electricity Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'mfg-textiles',
        name: 'Textiles (spinning, weaving, garment manufacturing)',
        description: 'Textile spinning mills, weaving looms, dyeing/finishing units, and garment manufacturing.',
        requiredApprovalIds: [
          'appr-labour-epfo-esic', // Labour Statutory Registrations (EPFO, ESIC & Contract Labour)
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE for dyeing/finishing)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL HT Electricity Load Sanction
          'appr-14',              // MIDC Water Supply & Sewerage Connection NOC
          'appr-15',              // Electrical Safety Inspectorate NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'mfg-chemicals',
        name: 'Chemicals (basic chemicals, formulations, paints, adhesives)',
        description: 'Basic industrial chemicals, solvent formulations, paints, resins, adhesives, and specialty chemicals.',
        requiredApprovalIds: [
          'appr-peso',            // PESO Petroleum & Explosives Safety Approval
          'appr-hazardous-waste', // MPCB Hazardous Waste Authorization (Rule 6)
          'appr-13',              // State Environmental Clearance (EC)
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL HT Electricity Load Sanction
          'appr-14',              // MIDC Water Supply NOC
          'appr-15',              // Electrical Safety Inspectorate NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'mfg-electronics',
        name: 'Electronics (assembly, PCB manufacturing, devices)',
        description: 'Electronic components assembly, PCB surface mounting, smart devices, and hardware manufacturing.',
        requiredApprovalIds: [
          'appr-ewaste',          // MPCB E-Waste Handling & Management Authorization
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL Power Load Sanction
          'appr-14',              // MIDC Water Supply NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      }
    ]
  },
  {
    id: 'Packaging',
    name: 'Packaging',
    description: 'Food and non-food industrial packaging, printing, pouches, bottles, and corrugated boxes.',
    subSectors: [
      {
        id: 'pkg-food',
        name: 'Food packaging (printing, pouches, bottles, containers for food)',
        description: 'Food-grade plastic bottles, flexible pouches, printing, and food contact packaging containers.',
        requiredApprovalIds: [
          'appr-fssai-packaging', // FSSAI Food-Contact Packaging Authorization
          'appr-legal-metrology', // Legal Metrology Registration
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-10',              // MSEDCL Power Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'pkg-nonfood',
        name: 'Non-food packaging (industrial packaging, corrugated boxes, flexible packaging)',
        description: 'Corrugated cartons, industrial stretch wrap, wooden crates, solvents/inks printing packaging.',
        requiredApprovalIds: [
          'appr-solvents-auth',   // Printing Inks & Solvents VOC Emission Authorization
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-10',              // MSEDCL Electricity Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      }
    ]
  },
  {
    id: 'Services',
    name: 'Services',
    description: 'Industrial maintenance, testing laboratories, calibration, warehousing, and business logistics.',
    subSectors: [
      {
        id: 'srv-industrial',
        name: 'Industrial services (maintenance, calibration, testing labs for industry)',
        description: 'NABL accredited testing labs, industrial equipment calibration, machinery repair workshops.',
        requiredApprovalIds: [
          'appr-lab-mpcb-auth',   // MPCB Testing Lab Reagents & Effluent Authorization
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-trade',           // Municipal Trade Licence
          'appr-6',               // Fire Safety NOC
          'appr-10',              // MSEDCL Power Connection
          'appr-14'               // Water Connection NOC
        ]
      },
      {
        id: 'srv-business',
        name: 'Business services (consulting, logistics support, warehousing services)',
        description: 'Supply chain logistics, cold storage, industrial warehousing, and corporate consulting.',
        requiredApprovalIds: [
          'appr-warehouse-hazardous', // Hazardous Cargo Warehousing Storage Approval (if applicable)
          'appr-4',                   // Shops & Establishment (Gumasta)
          'appr-trade',               // Municipal Trade Licence
          'appr-6',                   // Fire Safety NOC (Warehouse)
          'appr-10'                  // MSEDCL Electricity Connection
        ]
      }
    ]
  },
  {
    id: 'Food Processing',
    name: 'Food Processing',
    description: 'Edible oils, spices, packaged foods, ready-to-eat snacks, beverages, and dairy processing.',
    subSectors: [
      {
        id: 'food-oil-spices',
        name: 'Edible oil and spices (processing, refining, packaging)',
        description: 'Spice grinding & blending, edible oil extraction/refining, and commercial packaging.',
        requiredApprovalIds: [
          'appr-agmark',          // AGMARK Quality Grading Registration
          'appr-12',              // FSSAI State Manufacturing Licence
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL Power Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-15',              // Electrical Safety Inspectorate HT Grid NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'food-packaged',
        name: 'Packaged food products (snacks, ready-to-eat, beverages, dairy products)',
        description: 'Ready-to-eat snacks, packaged beverages, confectionery, frozen foods, and bakery items.',
        requiredApprovalIds: [
          'appr-12',              // FSSAI State Manufacturing Licence
          'appr-legal-metrology', // Legal Metrology Pre-Packaged Goods Registration
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL Power Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-15',              // Electrical Safety Inspectorate HT Grid NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      },
      {
        id: 'food-dairy',
        name: 'Milk and dairy processing',
        description: 'Milk chilling centers, pasteurization plants, cheese, butter, and ghee processing units.',
        requiredApprovalIds: [
          'appr-dairy-dept',      // Dairy Processing & Animal Husbandry Department Registration
          'appr-12',              // FSSAI Dairy Manufacturing Licence
          'appr-7',               // Factory Licence (DISH Maharashtra)
          'appr-8',               // MPCB Consent to Establish (CTE)
          'appr-9',               // MPCB Consent to Operate (CTO)
          'appr-6',               // Fire Safety NOC
          'appr-5',               // MIDC Building Plan Sanction
          'appr-10',              // MSEDCL Power Connection
          'appr-14',              // MIDC Water Supply NOC
          'appr-15',              // Electrical Safety Inspectorate HT Grid NOC
          'appr-trade'            // Municipal Trade Licence
        ]
      }
    ]
  },
  {
    id: 'Retail',
    name: 'Retail',
    description: 'General supermarkets, kirana stores, food retail, cafes, restaurants, and cloud kitchens.',
    subSectors: [
      {
        id: 'rtl-general',
        name: 'General retail (shops, supermarkets, kirana stores)',
        description: 'Supermarkets, departmental stores, retail outlets, and kirana shops.',
        requiredApprovalIds: [
          'appr-signage-permit',  // Commercial Signage & Hoarding Permission
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-trade',           // Municipal Trade Licence
          'appr-12',              // FSSAI Retail License (if selling food items)
          'appr-6',               // Fire Safety NOC (if large premises)
          'appr-10'               // Electricity Connection
        ]
      },
      {
        id: 'rtl-food',
        name: 'Food retail (restaurants, cafes, cloud kitchens, food stalls)',
        description: 'Restaurants, cafes, cloud kitchens, quick-service food stalls, and catering services.',
        requiredApprovalIds: [
          'appr-health-license',  // Municipal Commercial Health Department License
          'appr-kitchen-ventilation', // Commercial Kitchen Exhaust & Ventilation Clearance
          'appr-12',              // FSSAI Food Business License
          'appr-liquor-license',  // Maharashtra State Excise License (Conditional)
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-trade',           // Municipal Trade Licence
          'appr-6'                // Fire Safety NOC
        ]
      }
    ]
  },
  {
    id: 'IT / IT-enabled Services',
    name: 'IT / IT-enabled Services',
    description: 'Software development, SaaS startups, IT services, BPO, call centers, and data processing.',
    subSectors: [
      {
        id: 'it-software',
        name: 'Software development (product companies, IT services, startups)',
        description: 'SaaS product development, mobile app development, IT consulting, AI startups.',
        requiredApprovalIds: [
          'appr-stpi',            // Software Technology Parks of India (STPI) Export Registration
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-trade',           // Municipal Trade Licence
          'appr-6',               // Fire Safety NOC (for IT office)
          'appr-10'              // Commercial Electricity Connection
        ]
      },
      {
        id: 'it-bpo',
        name: 'IT-enabled services (BPO, call centres, data entry, support services)',
        description: 'Customer support BPOs, data entry hubs, voice/non-voice call centers, IT helpdesks.',
        requiredApprovalIds: [
          'appr-4',               // Shops & Establishment (Gumasta)
          'appr-trade',           // Municipal Trade Licence
          'appr-6',               // Fire Safety NOC
          'appr-10'              // Commercial Electricity Connection
        ]
      }
    ]
  }
];
