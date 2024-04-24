import React from 'react';
import styled from 'styled-components';

const DateDisplay = ({ UTC, data }) => {
	const dateOptions = {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	};

	const timeOptions = {
		hour: '2-digit',
		minute: '2-digit',
	};

	const [time, setTime] = React.useState(
		new Date(Date.now() + (UTC ? UTC - 3600 : null) * 1000).toLocaleString(
			'en-GB',
			timeOptions
		)
	);

	const date = new Date(
		Date.now() + (UTC ? UTC - 3600 : null) * 1000
	).toLocaleString('en-GB', dateOptions);

	React.useEffect(() => {
		const getTime = () => {
			setTime(
				new Date(Date.now() + (UTC ? UTC - 3600 : null) * 1000).toLocaleString(
					'en-GB',
					timeOptions
				)
			);
		};

		const intervalID = setInterval(getTime, 1000);

		return () => clearInterval(intervalID);
	}, [data]);

	console.log(UTC);

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

export default DateDisplay;

const DateWrapper = styled.div`
	padding: 5px;
`;

const Info = styled.p`
	font-weight: 200;
	font-size: 0.67em;
`;
