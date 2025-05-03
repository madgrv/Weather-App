// Language index: detects user system language and provides the appropriate language pack
import en from './en';
// import it from './it'; // Example for future languages

const languageMap: Record<string, any> = {
  en,
  // it,
};

function detectUserLanguage(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.split('-')[0];
    return languageMap[lang] ? lang : 'en';
  }
  return 'en';
}

const userLanguage = detectUserLanguage();

const language = languageMap[userLanguage] || en;

export default language;