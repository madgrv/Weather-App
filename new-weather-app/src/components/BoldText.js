import React from 'react';
import styled from 'styled-components';

export default function BoldText({ children }) {
	return <Bold>{children}</Bold>;
}

const Bold = styled.strong`
	color: #333; // change into variable --strong-text-color or theme provider
`;
