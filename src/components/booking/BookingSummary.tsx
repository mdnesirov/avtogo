import { Car } from '@/types';
import { differenceInCalendarDays } from '@/lib/utils';

interface BookingSummaryProps {
  car: Car;
  startDate: string;
  endDate: string;
}

export default function BookingSummary({ car, startDate, endDate }: BookingSummaryProps) {
  const nights =
    startDate && endDate
      ? differenceInCalendarDays(new Date(endDate), new Date(startDate))
      : 0;
  const subtotal = nights * car.price_per_day;
  const serviceFee = parseFloat((subtotal * 0.05).toFixed(2)); // 5% placeholder
  const total = subtotal + serviceFee;

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white">
      <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

      {/* Car info */}
      <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
        {car.images[0] && (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
            loading="lazy"
          />
        )}
        <div>
          <p className="font-medium text-gray-900">{car.brand} {car.model}</p>
          <p className="text-sm text-gray-500">{car.year} · {car.transmission} · {car.location}</p>
        </div>
      </div>

      {/* Dates */}
      {startDate && endDate ? (
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Rental period</span>
          <span className="font-medium text-gray-900">
            {new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} –
            {' '}{new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-3">Select dates to see pricing</p>
      )}

      {nights > 0 && (
        <>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">₼{car.price_per_day.toFixed(2)} × {nights} day{nights !== 1 ? 's' : ''}</span>
            <span className="text-gray-900">₼{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-100">
            <span className="text-gray-600">Service fee (5%)</span>
            <span className="text-gray-900">₼{serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span className="text-green-600">₼{total.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
}
