import { createClient } from '@/lib/supabase/server';
import { Car } from '@/types';
import HomePageContent from './HomePageContent';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <HomePageContent featuredCars={(featuredCars ?? []) as Car[]} />
  );
}
