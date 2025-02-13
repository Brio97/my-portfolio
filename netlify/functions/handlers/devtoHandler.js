const fetch = require('node-fetch');

const handler = async () => {
  const DEVTO_API_KEY = process.env.VITE_DEVTO_API_KEY;
  const DEVTO_USERNAME = process.env.VITE_DEVTO_USERNAME;
  
  try {
    // Log environment variables (for debugging)
    console.log('Dev.to API Request:', {
      username: DEVTO_USERNAME,
      hasApiKey: !!DEVTO_API_KEY
    });

    const response = await fetch(`https://dev.to/api/articles/me/published`, {
      headers: {
        'api-key': DEVTO_API_KEY,
        'Accept': 'application/vnd.forem.api-v1+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Dev.to API responded with status: ${response.status}`);
    }

    const articles = await response.json();
    
    const posts = articles.map(post => ({
      id: post.id.toString(),
      title: post.title,
      brief: post.description || post.title,
      slug: post.slug,
      dateAdded: post.published_at,
      coverImage: post.cover_image || null,
      tags: post.tag_list.map(tag => ({ name: tag })),
      readTime: post.reading_time_minutes || 5,
      platform: 'devto',
      url: post.url
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(posts)
    };
  } catch (error) {
    console.error('Dev.to API Error:', error);
    return {
      statusCode: 200, // Return 200 with empty array instead of 500
      body: JSON.stringify([])
    };
  }
};

module.exports = handler;