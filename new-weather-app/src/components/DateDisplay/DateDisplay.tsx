import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../lib/language/useLanguage";

type DateDisplayProps = {
	UTC?: number;
	data?: any;
}

export const DateDisplay = ({ UTC }: DateDisplayProps) => {
	// Use the language hook to get access to the language module and locale
	const { language, locale } = useLanguage();
	
	const dateOptions = {
		day: 'numeric' as const,
		month: 'short' as const,
		year: 'numeric' as const,
	};

	const timeOptions = useMemo(() => ({
		hour: '2-digit' as const,
		minute: '2-digit' as const,
		hour12: false as const, // Ensure 24-hour format for British English standard
	}), []);

	// For location-specific time (when UTC is provided)
	const [locationTime, setLocationTime] = useState(
		UTC ? new Date(Date.now() + (UTC * 1000)).toLocaleTimeString(
			locale,
			timeOptions
		) : ''
	);

	const locationDate = UTC ? new Date(
		Date.now() + (UTC * 1000)
	).toLocaleDateString(locale, dateOptions) : '';

	// For device local time (when UTC is not provided)
	const [deviceLocalTime, setDeviceLocalTime] = useState(
		new Date().toLocaleTimeString(locale, timeOptions)
	);

	const deviceLocalDate = new Date().toLocaleDateString(locale, dateOptions);

	useEffect(() => {
		const updateTimes = () => {
			// Update location-specific time if UTC is provided
			if (UTC) {
				setLocationTime(
					new Date(Date.now() + (UTC * 1000)).toLocaleTimeString(
						locale,
						timeOptions
					)
				);
			}
			
			// Always update device local time
			setDeviceLocalTime(
				new Date().toLocaleTimeString(locale, timeOptions)
			);
		};

		const intervalID = setInterval(updateTimes, 1000);
		return () => clearInterval(intervalID);
	}, [UTC, timeOptions, locale]);

	return (
		<>
			{UTC ? (
				<div className="flex flex-col items-start p-2 text-foreground">
					<span className="text-xs text-muted-foreground mb-1">{language?.weather?.localTime || 'Local Time'}</span>
					<h6 className="text-base font-semibold">{locationDate}</h6>
					<h6 className="text-base font-semibold">{locationTime}</h6>
				</div>
			) : (
				<div className="flex flex-col items-start p-2 text-foreground">
					<span className="text-base font-semibold">{deviceLocalDate} {deviceLocalTime}</span>
				</div>
			)}
		</>
	);
};
