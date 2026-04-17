'use client';

import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface RatingStarsProps {
  rating: number | null | undefined;
  totalReviews?: number;
  size?: number;
}

export default function RatingStars({ rating, totalReviews, size = 14 }: RatingStarsProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const safeRating = rating ?? 0;
  const rounded = Math.round(safeRating * 2) / 2;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rounded ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
          />
        ))}
      </div>
      {safeRating > 0 ? (
        <span className="text-xs text-gray-500">
          {safeRating.toFixed(1)}{totalReviews !== undefined && ` (${totalReviews})`}
        </span>
      ) : (
        <span className="text-xs text-gray-400">{tx.reviewsNone}</span>
      )}
    </div>
  );
}
