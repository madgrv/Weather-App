import styled from 'styled-components';

interface GraphProps {
    value: number;
    title?: string;
}

export const GraphContainer = styled.div`
	padding: 20px;
	width: 100%;
	height: auto;
`;

export const GraphBar = styled.div`
	margin: 10px;
	width: 100%;
	height: 20px;
	background-color: #f0f0f0; // change to variable --background-color or theme provider
	border-radius: 10px;
	overflow: hidden;
`;

export const Filler = styled.div<GraphProps>`
	width: ${({ value }) => value}%;
	height: 100%;
	background: ${({ value }) => {
		if (value <= 50) {
			return `linear-gradient(to right, #4caf50, #8bc34a ${value}%, #f0f0f0 ${value}%)`;
		} else if (value <= 75) {
			return `linear-gradient(to right, #4caf50, #8bc34a 50%, #ffeb3b ${value}%, #f0f0f0 ${value}%)`;
		} else {
			return `linear-gradient(to right, #4caf50, #8bc34a 50%, #ffeb3b 75%, #ff9800 ${value}%, #f0f0f0 ${value}%)`;
		}
	}};
	transition: width 0.5s ease-in-out, background 0.5s ease-in-out;
`;
