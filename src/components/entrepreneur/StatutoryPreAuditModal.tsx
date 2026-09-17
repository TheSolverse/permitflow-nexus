import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Upload, 
  RefreshCw, 
  FileCheck2, 
  XCircle,
  AlertCircle,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDocumentCentre?: () => void;
}

export const StatutoryPreAuditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToDocumentCentre
}) => {
  const { activeProject, documents, rules } = useApp();

  if (!isOpen || !activeProject) return null;

  const projectDocs = documents.filter(d => d.projectId === activeProject.id);

  // Define mandatory statutory requirements based on sector & scale
  const isFood = activeProject.sector.toLowerCase().includes('food') || activeProject.sector.toLowerCase().includes('agro');
  const isChemical = activeProject.sector.toLowerCase().includes('chemical') || activeProject.sector.toLowerCase().includes('pharma');
  const isSoftware = activeProject.sector.toLowerCase().includes('software') || activeProject.sector.toLowerCase().includes('it');

  const requiredDocCategories = [
    { category: 'PAN Card', label: 'Permanent Account Number (PAN) Card', mandatory: true },
    { category: 'Aadhaar Card', label: 'Authorized Signatory Aadhaar Card', mandatory: true },
    { category: 'Land Ownership / Lease Document', label: 'Registered Land Ownership Title / MIDC Lease Deed', mandatory: true },
    { category: 'GST Certificate', label: 'GST Registration Certificate (REG-06)', mandatory: true },
    { category: 'Company Incorporation', label: 'Certificate of Incorporation (SPICe+ / MoA / AoA)', mandatory: true },
    { category: 'Building Plan', label: 'Architectural Site Layout & Building Sanction Plan', mandatory: !isSoftware },
    { category: 'Fire Safety Certificate', label: 'Provisional Fire Safety Compliance Plan', mandatory: !isSoftware },
    { category: 'Pollution Certificate', label: isChemical ? 'MPCB Consent to Establish (Red Category EIA Report)' : 'MPCB Consent to Establish (CTE Application)', mandatory: !isSoftware },
    ...(isFood ? [{ category: 'FSSAI License', label: 'FSSAI Food Safety Management Plan (FSMS)', mandatory: true }] : [])
  ];

  // Analyze missing documents
  const missingCategories = requiredDocCategories.filter(req => {
    if (!req.mandatory) return false;
    const hasDoc = projectDocs.some(d => 
      d.category.toLowerCase() === req.category.toLowerCase() ||
      d.docName.toLowerCase().includes(req.category.toLowerCase())
    );
    return !hasDoc;
  });

  // Analyze anomalies across uploaded documents
  const expiredDocs = projectDocs.filter(d => d.status === 'Expired');
  const mismatchDocs = projectDocs.filter(d => d.status === 'Name Mismatch');
  const blurryDocs = projectDocs.filter(d => d.status === 'Blurry / Unreadable');
  const validDocs = projectDocs.filter(d => d.status === 'Valid');

  // Compute readiness score (0-100)
  const totalMandatory = requiredDocCategories.filter(r => r.mandatory).length;
  const presentMandatory = totalMandatory - missingCategories.length;
  const penalty = (expiredDocs.length * 15) + (mismatchDocs.length * 20) + (blurryDocs.length * 10);
  const baseScore = Math.round((presentMandatory / totalMandatory) * 100);
  const readinessScore = Math.max(10, Math.min(100, baseScore - penalty));

  const isReadyForSubmission = readinessScore >= 90 && missingCategories.length === 0 && mismatchDocs.length === 0;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white dark:bg-[#16261C] border border-[#D4EEDC] dark:border-[#253D2C] text-slate-900 dark:text-slate-100 max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span>AI Statutory Pre-Flight Engine</span>
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Statutory Dossier Pre-Audit Checklist
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                Enterprise: <strong>{activeProject.businessName}</strong> • Sector: {activeProject.sector} ({activeProject.entityType})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Readiness Score Card */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isReadyForSubmission
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white shadow-md ${
                isReadyForSubmission ? 'bg-emerald-600' : readinessScore >= 60 ? 'bg-amber-600' : 'bg-rose-600'
              }`}>
                <span className="text-xl leading-none">{readinessScore}%</span>
                <span className="text-[9px] uppercase tracking-wider mt-0.5">Readiness</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  {isReadyForSubmission ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dossier Ready for Multi-Department Submission</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Action Required Before Submission ({missingCategories.length + mismatchDocs.length + expiredDocs.length + blurryDocs.length} Issues Found)</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isReadyForSubmission
                    ? 'All mandatory certificates verified cleanly by PermitFlow AI with 0 legal entity name mismatches and active valid tenures.'
                    : 'PermitFlow AI detected missing files or anomalies that could trigger officer queries or submission delays. Review recommendations below.'}
                </p>
              </div>
            </div>

            {onNavigateToDocumentCentre && !isReadyForSubmission && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDocumentCentre();
                }}
                className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#255933] text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <span>Fix in Document Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* AI Pre-Audit Findings Breakdown */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#2E6F40]" />
              <span>Mandatory Statutory Document Audit</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requiredDocCategories.map((req, idx) => {
                const matchedDoc = projectDocs.find(d => 
                  d.category.toLowerCase() === req.category.toLowerCase() ||
                  d.docName.toLowerCase().includes(req.category.toLowerCase())
                );
                const isUploaded = !!matchedDoc;
                const isDocValid = matchedDoc?.status === 'Valid';
                const hasIssue = matchedDoc && matchedDoc.status !== 'Valid';

                return (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                      isDocValid
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                        : hasIssue
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                        : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        {isDocValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : hasIssue ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>{req.label}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                        {isUploaded ? (
                          <span>Uploaded: <strong className="text-slate-800 dark:text-slate-200">{matchedDoc?.docName}</strong></span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-bold">Missing from project Document Centre</span>
                        )}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                      isDocValid
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : hasIssue
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    }`}>
                      {matchedDoc ? matchedDoc.status : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Anomaly Warnings List */}
          {(mismatchDocs.length > 0 || expiredDocs.length > 0 || blurryDocs.length > 0) && (
            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
              <h4 className="font-extrabold text-xs text-rose-900 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical AI Pre-Audit Flags Requiring Replacement</span>
              </h4>

              <div className="space-y-2">
                {mismatchDocs.map(d => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-white dark:bg-[#1A2E22] border border-rose-200 dark:border-rose-900 text-xs text-slate-800 dark:text-slate-200">
                    <strong className="text-rose-700 dark:text-rose-400">Legal Entity Name Mismatch:</strong> {d.docName}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Name on document does not match project title "{activeProject.businessName}". Upload a name-change gazette or corrected document.
                    </p>
                  </div>
                ))}

                {expiredDocs.map(d => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-white dark:bg-[#1A2E22] border border-rose-200 dark:border-rose-900 text-xs text-slate-800 dark:text-slate-200">
                    <strong className="text-rose-700 dark:text-rose-400">Certificate Expired:</strong> {d.docName}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Validity expired. Department officers will reject expired statutory certifications. Please upload renewed version.
                    </p>
                  </div>
                ))}

                {blurryDocs.map(d => (
                  <div key={d.id} className="p-2.5 rounded-xl bg-white dark:bg-[#1A2E22] border border-rose-200 dark:border-rose-900 text-xs text-slate-800 dark:text-slate-200">
                    <strong className="text-rose-700 dark:text-rose-400">Low Resolution / Unreadable Seal:</strong> {d.docName}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Resolution is under 200 DPI. Re-scan at 300+ DPI to pass officer automated OCR audit.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 flex flex-wrap justify-between items-center gap-3 border-t border-slate-200 dark:border-[#253D2C]">
            <div className="text-slate-500 text-[11px]">
              AI Rulebook: Maharashtra Single Window Clearance Act 2026 • Real-time OCR
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                Close
              </button>

              {onNavigateToDocumentCentre && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToDocumentCentre();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2E6F40] hover:bg-[#255933] text-white font-extrabold shadow-xs cursor-pointer"
                >
                  Manage Documents
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
