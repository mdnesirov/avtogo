import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-green-600 text-white hover:bg-green-700': variant === 'primary',
          'border border-gray-200 text-gray-800 hover:bg-gray-50': variant === 'secondary',
          'text-gray-600 hover:bg-gray-100': variant === 'ghost',
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-5 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
