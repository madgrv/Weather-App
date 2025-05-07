/**
 * Fetches sunrise and sunset times from the Sunrise-Sunset API
 * Returns times in UNIX timestamp format (seconds), adjusted to the location's timezone
 */
export const getSunTimes = async (lat: number, lng: number, timezoneOffset: number) => {
  try {
    // Get today's date in YYYY-MM-DD format for the location's timezone
    const now = new Date();
    const locationDate = new Date(now.getTime() + timezoneOffset * 1000);
    const dateStr = locationDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0&date=${dateStr}`
    );
    const { results } = await response.json();
    
    // Convert UTC times to UNIX timestamps and apply timezone offset
    const sunriseUTC = new Date(results.sunrise).getTime() / 1000;
    const sunsetUTC = new Date(results.sunset).getTime() / 1000;
    const sunrise = sunriseUTC + timezoneOffset;
    const sunset = sunsetUTC + timezoneOffset;
    
    // Validate and adjust times if needed
    const sunriseHour = new Date(sunrise * 1000).getUTCHours();
    const sunsetHour = new Date(sunset * 1000).getUTCHours();
    
    let adjustedSunrise = sunrise;
    let adjustedSunset = sunset;
    
    // If sunrise is after sunset, adjust to ensure logical sequence
    if ((sunriseHour > 12 && sunsetHour < 12) || sunsetHour < sunriseHour) {
      adjustedSunset = sunset + 86400; // Add 24 hours
    }
    
    return {
      sunrise: adjustedSunrise,
      sunset: adjustedSunset
    };
  } catch (error) {
    return null;
  }
};
