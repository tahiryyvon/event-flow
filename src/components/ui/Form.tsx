import { ReactNode, forwardRef } from 'react'

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
  description?: string
}

export function FormField({ 
  label, 
  htmlFor, 
  required = false, 
  error, 
  children,
  description 
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600" id={`${htmlFor}-description`}>
          {description}
        </p>
      )}
      
      {children}
      
      {error && (
        <p 
          className="text-sm text-red-600" 
          id={`${htmlFor}-error`}
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
    const errorClasses = error 
      ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" 
      : "border-gray-300 placeholder-gray-400"
    
    return (
      <input
        className={`${baseClasses} ${errorClasses} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'