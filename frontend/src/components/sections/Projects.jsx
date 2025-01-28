import React from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectFilter } from '../projects/ProjectFilter';
import { AdUnit } from '../AdUnit';

export const Projects = ({ isDarkTheme, allTechnologies, selectedTech, setSelectedTech, isLoading, filteredProjects }) => {
  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <h2 data-translate className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
        Projects
      </h2>
      {filteredProjects.length > 0 && (
        <ProjectFilter
          technologies={allTechnologies}
          onFilter={setSelectedTech}
          selectedTech={selectedTech}
          isDark={isDarkTheme}
        />
      )}
      {isLoading ? (
        <div data-translate className={`text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
          Loading projects...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <React.Fragment key={project.id || index}>
              <ProjectCard 
                project={project}
                isDark={isDarkTheme}
              />
              {index === 3 && filteredProjects.length > 4 && (
                <div className="col-span-2">
                  <AdUnit />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </motion.div>
  );
};