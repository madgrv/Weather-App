import React, { useState, useEffect } from 'react';
import { DateDisplay } from './DateDisplay';
import SearchInput from './ui/SearchInput';
import { WeatherDisplay } from './WeatherDisplay';
import { Location } from '../types';
import { getLocation } from '../api/getLocation';
import config from '../config';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { ThemeToggle } from './ui/theme-toggle';
import { useLanguage } from '../lib/language/useLanguage';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export const AppLayout = () => {
  // Use the language hook to get access to the language module
  const { language } = useLanguage();
  
  const [userInput, setUserInput] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const isMobile = useMediaQuery('(max-width: 639px)');

  const handleSearch = async () => {
    const apiKey = config.API_KEY;
    if (!userInput || !apiKey) {
      console.error('Missing required parameters. API Key:', apiKey);
      return;
    }
    try {
      setLocations(await getLocation(userInput, apiKey));
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocations([]);
  };

  return (
    <div className='min-h-screen bg-background p-4 sm:p-6 flex flex-col items-center'>
      <Card className='w-full max-w-screen-sm sm:min-w-[30rem] sm:max-w-[85rem] overflow-hidden border-border shadow-md'>
        <CardHeader className='bg-card border-b border-border pb-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-2xl font-bold text-primary whitespace-nowrap px-3'>
                  {language?.app?.title || 'WeatherUp!'}
                </CardTitle>
                {!isMobile ? (
                  <span className='text-sm font-medium text-muted-foreground'>
                    {language?.app?.subtitle || 'World Weather'}
                  </span>
                ) : null}
                {isMobile ? <ThemeToggle /> : null}
              </div>

              <div className='flex items-center gap-4 whitespace-nowrap mt-2 sm:mt-0 p-3'>
                <div className='flex items-center gap-2'>
                  {isMobile ? (
                    <span className='text-sm font-medium text-muted-foreground'>
                      {language?.app?.subtitle || 'World Weather'}
                    </span>
                  ) : null}
                  <div className='text-sm text-muted-foreground'>
                    <DateDisplay />
                  </div>
                  {isMobile ? null : <ThemeToggle />}
                </div>
              </div>
            </div>

            <div className='w-full max-w-full sm:max-w-2xl flex mx-auto'>
              <SearchInput
                userInput={userInput}
                setUserInput={setUserInput}
                locations={locations}
                handleSearch={handleSearch}
                handleLocationSelect={handleLocationSelect}
                className='w-full sm:w-[28rem] md:w-[32rem] lg:w-[36rem] xl:w-[40rem]'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {selectedLocation ? (
            <WeatherDisplay selectedLocation={selectedLocation} />
          ) : (
            <div className='p-6 text-center flex flex-col items-center gap-4'>
              <div className='mb-4'>
                <span className='font-bold text-xl text-primary px-2'>
                  {language?.app?.welcome || 'Welcome to WeatherUp! 🌤️'}
                </span>
              </div>
              <p className='text-base text-foreground'>
                {language?.app?.instructions || 'Enter a city name to check the weather and stay informed about current conditions. Get started by typing in the search box above. Happy exploring!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
