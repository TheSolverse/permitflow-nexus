import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  ShieldCheck, 
  CheckSquare, 
  FileCheck2, 
  Search, 
  Gift, 
  BellRing, 
  ShieldAlert, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Clock, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { Footer } from '../common/Footer';
import { LanguageSelector } from '../common/LanguageSelector';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setCurrentUser, language } = useApp();

  const features = [
    {
      icon: CheckSquare,
      title: '1. Smart Approval Checklist',
      desc: 'Dynamic rules engine identifies exact licenses, NOCs, and registrations needed based on your sector, scale, and location.',
      color: 'text-amber-700 bg-amber-50 border border-amber-200'
    },
    {
      icon: FileCheck2,
      title: '2. AI Document Checker',
      desc: 'Simulated AI/OCR scanner checks document validity, expiry dates, resolution clarity, and business name alignment before filing.',
      color: 'text-blue-700 bg-blue-50 border border-blue-200'
    },
    {
      icon: Search,
      title: '3. Unified Tracking Dashboard',
      desc: 'Real-time multi-department application tracker with SLA countdown meters, officer assignment, and interactive timeline history.',
      color: 'text-emerald-700 bg-emerald-50 border border-emerald-200'
    },
    {
      icon: Gift,
      title: '4. Incentive Finder',
      desc: 'Recommends eligible Maharashtra state subsidies (PSI 2019/2024, capital subsidies, electricity duty exemption, CMEGP).',
      color: 'text-purple-700 bg-purple-50 border border-purple-200'
    },
    {
      icon: BellRing,
      title: '5. Compliance Reminders',
      desc: 'Proactive calendar alerts at 90, 60, 30, 7, and 1 day prior to inspection, filing, or annual safety renewal deadlines.',
      color: 'text-rose-700 bg-rose-50 border border-rose-200'
    },
    {
      icon: ShieldAlert,
      title: '6. Risk-Based Guidance',
      desc: 'Transparent 0-100 risk score based on sector, location, compliance history, and document quality with actionable improvement tips.',
      color: 'text-indigo-700 bg-indigo-50 border border-indigo-200'
    }
  ];

  const workflowSteps = [
    { step: 1, label: 'Enter Business Details', desc: 'Provide sector, investment scale, employees, & MIDC location' },
    { step: 2, label: 'Get Approval Checklist', desc: 'Auto-generate mandatory & conditional licences with SLAs' },
    { step: 3, label: 'Upload Documents', desc: 'Upload PAN, GST, blueprints, lease deeds, & safety reports' },
    { step: 4, label: 'Validate', desc: 'Simulated AI/OCR scan flags name mismatches & expiry dates' },
    { step: 5, label: 'Submit', desc: 'Submit applications directly to respective department queues' },
    { step: 6, label: 'Track', desc: 'Monitor SLA countdowns, officer queries, & site inspections' },
    { step: 7, label: 'Renew', desc: 'Track compliance health & stay notified of annual renewals' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      
      {/* Landing Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Permit<span className="text-amber-600">Flow</span> <span className="text-slate-700">Nexus</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {t('tagline', language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={() => setActiveTab('login')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              {t('login', language)}
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <span>{t('getStarted', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Clean White Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-amber-50/20 py-20 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Government of Maharashtra Official Industrial Approval Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Simplify every business approval journey.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('heroDesc', language)}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Demo Login Cards Banner */}
          <div className="mt-14 pt-8 border-t border-slate-200 max-w-3xl mx-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Try One-Click Demo Access As:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setCurrentUser({
                    id: 'usr-1',
                    name: 'Rahul Sharma',
                    email: 'rahul.sharma@apexfoods.in',
                    role: 'ENTREPRENEUR',
                    organization: 'Apex Foods & Spices Pvt Ltd'
                  });
                  setActiveTab('dashboard');
                }}
                className="p-3.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 transition-all text-left text-xs shadow-xs group"
              >
                <div className="font-bold text-slate-900 group-hover:text-amber-800 flex items-center justify-between">
                  <span>Entrepreneur</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Rahul Sharma (Apex Foods)</div>
              </button>

              <button
                onClick={() => {
                  setCurrentUser({
                    id: 'usr-4',
                    name: 'Dr. V. K. Patil',
                    email: 'vk.patil@mpcb.gov.in',
                    role: 'OFFICER',
                    department: 'Maharashtra Pollution Control Board (MPCB)'
                  });
                  setActiveTab('officer-dashboard');
                }}
                className="p-3.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 transition-all text-left text-xs shadow-xs group"
              >
                <div className="font-bold text-slate-900 group-hover:text-blue-800 flex items-center justify-between">
                  <span>Govt Officer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Dr. V. K. Patil (MPCB)</div>
              </button>

              <button
                onClick={() => {
                  setCurrentUser({
                    id: 'usr-9',
                    name: 'PFN Admin Portal',
                    email: 'admin@permitflownexus.gov.in',
                    role: 'ADMIN',
                    department: 'State Single Window System'
                  });
                  setActiveTab('admin-dashboard');
                }}
                className="p-3.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-400 transition-all text-left text-xs shadow-xs group"
              >
                <div className="font-bold text-slate-900 group-hover:text-purple-800 flex items-center justify-between">
                  <span>Platform Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">System Administrator</div>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">14,850+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Approvals Processed</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">94.2%</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">On-Time SLA Compliance</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">₹120 Cr+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Subsidies Recommended</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">36 Districts</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Statewide Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">Platform Core Services</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Everything you need for seamless approvals & compliance.
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            Built to remove bottlenecks from government approvals, document verification, and annual compliance tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg border border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-900">
                  <span>Explore Service</span>
                  <ChevronRight className="w-4 h-4 ml-1 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Workflow Section (Light Slate Theme) */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">End-To-End Journey</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">How PermitFlow Nexus Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              7 simple steps from entering your project profile to tracking long-term compliance renewals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {workflowSteps.map((wf) => (
              <div
                key={wf.step}
                className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center mb-3 border border-slate-300">
                    0{wf.step}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">{wf.label}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{wf.desc}</p>
                </div>
                {wf.step < 7 && (
                  <div className="hidden lg:block mt-3 text-right text-slate-300">
                    <ArrowRight className="w-4 h-4 inline" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Entrepreneur Benefits */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs mb-4 border border-amber-200">
              <Users className="w-4 h-4" />
              <span>For Entrepreneurs & Industry Units</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Eliminate confusion, document rejections, & missed deadlines.
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Approval Discovery:</strong> Auto-generate exact lists of required NOCs based on MIDC & sector rules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>AI Pre-Validation:</strong> Catch name mismatches, blurry blueprints, or expired certificates before official filing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Incentive Unlocking:</strong> Identify eligible Maharashtra capital & electricity duty subsidies.</span>
              </li>
            </ul>
          </div>

          {/* Department Benefits */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-xs mb-4 border border-blue-200">
              <Building2 className="w-4 h-4" />
              <span>For Government Departments & Officers</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Streamline review queues, enforce SLAs, & schedule joint audits.
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Pre-Screened Applications:</strong> AI OCR pre-verification reduces incomplete file returns by 75%.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Joint Department Inspection Planner:</strong> Coordinate MPCB, DISH, and Fire audits on a single date.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Transparent Audit Logs:</strong> Tamper-proof status tracking and officer action logs.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-900 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold">Ready to streamline your business approvals?</h2>
          <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto">
            Experience the demonstration platform with pre-seeded Maharashtra data.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('login')}
              className="px-8 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-sm hover:bg-amber-400 shadow-md"
            >
              Launch Dashboard Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
