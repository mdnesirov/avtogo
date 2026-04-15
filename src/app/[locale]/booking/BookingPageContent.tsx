'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car } from '@/types';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';
import BookingSummary from '@/components/booking/BookingSummary';
import {Link} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';

export default function BookingPageContent() {
  const t = useTranslations('bookingPage');
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
        <p className="text-gray-500">{t('noCarSelected')} <Link href="/cars" className="text-green-600 underline">{t('browseCars')}</Link>.</p>
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
        <p className="text-gray-500">{t('carNotFound')} <Link href="/cars" className="text-green-600 underline">{t('browseCars')}</Link>.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href={`/cars/${car.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          {t('backToCar', {brand: car.brand, model: car.model})}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('completeYourBooking')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: calendar + driver form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">{t('selectRentalDates')}</h2>
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
              <h2 className="text-base font-semibold text-gray-900 mb-3">{t('driverInformation')}</h2>
              <BookingForm
                car={car}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>

          {/* Right: summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <h2 className="text-base font-semibold text-gray-900 mb-3">{t('priceBreakdown')}</h2>
            <BookingSummary car={car} startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </main>
  );
}
