import React from 'react';
import styled from 'styled-components';

const SearchInput = ({ userInput, setUserInput, handleSearch }) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		handleSearch();
	};

	return (
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
	);
};

const Form = styled.form`
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	height: 3em;
	width: 20em;
	padding: 0 10px;
	border: 2px solid hsl(250, 50%, 50%);
	border-radius: 4px 0px 0px 4px;
`;

const Button = styled.button`
	height: 3.3em;
	width: 7em;
	padding: 10px 20px;
	background-color: hsl(250, 50%, 50%);
	color: hsl(45, 29%, 97%);
	font-weight: 900;
	border: 2px solid hsl(250, 50%, 50%);
	border-radius: 0px 4px 4px 0px;
	cursor: pointer;
`;

export default SearchInput;
