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
	color: #777; //add variable --primary-text-color or theme provider
	font-size: 1em;
	font-weight: 700;
	position: absolute;
	margin-top: 0;
	padding: 0;
	background-color: white;
	border: 4px solid white;
	border-radius: 0px 0px 4px 4px;
	list-style-type: none;
	z-index: 1;
	box-shadow: 0 15px 30px hsl(250, 10%, 90%);
`;

const StyledListItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
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
