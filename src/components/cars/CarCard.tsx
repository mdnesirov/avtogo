'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Fuel, Settings, Calendar } from 'lucide-react';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';
import RatingStars from '@/components/shared/RatingStars';
import Badge from '@/components/shared/Badge';

interface CarCardProps {
  car: Car;
  showOwnerActions?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (carId: string) => void;
}

function isValidUrl(str: string | undefined | null): boolean {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function CarCard({ car, showOwnerActions, onEdit, onDelete }: CarCardProps) {
  const rawImage = car.images?.[0];
  const imageUrl = isValidUrl(rawImage)
    ? rawImage!
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80';

  return (
    <div className="group rounded-2xl overflow-hidden border border-black/10 bg-[var(--color-surface)] hover:shadow-[var(--shadow-lg)] transition-all duration-300">
      <Link href={`/cars/${car.id}`} className="block relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-2)]">
        <Image
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        {car.airport_delivery && (
          <div className="absolute top-3 left-3">
            <Badge label="✈ Airport delivery" variant="green" />
          </div>
        )}
        {!car.is_active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge label="Not available" variant="gray" />
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <Link href={`/cars/${car.id}`}>
            <h3 className="font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
              {car.brand} {car.model}
            </h3>
          </Link>
          <span className="text-2xl font-semibold text-[var(--color-primary)] leading-none whitespace-nowrap">
            {formatPrice(car.price_per_day)}
            <span className="text-xs font-medium text-[var(--color-accent)]">/day</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-3">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} className="text-[var(--color-text-faint)]" />
            {car.location}
          </span>
          <span className="text-[var(--color-text-faint)]">·</span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} className="text-[var(--color-text-faint)]" />
            {car.year}
          </span>
        </div>

        <RatingStars rating={car.rating} totalReviews={car.review_count ?? undefined} />

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/5 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-surface-2)]">
            <Settings size={12} />
            {car.transmission === 'automatic' ? 'Auto' : 'Manual'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-surface-2)]">
            <Fuel size={12} />
            {car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)}
          </span>
        </div>

        {showOwnerActions && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-black/5">
            <button
              onClick={() => onEdit?.(car)}
              className="flex-1 text-xs py-2 border border-black/10 rounded-full hover:bg-[var(--color-surface-2)] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(car.id)}
              className="flex-1 text-xs py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
