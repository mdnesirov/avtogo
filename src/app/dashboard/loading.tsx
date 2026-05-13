export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-100 rounded w-48 mb-8" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] bg-white p-4 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-7 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>

      {/* Booking rows */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] bg-white p-4 flex gap-4">
            <div className="w-20 h-16 bg-gray-100 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="h-7 w-20 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
