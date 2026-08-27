import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gift, 
  ArrowRight, 
  ExternalLink, 
  ShieldAlert, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  X, 
  Globe, 
  Edit3, 
  Lock, 
  Building2,
  Filter
} from 'lucide-react';
import { IncentiveScheme } from '../../types';

export const IncentiveFinderPage: React.FC = () => {
  const { incentiveSchemes, activeProject, currentUser, updateIncentiveUrl } = useApp();
  const [filterTag, setFilterTag] = useState<string>('ALL');
  
  // Redirect Modal State
  const [selectedScheme, setSelectedScheme] = useState<IncentiveScheme | null>(null);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Admin Editing State
  const [editingScheme, setEditingScheme] = useState<IncentiveScheme | null>(null);
  const [adminUrlInput, setAdminUrlInput] = useState<string>('');
  const [adminApplyUrlInput, setAdminApplyUrlInput] = useState<string>('');
  const [adminInfoUrlInput, setAdminInfoUrlInput] = useState<string>('');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Helper to extract clean domain host from URL
  const getDomain = (urlStr?: string): string => {
    if (!urlStr) return '';
    try {
      const url = new URL(urlStr);
      return url.hostname;
    } catch {
      return urlStr.replace(/^https?:\/\//, '').split('/')[0];
    }
  };

  // Helper to validate HTTPS URL
  const isValidHttpsUrl = (urlStr?: string): boolean => {
    if (!urlStr || typeof urlStr !== 'string') return false;
    const trimmed = urlStr.trim();
    if (!trimmed.startsWith('https://')) return false;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  };

  // Eligibility styling
  const getEligibilityBadge = (status: IncentiveScheme['eligibilityStatus']) => {
    switch (status) {
      case 'ELIGIBLE':
      case 'Eligible':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'POSSIBLY_ELIGIBLE':
      case 'Possibly Eligible':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  // Toast banner auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle clicking "Apply Scheme"
  const handleApplyScheme = (scheme: IncentiveScheme) => {
    const targetUrl = scheme.officialApplyUrl || scheme.officialUrl;
    
    if (!isValidHttpsUrl(targetUrl)) {
      setToastMessage(
        "Official application link currently unavailable. Please verify the scheme details with the concerned department."
      );
      return;
    }

    setSelectedScheme(scheme);
    setIsRedirectModalOpen(true);
  };

  // Handle confirming redirect in Modal
  const continueToOfficialWebsite = useCallback(() => {
    if (!selectedScheme) return;
    const targetUrl = selectedScheme.officialApplyUrl || selectedScheme.officialUrl;
    
    if (!isValidHttpsUrl(targetUrl)) {
      setToastMessage(
        "Official application link currently unavailable. Please verify the scheme details with the concerned department."
      );
      setIsRedirectModalOpen(false);
      return;
    }

    // Open official portal in new tab
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setIsRedirectModalOpen(false);
  }, [selectedScheme]);

  // Keyboard accessibility (Escape key closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isRedirectModalOpen) setIsRedirectModalOpen(false);
        if (editingScheme) setEditingScheme(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRedirectModalOpen, editingScheme]);

  // Handle Admin Save URL
  const handleSaveAdminUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;

    if (!isValidHttpsUrl(adminUrlInput)) {
      setAdminError("Official URL must start with 'https://' and be a valid URL.");
      return;
    }

    if (adminApplyUrlInput && !isValidHttpsUrl(adminApplyUrlInput)) {
      setAdminError("Official Apply URL must start with 'https://' and be a valid URL.");
      return;
    }

    if (adminInfoUrlInput && !isValidHttpsUrl(adminInfoUrlInput)) {
      setAdminError("Official Info URL must start with 'https://' and be a valid URL.");
      return;
    }

    updateIncentiveUrl(
      editingScheme.id, 
      adminUrlInput.trim(), 
      adminApplyUrlInput.trim() || undefined, 
      adminInfoUrlInput.trim() || undefined
    );

    setEditingScheme(null);
    setAdminError(null);
    setToastMessage(`Official URL updated for ${editingScheme.schemeName || editingScheme.name}`);
  };

  // Extract list of all unique tags for filtering
  const allTags = Array.from(new Set(incentiveSchemes.flatMap(s => s.tags || [])));
  
  const filteredSchemes = incentiveSchemes.filter(s => {
    if (filterTag === 'ALL') return true;
    return s.tags && s.tags.includes(filterTag);
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div 
          role="alert" 
          className="bg-amber-50 dark:bg-amber-950/80 border-2 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 p-4 rounded-xl shadow-lg flex items-start justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold leading-relaxed">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-amber-700 dark:text-amber-300 hover:text-amber-900 p-1 rounded-lg shrink-0"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-mh-navy to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">Maharashtra Government Incentive Finder</h1>
          </div>
          <p className="text-xs text-purple-200 mt-1">
            Personalized scheme matching for <strong className="text-amber-400 font-semibold">{activeProject.businessName}</strong> ({activeProject.sector} • {activeProject.investmentRange}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-600/40 text-center">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Total Matched Subsidies</div>
            <div className="text-lg font-extrabold text-amber-400">Est. ₹82,40,000</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
          <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Filter by Category:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterTag('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              filterTag === 'ALL'
                ? 'bg-purple-900 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Schemes ({incentiveSchemes.length})
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterTag === tag
                  ? 'bg-purple-900 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Incentive Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => {
          const schemeTitle = scheme.schemeName || scheme.name || '';
          const schemeDesc = scheme.shortDesc || scheme.description || '';
          const schemeBenefit = scheme.estimatedBenefit || scheme.benefit || '';
          const schemeNextStep = scheme.nextAction || scheme.requiredNextStep || '';
          const targetApplyUrl = scheme.officialApplyUrl || scheme.officialUrl;
          const isUrlValid = isValidHttpsUrl(targetApplyUrl);
          const domain = getDomain(targetApplyUrl);

          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header Status & Benefit */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getEligibilityBadge(scheme.eligibilityStatus)}`}>
                    {scheme.eligibilityStatus === 'ELIGIBLE' || scheme.eligibilityStatus === 'Eligible' 
                      ? '✓ Eligible' 
                      : scheme.eligibilityStatus === 'POSSIBLY_ELIGIBLE' || scheme.eligibilityStatus === 'Possibly Eligible'
                      ? '⚡ Possibly Eligible' 
                      : 'Not Eligible'}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {schemeBenefit}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{schemeTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{scheme.department}</span>
                    </p>
                  </div>
                  
                  {/* Admin Edit Link Trigger */}
                  {currentUser.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        setEditingScheme(scheme);
                        setAdminUrlInput(scheme.officialUrl || '');
                        setAdminApplyUrlInput(scheme.officialApplyUrl || '');
                        setAdminInfoUrlInput(scheme.officialInfoUrl || '');
                        setAdminError(null);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors shrink-0"
                      title="Admin: Edit Official Portal URL"
                      aria-label={`Admin edit URL for ${schemeTitle}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {schemeDesc}
                </p>

                {/* Eligibility Reason Box */}
                {scheme.eligibilityReason && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs">
                    <div className="font-bold text-purple-900 dark:text-purple-300 mb-0.5">Why you qualify:</div>
                    <div className="text-purple-800 dark:text-purple-200/90 text-[11px] leading-snug">
                      {scheme.eligibilityReason}
                    </div>
                  </div>
                )}

                {/* Required Next Step Box */}
                <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Required Next Step:</span>
                  <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px] mt-0.5">
                    {schemeNextStep}
                  </div>
                </div>

                {/* Domain Badge */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Official Portal:</span>
                  {isUrlValid ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] border border-emerald-200 dark:border-emerald-800">
                      <Globe className="w-3 h-3 text-emerald-600" />
                      {domain}
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-semibold text-[10px]">Link Pending</span>
                  )}
                </div>
              </div>

              <div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
                  <div className="flex flex-wrap gap-1">
                    {scheme.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Apply Scheme Button with External Link Icon */}
                  <button
                    onClick={() => handleApplyScheme(scheme)}
                    disabled={!isUrlValid}
                    aria-label={`Apply for ${schemeTitle} on official government website`}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition-all ${
                      isUrlValid
                        ? 'bg-mh-navy hover:bg-slate-800 text-white cursor-pointer hover:shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Apply Scheme</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Unavailable Fallback Message if URL is Missing/Invalid */}
                {!isUrlValid && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Official application link currently unavailable. Please verify the scheme details with the concerned department.</span>
                  </div>
                )}

                {/* Mandatory External Link Disclaimer */}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 italic leading-tight flex items-start gap-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0 inline mt-0.5" />
                  <span>You will be redirected to an external government website. PermitFlow Nexus does not process the final application.</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION REDIRECT MODAL */}
      {isRedirectModalOpen && selectedScheme && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="redirect-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden space-y-0 transform transition-all">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-900 to-mh-navy text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <h2 id="redirect-modal-title" className="text-lg font-extrabold text-white">
                    Continue to Official Website?
                  </h2>
                </div>
                <p className="text-xs text-purple-200">
                  External Government Application Portal Redirect
                </p>
              </div>
              <button 
                onClick={() => setIsRedirectModalOpen(false)}
                className="text-purple-200 hover:text-white p-1 rounded-lg hover:bg-purple-800/50 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Redirect Notice Message */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                You are leaving <strong>PermitFlow Nexus</strong> and will be redirected to the official government portal for{' '}
                <strong className="text-purple-900 dark:text-purple-300 font-bold">
                  {selectedScheme.schemeName || selectedScheme.name}
                </strong>. You will complete the application on that website.
              </p>

              {/* Destination Details Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Destination Details
                </div>
                
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500 font-semibold">Scheme Name:</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 text-right max-w-[240px]">
                      {selectedScheme.schemeName || selectedScheme.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Department:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {selectedScheme.department}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Destination Domain:
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {getDomain(selectedScheme.officialApplyUrl || selectedScheme.officialUrl)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Label & Warning */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Official Security Guidelines:</span>
                  <p className="mt-0.5 text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                    Always check that the website address belongs to an official government domain before submitting personal or business documents.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsRedirectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                Cancel
              </button>
              
              <button
                onClick={continueToOfficialWebsite}
                aria-label={`Continue to Official Website for ${selectedScheme.schemeName || selectedScheme.name}`}
                className="px-5 py-2.5 rounded-xl bg-mh-navy hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Official Website</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADMIN URL EDIT MODAL */}
      {editingScheme && currentUser.role === 'ADMIN' && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="admin-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 bg-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 id="admin-modal-title" className="font-extrabold text-sm text-white">
                  Admin: Manage Official Scheme URL
                </h3>
              </div>
              <button 
                onClick={() => setEditingScheme(null)} 
                className="text-purple-200 hover:text-white p-1 rounded-lg"
                aria-label="Close admin modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminUrl} className="p-5 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Update the official government website configuration for{' '}
                <strong className="text-purple-900 dark:text-purple-300">{editingScheme.schemeName || editingScheme.name}</strong>.
              </p>

              {adminError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Portal URL (HTTPS mandatory) *
                </label>
                <input
                  type="url"
                  required
                  value={adminUrlInput}
                  onChange={(e) => setAdminUrlInput(e.target.value)}
                  placeholder="https://di.maharashtra.gov.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Apply URL (Optional)
                </label>
                <input
                  type="url"
                  value={adminApplyUrlInput}
                  onChange={(e) => setAdminApplyUrlInput(e.target.value)}
                  placeholder="https://maitri.mahaonline.gov.in/"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <span className="text-[10px] text-slate-500">Used specifically for the "Apply Scheme" action.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Scheme Info URL (Optional)
                </label>
                <input
                  type="url"
                  value={adminInfoUrlInput}
                  onChange={(e) => setAdminInfoUrlInput(e.target.value)}
                  placeholder="https://di.maharashtra.gov.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingScheme(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
                >
                  Save URL Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
