import styled from 'styled-components';

export const Loading = styled.p`
	color: hsl(250, 50%, 50%);
`;

export const WeatherContainer = styled.div`
  width: 100%;
  max-width: 42rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: white;
  overflow: hidden;
`;

export const WeatherHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
`;

export const WeatherTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
`;

export const WeatherContent = styled.div`
  padding: 1.5rem;
`;

export const WeatherGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const WeatherBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  background-color: #f7fafc;
  grid-column: 1 / -1;
  margin-bottom: 0.5rem;
`;

export const WeatherSection = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #edf2f7;
  }
  
  p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: #4a5568;
  }
  
  b {
    font-weight: 600;
    color: #2d3748;
  }
  
  span {
    display: block;
    text-align: center;
    font-size: 2.5rem;
    margin: 0.5rem 0;
  }
`;
