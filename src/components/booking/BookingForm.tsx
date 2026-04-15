'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Car } from '@/types';
import { calculateDays, calculateTotalPrice, formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import {useTranslations} from 'next-intl';

interface BookingFormProps {
  car: Car;
  startDate?: string;
  endDate?: string;
}

export default function BookingForm({ car, startDate: propStartDate = '', endDate: propEndDate = '' }: BookingFormProps) {
  const router = useRouter();
  const t = useTranslations('bookingForm');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    startDate: propStartDate,
    endDate: propEndDate,
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    notes: '',
  });

  // Keep form dates in sync if parent calendar selection changes
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      startDate: propStartDate,
      endDate: propEndDate,
    }));
  }, [propStartDate, propEndDate]);

  const days = form.startDate && form.endDate ? calculateDays(form.startDate, form.endDate) : 0;
  const total = days > 0 ? calculateTotalPrice(car.price_per_day, form.startDate, form.endDate) : 0;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          startDate: form.startDate,
          endDate: form.endDate,
          driverName: form.driverName,
          driverPhone: form.driverPhone,
          driverLicense: form.driverLicense,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('bookingFailed'));
      } else if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/booking/confirmation?id=${data.booking.id}`);
      }
    } catch {
      setError(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input label={t('pickupDate')} type="date" value={form.startDate} onChange={handleChange('startDate')} min={new Date().toISOString().split('T')[0]} />
            <Input label={t('returnDate')} type="date" value={form.endDate} onChange={handleChange('endDate')} min={form.startDate || new Date().toISOString().split('T')[0]} />
          </div>

          {days > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{formatPrice(car.price_per_day)} &times; {t('days', {count: days})}</span>
                <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={days <= 0}
            onClick={() => setStep(2)}
          >
            {t('continueToDriverInfo')}
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600 mb-1">&larr; {t('back')}</button>
          <Input label={t('fullName')} placeholder={t('fullNamePlaceholder')} value={form.driverName} onChange={handleChange('driverName')} required />
          <Input label={t('phoneNumber')} type="tel" placeholder="+994 XX XXX XXXX" value={form.driverPhone} onChange={handleChange('driverPhone')} required />
          <Input label={t('driverLicense')} placeholder={t('optional')} value={form.driverLicense} onChange={handleChange('driverLicense')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t('notes')}</label>
            <textarea
              placeholder={t('notesPlaceholder')}
              value={form.notes}
              onChange={handleChange('notes')}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="bg-gray-50 rounded-xl p-3 text-sm flex justify-between">
            <span className="text-gray-500">{t('totalForDays', {count: days})}</span>
            <span className="font-bold text-gray-900">{formatPrice(total)}</span>
          </div>

          <Button className="w-full" size="lg" loading={loading} onClick={handleSubmit}>
            {t('confirmBooking')}
          </Button>
        </>
      )}
    </div>
  );
}
