import React from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useApp();

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs font-medium border border-slate-200 dark:border-slate-700">
      <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-mh-navy text-white font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('mr')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'mr'
            ? 'bg-mh-navy text-white font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
        }`}
      >
        मराठी
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'hi'
            ? 'bg-mh-navy text-white font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
