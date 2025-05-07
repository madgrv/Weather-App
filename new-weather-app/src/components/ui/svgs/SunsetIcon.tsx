// src/components/ui/svgs/SunsetIcon.tsx
import React from 'react';

interface SunsetIconProps {
  className?: string;
  size?: number;
}

export const SunsetIcon = ({
  className = 'text-orange-500',
  size = 20,
}: SunsetIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M12 8V2' />
    <path d='m4.93 10.93 1.41-1.41' />
    <path d='M2 18h2' />
    <path d='M20 18h2' />
    <path d='m19.07 10.93-1.41 1.41' />
    <path d='M22 22H2' />
    <path d='m8 18 4 4 4-4' />
  </svg>
);
