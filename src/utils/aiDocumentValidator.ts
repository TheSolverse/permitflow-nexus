import { DocumentValidationStatus, BusinessProject, DocumentItem } from '../types';

export interface AIValidationResult {
  status: DocumentValidationStatus;
  confidence: number; // 0 - 100
  issues: string[];
  recommendations: string[];
  extractedName?: string;
  extractedRegNo?: string;
  extractedExpiry?: string;
}

export function validateDocumentWithAI(docName: string, category: string, file: File | null, project: BusinessProject): AIValidationResult {
  if (!file) {
    return {
      status: 'Missing',
      confidence: 0,
      issues: ['Document file missing. No upload detected.'],
      recommendations: [`Upload a valid PDF or JPG image of your ${docName}.`]
    };
  }

  const fileNameLower = file.name.toLowerCase();

  // Test 1: Check for expiry date simulation
  if (fileNameLower.includes('old') || fileNameLower.includes('2022') || fileNameLower.includes('2023') || fileNameLower.includes('expired')) {
    return {
      status: 'Expired',
      confidence: 52,
      extractedExpiry: '2023-12-31',
      issues: ['Certificate validity period expired on 31-Dec-2023.'],
      recommendations: ['Obtain a renewed version from the issuing department and re-upload.']
    };
  }

  // Test 2: Check for name mismatch simulation
  if (fileNameLower.includes('mismatch') || fileNameLower.includes('other_name') || fileNameLower.includes('unit1')) {
    return {
      status: 'Name Mismatch',
      confidence: 64,
      extractedName: 'Apex Agro Sub Unit 1',
      issues: [
        `Legal entity name on document ("Apex Agro Sub Unit 1") does not match registered project profile name ("${project.businessName}").`
      ],
      recommendations: [
        'Request the issuing authority to issue an addendum reflecting exact corporate entity name.',
        'Upload an affidavit clarifying alternate trade name.'
      ]
    };
  }

  // Test 3: Check for blurry / unreadable simulation
  if (fileNameLower.includes('blurry') || fileNameLower.includes('low_res') || fileNameLower.includes('scan')) {
    return {
      status: 'Blurry / Unreadable',
      confidence: 42,
      issues: [
        'Document scan resolution is under 150 DPI.',
        'Official government seal and signature area are pixelated.'
      ],
      recommendations: [
        'Scan original document at 300+ DPI resolution in color.',
        'Ensure all 4 corners of document are clearly visible.'
      ]
    };
  }

  // Default success validation
  return {
    status: 'Valid',
    confidence: 96,
    extractedName: project.businessName,
    extractedRegNo: `MH-REG-${Math.floor(100000 + Math.random() * 900000)}`,
    issues: [],
    recommendations: [
      'Document verified successfully. Visual seal and text alignment clear.',
      `Matches registered business entity "${project.businessName}".`
    ]
  };
}

export function auditAllDocuments(documents: DocumentItem[], project: BusinessProject): DocumentItem[] {
  return documents.map(doc => {
    if (doc.status === 'Missing') {
      return {
        ...doc,
        aiValidationResult: {
          confidence: 0,
          issues: ['Document missing. Upload required before filing application.'],
          recommendations: [`Please upload ${doc.docName}.`]
        }
      };
    }
    return doc;
  });
}
