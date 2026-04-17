'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'az' | 'ru' | 'en';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'az',
  setLang: () => {},
});

function isValidLang(value: string | null): value is Lang {
  return value === 'az' || value === 'ru' || value === 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('az');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('avtogo-lang') ?? localStorage.getItem('lang');
      if (isValidLang(stored)) setLangState(stored);
    } catch {}
  }, []);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
    try {
      localStorage.setItem('avtogo-lang', nextLang);
      localStorage.setItem('lang', nextLang);
    } catch {}
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { LanguageContext };
