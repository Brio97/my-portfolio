import React from 'react';
import { motion } from 'framer-motion';
import { Code, LineChart, Lightbulb, Target, Compass } from 'lucide-react';
import { AdUnit } from '../AdUnit';

export const About = ({ isDarkTheme }) => {
  const sections = [
    {
      icon: <Code size={24} />,
      title: "Professional Journey",
      content: "Starting in Insurance Risk Analysis, I discovered my passion for automation and development. This unique path has given me insights into both business processes and technical solutions, allowing me to create impactful applications that solve real industry challenges."
    },
    {
      icon: <LineChart size={24} />,
      title: "Industry Bridge",
      content: "My experience in insurance risk assessment enhances my development approach. I bring analytical precision to coding and understand how to translate complex business requirements into efficient technical solutions."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Problem-Solving Philosophy",
      content: "I believe in writing clean, maintainable code that solves real problems. My approach combines analytical thinking from risk assessment with modern development practices, ensuring solutions that are both robust and user-friendly."
    },
    {
      icon: <Target size={24} />,
      title: "Current Focus",
      content: "Currently diving deeper into cloud architecture and DevOps practices. I'm particularly interested in developing scalable solutions that leverage modern technologies while maintaining high reliability and security standards."
    },
    {
      icon: <Compass size={24} />,
      title: "Professional Values",
      content: "I value continuous learning, code quality, and effective collaboration. My goal is to create solutions that not only meet technical requirements but also deliver real business value."
    }
  ];

  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <h2 data-translate className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
        About Me
      </h2>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                {section.icon}
              </div>
              <h3 data-translate className={`text-xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                {section.title}
              </h3>
            </div>
            <p data-translate className={`leading-relaxed ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>
      <AdUnit />
    </motion.div>
  );
};