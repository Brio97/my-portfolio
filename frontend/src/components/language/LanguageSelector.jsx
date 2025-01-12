import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const currentLang = localStorage.getItem('selectedLanguage');
      if (currentLang) {
        translateContent(currentLang);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const initializeLanguage = async () => {
      try {
        const response = await fetch('/api/translate/languages');
        const data = await response.json();
        setAvailableLanguages(data.data.languages);
        
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang) {
          await translateContent(savedLang);
          i18n.changeLanguage(savedLang);
        }
      } catch (error) {
        console.log('Language detection fallback to English');
      }
    };

    initializeLanguage();

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
  
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: textToTranslate, target: targetLang })
        });
  
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;
  
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translatedText;
        } else {
          element.textContent = translatedText;
        }
      }
    } catch (error) {
      console.log('Translation service temporarily unavailable');
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
        className={`p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors flex items-center`}
      >
        <Globe size={20} className={isDark ? 'text-white' : 'text-gray-700'} />
        <span className="ml-2 text-sm">
          {i18n.language.toUpperCase()}
        </span>
      </button>
      
      {isOpen && availableLanguages.length > 0 && (
        <div className={`absolute top-full right-0 mt-2 py-2 w-48 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} z-[100] max-h-60 overflow-y-auto`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.language}
              onClick={() => handleLanguageChange(lang.language)}
              className={`w-full text-left px-4 py-2 ${
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