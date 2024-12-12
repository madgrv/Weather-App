import React from 'react';
import styled from 'styled-components';

export default function BoldText({ children }) {
	return <Bold>{children}</Bold>;
}

const Bold = styled.strong`
	color: ${props => props.theme.strongTextColor}; 
`
