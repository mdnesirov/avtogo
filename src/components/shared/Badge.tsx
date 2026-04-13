import { clsx } from 'clsx'
import type { BookingStatus } from '@/types'

type BadgeVariant = 'green' | 'yellow' | 'red' | 'gray' | 'blue'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  green:  'bg-green-50  text-green-700  border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:    'bg-red-50    text-red-700    border-red-200',
  gray:   'bg-gray-100  text-gray-600   border-gray-200',
  blue:   'bg-blue-50   text-blue-700   border-blue-200',
}

export const statusVariant: Record<BookingStatus, BadgeVariant> = {
  pending:   'yellow',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'blue',
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
      variantStyles[variant], className
    )}>
      {children}
    </span>
  )
}
