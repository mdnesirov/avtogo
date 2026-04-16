'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import ImageUpload from '@/components/shared/ImageUpload';

export default function ListCarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    car_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'petrol',
    price_per_day: '',
    deposit_amount: '',
    delivery_fee: '',
    airport_delivery_fee: '',
    whatsapp_phone: '',
    location: 'Baku',
    description: '',
  });
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [offersAirport, setOffersAirport] = useState(false);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          car_type: form.car_type,
          transmission: form.transmission,
          fuel_type: form.fuel_type,
          price_per_day: Number(form.price_per_day),
          location: form.location,
          description: form.description || null,
          images,
          whatsapp_phone: form.whatsapp_phone || null,
          requires_deposit: requiresDeposit,
          deposit_amount: requiresDeposit ? Number(form.deposit_amount) : null,
          offers_delivery: offersDelivery,
          delivery_fee: offersDelivery ? Number(form.delivery_fee) : null,
          offers_airport_delivery: offersAirport,
          airport_delivery_fee: offersAirport ? Number(form.airport_delivery_fee) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create listing.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const selectClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600';
  const labelClass = 'text-sm font-medium text-gray-700';
  const sectionClass = 'bg-gray-50 rounded-xl p-4 space-y-3';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Brand / Model */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Brand" placeholder="Toyota" value={form.brand} onChange={handleChange('brand')} required />
        <Input label="Model" placeholder="Camry" value={form.model} onChange={handleChange('model')} required />
      </div>

      {/* Year / Price */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Year" type="number" placeholder="2022" value={form.year} onChange={handleChange('year')} min="1990" max="2026" required />
        <Input label="Price per day (AZN)" type="number" placeholder="80" value={form.price_per_day} onChange={handleChange('price_per_day')} min="1" required />
      </div>

      {/* Car type */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Car Type</label>
        <select value={form.car_type} onChange={handleChange('car_type')} className={selectClass}>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="minivan">Minivan</option>
          <option value="pickup">Pickup</option>
          <option value="coupe">Coupe</option>
          <option value="convertible">Convertible</option>
        </select>
      </div>

      {/* Transmission / Fuel */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Transmission</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className={selectClass}>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Fuel Type</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className={selectClass}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>City</label>
        <select value={form.location} onChange={handleChange('location')} className={selectClass}>
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      {/* WhatsApp */}
      <Input
        label="WhatsApp number (optional)"
        placeholder="+994501234567"
        value={form.whatsapp_phone}
        onChange={handleChange('whatsapp_phone')}
      />

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Description</label>
        <textarea
          placeholder="Describe your car, its condition, any extras..."
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Images */}
      <ImageUpload images={images} onChange={setImages} />

      {/* Security deposit */}
      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresDeposit}
            onChange={e => setRequiresDeposit(e.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>Require security deposit</span>
        </label>
        {requiresDeposit && (
          <Input
            label="Deposit amount (AZN)"
            type="number"
            placeholder="200"
            value={form.deposit_amount}
            onChange={handleChange('deposit_amount')}
            min="1"
            required
          />
        )}
        <p className="text-xs text-gray-400">
          Held from the renter and paid to you if they cancel after confirming or don&apos;t collect the car.
        </p>
      </div>

      {/* City delivery */}
      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={offersDelivery}
            onChange={e => setOffersDelivery(e.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>Offer city delivery</span>
        </label>
        {offersDelivery && (
          <Input
            label="Delivery fee (AZN)"
            type="number"
            placeholder="20"
            value={form.delivery_fee}
            onChange={handleChange('delivery_fee')}
            min="0"
          />
        )}
      </div>

      {/* Airport delivery */}
      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={offersAirport}
            onChange={e => setOffersAirport(e.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>Offer airport delivery (Heydar Aliyev International)</span>
        </label>
        {offersAirport && (
          <Input
            label="Airport delivery fee (AZN)"
            type="number"
            placeholder="40"
            value={form.airport_delivery_fee}
            onChange={handleChange('airport_delivery_fee')}
            min="0"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Publish Listing
      </Button>
    </form>
  );
}
