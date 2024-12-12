import React from 'react';
import { Wrapper } from './Container.styled';

type ContainerProps = {
	size?: number;
	children: React.ReactNode;
};

export const Container = ({ size, children }: ContainerProps) => {
	return <Wrapper size={size}>{children}</Wrapper>;
}

