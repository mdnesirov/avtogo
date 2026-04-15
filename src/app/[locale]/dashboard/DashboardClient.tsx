'use client';

import { useState } from 'react';
import {Link, useRouter } from '@/i18n/navigation';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import {useTranslations} from 'next-intl';

export default function DashboardClient({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(carId: string) {
    if (!confirm(t('deleteConfirm'))) return;
    setDeleting(carId);
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t('failedToDelete'));
      router.refresh();
    } catch (e) {
      alert(t('couldNotDelete'));
    } finally {
      setDeleting(null);
    }
  }

  function handleEdit(car: Car) {
    router.push(`/list-car/edit/${car.id}`);
  }

  if (cars.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
        <p className="font-medium">{t('noListingsYet')}</p>
        <Link href="/list-car" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">
          {t('addFirstCar')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {cars.map((car) => (
        <div key={car.id} className={deleting === car.id ? 'opacity-50 pointer-events-none' : ''}>
          <CarCard
            car={car}
            showOwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </div>
  );
}
