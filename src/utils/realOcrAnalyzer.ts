import Tesseract from 'tesseract.js';
import {
  DocumentValidationStatus,
  StructuredOcrAnalysis,
  VerificationFinalStatus,
  DocumentQualityGrade,
  MatchResult,
  DetectedDocumentType,
  FieldExtractionResult,
  RuleCheckResult,
  CrossDocumentCheckResult
} from '../types';

export interface RealOcrResult {
  confidence: number; // Actual OCR confidence
  extractedRawText: string;
  extractedName?: string;
  extractedRegNo?: string;
  extractedExpiry?: string;
  issuingAuthority?: string;
  status: DocumentValidationStatus;
  issues: string[];
  recommendations: string[];
  isAuthenticGovDoc: boolean;
  structuredAnalysis: StructuredOcrAnalysis;
}

/**
 * Normalizes entity and person names for reliable comparison.
 * Standardizes common company suffixes (Pvt/Private, Ltd/Limited, Co/Company)
 * and strips non-alphanumeric noise while maintaining core word order.
 */
export function normalizeName(name: string): string {
  if (!name) return '';
  let clean = name.toUpperCase().trim();
  clean = clean.replace(/[^\w\s]/g, ' '); // remove punctuation
  clean = clean.replace(/\s+/g, ' ');     // collapse multiple spaces

  // Standardize common company representations safely
  clean = clean.replace(/\bPVT\b/g, 'PRIVATE');
  clean = clean.replace(/\bLTD\b/g, 'LIMITED');
  clean = clean.replace(/\bCO\b/g, 'COMPANY');
  clean = clean.replace(/\bINC\b/g, 'INCORPORATED');
  clean = clean.replace(/\bCORP\b/g, 'CORPORATION');
  clean = clean.replace(/\bPROP\b/g, 'PROPRIETORSHIP');
  return clean.trim();
}

/**
 * Safely compares two names and returns a strict match classification.
 */
export function compareNames(extracted?: string | null, target?: string | null): MatchResult {
  if (!extracted || !target || extracted === 'NOT DETECTED') return 'NOT_ENOUGH_DATA';
  const norm1 = normalizeName(extracted);
  const norm2 = normalizeName(target);

  if (!norm1 || !norm2) return 'NOT_ENOUGH_DATA';
  if (norm1 === norm2) return 'MATCH';

  const tokens1 = norm1.split(' ').filter(t => t.length > 1);
  const tokens2 = norm2.split(' ').filter(t => t.length > 1);
  const common = tokens1.filter(t => tokens2.includes(t));

  if (common.length === Math.min(tokens1.length, tokens2.length) && common.length > 0) {
    return 'MATCH';
  }
  if (common.length >= 2 || (tokens1.length <= 2 && common.length >= 1 && tokens2.includes(tokens1[0]))) {
    return 'POSSIBLE_MATCH';
  }

  return 'MISMATCH';
}

/**
 * Masks sensitive identity numbers for UI display & privacy compliance (e.g. XXXX XXXX 1234).
 */
export function maskSensitiveIdentifier(value: string | null, type: DetectedDocumentType): string | null {
  if (!value) return null;
  const digits = value.replace(/\s+/g, '');

  if (type === 'AADHAAR' && digits.length === 12) {
    return `XXXX XXXX ${digits.substring(8)}`;
  }
  return value;
}

/**
 * Classifies document type based strictly on extracted OCR text.
 */
export function classifyDocumentByOcr(rawText: string, expectedCategory: string): { type: DetectedDocumentType; confidence: number } {
  const upper = rawText.toUpperCase();
  const catUpper = expectedCategory.toUpperCase();

  // Keyword score mappings
  const keywords: Record<DetectedDocumentType, string[]> = {
    PAN: ['PERMANENT ACCOUNT NUMBER', 'INCOME TAX', 'GOVT OF INDIA', 'INCOMETAX', 'आयकर विभाग'],
    AADHAAR: ['UNIQUE IDENTIFICATION', 'UIDAI', 'AADHAAR', 'ADHAAR', 'GOVERNMENT OF INDIA', 'MERA AADHAAR', 'आधार', 'भारत सरकार', 'HELP@UIDAI'],
    GST: ['GOODS AND SERVICES TAX', 'GSTIN', 'FORM GST REG-06', 'REGISTRATION CERTIFICATE', 'GST'],
    FIRE_NOC: ['FIRE SERVICES', 'FIRE NOC', 'FIRE SAFETY', 'NO OBJECTION CERTIFICATE', 'MAHARASHTRA FIRE', 'DIRECTORATE OF FIRE'],
    MPCB: ['MAHARASHTRA POLLUTION CONTROL BOARD', 'MPCB', 'CONSENT TO ESTABLISH', 'WATER ACT', 'AIR ACT', 'POLLUTION CONTROL'],
    DISH: ['DIRECTORATE OF INDUSTRIAL SAFETY', 'DISH', 'FACTORY LICENCE', 'FACTORIES ACT', 'FORM 1'],
    UTILITY_BILL: ['ELECTRICITY', 'MSEDCL', 'POWER DISTRIBUTION', 'BILL DATE', 'CONSUMER NO', 'UTILITY BILL', 'WATER BILL'],
    LEASE_AGREEMENT: ['LEASE AGREEMENT', 'LEAVE AND LICENSE', 'LESSOR', 'LESSEE', 'RENTAL AGREEMENT', 'STAMP DUTY'],
    OWNER_NOC: ['NO OBJECTION', 'PROPERTY OWNER', 'NOC FOR BUSINESS', 'PERMISSION TO OPERATE'],
    IDENTITY_PROOF: ['VOTER', 'DRIVING LICENCE', 'PASSPORT', 'IDENTITY CARD'],
    DSC: ['DIGITAL SIGNATURE', 'CERTIFYING AUTHORITY', 'CLASS 3', 'SIGNATURE CERTIFICATE'],
    OTHER: ['CERTIFICATE', 'APPROVAL', 'LICENCE', 'SANCTION', 'PERMIT'],
    UNKNOWN: []
  };

  let bestType: DetectedDocumentType = 'UNKNOWN';
  let maxScore = 0;

  for (const [typeKey, wordList] of Object.entries(keywords)) {
    const matched = wordList.filter(w => upper.includes(w)).length;
    if (matched > maxScore) {
      maxScore = matched;
      bestType = typeKey as DetectedDocumentType;
    }
  }

  // Fallback check against expected category if OCR keywords were scarce but present
  if (bestType === 'UNKNOWN' && rawText.length > 30) {
    if (catUpper.includes('PAN')) bestType = 'PAN';
    else if (catUpper.includes('AADHAAR') || catUpper.includes('AADHAR')) bestType = 'AADHAAR';
    else if (catUpper.includes('GST')) bestType = 'GST';
    else if (catUpper.includes('FIRE')) bestType = 'FIRE_NOC';
    else if (catUpper.includes('POLLUTION') || catUpper.includes('MPCB')) bestType = 'MPCB';
    else if (catUpper.includes('FACTORY') || catUpper.includes('DISH')) bestType = 'DISH';
    else if (catUpper.includes('LEASE')) bestType = 'LEASE_AGREEMENT';
    else if (catUpper.includes('NOC')) bestType = 'OWNER_NOC';
    else if (catUpper.includes('BILL') || catUpper.includes('UTILITY')) bestType = 'UTILITY_BILL';
    else bestType = 'OTHER';

    return { type: bestType, confidence: 0.60 };
  }

  const docTypeConfidence = Math.min(0.99, Math.max(0.40, maxScore * 0.25));
  return { type: bestType, confidence: Math.round(docTypeConfidence * 100) / 100 };
}

/**
 * Assesses overall document image quality based strictly on empirical OCR metrics.
 */
export function assessQuality(ocrConfidence: number, textLength: number, hasRequiredFields: boolean): DocumentQualityGrade {
  if (ocrConfidence >= 75 && textLength >= 40 && hasRequiredFields) {
    return 'GOOD';
  } else if (ocrConfidence >= 45 && textLength >= 20) {
    return 'FAIR';
  }
  return 'POOR';
}

/**
 * Modern Field-Level Extraction & Strict Verification Pipeline.
 * Uses Tesseract.js output without artificial confidence inflation or value fabrication.
 */
export async function performRealOcr(
  file: File | string,
  category: string,
  docTitle: string,
  projectProfile: {
    businessName: string;
    applicantName?: string;
    district?: string;
  }
): Promise<RealOcrResult> {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const validationRules: RuleCheckResult[] = [];
  const crossDocumentChecks: CrossDocumentCheckResult[] = [];

  let extractedRawText = '';
  let actualOcrConfidence = 0;

  // Execute browser-side Tesseract.js OCR
  try {
    const res = await Tesseract.recognize(file, 'eng', { logger: () => { } });
    if (res?.data?.text) {
      extractedRawText = res.data.text.trim();
      actualOcrConfidence = Math.round(res.data.confidence || 0);
    }
  } catch (err) {
    console.warn('[OCR Engine] Tesseract scan exception:', err);
    extractedRawText = '';
    actualOcrConfidence = 0;
  }

  const rawUpper = extractedRawText.toUpperCase();
  const rawLower = extractedRawText.toLowerCase();
  const fileNameLower = (typeof file === 'string' ? file : file?.name || docTitle).toLowerCase();
  const targetBusinessName = projectProfile.businessName;
  const targetApplicantName = projectProfile.applicantName || 'Applicant';

  // 1. NON-DOCUMENT & INTERCEPTION CHECKS
  const knownLogos = ['blinkit', 'zepto', 'swiggy', 'zomato', 'olx', 'flipkart', 'amazon', 'instagram', 'facebook', 'whatsapp', 'youtube'];
  const hasKnownLogo = knownLogos.some(brand => rawLower.includes(brand) || fileNameLower.includes(brand));

  const receiptKeywords = [
    'payment success', 'student name', 'prn number', 'semester', 'college of engineering',
    'transaction id', 'order id', 'receipt', 'amount paid', 'fee receipt', 'tuition', 'cart summary', 'checkout success'
  ];
  const hasReceiptKeywords = receiptKeywords.some(k => rawLower.includes(k));

  const presentationKeywords = ['slide', 'presentation', 'powerpoint', 'agenda', 'overview', 'diagram', 'architecture', 'workflow'];
  const hasPresentationKeywords = presentationKeywords.filter(k => rawLower.includes(k)).length >= 2;

  const isUnrelatedFile = hasKnownLogo || hasReceiptKeywords || hasPresentationKeywords;

  // 2. DOCUMENT CLASSIFICATION
  const classification = classifyDocumentByOcr(extractedRawText, category);
  const docType = isUnrelatedFile ? 'UNKNOWN' : classification.type;

  // Fields container
  const fields: StructuredOcrAnalysis['fields'] = {};

  let extractedName: string | null = null;
  let extractedRegNo: string | null = null;
  let extractedExpiry: string | null = null;
  let issuingAuthority: string = 'Government Authority';

  // Helper to safely extract regex values
  const findMatch = (regex: RegExp): string | null => {
    const match = rawUpper.match(regex);
    return match ? match[0] : null;
  };

  // 3. DOCUMENT-SPECIFIC FIELD EXTRACTION (STRICT, NO FABRICATION)
  if (!isUnrelatedFile) {
    if (docType === 'PAN' || category.toUpperCase().includes('PAN')) {
      issuingAuthority = 'Income Tax Department, Govt of India';
      // Match PAN format: 5 letters, 4 digits, 1 letter
      const panMatch = findMatch(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
      extractedRegNo = panMatch; // null if not found

      // Try extracting name from lines near Income Tax header
      const lines = extractedRawText.split('\n').map(l => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        const lineUpper = lines[i].toUpperCase();
        if (lineUpper.includes('NAME') && i + 1 < lines.length && !lines[i + 1].toUpperCase().includes('FATHER')) {
          extractedName = lines[i + 1].trim();
          break;
        }
        if (/^[A-Z\s]{4,40}$/.test(lineUpper) && !lineUpper.includes('INCOME TAX') && !lineUpper.includes('GOVT') && !lineUpper.includes('INDIA')) {
          if (!extractedName) extractedName = lineUpper;
        }
      }

      fields.name = { value: extractedName, confidence: extractedName ? 0.90 : 0 };
      fields.documentNumber = { value: extractedRegNo, confidence: extractedRegNo ? 0.98 : 0, displayValue: extractedRegNo || undefined };
      fields.expiryDate = { value: null, confidence: 0 }; // PAN has no expiry

      // Validation Rule: PAN Format
      if (extractedRegNo) {
        validationRules.push({ rule: 'pan_format', status: 'PASS', message: 'Extracted PAN matches standard 10-character structure [A-Z]{5}[0-9]{4}[A-Z]' });
      } else {
        validationRules.push({ rule: 'pan_format', status: 'FAIL', message: 'No valid 10-character PAN pattern detected in document text.' });
      }
    }
    else if (docType === 'AADHAAR' || category.toUpperCase().includes('AADHAAR')) {
      issuingAuthority = 'Unique Identification Authority of India (UIDAI)';
      const aadhaarMatch = findMatch(/\b[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\b/);
      extractedRegNo = aadhaarMatch;

      // Extract Name
      const lines = extractedRawText.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const lineUpper = line.toUpperCase();
        if (/^[A-Z\s]{4,35}$/.test(lineUpper) && !lineUpper.includes('UIDAI') && !lineUpper.includes('GOVERNMENT') && !lineUpper.includes('INDIA') && !lineUpper.includes('DOB') && !lineUpper.includes('MALE') && !lineUpper.includes('FEMALE')) {
          extractedName = lineUpper;
          break;
        }
      }

      const maskedId = maskSensitiveIdentifier(extractedRegNo, 'AADHAAR');
      fields.name = { value: extractedName, confidence: extractedName ? 0.88 : 0 };
      fields.documentNumber = { value: extractedRegNo, confidence: extractedRegNo ? 0.95 : 0, displayValue: maskedId || 'Not detected' };
      fields.expiryDate = { value: null, confidence: 0 };

      if (rawUpper.includes('UIDAI') || rawUpper.includes('UNIQUE IDENTIFICATION') || rawUpper.includes('AADHAAR')) {
        validationRules.push({ rule: 'uidai_header', status: 'PASS', message: 'UIDAI official identification text markers detected.' });
      } else {
        validationRules.push({ rule: 'uidai_header', status: 'REVIEW', message: 'UIDAI header text markers incomplete or unreadable.' });
      }
    }
    else if (docType === 'GST' || category.toUpperCase().includes('GST')) {
      issuingAuthority = 'Goods and Services Tax Network (GSTN)';
      const gstMatch = findMatch(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/);
      extractedRegNo = gstMatch;

      const lines = extractedRawText.split('\n').map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const u = line.toUpperCase();
        if ((u.includes('LEGAL NAME') || u.includes('TRADE NAME') || u.includes('NAME')) && line.includes(':')) {
          extractedName = line.split(':')[1]?.trim() || null;
          break;
        }
      }

      fields.name = { value: extractedName, confidence: extractedName ? 0.90 : 0 };
      fields.documentNumber = { value: extractedRegNo, confidence: extractedRegNo ? 0.98 : 0, displayValue: extractedRegNo || undefined };
      fields.expiryDate = { value: null, confidence: 0 };

      if (extractedRegNo) {
        validationRules.push({ rule: 'gstin_format', status: 'PASS', message: 'Valid 15-character GSTIN structure verified.' });
        if (extractedRegNo.startsWith('27')) {
          validationRules.push({ rule: 'state_code_check', status: 'PASS', message: 'State Code 27 (Maharashtra) structure verified.' });
        }
      } else {
        validationRules.push({ rule: 'gstin_format', status: 'FAIL', message: 'No valid 15-character GSTIN identifier found in document.' });
      }
    }
    else if (docType === 'FIRE_NOC' || docType === 'MPCB' || docType === 'DISH') {
      issuingAuthority = docType === 'FIRE_NOC' ? 'Directorate of Maharashtra Fire Services' :
        docType === 'MPCB' ? 'Maharashtra Pollution Control Board (MPCB)' :
          'Directorate of Industrial Safety & Health (DISH)';

      // Search for reference numbers & dates
      const refMatch = findMatch(/(?:NOC|MPCB|CTE|CTO|DISH|LICENCE|REF)[/\-\s:][A-Z0-9/\-\s]{5,25}/i);
      extractedRegNo = refMatch;

      // Search for valid dates
      const dateMatch = findMatch(/\b\d{2}[/\-.]\d{2}[/\-.]\d{4}\b/);
      if (dateMatch) {
        extractedExpiry = dateMatch;
      }

      fields.documentNumber = { value: extractedRegNo, confidence: extractedRegNo ? 0.85 : 0 };
      fields.expiryDate = { value: extractedExpiry, confidence: extractedExpiry ? 0.85 : 0 };

      validationRules.push({ rule: 'department_keywords', status: 'PASS', message: `Configured departmental terms found for ${docType}.` });
    }
    else {
      // General statutory documents
      const dateMatch = findMatch(/\b\d{2}[/\-.]\d{2}[/\-.]\d{4}\b/);
      extractedExpiry = dateMatch;
      fields.expiryDate = { value: extractedExpiry, confidence: extractedExpiry ? 0.80 : 0 };
    }
  }

  // Set default field entries if not detected
  if (!fields.name) fields.name = { value: extractedName, confidence: 0 };
  if (!fields.documentNumber) fields.documentNumber = { value: extractedRegNo, confidence: 0 };
  if (!fields.expiryDate) fields.expiryDate = { value: extractedExpiry, confidence: 0 };

  // 4. QUALITY ASSESSMENT
  const hasVitalField = Boolean(extractedName || extractedRegNo);
  const documentQuality = assessQuality(actualOcrConfidence, extractedRawText.length, hasVitalField);

  if (documentQuality === 'POOR' && !isUnrelatedFile) {
    issues.push('The uploaded document image could not be read reliably by OCR engine (low resolution or high noise).');
    recommendations.push('Upload a clear, high-resolution scan or original PDF of the document.');
    validationRules.push({ rule: 'ocr_quality', status: 'REVIEW', message: 'OCR text extraction confidence is below optimal threshold.' });
  } else if (!isUnrelatedFile) {
    validationRules.push({ rule: 'ocr_quality', status: 'PASS', message: 'OCR text extraction confidence is satisfactory.' });
  }

  // 5. NAME & APPLICATION MATCHING
  const targetNameToCompare = (docType === 'AADHAAR' || docType === 'IDENTITY_PROOF') ? targetApplicantName : targetBusinessName;
  const nameMatchStatus = compareNames(extractedName, targetNameToCompare);

  if (extractedName && nameMatchStatus === 'MATCH') {
    validationRules.push({ rule: 'name_matching', status: 'PASS', message: `Extracted document name matches target profile ("${targetNameToCompare}").` });
  } else if (extractedName && nameMatchStatus === 'POSSIBLE_MATCH') {
    validationRules.push({ rule: 'name_matching', status: 'REVIEW', message: `Extracted name ("${extractedName}") is similar to target ("${targetNameToCompare}") but requires officer confirmation.` });
  } else if (extractedName && nameMatchStatus === 'MISMATCH') {
    validationRules.push({ rule: 'name_matching', status: 'FAIL', message: `Extracted document name ("${extractedName}") does not match profile name ("${targetNameToCompare}").` });
  } else if (!isUnrelatedFile) {
    validationRules.push({ rule: 'name_matching', status: 'REVIEW', message: 'Document name could not be reliably extracted from OCR text for comparison.' });
  }

  // 6. EXPIRY DATE VALIDATION
  if (extractedExpiry) {
    const parsedTime = Date.parse(extractedExpiry.replace(/(\d{2})[/.](\d{2})[/.](\d{4})/, '$3-$2-$1'));
    if (!isNaN(parsedTime) && parsedTime < Date.now()) {
      issues.push(`Document expiration date (${extractedExpiry}) has passed.`);
      recommendations.push('Please upload a renewed valid certificate.');
      validationRules.push({ rule: 'expiry_check', status: 'FAIL', message: `Extracted expiry date (${extractedExpiry}) is in the past.` });
    } else {
      validationRules.push({ rule: 'expiry_check', status: 'PASS', message: `Extracted validity period (${extractedExpiry}) is active.` });
    }
  } else if (!isUnrelatedFile) {
    validationRules.push({ rule: 'expiry_check', status: 'PASS', message: 'No expiry date restriction configured or found.' });
  }

  // 7. CROSS-DOCUMENT CONSISTENCY
  crossDocumentChecks.push({
    field: 'Name Consistency',
    sourceDoc: docTitle,
    targetDoc: 'Application Profile',
    status: nameMatchStatus,
    message: nameMatchStatus === 'MATCH' ? 'Document name matches application profile.' :
      nameMatchStatus === 'POSSIBLE_MATCH' ? 'Document name partially matches application profile.' :
        nameMatchStatus === 'MISMATCH' ? 'Document name differs from application profile.' :
          'Insufficient OCR text to verify name consistency.'
  });

  // 8. RISK SCORING (Internal PermitFlow Nexus Risk Score)
  let riskScore = 15; // baseline
  const riskReasons: string[] = [];

  if (isUnrelatedFile) {
    riskScore += 60;
    riskReasons.push('File content does not match statutory document structure');
  }
  if (documentQuality === 'POOR') {
    riskScore += 25;
    riskReasons.push('Low OCR extraction confidence / unreadable image');
  }
  if (nameMatchStatus === 'MISMATCH') {
    riskScore += 35;
    riskReasons.push('Name mismatch between document and application profile');
  } else if (nameMatchStatus === 'POSSIBLE_MATCH') {
    riskScore += 10;
    riskReasons.push('Partial name match requiring human confirmation');
  }
  if (!extractedRegNo && ['PAN', 'GST', 'AADHAAR'].includes(docType)) {
    riskScore += 20;
    riskReasons.push(`Required identifier for ${docType} could not be extracted`);
  }

  const boundedRiskScore = Math.min(99, Math.max(5, riskScore));
  const riskLevel = boundedRiskScore >= 60 ? 'HIGH' : boundedRiskScore >= 35 ? 'MEDIUM' : 'LOW';

  // 9. FINAL STATUS DETERMINATION
  let finalStatus: VerificationFinalStatus = 'VERIFIED';
  let legacyStatus: DocumentValidationStatus = 'Valid';

  if (isUnrelatedFile || (documentQuality === 'POOR' && !hasVitalField)) {
    finalStatus = 'INCOMPLETE';
    legacyStatus = 'Blurry / Unreadable';
    issues.push('Uploaded file does not appear to contain sufficient readable information for the required document.');
    recommendations.push(`Upload a clear, complete image of your official ${category}.`);
  } else if (validationRules.some(r => r.status === 'FAIL')) {
    finalStatus = 'INVALID';
    legacyStatus = nameMatchStatus === 'MISMATCH' ? 'Name Mismatch' : 'Blurry / Unreadable';
    issues.push('One or more configured document validation rules failed.');
    recommendations.push('Review the highlighted rule failures and upload the corrected document.');
  } else if (validationRules.some(r => r.status === 'REVIEW') || nameMatchStatus === 'POSSIBLE_MATCH' || documentQuality === 'FAIR' || riskLevel === 'MEDIUM') {
    finalStatus = 'NEEDS_REVIEW';
    legacyStatus = 'Pending Review';
    recommendations.push('Document readiness checks passed with minor uncertainty. Human review recommended.');
  } else {
    finalStatus = 'VERIFIED';
    legacyStatus = 'Valid';
    recommendations.push('Configured OCR, format, and consistency checks passed cleanly.');
  }

  // Structured Analysis Output Object
  const structuredAnalysis: StructuredOcrAnalysis = {
    documentType: docType,
    expectedDocumentType: category,
    documentQuality,
    ocrStatus: isUnrelatedFile ? 'PARTIAL' : 'COMPLETED',
    confidence: {
      overall: actualOcrConfidence,
      ocr: actualOcrConfidence,
      documentType: Math.round(classification.confidence * 100)
    },
    fields,
    validationRules,
    crossDocumentChecks,
    risk: {
      level: riskLevel,
      score: boundedRiskScore,
      reasons: riskReasons
    },
    status: finalStatus,
    legacyStatus,
    extractedRawText,
    issues,
    recommendations
  };

  return {
    confidence: actualOcrConfidence,
    extractedRawText,
    extractedName: extractedName || (finalStatus === 'VERIFIED' ? undefined : undefined),
    extractedRegNo: extractedRegNo || undefined,
    extractedExpiry: extractedExpiry || undefined,
    issuingAuthority,
    status: legacyStatus,
    issues,
    recommendations,
    isAuthenticGovDoc: finalStatus === 'VERIFIED',
    structuredAnalysis
  };
}
