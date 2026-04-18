'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FormEvent } from 'react';
import { SlidersHorizontal } from 'lucide-react';

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

  const selectClass = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-black/[0.06] rounded-2xl p-5 space-y-5 shadow-sm">
      <div className="flex items-center gap-2 pb-1">
        <SlidersHorizontal size={14} className="text-green-700" />
        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
      </div>

      {/* City */}
      <div>
        <label className={labelClass}>City</label>
        <select name="location" defaultValue={currentFilters.location || ''} className={selectClass}>
          <option value="">All cities</option>
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className={labelClass}>Transmission</label>
        <select name="transmission" defaultValue={currentFilters.transmission || ''} className={selectClass}>
          <option value="">Any</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Fuel */}
      <div>
        <label className={labelClass}>Fuel Type</label>
        <select name="fuelType" defaultValue={currentFilters.fuelType || ''} className={selectClass}>
          <option value="">Any</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <label className={labelClass}>Price / day (AZN)</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            defaultValue={currentFilters.minPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            defaultValue={currentFilters.maxPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm hover:shadow-md"
      >
        Apply Filters
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="w-full text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors"
      >
        Clear all filters
      </button>
    </form>
  );
}
