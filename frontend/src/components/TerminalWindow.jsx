import React, { useState, useEffect, useRef } from 'react';

export const TerminalWindow = ({ onCommand, isDark }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['Welcome! Type "help" for commands']);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  const commands = {
    help: 'List all available commands',
    clear: 'Clear terminal screen',
    about: 'About me',
    skills: 'View technical skills',
    projects: 'Browse projects',
    contact: 'Contact information',
    experience: 'Work experience',
    education: 'Education history',
    social: 'Social media links',
    theme: 'Toggle dark/light theme',
    weather: 'Check current weather',
    time: 'Show current time',
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const newHistory = [...history, `> ${input}`];
      const cmd = input.toLowerCase().trim();
      
      switch(cmd) {
        case 'help':
          newHistory.push('Available commands:', ...Object.entries(commands).map(([cmd, desc]) => `${cmd}: ${desc}`));
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'time':
          newHistory.push(new Date().toLocaleTimeString());
          break;
        // In the weather case of handleCommand:
        case 'weather':
          newHistory.push('Fetching weather data...');
          try {
            const response = await fetch(`/api/weather?q=Nairobi&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
            const data = await response.json();
            newHistory.push(`Current weather in Nairobi: ${data.weather[0].main}, ${Math.round(data.main.temp - 273.15)}°C`);
          } catch (error) {
            newHistory.push('Error fetching weather data');
          }
          break;
        default:
          onCommand(cmd);
          newHistory.push(`Executing: ${cmd}`);
      }
      
      setHistory(newHistory);
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 font-mono shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>portfolio-terminal</span>
      </div>
      <div className={`h-48 overflow-auto ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <div className="flex items-center">
        <span className={isDark ? 'text-green-400' : 'text-green-600'}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className={`${isDark ? 'bg-transparent text-green-400' : 'bg-transparent text-green-600'} outline-none flex-1 ml-2`}
          autoFocus
        />
      </div>
    </div>
  );
};