# Weather App

This is a modern weather application that allows users to view current weather information for locations around the world.

## Features

- **Location Search:** Search for any location worldwide with an enhanced search input component
- **Current Weather Display:** View detailed current weather information including temperature, humidity, wind speed, and more
- **Weather Icons:** Visual representation of current weather conditions
- **Temperature Indicators:** Colour-coded temperature display based on temperature ranges
- **Local Time Display:** Shows the local time of the selected location
- **Dark/Light Mode:** Toggle between dark and light themes for comfortable viewing in any environment
- **Responsive Design:** Fully responsive layout that works well on both desktop and mobile devices

## Technologies Used

- **React.js**
- **TypeScript**
- **Tailwind CSS**
- **OpenWeatherMap API**
- **Radix UI**
- **Vercel**

## Installation

To run the application locally, follow these steps:

1. Clone this repository to your local machine
2. Navigate to the project directory: `cd new-weather-app`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```
5. Start the development server: `npm start`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

The project follows a component-based architecture:

- `src/components/`: UI components including the main AppLayout
- `src/components/ui/`: Reusable UI components like cards, badges, and theme toggle
- `src/lib/`: Utility functions and theme configuration
- `src/api/`: API interaction functions
- `src/types/`: TypeScript type definitions

## Deployment

The application is deployed at: [https://weatherup.matteogalesi.com/](https://weatherup.matteogalesi.com/)

It is configured for deployment on Vercel with the appropriate settings in `vercel.json`.
