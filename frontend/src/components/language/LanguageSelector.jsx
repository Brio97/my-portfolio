import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Static language list - no API calls needed
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'zh', name: '中文' }
];

export const LanguageSelector = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Initialize language from localStorage or default to English
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  const handleLanguageChange = (langCode) => {
    localStorage.setItem('selectedLanguage', langCode);
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 sm:p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors flex items-center`}
      >
        <Globe size={18} className={isDark ? 'text-white' : 'text-blue-600'} />
        <span className={`ml-1 sm:ml-2 text-xs sm:text-sm ${isDark ? 'text-white' : 'text-blue-600'}`}>
          {i18n.language.toUpperCase()}
        </span>
      </button>
      
      {isOpen && (
        <div className={`absolute left-0 sm:right-0 mt-2 py-2 w-40 sm:w-48 rounded-lg shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } z-[100] max-h-60 overflow-y-auto`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-3 sm:px-4 py-2 text-sm ${
                i18n.language === lang.code 
                  ? 'bg-blue-500 text-white' 
                  : isDark 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-700'
              } relative z-[101]`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );  
};