import React, { useState, useEffect, useCallback } from 'react';
import { getFlagEmoji } from '../../helpers';
import { WeatherIcon } from '../ui/svgs';
import { Location, WeatherData } from '../../types';
import config from '../../config';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../lib/language/useLanguage';
import { RefreshCw } from 'lucide-react';
import { getSunTimes } from '../../lib/sunTimes';
import { SunriseIcon, SunsetIcon, MoonIcon } from '../ui/svgs';

type WeatherDisplayProps = {
  selectedLocation: Location;
};

export const WeatherDisplay = ({ selectedLocation }: WeatherDisplayProps) => {
  const { language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [sunTimes, setSunTimes] = useState<{
    sunrise: number;
    sunset: number;
  } | null>(null);

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

  useEffect(() => {
    if (weatherData?.coord && weatherData?.timezone) {
      getSunTimes(
        weatherData.coord.lat,
        weatherData.coord.lon,
        weatherData.timezone
      )
        .then((times) => {
          if (times) {
            setSunTimes(times);
          }
        })
        .catch((error) => {
          console.error('Error fetching sun times:', error);
        });
    }
  }, [weatherData?.coord, weatherData?.timezone]);

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

    const browserOffsetSeconds = -now.getTimezoneOffset() * 60;

    let locationOffsetSeconds = weatherData.timezone;

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

    const utcDate = new Date(timestamp * 1000);

    let locationOffsetSeconds = weatherData.timezone;

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
    if (!sunTimes?.sunrise || !sunTimes?.sunset) return false;

    const locationTime = getLocationTimeSeconds();

    if (sunTimes.sunset < sunTimes.sunrise) {
      return locationTime < sunTimes.sunrise;
    }

    return locationTime < sunTimes.sunrise || locationTime > sunTimes.sunset;
  };

  const formatDayLength = (sunset: number, sunrise: number) => {
    let dayLength = 0;

    if (sunset > sunrise) {
      dayLength = sunset - sunrise;
    } else {
      dayLength = sunset + 86400 - sunrise;
    }

    const hours = Math.floor(dayLength / 3600);
    const minutes = Math.floor((dayLength % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatNightLength = (sunset: number, sunrise: number) => {
    let nightLength = 0;

    if (sunrise > sunset) {
      nightLength = sunrise - sunset;
    } else {
      nightLength = sunrise + 86400 - sunset;
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
              <div className='w-10 h-10 flex items-center justify-center rounded-md p-0.5'>
                <WeatherIcon
                  iconCode={weatherData.weather[0].icon}
                  size={36}
                  alt={weatherData.weather[0].description}
                  className='text-primary'
                />
              </div>
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
                  <div className='w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-md p-1'>
                    <WeatherIcon
                      iconCode={weatherData.weather[0].icon}
                      size={48}
                      alt={weatherData.weather[0].description}
                      className='text-primary'
                    />
                  </div>
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
                    <div className='flex items-center gap-3'>
                      <div className='bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full'>
                        <SunriseIcon size={24} className='text-yellow-500' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunrise || 'Sunrise'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(sunTimes?.sunrise || 0)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full'>
                        <SunsetIcon size={24} className='text-orange-500' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunset || 'Sunset'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(sunTimes?.sunset || 0)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-center gap-3'>
                      <div className='bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full'>
                        <MoonIcon size={24} className='text-indigo-500' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.sunset || 'Sunset'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime(sunTimes?.sunset || 0)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className='bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full'>
                        <SunriseIcon size={24} className='text-yellow-500' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          {language?.weather?.nextSunrise || 'Next Sunrise'}
                        </p>
                        <p className='text-lg font-semibold'>
                          {formatTime((sunTimes?.sunrise || 0) + 86400)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className='space-y-4'>
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    {!isNight()
                      ? language?.weather?.dayTime || 'Daytime'
                      : language?.weather?.nightTime || 'Nighttime'}
                  </h4>
                  <div
                    className={`p-3 rounded-lg border ${
                      !isNight()
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                        : 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2.5 rounded-full ${
                            !isNight()
                              ? 'bg-yellow-100 dark:bg-yellow-900/30'
                              : 'bg-indigo-100 dark:bg-indigo-900/30'
                          }`}
                        >
                          {!isNight() ? (
                            <SunriseIcon
                              size={20}
                              className='text-yellow-500'
                            />
                          ) : (
                            <MoonIcon size={20} className='text-indigo-500' />
                          )}
                        </div>
                        <div>
                          <p className='font-medium'>
                            {!isNight()
                              ? language?.weather?.currentlyDay ||
                                'Currently Day'
                              : language?.weather?.currentlyNight ||
                                'Currently Night'}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {!isNight()
                              ? `${
                                  language?.weather?.sunsetAt || 'Sunset at'
                                } ${formatTime(sunTimes?.sunset || 0)}`
                              : `${
                                  language?.weather?.sunriseAt || 'Sunrise at'
                                } ${formatTime(sunTimes?.sunrise || 0)}`}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col items-end'>
                        <p className='text-sm text-muted-foreground'>
                          {!isNight()
                            ? language?.weather?.nextTransition || 'Next'
                            : language?.weather?.nextTransition || 'Next'}
                        </p>
                        <div className='flex items-center gap-1.5'>
                          {!isNight() ? (
                            <>
                              <span className='font-semibold'>
                                {formatTime(sunTimes?.sunset || 0)}
                              </span>
                              <SunsetIcon
                                size={20}
                                className='text-orange-500'
                              />
                            </>
                          ) : (
                            <>
                              <span className='font-semibold'>
                                {formatTime(sunTimes?.sunrise || 0)}
                              </span>
                              <SunriseIcon
                                size={20}
                                className='text-yellow-500'
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-800/30'>
                      <div className='flex flex-col gap-1'>
                        <div className='text-[10px] xs:text-xs text-muted-foreground'>
                          {!isNight()
                            ? language?.weather?.dayLength || 'Day length'
                            : language?.weather?.nightLength || 'Night length'}
                        </div>
                        <div className='text-xs xs:text-sm font-medium'>
                          {!isNight()
                            ? formatDayLength(
                                sunTimes?.sunset || 0,
                                sunTimes?.sunrise || 0
                              )
                            : formatNightLength(
                                sunTimes?.sunset || 0,
                                sunTimes?.sunrise || 0
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='flex flex-wrap gap-3 justify-between items-center'></div>
      </div>
    </div>
  );
};
