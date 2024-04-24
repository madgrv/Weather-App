// helpers.js

export const APIKEY = '6f8ae8c028d2cc301f42425357121375';

// function to create a flag emoji from ASCII
export function getFlagEmoji(countryCode) {
	const countryCodeUpperCase = countryCode.toUpperCase();
	const OFFSET = 127397;
	return countryCodeUpperCase
		.split('')
		.map((char) => String.fromCodePoint(char.charCodeAt(0) + OFFSET))
		.join('');
}

// helper function to convert unix timestamp into time format (hh:mm)
export function convertTimestamp(timestamp) {
	return new Date(timestamp * 1000).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		// hour12: false,
	});
}

// Function to convert timezone data to UTC readable values
export function getTimezoneName(timezoneOffset) {
	// Adjust the timezone name based on the offset
	const hours = Math.floor(Math.abs(timezoneOffset) / 3600);
	const minutes = Math.abs(timezoneOffset % 3600) / 60;
	const sign = timezoneOffset >= 0 ? '+' : '-';
	const offsetString = `${sign}${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}`;

	// return `UTC${offsetString}`;
	return offsetString;
}

// Function to get weather icon based on weather description
export function getWeatherIcon(weatherDescription) {
	const weatherIcons = {
		Clear: '☀️',
		Clouds: '☁️',
		Rain: '🌧️',
		Thunderstorm: '⛈️',
		Drizzle: '🌦️',
		Snow: '❄️',
	};

	const condition = Object.keys(weatherIcons).find((key) =>
		weatherDescription.toLowerCase().includes(key.toLowerCase())
	);

	return weatherIcons[condition] || '';
}
