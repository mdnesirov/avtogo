'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@/types';
import { calculateDays, calculateTotalPrice, formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { ShieldAlert, Info } from 'lucide-react';

interface BookingFormProps {
  car: Car;
  startDate?: string;
  endDate?: string;
}

export default function BookingForm({ car, startDate: propStartDate = '', endDate: propEndDate = '' }: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [depositAcknowledged, setDepositAcknowledged] = useState(false);
  const [form, setForm] = useState({
    startDate: propStartDate,
    endDate: propEndDate,
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    notes: '',
  });

  useEffect(() => {
    setForm(prev => ({ ...prev, startDate: propStartDate, endDate: propEndDate }));
  }, [propStartDate, propEndDate]);

  const days = form.startDate && form.endDate ? calculateDays(form.startDate, form.endDate) : 0;
  const total = days > 0 ? calculateTotalPrice(car.price_per_day, form.startDate, form.endDate) : 0;
  const hasDeposit = car.requires_deposit && car.deposit_amount && car.deposit_amount > 0;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

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
        setError(data.error || 'Booking failed. Please try again.');
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/booking/confirmation?id=${data.booking.id}`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Pick-up date" type="date" value={form.startDate} onChange={handleChange('startDate')} min={new Date().toISOString().split('T')[0]} />
            <Input label="Return date" type="date" value={form.endDate} onChange={handleChange('endDate')} min={form.startDate || new Date().toISOString().split('T')[0]} />
          </div>

          {days > 0 && (
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{formatPrice(car.price_per_day)} &times; {days} days</span>
                  <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Deposit notice — shown as soon as dates are selected */}
              {hasDeposit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <ShieldAlert size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">
                        Security deposit required: {formatPrice(car.deposit_amount!)}
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        This amount will be held and paid to the owner if you cancel after confirmation or do not show up to collect the car. It is returned to you if you complete the rental as agreed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button className="w-full" size="lg" disabled={days <= 0} onClick={() => setStep(2)}>
            Continue to driver info
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600 mb-1">&larr; Back</button>
          <Input label="Full name" placeholder="Your full name" value={form.driverName} onChange={handleChange('driverName')} required />
          <Input label="Phone number" type="tel" placeholder="+994 XX XXX XXXX" value={form.driverPhone} onChange={handleChange('driverPhone')} required />
          <Input label="Driver license #" placeholder="Optional" value={form.driverLicense} onChange={handleChange('driverLicense')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              placeholder="Any special requests..."
              value={form.notes}
              onChange={handleChange('notes')}
              rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Price summary */}
          <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>{formatPrice(car.price_per_day)} &times; {days} days</span>
              <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
            </div>
            {hasDeposit && (
              <div className="flex justify-between text-amber-700 border-t border-gray-200 pt-1.5">
                <span className="flex items-center gap-1"><ShieldAlert size={12} /> Security deposit</span>
                <span className="font-semibold">{formatPrice(car.deposit_amount!)}</span>
              </div>
            )}
          </div>

          {/* Deposit acknowledgement checkbox */}
          {hasDeposit && (
            <label className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={depositAcknowledged}
                onChange={e => setDepositAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-amber-500 flex-shrink-0"
              />
              <p className="text-xs text-amber-800 leading-relaxed">
                I understand that a <strong>{formatPrice(car.deposit_amount!)}</strong> security deposit will be held and forfeited if I cancel after the booking is confirmed or fail to collect the car.
              </p>
            </label>
          )}

          <Button
            className="w-full"
            size="lg"
            loading={loading}
            disabled={hasDeposit ? !depositAcknowledged : false}
            onClick={handleSubmit}
          >
            Confirm Booking
          </Button>

          {hasDeposit && (
            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
              <Info size={11} /> Deposit is handled directly with the owner at pickup
            </p>
          )}
        </>
      )}
    </div>
  );
}
