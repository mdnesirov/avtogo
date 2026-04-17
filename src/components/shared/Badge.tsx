'use client';

import { cn } from '@/lib/utils';
import { BookingStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'yellow' | 'red' | 'gray' | 'blue';
}

export default function Badge({ label, variant = 'gray' }: BadgeProps) {
  const variants = {
    green: 'bg-green-50 text-green-700 border border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variants[variant])}>
      {label}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { lang } = useLanguage();
  const tx = translations[lang];

  const map: Record<BookingStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending:   { label: tx.badgePending, variant: 'yellow' },
    confirmed: { label: tx.dashboardConfirmed, variant: 'green' },
    cancelled: { label: tx.dashboardCancelled, variant: 'red' },
    completed: { label: tx.badgeCompleted, variant: 'blue' },
  };
  const { label, variant } = map[status];
  return <Badge label={label} variant={variant} />;
}
