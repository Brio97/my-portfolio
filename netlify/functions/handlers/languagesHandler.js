const fetch = require('node-fetch');

module.exports = async () => {
  try {
    const languagesUrl = `https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.VITE_GOOGLE_TRANSLATE_API_KEY}&target=en`;
    const languagesResponse = await fetch(languagesUrl);
    
    if (!languagesResponse.ok) {
      throw new Error(`Languages API responded with status: ${languagesResponse.status}`);
    }
    
    const languagesData = await languagesResponse.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(languagesData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};