'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import AirportToggle from '@/components/shared/AirportToggle';
import ImageUpload from '@/components/shared/ImageUpload';
import { Car } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function EditCarForm({ car }: { car: Car }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const tx = translations[lang];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [airportDelivery, setAirportDelivery] = useState(car.airport_delivery ?? false);
  const [images, setImages] = useState<string[]>(
    (car.images ?? []).filter((u: string) => {
      try { return Boolean(new URL(u)); } catch { return false; }
    })
  );
  const [form, setForm] = useState({
    brand: car.brand ?? '',
    model: car.model ?? '',
    year: String(car.year ?? ''),
    transmission: car.transmission ?? 'automatic',
    fuel_type: car.fuel_type ?? 'petrol',
    price_per_day: String(car.price_per_day ?? ''),
    deposit_amount: String(car.deposit_amount ?? ''),
    location: car.location ?? 'Baku',
    description: car.description ?? '',
  });

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const depositAmt = Number(form.deposit_amount) || 0;

      const res = await fetch(`/api/cars/${car.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          price_per_day: Number(form.price_per_day),
          deposit_amount: depositAmt,
          requires_deposit: depositAmt > 0,
          airport_delivery: airportDelivery,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || tx.somethingWentWrongTryAgain);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError(tx.somethingWentWrongTryAgain);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label={tx.listCarBrand} placeholder={tx.listCarBrandPlaceholder} value={form.brand} onChange={handleChange('brand')} required />
        <Input label={tx.listCarModel} placeholder={tx.listCarModelPlaceholder} value={form.model} onChange={handleChange('model')} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label={tx.listCarYear} type="number" placeholder={tx.listCarYearPlaceholder} value={form.year} onChange={handleChange('year')} min="1990" max="2026" required />
        <Input label={tx.listCarPricePerDay} type="number" placeholder={tx.listCarPricePlaceholder} value={form.price_per_day} onChange={handleChange('price_per_day')} min="1" required />
      </div>

      <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{tx.editSecurityDeposit}</label>
          <Input
            type="number"
            placeholder={tx.editSecurityDepositPlaceholder}
          value={form.deposit_amount}
          onChange={handleChange('deposit_amount')}
          min="0"
        />
          <p className="text-xs text-gray-400 mt-1">{tx.editSecurityDepositHint}</p>
        </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
           <label className="text-sm font-medium text-gray-700">{tx.listCarTransmission}</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="automatic">{tx.carDetailAutomatic}</option>
            <option value="manual">{tx.carDetailManual}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
           <label className="text-sm font-medium text-gray-700">{tx.listCarFuelType}</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="petrol">{tx.filtersPetrol}</option>
            <option value="diesel">{tx.filtersDiesel}</option>
            <option value="electric">{tx.filtersElectric}</option>
            <option value="hybrid">{tx.filtersHybrid}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{tx.filtersCity}</label>
        <select value={form.location} onChange={handleChange('location')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="Baku">{tx.cityBaku}</option>
          <option value="Ganja">{tx.cityGanja}</option>
          <option value="Sumqayit">{tx.citySumqayit}</option>
          <option value="Sheki">{tx.citySheki}</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{tx.listCarDescription}</label>
        <textarea
          placeholder={tx.listCarDescriptionPlaceholder}
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <ImageUpload images={images} onChange={setImages} />

      <div className="bg-gray-50 rounded-xl p-4">
        <AirportToggle enabled={airportDelivery} onChange={setAirportDelivery} />
        <p className="text-xs text-gray-400 mt-2">{tx.editAirportHint}</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {tx.cancel}
        </button>
        <Button type="submit" className="flex-1" size="lg" loading={loading}>
          {tx.saveChanges}
        </Button>
      </div>
    </form>
  );
}
