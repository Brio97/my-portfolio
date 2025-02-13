import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { getLocationDetails } from '../services/location';
import { useTranslation } from 'react-i18next';
import Logo from '/src/assets/portfolio-logo.webp';

const API_BASE = '/.netlify/functions/api';

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Response parsing failed:', text);
      throw new Error(`Server response error: ${text.substring(0, 100)}`);
    }
    
    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`${endpoint} request failed:`, error);
    throw error;
  }
};

export const TerminalWindow = ({ onCommand, isDark }) => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    <div key="welcome" className="flex items-center gap-2">
      <img src={Logo} alt="Logo" className="w-4 h-4" />
      <span data-translate>Welcome! Type "help" for commands</span>
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

  const handleSocialCommand = (newHistory) => {
    newHistory.push(
      <span data-translate>Social Media Links</span>,
      '━━━━━━━━━━━━━━━',
      <span data-translate>• GitHub:    https://github.com/Brio97</span>,
      <span data-translate>• LinkedIn:  https://linkedin.com/in/brian-mutai-158397202</span>,
      <span data-translate>• Twitter:   @yobrade20</span>
    );
    return newHistory;
  };

  const handleWeatherCommand = async (newHistory) => {
    newHistory.push(<span data-translate>Fetching weather data...</span>);
    try {
      // First attempt to get user's location
      const position = await getLocationWithTimeout();
      
      // If position is successfully obtained, get detailed location info
      const locationData = await getLocationDetails(
        position.coords.latitude,
        position.coords.longitude
      );
      
      // Set the user location in state for future use
      setUserLocation(locationData);
      
      // Make weather API call with exact coordinates
      const data = await apiRequest(`weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      
      if (!data || !data.weather) {
        throw new Error('Invalid weather data received');
      }
  
      const location = locationData?.city || data.name;
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      
      newHistory.push(
        <span data-translate>Current weather in {location}:</span>,
        <span data-translate>{temp}°C - {description}</span>
      );
    } catch (error) {
      console.error('Weather error:', error);
      newHistory.push(<span data-translate>Unable to fetch precise location. Showing default weather data.</span>);
      
      // Only fall back to default location if geolocation fails
      try {
        const data = await apiRequest('weather?q=Nairobi');
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        
        newHistory.push(
          <span data-translate>Weather in Nairobi:</span>,
          <span data-translate>{temp}°C - {description}</span>
        );
      } catch (fallbackError) {
        newHistory.push(<span data-translate>Weather service temporarily unavailable.</span>);
      }
    }
    return newHistory;
  };    

  const handleTranslation = async (input, newHistory) => {
    try {
      const data = await apiRequest('translate', {
        method: 'POST',
        body: JSON.stringify({ 
          q: input, 
          target: i18n.language,
          source: 'auto' 
        })
      });
      const translatedText = data.data.translations[0].translatedText.toLowerCase().trim();
      return findAndExecuteCommand(translatedText, newHistory);
    } catch (error) {
      return findAndExecuteCommand(input, newHistory);
    }
  };

  const findAndExecuteCommand = (text, newHistory) => {
    const words = text.split(/\s+/);
    const cmd = Object.keys(commands).find(command => 
      words.some(word => word === command || word.includes(command))
    ) || text;

    if (Object.keys(commands).includes(cmd)) {
      onCommand(cmd);
      newHistory.push(<span data-translate>Executing: {cmd}</span>);
    } else {
      newHistory.push(<span data-translate>Command not recognized: {text}</span>);
    }
    return newHistory;
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const trimmedInput = input.toLowerCase().trim();

      if (trimmedInput === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const newHistory = [...history, `> ${input}`];
      setIsLoading(true);
      try {
        switch(trimmedInput) {
          case 'help':
            newHistory.push(
              <div data-translate>Available commands:</div>,
              ...Object.entries(commands).map(([cmd, desc]) => (
                <div key={cmd} data-translate>`${cmd}: {t(desc)}`</div>
              ))
            );
            break;
          case 'time':
            newHistory.push(<span data-translate>{new Date().toLocaleTimeString(i18n.language)}</span>);
            break;
          case 'social':
            handleSocialCommand(newHistory);
            break;
          case 'weather':
            await handleWeatherCommand(newHistory);
            break;
          default:
            await handleTranslation(trimmedInput, newHistory);
        }
      } catch (error) {
        console.error('Command error:', error);
        newHistory.push(<span data-translate>An error occurred. Please try again.</span>);
      } finally {
        setIsLoading(false);
        setHistory(newHistory);
        setCommandHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
        setInput('');
      }
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

  const HistoryList = ({ items }) => {
    const HistoryItem = React.memo(({ content }) => (
      <div className="mb-1">
        {content}
      </div>
    ));

    return (
      <FixedSizeList
        height={256}
        itemCount={items.length}
        itemSize={64}
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
          >
            <HistoryItem content={items[index]} />
          </div>
        )}
      </FixedSizeList>
    );
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const currentLang = i18n.language;
    const handleScroll = () => {
      if (i18n.language !== currentLang) {
        i18n.changeLanguage(currentLang);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => document.removeEventListener('scroll', handleScroll);
  }, [i18n]);

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
          <span data-translate>Processing...</span>
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