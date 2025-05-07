import React from 'react';

interface SunriseIconProps {
  className?: string;
  size?: number;
}

export const SunriseIcon = ({
  className = 'text-yellow-500',
  size = 20,
}: SunriseIconProps) => (
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
    <circle cx='12' cy='16' r='4' />
    <path d='M12 2v6' />
    <path d='m4.93 10.93 1.41 1.41' />
    <path d='M2 18h2' />
    <path d='M20 18h2' />
    <path d='m19.07 10.93-1.41 1.41' />
    <path d='M22 22H2' />
    <path d='m8 5 4-4 4 4' />
  </svg>
);
