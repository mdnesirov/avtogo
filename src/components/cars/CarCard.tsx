import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types';
import { RatingStars } from '@/components/shared/RatingStars';
import { Badge } from '@/components/shared/Badge';
import { formatPrice } from '@/lib/utils';

interface CarCardProps {
  car: Car;
  showOwnerActions?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (carId: string) => void;
}

export function CarCard({ car, showOwnerActions = false, onEdit, onDelete }: CarCardProps) {
  const primaryImage = car.images?.[0] || null;

  return (
    <article className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/cars/${car.id}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={`${car.brand} ${car.model} ${car.year}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h2l3-4h8l3 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
          </div>
        )}
        {car.airport_delivery && (
          <div className="absolute top-2 left-2">
            <Badge variant="blue">✈️ Airport delivery</Badge>
          </div>
        )}
        {!car.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="gray" className="text-sm px-3 py-1">Unavailable</Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">
              <Link href={`/cars/${car.id}`} className="hover:text-green-600 transition-colors">
                {car.brand} {car.model}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{car.year} &bull; {car.location}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-gray-900">{formatPrice(car.price_per_day)}</p>
            <p className="text-xs text-gray-500">/ day</p>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            {car.transmission}
          </span>
          <span>•</span>
          <span>{car.fuel_type}</span>
        </div>

        <div className="flex items-center justify-between">
          <RatingStars rating={car.rating} totalReviews={car.total_reviews} />

          {showOwnerActions ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit?.(car)}
                className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded-md hover:bg-gray-100"
                aria-label={`Edit ${car.brand} ${car.model}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(car.id)}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50"
                aria-label={`Delete ${car.brand} ${car.model}`}
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              href={`/cars/${car.id}`}
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              View &rarr;
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default CarCard;
