import React from 'react';
import styled from 'styled-components';

export default function Heading({ children }) {
	return <StyledHeading>{children}</StyledHeading>;
}

const StyledHeading = styled.h2`
	text-align: center;
	color: #333; // // change into variable --strong-text-color or theme provider
	font-weight: 900;
	margin-bottom: 20px;
`;
