'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DashboardError]', error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-4xl mb-4">📋</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard failed to load</h2>
      <p className="text-gray-500 text-sm mb-6">We couldn\'t load your bookings or listings. Try refreshing.</p>
      <button
        onClick={reset}
        className="bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}
