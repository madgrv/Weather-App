import React from 'react';

interface WeatherIconProps {
  iconCode: string;
  alt?: string;
  size?: number;
  className?: string;
}

/**
 * A wrapper component for OpenWeatherMap icons
 * 
 * @param iconCode - OpenWeatherMap icon code (e.g., "01d", "02n")
 * @param alt - Alternative text for the icon
 * @param size - Size of the icon in pixels
 * @param className - Additional CSS classes
 */
export const WeatherIcon = ({
  iconCode,
  alt = 'Weather condition',
  size = 50,
  className = ''
}: WeatherIconProps) => {
  // Construct the OpenWeatherMap icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <img
      src={iconUrl}
      alt={alt}
      width={size}
      height={size}
      className={`weather-icon ${className}`}
    />
  );
};
