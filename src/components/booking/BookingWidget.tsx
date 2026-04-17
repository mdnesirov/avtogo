'use client';

import { useState } from 'react';
import { Car } from '@/types';
import { formatPrice, calcTotalPrice, today, tomorrow } from '@/lib/utils';
import Button from '@/components/shared/Button';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface BookingWidgetProps {
  car: Car;
}

export default function BookingWidget({ car }: BookingWidgetProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const [step, setStep] = useState<'dates' | 'details' | 'done'>('dates');
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(tomorrow());
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');

  const totalPrice = calcTotalPrice(car.price_per_day, startDate, endDate);

  async function handleBook() {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/auth/login?redirect=' + window.location.pathname;
        return;
      }

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          driver_name: driverName,
          driver_phone: driverPhone,
          status: 'pending',
        })
        .select('id')
        .single();

      if (bookingError) throw bookingError;
      setBookingId(data.id);
      setStep('done');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : tx.bookingFailed);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{tx.bookingRequested}</h3>
        <p className="text-gray-500 text-sm mb-4">{tx.bookingOwnerWillConfirm}</p>
        <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg mb-4">
          {tx.bookingRef} {bookingId.slice(0, 8).toUpperCase()}
        </p>
        <Button href="/dashboard" variant="secondary" fullWidth>
          {tx.bookingViewMyBookings}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">{formatPrice(car.price_per_day)}</span>
        <span className="text-sm text-gray-500">{tx.bookingPerDayWithSpace}</span>
      </div>

      {/* Step: Dates */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{tx.bookingPickup}</label>
            <input
              type="date"
              value={startDate}
              min={today()}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{tx.bookingReturn}</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Step: Driver details */}
      {step === 'details' && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700">{tx.bookingDriverInformation}</h4>
          <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{tx.bookingFullName}</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
                placeholder={tx.bookingFullNamePlaceholder}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{tx.bookingPhoneNumber}</label>
            <input
              type="tel"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
                placeholder={tx.bookingPhonePlaceholder}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
            <span>{formatPrice(car.price_per_day)} &times; {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) || 1} {tx.myBookingsDays}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2">
            <span>{tx.bookingTotal}</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">{error}</p>
      )}

      {step === 'dates' ? (
        <Button
          fullWidth
          onClick={() => setStep('details')}
          disabled={!startDate || !endDate || endDate <= startDate}
        >
          {tx.bookingContinueToBooking}
        </Button>
      ) : (
        <Button
          fullWidth
          loading={loading}
          onClick={handleBook}
          disabled={!driverName || !driverPhone}
        >
          {tx.bookingConfirmLower}
        </Button>
      )}

      <p className="text-xs text-gray-400 text-center">{tx.bookingNoChargeUntilConfirm}</p>
    </div>
  );
}
