'use client';

import { Booking } from '@/types';
import Badge from '@/components/shared/Badge';

interface MyBookingsProps {
  bookings: Booking[];
  mode: 'renter' | 'owner';
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  confirmed: 'success',
  pending: 'warning',
  cancelled: 'error',
  completed: 'default',
};

export default function MyBookings({ bookings, mode }: MyBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">No bookings yet</h3>
        <p className="text-sm text-gray-500">
          {mode === 'renter'
            ? 'Find a car to get started.'
            : 'Bookings will appear here once renters reserve your cars.'}
        </p>
        {mode === 'renter' && (
          <a href="/cars" className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors">
            Browse cars
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
                    {car ? `${car.brand} ${car.model}` : 'Car listing removed'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(booking.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' – '}
                    {new Date(booking.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{nights} day{nights !== 1 ? 's' : ''}
                  </p>
                  {mode === 'owner' && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Renter: <span className="font-medium text-gray-800">{booking.driver_name}</span>
                      {' · '}{booking.driver_phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={STATUS_VARIANT[booking.status] || 'default'}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <span className="text-sm font-bold text-gray-900">₼{booking.total_price.toFixed(2)}</span>
                </div>
              </div>
              {booking.notes && (
                <p className="text-xs text-gray-400 mt-2 truncate">Note: {booking.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
