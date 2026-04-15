'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { BookingStatusBadge } from '@/components/shared/Badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { Check, X, Clock, Bell } from 'lucide-react';

interface Props {
  cars: Car[];
  pendingCarIds: string[];
  incomingBookings: any[];
}

export default function DashboardClient({ cars, pendingCarIds, incomingBookings }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pendingSet = new Set(pendingCarIds);
  const pendingCount = incomingBookings.filter((b) => b.status === 'pending' || b.status === 'paid').length;

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

  async function handleBookingAction(bookingId: string, action: 'confirmed' | 'rejected') {
    setActionLoading(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      router.refresh();
    } catch (e) {
      alert('Could not update booking. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'listings'
              ? 'text-green-700 border-b-2 border-green-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Listings
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'text-green-700 border-b-2 border-green-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell size={14} />
          Booking Requests
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <>
          {cars.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
              <p className="font-medium">No listings yet</p>
              <a href="/list-car" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">
                Add your first car →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className={`relative ${
                    deleting === car.id ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  {/* Pending overlay */}
                  {pendingSet.has(car.id) && (
                    <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm">
                        <Clock size={16} className="text-yellow-600" />
                        <span className="text-yellow-700 text-sm font-semibold">Pending Confirmation</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="text-green-600 text-xs underline hover:text-green-700"
                      >
                        View request →
                      </button>
                    </div>
                  )}
                  <CarCard
                    car={car}
                    showOwnerActions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Requests Tab */}
      {activeTab === 'requests' && (
        <>
          {incomingBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
              <Bell size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No booking requests yet</p>
              <p className="text-xs mt-1">When someone books your car, it will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    booking.status === 'pending' || booking.status === 'paid'
                      ? 'border-yellow-200 bg-yellow-50/30'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {booking.car?.images?.[0] && (
                      <img
                        src={booking.car.images[0]}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        className="w-16 h-12 object-cover rounded-xl"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.car?.brand} {booking.car?.model} {booking.car?.year}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Renter: <span className="font-medium text-gray-700">{booking.driver_name}</span>
                        {booking.driver_phone && ` · ${booking.driver_phone}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right mr-2">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(booking.total_price)}</p>
                      <BookingStatusBadge status={booking.status} />
                    </div>

                    {(booking.status === 'pending' || booking.status === 'paid') && (
                      <>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'confirmed')}
                          disabled={actionLoading === booking.id}
                          className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Check size={14} /> Confirm
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'rejected')}
                          disabled={actionLoading === booking.id}
                          className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <X size={14} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
