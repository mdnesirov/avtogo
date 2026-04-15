import ListCarForm from '@/components/forms/ListCarForm';
import {getTranslations} from 'next-intl/server';

export default async function ListCarPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'listCar'});
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-2">{t('subtitle')}</p>
      </div>
      <ListCarForm />
    </div>
  );
}
