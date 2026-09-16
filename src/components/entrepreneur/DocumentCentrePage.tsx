import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem, StructuredOcrAnalysis, VerificationFinalStatus } from '../../types';
import { apiAnalyzeDocumentOCR } from '../../services/api';
import { performRealOcr } from '../../utils/realOcrAnalyzer';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Loader2,
  X,
  Eye,
  Trash2,
  ShieldCheck,
  Info,
  Check,
  FileCheck
} from 'lucide-react';

export const getStatusBadgeStyle = (status?: string) => {
  switch (status) {
    case 'VERIFIED':
    case 'Valid':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'NEEDS_REVIEW':
    case 'Pending Review':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'INVALID':
    case 'Name Mismatch':
    case 'Expired':
      return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    case 'INCOMPLETE':
    case 'Blurry / Unreadable':
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
};

export const getStatusDisplayLabel = (status?: string): string => {
  switch (status) {
    case 'VERIFIED':
    case 'Valid':
      return '🟢 VERIFIED';
    case 'NEEDS_REVIEW':
    case 'Pending Review':
      return '🟡 NEEDS REVIEW';
    case 'INVALID':
    case 'Name Mismatch':
    case 'Expired':
      return '🔴 INVALID';
    case 'INCOMPLETE':
    case 'Blurry / Unreadable':
    default:
      return '○ INCOMPLETE';
  }
};

export const DocumentCentrePage: React.FC = () => {
  const { documents, uploadDocument, deleteDocument, activeProject, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState('PAN Card');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Scope documents strictly to the active project
  const projectDocs = documents.filter(d => d.projectId === activeProject?.id);

  // Flagged documents requiring user replacement or correction (scoped to active project)
  const flaggedDocs = projectDocs.filter(d => 
    d.status === 'Name Mismatch' || d.status === 'Expired' || d.status === 'Blurry / Unreadable' || d.status === 'Missing' || d.structuredAnalysis?.status === 'NEEDS_REVIEW' || d.structuredAnalysis?.status === 'INVALID' || d.structuredAnalysis?.status === 'INCOMPLETE'
  );

  const [activeDocForFeedback, setActiveDocForFeedback] = useState<DocumentItem | null>(
    flaggedDocs.length > 0 ? flaggedDocs[0] : (projectDocs[0] || null)
  );
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [replacingDocId, setReplacingDocId] = useState<string | null>(null);

  const categories = [
    'ALL',
    ...(flaggedDocs.length > 0 ? [`⚠️ Flagged / Needs Attention (${flaggedDocs.length})`] : []),
    'PAN Card',
    'Aadhaar Card',
    'GST Certificate',
    'Company Incorporation',
    'Land Ownership / Lease Document',
    'Building Plan',
    'Fire Safety Certificate',
    'Pollution Certificate',
    'Bank Details'
  ];

  const filteredDocs = selectedCategory === 'ALL'
    ? projectDocs
    : selectedCategory.startsWith('⚠️ Flagged')
    ? flaggedDocs
    : projectDocs.filter(d => d.category === selectedCategory || d.docName.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleReplaceDocument = async (docToReplace: DocumentItem, file: File) => {
    setIsScanning(true);
    setReplacingDocId(docToReplace.id);
    try {
      let persistentFileUrl = URL.createObjectURL(file);
      try {
        persistentFileUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(URL.createObjectURL(file));
          reader.readAsDataURL(file);
        });
      } catch {}

      const ocrRes = await performRealOcr(file, docToReplace.category, docToReplace.docName, {
        businessName: activeProject.businessName,
        applicantName: currentUser?.name || 'Applicant',
        district: activeProject.district
      });

      // Remove existing doc and upload newly verified replacement
      deleteDocument(docToReplace.id);
      const replacedDoc = uploadDocument(
        docToReplace.docName,
        docToReplace.category,
        file,
        ocrRes,
        persistentFileUrl
      );
      setActiveDocForFeedback(replacedDoc);
      setInspectingDoc(replacedDoc);
    } catch (err) {
      console.error('Error replacing doc:', err);
    } finally {
      setIsScanning(false);
      setReplacingDocId(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName && !selectedFile) return;
    const finalDocName = uploadDocName.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : 'Uploaded Document');
    setIsScanning(true);

    try {
      let ocrRes: any;
      let persistentFileUrl: string | undefined = undefined;

      if (selectedFile) {
        try {
          persistentFileUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(URL.createObjectURL(selectedFile));
            reader.readAsDataURL(selectedFile);
          });
        } catch {
          persistentFileUrl = URL.createObjectURL(selectedFile);
        }

        // Run Real Tesseract.js OCR with field extraction
        ocrRes = await performRealOcr(selectedFile, uploadDocCategory, finalDocName, {
          businessName: activeProject.businessName,
          applicantName: currentUser?.name || 'Applicant',
          district: activeProject.district
        });
      } else {
        // Fallback to backend analysis
        const serverOcr = await apiAnalyzeDocumentOCR({
          docName: finalDocName,
          category: uploadDocCategory,
          projectProfile: {
            businessName: activeProject.businessName,
            sector: activeProject.sector,
            district: activeProject.district,
            entityType: activeProject.entityType
          }
        });
        if (serverOcr) {
          ocrRes = {
            confidence: serverOcr.confidence,
            issues: serverOcr.issues,
            recommendations: serverOcr.recommendations,
            extractedName: serverOcr.extractedName,
            extractedRegNo: serverOcr.extractedRegNo,
            extractedExpiry: serverOcr.extractedExpiry,
            status: serverOcr.status,
            extractedRawText: '',
            isAuthenticGovDoc: serverOcr.status === 'Valid'
          };
        }
      }

      const uploadedDoc = uploadDocument(
        finalDocName,
        uploadDocCategory,
        selectedFile,
        ocrRes,
        persistentFileUrl
      );

      setActiveDocForFeedback(uploadedDoc);
      setUploadDocName('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading doc:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const getAnalysisData = (doc: DocumentItem): StructuredOcrAnalysis | undefined => {
    return doc.structuredAnalysis || doc.aiValidationResult?.structuredAnalysis;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#16261C] p-6 rounded-3xl border border-slate-200 dark:border-[#253D2C] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFFFDC] dark:bg-emerald-950/60 text-[#2E6F40] dark:text-[#CFFFDC] text-xs font-extrabold mb-2 border border-[#68BA7F]/40">
            <ShieldCheck className="w-4 h-4" />
            <span>Document Verification & Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Smart Document Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
            Real OCR text extraction, field-level confidence, statutory format checking, cross-document name matching, and risk analysis for <strong className="text-slate-800 dark:text-slate-200">{activeProject?.businessName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-right min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Documents</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{projectDocs.length}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-right min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">Needs Attention</span>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{flaggedDocs.length}</span>
          </div>
        </div>
      </div>

      {/* Upload and AI Feedback Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Box */}
        <div className="bg-white dark:bg-[#16261C] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
            <span>Upload & Pre-Screen Document</span>
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document Category</label>
              <select
                value={uploadDocCategory}
                onChange={(e) => setUploadDocCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40] shadow-xs"
              >
                {categories.filter(c => c !== 'ALL' && !c.startsWith('⚠️')).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document Title</label>
              <input
                type="text"
                required
                value={uploadDocName}
                onChange={(e) => setUploadDocName(e.target.value)}
                placeholder="e.g. Income Tax PAN Card 2026"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2E6F40] shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Upload File (PDF / JPG / PNG)</label>
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-white dark:bg-slate-900 hover:border-[#2E6F40] transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      if (!uploadDocName) {
                        setUploadDocName(file.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#CFFFDC] file:text-[#2E6F40] hover:file:bg-[#A3D4B3]"
                />
                {selectedFile ? (
                  <div className="mt-2 p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attached: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Supports files up to 15 MB</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={(!uploadDocName && !selectedFile) || isScanning}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                (!uploadDocName && !selectedFile) || isScanning
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-[#2E6F40] hover:bg-[#235833] cursor-pointer'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Scanning with Tesseract OCR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#CFFFDC]" />
                  <span>Upload & Run AI Verification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Validation Feedback Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#16261C] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2E6F40] dark:text-[#68BA7F]" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">OCR Verification & Readiness Card</h3>
            </div>
            {activeDocForFeedback && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadgeStyle(getAnalysisData(activeDocForFeedback)?.status || activeDocForFeedback.status)}`}>
                {getStatusDisplayLabel(getAnalysisData(activeDocForFeedback)?.status || activeDocForFeedback.status)}
              </span>
            )}
          </div>

          {activeDocForFeedback ? (() => {
            const analysis = getAnalysisData(activeDocForFeedback);
            const statusLabel = analysis?.status || activeDocForFeedback.status;
            const ocrConfidence = analysis?.confidence?.overall ?? activeDocForFeedback.aiValidationResult?.confidence ?? 0;
            const qualityGrade = analysis?.documentQuality || (ocrConfidence >= 75 ? 'GOOD' : ocrConfidence >= 45 ? 'FAIR' : 'POOR');
            
            const nameVal = analysis?.fields?.name?.value || activeDocForFeedback.aiValidationResult?.extractedName || null;
            const regVal = analysis?.fields?.documentNumber?.displayValue || analysis?.fields?.documentNumber?.value || activeDocForFeedback.aiValidationResult?.extractedRegNo || null;
            const expiryVal = analysis?.fields?.expiryDate?.value || activeDocForFeedback.aiValidationResult?.extractedExpiry || null;

            return (
              <div className="space-y-4 text-xs">
                {/* Header Summary Box */}
                <div className="p-4 rounded-xl bg-[#F8FCF9] dark:bg-slate-900 border border-[#D4EEDC] dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{activeDocForFeedback.docName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Category: {activeDocForFeedback.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-[#2E6F40] dark:text-[#68BA7F] bg-[#CFFFDC]/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-[#68BA7F]/40">
                        OCR Confidence: {ocrConfidence}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        qualityGrade === 'GOOD' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                        qualityGrade === 'FAIR' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                        'bg-rose-50 text-rose-700 border-rose-300'
                      }`}>
                        Quality: {qualityGrade}
                      </span>
                    </div>
                  </div>

                  {/* Field Level Extraction Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#D4EEDC]/60 dark:border-slate-800 text-[11px]">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                        <span>Extracted Name</span>
                        {analysis?.fields?.name?.confidence ? (
                          <span className="text-emerald-600 font-bold">✓ {Math.round(analysis.fields.name.confidence * 100)}%</span>
                        ) : null}
                      </div>
                      <span className={`font-bold block truncate mt-0.5 ${nameVal ? 'text-slate-900 dark:text-white' : 'text-slate-400 italic'}`}>
                        {nameVal || 'Not detected'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                        <span>Extracted Reg / ID No</span>
                        {analysis?.fields?.documentNumber?.confidence ? (
                          <span className="text-emerald-600 font-bold">✓ {Math.round(analysis.fields.documentNumber.confidence * 100)}%</span>
                        ) : null}
                      </div>
                      <span className={`font-mono font-bold block truncate mt-0.5 ${regVal ? 'text-slate-900 dark:text-white' : 'text-slate-400 italic'}`}>
                        {regVal || 'Not detected'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                        <span>Statutory Expiry</span>
                        {analysis?.fields?.expiryDate?.confidence ? (
                          <span className="text-emerald-600 font-bold">✓ {Math.round(analysis.fields.expiryDate.confidence * 100)}%</span>
                        ) : null}
                      </div>
                      <span className={`font-bold block mt-0.5 ${expiryVal ? 'text-slate-900 dark:text-white' : 'text-slate-500 font-normal'}`}>
                        {expiryVal || 'Lifetime / No Expiry'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Validation Rules & Cross Checks */}
                {analysis?.validationRules && analysis.validationRules.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Configured Rule Checks:</span>
                      {analysis.risk && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                          PermitFlow Nexus Risk Score: {analysis.risk.score}/100 ({analysis.risk.level})
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {analysis.validationRules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          {rule.status === 'PASS' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : rule.status === 'FAIL' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <span className="text-slate-700 dark:text-slate-300 leading-tight">{rule.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Non-Authenticity Disclaimer Note */}
                <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200 text-[11px] leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Verification Notice:</strong> Configured document-readiness and consistency checks passed. Note: This verification evaluates file formatting & application data consistency; it does NOT independently prove government legal authenticity.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setInspectingDoc(activeDocForFeedback)}
                    className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#CFFFDC]" />
                    <span>View Analysis</span>
                  </button>

                  {statusLabel !== 'VERIFIED' && statusLabel !== 'Valid' && (
                    <label className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                      <UploadCloud className="w-4 h-4 text-white" />
                      <span>Re-upload Document</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplaceDocument(activeDocForFeedback, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })() : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a document from the repository table below to view its full AI OCR validation report.
            </div>
          )}
        </div>

      </div>

      {/* Document List Table */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Uploaded Document Repository</h3>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-800 dark:text-white"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Document Name</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Upload Date</th>
                <th className="py-3 px-4 font-bold">Validation Status</th>
                <th className="py-3 px-4 font-bold">OCR Confidence</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        No documents uploaded yet for {activeProject?.businessName || 'this project'}.
                      </p>
                      <p className="text-xs text-slate-400 max-w-md">
                        Use the "Upload & Pre-Screen Document" section above to attach your mandatory certificates or permits.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const analysis = getAnalysisData(doc);
                  const statusVal = analysis?.status || doc.status;
                  const ocrConf = analysis?.confidence?.overall ?? doc.aiValidationResult?.confidence ?? 0;

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => setActiveDocForFeedback(doc)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer ${
                        activeDocForFeedback?.id === doc.id 
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 font-semibold' 
                          : statusVal !== 'VERIFIED' && statusVal !== 'Valid'
                          ? 'bg-rose-50/40 dark:bg-rose-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {statusVal !== 'VERIFIED' && statusVal !== 'Valid' && (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          <span>{doc.docName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{doc.fileSize || '1.2 MB'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {doc.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {doc.uploadDate || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadgeStyle(statusVal)}`}>
                          {getStatusDisplayLabel(statusVal)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {ocrConf}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {statusVal !== 'VERIFIED' && statusVal !== 'Valid' ? (
                            <label 
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-white" />
                              <span>{replacingDocId === doc.id ? 'Scanning...' : 'Replace File'}</span>
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleReplaceDocument(doc, file);
                                }}
                              />
                            </label>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDocForFeedback(doc);
                                setInspectingDoc(doc);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#2E6F40] text-white font-bold hover:bg-[#235833] text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#CFFFDC]" />
                              <span>View Analysis</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to remove "${doc.docName}"?`)) {
                                deleteDocument(doc.id);
                                if (activeDocForFeedback?.id === doc.id) {
                                  setActiveDocForFeedback(null);
                                }
                                if (inspectingDoc?.id === doc.id) {
                                  setInspectingDoc(null);
                                }
                              }
                            }}
                            title="Delete / Remove Document"
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DETAILED VIEW ANALYSIS MODAL ================= */}
      {inspectingDoc && (() => {
        const analysis = getAnalysisData(inspectingDoc);
        const statusVal = analysis?.status || inspectingDoc.status;
        const ocrConf = analysis?.confidence?.overall ?? inspectingDoc.aiValidationResult?.confidence ?? 0;
        const qualityGrade = analysis?.documentQuality || (ocrConf >= 75 ? 'GOOD' : ocrConf >= 45 ? 'FAIR' : 'POOR');

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto flex flex-col justify-between space-y-6">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getStatusBadgeStyle(statusVal)}`}>
                      {getStatusDisplayLabel(statusVal)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      {inspectingDoc.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {inspectingDoc.docName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded: {inspectingDoc.uploadDate || '2026-08-27'} • File Size: {inspectingDoc.fileSize || '1.2 MB'}
                  </p>
                </div>

                <button
                  onClick={() => setInspectingDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Image Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Uploaded File Attachment
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Original Document
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3 min-h-[260px] max-h-[360px] flex items-center justify-center overflow-hidden">
                    {inspectingDoc.fileUrl ? (
                      <img 
                        src={inspectingDoc.fileUrl} 
                        alt={inspectingDoc.docName}
                        className="max-h-[340px] w-auto max-w-full object-contain rounded-xl shadow-xs"
                      />
                    ) : (
                      <div className="text-center p-8 space-y-2">
                        <FileText className="w-12 h-12 text-[#2E6F40] mx-auto opacity-70" />
                        <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                          {inspectingDoc.docName}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Encrypted Document Vault PDF File
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Legal Disclaimer */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
                    <strong>Notice:</strong> Verification indicates that configured OCR, structure, format, and consistency checks passed. This does NOT independently prove government legal authenticity.
                  </div>
                </div>

                {/* Right Column: Complete Structured Analysis */}
                <div className="space-y-4 text-xs">
                  
                  {/* OCR & Quality Metrics */}
                  <div className="p-4 rounded-2xl bg-[#F8FCF9] dark:bg-slate-950 border border-[#D4EEDC] dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <Sparkles className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F]" />
                        <span>DOCUMENT ANALYSIS</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[11px] bg-[#CFFFDC]/80 dark:bg-slate-800 text-[#2E6F40] dark:text-[#CFFFDC] border border-[#68BA7F]/40">
                        Quality: {qualityGrade}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Detected Type</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {analysis?.documentType || inspectingDoc.category}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Raw OCR Confidence</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {ocrConf}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Fields */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      EXTRACTED INFORMATION
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <span className="text-slate-500">Legal / Signatory Name:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {analysis?.fields?.name?.value || inspectingDoc.aiValidationResult?.extractedName || 'Not detected'}
                          </span>
                          {analysis?.fields?.name?.confidence ? (
                            <span className="text-[10px] text-emerald-600 font-bold">✓ {Math.round(analysis.fields.name.confidence * 100)}%</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <span className="text-slate-500">Registration / ID No:</span>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            {analysis?.fields?.documentNumber?.displayValue || analysis?.fields?.documentNumber?.value || inspectingDoc.aiValidationResult?.extractedRegNo || 'Not detected'}
                          </span>
                          {analysis?.fields?.documentNumber?.confidence ? (
                            <span className="text-[10px] text-emerald-600 font-bold">✓ {Math.round(analysis.fields.documentNumber.confidence * 100)}%</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <span className="text-slate-500">Statutory Expiry:</span>
                        <div className="text-right font-bold text-slate-900 dark:text-white">
                          {analysis?.fields?.expiryDate?.value || inspectingDoc.aiValidationResult?.extractedExpiry || 'Lifetime / No Expiry'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rule Checks & Risk Assessment */}
                  {analysis?.validationRules && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                        <span>RULE CHECKS</span>
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          Risk: {analysis.risk?.level || 'LOW'} ({analysis.risk?.score || 15}/100)
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        {analysis.validationRules.map((rule, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-900">
                            <span className="text-slate-700 dark:text-slate-300">{rule.message}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rule.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                              rule.status === 'FAIL' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {rule.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete "${inspectingDoc.docName}"?`)) {
                      deleteDocument(inspectingDoc.id);
                      if (activeDocForFeedback?.id === inspectingDoc.id) {
                        setActiveDocForFeedback(null);
                      }
                      setInspectingDoc(null);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs border border-red-200 dark:border-red-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Document</span>
                </button>

                <button
                  onClick={() => setInspectingDoc(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Close Report
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
