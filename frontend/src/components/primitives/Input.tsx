import React, { useState } from 'react';
import { cn } from '../../design-system/utils';
import { LucideIcon, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Icon } from './Icon';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Input state
   */
  state?: 'default' | 'error' | 'success';
  /**
   * Input label
   */
  label?: string;
  /**
   * Help text displayed below input
   */
  helpText?: string;
  /**
   * Error message (overrides helpText when state is error)
   */
  error?: string;
  /**
   * Icon to display on the left
   */
  leftIcon?: LucideIcon;
  /**
   * Icon to display on the right
   */
  rightIcon?: LucideIcon;
  /**
   * Full width input
   */
  fullWidth?: boolean;
  /**
   * Optional indicator
   */
  optional?: boolean;
}

// Base input styles
const baseInputStyles = [
  'block w-full',
  'bg-white dark:bg-neutral-900',
  'border border-neutral-300 dark:border-neutral-600',
  'text-neutral-900 dark:text-neutral-100',
  'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
  'rounded-md',
  'transition-colors duration-fast',
  'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:disabled:bg-neutral-800',
].join(' ');

// Size variants
const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-3 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
};

// State variants
const stateStyles = {
  default: '',
  error: 'border-danger focus:border-danger focus:ring-red-500',
  success: 'border-success focus:border-success focus:ring-green-500',
};

// Icon padding adjustments
const iconPadding = {
  sm: {
    left: 'pl-9',
    right: 'pr-9',
  },
  md: {
    left: 'pl-10',
    right: 'pr-10',
  },
  lg: {
    left: 'pl-11',
    right: 'pr-11',
  },
};

/**
 * Livest Design System Input Component
 *
 * Flexible input component with labels, help text, icons, and validation states.
 * Supports all standard HTML input types with design system styling.
 *
 * @example
 * ```tsx
 * import { Input } from '@/components/primitives/Input';
 * import { Search, Mail } from 'lucide-react';
 *
 * // Basic input
 * <Input label="Email" type="email" placeholder="Enter your email" />
 *
 * // With icons
 * <Input leftIcon={Search} placeholder="Search properties..." />
 * <Input leftIcon={Mail} label="Email Address" type="email" />
 *
 * // Error state
 * <Input
 *   label="Password"
 *   type="password"
 *   state="error"
 *   error="Password must be at least 8 characters"
 * />
 *
 * // Optional field
 * <Input label="Company" optional helpText="Optional field" />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  size = 'md',
  state = 'default',
  label,
  helpText,
  error,
  leftIcon,
  rightIcon,
  fullWidth = true,
  optional = false,
  className,
  type = 'text',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Handle password visibility toggle
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const effectiveRightIcon = isPassword ? (showPassword ? EyeOff : Eye) : rightIcon;

  const inputClasses = cn(
    baseInputStyles,
    sizeStyles[size],
    stateStyles[state === 'error' && error ? 'error' : state],
    leftIcon && iconPadding[size].left,
    effectiveRightIcon && iconPadding[size].right,
    !fullWidth && 'w-auto',
    className
  );

  const iconSize = size === 'sm' ? 'sm' : 'sm';
  const iconPositionStyles = {
    sm: 'top-2.5',
    md: 'top-3',
    lg: 'top-3.5',
  };

  const handleRightIconClick = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className={cn('space-y-1', !fullWidth && 'inline-block')}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {optional && (
            <span className="ml-1 text-neutral-500 text-xs">
              (optional)
            </span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className={cn(
            'absolute left-3 pointer-events-none',
            iconPositionStyles[size]
          )}>
            <Icon
              icon={leftIcon}
              size={iconSize}
              variant="muted"
              decorative
            />
          </div>
        )}

        {/* Input element */}
        <input
          id={inputId}
          type={inputType}
          className={inputClasses}
          {...props}
        />

        {/* Right icon */}
        {effectiveRightIcon && (
          <div
            className={cn(
              'absolute right-3',
              iconPositionStyles[size],
              isPassword ? 'cursor-pointer' : 'pointer-events-none'
            )}
            onClick={isPassword ? handleRightIconClick : undefined}
          >
            <Icon
              icon={effectiveRightIcon}
              size={iconSize}
              variant="muted"
              decorative={!isPassword}
              aria-label={isPassword ? (showPassword ? 'Hide password' : 'Show password') : undefined}
            />
          </div>
        )}
      </div>

      {/* Help text or error message */}
      {(helpText || error) && (
        <p className={cn(
          'text-xs',
          state === 'error' && error
            ? 'text-danger'
            : state === 'success'
            ? 'text-success'
            : 'text-neutral-500 dark:text-neutral-400'
        )}>
          {state === 'error' && error ? error : helpText}
        </p>
      )}
    </div>
  );
};

// Textarea variant
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success';
  label?: string;
  helpText?: string;
  error?: string;
  fullWidth?: boolean;
  optional?: boolean;
  resize?: boolean;
}

/**
 * Textarea Component - Multi-line text input
 */
export const Textarea: React.FC<TextareaProps> = ({
  size = 'md',
  state = 'default',
  label,
  helpText,
  error,
  fullWidth = true,
  optional = false,
  resize = true,
  className,
  id,
  rows = 4,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const textareaClasses = cn(
    baseInputStyles,
    sizeStyles[size],
    stateStyles[state === 'error' && error ? 'error' : state],
    !resize && 'resize-none',
    !fullWidth && 'w-auto',
    className
  );

  return (
    <div className={cn('space-y-1', !fullWidth && 'inline-block')}>
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {optional && (
            <span className="ml-1 text-neutral-500 text-xs">
              (optional)
            </span>
          )}
        </label>
      )}

      {/* Textarea element */}
      <textarea
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />

      {/* Help text or error message */}
      {(helpText || error) && (
        <p className={cn(
          'text-xs',
          state === 'error' && error
            ? 'text-danger'
            : state === 'success'
            ? 'text-success'
            : 'text-neutral-500 dark:text-neutral-400'
        )}>
          {state === 'error' && error ? error : helpText}
        </p>
      )}
    </div>
  );
};

// Select wrapper component
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success';
  label?: string;
  helpText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  optional?: boolean;
}

/**
 * Select Component - Dropdown selection input
 */
export const Select: React.FC<SelectProps> = ({
  size = 'md',
  state = 'default',
  label,
  helpText,
  error,
  options,
  placeholder,
  fullWidth = true,
  optional = false,
  className,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectClasses = cn(
    baseInputStyles,
    sizeStyles[size],
    stateStyles[state === 'error' && error ? 'error' : state],
    'pr-10', // Space for dropdown arrow
    !fullWidth && 'w-auto',
    className
  );

  const iconSize = size === 'sm' ? 'sm' : 'sm';
  const iconPositionStyles = {
    sm: 'top-2.5',
    md: 'top-3',
    lg: 'top-3.5',
  };

  return (
    <div className={cn('space-y-1', !fullWidth && 'inline-block')}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {optional && (
            <span className="ml-1 text-neutral-500 text-xs">
              (optional)
            </span>
          )}
        </label>
      )}

      {/* Select wrapper */}
      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className={cn(
          'absolute right-3 pointer-events-none',
          iconPositionStyles[size]
        )}>
          <Icon
            icon={ChevronDown}
            size={iconSize}
            variant="muted"
            decorative
          />
        </div>
      </div>

      {/* Help text or error message */}
      {(helpText || error) && (
        <p className={cn(
          'text-xs',
          state === 'error' && error
            ? 'text-danger'
            : state === 'success'
            ? 'text-success'
            : 'text-neutral-500 dark:text-neutral-400'
        )}>
          {state === 'error' && error ? error : helpText}
        </p>
      )}
    </div>
  );
};