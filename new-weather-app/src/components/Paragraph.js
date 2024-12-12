import React from 'react';
import styled from 'styled-components';

export default function Paragraph({ children }) {
	return (
		<Wrapper>
			<StyledP>{children}</StyledP>
		</Wrapper>
	);
}

const StyledP = styled.p`
	color: ${({theme}) => theme.primaryTextColor};
	font-size: 1em;
	font-weight: 600;
	text-align: center;
`;

const Wrapper = styled.div`
	max-width: 600px;
	margin-top: 5px;
`;
