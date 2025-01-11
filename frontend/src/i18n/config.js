import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome'
    }
  },
  es: {
    translation: {
      welcome: 'Bienvenido'
    }
  },
  fr: {
    translation: {
      welcome: 'Bienvenue'
    }
  },
  sw: {
    translation: {
      welcome: 'Karibu'
    }
  },
  zh: {
    translation: {
      welcome: '欢迎'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;