import { cn } from '@/lib/utils';

type BadgeVariant = 'green' | 'gray' | 'yellow' | 'red' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  green:  'bg-green-50 text-green-700',
  gray:   'bg-gray-100 text-gray-600',
  yellow: 'bg-yellow-50 text-yellow-700',
  red:    'bg-red-50 text-red-600',
  blue:   'bg-blue-50 text-blue-700',
};

export default function Badge({ variant = 'gray', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
