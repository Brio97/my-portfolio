const fetch = require('node-fetch');

module.exports = async (event) => {
  const { q, target } = JSON.parse(event.body);
  const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${process.env.VITE_GOOGLE_TRANSLATE_API_KEY}`;
  const translateResponse = await fetch(translateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, target })
  });
  const translateData = await translateResponse.json();
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(translateData)
  };
};