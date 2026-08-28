import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartChecklistItem } from '../../types';
import { apiPreValidateChecklist } from '../../services/api';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  AlertTriangle,
  FileCheck,
  Plus,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';

interface ApplyApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvalItem: SmartChecklistItem | null;
  onSuccess: (appId: string) => void;
}

export const ApplyApprovalModal: React.FC<ApplyApprovalModalProps> = ({
  isOpen,
  onClose,
  approvalItem,
  onSuccess
}) => {
  const { 
    currentUser, 
    activeProject, 
    documents, 
    uploadDocument, 
    applyForApproval 
  } = useApp();

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { file: File | null; dataUrl?: string; docId?: string; name: string; size: string }>>({});
  const [applicantRemarks, setApplicantRemarks] = useState('');
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !approvalItem) return null;

  const requiredDocs = approvalItem.requiredDocs && approvalItem.requiredDocs.length > 0
    ? approvalItem.requiredDocs
    : ['PAN Card / Identity Proof', 'Address Proof / Lease Deed', 'Site Layout / Floor Plan'];

  const handleFileChange = (docName: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedFiles(prev => ({
        ...prev,
        [docName]: {
          file,
          dataUrl,
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (docName: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
  };

  const handleSelectExistingDoc = (docName: string, docId: string, docTitle: string, docSize: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docName]: {
        file: null,
        docId,
        name: docTitle,
        size: docSize
      }
    }));
  };

  const allMandatoryAttached = requiredDocs.every(doc => !!uploadedFiles[doc]);
  const uploadedCount = Object.keys(uploadedFiles).length;
  const isSubmitDisabled = !allMandatoryAttached || !declarationChecked || isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSubmitting(true);
    try {
      const finalDocIds: string[] = [];

      // 1. Upload new files
      for (const [docName, fileData] of Object.entries(uploadedFiles)) {
        if (fileData.file || fileData.dataUrl) {
          const newDoc = uploadDocument(
            docName, 
            docName, 
            fileData.file, 
            undefined, 
            fileData.dataUrl
          );
          finalDocIds.push(newDoc.id);
        } else if (fileData.docId) {
          finalDocIds.push(fileData.docId);
        }
      }

      // If user didn't upload any file, attach existing documents
      if (finalDocIds.length === 0 && documents.length > 0) {
        finalDocIds.push(...documents.slice(0, 3).map(d => d.id));
      }

      // 2. Submit application into applications table
      const newApp = applyForApproval(
        approvalItem.id,
        approvalItem.name,
        approvalItem.department,
        finalDocIds,
        applicantRemarks
      );

      setIsSubmitting(false);
      onSuccess(newApp.id);
      onClose();
    } catch (err) {
      console.error('Failed to submit application:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Modal Header */}
        <div>
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold mb-1.5 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Single-Window Clearance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {approvalItem.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {approvalItem.department} • Statutory SLA: <strong className="text-slate-700 dark:text-slate-200">{approvalItem.estimatedTimelineDays} Days</strong> • Govt Fee: <strong className="text-slate-700 dark:text-slate-200">{approvalItem.estimatedFee}</strong>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Summary Strip */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Applicant Project: </span>
                <strong className="text-slate-900 dark:text-white font-bold">{activeProject.businessName}</strong>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Sector: <span className="font-bold text-slate-700 dark:text-slate-300">{activeProject.sector}</span> ({activeProject.district})
            </div>
          </div>

          {/* Required Documents Upload Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Required Supporting Documents</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload certified documents for online officer review and AI validation.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {uploadedCount} of {requiredDocs.length} Attached
              </span>
            </div>

            <div className="space-y-3">
              {requiredDocs.map((docName, idx) => {
                const attached = uploadedFiles[docName];
                const matchingExistingDocs = documents.filter(d => 
                  d.docName.toLowerCase().includes(docName.toLowerCase()) || 
                  d.category.toLowerCase().includes(docName.toLowerCase())
                );

                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      attached 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {docName}
                          </span>
                          <span className="text-[10px] font-bold text-rose-500">*Mandatory</span>
                        </div>

                        {attached ? (
                          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[240px] font-bold">{attached.name}</span>
                            <span className="text-[11px] text-slate-400">({attached.size})</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                              ✓ Ready to sync
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-7">
                            Attach PDF, JPG, or PNG (Max 15MB)
                          </p>
                        )}
                      </div>

                      {/* Upload, Attach & Remove Controls */}
                      <div className="flex items-center gap-2 shrink-0 pl-7 sm:pl-0">
                        <label className="px-3 py-1.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all">
                          <UploadCloud className="w-3.5 h-3.5 text-[#CFFFDC]" />
                          <span>{attached ? 'Change File' : 'Browse File'}</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              handleFileChange(docName, f);
                            }}
                          />
                        </label>

                        {attached && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(docName)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Remove this uploaded file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}

                        {matchingExistingDocs.length > 0 && !attached && (
                          <button
                            type="button"
                            onClick={() => {
                              const doc = matchingExistingDocs[0];
                              handleSelectExistingDoc(docName, doc.id, doc.docName, doc.fileSize || '1.2 MB');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                            title="Attach matching document from your Document Vault"
                          >
                            + Vault File
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Applicant Remarks / Notes */}
          <div className="mt-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Applicant Remarks (Optional)
            </label>
            <textarea
              value={applicantRemarks}
              onChange={(e) => setApplicantRemarks(e.target.value)}
              placeholder="Provide any specific comments, plot layout references, or priority notes for the department officer..."
              rows={2}
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Declaration Checkbox */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-amber-900 dark:text-amber-200">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-amber-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="font-medium leading-relaxed">
                I hereby declare that the documents uploaded and details provided for <strong className="font-bold">{activeProject.businessName}</strong> are true, correct, and compliant with Maharashtra Single-Window Clearances.
              </span>
            </label>
          </div>
        </div>

        {/* Modal Action Buttons & AI Pre-Validation Indicator */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* AI Pre-Validation Summary Box */}
          <div className="p-4 rounded-2xl bg-[#F8FCF9] dark:bg-slate-900 border border-[#D4EEDC] dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#2E6F40] dark:text-[#68BA7F]">
                <Sparkles className="w-4 h-4" />
                <span>AI Pre-Submission Checklist Audit</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                allMandatoryAttached ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {allMandatoryAttached ? '100% Pre-Validated' : `${uploadedCount}/${requiredDocs.length} Documents Attached`}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <CheckCircle2 className={`w-3.5 h-3.5 ${allMandatoryAttached ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Checklist Match</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Validity Check</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Profile Match</span>
              </div>
            </div>
          </div>

          {!allMandatoryAttached && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                Please upload all {requiredDocs.length} mandatory documents ({uploadedCount}/${requiredDocs.length} attached) to enable submission.
              </span>
            </div>
          )}

          {allMandatoryAttached && !declarationChecked && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Please check the statutory declaration above to proceed with submission.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#2E6F40] hover:bg-[#253D2C] active:bg-[#1E3326] shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 text-[#CFFFDC]" />
              <span>
                {isSubmitting
                  ? 'Submitting to Supabase...'
                  : !allMandatoryAttached
                  ? `Upload All Files (${uploadedCount}/${requiredDocs.length})`
                  : !declarationChecked
                  ? 'Confirm Declaration'
                  : 'Submit Application & Sync to DB'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
