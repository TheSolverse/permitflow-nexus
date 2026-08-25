import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateRiskScore } from '../../utils/riskCalculator';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';

export const RiskScorePage: React.FC = () => {
  const { activeProject, documents, complianceTasks } = useApp();

  const riskData = calculateRiskScore(activeProject, documents, complianceTasks);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Approval Risk Score Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transparent risk evaluation for <strong className="text-slate-800">{activeProject.businessName}</strong>.
          </p>
        </div>
      </div>

      {/* Main Score & Gauge Banner (Clean Light Theme) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left score dial */}
        <div className="text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">Project Risk Index</div>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-5xl font-extrabold text-slate-900">{riskData.overallScore}</span>
            <span className="text-sm font-bold text-slate-400">/ 100</span>
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            {riskData.riskLabel} Status
          </div>
        </div>

        {/* Center Gauge Meter */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-700">0 - 30: Low Risk</span>
            <span className="text-amber-700">31 - 60: Medium Risk</span>
            <span className="text-red-700">61 - 100: High Risk</span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 relative">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-1000"
              style={{ width: `${riskData.overallScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Formula: <strong>30% Sector Risk</strong> + <strong>20% Location Risk</strong> + <strong>25% Compliance History Risk</strong> + <strong>25% Document Quality Risk</strong>.
          </p>
        </div>

      </div>

      {/* Advisory Disclaimer Notice */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 flex items-start gap-3 text-xs text-amber-950">
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
            <span className="font-extrabold text-amber-700">{riskData.factors.sectorRisk.score} / {riskData.factors.sectorRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${(riskData.factors.sectorRisk.score / 30) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500">{riskData.factors.sectorRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">2. Location & Land Risk</span>
            <span className="font-extrabold text-blue-700">{riskData.factors.locationRisk.score} / {riskData.factors.locationRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(riskData.factors.locationRisk.score / 20) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500">{riskData.factors.locationRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">3. Compliance History Risk</span>
            <span className="font-extrabold text-purple-700">{riskData.factors.complianceHistoryRisk.score} / {riskData.factors.complianceHistoryRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${(riskData.factors.complianceHistoryRisk.score / 25) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500">{riskData.factors.complianceHistoryRisk.explanation}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">4. Document Quality Risk</span>
            <span className="font-extrabold text-emerald-700">{riskData.factors.documentQualityRisk.score} / {riskData.factors.documentQualityRisk.max}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(riskData.factors.documentQualityRisk.score / 25) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500">{riskData.factors.documentQualityRisk.explanation}</p>
        </div>

      </div>

      {/* How to Improve Score Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          How to Lower Your Risk Score & Accelerate Approvals
        </h3>

        <div className="space-y-2 text-xs">
          {riskData.improvements.map((imp, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-800 font-medium">{imp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
