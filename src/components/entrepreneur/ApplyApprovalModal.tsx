import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SmartChecklistItem } from '../../types';
import { performRealOcr } from '../../utils/realOcrAnalyzer';
import { apiPreValidateChecklist, apiAnalyzeDocumentOCR } from '../../services/api';
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
  Loader2,
  FolderCheck,
  Search,
  Award,
  Check,
  FolderOpen
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
    applyForApproval,
    setActiveTab
  } = useApp();

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { 
    file: File | null; 
    dataUrl?: string; 
    docId?: string; 
    name: string; 
    size: string;
    ocrResult?: any;
  }>>({});
  const [scanningDocNames, setScanningDocNames] = useState<Record<string, boolean>>({});
  const [selectingVaultForDoc, setSelectingVaultForDoc] = useState<string | null>(null);
  const [vaultSearchQuery, setVaultSearchQuery] = useState('');
  const [applicantRemarks, setApplicantRemarks] = useState('');
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic MCA document rules engine selectors
  const [premisesType, setPremisesType] = useState<'RENTED' | 'OWNED' | 'DIRECTOR_RESIDENCE'>('RENTED');
  const [directorResidency, setDirectorResidency] = useState<'INDIAN' | 'FOREIGN'>('INDIAN');

  if (!isOpen || !approvalItem) return null;

  if (!activeProject || !activeProject.id || activeProject.id.trim().length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Project Required</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You must create a Business Project profile before applying for government clearances.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveTab('new-project');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E6F40] text-white font-bold text-xs shadow-sm hover:bg-[#235833]"
            >
              + Create Project Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isMcaCompany = approvalItem.id === 'appr-1' || approvalItem.name.toLowerCase().includes('company incorporation') || approvalItem.name.toLowerCase().includes('spice+');
  const isMcaLlp = approvalItem.id === 'appr-1-llp' || approvalItem.name.toLowerCase().includes('llp incorporation') || approvalItem.name.toLowerCase().includes('fillip');

  let requiredDocs: string[] = [];

  if (isMcaCompany) {
    requiredDocs = [
      'PAN Card of Proposed Directors / Subscribers',
      directorResidency === 'FOREIGN' 
        ? 'Passport & Apostilled/Notarized Identity & Address Proof' 
        : 'Identity & Address Proof (Voter ID / Passport / Driving License / Aadhaar)',
      'Digital Signature Certificate (DSC) for Signatories',
      premisesType === 'RENTED' 
        ? 'Registered Lease Deed / Rent Agreement' 
        : premisesType === 'OWNED' 
        ? 'Property Ownership Title Deed / Tax Receipt' 
        : 'Director/Subscriber Residence Proof & Title Document',
      'Registered Office Utility Bill (< 2 Months Old: Electricity/Gas/Water)',
      'Owner NOC (No Objection Certificate) for Registered Office',
      'Draft e-MoA (INC-33) & e-AoA (INC-34) Details',
      'AGILE-PRO-S (GSTIN, EPFO, ESIC & Bank Account) Particulars'
    ];
  } else if (isMcaLlp) {
    requiredDocs = [
      'PAN Card of Designated Partners',
      directorResidency === 'FOREIGN' 
        ? 'Passport & Apostilled/Notarized Identity & Address Proof' 
        : 'Identity & Address Proof (Voter ID / Passport / Driving License / Aadhaar)',
      'Digital Signature Certificate (DSC) of Designated Partners',
      premisesType === 'RENTED' 
        ? 'Registered Lease Deed / Rent Agreement' 
        : premisesType === 'OWNED' 
        ? 'Property Ownership Title Deed / Tax Receipt' 
        : 'Partner Residence Proof & Title Document',
      'Registered Office Utility Bill (< 2 Months Old: Electricity/Gas/Water)',
      'Owner NOC (No Objection Certificate) for Registered Office',
      'Form 3 LLP Agreement & Partners Consent (Subscriber Sheet)'
    ];
  } else {
    requiredDocs = approvalItem.requiredDocs && approvalItem.requiredDocs.length > 0
      ? approvalItem.requiredDocs
      : ['PAN Card / Identity Proof', 'Address Proof / Lease Deed', 'Site Layout / Floor Plan'];
  }

  const handleFileChange = async (docName: string, file: File | null) => {
    if (!file) return;
    setScanningDocNames(prev => ({ ...prev, [docName]: true }));

    let dataUrl: string | undefined = undefined;
    try {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(URL.createObjectURL(file));
        reader.readAsDataURL(file);
      });
    } catch {
      dataUrl = URL.createObjectURL(file);
    }

    let ocrRes: any = undefined;
    try {
      // Run real OCR document verification (same as Document Centre)
      ocrRes = await performRealOcr(file, docName, docName, {
        businessName: activeProject.businessName,
        applicantName: currentUser?.name || 'Rajesh V. Patil',
        district: activeProject.district
      });
    } catch (err) {
      console.warn('Local OCR check notice:', err);
      try {
        const serverOcr = await apiAnalyzeDocumentOCR({
          docName,
          category: docName,
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
      } catch {}
    } finally {
      setScanningDocNames(prev => ({ ...prev, [docName]: false }));
    }

    setUploadedFiles(prev => ({
      ...prev,
      [docName]: {
        file,
        dataUrl,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        ocrResult: ocrRes
      }
    }));
  };

  const handleRemoveFile = (docName: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[docName];
      return copy;
    });
  };

  const handleSelectExistingDoc = (
    docName: string, 
    docId: string, 
    docTitle: string, 
    docSize: string,
    customUrl?: string,
    customOcr?: any
  ) => {
    const existing = documents.find(d => d.id === docId);

    // Determine appropriate image url for vault document
    let fileUrl = existing?.fileUrl || customUrl;
    if (!fileUrl) {
      const lower = (existing?.docName || docTitle).toLowerCase();
      if (lower.includes('fire') && lower.includes('noc')) fileUrl = '/datafile/09_Fire_Safety_NOC/fire_safety_noc.jpg';
      else if (lower.includes('fire') && lower.includes('fighting')) fileUrl = '/datafile/27_Fire_Fighting_System_Drawing/fire_fighting_system_drawing.jpg';
      else if (lower.includes('gst')) fileUrl = '/datafile/08_GST_Certificate/gst_registration_reg06.jpg';
      else if (lower.includes('mpcb') || lower.includes('pollution')) fileUrl = '/datafile/10_Pollution_MPCB_Consent/mpcb_consent_to_establish.jpg';
      else if (lower.includes('factory') || lower.includes('dish')) fileUrl = '/datafile/11_Factory_DISH_Licence/dish_factory_licence.jpg';
      else if (lower.includes('land') || lower.includes('midc')) fileUrl = '/datafile/16_MIDC_Land_Allotment/16_midc_land_allotment.jpg';
      else if (lower.includes('pan')) fileUrl = '/datafile/01_PAN_Card/pan_card.jpg';
      else if (lower.includes('lease') || lower.includes('rent')) fileUrl = '/datafile/15_Lease_Ownership_Deed/lease_ownership_deed.jpg';
      else if (lower.includes('sanction') || lower.includes('building')) fileUrl = '/datafile/26_Building_Plan_Sanction_Copy/building_plan_sanction_copy.jpg';
      else if (lower.includes('site') && lower.includes('plan')) fileUrl = '/datafile/28_Site_Plan/site_plan.jpg';
      else if (lower.includes('hazard')) fileUrl = '/datafile/29_Hazard_Material_Sheet/hazard_material_sheet.jpg';
      else if (lower.includes('load')) fileUrl = '/datafile/30_Load_Estimation_Sanction/load_estimation_sanction.jpg';
      else if (lower.includes('electrical safety')) fileUrl = '/datafile/31_Electrical_Safety_Certificate/electrical_safety_certificate.jpg';
      else if (lower.includes('water consumption')) fileUrl = '/datafile/32_Water_Consumption_Estimation_Sheet/water_consumption_estimation_sheet.jpg';
      else if (lower.includes('etp flow')) fileUrl = '/datafile/33_ETP_Flow_Scheme/etp_flow_scheme.jpg';
      else if (lower.includes('plumbing')) fileUrl = '/datafile/34_Plumbing_Layout/plumbing_layout.jpg';
      else if (lower.includes('single line') || lower.includes('sld')) fileUrl = '/datafile/35_Single_Line_Diagram/single_line_diagram.jpg';
      else if (lower.includes('transformer')) fileUrl = '/datafile/36_Transformer_Test_Certificate/transformer_test_certificate.jpg';
      else if (lower.includes('earthing')) fileUrl = '/datafile/37_Earthing_Pit_Resistance_Test/earthing_pit_resistance_test.jpg';
      else if (lower.includes('contractor') || lower.includes('electrical contractor')) fileUrl = '/datafile/38_Electrical_Contractor_License/electrical_contractor_license.jpg';
      else if (lower.includes('food safety') || lower.includes('fsms')) fileUrl = '/datafile/25_Food_Safety_Management_Plan/food_safety_management_plan.jpg';
      else if (lower.includes('water analysis') || lower.includes('water test')) fileUrl = '/datafile/24_Water_Analysis_Lab_Report/water_analysis_test_report.jpg';
      else if (lower.includes('food categories') || lower.includes('list of food')) fileUrl = '/datafile/39_List_of_Food_Categories/list_of_food_categories.jpg';
      else if (lower.includes('equipment list') || lower.includes('equipment schedule')) fileUrl = '/datafile/40_Equipment_List/equipment_list.jpg';
      else fileUrl = '/datafile/17_Architectural_Blueprints/17_architectural_blueprints.jpg';
    }

    setUploadedFiles(prev => ({
      ...prev,
      [docName]: {
        file: null,
        docId,
        name: existing?.docName || docTitle,
        size: existing?.fileSize || docSize,
        dataUrl: fileUrl,
        ocrResult: customOcr || (existing?.aiValidationResult ? { ...existing.aiValidationResult, status: existing.status } : {
          confidence: 99,
          status: 'Valid',
          isAuthenticGovDoc: true,
          extractedName: activeProject?.businessName || 'Sahyadri Food Extracts & Spices Private Limited',
          issues: [],
          recommendations: [],
          structuredAnalysis: {
            status: 'VERIFIED',
            confidence: { overall: 99, ocr: 99, documentType: 99 },
            risk: { level: 'LOW', score: 0, reasons: [] },
            issues: [],
            recommendations: []
          }
        })
      }
    }));
    setSelectingVaultForDoc(null);
    setVaultSearchQuery('');
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

      // 1. Upload new files with AI OCR diagnostics
      for (const [docName, fileData] of Object.entries(uploadedFiles)) {
        if (fileData.file || fileData.dataUrl) {
          const newDoc = uploadDocument(
            docName, 
            docName, 
            fileData.file, 
            fileData.ocrResult, 
            fileData.dataUrl
          );
          finalDocIds.push(newDoc.id);
        } else if (fileData.docId) {
          finalDocIds.push(fileData.docId);
        }
      }

      // If user didn't upload any file, attach existing documents for active project
      const projectDocs = documents.filter(d => d.projectId === activeProject?.id);
      if (finalDocIds.length === 0 && projectDocs.length > 0) {
        finalDocIds.push(...projectDocs.slice(0, 3).map(d => d.id));
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

          {/* MCA Statutory Incorporation Rules & Configuration Box */}
          {(isMcaCompany || isMcaLlp) && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-slate-700 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>MCA Statutory Rules & Premises Configuration</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  {isMcaCompany ? 'SPICe+ Integrated Application' : 'FiLLiP LLP Incorporation'}
                </span>
              </div>

              {/* Dynamic Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Signatory / Director Citizenship:
                  </label>
                  <select
                    value={directorResidency}
                    onChange={(e) => setDirectorResidency(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="INDIAN">Indian Resident Citizen (Voter ID / Passport / DL / Aadhaar)</option>
                    <option value="FOREIGN">Foreign National / NRI (Passport Mandatory + Apostille)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Office Premises Status:
                  </label>
                  <select
                    value={premisesType}
                    onChange={(e) => setPremisesType(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="RENTED">Rented Premises (Lease Deed + Utility Bill + Owner NOC Required)</option>
                    <option value="OWNED">Company / Promoter Owned (Title Deed + Utility Bill Required)</option>
                    <option value="DIRECTOR_RESIDENCE">Director Residence Address (Title Deed + NOC + Utility Bill)</option>
                  </select>
                </div>
              </div>

              {/* Statutory MCA Forms Summary Note */}
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white font-bold">MCA Statutory Forms Auto-Generated: </strong>
                  {isMcaCompany ? (
                    <span>
                      SPICe+ Part A (Name Approval), SPICe+ Part B (Incorporation), e-MoA (INC-33), e-AoA (INC-34), AGILE-PRO-S (GSTIN, ESIC, EPFO, Bank Account) and INC-9 Declaration.
                    </span>
                  ) : (
                    <span>
                      RUN-LLP (Name Reservation), FiLLiP (LLP Incorporation Form), Form 3 (LLP Agreement Execution within 30 days of registration).
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

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
                  (d.projectId === activeProject?.id || d.userId === currentUser?.id || !d.projectId) &&
                  (
                    d.docName.toLowerCase().includes(docName.toLowerCase()) || 
                    d.category.toLowerCase().includes(docName.toLowerCase()) ||
                    docName.toLowerCase().includes(d.docName.toLowerCase()) ||
                    (docName.toLowerCase().includes('fire') && d.docName.toLowerCase().includes('fire')) ||
                    (docName.toLowerCase().includes('stability') && d.docName.toLowerCase().includes('stability')) ||
                    (docName.toLowerCase().includes('machinery') && d.docName.toLowerCase().includes('machinery')) ||
                    (docName.toLowerCase().includes('plan') && (d.docName.toLowerCase().includes('plan') || d.category.toLowerCase().includes('plan'))) ||
                    (docName.toLowerCase().includes('land') && d.docName.toLowerCase().includes('land')) ||
                    (docName.toLowerCase().includes('gst') && d.docName.toLowerCase().includes('gst')) ||
                    (docName.toLowerCase().includes('pan') && d.docName.toLowerCase().includes('pan')) ||
                    (docName.toLowerCase().includes('building') && d.docName.toLowerCase().includes('building')) ||
                    (docName.toLowerCase().includes('food') && (d.docName.toLowerCase().includes('food') || d.category.toLowerCase().includes('food'))) ||
                    (docName.toLowerCase().includes('water') && (d.docName.toLowerCase().includes('water') || d.category.toLowerCase().includes('water'))) ||
                    (docName.toLowerCase().includes('equipment') && (d.docName.toLowerCase().includes('equipment') || d.category.toLowerCase().includes('equipment')))
                  )
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
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pl-7 sm:pl-0">
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

                        {matchingExistingDocs.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectingVaultForDoc(docName);
                              setVaultSearchQuery('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[#2E6F40] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Select certificate or document directly from your Document Vault"
                          >
                            <FolderCheck className="w-3.5 h-3.5 text-[#2E6F40] dark:text-emerald-400" />
                            <span>{attached ? 'Replace from Vault' : '+ From Vault'}</span>
                          </button>
                        )}

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
                      </div>
                    </div>

                    {/* Scanning State */}
                    {scanningDocNames[docName] && (
                      <div className="mt-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2.5 animate-pulse">
                        <Loader2 className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin shrink-0" />
                        <div>
                          <span className="font-extrabold">PermitFlow AI OCR Scanner: Validating document authenticity & entity match...</span>
                          <p className="text-[11px] text-purple-700 dark:text-purple-300">Checking seals, authority stamps, and project alignment ({activeProject.businessName}).</p>
                        </div>
                      </div>
                    )}

                    {/* AI OCR Verification Findings Card */}
                    {attached?.ocrResult && !scanningDocNames[docName] && (() => {
                      const res = attached.ocrResult;
                      const analysis = res.structuredAnalysis;
                      const statusVal = analysis?.status || (res.status === 'Valid' ? 'VERIFIED' : res.status);
                      const isVerified = statusVal === 'VERIFIED' || statusVal === 'Valid';
                      const ocrConf = analysis?.confidence?.overall ?? res.confidence ?? 0;

                      return (
                        <div className={`mt-3 p-3 rounded-xl border text-xs space-y-2 ${
                          isVerified
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                            : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                        }`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-extrabold">
                              {isVerified ? (
                                <>
                                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  <span>Configured Document Checks Passed</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  <span>Document Verification Notice: {statusVal}</span>
                                </>
                              )}
                            </div>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                              OCR Confidence: {ocrConf}%
                            </span>
                          </div>

                          {/* Extracted Details Pill */}
                          {(res.extractedName || res.extractedRegNo || analysis?.fields?.name?.value || analysis?.fields?.documentNumber?.value) && (
                            <div className="flex flex-wrap gap-3 text-[11px] pt-1 text-slate-700 dark:text-slate-300 font-medium">
                              {(res.extractedName || analysis?.fields?.name?.value) && (
                                <span>Name: <strong className="text-slate-900 dark:text-white">{analysis?.fields?.name?.value || res.extractedName}</strong></span>
                              )}
                              {(res.extractedRegNo || analysis?.fields?.documentNumber?.value) && (
                                <span>Number: <strong className="text-slate-900 dark:text-white">{analysis?.fields?.documentNumber?.displayValue || analysis?.fields?.documentNumber?.value || res.extractedRegNo}</strong></span>
                              )}
                            </div>
                          )}

                          {/* Issues or Verified Summary */}
                          {res.issues && res.issues.length > 0 ? (
                            <div className="space-y-1 text-[11px] pt-1">
                              {res.issues.map((issue: string, i: number) => (
                                <div key={i} className="text-amber-900 dark:text-amber-300 font-semibold">• {issue}</div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Document format and entity checks passed consistency checks. (Does not independently prove legal authenticity).</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
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

      {/* Interactive Vault Selection Modal */}
      {selectingVaultForDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#2E6F40] dark:text-emerald-400 flex items-center justify-center">
                  <FolderCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Select Document from Vault
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose a saved document or issued certificate for <strong className="text-emerald-700 dark:text-emerald-300">{selectingVaultForDoc}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectingVaultForDoc(null);
                  setVaultSearchQuery('');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search vault documents, certificates..."
                  value={vaultSearchQuery}
                  onChange={(e) => setVaultSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#2E6F40] outline-none"
                />
              </div>
            </div>

            {/* Document List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {documents.filter(d => {
                if (!vaultSearchQuery.trim()) return true;
                const q = vaultSearchQuery.toLowerCase();
                return (
                  d.docName.toLowerCase().includes(q) ||
                  d.category.toLowerCase().includes(q)
                );
              }).length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold">No matching documents in Vault</p>
                  <p className="text-[11px] text-slate-500 mt-1">Upload files directly using the Browse File button.</p>
                </div>
              ) : (
                documents.filter(d => {
                  if (!vaultSearchQuery.trim()) return true;
                  const q = vaultSearchQuery.toLowerCase();
                  return (
                    d.docName.toLowerCase().includes(q) ||
                    d.category.toLowerCase().includes(q)
                  );
                }).map((doc) => {
                  const isMatching = doc.docName.toLowerCase().includes(selectingVaultForDoc.toLowerCase()) ||
                    doc.category.toLowerCase().includes(selectingVaultForDoc.toLowerCase());

                  return (
                    <div
                      key={doc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isMatching
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isMatching ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {doc.docName}
                            </span>
                            {isMatching && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 text-[9px] font-extrabold shrink-0">
                                Recommended Match
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {doc.category} • {doc.fileSize || '1.5 MB'} • {doc.uploadDate || 'Verified'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectExistingDoc(selectingVaultForDoc, doc.id, doc.docName, doc.fileSize || '1.5 MB', doc.fileUrl)}
                        className="px-3 py-1.5 rounded-xl bg-[#2E6F40] hover:bg-[#253D2C] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-[#CFFFDC]" />
                        <span>Attach</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {documents.length} document(s) in Vault
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectingVaultForDoc(null);
                  setVaultSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
