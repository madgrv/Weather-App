import styled from 'styled-components';

interface ContainerProps {
	size?: number;
}

export const Wrapper  = styled.div<ContainerProps>`
	background-color: hsl(0, 0%, 100%);
	padding: 20px;
	margin: 10px;
	width: 100%;
	max-width: ${({ size }) => (size ? `${size}%` : '380px')};
	border-radius: 8px;
	box-shadow: 0 0px 40px hsl(250, 20%, 90%);
	transition: 0.3s;

	@media (max-width: 839px) {
		max-width: 640px;
	}

	@media (max-width: 640px) {
		padding: 10px;
		max-width: 640px;
	}
`;
