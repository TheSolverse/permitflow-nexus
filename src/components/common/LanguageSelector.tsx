import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex items-center gap-1 bg-[#F0FAF3] dark:bg-[#1E3326] rounded-xl p-1 text-xs font-semibold border border-[#D4EEDC] dark:border-[#2A4736] shadow-xs">
      <Globe className="w-3.5 h-3.5 text-[#2E6F40] dark:text-[#68BA7F] mx-1 shrink-0" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all text-xs font-extrabold cursor-pointer ${
          language === 'en'
            ? 'bg-[#2E6F40] text-white shadow-xs'
            : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#192A1E] dark:hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('mr')}
        className={`px-2.5 py-1 rounded-lg transition-all text-xs font-extrabold cursor-pointer ${
          language === 'mr'
            ? 'bg-[#2E6F40] text-white shadow-xs'
            : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#192A1E] dark:hover:text-white'
        }`}
      >
        मराठी
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 rounded-lg transition-all text-xs font-extrabold cursor-pointer ${
          language === 'hi'
            ? 'bg-[#2E6F40] text-white shadow-xs'
            : 'text-[#4A6B53] dark:text-[#A3D4B3] hover:text-[#192A1E] dark:hover:text-white'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
