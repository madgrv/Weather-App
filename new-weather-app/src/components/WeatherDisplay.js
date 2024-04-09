import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFlagEmoji, convertTimestamp } from '../helpers';
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
	}, [selectedLocation, APIKEY]);

	if (!weatherData) {
		return <Loading>Loading weather data...</Loading>;
	}

	console.log(weatherData);

	return (
		<>
			<Container>
				<h1>Weather for:</h1>
				<Heading>
					{selectedLocation.name},{' '}
					{selectedLocation.state && selectedLocation.state + ', '}
					{selectedLocation.country} {getFlagEmoji(selectedLocation.country)}
				</Heading>
				<p>
					Lat: {selectedLocation.lat}, <br />
					Lon: {selectedLocation.lon}
				</p>
				<h3>{}</h3>
				<Info>
					<p>Current temperature: {Math.ceil(weatherData.main.temp)}°C</p>
					{/* <p>Humidity: {weatherData.main.humidity}%</p> */}
					<p>Feels like: {Math.ceil(weatherData.main.feels_like)}°C</p>
					<p>
						Min: {Math.ceil(weatherData.main.temp_min)}°C <br />
						Max: {Math.ceil(weatherData.main.temp_max)}°C
					</p>
					<p>Description: {weatherData.weather[0].description}</p>
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
	min-width: 350px;
	border-radius: 8px;
	margin-top: 20px;
`;

const Heading = styled.h2`
	color: #333;
`;

const Info = styled.div`
	margin-top: 10px;
`;

const Loading = styled.p`
	color: #007bff;
`;

export default React.memo(WeatherDisplay);
