import { ReactNode } from 'react'

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
  const classes = ['rounded-lg border border-gray-200 bg-white shadow-sm', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  const classes = ['flex flex-col space-y-1.5 p-6', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardTitleProps) {
  const classes = ['font-semibold leading-none tracking-tight', className].filter(Boolean).join(' ')
  return (
    <h3 className={classes}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  const classes = ['text-sm text-gray-600', className].filter(Boolean).join(' ')
  return (
    <p className={classes}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }: CardContentProps) {
  const classes = ['p-6 pt-0', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {children}
    </div>
  )
}