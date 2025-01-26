import React from 'react';
import { Navigation } from './Navigation';
import Logo from '/src/assets/portfolio-logo.webp';

export const Header = ({ 
  isDarkTheme, 
  setIsDarkTheme, 
  handleSectionChange, 
  setShowTerminal, 
  showTerminal 
}) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkTheme ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-sm border-b ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <img 
            src={Logo} 
            alt="Brand Logo" 
            onClick={() => handleSectionChange('home')}
            className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:opacity-80 transition-opacity"
          />
          <Navigation 
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
            handleSectionChange={handleSectionChange}
            setShowTerminal={setShowTerminal}
            showTerminal={showTerminal}
          />
        </div>
      </nav>
    </header>
  );
};