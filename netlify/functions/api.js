const contactHandler = require('./handlers/contactHandler');
const translateHandler = require('./handlers/translateHandler');
const languagesHandler = require('./handlers/languagesHandler').default;
const weatherHandler = require('./handlers/weatherHandler');
const githubHandler = require('./handlers/githubHandler');
const locationHandler = require('./handlers/locationHandler');

exports.handler = async (event) => {
  const fullPath = event.path.replace('/.netlify/functions/api/', '');

  try {
    switch (fullPath) {
      case 'contact':
        return await contactHandler(event);
      case 'translate':
        return await translateHandler(event);
      case 'translate/languages':
        return await languagesHandler(event);
      case 'weather':
        return await weatherHandler(event);
      case 'github':
        return await githubHandler(event);
      case 'location':
        return await locationHandler(event);
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not Found', path: fullPath })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};