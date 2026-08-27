import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, AlertCircle, HelpCircle, Building2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { activeProject, language, setLanguage } = useApp();
  const [inputQuery, setInputQuery] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello! Welcome to the Maharashtra PermitFlow Approval Helpdesk. I can assist you with mandatory license checklists, AI document pre-screening flags, state subsidy schemes (PSI 2019), and compliance renewal timelines for "${activeProject.businessName}". How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const suggestedQuestions = [
    'Which approvals do I need?',
    'Why was my application rejected?',
    'What documents are required for Fire NOC?',
    'Which incentive am I eligible for?',
    'When is my next renewal?'
  ];

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let reply = '';
    const qLower = queryText.toLowerCase();

    if (qLower.includes('approval') || qLower.includes('need') || qLower.includes('which approvals')) {
      reply = `Based on your profile "${activeProject.businessName}" (${activeProject.sector} sector in ${activeProject.midcArea} with ${activeProject.employeeCount} workers), you need 8 approvals:\n1. Company Registration & GST\n2. MIDC Building Plan Approval\n3. Provisional Fire NOC\n4. MPCB Consent to Establish (CTE)\n5. DISH Factory Licence (Form 1)\n6. FSSAI State Manufacturing Licence\n7. MSEDCL Power Connection\n8. Professional Tax Registration.`;
    } else if (qLower.includes('rejected') || qLower.includes('query')) {
      reply = `Your MPCB Consent to Establish application (#PFN-2026-MPCB-0341) currently has an open query raised by Dr. V. K. Patil regarding ETP washwater capacity. Submit revised flow diagram drawings by 2026-09-01 to resume review.`;
    } else if (qLower.includes('fire noc') || qLower.includes('documents')) {
      reply = `For Provisional Fire NOC in Maharashtra Fire Services, prepare:\n• Approved MIDC Architectural Blueprint\n• Fire Fighting System Hydraulic Drawing\n• Site Plan & Hazard Material Sheet\n• Licensed Fire Consultant Audit Certificate.`;
    } else if (qLower.includes('incentive') || qLower.includes('subsidy')) {
      reply = `Your project qualifies for the Maharashtra Package Scheme of Incentives (PSI 2019) under Zone C classification:\n• Est. Capital Subsidy: ₹45,00,000\n• 100% Electricity Duty Exemption for 7 years (Saving ~₹3.2L/yr)\n• CMEGP Margin Subsidy up to ₹25,00,000.`;
    } else if (qLower.includes('renewal') || qLower.includes('deadline')) {
      reply = `Your next upcoming compliance renewals are:\n1. Fire Equipment Annual Audit (Form B) - OVERDUE by 6 days\n2. DISH Factory Licence Fee - Due in 30 days (2026-09-25)\n3. MPCB CTO Return - Due in 66 days.`;
    } else {
      reply = `Thank you for your inquiry. For ${activeProject.businessName}, you can check your personalized Smart Checklist, Document Centre OCR report, or track application SLAs in real time. Please ask if you need specific document checklists or department contact details!`;
    }

    const botMsg: Message = {
      id: `m-${Date.now() + 1}`,
      sender: 'bot',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      
      {/* Header - Consistent Maharashtra Gov Forest Green Theme */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-5 rounded-2xl border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CFFFDC]/60 dark:bg-[#253D2C] text-[#2E6F40] dark:text-[#CFFFDC] flex items-center justify-center font-bold border border-[#68BA7F]/40 shadow-xs">
            <HelpCircle className="w-6 h-6 text-[#2E6F40] dark:text-[#68BA7F]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#192A1E] dark:text-[#E8F7ED]">Approval Helpdesk & Assistant</h1>
            <p className="text-xs text-[#4A6B53] dark:text-[#A3D4B3] font-medium">Official guidance for Maharashtra approval rules, document flags & incentives.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold border border-[#D4EEDC] dark:border-[#253D2C] shadow-xs">
          <button onClick={() => setLanguage('en')} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${language === 'en' ? 'bg-[#2E6F40] text-white' : 'text-slate-600 dark:text-slate-300'}`}>English</button>
          <button onClick={() => setLanguage('mr')} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${language === 'mr' ? 'bg-[#2E6F40] text-white' : 'text-slate-600 dark:text-slate-300'}`}>मराठी</button>
          <button onClick={() => setLanguage('hi')} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors ${language === 'hi' ? 'bg-[#2E6F40] text-white' : 'text-slate-600 dark:text-slate-300'}`}>हिंदी</button>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="bg-[#F8FCF9] dark:bg-[#16261C] p-3 rounded-xl border border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-2 text-xs text-[#192A1E] dark:text-[#E8F7ED] shadow-xs">
        <AlertCircle className="w-4 h-4 text-[#2E6F40] dark:text-[#68BA7F] shrink-0" />
        <span><strong>Advisory Disclaimer:</strong> Helpdesk guidance is for assistance. Final approval decisions are strictly made by authorized government departments.</span>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-[#16261C] rounded-2xl border border-slate-200 dark:border-[#253D2C] shadow-xs h-[420px] flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-[#2E6F40] text-white flex items-center justify-center shrink-0 font-bold">
                  H
                </div>
              )}
              <div
                className={`max-w-lg p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-[#2E6F40] text-white rounded-tr-none'
                    : 'bg-[#F8FCF9] dark:bg-slate-900 text-[#192A1E] dark:text-[#E8F7ED] rounded-tl-none border border-[#D4EEDC] dark:border-slate-800 font-medium'
                }`}
              >
                <div>{m.text}</div>
                <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-[#CFFFDC]' : 'text-slate-400'}`}>{m.timestamp}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold">
                  U
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Quick Questions Chips */}
        <div className="p-2.5 bg-[#F8FCF9] dark:bg-slate-900 border-t border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#4A6B53] dark:text-[#A3D4B3] font-bold uppercase text-[9px] shrink-0">Suggested Questions:</span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#D4EEDC] dark:border-slate-700 hover:border-[#2E6F40] hover:text-[#2E6F40] transition-colors shrink-0 font-semibold cursor-pointer shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-[#253D2C] bg-white dark:bg-[#16261C] flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
            placeholder="Ask PermitFlow Helpdesk about your business approvals..."
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-[#2E6F40]"
          />
          <button
            onClick={() => handleSend(inputQuery)}
            className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Send Question
          </button>
        </div>
      </div>

    </div>
  );
};
