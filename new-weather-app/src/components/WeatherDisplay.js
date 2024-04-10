import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFlagEmoji, convertTimestamp, getTimezoneName } from '../helpers';
import Graph from './Graph';

const WeatherDisplay = ({ selectedLocation, APIKEY }) => {
	const [weatherData, setWeatherData] = useState(null);

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const response = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${APIKEY}&units=metric`
				);
				const data = await response.json();
				setWeatherData(data);
			} catch (error) {
				console.error('Error fetching weather data:', error);
			}
		};

		fetchWeatherData();

		console.log('Fetched Data');
	}, [selectedLocation, APIKEY]);

	if (!weatherData) {
		return <Loading>Loading weather data...</Loading>;
	}

	console.log(weatherData);

	return (
		<>
			<Container>
				<p>Weather for:</p>
				<Heading>
					{selectedLocation.name},{' '}
					{selectedLocation.state && selectedLocation.state + ', '}
					{selectedLocation.country} {getFlagEmoji(selectedLocation.country)}
				</Heading>
			</Container>
			<Container>
				<p>
					Lat: {selectedLocation.lat}, <br />
					Lon: {selectedLocation.lon} <br />
					Timezone: {getTimezoneName(weatherData.timezone)}
				</p>
				<Info>
					<p>Current temperature: {Math.ceil(weatherData.main.temp)}°C</p>
					{/* <p>Humidity: {weatherData.main.humidity}%</p> */}
					<p>Feels like: {Math.ceil(weatherData.main.feels_like)}°C</p>
					<p>
						Max: {Math.ceil(weatherData.main.temp_max)}°C
						<br />
						Min: {Math.ceil(weatherData.main.temp_min)}°C
					</p>
					<p>Description: {weatherData.weather[0].description}</p>
					<p>Visibility: {weatherData.visibility / 1000}Km</p>
					<p>Pressure: {weatherData.main.pressure}hPa</p>
					<p>Wind: {weatherData.wind.speed}m/s</p>
					<p>
						Sunrise: {convertTimestamp(weatherData.sys.sunrise)}
						<br />
						Sunset: {convertTimestamp(weatherData.sys.sunset)}
					</p>
				</Info>
			</Container>
			<Container>
				<Graph
					value={weatherData.main.humidity}
					title="Humidity"
					color={'green'}
				/>
			</Container>
		</>
	);
};

const Container = styled.div`
	background-color: hsl(0, 0%, 100%);
	padding: 20px;
	min-width: 550px;
	border-radius: 8px;
	margin-top: 20px;
	box-shadow: 0 0px 40px hsl(250, 10%, 90%);

	/* Media query for smaller screens */
	/* @media (max-width: 768px) {
		padding: 10px;
		min-width: 300px;
	} */
`;

const Heading = styled.h2`
	color: #333;
`;

const Info = styled.div`
	margin-top: 10px;
`;

const Loading = styled.p`
	color: hsl(250, 50%, 50%);
`;

export default React.memo(WeatherDisplay);
