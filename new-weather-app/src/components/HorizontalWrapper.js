import React from 'react';
import styled from 'styled-components';

export default function HorizontalWrapper({ children, justify, maxWidth }) {
	return (
		<HorizontalFlex justify={justify} maxWidth={maxWidth}>
			{children}
		</HorizontalFlex>
	);
}

const HorizontalFlex = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: ${(props) => (props.justify ? props.justify : 'center')};
	max-width: ${(props) => (props.maxWidth ? props.maxWidth : '')};
	min-width: 630px;
	margin: 20px;

	@media (max-width: 839px) {
		max-width: 640px;
	}

	@media (max-width: 640px) {
		width: 100%;
		min-width: 20em;
	}
`;
