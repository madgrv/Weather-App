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
	/* min-width: 28em;
	font-size: 1em; */

	@media (max-width: 428px) {
		min-width: 15.6em;
	}

	/* min-width: 27em; */
	/* flex-wrap: wrap; */
	/* overflow: auto; */
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

	/* @media (max-width: 768px) {
		min-width: 15.6em;
	} */
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

export default SearchInput;
