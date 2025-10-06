import * as React from 'react'
import { forwardRef } from 'react'
import { cn } from '../../design-system/utils'

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  countryCode?: string
  onCountryChange?: (countryCode: string) => void
}

const countries = [
  { code: '+237', country: 'CM', name: 'Cameroon' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+234', country: 'NG', name: 'Nigeria' },
  { code: '+27', country: 'ZA', name: 'South Africa' },
]

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({
    className,
    label,
    error,
    helperText,
    countryCode = '+237',
    onCountryChange,
    id,
    ...props
  }, ref) => {
  const reactId = React.useId()
  const inputId = id || `phone-${reactId}`
    const errorId = `${inputId}-error`
    const helpId = `${inputId}-help`

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="flex">
          {/* Country Code Selector */}
          <select
            value={countryCode}
            onChange={(e) => onCountryChange?.(e.target.value)}
            className={cn(
              'flex h-10 items-center rounded-l-md border border-r-0',
              'border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
              'px-3 py-2 text-sm ring-offset-background transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-property237-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500'
            )}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>

          {/* Phone Number Input */}
          <input
            id={inputId}
            type="tel"
            className={cn(
              'flex h-10 w-full rounded-r-md border',
              'border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
              'px-3 py-2 text-sm ring-offset-background transition-colors',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-property237-primary focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(
              error && errorId,
              helperText && helpId
            )}
            placeholder="6XXXXXXXX"
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} className="text-sm text-red-600 dark:text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helpId} className="text-sm text-gray-600 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }