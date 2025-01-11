import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ isDark, onToggle }) => (
  <button 
    onClick={onToggle}
    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
  >
    {isDark ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);
