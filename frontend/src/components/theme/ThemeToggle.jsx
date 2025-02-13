import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ isDark, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
  >
    {isDark ? 
      <Sun size={20} className="text-white" /> : 
      <Moon size={20} className="text-blue-600" />
    }
  </button>
);