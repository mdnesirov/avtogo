'use client';

import { ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function EditCarPageClient({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const tx = translations[lang];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{tx.editListingTitle}</h1>
        <p className="text-gray-500 mt-2">{tx.editListingSubtitle}</p>
      </div>
      {children}
    </div>
  );
}
