'use client';

import { useState } from 'react';
import { Car } from '@/types';
import Badge from '@/components/shared/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface MyCarsProps {
  cars: Car[];
  onRefresh: () => void;
}

export default function MyCars({ cars, onRefresh }: MyCarsProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(tx.dashboardDeleteConfirm)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/cars?id=${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleAvailability(car: Car) {
    setTogglingId(car.id);
    try {
      await fetch(`/api/cars?id=${car.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !car.is_active }),
      });
      onRefresh();
    } finally {
      setTogglingId(null);
    }
  }

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{tx.myCarsNoListings}</h3>
        <p className="text-sm text-gray-500 mb-4">{tx.myCarsAddFirst}</p>
        <a href="/list-car"
          className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors">
          {tx.myCarsListCar}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cars.map((car) => (
        <div key={car.id} className="flex gap-4 p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
          {/* Cover image */}
          <div className="w-24 h-18 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
            {car.images[0] ? (
              <img src={car.images[0]} alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="11" rx="2" /><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" /></svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{car.brand} {car.model} ({car.year})</h3>
                <p className="text-sm text-gray-500">{car.location} · ₼{car.price_per_day}/day</p>
              </div>
              <Badge
                variant={car.is_active ? 'green' : 'gray'}
                label={car.is_active ? tx.myCarsAvailable : tx.myCarsHidden}
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <a href={`/cars/${car.id}`} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors">
                {tx.myCarsView}
              </a>
              <button
                onClick={() => handleToggleAvailability(car)}
                disabled={togglingId === car.id}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {togglingId === car.id ? '...' : car.is_active ? tx.myCarsHide : tx.myCarsUnhide}
              </button>
              <button
                onClick={() => handleDelete(car.id)}
                disabled={deletingId === car.id}
                className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 ml-auto"
              >
                {deletingId === car.id ? tx.myCarsDeleting : tx.myCarsDelete}
              </button>
            </div>
          </div>
        </div>
      ))}

      <a href="/list-car"
        className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-400 rounded-2xl py-4 text-sm font-medium transition-colors">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        {tx.myCarsAddAnother}
      </a>
    </div>
  );
}
