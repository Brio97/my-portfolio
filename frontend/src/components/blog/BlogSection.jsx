import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdUnit } from '../AdUnit';

export const BlogSection = ({ isDark }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogPosts = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/.netlify/functions/api/hashnode?t=${timestamp}`);
      const result = await response.json();

      // Log the full response for debugging
      // console.log('Full API Response:', result);

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Check for GraphQL errors
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Verify and extract posts
      let posts = [];
      if (result.data?.user?.publications?.edges?.length > 0) {
        posts = result.data.user.publications.edges[0].node.posts.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          brief: edge.node.brief,
          slug: edge.node.slug,
          dateAdded: edge.node.publishedAt,
          coverImage: edge.node.coverImage?.url || null, // Extract URL from coverImage
          tags: edge.node.tags,
          readTime: edge.node.readTimeInMinutes
        }));
      }

      if (posts.length === 0) {
        throw new Error('No posts found');
      }

      setBlogPosts(posts);
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

  const handlePostClick = (slug) => {
    window.open(`https://moderndevspace.hashnode.dev/${slug}`, '_blank');
  };     

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
    <div key={Date.now()} className="max-w-4xl mx-auto">
      <h2 data-translate className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Blog
      </h2>
      {blogPosts.length === 0 ? (
        <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No blog posts found
        </div>
      ) : (
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handlePostClick(post.slug)}
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
          ))}
          <AdUnit />
        </div>
      )}
    </div>
  );
};

export default BlogSection;