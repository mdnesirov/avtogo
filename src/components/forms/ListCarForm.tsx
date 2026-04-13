'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/shared/ImageUpload';

const STEPS = ['Basic Info', 'Details', 'Photos & Location', 'Review'];

const AZ_CITIES = [
  'Baku', 'Ganja', 'Sumqayit', 'Mingachevir', 'Nakhchivan',
  'Shirvan', 'Lankaran', 'Sheki', 'Yevlakh', 'Khankendi',
];

interface FormState {
  brand: string;
  model: string;
  year: string;
  transmission: 'automatic' | 'manual' | '';
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid' | '';
  price_per_day: string;
  location: string;
  description: string;
  images: string[];
  airport_delivery: boolean;
}

const initial: FormState = {
  brand: '', model: '', year: '', transmission: '', fuel_type: '',
  price_per_day: '', location: '', description: '', images: [], airport_delivery: false,
};

export default function ListCarForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormState, value: string | boolean | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function validateStep(): string {
    if (step === 0) {
      if (!form.brand.trim()) return 'Brand is required.';
      if (!form.model.trim()) return 'Model is required.';
      const y = parseInt(form.year);
      if (!form.year || y < 1990 || y > new Date().getFullYear() + 1)
        return 'Enter a valid year (1990 – present).';
    }
    if (step === 1) {
      if (!form.transmission) return 'Select a transmission type.';
      if (!form.fuel_type) return 'Select a fuel type.';
      const price = parseFloat(form.price_per_day);
      if (!form.price_per_day || price <= 0) return 'Enter a valid price per day.';
    }
    if (step === 2) {
      if (!form.location) return 'Select a city.';
      if (form.images.length === 0) return 'Upload at least one photo.';
    }
    return '';
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: parseInt(form.year),
          price_per_day: parseFloat(form.price_per_day),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to list car.'); return; }
      router.push('/dashboard?listed=true');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i < step ? 'bg-green-600 text-white' :
              i === step ? 'bg-gray-900 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              ) : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${
              i === step ? 'text-gray-900 font-medium' : 'text-gray-400'
            }`}>{label}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 0: Basic Info */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand <span className="text-red-500">*</span></label>
            <input value={form.brand} onChange={(e) => set('brand', e.target.value)}
              placeholder="e.g. Toyota" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model <span className="text-red-500">*</span></label>
            <input value={form.model} onChange={(e) => set('model', e.target.value)}
              placeholder="e.g. Camry" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
            <input type="number" value={form.year} onChange={(e) => set('year', e.target.value)}
              placeholder="e.g. 2021" min="1990" max={new Date().getFullYear() + 1} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={4} placeholder="Tell renters about your car, any features, rules..."
              className="input-field resize-none" />
          </div>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(['automatic', 'manual'] as const).map((t) => (
                <button key={t} type="button" onClick={() => set('transmission', t)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                    form.transmission === t
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(['petrol', 'diesel', 'electric', 'hybrid'] as const).map((f) => (
                <button key={f} type="button" onClick={() => set('fuel_type', f)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                    form.fuel_type === f
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per day (₼) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₼</span>
              <input type="number" value={form.price_per_day} onChange={(e) => set('price_per_day', e.target.value)}
                placeholder="0.00" min="0" step="0.01" className="input-field pl-8" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Airport delivery</p>
              <p className="text-xs text-gray-500">Deliver car to Heydar Aliyev Airport</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.airport_delivery}
              onClick={() => set('airport_delivery', !form.airport_delivery)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.airport_delivery ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.airport_delivery ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Photos & Location */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Photos & location</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Car photos <span className="text-red-500">*</span></label>
            <ImageUpload value={form.images} onChange={(urls) => set('images', urls)} maxFiles={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <select value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field">
              <option value="">Select city...</option>
              {AZ_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Review your listing</h2>
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            {form.images[0] && (
              <img src={form.images[0]} alt="Cover" className="w-full h-44 object-cover" />
            )}
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-gray-900 text-lg">{form.brand} {form.model} ({form.year})</h3>
              <p className="text-sm text-gray-600">{form.location} · {form.transmission} · {form.fuel_type}</p>
              {form.airport_delivery && <p className="text-xs text-green-700 font-medium">✓ Airport delivery available</p>}
              <p className="text-2xl font-bold text-green-600">₼{parseFloat(form.price_per_day || '0').toFixed(2)}<span className="text-sm font-normal text-gray-500">/day</span></p>
              {form.description && <p className="text-sm text-gray-600 pt-2 border-t border-gray-100">{form.description}</p>}
              <p className="text-xs text-gray-400">{form.images.length} photo{form.images.length !== 1 ? 's' : ''} uploaded</p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">{error}</p>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button type="button" onClick={() => { setError(''); setStep((s) => s - 1); }}
            className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-700 font-medium rounded-xl py-3 text-sm transition-colors">
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next}
            className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl py-3 text-sm transition-colors">
            Continue
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors">
            {loading ? 'Submitting...' : 'Publish Listing'}
          </button>
        )}
      </div>
    </div>
  );
}
