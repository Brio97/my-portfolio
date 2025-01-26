import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Contact = ({ isDarkTheme, formData, setFormData, handleSubmit, submitStatus }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-0"
    >
      <h2 data-translate className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
        Contact
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-4 sm:p-6`}>
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
        <div className={`${isDarkTheme ? 'bg-gray-800/50' : 'bg-white'} shadow-lg backdrop-blur-sm rounded-lg p-4 sm:p-6`}>
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
  );
};
