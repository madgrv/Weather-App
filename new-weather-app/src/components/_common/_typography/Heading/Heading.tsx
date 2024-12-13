import React from 'react';
import { PropsWithChildren } from 'react';
import { StyledHeading } from './Heading.styles';

export const Heading = ({ children }: PropsWithChildren) => {
	return <StyledHeading>{children}</StyledHeading>;
}
