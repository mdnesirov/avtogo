import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/cars/CarCard';
import CarFiltersComponent from '@/components/cars/CarFilters';
import { Car } from '@/types';
import {getTranslations} from 'next-intl/server';

interface SearchParams {
  location?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
}

export default async function CarsPage({
  params,
  searchParams,
}: {
  params: Promise<{locale: string}>;
  searchParams: Promise<SearchParams>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'cars'});
  const filters = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('cars').select('*').eq('is_available', true);

  if (filters.location) query = query.eq('location', filters.location);
  if (filters.transmission) query = query.eq('transmission', filters.transmission);
  if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType);
  if (filters.minPrice) query = query.gte('price_per_day', Number(filters.minPrice));
  if (filters.maxPrice) query = query.lte('price_per_day', Number(filters.maxPrice));

  const { data: cars, error } = await query.order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('browseCars')}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {t('carsAvailable', {count: cars?.length ?? 0})}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <CarFiltersComponent currentFilters={filters} />
        </aside>

        {/* Car grid */}
        <div className="flex-1">
          {error && (
            <p className="text-red-500 text-sm">{t('failedToLoad')}</p>
          )}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {cars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-xl font-medium mb-2">{t('noCarsFound')}</p>
              <p className="text-sm">{t('adjustFilters')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
