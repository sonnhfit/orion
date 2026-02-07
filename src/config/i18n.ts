import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

// Function to detect browser language
const detectBrowserLanguage = (): string => {
  const savedLanguage = localStorage.getItem('language');
  
  if (savedLanguage) {
    return savedLanguage;
  }
  
  const browserLanguage = navigator.language.split('-')[0];
  const supportedLanguages = ['vi', 'en'];
  
  return supportedLanguages.includes(browserLanguage) ? browserLanguage : 'vi';
};

const resources = {
  en: { translation: en },
  vi: { translation: vi }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectBrowserLanguage(),
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
