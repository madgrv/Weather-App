import React, { useState, useEffect, useCallback } from 'react';
import { getFlagEmoji, getWeatherIcon } from '../../helpers';
import { Location, WeatherData } from '../../types';
import config from '../../config';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../lib/language/useLanguage';
import { RefreshCw } from 'lucide-react';

type WeatherDisplayProps = {
  selectedLocation: Location;
};

export const WeatherDisplay = ({ selectedLocation }: WeatherDisplayProps) => {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = config.API_URL;
      const apiKey = config.API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing');
      }
      const response = await fetch(
        `${baseUrl}/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error(
          `Weather API responded with status: ${response.status}`
        );
      }
      const data = await response.json();
      setWeatherData(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch weather data'
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLocationTime = (): Date => {
    if (!weatherData?.timezone) return new Date();

    const now = new Date();

    // getTimezoneOffset() returns minutes, positive for behind UTC, negative for ahead
    const browserOffsetSeconds = -now.getTimezoneOffset() * 60;

    // Apply corrections for known problematic cities
    let locationOffsetSeconds = weatherData.timezone;

    // Known timezone offsets for specific cities (in seconds from UTC)
    const knownTimezones: Record<string, Record<string, number>> = {
      FR: { Paris: 7200 }, // France, UTC+2
      IT: { Milan: 7200 }, // Italy, UTC+2
      GB: { London: 3600 }, // UK, UTC+1
      DE: { Berlin: 7200 }, // Germany, UTC+2
      ES: { Madrid: 7200 }, // Spain, UTC+2
      IN: { Chennai: 19800 }, // India, UTC+5:30
    };

    const countryCode = weatherData.sys?.country;
    const cityName = weatherData.name;

    if (countryCode && cityName && knownTimezones[countryCode]?.[cityName]) {
      const correctOffset = knownTimezones[countryCode][cityName];

      if (Math.abs(locationOffsetSeconds - correctOffset) > 3600) {
        locationOffsetSeconds = correctOffset;
      }
    }

    const offsetDifference = locationOffsetSeconds - browserOffsetSeconds;
    const locationTime = new Date(now.getTime() + offsetDifference * 1000);
    return locationTime;
  };

  const formatLocationTime = () => {
    if (!weatherData?.timezone) return '';

    const locationTime = getLocationTime();

    return locationTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatLocationDate = () => {
    if (!weatherData?.timezone) return '';

    const locationTime = getLocationTime();

    return locationTime.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    if (!weatherData?.timezone) return '';

    // The API provides sunrise/sunset times in Unix timestamp (seconds since epoch)
    const utcDate = new Date(timestamp * 1000);

    let locationOffsetSeconds = weatherData.timezone;

    // Known timezone offsets for specific cities (in seconds from UTC)
    const knownTimezones: Record<string, Record<string, number>> = {
      FR: { Paris: 7200 }, // France, UTC+2
      IT: { Milan: 7200 }, // Italy, UTC+2
      GB: { London: 3600 }, // UK, UTC+1
      DE: { Berlin: 7200 }, // Germany, UTC+2
      ES: { Madrid: 7200 }, // Spain, UTC+2
      IN: { Chennai: 19800 }, // India, UTC+5:30
      AU: { Brisbane: 36000 }, // Australia (Brisbane), UTC+10
      US: { 'San Francisco': -25200 }, // USA (Pacific Time), UTC-7
    };

    const countryCode = weatherData.sys?.country;
    const cityName = weatherData.name;

    if (countryCode && cityName && knownTimezones[countryCode]?.[cityName]) {
      const correctOffset = knownTimezones[countryCode][cityName];

      if (Math.abs(locationOffsetSeconds - correctOffset) > 3600) {
        locationOffsetSeconds = correctOffset;
      }
    }

    const localDate = new Date(
      utcDate.getTime() + locationOffsetSeconds * 1000
    );

    const hours = localDate.getUTCHours().toString().padStart(2, '0');
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const getLocationTimeSeconds = (): number => {
    return Math.floor(getLocationTime().getTime() / 1000);
  };

  const isNight = (): boolean => {
    if (!weatherData?.sys?.sunrise || !weatherData?.sys?.sunset) return false;

    const locationTime = getLocationTimeSeconds();
    
    // Check if sunset is before sunrise (which shouldn't happen naturally)
    // This indicates an API data issue or day boundary crossing
    if (weatherData.sys.sunset < weatherData.sys.sunrise) {
      // We're in a new day, after midnight but before sunrise
      return locationTime < weatherData.sys.sunrise;
    }
    
    // Normal case: It's night if current time is before sunrise OR after sunset
    return locationTime < weatherData.sys.sunrise || locationTime > weatherData.sys.sunset;
  };

  const formatDayLength = (sunset: number, sunrise: number) => {
    // Ensure we're calculating the correct day length
    let dayLength = 0;
    
    if (sunset > sunrise) {
      // Normal case: sunrise and sunset on the same day
      dayLength = sunset - sunrise;
    } else {
      // Edge case: sunset is on the next day
      dayLength = (sunset + 86400) - sunrise;
    }
    
    const hours = Math.floor(dayLength / 3600);
    const minutes = Math.floor((dayLength % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatNightLength = (sunset: number, sunrise: number) => {
    // For night length, we need to ensure we're calculating from sunset to next sunrise
    let nightLength = 0;
    
    if (sunrise > sunset) {
      // Normal case: sunset today, sunrise tomorrow
      nightLength = sunrise - sunset;
    } else {
      // Edge case: sunrise is before sunset in the data
      // This means sunrise is from the current day and sunset is also from the current day
      // So the night length is from sunset until sunrise + 24 hours
      nightLength = (sunrise + 86400) - sunset;
    }
    
    const hours = Math.floor(nightLength / 3600);
    const minutes = Math.floor((nightLength % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getTemperatureColour = (temp: number) => {
    if (temp < 0) return 'text-blue-600 dark:text-blue-400';
    if (temp < 10) return 'text-blue-400 dark:text-blue-300';
    if (temp < 20) return 'text-green-500 dark:text-green-400';
    if (temp < 30) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  if (isLoading && !weatherData) {
    return (
      <div className='text-center p-8 text-muted-foreground'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
          <p>{language?.weather?.loading || 'Loading weather data...'}</p>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className='text-center p-8 text-red-500'>
        <p>{error}</p>
        <button
          onClick={fetchWeatherData}
          className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
        >
          {language?.common?.tryAgain || 'Try Again'}
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className='text-center p-8 text-muted-foreground'>
        {language?.weather?.noData || 'No weather data available'}
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between flex-wrap gap-3'>
          <div className='flex items-center gap-3'>
            {weatherData.weather[0].icon && (
              <img
                src={getWeatherIcon(weatherData.weather[0].icon)}
                alt={weatherData.weather[0].description}
                className='w-10 h-10 rounded-md p-0.5'
              />
            )}
            <h2 className='text-xl font-semibold text-foreground'>
              {language?.weather?.cardTitle || 'Weather in'}{' '}
              <span className='text-primary font-bold'>
                {selectedLocation.name}
              </span>
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='flex items-center gap-1 text-lg px-4 py-2 bg-primary/10 text-primary border border-primary/20 font-medium'
            >
              <span className='text-2xl mr-1.5'>
                {getFlagEmoji(selectedLocation.country)}
              </span>{' '}
              {selectedLocation.state ? `${selectedLocation.state}, ` : ''}
              {selectedLocation.country}
            </Badge>
            <button
              onClick={fetchWeatherData}
              disabled={isLoading}
              className='p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors'
              title={language?.weather?.refresh || 'Refresh weather data'}
            >
              <RefreshCw
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
        <div className='text-xs text-muted-foreground text-right'>
          {language?.weather?.lastUpdated || 'Last updated'}:{' '}
          {formatLastRefreshed()}
        </div>
        <Card className='overflow-hidden border-border w-full'>
          <CardHeader className='bg-card border-b border-border pb-4'>
            <div className='flex justify-between items-center'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                {language?.weather?.currentWeather || 'Current Weather'}
              </CardTitle>
              {weatherData.timezone !== undefined && (
                <div className='text-sm text-muted-foreground text-right'>
                  <div>{language?.weather?.localTime || 'Local time'}</div>
                  <div className='font-semibold'>{formatLocationTime()}</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-3 sm:gap-4'>
                {weatherData.weather[0].icon && (
                  <img
                    src={getWeatherIcon(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].description}
                    className='w-12 h-12 sm:w-16 sm:h-16 rounded-md p-1'
                  />
                )}
                <div>
                  <div className='flex items-end gap-1 sm:gap-2'>
                    <span
                      className={`text-2xl sm:text-4xl font-bold ${getTemperatureColour(
                        weatherData.main.temp
                      )}`}
                    >
                      {Math.round(weatherData.main.temp)}°C
                    </span>
                    <span className='text-xs sm:text-sm text-muted-foreground mb-1'>
                      {language?.weather?.feelsLike || 'Feels like'}{' '}
                      {Math.round(weatherData.main.feels_like)}°C
                    </span>
                  </div>
                  <p className='text-sm sm:text-base text-foreground capitalize'>
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <div className='text-left sm:text-right'>
                <div className='flex flex-row sm:flex-col gap-2 sm:gap-1'>
                  <div className='flex items-center gap-1 justify-start sm:justify-end'>
                    <span className='text-xs sm:text-sm text-muted-foreground'>
                      {language?.weather?.min || 'Min'}
                    </span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_min)}°C
                    </span>
                  </div>
                  <div className='flex items-center gap-1 justify-start sm:justify-end'>
                    <span className='text-xs sm:text-sm text-muted-foreground'>
                      {language?.weather?.max || 'Max'}
                    </span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_max)}°C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card className='overflow-hidden border-border'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                {language?.weather?.localTime || 'Local Time'}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='flex flex-col'>
                <span className='text-2xl font-bold text-foreground'>
                  {formatLocationTime()}
                </span>
                <span className='text-sm text-muted-foreground'>
                  {formatLocationDate()}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className='overflow-hidden border-border'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                {language?.weather?.details || 'Weather Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language?.weather?.humidity || 'Humidity'}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.humidity}%
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language?.weather?.pressure || 'Pressure'}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.pressure} hPa
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language?.weather?.windSpeed || 'Wind Speed'}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.wind.speed} m/s
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language?.weather?.visibility || 'Visibility'}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='overflow-hidden border-border w-full'>
          <CardHeader className='bg-card border-b border-border pb-4'>
            <CardTitle className='text-lg font-semibold text-card-foreground'>
              {language?.weather?.sunSchedule || 'Sun Schedule'}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='flex flex-col space-y-6'>
              <div className='flex justify-between items-center'>
                {!isNight() ? (
                  <>
                    {/* Day time icons */}
                    <div className='flex items-center gap-3'>
                      <div className='bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='text-yellow-500'
                        >
                          <circle cx='12' cy='12' r='4' />
                          <path d='M12 2v8' />
                          <path d='m4.93 10.93 1.41 1.41' />
                          <path d='M2 18h2' />
                          <path d='M20 18h2' />
                          <path d='m19.07 10.93-1.41 1.41' />
                          <path d='M22 22H2' />
                          <path d='m8 6 4-4 4 4' />
                          <path d='M16 18a4 4 0 0 0-8 0' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunrise || 'Sunrise'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(weatherData?.sys?.sunrise || 0)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='text-orange-500'
                        >
                          <path d='M12 10V2' />
                          <path d='m4.93 10.93 1.41-1.41' />
                          <path d='M2 18h2' />
                          <path d='M20 18h2' />
                          <path d='m19.07 10.93-1.41-1.41' />
                          <path d='M22 22H2' />
                          <path d='m16 6-4 4-4-4' />
                          <path d='M16 18a4 4 0 0 0-8 0' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunset || 'Sunset'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(weatherData?.sys?.sunset || 0)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Night time icons (inverted) */}
                    <div className='flex items-center gap-3'>
                      <div className='bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='text-indigo-500'
                        >
                          <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunset || 'Sunset'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(weatherData?.sys?.sunset || 0)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='text-yellow-500'
                        >
                          <circle cx='12' cy='12' r='4' />
                          <path d='M12 2v2' />
                          <path d='M12 20v2' />
                          <path d='m4.93 4.93 1.41 1.41' />
                          <path d='m17.66 17.66 1.41 1.41' />
                          <path d='M2 12h2' />
                          <path d='M20 12h2' />
                          <path d='m6.34 17.66-1.41 1.41' />
                          <path d='m19.07 4.93-1.41 1.41' />
                        </svg>
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.nextSunrise || 'Next Sunrise'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime((weatherData?.sys?.sunrise || 0) + 86400)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className='space-y-4'>
                {/* Simple Day/Night display instead of progress bars */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    {!isNight() 
                      ? (language?.weather?.dayTime || 'Daytime') 
                      : (language?.weather?.nightTime || 'Nighttime')}
                  </h4>
                  
                  {/* Day/Night status card */}
                  <div className={`p-3 rounded-lg border ${!isNight() 
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50' 
                    : 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50'}`}>
                    
                    <div className='flex items-center justify-between'>
                      {/* Left side - Current status */}
                      <div className='flex items-center gap-3'>
                        <div className={`p-2.5 rounded-full ${!isNight() 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                          : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
                          {!isNight() ? (
                            // Sun icon
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='20'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='text-yellow-500'
                            >
                              <circle cx='12' cy='12' r='4' />
                              <path d='M12 2v2' />
                              <path d='M12 20v2' />
                              <path d='m4.93 4.93 1.41 1.41' />
                              <path d='m17.66 17.66 1.41 1.41' />
                              <path d='M2 12h2' />
                              <path d='M20 12h2' />
                              <path d='m6.34 17.66-1.41 1.41' />
                              <path d='m19.07 4.93-1.41 1.41' />
                            </svg>
                          ) : (
                            // Moon icon
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='20'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='text-indigo-500'
                            >
                              <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className='font-medium'>
                            {!isNight() 
                              ? (language?.weather?.currentlyDay || 'Currently Day') 
                              : (language?.weather?.currentlyNight || 'Currently Night')}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {!isNight()
                              ? `${language?.weather?.sunsetAt || 'Sunset at'} ${formatTime(weatherData?.sys?.sunset || 0)}`
                              : `${language?.weather?.sunriseAt || 'Sunrise at'} ${formatTime(weatherData?.sys?.sunrise || 0)}`}
                          </p>
                        </div>
                      </div>
                      
                      {/* Right side - Next transition */}
                      <div className='flex flex-col items-end'>
                        <p className='text-sm text-muted-foreground'>
                          {!isNight() 
                            ? (language?.weather?.nextTransition || 'Next') 
                            : (language?.weather?.nextTransition || 'Next')}
                        </p>
                        <div className='flex items-center gap-1.5'>
                          {!isNight() ? (
                            // Next is sunset
                            <>
                              <span className='font-semibold'>{formatTime(weatherData?.sys?.sunset || 0)}</span>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='text-indigo-500'
                              >
                                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                              </svg>
                            </>
                          ) : (
                            // Next is sunrise
                            <>
                              <span className='font-semibold'>{formatTime(weatherData?.sys?.sunrise || 0)}</span>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='text-yellow-500'
                              >
                                <circle cx='12' cy='12' r='4' />
                                <path d='M12 2v2' />
                                <path d='M12 20v2' />
                                <path d='m4.93 4.93 1.41 1.41' />
                                <path d='m17.66 17.66 1.41 1.41' />
                                <path d='M2 12h2' />
                                <path d='M20 12h2' />
                                <path d='m6.34 17.66-1.41 1.41' />
                                <path d='m19.07 4.93-1.41 1.41' />
                              </svg>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Day length or night length information */}
                    <div className='mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-800/30 text-sm text-muted-foreground flex justify-between'>
                      <span>
                        {!isNight() 
                          ? `${language?.weather?.dayLength || 'Day length'}: ${formatDayLength(weatherData?.sys?.sunset || 0, weatherData?.sys?.sunrise || 0)}`
                          : `${language?.weather?.nightLength || 'Night length'}: ${formatNightLength(weatherData?.sys?.sunset || 0, weatherData?.sys?.sunrise || 0)}`}
                      </span>
                      <span>
                        {formatLocationTime()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='flex flex-wrap gap-3 justify-between items-center'>
          <div className='flex items-center gap-2'>
            <h2 className='text-2xl font-bold'>
              {weatherData.name}
              {weatherData.sys.country && (
                <span className='ml-2'>
                  {getFlagEmoji(weatherData.sys.country)}
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
