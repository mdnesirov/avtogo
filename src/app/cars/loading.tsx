import { CardSkeletonGrid } from '@/components/shared/Skeleton';

export default function CarsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-24 mt-2 animate-pulse" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <CardSkeletonGrid count={6} />
        </div>
      </div>
    </div>
  );
}
