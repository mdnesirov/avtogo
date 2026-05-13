'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[BookingError]', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-4xl mb-4">📅</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking failed to load</h2>
      <p className="text-gray-500 text-sm mb-6">Something went wrong with your booking. Please go back and try again.</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          Try again
        </button>
        <Link href="/cars" className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
          Browse cars
        </Link>
      </div>
    </div>
  );
}
