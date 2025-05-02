import React, { useState, useEffect } from 'react';
import { getFlagEmoji, getWeatherIcon } from '../../helpers';
import { Location, WeatherData } from '../../types';
import { DateDisplay } from '../DateDisplay';
import config from '../../config';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

type WeatherDisplayProps = {
  selectedLocation: Location;
};

export const WeatherDisplay = ({ selectedLocation }: WeatherDisplayProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const baseUrl = config.API_URL;
        const apiKey = config.API_KEY;

        if (!apiKey) {
          console.error('API key is missing');
          return;
        }

        const response = await fetch(
          `${baseUrl}/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [selectedLocation]);

  if (!weatherData) {
    return (
      <div className='text-center p-8 text-muted-foreground'>
        Loading weather data...
      </div>
    );
  }

  // Helper function to determine temperature colour
  const getTemperatureColour = (temp: number) => {
    if (temp < 0) return 'text-blue-600 dark:text-blue-400';
    if (temp < 10) return 'text-blue-400 dark:text-blue-300';
    if (temp < 20) return 'text-green-500 dark:text-green-400';
    if (temp < 30) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

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
              Weather for{' '}
              <span className='text-primary font-bold'>
                {selectedLocation.name}
              </span>
            </h2>
          </div>
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
        </div>

        {/* Temperature Card - Full width on all screens */}
        <Card className='overflow-hidden border-border'>
          <CardHeader className='bg-card border-b border-border pb-4'>
            <CardTitle className='text-lg font-semibold text-card-foreground'>
              Current Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {weatherData.weather[0].icon && (
                  <img
                    src={getWeatherIcon(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].description}
                    className='w-16 h-16 rounded-md p-1'
                  />
                )}
                <div>
                  <div className='flex items-end gap-2'>
                    <span
                      className={`text-4xl font-bold ${getTemperatureColour(
                        weatherData.main.temp
                      )}`}
                    >
                      {Math.round(weatherData.main.temp)}°C
                    </span>
                    <span className='text-sm text-muted-foreground mb-1'>
                      Feels like {Math.round(weatherData.main.feels_like)}°C
                    </span>
                  </div>
                  <p className='text-foreground capitalize'>
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center justify-end gap-1'>
                    <span className='text-muted-foreground'>Min:</span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_min)}°C
                    </span>
                  </div>
                  <div className='flex items-center justify-end gap-1'>
                    <span className='text-muted-foreground'>Max:</span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_max)}°C
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two column grid for the remaining cards on larger screens */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Local Time Card */}
          <Card className='overflow-hidden border-border'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                Local Time
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <DateDisplay UTC={weatherData.timezone} data={weatherData} />
            </CardContent>
          </Card>

          {/* Weather Details Card */}
          <Card className='overflow-hidden border-border'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                Weather Details
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    Humidity
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.humidity}%
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    Pressure
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.pressure} hPa
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    Wind Speed
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.wind.speed} m/s
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    Visibility
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sun Schedule Card - Full width on small screens, half width on larger screens */}
          <Card className='overflow-hidden border-border md:col-span-2'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                Sun Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='grid grid-cols-1 sm:grid-cols-2'>
                <div className='p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 flex items-center justify-between'>
                  <div>
                    <div className='text-sm text-amber-600 dark:text-amber-400'>
                      Sunrise
                    </div>
                    <div className='text-lg font-semibold text-amber-700 dark:text-amber-300'>
                      {new Date(
                        (weatherData.sys.sunrise + weatherData.timezone) * 1000
                      ).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8 text-amber-500 dark:text-amber-400'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
                    />
                  </svg>
                </div>
                <div className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-between'>
                  <div>
                    <div className='text-sm text-blue-600 dark:text-blue-400'>
                      Sunset
                    </div>
                    <div className='text-lg font-semibold text-blue-700 dark:text-blue-300'>
                      {new Date(
                        (weatherData.sys.sunset + weatherData.timezone) * 1000
                      ).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-8 h-8 text-blue-500 dark:text-blue-400'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z'
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
