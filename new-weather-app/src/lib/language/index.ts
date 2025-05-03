// Language index: detects user system language and provides the appropriate language pack
import en from './en';
import it from './it';
import es from './es';
import fr from './fr';
import hu from './hu';
import de from './de';

// Mapping of language codes to their respective language packs
const languageMap: Record<string, any> = {
  en, // English
  it, // Italian
  es, // Spanish
  fr, // French
  hu, // Hungarian
  de, // German
};

/**
 * Detects the user's system language and returns the corresponding language code.
 * If the user's language is not present in the language map, it falls back to English.
 */
function detectUserLanguage(): string {
  //   if (typeof navigator !== 'undefined' && navigator.language) {
  //     // Extract the language code from the navigator.language string (e.g., 'en-US' -> 'en')
  //     const lang = navigator.language.split('-')[0];
  //     // Return the language code if it exists in the language map, otherwise fall back to English
  //     return languageMap[lang] ? lang : 'en';
  //   }
  // If navigator.language is not available, fall back to English
  return 'fr';
}

// Detect the user's language
const userLanguage = detectUserLanguage();

// Get the language pack for the user's language, falling back to English if not available
const language = languageMap[userLanguage] || en;

// Helper to get the current language code (for API requests etc.)
language.getLanguage = () => userLanguage;

export default language;
