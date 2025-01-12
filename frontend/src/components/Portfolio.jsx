import React, { useState, useEffect } from 'react';
import { Terminal, Code, Box, Home as HomeIcon, Mail, Github, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleField } from './ParticleField';
import { TerminalWindow } from './TerminalWindow';
import { ProjectCard } from './projects/ProjectCard';
import { ProjectFilter } from './projects/ProjectFilter';
import { ThemeToggle } from './theme/ThemeToggle';
import { ResumeButton } from './resume/ResumeButton';
import { Home } from './sections/Home';
import { BlogSection } from './blog/BlogSection';
import { LanguageSelector } from './language/LanguageSelector';
import { skills, experience, education } from '../data/portfolioData';
import { fetchGithubRepos } from '../services/githubService';
import { useTranslation } from 'react-i18next';

export const Portfolio = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [showTerminal, setShowTerminal] = useState(false);
  const [githubProjects, setGithubProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [selectedTech, setSelectedTech] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const validSections = ['home', 'about', 'experience', 'education', 'projects', 'skills', 'contact', 'blog'];
    
    if (hash && validSections.includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    const loadGithubProjects = async () => {
      try {
        setIsLoading(true);
        const repos = await fetchGithubRepos();
        setGithubProjects(repos);
      } finally {
        setIsLoading(false);
      }
    };
    loadGithubProjects();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  const handleCommand = (command) => {
    switch(command) {
      case 'theme':
        setIsDarkTheme(!isDarkTheme);
        break;
      case 'home':
      case 'about':
      case 'experience':
      case 'education':
      case 'projects':
      case 'skills':
      case 'contact':
      case 'blog':
        handleSectionChange(command);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus(t('portfolio.submitSuccess'));
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      setSubmitStatus(t('portfolio.submitError'));
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const filteredProjects = selectedTech
    ? githubProjects.filter(project => project.technologies.includes(selectedTech))
    : githubProjects;

  const allTechnologies = [...new Set(githubProjects.flatMap(project => project.technologies))];

  return (
    <div className={`min-h-screen w-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} relative overflow-x-hidden`}>
      <ParticleField />
      
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkTheme ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-sm border-b ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 
              onClick={() => handleSectionChange('home')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
            >
              Brian Mutai
            </h1>
            <div className="flex space-x-6">
              <LanguageSelector isDark={isDarkTheme} />
              <button
                onClick={() => handleSectionChange('home')}
                className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Home"
              >
                <HomeIcon size={20} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
              </button>
              <ThemeToggle 
                isDark={isDarkTheme} 
                onToggle={() => setIsDarkTheme(!isDarkTheme)} 
              />
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Open Terminal"
              >
                <Terminal size={20} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
              </button>
              <button
                onClick={() => handleSectionChange('projects')}
                className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Projects"
              >
                <Code size={20} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
              </button>
              <button
                onClick={() => handleSectionChange('skills')}
                className={`p-2 ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Skills"
              >
                <Box size={20} className={isDarkTheme ? 'text-white' : 'text-gray-700'} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative pt-20 min-h-screen w-full">
        {showTerminal && (
          <div className="fixed top-24 right-4 w-96 max-w-[90vw] z-50">
            <TerminalWindow onCommand={handleCommand} isDark={isDarkTheme} />
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Home isDark={isDarkTheme} />
                <div className="mt-8 flex justify-center">
                  <ResumeButton isDark={isDarkTheme} />
                </div>
              </motion.div>
            )}

            {activeSection === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>About Me</h2>
                <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}>
                  <p data-translate className={`leading-relaxed ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    I'm a Full Stack Developer with a strong background in Insurance Risk Analysis. My unique blend of technical skills and insurance industry expertise allows me to create innovative solutions that bridge both worlds.
                  </p>
                </div>
              </motion.div>
            )}

            {activeSection === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Experience</h2>
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <div key={index} className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105`}>
                      <h3 data-translate className="text-xl font-bold text-blue-600">{job.title}</h3>
                      <p data-translate className={`mb-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{job.company} • {job.period}</p>
                      <ul className="space-y-2">
                        {job.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span data-translate className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Education</h2>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}>
                      <h3 data-translate className="text-xl font-bold text-blue-600">{edu.degree}</h3>
                      <p data-translate className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>{edu.school}</p>
                      <p data-translate className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>{edu.period} • {edu.location}</p>
                      {edu.gpa && <p data-translate className={`mt-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Projects</h2>
                <ProjectFilter 
                  technologies={allTechnologies}
                  onFilter={setSelectedTech}
                  selectedTech={selectedTech}
                  isDark={isDarkTheme}
                />
                {isLoading ? (
                  <div data-translate className={`text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Loading projects...</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredProjects.map((project, index) => (
                      <ProjectCard 
                        key={project.id || index} 
                        project={project}
                        isDark={isDarkTheme}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'skills' && (
              <motion.div 
                key="skills"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
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
            )}

            {activeSection === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BlogSection isDark={isDarkTheme} />
              </motion.div>
            )}

            {activeSection === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <h2 data-translate className={`text-3xl font-bold mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>Contact</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        data-translate="Name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={`w-full ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-200'
                        } rounded p-2`}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        data-translate="Email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className={`w-full ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-200'
                        } rounded p-2`}
                        required
                      />
                      <textarea
                        placeholder="Message"
                        data-translate="Message"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className={`w-full ${
                          isDarkTheme 
                            ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                            : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-200'
                        } rounded p-2 h-32`}
                        required
                      />
                      <button data-translate type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">
                        Send Message
                      </button>
                      {submitStatus && (
                        <div data-translate className="mt-4 p-4 bg-green-500/20 text-green-300 rounded-lg">
                          {submitStatus}
                        </div>
                      )}
                    </form>
                  </div>
                  <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-6`}>
                    <div className="space-y-4">
                      <p data-translate className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Mail className="mr-2" /> Email: Mutai.brian79@gmail.com
                      </p>
                      <p data-translate className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Linkedin className="mr-2" /> LinkedIn: brian-mutai-158397202
                      </p>
                      <p data-translate className={`flex items-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Github className="mr-2" /> GitHub: Brio97
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;

