import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import fa from './locales/fa';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = { en: { translation: en }, fa: { translation: fa } };
const fallbackLng = ['fa'];
const availableLanguages = ['en', 'fa'];

// Initialize i18n with default language (e.g., 'fa')
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng,
  lng: 'fa', // Default language for the first render
  supportedLngs: availableLanguages,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

// Fetch the language from AsyncStorage and update the i18n language asynchronously
AsyncStorage.getItem('appLanguage').then((language) => {
  if (language && availableLanguages.includes(language)) {
    i18n.changeLanguage(language);
  }
});

// Function to set language in AsyncStorage and update i18n language
export const setAppLanguage = async (language) => {
  if (availableLanguages.includes(language)) {
    await AsyncStorage.setItem('appLanguage', language);
    i18n.changeLanguage(language);
  }
};

export default i18n;
