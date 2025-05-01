import React, { useState, useEffect } from 'react';
import { Container, RowWrapper } from '../_common';
import { Heading, BoldText, Paragraph } from '../_common/_typography';
import {DateDisplay} from '../DateDisplay';
import {
	getFlagEmoji,
	convertTimestamp,
	getTimezoneName,
	getWeatherIcon,
} from '../../helpers';
import { Location, WeatherData } from '../../types';
import { Graph } from '../Graph';
import { Loading } from './WeatherDisplay.styled';

type WeatherDisplayProps = {
	selectedLocation: Location;
	APIKEY: string;
};

export const WeatherDisplay = ({ selectedLocation, APIKEY }: WeatherDisplayProps) => {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

	useEffect(() => {
		const fetchWeatherData = async () => {
			try {
				const baseUrl = process.env.REACT_APP_API_URL || 'https://api.openweathermap.org';
				const response = await fetch(
					`${baseUrl}/data/2.5/weather?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${APIKEY}&units=metric`
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

	return (
		<>
			<Paragraph>Weather for:</Paragraph>
			<Heading>
				{selectedLocation.name},{' '}
				{selectedLocation.state && selectedLocation.state + ', '}
				{selectedLocation.country}{' '}{getFlagEmoji(selectedLocation.country)}
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
