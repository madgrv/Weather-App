import React, { PropsWithChildren } from 'react';

export const RowWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-row justify-center flex-wrap w-full max-w-screen-xl">
      {children}
    </div>
  );
};
