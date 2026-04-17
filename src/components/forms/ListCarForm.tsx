'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import ImageUpload from '@/components/shared/ImageUpload';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export default function ListCarForm() {
  const router = useRouter();
  const { lang } = useLanguage();
  const tx = translations[lang];
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
        setError(data.error || tx.somethingWentWrongTryAgain);
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError(tx.somethingWentWrongTryAgain);
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
        <Input label={tx.listCarBrand} placeholder={tx.listCarBrandPlaceholder} value={form.brand} onChange={handleChange('brand')} required />
        <Input label={tx.listCarModel} placeholder={tx.listCarModelPlaceholder} value={form.model} onChange={handleChange('model')} required />
      </div>

      {/* Year / Price */}
      <div className="grid grid-cols-2 gap-4">
        <Input label={tx.listCarYear} type="number" placeholder={tx.listCarYearPlaceholder} value={form.year} onChange={handleChange('year')} min="1990" max="2026" required />
        <Input label={tx.listCarPricePerDay} type="number" placeholder={tx.listCarPricePlaceholder} value={form.price_per_day} onChange={handleChange('price_per_day')} min="1" required />
      </div>

      {/* Car type */}
      <div className="flex flex-col gap-1">
          <label className={labelClass}>{tx.listCarType}</label>
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
          <label className={labelClass}>{tx.listCarTransmission}</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className={selectClass}>
            <option value="automatic">{tx.carDetailAutomatic}</option>
            <option value="manual">{tx.carDetailManual}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>{tx.listCarFuelType}</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className={selectClass}>
            <option value="petrol">{tx.filtersPetrol}</option>
            <option value="diesel">{tx.filtersDiesel}</option>
            <option value="electric">{tx.filtersElectric}</option>
            <option value="hybrid">{tx.filtersHybrid}</option>
          </select>
        </div>
      </div>

      {/* City */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>{tx.filtersCity}</label>
        <select value={form.location} onChange={handleChange('location')} className={selectClass}>
          <option value="Baku">{tx.cityBaku}</option>
          <option value="Ganja">{tx.cityGanja}</option>
          <option value="Sumqayit">{tx.citySumqayit}</option>
          <option value="Sheki">{tx.citySheki}</option>
        </select>
      </div>

      {/* WhatsApp */}
      <Input
        label={tx.listCarWhatsAppOptional}
        placeholder={tx.listCarWhatsAppPlaceholder}
        value={form.whatsapp_phone}
        onChange={handleChange('whatsapp_phone')}
      />

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>{tx.listCarDescription}</label>
        <textarea
          placeholder={tx.listCarDescriptionPlaceholder}
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
          <span className={labelClass}>{tx.listCarRequireDeposit}</span>
        </label>
        {requiresDeposit && (
          <Input
            label={tx.listCarDepositAmount}
            type="number"
            placeholder={tx.listCarDepositPlaceholder}
            value={form.deposit_amount}
            onChange={handleChange('deposit_amount')}
            min="1"
            required
          />
        )}
        <p className="text-xs text-gray-400">
          {tx.listCarDepositHint}
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
          <span className={labelClass}>{tx.listCarOfferDelivery}</span>
        </label>
        {offersDelivery && (
          <Input
            label={tx.listCarDeliveryFee}
            type="number"
            placeholder={tx.listCarDeliveryFeePlaceholder}
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
          <span className={labelClass}>{tx.listCarOfferAirportDelivery}</span>
        </label>
        {offersAirport && (
          <Input
            label={tx.listCarAirportFee}
            type="number"
            placeholder={tx.listCarAirportFeePlaceholder}
            value={form.airport_delivery_fee}
            onChange={handleChange('airport_delivery_fee')}
            min="0"
          />
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {tx.listCarPublish}
      </Button>
    </form>
  );
}
