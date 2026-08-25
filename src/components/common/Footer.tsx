import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-mh-navy flex items-center justify-center text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>Permit<span className="text-mh-saffron">Flow</span> Nexus</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Maharashtra’s unified business approval, document AI validation, compliance tracking, and incentive recommendation platform.
            </p>
            <div className="pt-1">
              <LanguageSelector />
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Platform Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Smart Approval Checklist</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">AI Document Checker</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Application Tracker & SLA</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Maharashtra Incentive Finder</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Compliance & Renewal Calendar</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Approval Risk Calculator</a></li>
            </ul>
          </div>

          {/* Col 3: Government Departments */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Integrated Authorities</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-300">MPCB</span> - Pollution Control Board</li>
              <li><span className="text-slate-300">MIDC</span> - Industrial Development Corp</li>
              <li><span className="text-slate-300">DISH</span> - Industrial Safety & Health</li>
              <li><span className="text-slate-300">Fire Services</span> - Safety & NOC</li>
              <li><span className="text-slate-300">FSSAI</span> - Food Safety Maharashtra</li>
              <li><span className="text-slate-300">MSEDCL</span> - State Electricity Grid</li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Help & Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-mh-saffron" />
                <span>Toll Free Helpdesk: 1800-120-8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-mh-saffron" />
                <span>support@permitflownexus.gov.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-mh-saffron shrink-0 mt-0.5" />
                <span>MAITRI Single Window Cell, Industry Dept, Mantralaya, Mumbai - 400032</span>
              </div>
            </div>
            <div className="pt-2 flex gap-4 text-slate-400">
              <a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy Notice</a>
              <span>•</span>
              <a href="#terms" className="hover:text-amber-400 transition-colors">Terms of Use</a>
              <span>•</span>
              <a href="#help" className="hover:text-amber-400 transition-colors">Help Centre</a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PermitFlow Nexus. Working Demonstration Platform. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Simulated Department Workflow Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
