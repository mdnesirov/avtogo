'use client';

import { CarFilters as FiltersType } from '@/types';
import { Select } from '@/components/shared/Select';
import { Input } from '@/components/shared/Input';

const CITIES = [
  { value: '', label: 'All cities' },
  { value: 'Baku', label: 'Baku' },
  { value: 'Ganja', label: 'Ganja' },
  { value: 'Sumqayit', label: 'Sumqayit' },
  { value: 'Mingachevir', label: 'Mingachevir' },
  { value: 'Nakhchivan', label: 'Nakhchivan' },
  { value: 'Lankaran', label: 'Lankaran' },
  { value: 'Sheki', label: 'Sheki' },
];

const TRANSMISSION_OPTIONS = [
  { value: '', label: 'Any transmission' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

const FUEL_OPTIONS = [
  { value: '', label: 'Any fuel type' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

interface CarFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export function CarFiltersPanel({ filters, onChange }: CarFiltersProps) {
  function update(key: keyof FiltersType, value: string | boolean | number) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5 sticky top-20">
      <h2 className="font-semibold text-gray-900">Filters</h2>

      <Select
        label="City"
        options={CITIES}
        value={filters.location || ''}
        onChange={(e) => update('location', e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price"
          type="number"
          placeholder="0"
          min={0}
          value={filters.minPrice ?? ''}
          onChange={(e) => update('minPrice', Number(e.target.value))}
        />
        <Input
          label="Max price"
          type="number"
          placeholder="500"
          min={0}
          value={filters.maxPrice ?? ''}
          onChange={(e) => update('maxPrice', Number(e.target.value))}
        />
      </div>

      <Select
        label="Transmission"
        options={TRANSMISSION_OPTIONS}
        value={filters.transmission || ''}
        onChange={(e) => update('transmission', e.target.value)}
      />

      <Select
        label="Fuel type"
        options={FUEL_OPTIONS}
        value={filters.fuelType || ''}
        onChange={(e) => update('fuelType', e.target.value)}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.airportDelivery ?? false}
          onChange={(e) => update('airportDelivery', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span className="text-sm text-gray-700">Airport delivery</span>
      </label>

      <button
        onClick={() => onChange({})}
        className="w-full text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
      >
        Clear all filters
      </button>
    </aside>
  );
}

export default CarFiltersPanel;
