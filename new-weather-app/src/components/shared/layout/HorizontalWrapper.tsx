import React from 'react';

type HorizontalWrapperProps = {
  children: React.ReactNode;
  $justify?: 'flex-start' | 'flex-end' | 'center';
  maxWidth?: string;
};

export const HorizontalWrapper = ({ children, $justify, maxWidth }: HorizontalWrapperProps) => {
  // Map $justify prop to Tailwind justify classes
  const justifyClass = $justify === 'flex-start' ? 'justify-start' : $justify === 'flex-end' ? 'justify-end' : 'justify-center';
  return (
    <div
      className={`flex flex-row items-center ${justifyClass} w-full my-5`}
      style={maxWidth ? { maxWidth } : {}}
    >
      {children}
    </div>
  );
};
