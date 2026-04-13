'use client';

import { useState } from 'react';
import type { Booking } from '@/types';

interface BookingState {
  carId: string;
  startDate: string;
  endDate: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  notes: string;
}

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  async function createBooking(data: BookingState) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // If Stripe session URL returned, redirect to payment
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      setBooking(result.booking);
      return result.booking;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { createBooking, loading, error, booking };
}
