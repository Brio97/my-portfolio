const fetch = require('node-fetch');

const handler = async () => {
  const MEDIUM_USERNAME = process.env.VITE_MEDIUM_USERNAME;
  const feedUrl = `https://medium.com/feed/${MEDIUM_USERNAME}`;
  
  try {
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
    const data = await response.json();

    const posts = data.items.map(post => ({
      id: post.guid,
      title: post.title,
      brief: post.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
      slug: post.guid.split('/').pop(),
      dateAdded: post.pubDate,
      coverImage: post.thumbnail,
      tags: post.categories.map(cat => ({ name: cat })),
      readTime: Math.ceil(post.content.split(' ').length / 200),
      platform: 'medium',
      url: post.link
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(posts)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify([])
    };
  }
};

module.exports = handler;