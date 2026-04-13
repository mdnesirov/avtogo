'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const carName = params.get('carName') || 'your car';
  const start = params.get('start') || '';
  const end = params.get('end') || '';
  const total = params.get('total') || '0';

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '';

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Your request for <span className="font-medium text-gray-800">{decodeURIComponent(carName)}</span> has been submitted.
          The owner will contact you shortly to confirm.
        </p>

        {/* Booking details card */}
        <div className="border border-gray-200 rounded-2xl p-6 text-left mb-6 space-y-3">
          {bookingId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Booking ID</span>
              <span className="font-mono text-gray-800 text-xs">{bookingId.slice(0, 13)}...</span>
            </div>
          )}
          {start && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pick-up</span>
              <span className="font-medium text-gray-900">{formatDate(start)}</span>
            </div>
          )}
          {end && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Return</span>
              <span className="font-medium text-gray-900">{formatDate(end)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-green-600">₼{parseFloat(total).toFixed(2)}</span>
          </div>
        </div>

        {/* WhatsApp follow-up */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '994'}?text=${encodeURIComponent(`Hi! I just booked ${decodeURIComponent(carName)} on AvtoGo (Booking ID: ${bookingId?.slice(0,8)}). Looking forward to confirming the details!`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl px-6 py-3 transition-colors mb-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Message Owner on WhatsApp
        </a>

        <div className="flex gap-3">
          <Link
            href="/cars"
            className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-700 font-medium rounded-xl px-4 py-2.5 text-sm transition-colors text-center"
          >
            Browse more cars
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-colors text-center"
          >
            My bookings
          </Link>
        </div>
      </div>
    </main>
  );
}
