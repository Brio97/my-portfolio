import React from 'react';
import { Github, Mail, Linkedin } from 'lucide-react';

export const Home = () => {
  return (
    <div className="text-center mt-24">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Brian Mutai
      </h1>
      <h2 className="text-2xl text-gray-400 mb-6">
        Full Stack Developer | Insurance Risk Analyst
      </h2>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
        Bridging the gap between insurance industry expertise and modern software development
      </p>
      <div className="flex justify-center space-x-6">
        <a href="https://github.com/Brio97" target="_blank" rel="noopener noreferrer">
          <Github size={24} className="text-gray-400 hover:text-white cursor-pointer" />
        </a>
        <a href="mailto:Mutai.brian79@gmail.com">
          <Mail size={24} className="text-gray-400 hover:text-white cursor-pointer" />
        </a>
        <a href="https://www.linkedin.com/in/brian-mutai-158397202" target="_blank" rel="noopener noreferrer">
          <Linkedin size={24} className="text-gray-400 hover:text-white cursor-pointer" />
        </a>
      </div>
    </div>
  );
};
