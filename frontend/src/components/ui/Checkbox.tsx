import * as React from 'react'
import { forwardRef } from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '../../design-system/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    label,
    description,
    error,
    id,
    ...props
  }, ref) => {
  const reactId = React.useId()
  const checkboxId = id || `checkbox-${reactId}`
    const errorId = `${checkboxId}-error`
    const descId = `${checkboxId}-desc`

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <input
              id={checkboxId}
              type="checkbox"
              className={cn(
                'peer h-4 w-4 rounded border border-input bg-background',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'checked:bg-primary-600 checked:border-primary-600',
                error && 'border-destructive',
                className
              )}
              ref={ref}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={cn(
                error && errorId,
                description && descId
              )}
              {...props}
            />
            <CheckIcon className="absolute inset-0 h-4 w-4 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" />
          </div>

          {label && (
            <div className="flex-1 min-w-0">
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium leading-tight cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
                {props.required && <span className="text-destructive ml-1">*</span>}
              </label>

              {description && (
                <p id={descId} className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }