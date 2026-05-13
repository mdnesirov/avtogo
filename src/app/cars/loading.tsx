export default function CarsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Search bar skeleton */}
      <div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-8 max-w-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.06] overflow-hidden bg-white">
            <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
              <div className="flex justify-between items-center pt-1">
                <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
                <div className="h-9 bg-gray-100 rounded-xl animate-pulse w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
