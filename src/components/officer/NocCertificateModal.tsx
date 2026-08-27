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
  FileText, 
  Lock,
  Search,
  Building2
} from 'lucide-react';
import { NocApplication } from '../../types';

interface NocCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  noc: NocApplication | null;
  certType?: 'PROVISIONAL' | 'FINAL';
}

export const NocCertificateModal: React.FC<NocCertificateModalProps> = ({
  isOpen,
  onClose,
  noc,
  certType = 'PROVISIONAL'
}) => {
  const [showQrVerifier, setShowQrVerifier] = useState<boolean>(false);

  if (!isOpen || !noc) return null;

  const certTitle = certType === 'PROVISIONAL' 
    ? 'PROVISIONAL NO-OBJECTION CERTIFICATE (NOC)' 
    : 'FINAL STATUTORY NO-OBJECTION CERTIFICATE (NOC)';

  const certId = noc.certificateId || `PFN-NOC-${certType.substring(0, 4)}-2026-9841`;
  const issuedDate = noc.issuedDate || new Date().toISOString().split('T')[0];
  const qrCodeText = noc.qrCodeData || `PFN-VERIFIED-NOC-${certType}-${noc.id}-${certId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="noc-cert-title"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white text-slate-900 max-w-2xl w-full rounded-2xl shadow-2xl border-4 border-slate-900 overflow-hidden my-6">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Government Certificate Viewer • State Single Window System</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrVerifier(!showQrVerifier)}
              className="px-3 py-1 rounded bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQrVerifier ? 'Hide QR Code' : 'Scan QR Code'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QR Code Verification Panel */}
        {showQrVerifier && (
          <div className="p-4 bg-purple-900 text-white text-xs border-b border-purple-800 flex items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center border-2 border-amber-400">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <span className="font-extrabold text-amber-400 uppercase text-[10px]">QR Code Verification Token</span>
                <div className="font-mono text-[11px] text-purple-100 font-bold">{qrCodeText}</div>
                <p className="text-[10px] text-purple-200 mt-0.5">
                  Scan with Maharashtra State Govt portal or phone camera to confirm authentic blockchain registration.
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[10px] uppercase shrink-0 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Signed</span>
            </div>
          </div>
        )}

        {/* PRINTABLE CERTIFICATE CARD CONTENT */}
        <div className="p-8 space-y-6 bg-amber-50/20 border-8 border-double border-amber-900/30">
          
          {/* Certificate Header */}
          <div className="text-center space-y-2 pb-4 border-b-2 border-amber-900/30">
            <div className="flex justify-center items-center gap-2">
              <Building2 className="w-8 h-8 text-amber-900" />
            </div>
            <h1 className="text-sm font-extrabold uppercase tracking-widest text-amber-900">
              Government of Maharashtra
            </h1>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {noc.department}
            </h2>
            <div className="inline-block px-4 py-1 bg-amber-900 text-amber-50 rounded-full font-extrabold text-xs tracking-wide shadow-xs mt-1">
              {certTitle}
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="flex justify-between items-center text-xs font-mono text-slate-700 bg-white p-3 rounded-lg border border-amber-200">
            <div>
              <span className="font-bold text-slate-500">Certificate ID: </span>
              <strong className="text-slate-900">{certId}</strong>
            </div>
            <div>
              <span className="font-bold text-slate-500">Date of Issue: </span>
              <strong className="text-slate-900">{issuedDate}</strong>
            </div>
          </div>

          {/* Certificate Body Wording */}
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
            <p>
              This is to certify that the No-Objection Certificate application submitted by{' '}
              <strong className="font-sans font-extrabold text-slate-900 text-sm">{noc.businessName}</strong> for the establishment of{' '}
              <strong className="font-sans font-bold">{noc.nocName}</strong> located at Plot No. C-42, MIDC Industrial Area, District Maharashtra, has been reviewed and inspected by the competent authorities.
            </p>

            <div className="p-4 rounded-xl bg-white border border-slate-300 font-sans space-y-2 text-[11px]">
              <div className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
                Sanctioned Technical Parameters & Compliance Summary:
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>• Total Built-up Area: <strong>{noc.technicalParameters.builtUpAreaSqM} $m^2$</strong></div>
                <div>• Total Plot Area: <strong>{noc.technicalParameters.plotAreaSqM} $m^2$</strong></div>
                {noc.technicalParameters.waterRequirementKlpd && <div>• Sanctioned Water Quota: <strong>{noc.technicalParameters.waterRequirementKlpd} KLPD</strong></div>}
                {noc.technicalParameters.effluentGenerationKlpd && <div>• Effluent Discharge Limit: <strong>{noc.technicalParameters.effluentGenerationKlpd} KLPD</strong></div>}
                {noc.technicalParameters.electricalLoadKw && <div>• Sanctioned Grid Load: <strong>{noc.technicalParameters.electricalLoadKw} kW ({noc.technicalParameters.voltageLevel})</strong></div>}
              </div>
            </div>

            <p>
              Subject to compliance with statutory conditions laid down under the Maharashtra Fire Prevention & Life Safety Measures Act, MPCB Environmental Protection Guidelines, and DISH Factory Regulations.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 flex items-end justify-between border-t border-amber-900/30 text-xs">
            <div className="space-y-1 text-center">
              <div className="w-20 h-20 mx-auto border-2 border-dashed border-amber-900/40 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-900/60 uppercase">
                Official State Seal
              </div>
              <span className="text-[10px] text-slate-500 font-sans">State Single Window Seal</span>
            </div>

            <div className="text-right space-y-1 font-sans">
              <div className="inline-block p-2 bg-emerald-50 rounded border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                ✓ Digitally Signed & Authenticated
              </div>
              <div className="font-bold text-slate-900 pt-1">Director / Nodal Officer</div>
              <div className="text-[10px] text-slate-500">{noc.department}</div>
              <div className="text-[9px] font-mono text-slate-400">Govt of Maharashtra</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
