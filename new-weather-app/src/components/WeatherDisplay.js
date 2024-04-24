import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Container from './Container';
import RowWrapper from './RowWrapper';
import Heading from './Heading';
import BoldText from './BoldText';
import Paragraph from './Paragraph';
import DateDisplay from './DateDisplay';
import {
	getFlagEmoji,
	convertTimestamp,
	getTimezoneName,
	getWeatherIcon,
} from '../helpers';
import Graph from './Graph';

const WeatherDisplay = ({ selectedLocation, APIKEY }) => {
	const [weatherData, setWeatherData] = useState(null);

	console.log('Weather display render');

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

		console.log('Fetched weatherData');
	}, [selectedLocation, APIKEY]);

	if (!weatherData) {
		return <Loading>Loading weather data...</Loading>;
	}

	console.log(weatherData);

	return (
		<>
			<Paragraph>Weather for:</Paragraph>
			<Heading>
				{selectedLocation.name},{' '}
				{selectedLocation.state && selectedLocation.state + ', '}
				{selectedLocation.country} {getFlagEmoji(selectedLocation.country)}
				<DateDisplay UTC={weatherData.timezone} data={weatherData} />
			</Heading>
			<RowWrapper>
				<Container>
					<Paragraph>
						Description:{' '}
						<BoldText>{weatherData.weather[0].description}</BoldText>
					</Paragraph>
					<Paragraph>
						Visibility:
						<BoldText> {weatherData.visibility / 1000} Km</BoldText>
					</Paragraph>
					<Paragraph>
						<span>{getWeatherIcon(weatherData.weather[0].description)}</span>
					</Paragraph>
				</Container>
				<Container>
					<Paragraph>
						Current temperature:
						<BoldText> {Math.ceil(weatherData.main.temp)}°C</BoldText>
					</Paragraph>
					<Paragraph>
						Feels like:
						<BoldText> {Math.ceil(weatherData.main.feels_like)}°C</BoldText>
					</Paragraph>
					<Paragraph>
						Max:
						<BoldText> {Math.ceil(weatherData.main.temp_max)}°C</BoldText>
						<br />
						Min:
						<BoldText> {Math.ceil(weatherData.main.temp_min)}°C</BoldText>
					</Paragraph>
				</Container>
				<Container>
					<Graph
						value={weatherData.main.humidity}
						title="Humidity"
						color={'green'}
					/>
				</Container>
				<Container>
					<Paragraph>
						Sunrise:
						<BoldText> {convertTimestamp(weatherData.sys.sunrise)}</BoldText>
						<br />
						Sunset:
						<BoldText> {convertTimestamp(weatherData.sys.sunset)}</BoldText>
					</Paragraph>
				</Container>
				<Container>
					<Paragraph>
						Wind:
						<BoldText> {weatherData.wind.speed} m/s</BoldText>
					</Paragraph>
					<Paragraph>
						Pressure:
						<BoldText> {weatherData.main.pressure} hPa</BoldText>
					</Paragraph>
				</Container>
				<Container>
					<Paragraph>
						Timezone:
						<BoldText> UTC {getTimezoneName(weatherData.timezone)}</BoldText>
						<Paragraph>
							Lat:<BoldText> {selectedLocation.lat},</BoldText>
							<br />
							Lon:
							<BoldText> {selectedLocation.lon}</BoldText>
						</Paragraph>
					</Paragraph>
				</Container>
			</RowWrapper>

			<RowWrapper></RowWrapper>

			<RowWrapper></RowWrapper>
		</>
	);
};

// const Info = styled.p`
// 	margin-top: 10px;
// 	font-weight: 600;
// 	font-size: 1em;
// `;

const Loading = styled.p`
	color: hsl(250, 50%, 50%);
`;

export default React.memo(WeatherDisplay);
