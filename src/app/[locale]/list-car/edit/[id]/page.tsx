import EditCarForm from '@/components/forms/EditCarForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import {redirect} from '@/i18n/navigation';
import {getTranslations} from 'next-intl/server';

export default async function EditCarPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const {locale, id} = await params;
  const t = await getTranslations({locale, namespace: 'editCar'});
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect({href: '/auth/login', locale});
  const userId = user!.id;

  const { data: car } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (!car) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-2">{t('subtitle')}</p>
      </div>
      <EditCarForm car={car} />
    </div>
  );
}
