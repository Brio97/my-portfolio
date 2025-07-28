import React, { useState, useEffect } from 'react';
import { ParticleField } from './ParticleField';
import { TerminalWindow } from './TerminalWindow';
import { Header } from './layout/Header';
import { Home } from './sections/Home';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { Education } from './sections/Education';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';
import { BlogSection } from './blog/BlogSection';
import { ResumeButton } from './resume/ResumeButton';
import { projects, getAllTechnologies, filterProjectsByTech } from '../data/projects';
import { useTranslation } from 'react-i18next';

export const Portfolio = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('home');
  const [showTerminal, setShowTerminal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch('/.netlify/functions/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });      
      
      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus(t('Message sent successfully'));
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      setSubmitStatus(t('There was an error submitting your message!!!'));
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const filteredProjects = filterProjectsByTech(selectedTech);
  const allTechnologies = getAllTechnologies();

  return (
    <div className={`min-h-screen w-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} relative overflow-x-hidden`}>
      <ParticleField />
      
      <Header 
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        handleSectionChange={handleSectionChange}
        setShowTerminal={setShowTerminal}
        showTerminal={showTerminal}
      />

      <main className="relative pt-20 min-h-screen w-full">
        {showTerminal && (
          <div className="fixed top-24 right-4 w-96 max-w-[90vw] z-50">
            <TerminalWindow onCommand={handleCommand} isDark={isDarkTheme} />
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeSection === 'home' && (
            <>
              <Home isDark={isDarkTheme} />
              <div className="mt-8 flex justify-center">
                <ResumeButton isDark={isDarkTheme} />
              </div>
            </>
          )}
          {activeSection === 'about' && <About isDarkTheme={isDarkTheme} />}
          {activeSection === 'experience' && <Experience isDarkTheme={isDarkTheme} />}
          {activeSection === 'education' && <Education isDarkTheme={isDarkTheme} />}
          {activeSection === 'projects' && (
            <Projects 
              isDarkTheme={isDarkTheme}
              allTechnologies={allTechnologies}
              selectedTech={selectedTech}
              setSelectedTech={setSelectedTech}
              isLoading={isLoading}
              filteredProjects={filteredProjects}
            />
          )}
          {activeSection === 'skills' && <Skills isDarkTheme={isDarkTheme} />}
          {activeSection === 'contact' && (
            <Contact 
              isDarkTheme={isDarkTheme}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              submitStatus={submitStatus}
            />
          )}
          {activeSection === 'blog' && <BlogSection isDark={isDarkTheme} />}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;