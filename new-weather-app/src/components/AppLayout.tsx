import React, { useState } from 'react';
import { HorizontalWrapper, VerticalWrapper } from './_common';
import { Title, Paragraph, BoldText } from './_common/_typography';
import { DateDisplay } from './DateDisplay';
import { SearchInput } from './SearchInput';
import { WeatherDisplay } from './WeatherDisplay';
import { Location } from '../types';
import { APIKEY } from '../helpers'; 
import { getLocation } from '../api/getLocation';

export const AppLayout = () => {
  const [userInput, setUserInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const handleSearch = async () => {
    if (!userInput || !APIKEY) return; 
    setLocations(await getLocation(userInput, APIKEY));
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocations([]);
  };

  return (
    <>
      <VerticalWrapper>
        <HorizontalWrapper $justify={'space-between'}>
          <Title>WeatherUp!</Title>
          <Paragraph>World Weather</Paragraph>
          <DateDisplay />
        </HorizontalWrapper>
      </VerticalWrapper>
      <VerticalWrapper>
        <SearchInput
          locations={locations}
          userInput={userInput}
          setUserInput={setUserInput}
          handleSearch={handleSearch}
          handleLocationSelect={handleLocationSelect}
        />
        {selectedLocation ? (
          <WeatherDisplay selectedLocation={selectedLocation} APIKEY={APIKEY || ''} />
        ) : (
          <>
            <VerticalWrapper>
              <Paragraph>
                <BoldText>Welcome to WeatherUp! 🌤️</BoldText>
              </Paragraph>
            </VerticalWrapper>
            <Paragraph>
              Enter a city name to check the weather and stay informed about
              current conditions. Get started by typing in the search box above.
              Happy exploring!
            </Paragraph>
          </>
        )}
      </VerticalWrapper>
    </>
  );
};
