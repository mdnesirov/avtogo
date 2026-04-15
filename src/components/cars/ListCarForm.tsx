'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Car as CarIcon, Plane, MapPin } from 'lucide-react';

const BRANDS = ['Toyota', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia', 'Volkswagen', 'Ford', 'Chevrolet', 'Nissan', 'Honda', 'Mazda', 'Porsche', 'Land Rover', 'Lexus', 'Other'];
const CAR_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Van', 'Minivan', 'Pickup', 'Wagon', 'Other'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export default function ListCarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [offersAirport, setOffersAirport] = useState(false);

  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear().toString(),
    car_type: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    price_per_day: '',
    deposit_amount: '',
    delivery_fee: '',
    airport_delivery_fee: '',
    location: '',
    city: '',
    description: '',
    whatsapp_phone: '',
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
      whatsapp_phone: form.whatsapp_phone.trim() || null,
      requires_deposit: requiresDeposit,
      deposit_amount: requiresDeposit && form.deposit_amount ? Number(form.deposit_amount) : null,
      offers_delivery: offersDelivery,
      delivery_fee: offersDelivery && form.delivery_fee ? Number(form.delivery_fee) : null,
      offers_airport_delivery: offersAirport,
      airport_delivery_fee: offersAirport && form.airport_delivery_fee ? Number(form.airport_delivery_fee) : null,
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

  function Toggle({ on, onToggle, color = 'green' }: { on: boolean; onToggle: () => void; color?: 'green' | 'amber' | 'blue' }) {
    const colors = {
      green: on ? 'bg-green-500' : 'bg-gray-200',
      amber: on ? 'bg-amber-500' : 'bg-gray-200',
      blue: on ? 'bg-blue-500' : 'bg-gray-200',
    };
    return (
      <div onClick={onToggle} className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${colors[color]}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
    );
  }

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
        <div>
          <label className={labelCls}>Price per Day (AZN) *</label>
          <input className={inputCls} type="number" min={1} step={0.01} placeholder="80" value={form.price_per_day} onChange={e => set('price_per_day', e.target.value)} required />
        </div>

        {/* Deposit section */}
        <div className={`border rounded-2xl p-4 space-y-3 transition-colors ${requiresDeposit ? 'border-amber-200 bg-amber-50/40' : 'border-gray-100 bg-gray-50/40'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <Toggle on={requiresDeposit} onToggle={() => setRequiresDeposit(v => !v)} color="amber" />
            <div>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <ShieldAlert size={14} className={requiresDeposit ? 'text-amber-500' : 'text-gray-300'} />
                Require a security deposit
              </p>
              <p className="text-xs text-gray-400">Held and paid to you if the renter cancels or no-shows</p>
            </div>
          </label>
          {requiresDeposit && (
            <div className="space-y-2">
              <div>
                <label className={labelCls}>Deposit Amount (AZN) *</label>
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  step={0.01}
                  placeholder="e.g. 200"
                  value={form.deposit_amount}
                  onChange={e => set('deposit_amount', e.target.value)}
                  required={requiresDeposit}
                />
              </div>
              <div className="bg-amber-100/60 rounded-xl px-3 py-2 text-xs text-amber-800 leading-relaxed">
                <strong>How it works:</strong> The renter is shown this amount before booking and must acknowledge it. The deposit is handled directly between you and the renter at pickup.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location & Delivery */}
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
          <div className="sm:col-span-2">
            <label className={labelCls}>WhatsApp Number</label>
            <input className={inputCls} placeholder="+994 50 000 0000" value={form.whatsapp_phone} onChange={e => set('whatsapp_phone', e.target.value)} />
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 text-sm pt-1">Handoff Options</h3>
        <p className="text-xs text-gray-400 -mt-2">Choose which options you offer and set a fee — or leave free.</p>

        {/* Self Pickup — always available, informational */}
        <div className="border border-gray-100 bg-gray-50/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MapPin size={15} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Self Pickup</p>
            <p className="text-xs text-gray-400">Renter picks up from your location — always available, no fee</p>
          </div>
          <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5">Free</span>
        </div>

        {/* City Delivery */}
        <div className={`border rounded-2xl p-4 space-y-3 transition-colors ${offersDelivery ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-gray-50/40'}`}>
          <div className="flex items-center gap-3">
            <Toggle on={offersDelivery} onToggle={() => setOffersDelivery(v => !v)} color="green" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${offersDelivery ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CarIcon size={13} className={offersDelivery ? 'text-green-600' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">City Delivery</p>
                <p className="text-xs text-gray-400">You deliver the car to the renter&apos;s address</p>
              </div>
            </div>
          </div>
          {offersDelivery && (
            <div>
              <label className={labelCls}>Delivery Fee (AZN)</label>
              <div className="relative">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Leave blank for free delivery"
                  value={form.delivery_fee}
                  onChange={e => set('delivery_fee', e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Enter 0 or leave blank to offer delivery for free</p>
            </div>
          )}
        </div>

        {/* Airport Delivery */}
        <div className={`border rounded-2xl p-4 space-y-3 transition-colors ${offersAirport ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/40'}`}>
          <div className="flex items-center gap-3">
            <Toggle on={offersAirport} onToggle={() => setOffersAirport(v => !v)} color="blue" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${offersAirport ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Plane size={13} className={offersAirport ? 'text-blue-600' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Airport Delivery / Pickup</p>
                <p className="text-xs text-gray-400">Deliver or pick up at Heydar Aliyev International Airport</p>
              </div>
            </div>
          </div>
          {offersAirport && (
            <div>
              <label className={labelCls}>Airport Fee (AZN)</label>
              <input
                className={inputCls}
                type="number"
                min={0}
                step={0.01}
                placeholder="Leave blank for free airport delivery"
                value={form.airport_delivery_fee}
                onChange={e => set('airport_delivery_fee', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Enter 0 or leave blank to offer airport delivery for free</p>
            </div>
          )}
        </div>
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
