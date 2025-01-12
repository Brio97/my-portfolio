import React from 'react';

export const ProjectFilter = ({ technologies, onFilter, selectedTech, isDark }) => (
  <div className="flex flex-wrap gap-4 mb-8">
    <button
      data-translate
      onClick={() => onFilter(null)}
      className={`${
        !selectedTech 
          ? 'bg-blue-500 text-white' 
          : isDark 
            ? 'bg-blue-500/20 text-blue-300' 
            : 'bg-blue-100 text-blue-700'
      } px-3 py-1 rounded-full hover:bg-blue-500/30`}
    >
      All Projects
    </button>
    {technologies && technologies.length > 0 && technologies.map((tech) => (
      <button
        data-translate
        key={tech}
        onClick={() => onFilter(tech)}
        className={`${
          selectedTech === tech
            ? 'bg-blue-500 text-white'
            : isDark
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-blue-100 text-blue-700'
        } px-3 py-1 rounded-full hover:bg-blue-500/30`}
      >
        {tech}
      </button>
    ))}
  </div>
);