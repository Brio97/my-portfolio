import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdUnit } from '../AdUnit';

const BlogPostCard = React.memo(({ post, isDark, onClick }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    className={`${
      isDark ? 'bg-gray-800/50' : 'bg-white'
    } rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all`}
  >
    {post.coverImage && (
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
        loading="lazy"
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
        {formatDate(post.dateAdded)}
      </time>
    </div>
  </motion.article>
));

const BlogSkeleton = ({ isDark }) => (
  <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} rounded-lg p-6 animate-pulse`}>
    <div className="h-48 bg-gray-300 rounded-lg mb-4" />
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-300 w-3/4 rounded" />
      <div className="h-4 bg-gray-300 w-1/4 rounded" />
    </div>
    <div className="h-20 bg-gray-300 rounded mb-4" />
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-300 rounded-full" />
        <div className="h-6 w-16 bg-gray-300 rounded-full" />
      </div>
      <div className="h-4 w-24 bg-gray-300 rounded" />
    </div>
  </div>
);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const BlogSection = ({ isDark }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  const fetchBlogPosts = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/.netlify/functions/api/hashnode?t=${timestamp}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      let posts = [];
      if (result.data?.user?.publications?.edges?.length > 0) {
        posts = result.data.user.publications.edges[0].node.posts.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          brief: edge.node.brief,
          slug: edge.node.slug,
          dateAdded: edge.node.publishedAt,
          coverImage: edge.node.coverImage?.url || null,
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

  const paginatedPosts = blogPosts.slice(0, page * postsPerPage);
  const hasMore = blogPosts.length > paginatedPosts.length;

  return (
    <div key={Date.now()} className="max-w-4xl mx-auto">
      <h2 data-translate className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Blog
      </h2>
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <BlogSkeleton key={i} isDark={isDark} />
          ))}
        </div>
      ) : error ? (
        <div className={`text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          Error: {error}
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <BlogPostCard
                post={post}
                isDark={isDark}
                onClick={() => handlePostClick(post.slug)}
              />
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