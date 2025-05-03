import React, { useState, useEffect, useMemo } from "react";

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

	const timeOptions = useMemo(() => ({
		hour: '2-digit' as const,
		minute: '2-digit' as const,
	}), []);

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
	}, [UTC, timeOptions]);

	return (
		<>
			{UTC ? (
				<div className="flex flex-col items-start p-2 text-foreground">
					<span className="text-xs text-muted-foreground mb-1">Local time</span>
					<h6 className="text-base font-semibold">{date}</h6>
					<h6 className="text-base font-semibold">{time}</h6>
				</div>
			) : (
				<div className="flex flex-col items-start p-2 text-foreground">
					<span className="text-base font-semibold">{date} {time}</span>
				</div>
			)}
		</>
	);
};
