import React from 'react';
import { motion } from 'framer-motion';

export const BlogSection = ({ isDark }) => {
  const blogPosts = [
    {
      title: "Building Secure Insurance Systems",
      date: "2024-03-15",
      excerpt: "Best practices for implementing secure insurance platforms using modern tech stacks",
      tags: ["Security", "Insurance", "Development"],
      readTime: "5 min"
    },
    {
      title: "From Insurance to Tech: My Journey",
      date: "2024-03-01",
      excerpt: "How I transitioned from insurance risk analysis to full-stack development",
      tags: ["Career", "Development", "Insurance"],
      readTime: "4 min"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 data-translate className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog</h2>
      <div className="space-y-6">
        {blogPosts.map((post, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 data-translate className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
              <span data-translate className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{post.readTime}</span>
            </div>
            <p data-translate className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    data-translate
                    key={i}
                    className={`text-sm px-2 py-1 rounded-full ${
                      isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <time data-translate className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{post.date}</time>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};