import { Car } from '@/types';

interface CarSpecsProps {
  car: Car;
}

const specs = [
  {
    key: 'transmission' as keyof Car,
    label: 'Transmission',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    key: 'fuel_type' as keyof Car,
    label: 'Fuel',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 22V6a2 2 0 012-2h10a2 2 0 012 2v16M2 22h18" />
        <path d="M17 6h2a2 2 0 012 2v3a2 2 0 01-2 2h-2" />
        <path d="M7 10h6" />
      </svg>
    ),
  },
  {
    key: 'year' as keyof Car,
    label: 'Year',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    key: 'location' as keyof Car,
    label: 'Location',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
];

export function CarSpecs({ car }: CarSpecsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {specs.map(({ key, label, icon }) => (
        <div key={key} className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="text-green-600 mb-2">{icon}</div>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-gray-900 capitalize">
            {String(car[key] ?? '—')}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CarSpecs;
