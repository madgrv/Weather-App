import React from 'react';
import styled from 'styled-components';

export default function Title({ children }) {
	return <StyledTitle>{children}</StyledTitle>;
}

const StyledTitle = styled.h6`
	color: hsl(250, 50%, 50%);
	font-size: 1.3em;
	font-weight: 800;
	align-self: center;
`;
