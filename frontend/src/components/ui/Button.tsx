import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, focusRing, disabledState } from '../../design-system/utils'

const buttonVariants = cva(
  cn(
    // Base styles
    'inline-flex items-center justify-center gap-3',
    'whitespace-nowrap rounded-lg text-lg font-bold',
    'transition-all duration-200 ease-in-out',
    'border-2 border-transparent',
    focusRing,
    disabledState
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-property237-primary/10 dark:bg-property237-primary/20',
          'text-black dark:text-white',
          'hover:bg-property237-primary/20 dark:hover:bg-property237-primary/30 hover:border-property237-primary',
          'disabled:hover:bg-property237-primary/10 disabled:hover:border-transparent'
        ),
        destructive: cn(
          'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300',
          'hover:bg-red-500/20 dark:hover:bg-red-500/30 hover:border-red-500',
          'disabled:hover:bg-red-500/10 disabled:hover:border-transparent'
        ),
        outline: cn(
          'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500',
          'disabled:hover:bg-white disabled:hover:border-gray-300 dark:disabled:hover:bg-gray-800 dark:disabled:hover:border-gray-600'
        ),
        secondary: cn(
          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
          'hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
          'disabled:hover:bg-gray-100 disabled:hover:border-transparent'
        ),
        ghost: cn(
          'bg-transparent text-gray-600 dark:text-gray-300',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'disabled:hover:bg-transparent'
        ),
        link: cn(
          'text-property237-primary underline-offset-4 bg-transparent border-0 font-medium',
          'hover:underline hover:bg-transparent'
        ),
      },
      size: {
        default: 'px-6 py-4',
        sm: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-8 py-5 text-xl',
        xl: 'px-10 py-6 text-2xl',
        icon: 'h-12 w-12 p-3',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && leftIcon && leftIcon}

        {loading && loadingText ? loadingText : children}

        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }