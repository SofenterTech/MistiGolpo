import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'bn' | 'en';

const STORAGE_KEY = 'mistigolpo-lang';
const DEFAULT_LANGUAGE: Language = 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (bnText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const readSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'bn' ? saved : DEFAULT_LANGUAGE;
  } catch {
    // localStorage can throw in private mode / blocked storage
    return DEFAULT_LANGUAGE;
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readSavedLanguage);

  // Remember the choice across reloads/direct links, and keep <html lang> in sync
  // so the browser picks the right font shaping, hyphenation and screen-reader voice.
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  // Keep several open tabs in step with each other.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'bn' || e.newValue === 'en')) {
        setLanguageState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  const toggleLanguage = useCallback(
    () => setLanguageState((prev) => (prev === 'bn' ? 'en' : 'bn')),
    []
  );

  // Fall back to the other language when one side is missing (e.g. a product
  // saved without an English description) instead of rendering a blank.
  const t = useCallback(
    (bnText: string, enText: string) =>
      language === 'bn' ? bnText || enText : enText || bnText,
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
