'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { AirportToggle } from '@/components/shared/AirportToggle';

const CITIES = [
  { value: 'Baku', label: 'Baku' },
  { value: 'Ganja', label: 'Ganja' },
  { value: 'Sumqayit', label: 'Sumqayit' },
  { value: 'Mingachevir', label: 'Mingachevir' },
  { value: 'Nakhchivan', label: 'Nakhchivan' },
  { value: 'Lankaran', label: 'Lankaran' },
  { value: 'Sheki', label: 'Sheki' },
];

export default function ListCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [airportDelivery, setAirportDelivery] = useState(false);

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    transmission: 'automatic',
    fuel_type: 'petrol',
    price_per_day: '',
    location: 'Baku',
    description: '',
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login?redirect=/list-car');
        return;
      }

      const { error: insertError } = await supabase.from('cars').insert({
        owner_id: user.id,
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year),
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        price_per_day: parseFloat(form.price_per_day),
        location: form.location,
        description: form.description,
        airport_delivery: airportDelivery,
        images: [],
        is_available: true,
      });

      if (insertError) throw insertError;
      router.push('/dashboard?listed=1');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to list car. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">List your car</h1>
            <p className="text-gray-500 mt-1">Fill in the details and start earning.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6 shadow-sm">
            {/* Car identity */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Car details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  placeholder="e.g. Toyota"
                  value={form.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  required
                />
                <Input
                  label="Model"
                  placeholder="e.g. Camry"
                  value={form.model}
                  onChange={(e) => update('model', e.target.value)}
                  required
                />
                <Input
                  label="Year"
                  type="number"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => update('year', e.target.value)}
                  required
                />
                <Input
                  label="Price per day (AZN)"
                  type="number"
                  min={10}
                  placeholder="e.g. 80"
                  value={form.price_per_day}
                  onChange={(e) => update('price_per_day', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Specs */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Transmission"
                  options={[
                    { value: 'automatic', label: 'Automatic' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                  value={form.transmission}
                  onChange={(e) => update('transmission', e.target.value)}
                />
                <Select
                  label="Fuel type"
                  options={[
                    { value: 'petrol', label: 'Petrol' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'electric', label: 'Electric' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ]}
                  value={form.fuel_type}
                  onChange={(e) => update('fuel_type', e.target.value)}
                />
                <Select
                  label="City"
                  options={CITIES}
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Description</h2>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Tell renters about your car</label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Comfortable seats, clean interior, great for long trips..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Options</h2>
              <AirportToggle checked={airportDelivery} onChange={setAirportDelivery} />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3" role="alert">{error}</p>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              List my car
            </Button>

            <p className="text-xs text-gray-400 text-center">
              By listing, you agree to our Terms of Service.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
