import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { IncentiveScheme } from '../../types';

export const IncentiveFinderPage: React.FC = () => {
  const { incentiveSchemes, activeProject } = useApp();
  const [filterTag, setFilterTag] = useState<string>('ALL');

  const getEligibilityBadge = (status: IncentiveScheme['eligibilityStatus']) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'POSSIBLY_ELIGIBLE':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-mh-navy to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">Maharashtra Government Incentive Finder</h1>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            Personalized scheme matching for <strong className="text-amber-400 font-semibold">{activeProject.businessName}</strong> ({activeProject.sector} • {activeProject.investmentRange}).
          </p>
        </div>

        <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-600/40 text-center">
          <div className="text-[10px] text-purple-200 font-semibold uppercase">Total Matched Subsidies</div>
          <div className="text-lg font-extrabold text-amber-400">Est. ₹82,40,000</div>
        </div>
      </div>

      {/* Incentive Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {incentiveSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getEligibilityBadge(scheme.eligibilityStatus)}`}>
                  {scheme.eligibilityStatus === 'ELIGIBLE' ? '✓ Eligible' : scheme.eligibilityStatus === 'POSSIBLY_ELIGIBLE' ? '⚡ Possibly Eligible' : 'Not Eligible'}
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {scheme.estimatedBenefit}
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{scheme.schemeName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{scheme.department}</p>
              
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {scheme.shortDesc}
              </p>

              {/* Eligibility Reason Box */}
              <div className="mt-3 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs">
                <div className="font-bold text-purple-900 dark:text-purple-300 mb-0.5">Why you qualify:</div>
                <div className="text-purple-800 dark:text-purple-200/90 text-[11px] leading-snug">
                  {scheme.eligibilityReason}
                </div>
              </div>

              {/* Next Action Box */}
              <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-500">Required Next Step:</span>
                <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">
                  {scheme.nextAction}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex flex-wrap gap-1">
                {scheme.tags.map(t => (
                  <span key={t} className="px-2 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-semibold">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => alert(`Redirecting to ${scheme.schemeName} application portal...`)}
                className="px-4 py-2 rounded-xl bg-mh-navy text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1 shrink-0"
              >
                <span>Apply Scheme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
