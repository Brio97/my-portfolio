import React from 'react';

export const ProjectFilter = ({ technologies, onFilter }) => (
  <div className="flex flex-wrap gap-4 mb-8">
    <button
      onClick={() => onFilter(null)}
      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30"
    >
      All Projects
    </button>
    {technologies && technologies.length > 0 && technologies.map((tech) => (
      <button
        key={tech}
        onClick={() => onFilter(tech)}
        className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30"
      >
        {tech}
      </button>
    ))}
  </div>
);