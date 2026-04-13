'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Car, CarFilters } from '@/types';

export function useCars(filters?: CarFilters) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      let query = supabase
        .from('cars')
        .select('*, owner:profiles(id, full_name, phone, whatsapp)')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price_per_day', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price_per_day', filters.maxPrice);
      }
      if (filters?.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters?.fuelType) {
        query = query.eq('fuel_type', filters.fuelType);
      }
      if (filters?.airportDelivery) {
        query = query.eq('airport_delivery', true);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setCars(data as Car[]);
      }
      setLoading(false);
    }

    fetchCars();
  }, [
    filters?.location,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.transmission,
    filters?.fuelType,
    filters?.airportDelivery,
  ]);

  return { cars, loading, error };
}
