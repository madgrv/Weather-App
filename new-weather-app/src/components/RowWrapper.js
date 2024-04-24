import styled from 'styled-components';

export default function RowWrapper({ children }) {
	return <Row>{children}</Row>;
}

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
	max-width: 1200px;
`;
