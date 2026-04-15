import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircle, Calendar, Car, Phone } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { BookingStatusBadge } from '@/components/shared/Badge';

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; booking_id?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let booking = null;
  if (params.session_id) {
    const { data } = await supabase
      .from('bookings')
      .select('*, car:cars(*)')
      .eq('stripe_session_id', params.session_id)
      .single();
    booking = data;
  } else if (params.booking_id || params.id) {
    const { data } = await supabase
      .from('bookings')
      .select('*, car:cars(*)')
      .eq('id', params.booking_id || params.id)
      .single();
    booking = data;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
      <p className="text-gray-500 mb-8">Your booking request has been submitted. The owner will confirm shortly.</p>

      {booking && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{booking.car?.brand} {booking.car?.model}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Calendar size={14} /> {formatDate(booking.start_date)} → {formatDate(booking.end_date)}</div>
            <div className="flex items-center gap-2"><Car size={14} /> {booking.driver_name}</div>
            <div className="flex items-center gap-2"><Phone size={14} /> {booking.driver_phone}</div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="font-bold text-gray-900">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
          View my bookings
        </Link>
        <Link href="/cars" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Browse more cars
        </Link>
      </div>
    </div>
  );
}
