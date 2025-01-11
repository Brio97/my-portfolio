import React, { useState, useEffect } from 'react';
import { Terminal, Code, Box, Home as HomeIcon, Mail, Github, Linkedin } from 'lucide-react';
import { ParticleField } from './ParticleField';
import { TerminalWindow } from './TerminalWindow';
import { ProjectCard } from './ProjectCard';
import { Home } from './sections/Home';
import { skills, experience, education } from '../data/portfolioData';
import { fetchGithubRepos } from '../services/githubService';

export const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showTerminal, setShowTerminal] = useState(false);
  const [githubProjects, setGithubProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const handleCommand = (command) => {
    switch(command) {
      case 'home':
      case 'about':
      case 'experience':
      case 'education':
      case 'projects':
      case 'skills':
      case 'contact':
        setActiveSection(command);
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
        setSubmitStatus('Thank you for your message! We will respond to your email within 24 hours.');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      setSubmitStatus('Message could not be sent. Please try again.');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };       

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white relative overflow-x-hidden">
      <ParticleField />
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 
              onClick={() => setActiveSection('home')}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
            >
              Brian Mutai
            </h1>
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveSection('home')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Home"
              >
                <HomeIcon size={20} />
              </button>
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Open Terminal"
              >
                <Terminal size={20} />
              </button>
              <button
                onClick={() => setActiveSection('projects')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Projects"
              >
                <Code size={20} />
              </button>
              <button
                onClick={() => setActiveSection('skills')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Skills"
              >
                <Box size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative pt-20 min-h-screen w-full">
        {showTerminal && (
          <div className="fixed top-24 right-4 w-96 max-w-[90vw] z-50">
            <TerminalWindow onCommand={handleCommand} />
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeSection === 'home' && <Home />}

          {activeSection === 'about' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">About Me</h2>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <p className="text-gray-400 leading-relaxed">
                  I'm a Full Stack Developer with a strong background in Insurance Risk Analysis. My unique blend of technical skills and insurance industry expertise allows me to create innovative solutions that bridge both worlds.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Experience</h2>
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-xl font-bold text-blue-400">{job.title}</h3>
                    <p className="text-gray-400 mb-4">{job.company} • {job.period}</p>
                    <ul className="space-y-2">
                      {job.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Education</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-400">{edu.degree}</h3>
                    <p className="text-gray-400">{edu.school}</p>
                    <p className="text-gray-500">{edu.period} • {edu.location}</p>
                    {edu.gpa && <p className="text-gray-400 mt-2">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Projects</h2>
              {isLoading ? (
                <div className="text-center text-gray-400">Loading projects...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {githubProjects.map((project, index) => (
                    <ProjectCard key={project.id || index} project={project} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Skills</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Contact</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-700/50 rounded p-2"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-700/50 rounded p-2"
                      required
                    />
                    <textarea
                      placeholder="Message"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-700/50 rounded p-2 h-32"
                      required
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                      Send Message
                    </button>
                    {submitStatus && (
                      <div className="mt-4 p-4 bg-green-500/20 text-green-300 rounded-lg">
                        {submitStatus}
                      </div>
                    )}
                  </form>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-400">
                      <Mail className="mr-2" /> Email: Mutai.brian79@gmail.com
                    </p>
                    <p className="flex items-center text-gray-400">
                      <Linkedin className="mr-2" /> LinkedIn: brian-mutai-158397202
                    </p>
                    <p className="flex items-center text-gray-400">
                      <Github className="mr-2" /> GitHub: Brio97
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};