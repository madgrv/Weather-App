// Custom hook for accessing the language module with type safety
import { useState, useEffect } from 'react';
import languageModule from './index';
import en from './en'; // Import default English language as fallback

/**
 * Custom hook that provides access to the language module
 * This ensures consistent language access across components
 * and provides better type safety and error handling
 */
export const useLanguage = () => {
  // Ensure we always have a valid language object by using English as fallback
  const [currentLanguage, setCurrentLanguage] = useState(languageModule || en);

  useEffect(() => {
    // This could be extended to handle language changes at runtime
    // Always ensure we have a valid language object
    setCurrentLanguage(languageModule || en);
  }, []);

  return {
    // Provide the language object with guaranteed structure
    language: currentLanguage,
    // Use the detected language code for locale formatting
    locale: (languageModule && languageModule.getLanguage) ? 
      languageModule.getLanguage() : 'en',
  };
};
