import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdUnit } from '../AdUnit';

export const BlogSection = ({ isDark }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const fetchBlogPosts = async () => {
    try {
      const [hashnodeResponse, mediumResponse, devToResponse] = await Promise.all([
        fetch('/.netlify/functions/api/hashnode'),
        fetch('/.netlify/functions/api/medium'),
        fetch('/.netlify/functions/api/devto')
      ]);
  
      const [hashnodePosts, mediumPosts, devToPosts] = await Promise.all([
        hashnodeResponse.ok ? hashnodeResponse.json() : [],
        mediumResponse.ok ? mediumResponse.json() : [],
        devToResponse.ok ? devToResponse.json() : []
      ]);
  
      // Combine all posts
      const allPosts = [
        ...(Array.isArray(hashnodePosts) ? hashnodePosts : []),
        ...(Array.isArray(mediumPosts) ? mediumPosts : []),
        ...(Array.isArray(devToPosts) ? devToPosts : [])
      ];
  
      // Filter out duplicates based on title
      const uniquePosts = allPosts.reduce((acc, current) => {
        const x = acc.find(item => item.title === current.title);
        if (!x) {
          return acc.concat([current]);
        }
        // If duplicate found, prefer Hashnode > Dev.to > Medium
        const index = acc.findIndex(item => item.title === current.title);
        if (current.platform === 'hashnode' || 
           (current.platform === 'devto' && acc[index].platform === 'medium')) {
          acc[index] = current;
        }
        return acc;
      }, []);
  
      // Sort by date
      const sortedPosts = uniquePosts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  
      setBlogPosts(sortedPosts);
      setError(null);
    } catch (error) {
      console.error('Error fetching blog posts:', error.message);
      setError(error.message);
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  };   

  useEffect(() => {
    fetchBlogPosts();
    const interval = setInterval(fetchBlogPosts, 300000);
    return () => clearInterval(interval);
  }, []);

  const handlePostClick = (post) => {
    window.open(post.url, '_blank');
  };

  const paginatedPosts = blogPosts.slice(0, page * postsPerPage);
  const hasMore = blogPosts.length > paginatedPosts.length;

  if (isLoading) {
    return (
      <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 data-translate className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Blog
      </h2>
      {blogPosts.length === 0 ? (
        <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No blog posts found
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handlePostClick(post)}
                className={`${
                  isDark ? 'bg-gray-800/50' : 'bg-white'
                } rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all`}
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 data-translate className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h3>
                  <span data-translate className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.readTime} min read
                  </span>
                </div>
                <p data-translate className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {post.brief}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-sm px-2 py-1 rounded-full ${
                          isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <time className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(post.dateAdded).toLocaleDateString()}
                  </time>
                </div>
              </motion.article>
              {index === 2 && <AdUnit />}
            </React.Fragment>
          ))}
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              className={`w-full py-2 rounded-lg ${
                isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
              } hover:opacity-80 transition-opacity`}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogSection;