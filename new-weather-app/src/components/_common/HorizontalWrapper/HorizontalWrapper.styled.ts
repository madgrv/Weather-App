import styled from 'styled-components';

interface HorizontalFlexProps {
	$justify?: string;
	maxWidth?: string;
}

export const HorizontalFlex = styled.div <HorizontalFlexProps>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: ${(props) => (props.$justify || 'center')};
	max-width: ${(props) => (props.maxWidth || '')};
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
