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
    blog: 'View blog posts',
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const newHistory = [...history, `> ${input}`];
      
      try {
        // First translation to get the English equivalent
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            q: input.toLowerCase().trim(),
            target: 'en'
          })
        });
  
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText.toLowerCase().trim();
        
        // Enhanced command matching
        const words = translatedText.split(/\s+/);
        const cmd = Object.keys(commands).find(command => 
          words.some(word => 
            word === command || 
            word.includes(command) || 
            command.includes(word)
          )
        ) || translatedText;
      
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
          case 'social':
            newHistory.push(
              'Social Media Links:',
              '• GitHub: https://github.com/Brio97',
              '• LinkedIn: https://linkedin.com/in/brian-mutai-158397202',
              '• Twitter: @yobrade20'
            );
            break;

          case 'theme':
            onCommand('theme');
            newHistory.push('Theme toggled successfully');
            break;

          default:
            // Check if the translated command matches any of our known commands
            const isKnownCommand = Object.keys(commands).includes(cmd);
            if (isKnownCommand) {
              onCommand(cmd);
              newHistory.push(`Executing: ${cmd}`);
            } else {
              newHistory.push(`Command not recognized: ${input}`);
            }
        }
      } catch (error) {
        // Fallback to direct command processing if translation fails
        const directCmd = input.toLowerCase().trim();
        if (Object.keys(commands).includes(directCmd)) {
          onCommand(directCmd);
          newHistory.push(`Executing: ${directCmd}`);
        } else {
          newHistory.push(`Command not recognized: ${input}`);
        }
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
        <span data-translate className={isDark ? 'text-gray-400' : 'text-gray-600'}>portfolio-terminal</span>
      </div>
      <div className={`h-48 overflow-auto ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
        {history.map((line, i) => (
          <div data-translate key={i} className="mb-1">{line}</div>
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