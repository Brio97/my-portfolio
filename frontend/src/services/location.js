export const getLocationDetails = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api-bdc.io/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();
    return {
      lat: lat,
      lon: lon,
      city: data.city || data.locality || 'Unknown Location'
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};  