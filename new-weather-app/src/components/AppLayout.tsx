import React, { useState } from 'react';
import { DateDisplay } from './DateDisplay';
import SearchInputEnhanced from './ui/SearchInputEnhanced';
import { WeatherDisplay } from './WeatherDisplay';
import { Location } from '../types';
import { getLocation } from '../api/getLocation';
import config from '../config';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const AppLayout = () => {
  const [userInput, setUserInput] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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
    <div className='min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center'>
      <Card className='w-full min-w-[30rem] max-w-[85rem] overflow-hidden border-slate-200 shadow-md'>
        <CardHeader className='bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 pb-4'>
          <div className='flex flex-col gap-4'>
            {/* Top row with title and clock */}
            <div className='flex justify-between items-center'>
              <CardTitle className='text-2xl font-bold text-slate-800 whitespace-nowrap'>
                WeatherUp!
              </CardTitle>

              <div className='flex items-center gap-2 whitespace-nowrap'>
                <span className='text-sm font-medium text-slate-600'>
                  World Weather
                </span>
                <span className='text-slate-400 mx-1'>|</span>
                <div className='text-sm text-slate-600'>
                  <DateDisplay />
                </div>
              </div>
            </div>

            {/* Search bar centered below */}
            <div className='w-full max-w-2xl flex mx-auto'>
              <SearchInputEnhanced
                userInput={userInput}
                setUserInput={setUserInput}
                locations={locations}
                handleSearch={handleSearch}
                handleLocationSelect={handleLocationSelect}
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
                <span className="font-bold text-xl text-primary">Welcome to WeatherUp! 🌤️</span>
              </div>
              <p className="text-base text-slate-700">
                Enter a city name to check the weather and stay informed about
                current conditions. Get started by typing in the search box
                above. Happy exploring!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
