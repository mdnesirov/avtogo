import { createClient } from '@/lib/supabase/server';
import BrowseCarsPage from '@/components/cars/BrowseCarsPage';

interface SearchParams {
  location?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: string;
  maxPrice?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // FIX: was eq('is_available', true) — column is is_active
  let query = supabase.from('cars').select('*').eq('is_active', true);

  if (params.location) query = query.eq('location', params.location);
  if (params.transmission) query = query.eq('transmission', params.transmission);
  if (params.fuelType) query = query.eq('fuel_type', params.fuelType);
  if (params.minPrice) query = query.gte('price_per_day', Number(params.minPrice));
  if (params.maxPrice) query = query.lte('price_per_day', Number(params.maxPrice));

  const { data: cars, error } = await query.order('created_at', { ascending: false });

  return (
    <BrowseCarsPage cars={cars} error={!!error} params={params} />
  );
}
