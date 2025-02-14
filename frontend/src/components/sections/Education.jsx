import React from 'react';
import { motion } from 'framer-motion';
import { education } from '../../data/portfolioData';
import { AdUnit } from '../AdUnit';

export const Education = ({ isDarkTheme }) => {
  return (
    <motion.div
      key="education"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
        Education
      </h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <React.Fragment key={index}>
            <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}>
              <h3 data-translate className="text-xl font-bold text-blue-600">{edu.degree}</h3>
              <p data-translate className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{edu.school}</p>
              <p data-translate className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                {edu.period} • {edu.location}
              </p>
              {edu.gpa && (
                <p data-translate className={`mt-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  GPA: {edu.gpa}
                </p>
              )}
            </div>
            {index === 1 && <AdUnit />}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

