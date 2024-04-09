// LocationDisplay.js

import React from 'react';
import { getFlagEmoji } from '../helpers';
import styled from 'styled-components';

export default function LocationDisplay({
	locations,
	handleLocationSelect,
	setUserInput,
}) {
	function handleClick(location) {
		handleLocationSelect(location);
		setUserInput('');
	}

	return (
		<StyledList>
			{locations.map((item, index) => (
				<StyledListItem key={index} onClick={() => handleClick(item)}>
					{item.name}, {item.state}
					<FlagEmoji>{getFlagEmoji(item.country)}</FlagEmoji>
				</StyledListItem>
			))}
		</StyledList>
	);
}

const StyledList = styled.ol`
	position: relative;
	margin-top: 0;
	padding: 0;
	background-color: white;
	border: 4px solid white;
	border-radius: 0px 0px 4px 4px;
	/* border-top: none; */
	list-style-type: none;
	z-index: 1;
	box-shadow: 0 15px 15px hsl(250, 20%, 85%);
	max-width: 20em;
`;

const StyledListItem = styled.li`
	align-self: center;
	padding: 16px;
	border-radius: 3px 3px 3px 3px;
	cursor: pointer;
	transition: 0.5s;

	&:hover {
		background-color: hsl(250, 0%, 95%);
	}
`;

const FlagEmoji = styled.span`
	margin-left: 10px;
`;
