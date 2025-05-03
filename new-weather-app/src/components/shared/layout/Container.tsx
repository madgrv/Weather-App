import React from 'react';

type ContainerProps = {
  size?: number;
  children: React.ReactNode;
};

export const Container = ({ size, children }: ContainerProps) => {
  // Use Tailwind utility classes for layout and max width
  // size prop is interpreted as percentage width if provided
  const widthClass = size ? `max-w-[${size}%]` : 'max-w-md';
  return (
    <div
      className={`bg-white p-5 m-2 w-full rounded-lg shadow transition ${widthClass}`}
      style={size ? { maxWidth: `${size}%` } : {}}
    >
      {children}
    </div>
  );
};
