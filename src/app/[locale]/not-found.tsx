import {Link} from '@/i18n/navigation';
import {getTranslations} from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="mx-auto"
            aria-hidden="true"
          >
            <rect width="80" height="80" rx="20" fill="#f0fdf4" />
            <path d="M20 52l8-18h24l8 18" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="28" cy="55" r="4" fill="#16a34a" />
            <circle cx="52" cy="55" r="4" fill="#16a34a" />
            <path d="M33 36h-4M43 36h4" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('title')}</h2>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          {t('description')}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {t('goHome')}
          </Link>
          <Link
            href="/cars"
            className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t('browseCars')}
          </Link>
        </div>
      </div>
    </div>
  );
}
