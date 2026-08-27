import React, { useState } from 'react';
import { DocumentItem } from '../../types';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  Sparkles, 
  Building2, 
  Stamp,
  Award,
  Eye,
  Lock,
  Search
} from 'lucide-react';

interface Props {
  document: DocumentItem | null;
  onClose: () => void;
  onApprove: (docId: string) => void;
  onReject: (docId: string) => void;
}

export const OfficerDocumentViewerModal: React.FC<Props> = ({
  document: doc,
  onClose,
  onApprove,
  onReject
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [docStatus, setDocStatus] = useState<'IDLE' | 'APPROVED' | 'REJECTED'>('IDLE');

  if (!doc) return null;

  const handleApprove = () => {
    setDocStatus('APPROVED');
    setTimeout(() => {
      onApprove(doc.id);
      onClose();
    }, 600);
  };

  const handleReject = () => {
    setDocStatus('REJECTED');
    setTimeout(() => {
      onReject(doc.id);
      onClose();
    }, 600);
  };

  // Helper to determine document template type by title
  const docTitleLower = doc.docName.toLowerCase();
  const isPan = docTitleLower.includes('pan');
  const isGst = docTitleLower.includes('gst');
  const isMidc = docTitleLower.includes('midc') || docTitleLower.includes('land') || docTitleLower.includes('possession');
  const isWaterLab = docTitleLower.includes('water') || docTitleLower.includes('nabl') || docTitleLower.includes('lab') || docTitleLower.includes('pollution');
  const isFire = docTitleLower.includes('fire') || docTitleLower.includes('hydraulic');
  const isStructural = docTitleLower.includes('structural') || docTitleLower.includes('stability') || docTitleLower.includes('etp');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-400 font-extrabold shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">{doc.docName}</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase border border-amber-500/40">
                  {doc.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Official Document Verification Portal • Uploaded on {doc.uploadDate} • Size: {doc.fileSize || '2.4 MB'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button 
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))} 
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-slate-300">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))} 
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: Split View (Left: Realistic Document Preview, Right: AI OCR Verification Panel) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT 8 COLS: REALISTIC GENERATED DOCUMENT PREVIEW CONTAINER */}
          <div className="lg:col-span-8 bg-slate-200/90 p-4 sm:p-6 overflow-y-auto flex justify-center items-start">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl border border-slate-300 p-6 sm:p-8 space-y-6 transition-all duration-300 text-slate-900 relative"
            >

              {/* Watermark Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] rotate-[-30deg]">
                <span className="text-7xl sm:text-8xl font-black text-slate-900 tracking-widest uppercase">
                  MAHARASHTRA GOVT VERIFIED
                </span>
              </div>

              {/* TEMPLATE 1: COMPANY PAN CARD */}
              {isPan && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl flex items-center justify-between border-b-4 border-amber-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-amber-400 border border-white/20">
                        🇮🇳
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold uppercase text-amber-300 tracking-wider">INCOME TAX DEPARTMENT • GOVT OF INDIA</div>
                        <div className="text-xs font-black tracking-widest text-white">आयकर विभाग • भारत सरकार</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">PERMANENT ACCOUNT NUMBER CARD</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-300 shadow-inner grid grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="col-span-2 space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Name of Entity / Card Holder</div>
                        <div className="font-extrabold text-sm text-slate-900 tracking-tight">SAHYADRI FOOD EXTRACTS & SPICES PRIVATE LIMITED</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Entity Type & Act</div>
                        <div className="font-bold text-slate-800">Incorporated under Companies Act, 2013</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Date of Incorporation</div>
                        <div className="font-bold text-slate-800">12 / 06 / 2021</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-amber-700 font-extrabold uppercase">Permanent Account Number (PAN)</div>
                        <div className="font-black text-xl text-slate-950 tracking-widest font-mono bg-amber-100/80 px-3 py-1 rounded border border-amber-300 inline-block">
                          AAACA9812K
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-3 border-l border-slate-200 pl-4">
                      <div className="w-24 h-24 bg-slate-900 rounded-xl p-1 shadow-md flex items-center justify-center text-white">
                        {/* Fake QR code illustration */}
                        <div className="w-full h-full border-2 border-dashed border-amber-400/80 flex items-center justify-center text-[9px] font-mono text-center p-1">
                          GOI TAX QR STAMP
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 text-center">Digitally Verified Income Tax Hologram</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200 pt-3">
                    <span>Signature of Authorized Officer: <em>[Digitally Signed DSC Key #9921]</em></span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Direct Tax Database Match
                    </span>
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: GST REGISTRATION CERTIFICATE (FORM REG-06) */}
              {isGst && (
                <div className="space-y-6">
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <div className="text-xs font-black text-slate-900 uppercase tracking-widest">GOVERNMENT OF INDIA</div>
                    <div className="text-sm font-extrabold text-slate-800">GOODS AND SERVICES TAX COUNCIL</div>
                    <div className="text-base font-black text-indigo-900 uppercase mt-1">FORM GST REG-06</div>
                    <div className="text-[11px] font-bold text-slate-500">Registration Certificate (Issued under Section 25 of Central Goods and Services Tax Act, 2017)</div>
                  </div>

                  <div className="space-y-3 text-xs bg-slate-50 p-5 rounded-xl border border-slate-300">
                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">1. Registration Number (GSTIN):</span>
                      <span className="col-span-2 font-black text-sm text-indigo-950 font-mono">27AAACA9812K1Z5</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">2. Legal Name of Business:</span>
                      <span className="col-span-2 font-extrabold text-slate-900">Apex Foods & Spices Private Limited</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">3. Trade Name (if any):</span>
                      <span className="col-span-2 font-extrabold text-amber-900">Sahyadri Food Extracts & Spices</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">4. Address of Principal Place:</span>
                      <span className="col-span-2 font-medium text-slate-800">Plot C-42, Chakan Industrial Area Phase II, Khed, Pune, Maharashtra 410501</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-500">5. Date of Validity:</span>
                      <span className="col-span-2 font-bold text-emerald-800">From 15/06/2021 to Perpetual</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-bold text-slate-500">6. Jurisdiction Office:</span>
                      <span className="col-span-2 font-semibold text-slate-800">Range IV, Division Chakan, Commissionarate Pune-I</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                    <div className="text-[10px] text-slate-500 space-y-1">
                      <div>Certificate ID: GST/MH/PN/2026/7781</div>
                      <div>System Verification Code: 9912-4412-8812</div>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg border border-slate-300 p-1 flex items-center justify-center font-mono text-[9px] text-slate-600 mb-1">
                        SEAL OF SUPERINTENDENT GST
                      </div>
                      <div className="text-[10px] font-extrabold text-slate-900">Superintendent of State Tax</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: MIDC LAND POSSESSION DEED */}
              {isMidc && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black tracking-widest uppercase text-amber-100">MAHARASHTRA INDUSTRIAL DEVELOPMENT CORPORATION</div>
                      <div className="text-sm font-extrabold text-white">MIDC Industrial Allotment & Lease Possession Deed</div>
                    </div>
                    <Building2 className="w-8 h-8 text-amber-200" />
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold uppercase">MIDC Order Ref No:</span>
                        <div className="font-black text-sm text-slate-900">MIDC/PUNE/CHAKAN-II/2026/892</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold uppercase">Lease Validity Period:</span>
                        <div className="font-black text-sm text-emerald-800">95 Years (Registered Deed)</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold uppercase">Allotted Lessee:</span>
                        <div className="font-bold text-slate-900">Apex Foods & Spices Pvt Ltd</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-800 font-bold uppercase">Allotted Plot & Area:</span>
                        <div className="font-bold text-slate-900">Plot No. C-42 (Area: 1,250 Sq. Meters)</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2">
                      <div className="font-bold text-slate-900 text-xs">Statutory Land Conditions Summary:</div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        The lessee is granted industrial land rights under MIDC General Land Regulations 1975 for setting up an Agro Processing and Food Extraction facility. Non-polluting industrial effluent standard applies. Minimum 35% open ground area reserved for landscaping and fire tender driveway.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 text-xs">
                    <div className="text-[10px] text-slate-500">
                      <div>Sub-Registrar Registration No: KHD/8892/2026</div>
                      <div>GIS Coordinates Verified: 18.7604° N, 73.8622° E</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">Executive Engineer (Civil)</div>
                      <div className="text-[10px] text-slate-500">MIDC Regional Division Pune</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 4: WATER QUALITY ANALYSIS REPORT (NABL LAB) */}
              {isWaterLab && (
                <div className="space-y-6">
                  <div className="border-b-2 border-indigo-900 pb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-indigo-950 uppercase">EXCELLENCE ANALYTICAL RESEARCH LABS</div>
                      <div className="text-[10px] text-indigo-700 font-extrabold">NABL Accredited Testing Facility (Cert # TC-8921) • MPCB Approved</div>
                    </div>
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-900 font-extrabold text-[10px] rounded-md border border-indigo-300">
                      NABL LAB TEST REPORT
                    </div>
                  </div>

                  {/* Highlight AI Name Mismatch Flag Notice */}
                  {doc.status === 'Name Mismatch' && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs space-y-1">
                      <div className="font-extrabold flex items-center gap-1.5 text-rose-700">
                        <AlertTriangle className="w-4 h-4" />
                        AI OCR Name Mismatch Flag Detected:
                      </div>
                      <div className="text-[11px] font-semibold">
                        Customer name on report reads <strong className="underline text-rose-950">"Apex Agro Unit 1"</strong> whereas registered project profile name is <strong className="underline text-indigo-950">"Apex Foods & Spices Pvt Ltd"</strong>.
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                      <div><span className="font-bold text-slate-500">Sample Description:</span> Raw Effluent & Process Discharge</div>
                      <div><span className="font-bold text-slate-500">Date of Sampling:</span> 01 / 07 / 2026</div>
                    </div>

                    {/* Test Table */}
                    <div className="space-y-2">
                      <div className="font-extrabold text-slate-900 text-xs">Chemical & Biological Test Parameters:</div>
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-200 text-slate-800">
                            <th className="p-1.5 border">Parameter</th>
                            <th className="p-1.5 border">Observed Value</th>
                            <th className="p-1.5 border">MPCB Limit</th>
                            <th className="p-1.5 border">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1.5 border font-semibold">pH Value</td>
                            <td className="p-1.5 border">7.2</td>
                            <td className="p-1.5 border">6.5 - 8.5</td>
                            <td className="p-1.5 border font-bold text-emerald-700">PASS</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="p-1.5 border font-semibold">BOD (3 days at 27°C)</td>
                            <td className="p-1.5 border">28 mg/L</td>
                            <td className="p-1.5 border">&lt; 30 mg/L</td>
                            <td className="p-1.5 border font-bold text-emerald-700">PASS</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 border font-semibold">Chemical Oxygen Demand (COD)</td>
                            <td className="p-1.5 border">180 mg/L</td>
                            <td className="p-1.5 border">&lt; 250 mg/L</td>
                            <td className="p-1.5 border font-bold text-emerald-700">PASS</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="p-1.5 border font-semibold">Total Suspended Solids (TSS)</td>
                            <td className="p-1.5 border">42 mg/L</td>
                            <td className="p-1.5 border">&lt; 100 mg/L</td>
                            <td className="p-1.5 border font-bold text-emerald-700">PASS</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500">Tested by: Senior Chemist Dr. S. K. Mahajan</span>
                    </div>
                    <div className="text-right font-extrabold text-indigo-900">
                      Technical Director (NABL Signatory)
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 5: FIRE SYSTEM HYDRAULIC LAYOUT */}
              {isFire && (
                <div className="space-y-6">
                  <div className="bg-rose-950 text-white p-4 rounded-xl flex items-center justify-between border-b-4 border-rose-500">
                    <div>
                      <div className="text-xs font-extrabold uppercase text-rose-300">MAHARASHTRA FIRE SERVICES</div>
                      <div className="text-sm font-black text-white">Hydraulic Sprinkler & Fire Hose Network Layout</div>
                    </div>
                    <div className="px-3 py-1 bg-rose-800 rounded font-mono text-[10px] text-amber-300 font-extrabold">
                      FIRE DEPT FILE # MFS-2026-9912
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs space-y-3 border border-slate-800 shadow-inner">
                    <div className="flex justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-300">
                      <span>Drawing No: FS-HYD-04/R2</span>
                      <span>Scale: 1 : 200 (Metric)</span>
                    </div>
                    
                    {/* Simulated Blueprint ASCII / Diagram */}
                    <div className="p-4 bg-slate-900 rounded border border-slate-800 text-center font-mono text-[10px] text-slate-400 space-y-2">
                      <div className="text-amber-400 font-extrabold">==================== FACTORY SHED HYDRANT GRID ====================</div>
                      <div>[ PUMP HOUSE: 2,280 LPM Main Diesel + 180 LPM Jockey Pump ] ====&gt; [ 14 Yard Hydrants ]</div>
                      <div>[ AUTOMATIC WET PIPE SPRINKLER NETWORK: 120 PSI PRESSURE TEST PASSED ]</div>
                      <div className="text-amber-400 font-extrabold">==================================================================</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>Water Tank Capacity: <strong className="text-white">2,50,000 Liters Underground</strong></div>
                      <div>Sprinkler Head Spacing: <strong className="text-white">3.0m x 3.0m Grid</strong></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-3">
                    <span className="text-slate-500 text-[10px]">Licensed Fire Consultant: Apex Fire Safety Systems (Reg # LFC-0044)</span>
                    <span className="font-extrabold text-rose-900">Chief Fire Officer Approval Stamp</span>
                  </div>
                </div>
              )}

              {/* TEMPLATE 6: STRUCTURAL STABILITY & ETP DESIGN */}
              {isStructural && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black uppercase text-amber-400">CHARTERED STRUCTURAL ENGINEER</div>
                      <div className="text-sm font-extrabold text-white">Structural Stability & Foundation Load Certificate</div>
                    </div>
                    <Award className="w-7 h-7 text-amber-400" />
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-300 space-y-3 text-xs">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      I hereby certify that the structural drawings, foundation designs, and RCC column details for the proposed <strong>Industrial Processing Shed & Effluent Treatment Tank (ETP)</strong> at Plot C-42 Chakan MIDC Phase II have been thoroughly audited and verified as per Indian Standard Codes IS: 456 (2000) & IS: 1893 (Seismic Zone III).
                    </p>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-[11px]">
                      <div>• Safe Soil Bearing Capacity (SBC): <strong>240 kN/m² at 2.5m depth</strong></div>
                      <div>• Total Heavy Equipment Dead Load: <strong>15 kN/m²</strong></div>
                      <div>• ETP Tank Reinforced Concrete Grade: <strong>M-30 Water Retaining Quality</strong></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 pt-3 text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">Er. K. R. Deshpande, M.E. (Struct)</div>
                      <div className="text-[10px] text-slate-500">Chartered Engineer • Reg # SE/PMC/9912</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-slate-900 p-1 flex items-center justify-center text-[8px] font-black text-slate-900 text-center rotate-[-12deg]">
                      CHARTERED ENGINEER SEAL
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 7: DEFAULT / FALLBACK GOVERNMENT VERIFIED CERTIFICATE */}
              {!isPan && !isGst && !isMidc && !isWaterLab && !isFire && !isStructural && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center justify-between border-b-4 border-amber-500">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-amber-400" />
                      <div>
                        <div className="text-xs font-black uppercase text-amber-300">MAHARASHTRA SINGLE-WINDOW PORTAL (MAITRI)</div>
                        <div className="text-sm font-extrabold text-white">Statutory Clearances Verified Copy</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-300 space-y-4 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Document Title / Subject:</div>
                      <div className="font-black text-base text-slate-900">{doc.docName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-lg border border-slate-200">
                      <div><span className="font-bold text-slate-500">Category:</span> {doc.category}</div>
                      <div><span className="font-bold text-slate-500">Upload Date:</span> {doc.uploadDate}</div>
                      <div><span className="font-bold text-slate-500">Status:</span> <span className="font-extrabold text-emerald-700">{doc.status}</span></div>
                      <div><span className="font-bold text-slate-500">OCR Confidence:</span> 96%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 text-xs">
                    <span className="text-[10px] text-slate-500">Cryptographically Sealed Digital Attachment</span>
                    <span className="font-extrabold text-slate-900">Government Portal Record</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT 4 COLS: OFFICER AI OCR & VERIFICATION PANEL */}
          <div className="lg:col-span-4 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-5 text-xs flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase border border-amber-300">
                  AI Pre-Screening & OCR Findings
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">Officer Verification Desk</h3>
              </div>

              {/* AI Confidence & Issue Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-700">AI OCR Confidence Score:</span>
                  <span className={`font-black text-sm ${
                    (doc.aiValidationResult?.confidence || 90) > 80 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {doc.aiValidationResult?.confidence || 94}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      (doc.aiValidationResult?.confidence || 90) > 80 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} 
                    style={{ width: `${doc.aiValidationResult?.confidence || 94}%` }} 
                  />
                </div>

                {doc.aiValidationResult?.issues && doc.aiValidationResult.issues.length > 0 ? (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-1 text-rose-900">
                    <div className="font-extrabold flex items-center gap-1.5 text-rose-700">
                      <AlertTriangle className="w-4 h-4" />
                      AI Validation Flag:
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed">
                      {doc.aiValidationResult.issues[0]}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No AI validation flags. Document is clear & verified.</span>
                  </div>
                )}
              </div>

              {/* Extracted Fields Summary */}
              <div className="space-y-2">
                <div className="font-extrabold text-slate-900 text-xs">OCR Extracted Data:</div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold">Extracted Entity: </span>
                    <strong className="text-slate-900">{doc.aiValidationResult?.extractedName || 'Apex Foods & Spices Pvt Ltd'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Reg / Certificate #: </span>
                    <strong className="text-slate-900">{doc.aiValidationResult?.extractedRegNo || 'AAACA9812K'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Approval / Rejection Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              {docStatus === 'APPROVED' ? (
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-extrabold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Document Approved</span>
                </div>
              ) : docStatus === 'REJECTED' ? (
                <div className="p-3 rounded-xl bg-rose-600 text-white font-extrabold text-center flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  <span>Document Flagged / Rejected</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReject}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Doc</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Doc</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
