'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Car, Booking } from '@/types';
import MyCars from '@/components/dashboard/MyCars';
import MyBookings from '@/components/dashboard/MyBookings';

type Tab = 'my-cars' | 'bookings-received' | 'my-bookings';

export default function DashboardPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const justListed = searchParams.get('listed') === 'true';

  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('my-cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(justListed);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function fetchData() {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch owner's cars
      const { data: carsData } = await supabase
        .from('cars')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
      setCars((carsData as Car[]) || []);

      // Fetch bookings received on owner's cars
      const carIds = (carsData || []).map((c: Car) => c.id);
      if (carIds.length > 0) {
        const { data: recvd } = await supabase
          .from('bookings')
          .select('*, car:cars(*)')
          .in('car_id', carIds)
          .order('created_at', { ascending: false });
        setReceivedBookings((recvd as Booking[]) || []);
      } else {
        setReceivedBookings([]);
      }

      // Fetch bookings made by this user as renter
      const { data: mine } = await supabase
        .from('bookings')
        .select('*, car:cars(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setMyBookings((mine as Booking[]) || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [userId]);

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'my-cars', label: 'My Cars', count: cars.length },
    { id: 'bookings-received', label: 'Bookings Received', count: receivedBookings.filter(b => b.status === 'pending').length || undefined },
    { id: 'my-bookings', label: 'My Rentals', count: myBookings.length || undefined },
  ];

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">You need to be signed in to view your dashboard.</p>
          <a href="/auth/login" className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-colors">
            Sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Success banner */}
        {showBanner && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 mb-6">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div>
                <p className="font-semibold text-sm">Your car was listed successfully!</p>
                <p className="text-xs text-green-600">It's now visible to renters across Azerbaijan.</p>
              </div>
            </div>
            <button onClick={() => setShowBanner(false)} aria-label="Dismiss" className="text-green-600 hover:text-green-800">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <a href="/list-car"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            List a car
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total listings', value: cars.length },
            { label: 'Bookings received', value: receivedBookings.length },
            { label: 'My rentals', value: myBookings.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg py-2 transition-all ${
                tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                  tab === t.id ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent" />
            </div>
          ) : (
            <>
              {tab === 'my-cars' && <MyCars cars={cars} onRefresh={fetchData} />}
              {tab === 'bookings-received' && <MyBookings bookings={receivedBookings} mode="owner" />}
              {tab === 'my-bookings' && <MyBookings bookings={myBookings} mode="renter" />}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
