import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/portfolioData';

export const Skills = ({ isDarkTheme }) => {
  return (
    <motion.div 
      key="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <h2 data-translate className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
        Skills
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} backdrop-blur-sm rounded-lg p-6`}>
            <h3 data-translate className="text-xl font-bold text-blue-500 mb-4">{category}</h3>
            <div className="space-y-4">
              {skillList.map((skill, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between mb-1">
                    <span data-translate className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{skill}</span>
                    <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>85%</span>
                  </div>
                  <motion.div 
                    className="h-2 bg-gray-700 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};