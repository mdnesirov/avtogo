export default function ListCarLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-7 bg-gray-100 rounded w-1/3 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        ))}
        <div className="h-12 bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}
