export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-3"><div className="h-4 bg-gray-200 rounded w-28" /></td>
      <td className="px-5 py-3"><div className="h-4 bg-gray-200 rounded w-36" /></td>
      <td className="px-5 py-3"><div className="h-4 bg-gray-200 rounded w-16" /></td>
      <td className="px-5 py-3"><div className="h-5 bg-gray-200 rounded-full w-20" /></td>
    </tr>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-gray-200 aspect-video" />
          <div className="space-y-2">
            <div className="h-7 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-gray-200 rounded-2xl h-80" />
        </div>
      </div>
    </div>
  );
}
