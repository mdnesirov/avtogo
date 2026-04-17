'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';
import DashboardClient from './DashboardClient';
import { Car } from '@/types';

interface DashboardPageClientProps {
  displayName: string;
  email: string;
  stats: {
    listings: number;
    bookings: number;
    pendingRequests: number;
    confirmedTrips: number;
  };
  cars: Car[];
  pendingCarIds: string[];
  incomingBookings: any[];
  myBookings: any[];
}

export default function DashboardPageClient({ displayName, email, stats, cars, pendingCarIds, incomingBookings, myBookings }: DashboardPageClientProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tx.dashboardWelcomeBack}, {displayName} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{email}</p>
        </div>
        <Link
          href="/list-car"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> {tx.dashboardListCar}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: tx.dashboardMyListings, value: stats.listings },
          { label: tx.dashboardMyBookings, value: stats.bookings },
          { label: tx.dashboardPendingRequests, value: stats.pendingRequests },
          { label: tx.dashboardConfirmedTrips, value: stats.confirmedTrips },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <DashboardClient
        cars={cars}
        pendingCarIds={pendingCarIds}
        incomingBookings={incomingBookings}
        myBookings={myBookings}
      />
    </div>
  );
}
