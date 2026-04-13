import { createClient } from '@/lib/supabase/server';
import CarCard from '@/components/cars/CarCard';
import CarFiltersComponent from '@/components/cars/CarFilters';
import { Car } from '@/types';

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
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('cars').select('*').eq('is_available', true);

  if (params.location) query = query.eq('location', params.location);
  if (params.transmission) query = query.eq('transmission', params.transmission);
  if (params.fuelType) query = query.eq('fuel_type', params.fuelType);
  if (params.minPrice) query = query.gte('price_per_day', Number(params.minPrice));
  if (params.maxPrice) query = query.lte('price_per_day', Number(params.maxPrice));

  const { data: cars, error } = await query.order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Cars</h1>
        <p className="text-gray-500 text-sm mt-1">
          {cars?.length ?? 0} cars available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0">
          <CarFiltersComponent currentFilters={params} />
        </aside>

        {/* Car grid */}
        <div className="flex-1">
          {error && (
            <p className="text-red-500 text-sm">Failed to load cars. Please try again.</p>
          )}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {cars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p className="text-xl font-medium mb-2">No cars found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
