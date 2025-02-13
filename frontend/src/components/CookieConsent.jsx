import React, { useState, useEffect } from 'react';

export const CookieConsent = ({ isDark }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true and disabled
    functional: false,
    analytics: false,
    advertising: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    } else {
      setPreferences(JSON.parse(consent));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowConsent(false);
  };

  const handleToggle = (type) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showConsent) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Cookie Preferences
        </h3>
        <div className="space-y-3">
          {Object.entries({
            necessary: 'Essential cookies for site functionality',
            functional: 'Functional cookies for enhanced features',
            analytics: 'Analytics cookies to understand usage',
            advertising: 'Advertising cookies for personalized content'
          }).map(([key, description]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() => key !== 'necessary' && handleToggle(key)}
                  disabled={key === 'necessary'}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSavePreferences}
            className={`px-4 py-2 rounded ${
              isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
            } hover:opacity-90`}
          >
            Save Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};