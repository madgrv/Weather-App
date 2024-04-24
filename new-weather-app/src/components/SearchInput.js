import React from 'react';
import styled from 'styled-components';
import LocationDisplay from './LocationDisplay';

const SearchInput = ({
	userInput,
	setUserInput,
	locations,
	handleSearch,
	handleLocationSelect,
}) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		handleSearch();
	};

	console.log('SearchInput render');

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

const SearchInputWrapper = styled.div`
	position: sticky;
	top: 5px;
	min-width: 620px;
	margin-bottom: 10px;
	width: 100%;
	max-width: 780px;

	@media (max-width: 839px) {
		max-width: 640px;
	}

	@media (max-width: 640px) {
		width: 100%;
		min-width: 20em;
	}
`;

const Form = styled.form`
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	height: 3em;
	width: 100%;
	padding: 0 10px;
	border: 2px solid hsl(250, 50%, 50%);
	border-radius: 4px 0px 0px 4px;
`;

const Button = styled.button`
	font-size: 1em;
	height: 3em;
	width: 40%;
	max-width: 7em;
	padding: 10px 20px;
	background-color: hsl(250, 50%, 50%);
	color: hsl(45, 29%, 97%);
	font-weight: 900;
	border: 2px solid hsl(250, 50%, 50%);
	border-radius: 0px 4px 4px 0px;
	cursor: pointer;
`;

export default React.memo(SearchInput);
