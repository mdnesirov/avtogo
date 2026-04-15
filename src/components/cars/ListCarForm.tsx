'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BRANDS = ['Toyota', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Volkswagen', 'Ford', 'Chevrolet', 'Nissan', 'Honda', 'Mazda', 'Porsche', 'Land Rover', 'Lexus', 'Other'];
const CAR_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Van', 'Minivan', 'Pickup', 'Wagon', 'Other'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export default function ListCarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresDeposit, setRequiresDeposit] = useState(false);

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    car_type: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    price_per_day: '',
    deposit_amount: '',
    location: '',
    city: '',
    description: '',
    whatsapp_phone: '',
    airport_delivery: false,
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const brand = form.brand.trim();
    const model = form.model.trim();
    const year = Number(form.year);

    const payload = {
      car_name: `${brand} ${model} ${year}`,
      brand,
      model,
      year,
      car_type: form.car_type || null,
      transmission: form.transmission,
      fuel_type: form.fuel_type,
      price_per_day: Number(form.price_per_day),
      location: form.location.trim(),
      city: form.city.trim() || null,
      description: form.description.trim() || null,
      images: [],
      airport_delivery: form.airport_delivery,
      whatsapp_phone: form.whatsapp_phone.trim() || null,
      requires_deposit: requiresDeposit,
      deposit_amount: requiresDeposit && form.deposit_amount ? Number(form.deposit_amount) : null,
    };

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to list car');
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* Basic Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Car Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Brand *</label>
            <select className={inputCls} value={form.brand} onChange={e => set('brand', e.target.value)} required>
              <option value="">Select brand</option>
              {BRANDS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Model *</label>
            <input className={inputCls} placeholder="e.g. Camry" value={form.model} onChange={e => set('model', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Year *</label>
            <input className={inputCls} type="number" min={2000} max={new Date().getFullYear() + 1} value={form.year} onChange={e => set('year', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Car Type</label>
            <select className={inputCls} value={form.car_type} onChange={e => set('car_type', e.target.value)}>
              <option value="">Select type</option>
              {CAR_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Transmission *</label>
            <select className={inputCls} value={form.transmission} onChange={e => set('transmission', e.target.value)} required>
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fuel Type *</label>
            <select className={inputCls} value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)} required>
              {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Price per Day (AZN) *</label>
            <input className={inputCls} type="number" min={1} step={0.01} placeholder="80" value={form.price_per_day} onChange={e => set('price_per_day', e.target.value)} required />
          </div>
        </div>

        {/* Deposit toggle */}
        <div className="border border-gray-100 rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setRequiresDeposit(v => !v)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                requiresDeposit ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                requiresDeposit ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Require a security deposit</p>
              <p className="text-xs text-gray-400">Renters will see this amount when booking</p>
            </div>
          </label>
          {requiresDeposit && (
            <div>
              <label className={labelCls}>Deposit Amount (AZN) *</label>
              <input
                className={inputCls}
                type="number"
                min={1}
                step={0.01}
                placeholder="200"
                value={form.deposit_amount}
                onChange={e => set('deposit_amount', e.target.value)}
                required={requiresDeposit}
              />
              <p className="text-xs text-gray-400 mt-1">This is collected separately and returned after the rental ends.</p>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Location & Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Pickup Location *</label>
            <input className={inputCls} placeholder="e.g. 28 Mall, Baku" value={form.location} onChange={e => set('location', e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input className={inputCls} placeholder="e.g. Baku" value={form.city} onChange={e => set('city', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input className={inputCls} placeholder="+994 50 000 0000" value={form.whatsapp_phone} onChange={e => set('whatsapp_phone', e.target.value)} />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.airport_delivery} onChange={e => set('airport_delivery', e.target.checked)} className="w-4 h-4 rounded accent-green-600" />
          <span className="text-sm text-gray-700">I offer airport delivery/pickup</span>
        </label>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} h-28 resize-none`}
          placeholder="Describe your car — condition, extras, rules..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-60"
      >
        {loading ? 'Listing car...' : 'List My Car'}
      </button>
    </form>
  );
}
