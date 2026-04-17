'use client';

import ListCarForm from '@/components/forms/ListCarForm';
import { useLanguage } from '@/context/LanguageContext';

const COPY = {
  az: {
    title: 'Avtomobilini əlavə et',
    subtitle: 'Avtomobil məlumatlarını doldurun və qazanc əldə etməyə başlayın. Elan vermək pulsuzdur.',
  },
  ru: {
    title: 'Разместите свой автомобиль',
    subtitle: 'Заполните данные об автомобиле и начните зарабатывать. Размещение бесплатно.',
  },
  en: {
    title: 'List Your Car',
    subtitle: 'Fill in your car details and start earning. It\'s free to list.',
  },
} as const;

export default function ListCarPageContent() {
  const { lang } = useLanguage();
  const t = COPY[lang];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-gray-500 mt-2">{t.subtitle}</p>
      </div>
      <ListCarForm />
    </div>
  );
}
