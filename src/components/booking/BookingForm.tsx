'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@/types';
import { differenceInCalendarDays } from '@/lib/utils';

interface BookingFormProps {
  car: Car;
  startDate: string;
  endDate: string;
}

export default function BookingForm({ car, startDate, endDate }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    driver_name: '',
    driver_phone: '',
    driver_license: '',
    notes: '',
  });

  const nights = startDate && endDate
    ? differenceInCalendarDays(new Date(endDate), new Date(startDate))
    : 0;
  const totalPrice = nights * car.price_per_day;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select rental dates first.');
      return;
    }
    if (nights < 1) {
      setError('End date must be after start date.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          driver_name: form.driver_name,
          driver_phone: form.driver_phone,
          driver_license: form.driver_license,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Booking failed. Please try again.');
        return;
      }

      // Redirect to confirmation page
      router.push(
        `/booking/confirmation?bookingId=${data.booking.id}&carName=${encodeURIComponent(car.brand + ' ' + car.model)}&start=${startDate}&end=${endDate}&total=${totalPrice}`
      );
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="driver_name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="driver_name"
          name="driver_name"
          type="text"
          required
          value={form.driver_name}
          onChange={handleChange}
          placeholder="e.g. Murad Nasirov"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="driver_phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="driver_phone"
          name="driver_phone"
          type="tel"
          required
          value={form.driver_phone}
          onChange={handleChange}
          placeholder="+994 50 000 00 00"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="driver_license" className="block text-sm font-medium text-gray-700 mb-1">
          Driver's License Number
        </label>
        <input
          id="driver_license"
          name="driver_license"
          type="text"
          value={form.driver_license}
          onChange={handleChange}
          placeholder="Optional"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes for owner
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          placeholder="Any special requests or questions..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !startDate || !endDate}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-colors text-sm"
      >
        {loading ? 'Confirming...' : `Confirm Booking — ₼${totalPrice.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        You won't be charged yet. Payment is arranged directly with the owner.
      </p>
    </form>
  );
}
