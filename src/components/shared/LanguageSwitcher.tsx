'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing, Locale} from '@/i18n/routing';

const localeMeta: Record<Locale, {flag: string; label: string}> = {
  en: {flag: '🇬🇧', label: 'EN'},
  az: {flag: '🇦🇿', label: 'AZ'},
  ru: {flag: '🇷🇺', label: 'RU'}
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="locale-switcher">Language</label>
      <select
        id="locale-switcher"
        value={locale}
        onChange={(event) => router.replace(pathname, {locale: event.target.value as Locale})}
        className="text-sm font-medium border border-gray-200 rounded-lg px-2.5 py-2 text-gray-700 bg-white hover:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
      >
        {routing.locales.map((entry) => (
          <option key={entry} value={entry}>
            {localeMeta[entry].flag} {localeMeta[entry].label}
          </option>
        ))}
      </select>
    </div>
  );
}
