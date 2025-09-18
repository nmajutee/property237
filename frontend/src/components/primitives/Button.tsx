import React from 'react';
import { cn } from '../../design-system/utils';
import { LucideIcon, Loader2 } from 'lucide-react';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Icon to display on the left
   */
  leftIcon?: LucideIcon;
  /**
   * Icon to display on the right
   */
  rightIcon?: LucideIcon;
  /**
   * Button content
   */
  children?: React.ReactNode;
}

// Base button styles
const baseStyles = [
  'inline-flex items-center justify-center',
  'font-medium text-sm',
  'border border-transparent',
  'rounded-md',
  'transition-colors duration-fast',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

// Size variants
const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

// Visual variants
const variantStyles = {
  primary: [
    'bg-brand-500 text-white',
    'hover:bg-brand-600',
    'active:bg-brand-700',
    'focus:ring-brand-500',
    'disabled:hover:bg-brand-500',
  ].join(' '),

  secondary: [
    'bg-neutral-100 text-neutral-900 border-neutral-300',
    'dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600',
    'hover:bg-neutral-200 dark:hover:bg-neutral-700',
    'active:bg-neutral-300 dark:active:bg-neutral-600',
    'focus:ring-neutral-500',
    'disabled:hover:bg-neutral-100 dark:disabled:hover:bg-neutral-800',
  ].join(' '),

  tertiary: [
    'bg-white text-neutral-900 border-neutral-300',
    'dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-600',
    'hover:bg-neutral-50 dark:hover:bg-neutral-800',
    'active:bg-neutral-100 dark:active:bg-neutral-700',
    'focus:ring-neutral-500',
    'disabled:hover:bg-white dark:disabled:hover:bg-neutral-900',
  ].join(' '),

  ghost: [
    'bg-transparent text-neutral-700',
    'dark:text-neutral-300',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    'active:bg-neutral-200 dark:active:bg-neutral-700',
    'focus:ring-neutral-500',
    'disabled:hover:bg-transparent',
  ].join(' '),

  danger: [
    'bg-danger text-white',
    'hover:bg-red-700',
    'active:bg-red-800',
    'focus:ring-red-500',
    'disabled:hover:bg-danger',
  ].join(' '),
};

/**
 * Livest Design System Button Component
 *
 * Flexible button component with multiple variants, sizes, and states.
 * Supports icons, loading states, and full accessibility.
 *
 * @example
 * ```tsx
 * import { Button } from '@/components/primitives/Button';
 * import { Search, ArrowRight } from 'lucide-react';
 *
 * // Basic button
 * <Button>Click me</Button>
 *
 * // Primary call-to-action
 * <Button variant="primary" size="lg">Get Started</Button>
 *
 * // With icons
 * <Button leftIcon={Search}>Search Properties</Button>
 * <Button rightIcon={ArrowRight} variant="primary">Continue</Button>
 *
 * // Loading state
 * <Button loading disabled>Processing...</Button>
 *
 * // Danger action
 * <Button variant="danger">Delete Property</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && 'w-full',
    className
  );

  const iconSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Icon
            icon={Loader2}
            size={iconSize}
            className="animate-spin mr-2"
            decorative
          />
          {children}
        </>
      ) : (
        <>
          {leftIcon && (
            <Icon
              icon={leftIcon}
              size={iconSize}
              className="mr-2"
              decorative
            />
          )}
          {children}
          {rightIcon && (
            <Icon
              icon={rightIcon}
              size={iconSize}
              className="ml-2"
              decorative
            />
          )}
        </>
      )}
    </button>
  );
};

// Button group for related actions
export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md';
}

/**
 * Button Group - Groups related buttons with consistent spacing
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  orientation = 'horizontal',
  spacing = 'sm',
}) => {
  const groupClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    spacing === 'sm' && orientation === 'horizontal' && 'space-x-2',
    spacing === 'md' && orientation === 'horizontal' && 'space-x-4',
    spacing === 'sm' && orientation === 'vertical' && 'space-y-2',
    spacing === 'md' && orientation === 'vertical' && 'space-y-4',
    className
  );

  return <div className={groupClasses}>{children}</div>;
};

// Icon-only button variant
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: LucideIcon;
  'aria-label': string;
}

/**
 * Icon Button - Square button with just an icon
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Button
      {...props}
      size={size}
      className={cn(buttonSizes[size], 'p-0', props.className)}
      aria-label={ariaLabel}
    >
      <Icon
        icon={icon}
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm'}
        decorative
      />
    </Button>
  );
};