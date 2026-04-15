'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import AirportToggle from '@/components/shared/AirportToggle';
import ImageUpload from '@/components/shared/ImageUpload';
import {useTranslations} from 'next-intl';

export default function ListCarForm() {
  const router = useRouter();
  const t = useTranslations('listCar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [airportDelivery, setAirportDelivery] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    transmission: 'automatic',
    fuel_type: 'petrol',
    price_per_day: '',
    location: 'Baku',
    description: '',
  });

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

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          price_per_day: Number(form.price_per_day),
          airport_delivery: airportDelivery,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('failedToCreate'));
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('brand')} placeholder="Toyota" value={form.brand} onChange={handleChange('brand')} required />
        <Input label={t('model')} placeholder="Camry" value={form.model} onChange={handleChange('model')} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label={t('year')} type="number" placeholder="2022" value={form.year} onChange={handleChange('year')} min="1990" max="2026" required />
        <Input label={t('pricePerDay')} type="number" placeholder="80" value={form.price_per_day} onChange={handleChange('price_per_day')} min="1" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('transmission')}</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="automatic">{t('automatic')}</option>
            <option value="manual">{t('manual')}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('fuelType')}</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="petrol">{t('fuel.petrol')}</option>
            <option value="diesel">{t('fuel.diesel')}</option>
            <option value="electric">{t('fuel.electric')}</option>
            <option value="hybrid">{t('fuel.hybrid')}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('location')}</label>
        <select value={form.location} onChange={handleChange('location')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('description')}</label>
        <textarea
          placeholder={t('descriptionPlaceholder')}
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <ImageUpload images={images} onChange={setImages} />

      <div className="bg-gray-50 rounded-xl p-4">
        <AirportToggle enabled={airportDelivery} onChange={setAirportDelivery} />
        <p className="text-xs text-gray-400 mt-2">{t('airportDeliveryHint')}</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {t('submit')}
      </Button>
    </form>
  );
}
