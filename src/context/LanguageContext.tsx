'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Lang } from '@/lib/i18n/types';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isValidLang(value: string | null): value is Lang {
  return value === 'az' || value === 'ru' || value === 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('az');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('avtogo-lang') ?? localStorage.getItem('lang');
      if (isValidLang(stored)) setLangState(stored);
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
    try {
      localStorage.setItem('avtogo-lang', nextLang);
      localStorage.setItem('lang', nextLang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
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

export { LanguageContext };
