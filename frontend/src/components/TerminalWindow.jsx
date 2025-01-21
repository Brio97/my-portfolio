import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { getLocationDetails } from '../services/location';
import Logo from '/src/assets/portfolio-logo.webp';

export const TerminalWindow = ({ onCommand, isDark }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    <div key="welcome" className="flex items-center gap-2">
      <img src={Logo} alt="Logo" className="w-4 h-4" />
      Welcome! Type "help" for commands
    </div>
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const inputRef = useRef(null);

  const commands = useMemo(() => ({
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
  }), []);

  const getLocationWithTimeout = () => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeout);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        { 
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0 
        }
      );
    });
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const newHistory = [...history, `> ${input}`];
      const trimmedInput = input.toLowerCase().trim();

      // Direct command handling
      switch(trimmedInput) {
        case 'help':
          newHistory.push('Available commands:', ...Object.entries(commands).map(([cmd, desc]) => `${cmd}: ${desc}`));
          setHistory(newHistory);
          setCommandHistory(prev => [...prev, input]);
          setHistoryIndex(-1);
          setInput('');
          return;

        case 'clear':
          setHistory([]);
          setInput('');
          return;

        case 'time':
          newHistory.push(new Date().toLocaleTimeString());
          setHistory(newHistory);
          setCommandHistory(prev => [...prev, input]);
          setHistoryIndex(-1);
          setInput('');
          return;

          case 'social':
            newHistory.push(
              'Social Media Links',
              '━━━━━━━━━━━━━━━',
              '• GitHub:    https://github.com/Brio97',
              '• LinkedIn:  https://linkedin.com/in/brian-mutai-158397202',
              '• Twitter:   @yobrade20'
            );
            setHistory(newHistory);
            setCommandHistory(prev => [...prev, input]);
            setHistoryIndex(-1);
            setInput('');
            return;          

        case 'weather':
          setIsLoading(true);
          newHistory.push('Fetching weather data...');
          try {
            let locationData = userLocation;
            if (!locationData) {
              const position = await getLocationWithTimeout();
              locationData = await getLocationDetails(
                position.coords.latitude,
                position.coords.longitude
              );
              setUserLocation(locationData);
            }
            
            const response = await fetch(`/.netlify/functions/api/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
            const data = await response.json();
            newHistory.push(`Current weather in ${locationData.city}: ${data.weather[0].main}, ${Math.round(data.main.temp - 273.15)}°C`);
          } catch (error) {
            try {
              const response = await fetch(`/.netlify/functions/api/weather?q=Nairobi&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
              const data = await response.json();
              newHistory.push(`Current weather in Nairobi: ${data.weather[0].main}, ${Math.round(data.main.temp - 273.15)}°C`);
            } catch (fallbackError) {
              newHistory.push('Weather service temporarily unavailable');
            }
          } finally {
            setIsLoading(false);
          }
          setHistory(newHistory);
          setCommandHistory(prev => [...prev, input]);
          setHistoryIndex(-1);
          setInput('');
          return;
      }

      // Handle other commands with translation
      setIsLoading(true);
      try {
        const response = await fetch('/.netlify/functions/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            q: trimmedInput,
            target: 'en'
          })
        });
  
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText.toLowerCase().trim();
        
        const words = translatedText.split(/\s+/);
        const cmd = Object.keys(commands).find(command => 
          words.some(word => 
            word === command || 
            word.includes(command) || 
            command.includes(word)
          )
        ) || translatedText;

        if (Object.keys(commands).includes(cmd)) {
          onCommand(cmd);
          newHistory.push(`Executing: ${cmd}`);
        } else {
          newHistory.push(`Command not recognized: ${input}`);
        }
      } catch (error) {
        const directCmd = trimmedInput;
        if (Object.keys(commands).includes(directCmd)) {
          onCommand(directCmd);
          newHistory.push(`Executing: ${directCmd}`);
        } else {
          newHistory.push(`Command not recognized: ${input}`);
        }
      } finally {
        setIsLoading(false);
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

  const HistoryList = ({ items }) => (
    <FixedSizeList
      height={256}  // Increased from 200 to match container
      itemCount={items.length}
      itemSize={64}  // Increased for comfortable multi-line content
      width="100%"
      className={isDark ? 'text-green-400' : 'text-green-600'}
    >
      {({ index, style }) => (
        <div 
          style={{ 
            ...style, 
            whiteSpace: 'pre-wrap', 
            lineHeight: '1.5',
            padding: '8px 0'
          }} 
          className="mb-1"
        >
          {items[index]}
        </div>
      )}
    </FixedSizeList>
  );    

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 font-mono shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <img src={Logo} alt="Terminal Logo" className="w-5 h-5" />
        </div>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>portfolio-terminal</span>
      </div>
      <div className="h-64 overflow-auto mb-2">
        <HistoryList items={history} />
      </div>
      {isLoading && (
        <div className={`text-center py-2 ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center justify-center gap-2`}>
          <img src={Logo} alt="Loading" className="w-4 h-4 animate-spin" />
          Processing...
        </div>
      )}
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
          disabled={isLoading}
        />
      </div>
    </div>
  );
};