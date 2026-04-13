import Link from 'next/link'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  loading?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm',
  secondary: 'bg-white text-gray-800 border border-black/10 hover:bg-gray-50 active:bg-gray-100 shadow-sm',
  ghost:     'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}

export default function Button({
  variant = 'primary', size = 'md', href, loading = false,
  className, children, disabled, ...props
}: ButtonProps) {
  const base = clsx(
    'inline-flex items-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    variantStyles[variant], sizeStyles[size], className
  )

  if (href) return <Link href={href} className={base}>{children}</Link>

  return (
    <button className={base} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
