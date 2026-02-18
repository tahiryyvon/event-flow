import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}