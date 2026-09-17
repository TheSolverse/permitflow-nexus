import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  Calendar, 
  QrCode, 
  Award, 
  Download, 
  Lock,
  Building2,
  ExternalLink,
  FileCheck2
} from 'lucide-react';
import { PublicCertificateVerificationModal, PublicVerificationDetails } from './PublicCertificateVerificationModal';

export interface CertificateData {
  certificateId: string;
  approvalName: string;
  businessName: string;
  applicantName?: string;
  department: string;
  issuedDate: string;
  expiryDate?: string;
  validityTenure?: string;
  certificateType: 'PROVISIONAL' | 'FINAL';
  officerName: string;
  officerDesignation?: string;
  location?: string;
  conditions?: string;
  qrCodeData?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cert: CertificateData | null;
}

export const DigitalCertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cert
}) => {
  const [showPublicVerifier, setShowPublicVerifier] = useState(false);

  if (!isOpen || !cert) return null;

  const isProvisional = cert.certificateType === 'PROVISIONAL';
  const certTitle = isProvisional
    ? `PROVISIONAL CLEARANCE & NOC (${cert.approvalName.toUpperCase()})`
    : `STATUTORY APPROVAL & COMPLIANCE CERTIFICATE`;

  const certId = cert.certificateId || `MH-2026-${cert.department.substring(0, 4).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const issuedDate = cert.issuedDate || new Date().toISOString().split('T')[0];
  const qrToken = cert.qrCodeData || `PFN-CERT-VERIFIED:${certId}:${cert.businessName}:${issuedDate}`;
  const sha256Hash = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855${certId.replace(/[^0-9]/g, '')}`;

  const publicDetails: PublicVerificationDetails = {
    certificateId: certId,
    approvalName: cert.approvalName,
    businessName: cert.businessName,
    department: cert.department,
    issuedDate: issuedDate,
    expiryDate: cert.expiryDate,
    validityTenure: cert.validityTenure,
    certificateType: cert.certificateType,
    officerName: cert.officerName,
    officerDesignation: cert.officerDesignation,
    qrToken: qrToken,
    sha256Hash: sha256Hash,
    status: 'ACTIVE',
    conditions: cert.conditions
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div 
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      >
        <div className="bg-white text-slate-900 max-w-3xl w-full rounded-2xl shadow-2xl border-4 border-[#1E3A2B] overflow-hidden my-6">
          
          {/* Top Control Bar */}
          <div className="bg-gradient-to-r from-[#0A192F] via-[#1E3A2B] to-[#2E6F40] text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Government of Maharashtra • Digital Certificate System</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPublicVerifier(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Open public verification page"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify via QR Portal</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PRINTABLE CERTIFICATE CARD CONTENT */}
          <div className="p-8 space-y-6 bg-gradient-to-b from-[#F7FAF8] via-white to-[#F0F7F2] border-8 border-double border-[#2E6F40]/30 relative overflow-hidden">
            
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Building2 className="w-96 h-96 text-emerald-950" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 pb-4 border-b-2 border-[#2E6F40]/30 relative z-10">
              <div className="flex justify-center items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#1E3A2B] text-amber-400 flex items-center justify-center shadow-md border-2 border-amber-400/40">
                  <Building2 className="w-7 h-7" />
                </div>
              </div>
              <h1 className="text-sm font-extrabold uppercase tracking-widest text-[#1E3A2B]">
                Government of Maharashtra
              </h1>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {cert.department}
              </h2>
              <div className="inline-block px-4 py-1 bg-[#1E3A2B] text-emerald-100 rounded-full font-extrabold text-xs tracking-wide shadow-xs mt-1">
                {certTitle}
              </div>
            </div>

            {/* Certificate Metadata Bar */}
            <div className="flex flex-wrap justify-between items-center text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-emerald-200 shadow-xs relative z-10 gap-2">
              <div>
                <span className="font-bold text-slate-500 font-sans">Certificate No: </span>
                <strong className="text-[#1E3A2B]">{certId}</strong>
              </div>
              <div>
                <span className="font-bold text-slate-500 font-sans">Issued Date: </span>
                <strong className="text-slate-900">{issuedDate}</strong>
              </div>
              {cert.validityTenure && (
                <div>
                  <span className="font-bold text-slate-500 font-sans">Validity: </span>
                  <strong className="text-emerald-700">{cert.validityTenure}</strong>
                </div>
              )}
            </div>

            {/* Certificate Body Wording */}
            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif relative z-10">
              <p>
                This is to officially certify that the statutory approval application for{' '}
                <strong className="font-sans font-extrabold text-slate-900 text-sm">{cert.approvalName}</strong> submitted by{' '}
                <strong className="font-sans font-extrabold text-[#1E3A2B] text-sm">{cert.businessName}</strong>, located at{' '}
                <strong className="font-sans font-bold">{cert.location || 'MIDC Industrial Area, Maharashtra'}</strong>, has been duly scrutinised, audited, and granted statutory approval in compliance with the relevant Maharashtra state legislations and statutory regulations.
              </p>

              {cert.conditions && (
                <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 font-sans text-xs space-y-1 text-amber-950">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Statutory Covenants & Compliance Conditions:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900/90 pl-5">{cert.conditions}</p>
                </div>
              )}

              <p className="text-[11px] text-slate-600 font-sans italic pt-1">
                This certificate is electronically generated through the PermitFlow NEXUS Single Window Clearance System and bears the digital signature of the designated competent authority.
              </p>
            </div>

            {/* Certificate Footer with Signature & QR Code */}
            <div className="pt-6 border-t-2 border-[#2E6F40]/30 flex flex-col sm:flex-row justify-between items-end gap-6 relative z-10">
              
              {/* QR Verification Block */}
              <div 
                onClick={() => setShowPublicVerifier(true)}
                className="flex items-center gap-3 p-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 transition-colors cursor-pointer group shadow-xs"
                title="Click to view public QR verification modal"
              >
                <div className="w-14 h-14 bg-[#1E3A2B] p-1 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:bg-[#2E6F40] transition-colors">
                  <QrCode className="w-11 h-11 text-emerald-200" />
                </div>
                <div className="text-[10px]">
                  <div className="font-extrabold text-[#1E3A2B] flex items-center gap-1">
                    <span>Cryptographic QR Stamp</span>
                    <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                  </div>
                  <div className="font-mono text-slate-500 text-[9px]">{certId}</div>
                  <div className="text-emerald-700 font-bold text-[9px] mt-0.5">Click / Scan to Verify Live</div>
                </div>
              </div>

              {/* Officer Digital Signature Box */}
              <div className="text-right space-y-1 font-sans">
                <div className="inline-block p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-left mb-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digitally Signed & Certified</span>
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono">Timestamp: {issuedDate} 12:00 IST</div>
                </div>
                <div className="font-extrabold text-xs text-slate-900">{cert.officerName}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {cert.officerDesignation || 'Competent Scrutiny Authority'}
                </div>
                <div className="text-[10px] text-[#2E6F40] font-bold">{cert.department}</div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Public QR Verification Portal Modal */}
      {showPublicVerifier && (
        <PublicCertificateVerificationModal
          isOpen={showPublicVerifier}
          onClose={() => setShowPublicVerifier(false)}
          details={publicDetails}
        />
      )}
    </>
  );
};
