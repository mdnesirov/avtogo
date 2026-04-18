export default function CarsLoading() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Header skeleton */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="h-7 bg-gray-200 rounded-lg w-36 animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 rounded-lg w-24 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar skeleton */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white border border-black/[0.06] rounded-2xl p-5 space-y-4 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-20" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
              <div className="h-10 bg-green-100 rounded-xl" />
            </div>
          </aside>

          {/* Cards skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-28" />
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-20" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="pt-2 border-t border-gray-100 flex gap-3">
                      <div className="h-3 bg-gray-100 rounded w-14" />
                      <div className="h-3 bg-gray-100 rounded w-14" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
