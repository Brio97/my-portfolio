const fetch = require('node-fetch');

const handler = async (event) => {
  try {
    const { lat, lon } = JSON.parse(event.body);

    // First get location details from BigDataCloud API
    const locationResponse = await fetch(
      `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const locationData = await locationResponse.json();
    const city = locationData.city || locationData.locality || 'Unknown Location';

    // Then get weather data using the same coordinates
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.VITE_WEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        ...weatherData,
        city
      })
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

module.exports = handler;