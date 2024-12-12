import React, { PropsWithChildren } from 'react';
import { Row } from './RowWrapper.styled';

export const RowWrapper = ({ children }: PropsWithChildren) => {
	return <Row>{children}</Row>;
}

