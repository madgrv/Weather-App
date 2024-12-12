import React from "react";
import styled from "styled-components";

export default function Toggle({  
    toggleTheme,
    size = 16,
}) {
    const [isDarkMode, setIsDarkMode] = React.useState(false); 

    const toggleDarkMode = () => {
        toggleTheme();
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <ToggleWrapper>
            <label>Dark mode</label>
            <Button 
                onClick={toggleDarkMode} 
                checked={isDarkMode} 
                size={size}
                >
                 <Ball checked={isDarkMode} size={size} />
            </Button>
        </ToggleWrapper>
    );
}

const ToggleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    transition: '0.5s';
`;

const Button = styled.button`    
    position: relative;
    border: none;
    background: transparent;
    cursor: pointer;
    width: 1em;
    padding: 0.1em;

    &&:before {
        content: '';
        position: absolute;
        z-index: 0;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
    }

    &&:after {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0.25em;
        right: 0.25em;
        bottom: 0;
        margin: auto;
        height: 2px;
        background: ${({ theme }) => theme.backgroundColor};
        border-radius: 10px;
    }

    &&:focus-visible {
        outline: 2px auto hsl(345deg 100% 50%);
        outline-offset: 2px;
    }
`;

const Ball = styled.span`
  display: block;
  position: relative;
  z-index: 2;
  border-radius: 50%;
  background: ${({theme}) => theme.strongTextColor};
  border: 2px solid ${({theme}) => theme.brandColor};
  outline: ${({theme}) => theme.brandColor};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  transform: ${props => (props.checked ? 'translateX(100%)' : 'translateX(0%)')};
`;
