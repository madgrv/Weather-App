import React from 'react';
import { getFlagEmoji } from '../../../helpers';
import { FlagEmoji, StyledList, StyledListItem } from './LocationDisplay.styled';
import { Location, Selection } from '../../../types';

type LocaionDisplayProps = {
	locations: Location[];
	selection?: Selection;
	handleLocationSelect: (selection: Selection) => void;
	setUserInput: (value: string) => void;
};

export const LocationDisplay = ({
	locations,
	handleLocationSelect,
	setUserInput,
}: LocaionDisplayProps) => {
	function handleClick(selection: Selection) {
		handleLocationSelect(selection);
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
