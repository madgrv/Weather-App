export const getLocation = async ( userInput: string, APIKEY: string ) => {
    try {
        const baseUrl = process.env.REACT_APP_API_URL || 'https://api.openweathermap.org';
        const response = await fetch(
            `${baseUrl}/geo/1.0/direct?q=${userInput}&limit=5&appid=${APIKEY}`
        );
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};