import React from 'react';
import styled from 'styled-components';

export default function Heading({ children }) {
	return <StyledHeading>{children}</StyledHeading>;
}

const StyledHeading = styled.h2`
	text-align: center;
	color: #333;
	font-weight: 900;
	margin-bottom: 20px;
`;
