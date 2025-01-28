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
                  responseCount
                }
              }
            }
          }
        }
      }
    }
  }`;


  try {
    console.log('Sending request with:', {
      url: HASHNODE_API,
      token: HASHNODE_TOKEN ? 'Present' : 'Missing',
      username: HASHNODE_USERNAME
    });

    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HASHNODE_TOKEN}`,
        'User-Agent': 'Netlify Function Hashnode Blog Fetcher'
      },
      body: JSON.stringify({ 
        query,
        variables: {} 
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

module.exports = handler;