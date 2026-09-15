import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateRiskScore } from '../../utils/riskCalculator';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Sparkles, 
  HelpCircle, 
  ArrowDownRight, 
  Zap, 
  TrendingDown, 
  RefreshCw,
  FileCheck,
  Building2,
  MapPin,
  ClipboardList
} from 'lucide-react';

export const RiskScorePage: React.FC = () => {
  const { activeProject, documents, complianceTasks, setActiveTab } = useApp();
  const [isSimulated, setIsSimulated] = useState(false);

  const projectDocs = documents.filter(d => d.projectId === activeProject?.id);
  const projectComplianceTasks = complianceTasks.filter(t => t.projectId === activeProject?.id);

  const baseRiskData = calculateRiskScore(activeProject, projectDocs, projectComplianceTasks);

  // If simulation is active, calculate mitigated score (Low Risk)
  const currentScore = isSimulated ? Math.max(22, baseRiskData.overallScore - 50) : baseRiskData.overallScore;
  const currentLabel = isSimulated ? 'Low Risk' : baseRiskData.riskLabel;

  // Identify top risk drivers
  const missingDocsCount = projectDocs.filter(d => d.status === 'Missing').length;
  const invalidDocsCount = projectDocs.filter(d => d.status === 'Expired' || d.status === 'Name Mismatch' || d.status === 'Blurry / Unreadable').length;
  const overdueCount = projectComplianceTasks.filter(t => t.status === 'OVERDUE').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#2E6F40] dark:text-[#68BA7F]" />
            <h1 className="text-xl font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Approval Risk Score Engine</h1>
          </div>
          <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] mt-1 font-medium">
            Transparent risk evaluation & root-cause diagnostic breakdown for <strong className="text-slate-900 dark:text-white font-extrabold">{activeProject.businessName}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsSimulated(!isSimulated)}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
            isSimulated
              ? 'bg-[#2E6F40] hover:bg-[#235833] text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-[#CFFFDC]" />
          <span>{isSimulated ? 'Reset to Actual Risk Score' : 'Simulate Risk Mitigation Fixes (-50 Pts)'}</span>
        </button>
      </div>

      {/* Main Score & Gauge Banner */}
      <div className="bg-white dark:bg-[#16261C] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left score dial */}
        <div className="text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6">
          <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Project Risk Index</div>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className={`text-5xl font-extrabold ${
              currentScore > 60 ? 'text-rose-600' : currentScore > 30 ? 'text-amber-600' : 'text-[#2E6F40]'
            }`}>
              {currentScore}
            </span>
            <span className="text-sm font-bold text-slate-400">/ 100</span>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${
            currentScore > 60 
              ? 'bg-rose-100 text-rose-900 border-rose-300' 
              : currentScore > 30 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-[#CFFFDC]/60 text-[#2E6F40] border-[#68BA7F]'
          }`}>
            {currentLabel} Status
          </div>
        </div>

        {/* Center Gauge Meter */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#2E6F40]">0 - 30: Low Risk</span>
            <span className="text-amber-700">31 - 60: Medium Risk</span>
            <span className="text-rose-700">61 - 100: High Risk</span>
          </div>

          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                currentScore > 60 ? 'bg-rose-600' : currentScore > 30 ? 'bg-amber-500' : 'bg-[#2E6F40]'
              }`}
              style={{ width: `${currentScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Formula Weightage: <strong>30% Sector Risk</strong> + <strong>20% Location Risk</strong> + <strong>25% Compliance History Risk</strong> + <strong>25% Document Quality Risk</strong>.
          </p>
        </div>

      </div>

      {/* DIAGNOSTIC PANEL */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-6 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4EEDC] dark:border-[#253D2C] pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#2E6F40] dark:text-[#68BA7F]" />
            <h2 className="font-extrabold text-sm text-[#192A1E] dark:text-[#E8F7ED]">
              Why is Your Risk Score Currently {currentScore}/100 ({currentLabel.toUpperCase()})?
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#2E6F40] text-white font-extrabold text-[10px] uppercase">
            AI Root Cause Analysis
          </span>
        </div>

        <p className="text-xs text-slate-700 font-semibold leading-relaxed">
          Your risk score is evaluated dynamically across 4 key dimensions. Here are the exact drivers increasing or lowering your project risk index:
        </p>

        {/* 3 Key Root Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Driver 1: Document Quality */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            invalidDocsCount > 0 || missingDocsCount > 0 
              ? 'bg-rose-50/80 border-rose-300' 
              : 'bg-emerald-50/80 border-emerald-300'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-rose-600" />
                1. Document Quality Impact
              </span>
              <span className="font-extrabold text-rose-700">+{baseRiskData.factors.documentQualityRisk.score} Pts</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {invalidDocsCount > 0 || missingDocsCount > 0 ? (
                <>
                  <strong>High Impact:</strong> {invalidDocsCount} document(s) flagged with AI validation errors (name mismatch/blur) and {missingDocsCount} required file missing.
                </>
              ) : (
                <>
                  <strong>Optimal:</strong> All required documents uploaded and verified with 100% OCR confidence.
                </>
              )}
            </p>
          </div>

          {/* Driver 2: Compliance History */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            overdueCount > 0 
              ? 'bg-rose-50/80 border-rose-300' 
              : 'bg-emerald-50/80 border-emerald-300'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-purple-600" />
                2. Compliance Task Impact
              </span>
              <span className="font-extrabold text-purple-700">+{baseRiskData.factors.complianceHistoryRisk.score} Pts</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {overdueCount > 0 ? (
                <>
                  <strong>Overdue Warning:</strong> {overdueCount} statutory compliance renewal task is past due date (Annual Fire Safety Maintenance Audit).
                </>
              ) : (
                <>
                  <strong>Clean Record:</strong> Zero overdue statutory compliance tasks.
                </>
              )}
            </p>
          </div>

          {/* Driver 3: Sub-Sector Complexity */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                3. Sub-Sector Complexity
              </span>
              <span className="font-extrabold text-amber-700">+{baseRiskData.factors.sectorRisk.score} Pts</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              <strong>Regulated Activity:</strong> {activeProject.sector} ({activeProject.subSector || 'Industrial Processing'}) requires 10 statutory approvals (MPCB, DISH, FSSAI).
            </p>
          </div>

        </div>
      </div>

      {/* Advisory Disclaimer Notice */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 flex items-start gap-3 text-xs text-amber-950 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Guidance Disclaimer:</strong> This Risk Score is an advisory guidance tool calculated using PermitFlow mock rules to help you identify missing documents and upcoming renewals. Final approval decisions are strictly made by authorized government departments.
        </div>
      </div>

      {/* 4 Factor Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">1. Sector Risk Factor</span>
            <span className="font-extrabold text-amber-700">{baseRiskData.factors.sectorRisk.score} / {baseRiskData.factors.sectorRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${(baseRiskData.factors.sectorRisk.score / 30) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 font-medium">{baseRiskData.factors.sectorRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">2. Location & Land Risk</span>
            <span className="font-extrabold text-blue-700">{baseRiskData.factors.locationRisk.score} / {baseRiskData.factors.locationRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(baseRiskData.factors.locationRisk.score / 20) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 font-medium">{baseRiskData.factors.locationRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">3. Compliance History Risk</span>
            <span className="font-extrabold text-purple-700">{isSimulated ? 5 : baseRiskData.factors.complianceHistoryRisk.score} / {baseRiskData.factors.complianceHistoryRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${((isSimulated ? 5 : baseRiskData.factors.complianceHistoryRisk.score) / 25) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 font-medium">{isSimulated ? 'Overdue compliance tasks cleared.' : baseRiskData.factors.complianceHistoryRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">4. Document Quality Risk</span>
            <span className="font-extrabold text-emerald-700">{isSimulated ? 4 : baseRiskData.factors.documentQualityRisk.score} / {baseRiskData.factors.documentQualityRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${((isSimulated ? 4 : baseRiskData.factors.documentQualityRisk.score) / 25) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 font-medium">{isSimulated ? 'All documents valid and verified.' : baseRiskData.factors.documentQualityRisk.explanation}</p>
        </div>

      </div>

      {/* How to Lower Your Risk Score & Action Plan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Action Plan: How to Lower Your Risk Score to Low Risk (&lt;30)
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-slate-900">Re-upload Corrected NABL Lab Report & Fire Blueprint</div>
                <div className="text-slate-500">Resolves name mismatch & low-res scan issues (-20 pts risk reduction)</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('documents')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-extrabold text-xs shadow-xs hover:bg-indigo-700 cursor-pointer"
            >
              Fix Docs
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-extrabold text-slate-900">File Annual Fire Safety Audit Form B</div>
                <div className="text-slate-500">Clears overdue compliance task (-17 pts risk reduction)</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('compliance')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-extrabold text-xs shadow-xs hover:bg-amber-600 cursor-pointer"
            >
              Renew Task
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

