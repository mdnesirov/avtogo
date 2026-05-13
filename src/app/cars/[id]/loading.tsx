export default function CarDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image skeleton */}
        <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />

        {/* Details skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
          <div className="h-12 bg-gray-100 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}
