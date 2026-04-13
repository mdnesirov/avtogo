import ListCarForm from '@/components/forms/ListCarForm';

export const metadata = {
  title: 'List Your Car — AvtoGo',
  description: 'Earn money by renting out your car to locals and tourists in Azerbaijan.',
};

export default function ListCarPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to home
          </a>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">List your car</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Join hundreds of owners earning with their vehicles. Takes about 3 minutes.
          </p>
        </div>

        {/* Why list section */}
        <div className="grid grid-cols-3 gap-4 mb-10 p-5 bg-gray-50 rounded-2xl">
          {[
            { icon: '💰', label: 'Earn daily', sub: 'Set your own price' },
            { icon: '🛡️', label: 'Protected', sub: 'Owner verification' },
            { icon: '📱', label: 'Easy manage', sub: 'via dashboard' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          ))}
        </div>

        <ListCarForm />
      </div>
    </main>
  );
}
