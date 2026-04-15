import EditCarForm from '@/components/forms/EditCarForm';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';

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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        <p className="text-gray-500 mt-2">Update your car details below.</p>
      </div>
      <EditCarForm car={car} />
    </div>
  );
}
