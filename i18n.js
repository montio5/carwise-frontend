import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import fa from "./locales/fa";
import AsyncStorage from "@react-native-async-storage/async-storage";

const resources = { en: { translation: en }, fa: { translation: fa } };
const fallbackLng = ["fa"];
const availableLanguages = ["en", "fa"];

// Function to set language in AsyncStorage and update i18n language
export const setAppLanguage = async (language) => {
  await AsyncStorage.setItem('appLanguage', language);
  i18n.changeLanguage(language);
};

// Initialize i18n with the selected language from AsyncStorage or default to "fa"
AsyncStorage.getItem('appLanguage').then((language) => {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      resources,
      fallbackLng,
      lng: language || "fa",
      supportedLngs: availableLanguages,
      interpolation: {
        escapeValue: false,
      },
    });
});

export default i18n;
