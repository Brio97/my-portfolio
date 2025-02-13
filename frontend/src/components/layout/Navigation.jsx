import React from 'react';
import { Terminal, Code, Box, Home as HomeIcon, BookOpen, User } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { LanguageSelector } from '../language/LanguageSelector';

export const Navigation = ({ 
  isDarkTheme, 
  setIsDarkTheme, 
  handleSectionChange, 
  setShowTerminal, 
  showTerminal 
}) => {
  const navItems = [
    { id: 'home', Icon: HomeIcon, label: 'Home' },
    { id: 'terminal', Icon: Terminal, label: 'Terminal' },
    { id: 'projects', Icon: Code, label: 'Projects' },
    { id: 'skills', Icon: Box, label: 'Skills' },
    { id: 'blog', Icon: BookOpen, label: 'Blog' },
    { id: 'about', Icon: User, label: 'About' }
  ];

  return (
    <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-6">
      <LanguageSelector isDark={isDarkTheme} />
      
      {navItems.map(({ id, Icon, label }) => (
        <button
          key={id}
          onClick={() => id === 'terminal' ? setShowTerminal(!showTerminal) : handleSectionChange(id)}
          className={`p-0.5 xs:p-1 sm:p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} 
            rounded-lg transition-all duration-300 relative min-w-[28px] xs:min-w-[32px] sm:min-w-[36px] 
            h-[28px] xs:h-[32px] sm:h-[36px] group`}
          title={label}
        >
          <div className="flex items-center justify-center h-full">
            <div className="absolute animate-iconLabel">
              <Icon size={16} className={isDarkTheme ? 'text-white' : 'text-blue-600'} />
            </div>
            <span className={`absolute text-[10px] xs:text-xs ${isDarkTheme ? 'text-white' : 'text-blue-600'} 
              animate-labelIcon whitespace-nowrap`}>
              {label}
            </span>
          </div>
        </button>
      ))}

      <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(!isDarkTheme)} />
    </div>
  );
};