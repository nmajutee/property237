/**
 * Design System Utilities
 * Utility functions for working with the design system
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines classes with proper Tailwind CSS precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Color utilities for working with design tokens
 */
export const colors = {
  // Primary brand colors
  primary: {
    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
    100: 'rgb(var(--color-primary-100) / <alpha-value>)',
    200: 'rgb(var(--color-primary-200) / <alpha-value>)',
    300: 'rgb(var(--color-primary-300) / <alpha-value>)',
    400: 'rgb(var(--color-primary-400) / <alpha-value>)',
    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
    600: 'rgb(var(--color-primary-600) / <alpha-value>)',
    700: 'rgb(var(--color-primary-700) / <alpha-value>)',
    800: 'rgb(var(--color-primary-800) / <alpha-value>)',
    900: 'rgb(var(--color-primary-900) / <alpha-value>)',
    950: 'rgb(var(--color-primary-950) / <alpha-value>)',
  },
  secondary: {
    50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
    500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
    900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
  },
  accent: {
    50: 'rgb(var(--color-accent-50) / <alpha-value>)',
    500: 'rgb(var(--color-accent-500) / <alpha-value>)',
    900: 'rgb(var(--color-accent-900) / <alpha-value>)',
  },
} as const

/**
 * Typography utilities
 */
export const typography = {
  fontFamily: {
    sans: 'var(--font-inter)',
    display: 'var(--font-cal-sans)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: ['var(--text-xs)', { lineHeight: 'var(--leading-xs)' }],
    sm: ['var(--text-sm)', { lineHeight: 'var(--leading-sm)' }],
    base: ['var(--text-base)', { lineHeight: 'var(--leading-base)' }],
    lg: ['var(--text-lg)', { lineHeight: 'var(--leading-lg)' }],
    xl: ['var(--text-xl)', { lineHeight: 'var(--leading-xl)' }],
    '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-2xl)' }],
    '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-3xl)' }],
    '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-4xl)' }],
    '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-5xl)' }],
    '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-6xl)' }],
  },
  fontWeight: {
    light: 'var(--font-light)',
    normal: 'var(--font-normal)',
    medium: 'var(--font-medium)',
    semibold: 'var(--font-semibold)',
    bold: 'var(--font-bold)',
    extrabold: 'var(--font-extrabold)',
  },
} as const

/**
 * Spacing utilities
 */
export const spacing = {
  px: 'var(--space-px)',
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
  32: 'var(--space-32)',
} as const

/**
 * Animation utilities
 */
export const animations = {
  duration: {
    fast: 'var(--duration-fast)',
    normal: 'var(--duration-normal)',
    slow: 'var(--duration-slow)',
  },
  easing: {
    ease: 'var(--easing-ease)',
    'ease-in': 'var(--easing-ease-in)',
    'ease-out': 'var(--easing-ease-out)',
    'ease-in-out': 'var(--easing-ease-in-out)',
  },
} as const

/**
 * Responsive utilities
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Component variant utilities
 */
export const variants = {
  size: {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  },
  variant: {
    default: 'default',
    destructive: 'destructive',
    outline: 'outline',
    secondary: 'secondary',
    ghost: 'ghost',
    link: 'link',
  },
} as const

/**
 * Focus ring utility
 */
export const focusRing = cn(
  'outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-primary-500',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-background'
)

/**
 * Disabled state utility
 */
export const disabledState = cn(
  'disabled:pointer-events-none',
  'disabled:opacity-50'
)

/**
 * Surface utilities for cards, modals, etc.
 */
export const surface = {
  card: cn(
    'bg-card',
    'border border-border',
    'rounded-lg',
    'shadow-sm'
  ),
  modal: cn(
    'bg-card',
    'border border-border',
    'rounded-lg',
    'shadow-lg'
  ),
  popover: cn(
    'bg-popover',
    'border border-border',
    'rounded-md',
    'shadow-md'
  ),
} as const

/**
 * Text utilities
 */
export const text = {
  heading: cn('font-cal-sans', 'tracking-tight'),
  body: cn('font-sans'),
  caption: cn('text-sm', 'text-muted-foreground'),
  code: cn('font-mono', 'text-sm'),
} as const

/**
 * Layout utilities
 */
export const layout = {
  container: cn(
    'mx-auto',
    'w-full',
    'max-w-7xl',
    'px-4 sm:px-6 lg:px-8'
  ),
  section: cn('py-12 lg:py-16'),
  grid: cn('grid', 'gap-6'),
  flex: cn('flex', 'items-center', 'gap-4'),
} as const

/**
 * Motion utilities for animations
 */
export const motion = {
  transition: cn('transition-all', 'duration-200', 'ease-in-out'),
  fadeIn: cn('animate-in', 'fade-in-0'),
  slideIn: cn('animate-in', 'slide-in-from-bottom-2'),
  scaleIn: cn('animate-in', 'zoom-in-95'),
  fadeOut: cn('animate-out', 'fade-out-0'),
  slideOut: cn('animate-out', 'slide-out-to-bottom-2'),
  scaleOut: cn('animate-out', 'zoom-out-95'),
} as const