// This file centralizes environment variable access
// and provides fallbacks for development

// Create React App only exposes environment variables starting with REACT_APP_
// We're mapping our APP_ variables to be compatible
const config = {
  API_URL: process.env.REACT_APP_API_URL || process.env.APP_API_URL || 'https://api.openweathermap.org',
  API_KEY: process.env.REACT_APP_API_KEY || process.env.APP_API_KEY || '6f8ae8c028d2cc301f42425357121375',
};

export default config;
