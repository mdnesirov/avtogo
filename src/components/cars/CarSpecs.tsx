import { Car } from '@/types';

interface CarSpecsProps {
  car: Car;
}

const specIcon = {
  transmission: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
  ),
  fuel: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7l3-3 3 3M6 4v16M13 5h4a2 2 0 012 2v6a2 2 0 01-2 2h-2l2 5" /></svg>
  ),
  year: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  location: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  airport: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
  ),
};

export default function CarSpecs({ car }: CarSpecsProps) {
  const specs = [
    { label: 'Year', value: String(car.year), icon: specIcon.year },
    { label: 'Transmission', value: car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1), icon: specIcon.transmission },
    { label: 'Fuel', value: car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1), icon: specIcon.fuel },
    { label: 'Location', value: car.location, icon: specIcon.location },
    ...(car.airport_delivery ? [{ label: 'Airport Delivery', value: 'Available', icon: specIcon.airport }] : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
          <span className="text-green-600 flex-shrink-0">{spec.icon}</span>
          <div>
            <p className="text-xs text-gray-500 leading-none mb-0.5">{spec.label}</p>
            <p className="text-sm font-medium text-gray-900">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
