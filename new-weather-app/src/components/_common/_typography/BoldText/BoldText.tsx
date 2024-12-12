import React from 'react';
import { PropsWithChildren } from 'react';
import { Bold } from './BoldText.styled';


export const BoldText = ({ children }: PropsWithChildren) => {
	return <Bold>{children}</Bold>;
}

