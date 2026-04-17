'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FormEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

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
  const { lang } = useLanguage();
  const tx = translations[lang];

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
      <h3 className="font-semibold text-gray-900">{tx.filtersTitle}</h3>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.filtersCity}</label>
        <select name="location" defaultValue={currentFilters.location || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">{tx.cityAll}</option>
          <option value="Baku">{tx.cityBaku}</option>
          <option value="Ganja">{tx.cityGanja}</option>
          <option value="Sumqayit">{tx.citySumqayit}</option>
          <option value="Sheki">{tx.citySheki}</option>
        </select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.filtersTransmission}</label>
        <select name="transmission" defaultValue={currentFilters.transmission || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">{tx.filtersAny}</option>
          <option value="automatic">{tx.carDetailAutomatic}</option>
          <option value="manual">{tx.carDetailManual}</option>
        </select>
      </div>

      {/* Fuel */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.filtersFuelType}</label>
        <select name="fuelType" defaultValue={currentFilters.fuelType || ''} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
          <option value="">{tx.filtersAny}</option>
          <option value="petrol">{tx.filtersPetrol}</option>
          <option value="diesel">{tx.filtersDiesel}</option>
          <option value="electric">{tx.filtersElectric}</option>
          <option value="hybrid">{tx.filtersHybrid}</option>
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{tx.filtersPricePerDay}</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder={tx.filtersMin}
            defaultValue={currentFilters.minPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder={tx.filtersMax}
            defaultValue={currentFilters.maxPrice || ''}
            className="w-1/2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
        {tx.filtersApply}
      </button>
      <button type="button" onClick={handleReset} className="w-full text-gray-500 text-sm hover:text-gray-700">
        {tx.filtersClearAll}
      </button>
    </form>
  );
}
