import ListCarForm from '@/components/forms/ListCarForm';

export const metadata = {
  title: 'List Your Car — AvtoGo',
  description: 'Earn money by listing your car on AvtoGo. Setup in minutes.',
};

export default function ListCarPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">List Your Car</h1>
        <p className="text-gray-500 mt-2">Fill in your car details and start earning. It&apos;s free to list.</p>
      </div>
      <ListCarForm />
    </div>
  );
}
