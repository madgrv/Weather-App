import React, { PropsWithChildren } from 'react';

export const VerticalWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col items-center my-5">
      {children}
    </div>
  );
};
