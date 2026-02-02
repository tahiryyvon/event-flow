import { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  primary: 'bg-primary-700 hover:bg-primary-800 focus:ring-primary-500 text-white border border-transparent',
  secondary: 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-900 border border-gray-300',
  outline: 'bg-white hover:bg-gray-50 focus:ring-primary-500 text-primary-700 border border-primary-300 hover:border-primary-400',
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-6 py-2 text-sm font-medium',
  lg: 'px-8 py-3 text-lg font-medium',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const classes = cn(
    baseClasses,
    buttonVariants[variant],
    buttonSizes[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}