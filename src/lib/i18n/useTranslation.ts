'use client';

import { useCallback, useEffect, useState } from 'react';
import { defaultLanguage, isSupportedLanguage, Language, translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'avtogo-lang';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) {
    return stored;
  }

  return defaultLanguage;
}

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LANGUAGE_STORAGE_KEY) {
        return;
      }

      if (isSupportedLanguage(event.newValue)) {
        setLangState(event.newValue);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      // Notify already-mounted client components that still subscribe to language changes in-tab.
      window.dispatchEvent(new Event('langchange'));
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] ?? translations[defaultLanguage][key] ?? key;
  }, [lang]);

  return { t, lang, setLang };
}

export { LANGUAGE_STORAGE_KEY };
