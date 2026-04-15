import { Suspense } from 'react';
import BookingPageContent from './BookingPageContent';

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent" />
        </main>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
