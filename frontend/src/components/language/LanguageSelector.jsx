import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'sw', name: 'Swahili' },
    { code: 'zh', name: 'Chinese' }
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors flex items-center`}
      >
        <Globe size={20} className={isDark ? 'text-white' : 'text-gray-700'} />
        <span className="ml-2 text-sm">
          {languages.find(lang => lang.code === i18n.language)?.name}
        </span>
      </button>
      
      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 py-2 w-48 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} z-50`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 ${
                i18n.language === lang.code 
                  ? 'bg-blue-500 text-white' 
                  : isDark 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};