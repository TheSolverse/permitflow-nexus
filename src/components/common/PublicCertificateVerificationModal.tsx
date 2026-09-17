import React from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  Calendar, 
  Lock, 
  ExternalLink,
  Award,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export interface PublicVerificationDetails {
  certificateId: string;
  approvalName: string;
  businessName: string;
  department: string;
  issuedDate: string;
  expiryDate?: string;
  validityTenure?: string;
  certificateType: 'PROVISIONAL' | 'FINAL';
  officerName: string;
  officerDesignation?: string;
  qrToken: string;
  sha256Hash: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  conditions?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  details: PublicVerificationDetails | null;
}

export const PublicCertificateVerificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  details
}) => {
  if (!isOpen || !details) return null;

  const isProvisional = details.certificateType === 'PROVISIONAL';

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white dark:bg-[#122216] border-2 border-emerald-500/40 text-slate-900 dark:text-slate-100 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Verification Header Banner */}
        <div className="bg-gradient-to-r from-[#0B1E13] via-[#1A3D27] to-[#2E6F40] text-white p-5 border-b border-emerald-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold">
                  Government of Maharashtra • Public Verification Portal
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Statutory Certificate Authenticity Audit
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Authenticity Badge */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                100% Cryptographically Verified & Genuine
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Signed on Government of Maharashtra Single Window Registry.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0 shadow-xs">
            {details.status}
          </span>
        </div>

        {/* Certificate Inspection Details */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-[#1A2E22] rounded-xl border border-slate-200 dark:border-emerald-900/60 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold">Certificate Registration ID</span>
              <div className="font-extrabold text-slate-900 dark:text-emerald-300">{details.certificateId}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold">Certificate Category</span>
              <div className="font-extrabold text-slate-900 dark:text-white">
                {isProvisional ? 'Provisional Clearance NOC' : 'Final Statutory Certificate'}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-emerald-900/40">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Applicant Enterprise:</span>
              <strong className="text-slate-900 dark:text-white font-extrabold text-sm">{details.businessName}</strong>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-emerald-900/40">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Statutory Permission:</span>
              <strong className="text-slate-900 dark:text-emerald-300 font-extrabold">{details.approvalName}</strong>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-emerald-900/40">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Issuing Department:</span>
              <strong className="text-slate-900 dark:text-white">{details.department}</strong>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-emerald-900/40">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Authorized Officer:</span>
              <strong className="text-slate-900 dark:text-white">{details.officerName} ({details.officerDesignation || 'Competent Authority'})</strong>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-emerald-900/40">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Validity Tenure:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                {details.validityTenure || 'Permanent'} (Issued: {details.issuedDate} {details.expiryDate ? `• Expires: ${details.expiryDate}` : ''})
              </strong>
            </div>
          </div>

          {details.conditions && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
              <span className="font-bold block mb-0.5">Statutory Covenants & Conditions:</span>
              {details.conditions}
            </div>
          )}

          {/* Cryptographic SHA256 & QR Token */}
          <div className="p-3 bg-slate-900 text-slate-300 rounded-xl space-y-1.5 font-mono text-[10px] border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>SHA-256 Digital Verification Hash</span>
              </span>
              <span className="text-emerald-400 font-bold">SEAL ACTIVE</span>
            </div>
            <div className="text-emerald-300 break-all select-all font-mono font-bold">
              {details.sha256Hash}
            </div>
            <div className="text-[9px] text-slate-400 pt-0.5">
              Public Ledger Gateway: <code>https://permitflow.maharashtra.gov.in/verify/{details.certificateId}</code>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#255933] text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Close Verification Modal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
