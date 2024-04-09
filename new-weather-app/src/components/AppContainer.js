import React, { useState } from 'react';
import styled from 'styled-components';
import SearchInput from './SearchInput';
import LocationDisplay from './LocationDisplay';
import WeatherDisplay from './WeatherDisplay';
import { APIKEY } from '../helpers';

const AppContainer = () => {
	const [userInput, setUserInput] = useState('');
	const [locations, setLocations] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState(null);

	const handleSearch = async () => {
		try {
			const response = await fetch(
				`http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&appid=${APIKEY}`
			);
			const data = await response.json();
			setLocations(data);
		} catch (error) {
			console.error('Error fetching location data:', error);
		}
	};

	const handleLocationSelect = (location) => {
		setSelectedLocation(location);
		// Clear the locations list when a location is selected to remove the display from the UI

		setLocations([]);
	};

	console.log(selectedLocation);

	return (
		<Container>
			<SearchInputWrapper>
				<SearchInput
					userInput={userInput}
					setUserInput={setUserInput}
					handleSearch={handleSearch}
				/>
				{locations.length > 0 && (
					<LocationDisplay
						locations={locations}
						handleLocationSelect={handleLocationSelect}
						setUserInput={setUserInput}
					/>
				)}
			</SearchInputWrapper>
			{selectedLocation && (
				<WeatherDisplay selectedLocation={selectedLocation} APIKEY={APIKEY} />
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10px;
`;

const SearchInputWrapper = styled.div`
	/* max-width: 27em; */
	/* flex-wrap: wrap; */
	/* overflow: auto; */
`;

export default AppContainer;
