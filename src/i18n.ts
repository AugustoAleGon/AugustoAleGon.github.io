import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, es } from './content/translations';

function initialLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (query === 'en' || query === 'es') return query;
  try {
    return localStorage.getItem('portfolio.language.v1') === 'es' ? 'es' : 'en';
  } catch {
    return 'en';
  }
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
