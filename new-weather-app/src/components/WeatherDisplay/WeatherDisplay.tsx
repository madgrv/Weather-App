import React, { useState, useEffect } from 'react';
import { getFlagEmoji, getWeatherIcon } from '../../helpers';
import { Location, WeatherData } from '../../types';
import { DateDisplay } from '../DateDisplay';
import config from '../../config';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import language from '../../lib/language';

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
        {language.weather.loading}
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
              {language.weather.cardTitle}{' '}
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
        <Card className='overflow-hidden border-border'>
          <CardHeader className='bg-card border-b border-border pb-4'>
            <CardTitle className='text-lg font-semibold text-card-foreground'>
              {language.weather.currentTemp}
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
                      {language.weather.feelsLike} {Math.round(weatherData.main.feels_like)}°C
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
                    <span className='text-xs sm:text-sm text-muted-foreground'>{language.weather.min}</span>
                    <span className='font-semibold text-foreground'>
                      {Math.round(weatherData.main.temp_min)}°C
                    </span>
                  </div>
                  <div className='flex items-center gap-1 justify-start sm:justify-end'>
                    <span className='text-xs sm:text-sm text-muted-foreground'>{language.weather.max}</span>
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
                {language.weather.localTime}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <DateDisplay UTC={weatherData.timezone} data={weatherData} />
            </CardContent>
          </Card>
          <Card className='overflow-hidden border-border'>
            <CardHeader className='bg-card border-b border-border pb-4'>
              <CardTitle className='text-lg font-semibold text-card-foreground'>
                {language.weather.details}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language.weather.humidity}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.humidity}%
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language.weather.pressure}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.main.pressure} hPa
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language.weather.windSpeed}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {weatherData.wind.speed} m/s
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm text-muted-foreground'>
                    {language.weather.visibility}
                  </span>
                  <span className='text-lg font-semibold text-foreground'>
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
