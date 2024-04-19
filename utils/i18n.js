import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import en from '../locales/en.json';
import fa from '../locales/fa.json';

const locales = RNLocalize.getLocales();
if (locales && locales.length) {
  i18n.locale = locales[0].languageTag;
} else {
  i18n.locale = 'en';
}

i18n.translations = { en, fa };
i18n.fallbacks = true;
i18n.defaultLocale = 'en';

export default i18n;