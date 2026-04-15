'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car } from '@/types';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';
import BookingSummary from '@/components/booking/BookingSummary';

export default function BookingPageContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId');

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(searchParams.get('from') || '');
  const [endDate, setEndDate] = useState(searchParams.get('to') || '');
  const [bookedRanges, setBookedRanges] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    if (!carId) return;
    async function fetchCar() {
      try {
        const res = await fetch(`/api/cars?id=${carId}`);
        const data = await res.json();
        setCar(data.car);
        setBookedRanges(data.bookedRanges || []);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [carId]);

  if (!carId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No car selected. <a href="/cars" className="text-green-600 underline">Browse cars</a>.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent" />
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Car not found. <a href="/cars" className="text-green-600 underline">Browse cars</a>.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <a href={`/cars/${car.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to {car.brand} {car.model}
        </a>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Complete your booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: calendar + driver form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">1. Select rental dates</h2>
              <BookingCalendar
                bookedRanges={bookedRanges}
                selectedStart={startDate}
                selectedEnd={endDate}
                onSelectStart={setStartDate}
                onSelectEnd={setEndDate}
              />
              {startDate && endDate && (
                <p className="text-sm text-green-700 mt-2 font-medium">
                  ✓ {startDate} → {endDate}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">2. Driver information</h2>
              <BookingForm
                car={car}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Price breakdown</h2>
            <BookingSummary car={car} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </main>
  );
}
