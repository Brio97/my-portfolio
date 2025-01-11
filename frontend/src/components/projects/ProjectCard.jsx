import React, { useState } from 'react';
import { Code, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectCard = ({ project, isDark }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} rounded-lg p-6 transform transition-all duration-300 hover:scale-105`}
    >
      {project.screenshot && (
        <img 
          src={project.screenshot} 
          alt={project.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-bold mb-2 text-blue-500">{project.name}</h3>
      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{project.description}</p>
      
      <div className="flex flex-wrap gap-2 my-4">
        {project.technologies && project.technologies.map((tech, index) => (
          <span key={index} className={`${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'} px-2 py-1 rounded-full text-sm`}>
            {tech}
          </span>
        ))}
      </div>

      <button 
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center text-blue-500 hover:text-blue-400 mb-4"
      >
        {showDetails ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}
        {showDetails ? 'Show Less' : 'Show More'}
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4"
          >
            {project.features && (
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  {project.features.map((feature, index) => (
                    <li key={index} className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {project.demo && (
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src={project.demo}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-4 mt-4">
        <a href={project.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 flex items-center">
          <Github size={16} className="mr-1" /> Source Code
        </a>
        {project.homepage && (
          <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 flex items-center">
            <ExternalLink size={16} className="mr-1" /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );
};