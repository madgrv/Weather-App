import React, { useState, useEffect } from "react";
import { DateWrapper, Info } from "./DateDisplay.styled";

type DateDisplayProps = {
	UTC?: number;
	data?: any;
}

export const DateDisplay = ({ UTC }: DateDisplayProps) => {
	const dateOptions = {
		day: 'numeric' as const,
		month: 'short' as const,
		year: 'numeric' as const,
	};

	const timeOptions = {
		hour: '2-digit' as const,
		minute: '2-digit' as const,
	};

	const [time, setTime] = useState(
		new Date(Date.now() + ((UTC ?? 0) - 3600) * 1000).toLocaleTimeString(
			'en-GB',
			timeOptions
		)
	);

	const date = new Date(
		Date.now() + ((UTC ?? 0) - 3600- 3600) * 1000
	).toLocaleDateString('en-GB', dateOptions);

	useEffect(() => {
		const getTime = () => {
			setTime(
				new Date(Date.now() + ((UTC ?? 0) - 3600) * 1000).toLocaleTimeString(
					'en-GB',
					timeOptions
				)
			);
		};

		const intervalID = setInterval(getTime, 1000);

		return () => clearInterval(intervalID);
	}, []);

	return (
		<>
			{UTC ? (
				<DateWrapper>
					<Info>Local time</Info>
					<h6>{date}</h6>
					<h6>{time}</h6>
				</DateWrapper>
			) : (
				<DateWrapper>
					{date} {time}
				</DateWrapper>
			)}
		</>
	);
};
