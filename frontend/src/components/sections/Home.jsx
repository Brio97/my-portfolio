import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';
import Logo from '/src/assets/portfolio-logo.webp';

export const Home = ({ isDark }) => {
  return (
    <div className="text-center mt-24">
      <img 
        src={Logo} 
        alt="Brand Logo" 
        className="w-32 h-32 mx-auto mb-6 animate-pulse"
      />
      <h2 data-translate className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
        Full Stack Developer | Insurance Risk Analyst
      </h2>
      <p data-translate className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
        Bridging the gap between insurance industry expertise and modern software development
      </p>
      <div className="flex justify-center space-x-6">
        <a href="https://github.com/Brio97" target="_blank" rel="noopener noreferrer">
          <Github size={24} className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-white cursor-pointer`} />
        </a>
        <a href="mailto:Mutai.brian79@gmail.com">
          <Mail size={24} className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-white cursor-pointer`} />
        </a>
        <a href="https://www.linkedin.com/in/brian-mutai-158397202" target="_blank" rel="noopener noreferrer">
          <Linkedin size={24} className={`${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-white cursor-pointer`} />
        </a>
      </div>
    </div>
  );
};