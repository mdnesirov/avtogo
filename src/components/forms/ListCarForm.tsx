'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import AirportToggle from '@/components/shared/AirportToggle';
import ImageUpload, { uploadImages } from '@/components/shared/ImageUpload';

export default function ListCarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [airportDelivery, setAirportDelivery] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
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
    const requiredFields = [form.brand, form.model, form.year, form.transmission, form.fuel_type, form.price_per_day, form.location];
    if (requiredFields.some((value) => !String(value).trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const imageUrls = await uploadImages(photos, user.id, (uploadedCount, totalCount) => {
        setUploadProgress(Math.round((uploadedCount / totalCount) * 100));
      });

      const { error: insertError } = await supabase.from('cars').insert({
        owner_id: user.id,
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        price_per_day: Number(form.price_per_day),
        location: form.location.trim(),
        description: form.description.trim() || null,
        images: imageUrls,
        airport_delivery: airportDelivery,
      });

      if (insertError) {
        setError(insertError.message || 'Failed to create listing.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploadProgress(null);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Brand" placeholder="Toyota" value={form.brand} onChange={handleChange('brand')} required />
        <Input label="Model" placeholder="Camry" value={form.model} onChange={handleChange('model')} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Year" type="number" placeholder="2022" value={form.year} onChange={handleChange('year')} min="1990" max="2025" required />
        <Input label="Price per day (AZN)" type="number" placeholder="80" value={form.price_per_day} onChange={handleChange('price_per_day')} min="1" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Transmission</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Fuel Type</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <select value={form.location} onChange={handleChange('location')} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Describe your car, its condition, any extras..."
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <AirportToggle enabled={airportDelivery} onChange={setAirportDelivery} />
        <p className="text-xs text-gray-400 mt-2">Offer delivery to Heydar Aliyev International Airport</p>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Photos</label>
        <ImageUpload
          value={photos}
          onChange={setPhotos}
          uploading={loading}
          uploadProgress={uploadProgress}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Publish Listing
      </Button>
    </form>
  );
}
