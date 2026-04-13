interface RatingStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md';
}

export function RatingStars({ rating, totalReviews, size = 'sm' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 14 : 18;
  const filled = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill={i < filled ? '#facc15' : 'none'}
            stroke={i < filled ? '#facc15' : '#d1d5db'}
            strokeWidth="2"
            aria-hidden
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-gray-500">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {totalReviews > 0 && ` (${totalReviews})`}
        </span>
      )}
    </div>
  );
}

export default RatingStars;
