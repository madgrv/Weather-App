// helpers.js
// Dummy comment to force rebuild - version 2
import config from './config';

export const APIKEY = config.API_KEY;

// function to create a flag emoji from ASCII
export function getFlagEmoji(countryCode) {
  const countryCodeUpperCase = countryCode.toUpperCase();
  const OFFSET = 127397;
  return countryCodeUpperCase
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + OFFSET))
    .join('');
}

// helper function to convert unix timestamp into time format (hh:mm)
export function convertTimestamp(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    // hour12: false,
  });
}

// Function to convert timezone data to UTC readable values
export function getTimezoneName(timezoneOffset) {
  // Adjust the timezone name based on the offset
  const hours = Math.floor(Math.abs(timezoneOffset) / 3600);
  const minutes = Math.abs(timezoneOffset % 3600) / 60;
  const sign = timezoneOffset >= 0 ? '+' : '-';
  const offsetString = `${sign}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  // return `UTC${offsetString}`;
  return offsetString;
}

// Function to get weather icon based on weather description or icon code
export function getWeatherIcon(iconOrDescription) {
  // If it's an icon code from the API (e.g., "01d", "02n", etc.)
  if (typeof iconOrDescription === 'string' && iconOrDescription.length <= 3) {
    return `https://openweathermap.org/img/wn/${iconOrDescription}@2x.png`;
  }

  // If it's a weather description, use emoji mapping
  const weatherIcons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Thunderstorm: '⛈️',
    Drizzle: '🌦️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Smoke: '🌫️',
    Tornado: '🌪️',
  };

  const condition = Object.keys(weatherIcons).find((key) =>
    iconOrDescription.toLowerCase().includes(key.toLowerCase())
  );

  return weatherIcons[condition] || '🌡️'; // Default to thermometer if no match
}
