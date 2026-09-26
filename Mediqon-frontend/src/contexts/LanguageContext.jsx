import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', label: 'हिंदी' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', label: 'తెలుగు' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mediqon_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('mediqon_language', language);
  }, [language]);

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguage(langCode);
    }
  };

  const t = (key, fallback) => {
    const langDict = translations[language] || translations.en;
    if (langDict[key] !== undefined) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
