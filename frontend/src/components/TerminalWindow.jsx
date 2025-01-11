import React, { useState } from 'react';

export const TerminalWindow = ({ onCommand }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['Welcome! Type "help" for commands']);

  const handleCommand = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const newHistory = [...history, `> ${input}`];
      
      switch(input.toLowerCase()) {
        case 'help':
          newHistory.push(
            'Available commands:',
            'about - About me',
            'experience - View work experience',
            'education - View education history',
            'projects - View projects',
            'skills - List technical skills',
            'contact - Contact information',
            'clear - Clear terminal'
          );
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          onCommand(input.toLowerCase());
          newHistory.push(`Executing: ${input}`);
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm">portfolio-terminal</span>
      </div>
      <div className="h-48 overflow-auto text-green-400 mb-2">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent text-green-400 outline-none flex-1"
          autoFocus
        />
      </div>
    </div>
  );
};
