import styled from 'styled-components';

export default function Container({ children }) {
	return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div`
	background-color: hsl(0, 0%, 100%);
	padding: 20px;
	min-width: 600px;
	border-radius: 8px;
	margin-top: 20px;
	box-shadow: 0 0px 40px hsl(250, 10%, 90%);

	/* Media query for smaller screens */
	@media (max-width: 428px) {
		padding: 10px;
		min-width: 21.5em;
		flex-direction: column;
	}
`;
