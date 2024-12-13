import React from 'react';
import { PropsWithChildren } from 'react';
import { StyledTitle } from './Title.styled';

export const Title = ({ children }: PropsWithChildren) => {
	return <StyledTitle>{children}</StyledTitle>;
}
