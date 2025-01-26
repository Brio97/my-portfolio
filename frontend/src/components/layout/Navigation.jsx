import React from 'react';
import { Terminal, Code, Box, Home as HomeIcon } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LanguageSelector } from '../language/LanguageSelector';

export const Navigation = ({ 
  isDarkTheme, 
  setIsDarkTheme, 
  handleSectionChange, 
  setShowTerminal, 
  showTerminal 
}) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-6">
      <LanguageSelector isDark={isDarkTheme} />
      <button
        onClick={() => handleSectionChange('home')}
        className={`p-1 sm:p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
        title="Home"
      >
        <HomeIcon size={18} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
      </button>
      <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
      <button
        onClick={() => setShowTerminal(!showTerminal)}
        className={`p-1 sm:p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
        title="Open Terminal"
      >
        <Terminal size={18} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
      </button>
      <button
        onClick={() => handleSectionChange('projects')}
        className={`p-1 sm:p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
        title="Projects"
      >
        <Code size={18} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
      </button>
      <button
        onClick={() => handleSectionChange('skills')}
        className={`p-1 sm:p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
        title="Skills"
      >
        <Box size={18} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
      </button>
    </div>
  );
};
