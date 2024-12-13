import React from 'react';
import { PropsWithChildren } from 'react';
import { VerticalFlex } from './VerticalWrapper.styled';

export const VerticalWrapper = ({ children }: PropsWithChildren) => {
	return <VerticalFlex>{children}</VerticalFlex>;
};