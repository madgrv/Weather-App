import React, { PropsWithChildren } from 'react';
import { StyledP, Wrapper } from './Paragraph.styled';

export const Paragraph = ({ children }: PropsWithChildren) => {
	
	return (
		<Wrapper>
			<StyledP>{children}</StyledP>
		</Wrapper>
	);
}
