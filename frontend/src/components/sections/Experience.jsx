import React from 'react';
import { motion } from 'framer-motion';
import { experience } from '../../data/portfolioData';

export const Experience = ({ isDarkTheme }) => {
  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <h2 data-translate className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
        Experience
      </h2>
      <div className="space-y-6 sm:space-y-8">
        {experience.map((job, index) => (
          <div key={index} className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-4 sm:p-6 transform transition-all duration-300 hover:scale-105`}>
            <h3 data-translate className="text-lg sm:text-xl font-bold text-blue-600">{job.title}</h3>
            <p data-translate className={`mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              {job.company} • {job.period}
            </p>
            <ul className="space-y-2">
              {job.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span data-translate className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
