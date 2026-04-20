'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Car, Phone } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { BookingStatusBadge } from '@/components/shared/Badge';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Lang } from '@/lib/i18n/types';

const t: Record<Lang, Record<string, string>> = {
  en: {
    loading: 'Loading booking details...',
    title: 'Booking Confirmed!',
    subtitle: 'Your booking request has been submitted. The owner will confirm shortly.',
    bookingNotFound: 'Booking details could not be found.',
    dateRange: 'Dates',
    driverName: 'Driver',
    driverPhone: 'Phone',
    total: 'Total',
    viewBookings: 'View my bookings',
    browseCars: 'Browse more cars',
  },
  ru: {
    loading: 'Загрузка данных бронирования...',
    title: 'Бронирование подтверждено!',
    subtitle: 'Ваш запрос на бронирование отправлен. Владелец скоро подтвердит его.',
    bookingNotFound: 'Не удалось найти детали бронирования.',
    dateRange: 'Даты',
    driverName: 'Водитель',
    driverPhone: 'Телефон',
    total: 'Итого',
    viewBookings: 'Мои бронирования',
    browseCars: 'Посмотреть другие автомобили',
  },
  az: {
    loading: 'Bron detalları yüklənir...',
    title: 'Bron təsdiqləndi!',
    subtitle: 'Bron sorğunuz göndərildi. Sahib tezliklə təsdiqləyəcək.',
    bookingNotFound: 'Bron detalları tapılmadı.',
    dateRange: 'Tarixlər',
    driverName: 'Sürücü',
    driverPhone: 'Telefon',
    total: 'Cəmi',
    viewBookings: 'Bronlarımı gör',
    browseCars: 'Digər avtomobillərə bax',
  },
};

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const tx = t[lang];
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id') || searchParams.get('id');

  useEffect(() => {
    let active = true;

    async function fetchBooking() {
      const supabase = createClient();
      setLoading(true);

      if (sessionId) {
        const { data } = await supabase
          .from('bookings')
          .select('*, car:cars(*)')
          .eq('stripe_session_id', sessionId)
          .maybeSingle();

        if (data) {
          if (active) {
            setBooking(data);
            setLoading(false);
          }
          return;
        }
      }

      if (bookingId) {
        const { data } = await supabase
          .from('bookings')
          .select('*, car:cars(*)')
          .eq('id', bookingId)
          .maybeSingle();

        if (active) setBooking(data ?? null);
      } else if (active) {
        setBooking(null);
      }

      if (active) setLoading(false);
    }

    fetchBooking();

    return () => {
      active = false;
    };
  }, [bookingId, sessionId]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{tx.title}</h1>
      <p className="text-gray-500 mb-8">{tx.subtitle}</p>

      {loading && <p className="text-sm text-gray-500 mb-8">{tx.loading}</p>}
      {!loading && !booking && <p className="text-sm text-gray-500 mb-8">{tx.bookingNotFound}</p>}

      {booking && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{booking.car?.brand} {booking.car?.model}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Calendar size={14} /> {tx.dateRange}: {formatDate(booking.start_date)} → {formatDate(booking.end_date)}</div>
            <div className="flex items-center gap-2"><Car size={14} /> {tx.driverName}: {booking.driver_name}</div>
            <div className="flex items-center gap-2"><Phone size={14} /> {tx.driverPhone}: {booking.driver_phone}</div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="text-sm text-gray-500">{tx.total}</span>
            <span className="font-bold text-gray-900">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
          {tx.viewBookings}
        </Link>
        <Link href="/cars" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          {tx.browseCars}
        </Link>
      </div>
    </div>
  );
}
