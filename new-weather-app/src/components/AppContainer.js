import React, { useState } from 'react';
import HorizontalWrapper from './HorizontalWrapper';
import VerticalWrapper from './VerticalWrapper';
import Title from './Title';
import Paragraph from './Paragraph';
import BoldText from './BoldText';
import Toggle from './Toggle';
import DateDisplay from './DateDisplay';
import SearchInput from './SearchInput';
import WeatherDisplay from './WeatherDisplay';
import { APIKEY } from '../helpers';


const AppContainer = ({ toggleTheme }) => {
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

	return (
		<>
			<VerticalWrapper>
				<HorizontalWrapper justify={'space-between'}>
					<Title>WeatherUp!</Title>
					<Paragraph>World Weather</Paragraph>
					<DateDisplay />
					<Toggle label="Dark Mode" toggleTheme={toggleTheme} />
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
					<WeatherDisplay selectedLocation={selectedLocation} APIKEY={APIKEY} />
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

export default AppContainer;
