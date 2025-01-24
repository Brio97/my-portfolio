const fetch = require('node-fetch');

const handler = async (event) => {
  const { lat, lon, q } = event.queryStringParameters;
  const API_KEY = process.env.VITE_WEATHER_API_KEY;
  
  let weatherUrl;
  if (lat && lon) {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q || 'Nairobi'}&appid=${API_KEY}&units=metric`;
  }

  const response = await fetch(weatherUrl);
  const data = await response.json();

  if (data.cod !== 200) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: data.message || 'Weather data not available'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      weather: data.weather,
      main: data.main,
      name: data.name
    })
  };
};

module.exports = handler;