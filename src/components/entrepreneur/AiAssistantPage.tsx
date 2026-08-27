import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiQueryRegulatoryRAG } from '../../services/api';
import { Send, AlertCircle, HelpCircle, Building2, BookOpen, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  citations?: string[];
}

export const AiAssistantPage: React.FC = () => {
  const { activeProject, language, setLanguage } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialBotGreeting = language === 'mr'
    ? `नमस्कार! महाराष्ट्र शासन PermitFlow Nexus सहाय्यता केंद्रात आपले स्वागत आहे. मी आपल्या "${activeProject.businessName}" साठी आवश्यक परवाने, PSI 2019 अनुदान योजना आणि वैधानिक नूतनीकरण नियमांबद्दल मार्गदर्शन करू शकतो. मी आपली काय मदत करू?`
    : language === 'hi'
    ? `नमस्ते! महाराष्ट्र शासन PermitFlow Nexus सहायता केंद्र में आपका स्वागत है। मैं आपकी "${activeProject.businessName}" के लिए आवश्यक मंजूरी, PSI 2019 सब्सिडी और वैधानिक नियमों में सहायता कर सकता हूँ।`
    : `Hello! Welcome to the Maharashtra PermitFlow Approval Helpdesk. I can assist you with mandatory license checklists, statutory acts, state subsidy schemes (PSI 2019), and compliance renewal timelines for "${activeProject.businessName}". How may I assist you today?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: initialBotGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const suggestedQuestions = language === 'mr'
    ? [
        'मला कोणते परवाने लागतील?',
        'PSI 2019 अंतर्गत कोणते अनुदान मिळेल?',
        'फायर एनओसी (Fire NOC) साठी काय नियम आहेत?',
        'MPCB CTE कधी आवश्यक असते?',
        'कारखाना परवाना (DISH) नियम काय आहेत?'
      ]
    : [
        'Which approvals do I need?',
        'Which incentive am I eligible for (PSI 2019)?',
        'What documents are required for Fire NOC?',
        'When is MPCB Consent to Establish (CTE) required?',
        'What are the DISH Factory Licence worker thresholds?'
      ];

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const ragRes = await apiQueryRegulatoryRAG({
        query: queryText,
        projectContext: {
          businessName: activeProject.businessName,
          sector: activeProject.sector,
          district: activeProject.district,
          investmentRange: activeProject.investmentRange,
          employeeCount: activeProject.employeeCount,
          midcArea: activeProject.midcArea
        },
        language
      });

      let reply = '';
      let citations: string[] = [];

      if (ragRes && ragRes.answer) {
        reply = ragRes.answer;
        citations = ragRes.statutoryCitations || [];
      } else {
        reply = `For "${activeProject.businessName}" (${activeProject.sector} sector in ${activeProject.midcArea}), compliance is regulated under the Maharashtra Single Window Act.\n\n• Please verify your required submissions in the Smart Approval Checklist\n• Upload statutory blueprints in the Document Centre for OCR pre-screening.`;
      }

      const botMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'bot',
        text: reply,
        citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorBotMsg: Message = {
        id: `m-${Date.now() + 1}`,
        sender: 'bot',
        text: `Based on Maharashtra regulatory norms, your project in ${activeProject.midcArea} requires building plan sanctions and fire clearances. Please refer to your personalized Smart Checklist.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
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
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#D4EEDC]/60 dark:border-slate-800 flex flex-wrap gap-1">
                    <span className="text-[9px] font-extrabold text-[#4A6B53] dark:text-[#A3D4B3] uppercase tracking-wider block w-full mb-0.5">
                      Statutory Citations:
                    </span>
                    {m.citations.map((cit, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#D4EEDC] dark:border-slate-700 text-[#2E6F40] dark:text-[#CFFFDC] text-[9px] font-bold flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>{cit}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className={`text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-[#CFFFDC]' : 'text-slate-400'}`}>{m.timestamp}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#2E6F40] text-white flex items-center justify-center shrink-0 font-bold">
                H
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8FCF9] dark:bg-slate-900 text-[#192A1E] dark:text-[#E8F7ED] border border-[#D4EEDC] dark:border-slate-800 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#2E6F40]" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Retrieving Maharashtra statutory regulations & bye-laws...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions Chips */}
        <div className="p-2.5 bg-[#F8FCF9] dark:bg-slate-900 border-t border-[#D4EEDC] dark:border-[#253D2C] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#4A6B53] dark:text-[#A3D4B3] font-bold uppercase text-[9px] shrink-0">Suggested Questions:</span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#D4EEDC] dark:border-slate-700 hover:border-[#2E6F40] hover:text-[#2E6F40] transition-colors shrink-0 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
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
            disabled={isLoading || !inputQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#2E6F40] hover:bg-[#235833] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
          >
            Send Question
          </button>
        </div>
      </div>

    </div>
  );
};
