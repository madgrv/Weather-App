import React from 'react';
import styled from 'styled-components';

export default function VerticalWrapper({ children }) {
	return <VerticaFlex>{children}</VerticaFlex>;
}

const VerticaFlex = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 20px;
`;
