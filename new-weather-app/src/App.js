import './App.css';
import AppContainer from './components/AppContainer';
import { ThemeProvider, styled } from 'styled-components';
import { lightTheme, darkTheme } from './GlobalTheme';
import React from 'react';

function App() {
    const [theme, setTheme] = React.useState(lightTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === lightTheme ? darkTheme : lightTheme);
    };

    return (
            <ThemeProvider theme={theme}>
                <BackDrop>
                   <AppContainer toggleTheme={toggleTheme} />
                </BackDrop>
            </ThemeProvider>
    );
}

export default App;

const BackDrop = styled.div`
    background-color: ${({theme}) => theme.backgroundColor};
`