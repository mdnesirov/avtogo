import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: number;
}

export default function RatingStars({ rating, totalReviews, size = 14 }: RatingStarsProps) {
  const full  = Math.floor(rating);
  const empty = 5 - full;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-gray-200 fill-gray-200" />
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-gray-500">
          {rating.toFixed(1)} ({totalReviews})
        </span>
      )}
    </div>
  );
}
