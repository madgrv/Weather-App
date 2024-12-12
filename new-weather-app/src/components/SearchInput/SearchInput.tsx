import React, { FormEvent } from 'react';
import { LocationDisplay } from '../_common/LocationDisplay';
import { Button, Form, Input, SearchInputWrapper } from './SearchInput.styled';
import { Location, Selection } from '../../types';

type SearchInputProps = {
	userInput: string;
	setUserInput: (value: string) => void;
	locations: Location[];
	handleSearch: () => void;
	handleLocationSelect: (selection: Selection) => void;
};

export const SearchInput = ({
	userInput,
	setUserInput,
	locations,
	handleSearch,
	handleLocationSelect,
}: SearchInputProps) => {
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		handleSearch();
	};

	return (
		<SearchInputWrapper>
			<Form onSubmit={handleSubmit}>
				<Input
					type="text"
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder="Enter city name"
					required
				/>
				<Button type="submit">Search</Button>
			</Form>
			{locations.length > 0 && (
				<LocationDisplay
					locations={locations}
					handleLocationSelect={handleLocationSelect}
					setUserInput={setUserInput}
				/>
			)}
		</SearchInputWrapper>
	);
};

export default React.memo(SearchInput);
