'use client';

import CarCard from '@/components/cars/CarCard';
import CarFiltersComponent from '@/components/cars/CarFilters';
import { Car } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';

const t: Record<Lang, Record<string, string>> = {
  en: {
    title: 'Browse Cars',
    available: 'cars available',
    noFound: 'No cars found',
    adjustFilters: 'Try adjusting your filters',
    loadError: 'Failed to load cars. Please try again.',
  },
  ru: {
    title: 'Поиск автомобилей',
    available: 'авто доступно',
    noFound: 'Автомобили не найдены',
    adjustFilters: 'Попробуйте изменить фильтры',
    loadError: 'Не удалось загрузить автомобили. Попробуйте снова.',
  },
  az: {
    title: 'Avtomobilləri axtar',
    available: 'avtomobil mövcuddur',
    noFound: 'Avtomobil tapılmadı',
    adjustFilters: 'Filtrləri dəyişməyə cəhd edin',
    loadError: 'Avtomobillər yüklənmədi. Yenidən cəhd edin.',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{tx.title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {cars?.length ?? 0} {tx.available}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <CarFiltersComponent currentFilters={params} />
        </aside>

        <div className="flex-1">
          {error && (
            <p className="text-red-500 text-sm">{tx.loadError}</p>
          )}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {cars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-xl font-medium mb-2">{tx.noFound}</p>
              <p className="text-sm">{tx.adjustFilters}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
