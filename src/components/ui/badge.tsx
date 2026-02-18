import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

const badgeVariants = {
  default: 'bg-primary-600 text-white',
  secondary: 'bg-gray-100 text-gray-800',
  destructive: 'bg-red-600 text-white',
  outline: 'bg-white border border-gray-300 text-gray-800',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  const classes = [
    baseClasses,
    badgeVariants[variant],
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {children}
    </span>
  )
}