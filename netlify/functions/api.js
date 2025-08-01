const contactHandler = require('./handlers/contactHandler');
const weatherHandler = require('./handlers/weatherHandler');
const githubHandler = require('./handlers/githubHandler');
const locationHandler = require('./handlers/locationHandler');
const hashnodeHandler = require('./handlers/hashnodeHandler');
const mediumHandler = require('./handlers/mediumHandler');
const devtoHandler = require('./handlers/devtoHandler');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  const path = event.path.replace('/.netlify/functions/api/', '');

  try {
    let response;
    switch (path) {
      case 'contact':
        response = await contactHandler(event);
        break;
      case 'weather':
        response = await weatherHandler(event);
        break;
      case 'github':
        response = await githubHandler(event);
        break;
      case 'location':
        response = await locationHandler(event);
        break;
      case 'hashnode':
        response = await hashnodeHandler(event);
        break;
      case 'medium':
        response = await mediumHandler(event);
        break;
      case 'devto':
        response = await devtoHandler(event);
        break;
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not Found' })
        };
    }

    return {
      ...response,
      headers: { ...headers, ...response.headers }
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};