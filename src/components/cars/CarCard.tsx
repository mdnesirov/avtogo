import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Fuel, Settings } from 'lucide-react';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';
import RatingStars from '@/components/shared/RatingStars';
import Badge from '@/components/shared/Badge';

interface CarCardProps {
  car: Car;
  showOwnerActions?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (id: string) => void;
}

export default function CarCard({ car, showOwnerActions, onEdit, onDelete }: CarCardProps) {
  const image = car.images?.[0] || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80';

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <Link href={`/cars/${car.id}`}>
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {car.airport_delivery && (
            <div className="absolute top-2 left-2">
              <Badge variant="green">✈️ Airport</Badge>
            </div>
          )}
          {!car.is_available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="gray">Unavailable</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {car.year} {car.brand} {car.model}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin size={11} />
              {car.location}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-green-600">{formatPrice(car.price_per_day)}</div>
            <div className="text-xs text-gray-400">per day</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Settings size={11} />
            {car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={11} />
            {car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <RatingStars rating={car.rating} totalReviews={car.total_reviews} />
          {showOwnerActions ? (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(car)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(car.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              href={`/cars/${car.id}`}
              className="text-xs font-medium text-green-600 hover:underline"
            >
              View &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
