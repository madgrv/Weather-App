import React, { useState, useEffect } from 'react';
import { getFlagEmoji, getTimezoneName, getWeatherIcon } from '../../helpers';
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
      <div className='text-center p-8 text-slate-600'>
        Loading weather data...
      </div>
    );
  }

  // Helper function to determine temperature colour
  const getTemperatureColour = (temp: number) => {
    if (temp < 0) return 'text-blue-600';
    if (temp < 10) return 'text-blue-400';
    if (temp < 20) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-orange-500';
  };

  // Helper function to get header background colour based on temperature
  const getHeaderBackgroundColour = (temp: number) => {
    if (temp < 0) return 'bg-gradient-to-r from-blue-50 to-blue-100';
    if (temp < 10) return 'bg-gradient-to-r from-cyan-50 to-cyan-100';
    if (temp < 20) return 'bg-gradient-to-r from-emerald-50 to-emerald-100';
    if (temp < 30) return 'bg-gradient-to-r from-amber-50 to-amber-100';
    return 'bg-gradient-to-r from-orange-50 to-orange-100';
  };

  // Convert timestamp to local time for the city
  const convertToLocalTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const localDate = new Date(utcDate.getTime() + weatherData.timezone * 1000);

    return localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get humidity colour
  const getHumidityColour = (humidity: number) => {
    if (humidity < 30) return 'bg-yellow-500'; // Dry
    if (humidity < 60) return 'bg-green-500'; // Comfortable
    return 'bg-blue-500'; // Humid
  };

  return (
    <div className='p-6 border-t border-slate-200'>
      <div className='mb-6 flex flex-col items-center text-center gap-2'>
        <h2 className='text-xl font-semibold'>
          Weather for {selectedLocation.name}
          {selectedLocation.state && `, ${selectedLocation.state}`}
          {selectedLocation.country &&
            `, ${selectedLocation.country} ${getFlagEmoji(
              selectedLocation.country
            )}`}
        </h2>
        <Badge
          variant='secondary'
          className='text-lg px-5 py-2.5 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2'
        >
          <span className='text-2xl mr-1'>
            {getWeatherIcon(weatherData.weather[0].description)}
          </span>
          <span>{weatherData.weather[0].main}</span>
          <span className='text-sm text-slate-500 ml-1'>
            ({weatherData.weather[0].description})
          </span>
        </Badge>
      </div>

      <div className='grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>🌡️</span> Current Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Description:</span>
                <span className='font-medium text-slate-800'>
                  {weatherData.weather[0].description}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Visibility:</span>
                <span className='font-medium text-slate-800'>
                  {weatherData.visibility / 1000} km
                </span>
              </div>
              <div className='mt-3 text-center'>
                <span className='block text-center text-5xl'>
                  {getWeatherIcon(weatherData.weather[0].description)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>🌡️</span> Temperature
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Current:</span>
                <span
                  className={`font-bold ${getTemperatureColour(
                    weatherData.main.temp
                  )}`}
                >
                  {weatherData.main.temp.toFixed(1)}°C
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Feels like:</span>
                <span
                  className={`font-medium ${getTemperatureColour(
                    weatherData.main.feels_like
                  )}`}
                >
                  {weatherData.main.feels_like.toFixed(1)}°C
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Max:</span>
                <span
                  className={`font-medium ${getTemperatureColour(
                    weatherData.main.temp_max
                  )}`}
                >
                  {weatherData.main.temp_max.toFixed(1)}°C
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Min:</span>
                <span
                  className={`font-medium ${getTemperatureColour(
                    weatherData.main.temp_min
                  )}`}
                >
                  {weatherData.main.temp_min.toFixed(1)}°C
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>🕒</span> Local Time
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Current time:</span>
                <span className='font-medium text-slate-800'>
                  <DateDisplay UTC={weatherData.timezone} data={weatherData} />
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Timezone:</span>
                <span className='font-medium text-slate-800'>
                  UTC {weatherData.timezone > 0 ? '+' : ''}
                  {(weatherData.timezone / 3600).toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Region:</span>
                <span className='font-medium text-slate-800'>
                  {getTimezoneName(weatherData.timezone)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>🌅</span> Sun Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>
                  Sunrise (local):
                </span>
                <span className='font-medium text-slate-800 flex items-center gap-1'>
                  <span className='text-amber-500'>☀️</span>
                  {convertToLocalTime(weatherData.sys.sunrise)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>
                  Sunset (local):
                </span>
                <span className='font-medium text-slate-800 flex items-center gap-1'>
                  <span className='text-indigo-500'>🌙</span>
                  {convertToLocalTime(weatherData.sys.sunset)}
                </span>
              </div>
              <div className='mt-2 bg-gradient-to-r from-amber-100 via-orange-200 to-indigo-200 h-2 rounded-full'></div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>💨</span> Atmospheric Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Wind:</span>
                <span className='font-medium text-slate-800'>
                  {weatherData.wind.speed} m/s
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Pressure:</span>
                <span className='font-medium text-slate-800'>
                  {weatherData.main.pressure} hPa
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Humidity:</span>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-slate-800'>
                    {weatherData.main.humidity}%
                  </span>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${getHumidityColour(
                      weatherData.main.humidity
                    )}`}
                  ></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-slate-200 overflow-hidden'>
          <CardHeader
            className={`pb-2 ${getHeaderBackgroundColour(
              weatherData.main.temp
            )} border-b border-slate-200`}
          >
            <CardTitle className='text-base flex items-center gap-2'>
              <span className='text-lg'>📍</span> Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className='p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Timezone:</span>
                <span className='font-medium text-slate-800'>
                  {getTimezoneName(weatherData.timezone)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Coordinates:</span>
                <span className='font-medium text-slate-800'>
                  {selectedLocation.lat?.toFixed(2) || '0.00'}, {selectedLocation.lon?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Location:</span>
                <span className='font-medium text-slate-800 flex items-center gap-1'>
                  {selectedLocation.name}, {selectedLocation.country}{' '}
                  {getFlagEmoji(selectedLocation.country)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
