export default function BookingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500">Loading booking&hellip;</p>
      </div>
    </div>
  );
}
