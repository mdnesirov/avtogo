'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LANG_MAP: Record<string, string> = { az: 'az', ru: 'ru', en: 'en' };

/**
 * Syncs the <html lang="..."> attribute to the active language.
 * Must be rendered inside LanguageProvider (inside <body>).
 */
export function HtmlLangSync() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = LANG_MAP[lang] ?? 'az';
  }, [lang]);

  return null;
}
