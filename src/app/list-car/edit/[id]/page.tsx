import EditCarForm from '@/components/forms/EditCarForm';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import EditCarPageClient from './page.client';

export const metadata = {
  title: 'Edit Listing — AvtoGo',
};

export default async function EditCarPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: car } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .eq('owner_id', user.id)
    .single();

  if (!car) notFound();

  return (
    <EditCarPageClient>
      <EditCarForm car={car} />
    </EditCarPageClient>
  );
}
