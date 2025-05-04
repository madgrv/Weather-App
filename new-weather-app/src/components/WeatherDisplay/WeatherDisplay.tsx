import React, { useState, useEffect, useCallback } from 'react';
import { getFlagEmoji, getWeatherIcon } from '../../helpers';
import { Location, WeatherData } from '../../types';
import { DateDisplay } from '../DateDisplay';
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

  // Extract fetch logic into a reusable function
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
        throw new Error(`Weather API responded with status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  // Fetch weather data when location changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Format the last refreshed time
  const formatLastRefreshed = () => {
    return lastRefreshed.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (isLoading && !weatherData) {
    return (
      <div className='text-center p-8 text-muted-foreground'>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
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
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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

  const getTemperatureColour = (temp: number) => {
    if (temp < 0) return 'text-blue-600 dark:text-blue-400';
    if (temp < 10) return 'text-blue-400 dark:text-blue-300';
    if (temp < 20) return 'text-green-500 dark:text-green-400';
    if (temp < 30) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  // Format time from Unix timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate the percentage of daylight that has passed
  function calculateDayProgress(sunrise: number, sunset: number): number {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const dayLength = sunset - sunrise; // Total length of day in seconds
    
    if (now < sunrise) return 0; // Before sunrise
    if (now > sunset) return 100; // After sunset
    
    const dayProgress = ((now - sunrise) / dayLength) * 100;
    return Math.min(Math.max(dayProgress, 0), 100); // Ensure it's between 0-100
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
          <div className="flex items-center gap-2">
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
              className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              title={language?.weather?.refresh || 'Refresh weather data'}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {language?.weather?.lastUpdated || 'Last updated'}: {formatLastRefreshed()}
        </div>
        <Card className='overflow-hidden border-border'>
          <CardHeader className='bg-card border-b border-border pb-4'>
            <CardTitle className='text-lg font-semibold text-card-foreground'>
              {language?.weather?.currentTemp || 'Current Temperature'}
            </CardTitle>
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
                      {language?.weather?.feelsLike || 'Feels like'} {Math.round(weatherData.main.feels_like)}°C
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
                    <span className='text-xs sm:text-sm text-muted-foreground'>{language?.weather?.min || 'Min'}</span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_min)}°C
                    </span>
                  </div>
                  <div className='flex items-center gap-1 justify-start sm:justify-end'>
                    <span className='text-xs sm:text-sm text-muted-foreground'>{language?.weather?.max || 'Max'}</span>
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
              <DateDisplay UTC={weatherData.timezone} data={weatherData} />
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
                      <path d='M12 2v8'/>
                      <path d='m4.93 10.93 1.41 1.41'/>
                      <path d='M2 18h2'/>
                      <path d='M20 18h2'/>
                      <path d='m19.07 10.93-1.41 1.41'/>
                      <path d='M22 22H2'/>
                      <path d='m8 6 4-4 4 4'/>
                      <path d='M16 18a4 4 0 0 0-8 0'/>
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      {language?.weather?.sunrise || 'Sunrise'}
                    </p>
                    <p className='text-lg font-semibold'>
                      {formatTime(weatherData.sys.sunrise)}
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
                      <path d='M12 10V2'/>
                      <path d='m4.93 10.93 1.41-1.41'/>
                      <path d='M2 18h2'/>
                      <path d='M20 18h2'/>
                      <path d='m19.07 10.93-1.41-1.41'/>
                      <path d='M22 22H2'/>
                      <path d='m16 6-4 4-4-4'/>
                      <path d='M16 18a4 4 0 0 0-8 0'/>
                    </svg>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      {language?.weather?.sunset || 'Sunset'}
                    </p>
                    <p className='text-lg font-semibold'>
                      {formatTime(weatherData.sys.sunset)}
                    </p>
                  </div>
                </div>
              </div>
              <div className='relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div 
                  className='absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400'
                  style={{
                    width: `${calculateDayProgress(weatherData.sys.sunrise, weatherData.sys.sunset)}%`
                  }}
                ></div>
              </div>
              <div className='flex justify-between text-xs text-muted-foreground'>
                <span>{formatTime(weatherData.sys.sunrise)}</span>
                <span>{formatTime(weatherData.sys.sunset)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
