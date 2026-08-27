import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1B13] text-[#86AD93] text-xs border-t border-[#253D2C] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-[#253D2C] flex items-center justify-center text-[#CFFFDC] border border-[#68BA7F]/30">
                <ShieldCheck className="w-5 h-5 text-[#CFFFDC]" />
              </div>
              <span>Permit<span className="text-[#68BA7F]">Flow</span> Nexus</span>
            </div>
            <p className="text-[#86AD93] leading-relaxed text-xs">
              Maharashtra’s unified business approval, document AI validation, compliance tracking, and incentive recommendation platform.
            </p>
            <div className="pt-1">
              <LanguageSelector />
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-2.5">
            <h4 className="text-[#CFFFDC] font-semibold text-xs uppercase tracking-wider">Platform Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">Smart Approval Checklist</a></li>
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">AI Document Checker</a></li>
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">Application Tracker & SLA</a></li>
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">Maharashtra Incentive Finder</a></li>
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">Compliance & Renewal Calendar</a></li>
              <li><a href="#services" className="hover:text-[#CFFFDC] transition-colors">Approval Risk Calculator</a></li>
            </ul>
          </div>

          {/* Col 3: Government Departments */}
          <div className="space-y-2.5">
            <h4 className="text-[#CFFFDC] font-semibold text-xs uppercase tracking-wider">Integrated Authorities</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-[#D1E8DA]">MPCB</span> - Pollution Control Board</li>
              <li><span className="text-[#D1E8DA]">MIDC</span> - Industrial Development Corp</li>
              <li><span className="text-[#D1E8DA]">DISH</span> - Industrial Safety & Health</li>
              <li><span className="text-[#D1E8DA]">Fire Services</span> - Safety & NOC</li>
              <li><span className="text-[#D1E8DA]">FSSAI</span> - Food Safety Maharashtra</li>
              <li><span className="text-[#D1E8DA]">MSEDCL</span> - State Electricity Grid</li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="space-y-2.5">
            <h4 className="text-[#CFFFDC] font-semibold text-xs uppercase tracking-wider">Help & Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#68BA7F]" />
                <span>Toll Free Helpdesk: 1800-120-8899</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#68BA7F]" />
                <span>support@permitflownexus.gov.in</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#68BA7F] shrink-0 mt-0.5" />
                <span>PFN Single Window Cell, Industry Dept, Mantralaya, Mumbai - 400032</span>
              </div>
            </div>
            <div className="pt-2 flex gap-4 text-[#60826A]">
              <a href="#privacy" className="hover:text-[#CFFFDC] transition-colors">Privacy Notice</a>
              <span>•</span>
              <a href="#terms" className="hover:text-[#CFFFDC] transition-colors">Terms of Use</a>
              <span>•</span>
              <a href="#help" className="hover:text-[#CFFFDC] transition-colors">Help Centre</a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-[#253D2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#60826A]">
          <p>© 2026 PermitFlow Nexus. Working Demonstration Platform. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-[#16261C] px-3 py-1 rounded-full border border-[#253D2C] text-[#CFFFDC]">
            <span className="w-2 h-2 rounded-full bg-[#68BA7F] animate-pulse" />
            <span>Simulated Department Workflow Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
