import { CardSkeletonGrid, TableRowSkeleton } from '@/components/shared/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-28" />
      </div>

      <section className="mb-12">
        <div className="h-6 bg-gray-200 rounded w-28 mb-4" />
        <CardSkeletonGrid count={4} />
      </section>

      <section>
        <div className="h-6 bg-gray-200 rounded w-28 mb-4" />
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Car', 'Dates', 'Total', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
