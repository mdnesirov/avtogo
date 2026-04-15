'use client';

import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import { MapPin, Fuel, Settings, Calendar } from 'lucide-react';
import { Car } from '@/types';
import { formatPrice } from '@/lib/utils';
import RatingStars from '@/components/shared/RatingStars';
import Badge from '@/components/shared/Badge';
import {useTranslations} from 'next-intl';

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
  const t = useTranslations('cars');
  const rawImage = car.images?.[0];
  const imageUrl = isValidUrl(rawImage)
    ? rawImage!
    : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <Link href={`/cars/${car.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {car.airport_delivery && (
          <div className="absolute top-3 left-3">
            <Badge label={`✈ ${t('airportDelivery')}`} variant="green" />
          </div>
        )}
        {!car.is_active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge label={t('notAvailable')} variant="gray" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link href={`/cars/${car.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors">
              {car.brand} {car.model}
            </h3>
          </Link>
          <span className="text-lg font-bold text-green-600">
            {formatPrice(car.price_per_day)}
            <span className="text-xs font-normal text-gray-400">/{t('day')}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
          <MapPin size={13} />
          <span>{car.location}</span>
          <span className="mx-1">·</span>
          <Calendar size={13} />
          <span>{car.year}</span>
        </div>

        <RatingStars rating={car.rating} totalReviews={car.review_count ?? undefined} />

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Settings size={12} />
            {car.transmission === 'automatic' ? t('automaticShort') : t('manual')}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={12} />
            {t(`fuel.${car.fuel_type}`)}
          </span>
        </div>

        {showOwnerActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
            <button
              onClick={() => onEdit?.(car)}
              className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => onDelete?.(car.id)}
              className="flex-1 text-xs py-1.5 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
