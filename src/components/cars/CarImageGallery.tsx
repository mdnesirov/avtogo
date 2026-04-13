'use client';

import { useState } from 'react';

interface CarImageGalleryProps {
  images: string[];
  carName: string;
}

export default function CarImageGallery({ images, carName }: CarImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const fallback = '/placeholder-car.jpg';
  const displayImages = images.length > 0 ? images : [fallback];

  const prev = () => setActiveIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-3">
        <img
          src={displayImages[activeIndex]}
          alt={`${carName} — photo ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <span className="absolute bottom-3 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {activeIndex + 1} / {displayImages.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo ${i + 1}`}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-green-600' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
