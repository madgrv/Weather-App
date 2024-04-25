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
	color: #777; // // change into variable --primary-text-color or theme provider
	font-size: 1em;
	font-weight: 600;
	text-align: center;
`;

const Wrapper = styled.div`
	max-width: 600px;
	margin-top: 5px;
`;
