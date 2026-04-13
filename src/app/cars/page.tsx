'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Car, CarFilters } from '@/types';
import { CarGrid } from '@/components/cars/CarGrid';
import { CarFiltersPanel } from '@/components/cars/CarFilters';

export default function CarsPage() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CarFilters>({
    location:    searchParams.get('location') || undefined,
    startDate:   searchParams.get('startDate') || undefined,
    endDate:     searchParams.get('endDate') || undefined,
  });

  const fetchCars = useCallback(async (f: CarFilters) => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('cars')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (f.location)     query = query.eq('location', f.location);
    if (f.transmission) query = query.eq('transmission', f.transmission);
    if (f.fuelType)     query = query.eq('fuel_type', f.fuelType);
    if (f.minPrice)     query = query.gte('price_per_day', f.minPrice);
    if (f.maxPrice)     query = query.lte('price_per_day', f.maxPrice);
    if (f.airportDelivery) query = query.eq('airport_delivery', true);

    const { data, error } = await query;
    if (!error && data) setCars(data as Car[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCars(filters); }, [filters, fetchCars]);

  return (
    <div className="pt-16 min-h-screen">
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Available cars</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Searching...' : `${cars.length} car${cars.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Filters sidebar */}
          <CarFiltersPanel filters={filters} onChange={setFilters} />

          {/* Results */}
          <CarGrid
            cars={cars}
            loading={loading}
            emptyMessage="Try adjusting your filters or expanding your search area."
          />
        </div>
      </div>
    </div>
  );
}
