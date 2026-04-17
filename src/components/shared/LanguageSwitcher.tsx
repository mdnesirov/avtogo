'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { languageNames, supportedLanguages } from '@/lib/i18n/translations';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="px-2.5 py-1.5 rounded-md border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label={t('language')}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {lang.toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
          {supportedLanguages.map((option) => (
            <button
              key={option}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                option === lang ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => {
                setLang(option);
                setIsOpen(false);
              }}
            >
              {option.toUpperCase()} · {languageNames[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
