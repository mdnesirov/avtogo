'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CarCard from '@/components/cars/CarCard';
import { Car } from '@/types';
import { BookingStatusBadge } from '@/components/shared/Badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { Check, X, Clock, Bell, Car as CarIcon, CalendarCheck, ChevronRight, AlertCircle } from 'lucide-react';

type BookingStatusFilter = 'all' | 'pending' | 'confirmed' | 'rejected' | 'cancelled';
type Tab = 'listings' | 'requests' | 'my-bookings';

interface Props {
  cars: Car[];
  pendingCarIds: string[];
  incomingBookings: any[];
  myBookings: any[];
}

function statusBorderClass(status: string) {
  if (status === 'pending' || status === 'paid') return 'border-yellow-200 bg-yellow-50/40';
  if (status === 'confirmed') return 'border-green-200 bg-green-50/30';
  if (status === 'rejected') return 'border-red-100 bg-red-50/20';
  if (status === 'cancelled') return 'border-gray-200 bg-gray-50/40';
  return 'border-gray-100';
}

export default function DashboardClient({ cars, pendingCarIds, incomingBookings, myBookings }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('all');
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const pendingSet = new Set(pendingCarIds);
  const pendingCount = incomingBookings.filter((b) => b.status === 'pending' || b.status === 'paid').length;

  const filteredMyBookings = statusFilter === 'all'
    ? myBookings
    : myBookings.filter((b) => {
        if (statusFilter === 'pending') return b.status === 'pending' || b.status === 'paid';
        return b.status === statusFilter;
      });

  async function handleDelete(carId: string) {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(carId);
    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch {
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
    } catch {
      alert('Could not update booking. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(bookingId: string) {
    setActionLoading(bookingId);
    setCancelConfirm(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to cancel booking');
      router.refresh();
    } catch {
      alert('Could not cancel the booking. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'listings', label: 'My Listings', icon: <CarIcon size={14} /> },
    { id: 'requests', label: 'Booking Requests', icon: <Bell size={14} />, badge: pendingCount },
    { id: 'my-bookings', label: 'My Bookings', icon: <CalendarCheck size={14} />, badge: myBookings.filter(b => b.status === 'pending' || b.status === 'paid').length },
  ];

  const filterOptions: { id: BookingStatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Awaiting Confirmation' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div>
      {/* Cancel confirmation modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Cancel Booking?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. The booking will be marked as cancelled and the owner will be notified.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(cancelConfirm)}
                disabled={actionLoading === cancelConfirm}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading === cancelConfirm ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-green-700 border-green-600'
                : 'text-gray-500 border-transparent hover:text-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── MY LISTINGS ── */}
      {activeTab === 'listings' && (
        cars.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
            <CarIcon size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No listings yet</p>
            <a href="/list-car" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">Add your first car →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car) => (
              <div key={car.id} className={`relative ${deleting === car.id ? 'opacity-50 pointer-events-none' : ''}`}>
                {pendingSet.has(car.id) && (
                  <div className="absolute inset-0 z-10 bg-white/75 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm">
                      <Clock size={16} className="text-yellow-600" />
                      <span className="text-yellow-700 text-sm font-semibold">Pending Confirmation</span>
                    </div>
                    <button onClick={() => setActiveTab('requests')} className="text-green-600 text-xs underline hover:text-green-700 flex items-center gap-1">
                      Review request <ChevronRight size={12} />
                    </button>
                  </div>
                )}
                <CarCard car={car} showOwnerActions onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )
      )}

      {/* ── BOOKING REQUESTS (owner view) ── */}
      {activeTab === 'requests' && (
        incomingBookings.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No booking requests yet</p>
            <p className="text-xs mt-1">When someone books your car, it will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomingBookings.map((booking) => (
              <div key={booking.id} className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${statusBorderClass(booking.status)}`}>
                <div className="flex items-center gap-4">
                  {booking.car?.images?.[0] && (
                    <img src={booking.car.images[0]} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{booking.car?.brand} {booking.car?.model} {booking.car?.year}</p>
                    <p className="text-gray-500 text-xs mt-0.5">📅 {formatDate(booking.start_date)} — {formatDate(booking.end_date)}</p>
                    <p className="text-gray-500 text-xs">👤 {booking.driver_name}{booking.driver_phone && ` · ${booking.driver_phone}`}</p>
                    {booking.notes && <p className="text-gray-400 text-xs italic mt-0.5">"{booking.notes}"</p>}
                    {booking.cancelled_by === 'renter' && (
                      <p className="text-gray-400 text-xs mt-0.5">⚠️ Cancelled by renter</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatPrice(booking.total_price)}</p>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  {(booking.status === 'pending' || booking.status === 'paid') && (
                    <div className="flex gap-2">
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
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => setCancelConfirm(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="flex items-center gap-1.5 bg-gray-100 text-gray-600 border border-gray-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <X size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── MY BOOKINGS (renter view) ── */}
      {activeTab === 'my-bookings' && (
        <div>
          {/* Status filter pills */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                  statusFilter === f.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-70">
                  ({f.id === 'all' ? myBookings.length : myBookings.filter((b) => {
                    if (f.id === 'pending') return b.status === 'pending' || b.status === 'paid';
                    return b.status === f.id;
                  }).length})
                </span>
              </button>
            ))}
          </div>

          {filteredMyBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400">
              <CalendarCheck size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookings in this category</p>
              <a href="/cars" className="text-green-600 text-sm mt-1 inline-block hover:text-green-700">Browse cars →</a>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMyBookings.map((booking) => (
                <div key={booking.id} className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${statusBorderClass(booking.status)}`}>
                  <div className="flex items-center gap-4">
                    {booking.car?.images?.[0] && (
                      <img src={booking.car.images[0]} alt="" className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{booking.car?.brand} {booking.car?.model} {booking.car?.year}</p>
                      <p className="text-gray-500 text-xs mt-0.5">📅 {formatDate(booking.start_date)} — {formatDate(booking.end_date)}</p>
                      <p className="text-gray-400 text-xs">{formatPrice(booking.car?.price_per_day ?? 0)} / day</p>
                      {booking.car?.requires_deposit && booking.car?.deposit_amount && (
                        <p className="text-amber-600 text-xs font-medium mt-0.5">🔒 Deposit: {formatPrice(booking.car.deposit_amount)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(booking.total_price)}</p>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                    {(booking.status === 'pending' || booking.status === 'paid') && (
                      <div className="flex flex-col gap-2">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-700 font-medium flex items-center gap-1.5">
                          <Clock size={13} /> Awaiting owner
                        </div>
                        <button
                          onClick={() => setCancelConfirm(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex flex-col gap-2">
                        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700 font-medium flex items-center gap-1.5">
                          <Check size={13} /> Confirmed!
                        </div>
                        <button
                          onClick={() => setCancelConfirm(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="bg-gray-100 text-gray-500 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    )}
                    {booking.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
                        <X size={13} /> Declined
                      </div>
                    )}
                    {booking.status === 'cancelled' && (
                      <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 font-medium flex items-center gap-1.5">
                        <X size={13} /> Cancelled{booking.cancelled_by === 'owner' ? ' by owner' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
