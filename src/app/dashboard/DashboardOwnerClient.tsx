'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MyCars from '@/components/dashboard/MyCars';
import MyBookings from '@/components/dashboard/MyBookings';
import { Car, Booking } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';

interface Props {
  displayName: string;
  email: string;
  cars: Car[];
  incomingBookings: Booking[];
}

const t: Record<Lang, Record<string, string>> = {
  en: {
    welcome: 'Welcome back',
    listCar: 'List a car',
    myListings: 'My Listings',
    incomingBookings: 'Incoming Bookings',
    pendingRequests: 'Pending Requests',
    confirmedTrips: 'Confirmed Trips',
  },
  ru: {
    welcome: 'С возвращением',
    listCar: 'Добавить авто',
    myListings: 'Мои объявления',
    incomingBookings: 'Входящие бронирования',
    pendingRequests: 'Ожидают подтверждения',
    confirmedTrips: 'Подтверждённые поездки',
  },
  az: {
    welcome: 'Yenidən xoş gəldiniz',
    listCar: 'Avtomobil əlavə et',
    myListings: 'Elanlarım',
    incomingBookings: 'Gələn bronlar',
    pendingRequests: 'Gözləyən sorğular',
    confirmedTrips: 'Təsdiqlənmiş səfərlər',
  },
};

export default function DashboardOwnerClient({ displayName, email, cars, incomingBookings }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();
  const tx = t[lang];

  const pendingRequests = incomingBookings.filter((b) => b.status === 'pending' || b.status === 'paid').length;
  const confirmedTrips = incomingBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tx.welcome}, {displayName} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{email}</p>
        </div>
        <Link
          href="/list-car"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> {tx.listCar}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: tx.myListings, value: cars.length },
          { label: tx.pendingRequests, value: pendingRequests },
          { label: tx.confirmedTrips, value: confirmedTrips },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{tx.myListings}</h2>
          <MyCars cars={cars} onRefresh={() => router.refresh()} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{tx.incomingBookings}</h2>
          <MyBookings bookings={incomingBookings} mode="owner" onRefresh={() => router.refresh()} />
        </section>
      </div>
    </div>
  );
}
