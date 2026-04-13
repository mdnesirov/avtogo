'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FormEvent } from 'react';

interface CarFiltersProps {
  currentFilters: {
    location?: string;
    transmission?: string;
    fuelType?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function CarFilters({ currentFilters }: CarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (value.toString().trim()) params.set(key, value.toString());
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleReset() {
    router.push(pathname);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
        <select name="location" defaultValue={currentFilters.location || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">All cities</option>
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Transmission</label>
        <select name="transmission" defaultValue={currentFilters.transmission || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">Any</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuel Type</label>
        <select name="fuelType" defaultValue={currentFilters.fuelType || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">Any</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per day (AZN)</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            defaultValue={currentFilters.minPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            defaultValue={currentFilters.maxPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
        Apply Filters
      </button>
      <button type="button" onClick={handleReset} className="w-full text-gray-500 text-sm hover:text-gray-700">
        Clear all
      </button>
    </form>
  );
}
