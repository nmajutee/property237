import tokens from './tokens.json';

/**
 * Livest Design System Token Access
 * Provides programmatic access to design tokens with TypeScript support
 */

// Type definitions for better developer experience
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type SpacingScale = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '10' | '12' | '14' | '16' | '20' | '24' | '32' | '40' | '48' | '56' | '64';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type BorderRadius = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
export type BoxShadow = 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

// Design token access functions
export const getColor = {
  brand: (scale: ColorScale) => tokens.color.brand[scale],
  accent: (scale: ColorScale) => tokens.color.accent[scale],
  neutral: (scale: ColorScale) => tokens.color.neutral[scale],
  semantic: {
    success: tokens.color.semantic.success,
    warning: tokens.color.semantic.warning,
    danger: tokens.color.semantic.danger,
    info: tokens.color.semantic.info,
  },
  surface: {
    primary: tokens.color.surface.primary,
    secondary: tokens.color.surface.secondary,
    tertiary: tokens.color.surface.tertiary,
    elevated: tokens.color.surface.elevated,
  },
  text: {
    primary: tokens.color.text.primary,
    secondary: tokens.color.text.secondary,
    tertiary: tokens.color.text.tertiary,
    inverse: tokens.color.text.inverse,
    muted: tokens.color.text.muted,
  },
};

export const getSpacing = (scale: SpacingScale) => tokens.spacing[scale];
export const getFontSize = (size: FontSize) => tokens.typography.fontSize[size];
export const getFontWeight = (weight: FontWeight) => tokens.typography.fontWeight[weight];
export const getBorderRadius = (radius: BorderRadius) => tokens.borderRadius[radius];
export const getBoxShadow = (shadow: BoxShadow) => tokens.boxShadow[shadow];

// Font family access
export const fontFamily = {
  base: tokens.typography.fontFamily.base,
  heading: tokens.typography.fontFamily.heading,
  mono: tokens.typography.fontFamily.mono,
};

// Breakpoint helpers
export const breakpoints = tokens.breakpoints;

// Animation helpers
export const animation = {
  duration: tokens.animation.duration,
  easing: tokens.animation.easing,
};

// Z-index helpers
export const zIndex = tokens.zIndex;

// CSS custom property helpers for runtime theming
export const cssVar = {
  color: {
    brand: (scale: ColorScale) => `var(--color-brand-${scale})`,
    accent: (scale: ColorScale) => `var(--color-accent-${scale})`,
    neutral: (scale: ColorScale) => `var(--color-neutral-${scale})`,
    surface: {
      primary: 'var(--color-surface-primary)',
      secondary: 'var(--color-surface-secondary)',
      tertiary: 'var(--color-surface-tertiary)',
      elevated: 'var(--color-surface-elevated)',
    },
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      inverse: 'var(--color-text-inverse)',
      muted: 'var(--color-text-muted)',
    },
    semantic: {
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
      info: 'var(--color-info)',
    },
  },
  spacing: (scale: SpacingScale) => `var(--spacing-${scale})`,
  fontSize: (size: FontSize) => `var(--font-size-${size})`,
  borderRadius: (radius: BorderRadius) => `var(--radius-${radius})`,
  shadow: (shadow: BoxShadow) => `var(--shadow-${shadow})`,
};

// Theme switching utilities
export const theme = {
  setTheme: (themeName: 'light' | 'dark' | 'high-contrast') => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  },

  getTheme: (): string => {
    return localStorage.getItem('theme') || 'light';
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  },
};

// Responsive design helpers
export const mediaQuery = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
};

// Accessibility helpers
export const a11y = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  focusRingInset: 'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset',
  visuallyHidden: 'sr-only',
  reducedMotion: 'motion-reduce:transition-none motion-reduce:transform-none',
};

// Component size variants (commonly used patterns)
export const componentSizes = {
  button: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  input: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  },
  avatar: {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  },
};

// Export the raw tokens for advanced usage
export { tokens };

const designSystem = {
  getColor,
  getSpacing,
  getFontSize,
  getFontWeight,
  getBorderRadius,
  getBoxShadow,
  fontFamily,
  breakpoints,
  animation,
  zIndex,
  cssVar,
  theme,
  mediaQuery,
  a11y,
  componentSizes,
  tokens,
};

export default designSystem;