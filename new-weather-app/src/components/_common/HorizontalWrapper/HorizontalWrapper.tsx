import React from 'react';
import { HorizontalFlex } from './HorizontalWrapper.styled';

type HorizontalWrapperProps = {
	children: React.ReactNode;
	$justify?: string;
	maxWidth?: string;
}

export const HorizontalWrapper = ({ children, $justify, maxWidth }: HorizontalWrapperProps) => {
	return (
		<HorizontalFlex $justify={$justify} maxWidth={maxWidth}>
			{children}
		</HorizontalFlex>
	);
}

