import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BASE_URL = '/.netlify/functions/api';

export const LanguageSelector = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/translate/languages`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableLanguages(data.data.languages);
        
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        await translateContent(savedLang);
        i18n.changeLanguage(savedLang);
      } catch (error) {
        console.error('Language detection fallback to English:', error);
        setAvailableLanguages([{ language: 'en', name: 'English' }]);
      }
    };

    initializeLanguage();

    const observer = new MutationObserver(() => {
      const currentLang = localStorage.getItem('selectedLanguage');
      if (currentLang) {
        translateContent(currentLang);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [i18n]);

  const translateContent = async (targetLang) => {
    try {
      const elements = document.querySelectorAll('[data-translate]');
      for (const element of elements) {
        const textToTranslate = element.getAttribute('data-original') || 
                               element.placeholder || 
                               element.textContent;
        
        if (!element.getAttribute('data-original')) {
          element.setAttribute('data-original', textToTranslate);
        }
  
        const response = await fetch(`${BASE_URL}/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: textToTranslate, target: targetLang })
        });
  
        if (!response.ok) {
          throw new Error('Translation request failed');
        }

        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;
  
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translatedText;
        } else {
          element.textContent = translatedText;
        }
      }
    } catch (error) {
      console.error('Translation service temporarily unavailable:', error);
    }
  };  

  const handleLanguageChange = async (langCode) => {
    localStorage.setItem('selectedLanguage', langCode);
    i18n.changeLanguage(langCode);
    await translateContent(langCode);
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
      
      {isOpen && availableLanguages.length > 0 && (
        <div className={`absolute left-0 sm:right-0 mt-2 py-2 w-40 sm:w-48 rounded-lg shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } z-[100] max-h-60 overflow-y-auto`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.language}
              onClick={() => handleLanguageChange(lang.language)}
              className={`w-full text-left px-3 sm:px-4 py-2 text-sm ${
                i18n.language === lang.language 
                  ? 'bg-blue-500 text-white' 
                  : isDark 
                    ? 'hover:bg-gray-700 text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-700'
              } relative z-[101]`}
            >
              {lang.name || lang.language}
            </button>
          ))}
        </div>
      )}
    </div>
  );  
};