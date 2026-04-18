'use client';

import CarCard from '@/components/cars/CarCard';
import CarFiltersComponent from '@/components/cars/CarFilters';
import { Car } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';
import { Car as CarIcon, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

const t: Record<Lang, Record<string, string>> = {
  en: {
    title: 'Browse Cars',
    available: 'cars available',
    noFound: 'No cars match your filters',
    adjustFilters: 'Try adjusting or clearing your filters to see more results.',
    loadError: 'Failed to load cars. Please try again.',
    listCta: 'List your car',
    filters: 'Filters',
  },
  ru: {
    title: 'Поиск автомобилей',
    available: 'авто доступно',
    noFound: 'Автомобили не найдены',
    adjustFilters: 'Попробуйте изменить фильтры',
    loadError: 'Не удалось загрузить автомобили. Попробуйте снова.',
    listCta: 'Разместить авто',
    filters: 'Фильтры',
  },
  az: {
    title: 'Avtomobilləri axtar',
    available: 'avtomobil mövcuddur',
    noFound: 'Avtomobil tapılmadı',
    adjustFilters: 'Filtrləri dəyişməyə cəhd edin',
    loadError: 'Avtomobillər yüklənmədi. Yenidən cəhd edin.',
    listCta: 'Avtomobil yerləşdir',
    filters: 'Filtrlər',
  },
};

interface Props {
  cars: Car[] | null;
  error: boolean;
  params: Record<string, string | undefined>;
}

export default function BrowseCarsPage({ cars, error, params }: Props) {
  const { lang } = useLanguage();
  const tx = t[lang];

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'var(--font-display)'}}>{tx.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="font-semibold text-green-700">{cars?.length ?? 0}</span> {tx.available}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="flex items-center gap-2 mb-3 lg:hidden">
              <SlidersHorizontal size={15} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">{tx.filters}</span>
            </div>
            <CarFiltersComponent currentFilters={params} />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
                <p className="text-red-600 text-sm">{tx.loadError}</p>
              </div>
            )}

            {cars && cars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cars.map((car: Car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CarIcon size={28} className="text-gray-300" />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">{tx.noFound}</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">{tx.adjustFilters}</p>
                <Link
                  href="/list-car"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-colors"
                >
                  {tx.listCta} →
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
