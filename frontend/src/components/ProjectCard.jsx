import React from 'react';
import { Code, Github } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <h3 className="text-xl font-bold text-blue-400 mb-2">{project.name}</h3>
      <p className="text-gray-400 mb-4">{project.description || 'No description available'}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.language && (
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm">
            {project.language}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {project.homepage && (
            <a 
              href={project.homepage} 
              className="text-blue-400 hover:text-blue-300 flex items-center"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Code size={16} className="mr-1" /> Demo
            </a>
          )}
          <a 
            href={project.html_url} 
            className="text-blue-400 hover:text-blue-300 flex items-center"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github size={16} className="mr-1" /> Code
          </a>
        </div>
        <div className="flex space-x-4 text-sm text-gray-400">
          <span title="Stars">⭐ {project.stargazers_count}</span>
          <span title="Forks">🍴 {project.forks_count}</span>
        </div>
      </div>
    </div>
  );
};