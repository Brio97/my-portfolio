const handler = async (event) => {
    const { lat, lon } = JSON.parse(event.body);
    
    try {
      const response = await fetch(
        `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          lat,
          lon,
          city: data.city || data.locality || 'Unknown Location'
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };
  
  module.exports = handler;  