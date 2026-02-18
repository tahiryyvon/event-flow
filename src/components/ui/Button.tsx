import { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'default'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  primary: 'bg-primary-700 hover:bg-primary-800 focus:ring-primary-500 text-white border border-transparent',
  default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white border border-transparent',
  secondary: 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-900 border border-gray-300',
  outline: 'bg-white hover:bg-gray-50 focus:ring-indigo-500 text-gray-700 border border-gray-300 hover:border-gray-400',
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-6 py-2 text-sm font-medium',
  lg: 'px-8 py-3 text-lg font-medium',
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  href,
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const classes = [
    baseClasses,
    buttonVariants[variant],
    buttonSizes[size],
    className
  ].filter(Boolean).join(' ')

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