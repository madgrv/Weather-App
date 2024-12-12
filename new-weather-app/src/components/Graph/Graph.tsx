import React from 'react';
import { Paragraph, BoldText } from '../_common/_typography';
import { Filler, GraphBar, GraphContainer } from './Graph.styled';

type GraphProps = {
	value: number;
	title: string;
	color?: string;
}

export const Graph = ({ value, title }: GraphProps) => {
	return (
		<GraphContainer>
			<Paragraph>
				{title}:<BoldText> {value}%</BoldText>
			</Paragraph>
			<GraphBar>
				<Filler value={value} />
			</GraphBar>
		</GraphContainer>
	);
};

