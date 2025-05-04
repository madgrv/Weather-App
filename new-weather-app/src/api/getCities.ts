import { Location } from '../types';

// Cache for storing fetched cities
const cityCache: Record<string, { data: Location[]; timestamp: number }> = {};
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// List of popular cities to provide initial suggestions
const popularCities = [
  'London',
  'Paris',
  'New York',
  'Tokyo',
  'Sydney',
  'Berlin',
  'Rome',
  'Milan',
  'Barcelona',
  'Valencia',
  'Torino',
  'Genoa',
  'Bologna',
  'Florence',
  'Naples',
  'Palermo',
  'Catania',
  'Bari',
  'Genoa',
  'Aosta',
  'Bologna',
  'Florence',
  'Naples',
  'Palermo',
  'Catania',
  'Bari',
  'Bologna',
  'Florence',
  'Naples',
  'Palermo',
  'Catania',
  'Bari',
  'Madrid',
  'Amsterdam',
  'Toronto',
  'Singapore',
  'Dubai',
  'Hong Kong',
  'Barcelona',
  'San Francisco',
  'Mumbai',
  'Cairo',
  'Rio de Janeiro',
  'Moscow',
  'Seoul',
  'Bangkok',
  'Istanbul',
  'Vienna',
  'Prague',
  'Budapest',
];

/**
 * Fetches location data for a city and caches the results
 */
export const fetchCityData = async (
  cityName: string,
  apiKey: string
): Promise<Location[]> => {
  // Normalize the city name for caching (lowercase, trim)
  const normalizedCityName = cityName.toLowerCase().trim();

  // Check if we have a valid cached result
  const cachedResult = cityCache[normalizedCityName];
  const currentTime = Date.now();

  if (cachedResult && currentTime - cachedResult.timestamp < CACHE_DURATION) {
    return cachedResult.data;
  }

  try {
    const baseUrl =
      process.env.REACT_APP_API_URL || 'https://api.openweathermap.org';
    const response = await fetch(
      `${baseUrl}/geo/1.0/direct?q=${encodeURIComponent(
        normalizedCityName
      )}&limit=5&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    cityCache[normalizedCityName] = {
      data,
      timestamp: currentTime,
    };

    return data;
  } catch (error) {
    console.error(`Error fetching data for city "${cityName}":`, error);

    // If we have a cached result, even if expired, return it as fallback
    if (cachedResult) {
      return cachedResult.data;
    }

    // Otherwise return empty array
    return [];
  }
};

/**
 * Gets suggestions based on user input, using cached data when available
 */
export const getCitySuggestions = async (
  userInput: string,
  apiKey: string
): Promise<Location[]> => {
  if (!userInput || userInput.length < 2) return [];

  // Try to get exact match from cache first
  const normalizedInput = userInput.toLowerCase().trim();
  const exactMatch = cityCache[normalizedInput];

  if (exactMatch) {
    return exactMatch.data;
  }

  // Look for partial matches in cache
  const partialMatches: Location[] = [];
  Object.keys(cityCache).forEach((key) => {
    if (key.includes(normalizedInput)) {
      partialMatches.push(...cityCache[key].data);
    }
  });

  // If we have partial matches, return them
  if (partialMatches.length > 0) {
    return partialMatches.slice(0, 5); // Limit to 5 results
  }

  // If no matches in cache, fetch from API
  return fetchCityData(userInput, apiKey);
};

/**
 * Preloads popular cities into the cache
 */
export const preloadPopularCities = async (apiKey: string): Promise<void> => {
  const promises = popularCities.map((city) => fetchCityData(city, apiKey));
  await Promise.all(promises);
  console.log('Popular cities preloaded into cache');
};
