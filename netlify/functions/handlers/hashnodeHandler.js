const fetch = require('node-fetch');

const handler = async () => {
  const HASHNODE_API = 'https://gql.hashnode.com';
  const HASHNODE_TOKEN = process.env.VITE_HASHNODE_TOKEN;
  const HASHNODE_USERNAME = process.env.VITE_HASHNODE_USERNAME;
  
  const query = `
  {
    user(username: "${HASHNODE_USERNAME}") {
      publications(first: 1) {
        edges {
          node {
            posts(first: 10) {
              edges {
                node {
                  id
                  title
                  brief
                  slug
                  publishedAt
                  coverImage {
                    url
                  }
                  tags {
                    name
                  }
                  readTimeInMinutes
                }
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HASHNODE_TOKEN}`,
        'User-Agent': 'Netlify Function Hashnode Blog Fetcher'
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    // Transform posts to normalized format
    const posts = result.data?.user?.publications?.edges?.[0]?.node?.posts?.edges?.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      brief: edge.node.brief,
      slug: edge.node.slug,
      dateAdded: edge.node.publishedAt,
      coverImage: edge.node.coverImage?.url || null,
      tags: edge.node.tags || [],
      readTime: edge.node.readTimeInMinutes,
      platform: 'hashnode',
      url: `https://moderndevspace.hashnode.dev/${edge.node.slug}`
    })) || [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(posts)
    };    
  } catch (error) {
    console.error('Fetch Error:', error);
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
