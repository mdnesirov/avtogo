'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types';
import { BookingStatusBadge } from '@/components/shared/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';

interface MyBookingsProps {
  bookings: Booking[];
  mode: 'renter' | 'owner';
  onRefresh?: () => void;
}

type MutableStatus = 'confirmed' | 'cancelled';

const t: Record<Lang, Record<string, string>> = {
  en: {
    noBookings: 'No bookings yet',
    renterHint: 'Find a car to get started.',
    ownerHint: 'Bookings will appear here once renters reserve your cars.',
    browseCars: 'Browse cars',
    listingRemoved: 'Car listing removed',
    days: 'day',
    renter: 'Renter',
    note: 'Note',
    confirm: 'Confirm',
    cancel: 'Cancel',
    confirming: 'Confirming...',
    cancelling: 'Cancelling...',
    updateFailed: 'Could not update booking. Please try again.',
  },
  ru: {
    noBookings: 'Пока нет бронирований',
    renterHint: 'Найдите автомобиль, чтобы начать.',
    ownerHint: 'Здесь появятся бронирования ваших автомобилей.',
    browseCars: 'Смотреть авто',
    listingRemoved: 'Объявление удалено',
    days: 'дн.',
    renter: 'Арендатор',
    note: 'Заметка',
    confirm: 'Подтвердить',
    cancel: 'Отменить',
    confirming: 'Подтверждение...',
    cancelling: 'Отмена...',
    updateFailed: 'Не удалось обновить бронирование. Попробуйте снова.',
  },
  az: {
    noBookings: 'Hələ bron yoxdur',
    renterHint: 'Başlamaq üçün avtomobil tapın.',
    ownerHint: 'İcarəçilər avtomobilinizi bron etdikdə burada görünəcək.',
    browseCars: 'Avtomobillərə bax',
    listingRemoved: 'Elan silinib',
    days: 'gün',
    renter: 'İcarəçi',
    note: 'Qeyd',
    confirm: 'Təsdiqlə',
    cancel: 'Ləğv et',
    confirming: 'Təsdiqlənir...',
    cancelling: 'Ləğv edilir...',
    updateFailed: 'Bronu yeniləmək mümkün olmadı. Yenidən cəhd edin.',
  },
};

export default function MyBookings({ bookings, mode, onRefresh }: MyBookingsProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const tx = t[lang];
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(bookingId: string, status: MutableStatus) {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('status-update-failed');
      if (onRefresh) onRefresh();
      else router.refresh();
    } catch {
      alert(tx.updateFailed);
    } finally {
      setUpdatingId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{tx.noBookings}</h3>
        <p className="text-sm text-gray-500">
          {mode === 'renter'
            ? tx.renterHint
            : tx.ownerHint}
        </p>
        {mode === 'renter' && (
          <a href="/cars" className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors">
            {tx.browseCars}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const car = booking.car;
        const nights = car
          ? Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000)
          : 0;

        return (
          <div key={booking.id} className="flex gap-4 p-4 border border-gray-200 rounded-2xl">
            {car?.images[0] && (
              <img src={car.images[0]} alt={`${car.brand} ${car.model}`}
                className="w-20 h-14 object-cover rounded-xl flex-shrink-0" loading="lazy" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 truncate">
                    {car ? `${car.brand} ${car.model}` : tx.listingRemoved}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(booking.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {new Date(booking.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{nights} {tx.days}
                  </p>
                  {mode === 'owner' && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tx.renter}: <span className="font-medium text-gray-800">{booking.user?.full_name || booking.driver_name}</span>
                      {(booking.user?.phone || booking.driver_phone) ? ` · ${booking.user?.phone || booking.driver_phone}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <BookingStatusBadge status={booking.status} />
                  <span className="text-sm font-bold text-gray-900">₼{booking.total_price.toFixed(2)}</span>
                </div>
              </div>
              {booking.notes && (
                <p className="text-xs text-gray-400 mt-2 truncate">{tx.note}: {booking.notes}</p>
              )}
              {mode === 'owner' && booking.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    disabled={updatingId === booking.id}
                    className="text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {updatingId === booking.id ? tx.confirming : tx.confirm}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    disabled={updatingId === booking.id}
                    className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {updatingId === booking.id ? tx.cancelling : tx.cancel}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
