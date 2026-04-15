'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';

export default function DashboardClient({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(carId: string) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(carId);
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch (e) {
      alert('Could not delete the listing. Please try again.');
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
        <p className="font-medium">No listings yet</p>
        <a href="/list-car" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">
          Add your first car →
        </a>
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
