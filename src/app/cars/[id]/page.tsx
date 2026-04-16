import { createClient } from '@/lib/supabase/server';
import CarDetailContent from '@/components/cars/CarDetailContent';

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from('cars')
    .select('*, owner:profiles(*)')
    .eq('id', id)
    .single();

  // Pass car (or null) to the client component which handles the not-found state
  // in the active language instead of using Next.js notFound() (which is always English)
  return <CarDetailContent car={car ?? null} />;
}
