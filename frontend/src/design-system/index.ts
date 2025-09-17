/**
 * Design System Index
 * Main export file for the design system
 */

// Core theme and utilities
export { ThemeProvider, useTheme, useThemeToggle } from './ThemeProvider'
export * from './utils'

// Design tokens
export { default as colors } from './tokens/colors.json'
export { default as typography } from './tokens/typography.json'

// Re-export commonly used utilities
export type { ClassValue } from 'clsx'