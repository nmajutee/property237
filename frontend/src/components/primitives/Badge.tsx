import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// Badge variant styles
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        outline: 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Badge component props
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Badge content */
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <span
      className={badgeVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'